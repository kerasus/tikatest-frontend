<template>
  <div class="quiz-form-page">
    <q-card
      v-if="loading"
      class="q-pa-lg text-center">
      <q-spinner
        color="primary"
        size="80px" />
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
              <q-select
                v-model="form.school_id"
                :options="schoolOptions"
                option-value="id"
                option-label="name"
                label="مدرسه"
                outlined
                emit-value
                map-options
                clearable />
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
              <form-builder-date-time
                v-model:value="form.visible_at"
                label="تاریخ نمایش آزمون"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <form-builder-date-time
                v-model:value="form.starts_at"
                label="تاریخ شروع"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <form-builder-date-time
                v-model:value="form.ends_at"
                label="تاریخ پایان"
                outlined />
            </div>

            <div class="col-12 col-md-4">
              <form-builder-date-time
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
              <q-card
                bordered
                flat>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div>
                      <div class="text-subtitle1">دفترچه‌های آزمون</div>
                      <div class="text-caption text-grey-7">
                        هر دفترچه شامل بازه‌ای از شماره سوالات است. درصد هر دفترچه جداگانه محاسبه می‌شود.
                      </div>
                    </div>
                    <q-btn
                      color="primary"
                      icon="add"
                      label="افزودن دفترچه"
                      @click="addBooklet" />
                  </div>

                  <div
                    v-if="form.booklets.length === 0"
                    class="text-grey-7 text-center q-pa-md">
                    آزمون فاقد دفترچه است (تمام سوالات در یک کارنامه محاسبه می‌شوند).
                  </div>

                  <q-card
                    v-for="(booklet, index) in form.booklets"
                    :key="`booklet-${index}`"
                    bordered
                    flat
                    class="q-mb-md">
                    <q-card-section>
                      <div class="row q-col-gutter-md items-end">
                        <div class="col-12 col-md-6">
                          <q-input
                            v-model="booklet.title"
                            label="عنوان دفترچه *"
                            outlined
                            :rules="[value => !!value || 'عنوان الزامی است']" />
                        </div>
                        <div class="col-12 col-md-3">
                          <q-input
                            v-model.number="booklet.from_question"
                            label="از سوال *"
                            outlined
                            type="number"
                            min="1"
                            :rules="[value => !!value || 'الزامی است']" />
                        </div>
                        <div class="col-12 col-md-3">
                          <q-input
                            v-model.number="booklet.to_question"
                            label="تا سوال *"
                            outlined
                            type="number"
                            min="1"
                            :rules="[value => !!value || 'الزامی است']" />
                        </div>
                        <div class="col-12 col-md-12 text-right">
                          <q-btn
                            flat
                            round
                            color="negative"
                            icon="delete"
                            @click="removeBooklet(index)" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12">
              <q-card
                bordered
                flat>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div>
                      <div class="text-subtitle1">نوع سؤالات</div>
                      <div class="text-caption text-grey-7">تمام سوالات این آزمون باید از یک نوع باشند.</div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-md items-center">
                    <div class="col-12 col-md-4">
                      <q-select
                        v-model="form.question_type"
                        :options="questionTypeOptions"
                        label="نوع سؤالات"
                        outlined
                        emit-value
                        map-options
                        clearable />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div
              v-if="form.question_type === 'text'"
              class="col-12">
              <q-card
                bordered
                flat>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-md">سؤالات (متنی)</div>
                  <q-input
                    v-model="form.questions_text"
                    label="متن سؤالات"
                    outlined
                    type="textarea"
                    autogrow
                    :rules="[value => !!value || 'متن سؤالات الزامی است']" />
                </q-card-section>
              </q-card>
            </div>

            <div
              v-if="form.question_type === 'image'"
              class="col-12">
              <q-card
                bordered
                flat>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-md">فایل‌های تصویری سؤالات</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12">
                      <input
                        ref="questionFileInput"
                        type="file"
                        accept="image/*"
                        multiple
                        @change="onQuestionFilesSelected">
                    </div>
                    <div
                      v-if="form.questions_images.length > 0"
                      class="col-12">
                      <div class="text-caption text-grey-7 q-mb-sm">
                        {{ form.questions_images.length }} فایل انتخاب شده
                      </div>
                      <div class="row q-col-gutter-sm">
                        <div
                          v-for="(file, index) in form.questions_images"
                          :key="index"
                          class="col-12 col-md-3">
                          <q-card
                            flat
                            bordered>
                            <q-card-section class="q-pa-sm">
                              <div class="text-caption">{{ file.name }}</div>
                              <div class="text-caption text-grey-7">{{ formatFileSize(file.size) }}</div>
                            </q-card-section>
                            <q-card-actions align="right">
                              <q-btn
                                flat
                                round
                                dense
                                color="negative"
                                icon="delete"
                                @click="removeQuestionFile(index)" />
                            </q-card-actions>
                          </q-card>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12">
              <q-card
                bordered
                flat>
                <q-card-section>
                  <div class="row items-center justify-between q-mb-md">
                    <div>
                      <div class="text-subtitle1">پاسخ تشریحی / راه‌حل</div>
                      <div class="text-caption text-grey-7">نوع محتوای پاسخ را انتخاب و داده‌های آن را وارد کنید.</div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-md items-center">
                    <div class="col-12 col-md-4">
                      <q-select
                        v-model="form.solution_type"
                        :options="contentTypeOptions"
                        label="نوع پاسخ"
                        outlined
                        emit-value
                        map-options
                        clearable />
                    </div>
                  </div>

                  <div
                    v-if="form.solution_type === 'text'"
                    class="row q-col-gutter-md q-mt-md">
                    <div class="col-12">
                      <q-input
                        v-model="form.solution_text"
                        label="متن پاسخ"
                        outlined
                        type="textarea"
                        autogrow />
                    </div>
                  </div>

                  <div
                    v-if="form.solution_type === 'image'"
                    class="row q-col-gutter-md q-mt-md">
                    <div class="col-12">
                      <input
                        ref="solutionFileInput"
                        type="file"
                        accept="image/*"
                        @change="onSolutionFileSelected">
                      <div
                        v-if="form.solution_image"
                        class="q-mt-sm text-caption">
                        فایل انتخاب شده: {{ form.solution_image.name }} ({{ formatFileSize(form.solution_image.size) }})
                      </div>
                    </div>
                  </div>
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
import { quizBooklet } from 'src/repositories/quizBooklet'
import SchoolAPI from 'src/repositories/school'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'

