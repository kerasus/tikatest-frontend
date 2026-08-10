<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت آزمون آنلاین جدید</h4>
      </div>
    </div>

    <q-card style="max-width: 900px; margin: 0 auto">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام آزمون *"
                outlined
                :rules="[(val) => !!val || 'نام آزمون الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <form-builder-select-lesson
                v-model:value="form.lesson_id"
                label="درس"
                outlined
                clearable />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.description"
                label="توضیحات"
                outlined
                type="textarea"
                rows="3" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.min_passing_score"
                label="حداقل نمره قبولی"
                outlined
                type="number"
                step="0.01" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.max_score"
                label="حداکثر نمره"
                outlined
                type="number"
                step="0.01" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.exam_category_id"
                :options="categoryOptions"
                option-value="id"
                option-label="title"
                label="دسته‌بندی آزمون *"
                outlined
                clearable
                emit-value
                map-options
                :rules="[(val) => !!val || 'دسته‌بندی الزامی است']" />
            </div>

            <div class="col-12 col-md-6">
              <form-builder-date-time
                v-model:value="form.starts_at"
                label="زمان شروع *"
                outlined
                :rules="[() => !!form.starts_at || 'زمان شروع الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <form-builder-date-time
                v-model:value="form.ends_at"
                label="زمان پایان *"
                outlined
                :rules="[() => !!form.ends_at || 'زمان پایان الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.time_limit_minutes"
                label="زمان محدودیت (دقیقه)"
                outlined
                type="number"
                min="1" />
            </div>
            <div class="col-12 col-md-6">
              <form-builder-date-time
                v-model:value="form.visible_at"
                label="زمان انتشار"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <form-builder-date-time
                v-model:value="form.answers_visible_at"
                label="زمان نمایش پاسخ‌نامه"
                outlined />
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">محتوا</div>
              <exam-content-editor v-model:value="form.content" />
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">پاسخ‌نامه</div>
              <exam-content-editor v-model:value="form.solution" />
            </div>

            <div class="col-12">
              <div class="row items-center q-mb-sm">
                <div class="col">
                  <div class="text-subtitle2">دفترچه‌ها</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    label="افزودن دفترچه"
                    size="sm"
                    @click="addBooklet" />
                </div>
              </div>
              <q-list
                v-if="form.booklets?.length"
                bordered
                separator>
                <q-item
                  v-for="(booklet, index) in form.booklets"
                  :key="index"
                  class="q-py-sm">
                  <q-item-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-md-6">
                        <form-builder-select-lesson
                          v-model:value="booklet.lesson_id"
                          label="درس"
                          outlined
                          dense
                          clearable />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="booklet.title"
                          label="عنوان *"
                          outlined
                          dense
                          :rules="[(val) => !!val || 'عنوان الزامی است']" />
                      </div>
                      <div class="col-6">
                        <q-input
                          v-model="booklet.from_question"
                          label="از سوال"
                          outlined
                          dense
                          type="number"
                          min="1" />
                      </div>
                      <div class="col-6">
                        <q-input
                          v-model="booklet.to_question"
                          label="تا سوال"
                          outlined
                          dense
                          type="number"
                          min="1" />
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click="removeBooklet(index)" />
                  </q-item-section>
                </q-item>
              </q-list>
              <div
                v-else
                class="text-center q-pa-md text-grey">دفترچه‌ای ثبت نشده است.</div>
            </div>

            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">کلیدهای پاسخ</div>
              <exam-answer-key-editor v-model:value="form.answer_keys" />
            </div>

            <div class="col-12">
              <form-builder-select-school-class
                v-model:value="form.class_ids"
                label="کلاس‌ها"
                outlined
                clearable
                multiple
                use-chips />
            </div>
            <div class="col-12">
              <form-builder-select-academic-level
                v-model:value="form.academic_level_ids"
                label="پایه‌ها"
                outlined
                clearable
                multiple
                use-chips />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت آزمون"
              :loading="saving"
              class="q-ml-sm" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Exam.List' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam, ExamType } from 'src/repositories/exam'
import { examCategory } from 'src/repositories/examCategory'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import ExamContentEditor from 'src/components/exam/ExamContentEditor.vue'
import ExamAnswerKeyEditor from 'src/components/exam/ExamAnswerKeyEditor.vue'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const categoryOptions = ref<any[]>([])

const form = reactive({
  name: null as string | null,
  description: null as string | null,
  lesson_id: null as number | null,
  min_passing_score: null as number | null,
  max_score: null as number | null,
  delivery_mode: 'online' as 'online' | 'in_person',
  exam_category_id: null as number | null,
  starts_at: null as string | null,
  ends_at: null as string | null,
  time_limit_minutes: null as number | null,
  visible_at: null as string | null,
  answers_visible_at: null as string | null,
  content: null as { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null,
  solution: null as { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null,
  class_ids: [] as number[],
  academic_level_ids: [] as number[],
  booklets: [] as any[],
  answer_keys: [] as any[]
})

const loadCategories = async () => {
  try {
    const response = await examCategory.index({ length: 100 })
    categoryOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading categories:', error)
  }
}

function addBooklet () {
  form.booklets.push({
    lesson_id: null,
    title: '',
    from_question: null,
    to_question: null,
    booklet_scores: null
  })
}

function removeBooklet (index: number) {
  form.booklets.splice(index, 1)
}

function buildFormData (): FormData {
  const fd = new FormData()

  fd.append('name', form.name || '')
  fd.append('description', form.description || '')
  fd.append('lesson_id', String(form.lesson_id ?? ''))
  fd.append('min_passing_score', String(form.min_passing_score ?? ''))
  fd.append('max_score', String(form.max_score ?? ''))
  fd.append('exam_category_id', String(form.exam_category_id ?? ''))
  fd.append('starts_at', form.starts_at || '')
  fd.append('ends_at', form.ends_at || '')
  fd.append('time_limit_minutes', String(form.time_limit_minutes ?? ''))
  fd.append('visible_at', form.visible_at || '')
  fd.append('answers_visible_at', form.answers_visible_at || '')
  fd.append('class_ids', JSON.stringify(form.class_ids || []))
  fd.append('academic_level_ids', JSON.stringify(form.academic_level_ids || []))

  if (form.content) {
    const contentMeta = { ...form.content }
    delete contentMeta.file
    fd.append('content', JSON.stringify(contentMeta))
    if (form.content.file) {
      fd.append('content_file', form.content.file)
    }
  }

  if (form.solution) {
    const solutionMeta = { ...form.solution }
    delete solutionMeta.file
    fd.append('solution', JSON.stringify(solutionMeta))
    if (form.solution.file) {
      fd.append('solution_file', form.solution.file)
    }
  }

  if (form.booklets?.length) {
    fd.append('booklets', JSON.stringify(form.booklets))
  }

  if (form.answer_keys?.length) {
    fd.append('answer_keys', JSON.stringify(form.answer_keys))
  }

  return fd
}

const onSubmit = async () => {
  if (!form.content || (typeof form.content === 'object' && !form.content.body && !form.content.file)) {
    $q.notify({
      icon: 'error',
      message: 'محتوای آزمون الزامی است.',
      color: 'negative'
    })
    return
  }
  saving.value = true
  try {
    const formData = buildFormData()

    await exam.storeWithOnlineDetail(formData)

    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Exam.List' })
  } catch (error: any) {
    const message = error?.response?.data?.message || 'خطا در ثبت آزمون.'
    $q.notify({
      icon: 'error',
      message,
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>
