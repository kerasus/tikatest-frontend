<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت آزمون آنلاین جدید</h4>
      </div>
    </div>

    <q-form @submit.prevent="onSubmit">
      <exam-detail-card
        :exam="form"
        :editable="true"
        :lesson-options="lessonOptions"
        :category-options="categoryOptions" />

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
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'
import { examCategory } from 'src/repositories/examCategory'
import LessonAPI from 'src/repositories/lesson'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'

const router = useRouter()
const $q = useQuasar()
const lessonApi = new LessonAPI()

const saving = ref(false)

const categoryOptions = ref<any[]>([])
const lessonOptions = ref<any[]>([])

const form = reactive({
  id: null as number | null,
  name: null as string | null,
  description: null as string | null,
  lesson_id: null as number | null,
  min_passing_score: null as number | null,
  max_score: null as number | null,
  delivery_mode: 'online' as 'online' | 'in_person',
  exam_category_id: null as number | null,
  created_by: null,
  created_at: null as string | null,
  updated_at: null as string | null,
  online_exam_detail: {
    id: null as number | null,
    exam_id: null as number | null,
    starts_at: null as string | null,
    ends_at: null as string | null,
    time_limit_minutes: null as number | null,
    visible_at: null as string | null,
    answers_visible_at: null as string | null,
    content: null as { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null,
    solution: null as { type: 'text' | 'image'; body?: string; path?: string; file?: File } | null,
    created_by: null as number | null,
    created_at: null as string | null,
    updated_at: null as string | null,
    deleted_at: null as string | null,
    booklets: [] as any[]
  },
  answer_keys: [] as any[],
  class_ids: [] as number[],
  academic_level_ids: [] as number[],
  classes: [] as any[],
  academic_levels: [] as any[]
})

const loadCategories = async () => {
  try {
    const response = await examCategory.index({ length: 100 })
    categoryOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading categories:', error)
  }
}

const loadLessons = async () => {
  try {
    const response = await lessonApi.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

function buildFormData (): FormData {
  const fd = new FormData()

  fd.append('name', form.name || '')
  fd.append('description', form.description || '')
  fd.append('lesson_id', String(form.lesson_id ?? ''))
  fd.append('min_passing_score', String(form.min_passing_score ?? ''))
  fd.append('max_score', String(form.max_score ?? ''))
  fd.append('exam_category_id', String(form.exam_category_id ?? ''))
  fd.append('starts_at', form.online_exam_detail?.starts_at || '')
  fd.append('ends_at', form.online_exam_detail?.ends_at || '')
  fd.append('time_limit_minutes', String(form.online_exam_detail?.time_limit_minutes ?? ''))
  fd.append('visible_at', form.online_exam_detail?.visible_at || '')
  fd.append('answers_visible_at', form.online_exam_detail?.answers_visible_at || '')
  fd.append('class_ids', JSON.stringify(form.class_ids || []))
  fd.append('academic_level_ids', JSON.stringify(form.academic_level_ids || []))

  if (form.online_exam_detail?.content) {
    const contentMeta = { ...form.online_exam_detail.content }
    delete contentMeta.file
    fd.append('content', JSON.stringify(contentMeta))
    if (form.online_exam_detail.content.file) {
      fd.append('content_file', form.online_exam_detail.content.file)
    }
  }

  if (form.online_exam_detail?.solution) {
    const solutionMeta = { ...form.online_exam_detail.solution }
    delete solutionMeta.file
    fd.append('solution', JSON.stringify(solutionMeta))
    if (form.online_exam_detail.solution.file) {
      fd.append('solution_file', form.online_exam_detail.solution.file)
    }
  }

  if (form.online_exam_detail?.booklets?.length) {
    fd.append('booklets', JSON.stringify(form.online_exam_detail.booklets))
  }

  if (form.answer_keys?.length) {
    fd.append('answer_keys', JSON.stringify(form.answer_keys))
  }

  return fd
}

const onSubmit = async () => {
  const content = form.online_exam_detail?.content
  if (!content || (typeof content === 'object' && !content.body && !content.file)) {
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

onMounted(async () => {
  await loadCategories()
  await loadLessons()
})
</script>