const schoolApi = new SchoolAPI()

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const saving = ref(false)
const loading = ref(false)

const quizId = route.params.id ? parseInt(route.params.id as string) : null
const isEdit = !!quizId

const form = reactive({
  name: null as string | null,
  school_id: null as number | null,
  time_limit: null as number | null,
  starts_at: null as string | null,
  ends_at: null as string | null,
  description: null as string | null,
  visible_at: null as string | null,
  quiz_type: null as string | null,
  question_type: null as 'text' | 'image' | null,
  questions_text: null as string | null,
  questions_images: [] as File[],
  solution_type: null as 'text' | 'image' | null,
  solution_text: null as string | null,
  solution_image: null as File | null,
  show_answer_date: null as string | null,
  no_score_questions: null as string | null,
  booklets: [] as any[]
})

const schoolOptions = ref<any[]>([])

const quizTypeOptions = [
  { label: 'آزمون متنی', value: 'text' },
  { label: 'آزمون تصویری', value: 'image' },
  { label: 'آزمون آنلاین', value: 'online' }
]

const questionTypeOptions = [
  { label: 'متن', value: 'text' },
  { label: 'تصویر', value: 'image' }
]

const contentTypeOptions = [
  { label: 'متن', value: 'text' },
  { label: 'تصویر', value: 'image' }
]

const questionFileInput = ref<HTMLInputElement | null>(null)
const solutionFileInput = ref<HTMLInputElement | null>(null)

function formatFileSize (bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function onQuestionFilesSelected (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    form.questions_images = Array.from(target.files)
  }
}

function removeQuestionFile (index: number) {
  form.questions_images.splice(index, 1)
  if (questionFileInput.value) {
    questionFileInput.value.value = ''
  }
}

function onSolutionFileSelected (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.solution_image = target.files[0]
  }
}

function addBooklet () {
  form.booklets.push({
    id: null,
    title: '',
    from_question: null,
    to_question: null
  })
}

function removeBooklet (index: number) {
  form.booklets.splice(index, 1)
}

