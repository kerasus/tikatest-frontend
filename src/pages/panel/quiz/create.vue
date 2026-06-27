<template>
  <div class="quiz-form-page">
    <q-card v-if="loading" class="q-pa-lg text-center">
      <q-spinner color="primary" size="80px" />
      <div class="q-mt-md">در حال بارگذاری...</div>
    </q-card>

    <q-card v-else>
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'ویرایش آزمون' : 'ایجاد آزمون آنلاین' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.name"
                label="نام آزمون *"
                outlined
                :rules="[value => !!value || 'نام آزمون الزامی است']" />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model.number="form.time_limit"
                label="مدت زمان (دقیقه) *"
                outlined
                type="number"
                min="1"
                :rules="[value => !!value || 'مدت زمان الزامی است']" />
            </div>

            <div class="col-12 col-md-4">
              <FormBuilderDateTime
                v-model:value="form.starts_at"
                label="تاریخ شروع"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <FormBuilderDateTime
                v-model:value="form.ends_at"
                label="تاریخ پایان"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <FormBuilderDateTime
                v-model:value="form.show_answer_date"
                label="تاریخ نمایش پاسخ"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="form.quiz_type"
                :options="quizTypeOptions"
                label="نوع آزمون"
                outlined
                emit-value
                map-options
                clearable />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="form.is_visible"
                :options="visibilityOptions"
                label="وضعیت نمایش"
                outlined
                emit-value
                map-options />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.description"
                label="توضیحات"
                outlined
                type="textarea" />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.no_score_questions"
                label="سوالات بدون نمره"
                outlined
                hint="مثال: 1,4,8 یا توضیح متنی"
                type="textarea" />
            </div>

            <div class="col-12">
              <q-card bordered flat>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div>
                      <div class="text-subtitle1">سؤالات</div>
                      <div class="text-caption text-grey-7">برای تصویر، مسیر فایل آپلودشده را وارد کنید.</div>
                    </div>
                    <q-btn
                      color="primary"
                      icon="add"
                      label="افزودن سؤال"
                      @click="addBlock('content')" />
                  </div>

                  <div
                    v-if="form.content.length === 0"
                    class="text-grey-7 text-center q-pa-md">
                    هنوز سؤالی اضافه نشده است.
                  </div>

                  <q-card
                    v-for="(item, index) in form.content"
                    :key="`content-${index}`"
                    bordered
                    flat
                    class="q-mb-md">
                    <q-card-section>
                      <div class="row q-col-gutter-md items-start">
                        <div class="col-12 col-md-3">
                          <q-select
                            v-model="item.type"
                            :options="contentTypeOptions"
                            label="نوع محتوا"
                            outlined
                            dense
                            emit-value
                            map-options />
                        </div>
                        <div class="col-12 col-md-8">
                          <q-input
                            v-if="item.type === 'text'"
                            v-model="item.body"
                            label="متن سؤال"
                            outlined
                            type="textarea"
                            autogrow />
                          <q-input
                            v-else
                            v-model="item.path"
                            label="مسیر تصویر"
                            outlined
                            placeholder="/uploads/exams/quiz1.png" />
                        </div>
                        <div class="col-12 col-md-1 text-right">
                          <q-btn
                            flat
                            round
                            color="negative"
                            icon="delete"
                            @click="removeBlock('content', index)" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12">
              <q-card bordered flat>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div>
                      <div class="text-subtitle1">پاسخ تشریحی / راه‌حل</div>
                      <div class="text-caption text-grey-7">فرمت ذخیره‌سازی مانند سوالات است: متن یا تصویر.</div>
                    </div>
                    <q-btn
                      color="secondary"
                      icon="add"
                      label="افزودن پاسخ"
                      @click="addBlock('solution')" />
                  </div>

                  <div
                    v-if="form.solution.length === 0"
                    class="text-grey-7 text-center q-pa-md">
                    هنوز پاسخی اضافه نشده است.
                  </div>

                  <q-card
                    v-for="(item, index) in form.solution"
                    :key="`solution-${index}`"
                    bordered
                    flat
                    class="q-mb-md">
                    <q-card-section>
                      <div class="row q-col-gutter-md items-start">
                        <div class="col-12 col-md-3">
                          <q-select
                            v-model="item.type"
                            :options="contentTypeOptions"
                            label="نوع محتوا"
                            outlined
                            dense
                            emit-value
                            map-options />
                        </div>
                        <div class="col-12 col-md-8">
                          <q-input
                            v-if="item.type === 'text'"
                            v-model="item.body"
                            label="متن پاسخ"
                            outlined
                            type="textarea"
                            autogrow />
                          <q-input
                            v-else
                            v-model="item.path"
                            label="مسیر تصویر پاسخ"
                            outlined
                            placeholder="/uploads/exams/quiz1-solution.png" />
                        </div>
                        <div class="col-12 col-md-1 text-right">
                          <q-btn
                            flat
                            round
                            color="negative"
                            icon="delete"
                            @click="removeBlock('solution', index)" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              :label="isEdit ? 'به‌روزرسانی' : 'ایجاد آزمون'"
              :loading="saving || loading" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Quiz.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { quiz } from 'src/repositories/quiz'