function normalizeBooklets () {
  return form.booklets
    .filter((booklet) => booklet.title && booklet.from_question && booklet.to_question)
    .map((booklet) => ({
      id: booklet.id || undefined,
      title: booklet.title,
      from_question: Number(booklet.from_question),
      to_question: Number(booklet.to_question)
    }))
}

function buildContentPayload (): any[] | null {
  if (form.question_type === 'text' && form.questions_text?.trim()) {
    return [{
      type: 'text' as const,
      body: form.questions_text.trim()
    }]
  }

  if (form.question_type === 'image' && form.questions_images.length > 0) {
    return form.questions_images.map((file) => ({
      type: 'image' as const,
      body: file
    }))
  }

  return null
}

function buildSolutionPayload (): any[] | null {
  if (form.solution_type === 'text' && form.solution_text?.trim()) {
    return [{
      type: 'text' as const,
      body: form.solution_text.trim()
    }]
  }

  if (form.solution_type === 'image' && form.solution_image) {
    return [{
      type: 'image' as const,
      body: form.solution_image
    }]
  }

  return null
}

function buildFormData (): FormData {
  const fd = new FormData()

  fd.append('name', form.name || '')
  fd.append('time_limit', String(form.time_limit || ''))
  fd.append('starts_at', form.starts_at || '')
  fd.append('ends_at', form.ends_at || '')
  fd.append('description', form.description || '')
  fd.append('visible_at', form.visible_at || '')
  fd.append('quiz_type', form.quiz_type || '')
  fd.append('show_answer_date', form.show_answer_date || '')
  fd.append('no_score_questions', form.no_score_questions || '')
  if (form.school_id) {
    fd.append('school_id', String(form.school_id))
  }

  if (form.question_type) {
    fd.append('question_type', form.question_type)
  }

  if (form.question_type === 'text' && form.questions_text) {
    fd.append('questions_text', form.questions_text)
  }

  if (form.question_type === 'image') {
    form.questions_images.forEach((file) => {
      fd.append('questions_images[]', file)
    })
  }

  if (form.solution_type) {
    fd.append('solution_type', form.solution_type)
  }

  if (form.solution_type === 'text' && form.solution_text) {
    fd.append('solution_text', form.solution_text)
  }

  if (form.solution_type === 'image' && form.solution_image) {
    fd.append('solution_image', form.solution_image)
  }

  if (form.booklets.length > 0) {
    fd.append('booklets', JSON.stringify(normalizeBooklets()))
  }

  return fd
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
    form.visible_at = response.visible_at
    form.quiz_type = response.quiz_type
    form.show_answer_date = response.show_answer_date
    form.no_score_questions = response.no_score_questions

    if (response.content && response.content.length > 0) {
      const firstContent = response.content[0]
      if (firstContent.type === 'text') {
        form.question_type = 'text'
        form.questions_text = firstContent.body || null
      } else if (firstContent.type === 'image') {
        form.question_type = 'image'
      }
    }

    if (response.solution && response.solution.length > 0) {
      const firstSolution = response.solution[0]
      if (firstSolution.type === 'text') {
        form.solution_type = 'text'
        form.solution_text = firstSolution.body || null
      } else if (firstSolution.type === 'image') {
        form.solution_type = 'image'
      }
    }

    form.booklets = (response.booklets || []).map((booklet: any) => ({
      id: booklet.id,
      title: booklet.title,
      from_question: booklet.from_question,
      to_question: booklet.to_question
    }))
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

async function loadSchools () {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error: any) {
    console.error('Error loading schools:', error)
  }
}

async function onSubmit () {
  saving.value = true

  try {
    const booklets = normalizeBooklets()
    const formData = buildFormData()

    if (isEdit && quizId) {
      await quiz.update(quizId, formData)
      await quizBooklet.sync(quizId, booklets)
      $q.notify({
        icon: 'check',
        message: 'آزمون با موفقیت بروزرسانی شد.',
        color: 'positive'
      })
    } else {
      const created = await quiz.create(formData)
      const newQuizId = typeof created === 'object' && created !== null ? (created as any).id : created
      if (newQuizId) {
        await quizBooklet.sync(newQuizId, booklets)
      }
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

onMounted(async () => {
  await loadSchools()
  loadQuiz()
})
</script>

<style lang="scss" scoped>
.quiz-form-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