import type { QuizContentType } from 'src/repositories/quiz'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'

type QuizContentField = QuizContentType & {
  body?: string
  path?: string
}

type QuizBlockKey = 'content' | 'solution'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const saving = ref(false)
const loading = ref(false)

const quizId = route.params.id ? parseInt(route.params.id as string) : null
const isEdit = !!quizId

const form = reactive({
  name: null as string | null,
  time_limit: null as number | null,
  starts_at: null as string | null,
  ends_at: null as string | null,
  description: null as string | null,
  is_visible: true,
  quiz_type: null as string | null,
  content: [] as QuizContentField[],
  solution: [] as QuizContentField[],
  show_answer_date: null as string | null,
  no_score_questions: null as string | null
})

const quizTypeOptions = [
  { label: 'آزمون متنی', value: 'text' },
  { label: 'آزمون تصویری', value: 'image' },
  { label: 'آزمون آنلاین', value: 'online' }
]

const visibilityOptions = [
  { label: 'فعال', value: true },
  { label: 'غیرفعال', value: false }
]

const contentTypeOptions = [
  { label: 'متن', value: 'text' },
  { label: 'تصویر', value: 'image' }
]

function addBlock (key: QuizBlockKey) {
  form[key].push({
    type: 'text',
    body: '',
    path: ''
  })
}

function removeBlock (key: QuizBlockKey, index: number) {
  form[key].splice(index, 1)
}

function normalizeBlocks (items: QuizContentField[]): QuizContentType[] | null {
  const normalizedItems = items
    .map((item) => {
      if (item.type === 'image') {
        return item.path?.trim()
          ? { type: 'image' as const, path: item.path.trim() }
          : null
      }

      return item.body?.trim()
        ? { type: 'text' as const, body: item.body.trim() }
        : null
    })
    .filter((item): item is QuizContentType => item !== null)

  return normalizedItems.length > 0 ? normalizedItems : null
}

function buildPayload () {
  return {
    name: form.name,
    time_limit: form.time_limit,
    starts_at: form.starts_at,
    ends_at: form.ends_at,
    description: form.description,
    is_visible: form.is_visible,
    quiz_type: form.quiz_type,
    content: normalizeBlocks(form.content),
    solution: normalizeBlocks(form.solution),
    show_answer_date: form.show_answer_date,
    no_score_questions: form.no_score_questions
  }
}

const loadQuiz = async () => {
  if (!quizId) return
  loading.value = true
  try {
    const response = await quiz.get(quizId)
    form.name = response.name
    form.time_limit = response.time_limit
    form.starts_at = response.starts_at
    form.ends_at = response.ends_at
    form.description = response.description
    form.is_visible = response.is_visible
    form.quiz_type = response.quiz_type
    form.content = response.content || []
    form.solution = response.solution || []
    form.show_answer_date = response.show_answer_date
    form.no_score_questions = response.no_score_questions
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات آزمون',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit () {
  saving.value = true

  try {
    if (isEdit && quizId) {
      await quiz.update(quizId, buildPayload() as any)
      $q.notify({
        icon: 'check',
        message: 'آزمون با موفقیت بروزرسانی شد.',
        color: 'positive'
      })
    } else {
      await quiz.create(buildPayload() as any)
      $q.notify({
        icon: 'check',
        message: 'آزمون با موفقیت ایجاد شد.',
        color: 'positive'
      })
    }
    router.push({ name: 'Panel.Quiz.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ذخیره آزمون.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadQuiz()
})
</script>

<style lang="scss" scoped>
.quiz-form-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
