import { reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { ContentType, OnlineExamDetailType, ExamType } from 'src/repositories/exam'
import type { UserType } from 'src/repositories/user'

export interface ExamFormModel {
  id: number | null
  name: string | null
  description: string | null
  lesson_id: number | null
  min_passing_score: number | null
  max_score: number | null
  delivery_mode: 'online' | 'in_person' | null
  exam_category_id: number | null
  created_by: UserType | null
  created_at: string | null
  updated_at: string | null
  online_exam_detail: OnlineExamDetailType | null
  in_person_exam_detail: any | null
  answer_keys: any[]
  class_ids: number[]
  academic_level_ids: number[]
  classes: any[]
  academic_levels: any[]
}

export const useExamForm = (isUpdate = false) => {
  const $q = useQuasar()

  const form = reactive<ExamFormModel>({
    id: null,
    name: null,
    description: null,
    lesson_id: null,
    min_passing_score: null,
    max_score: null,
    delivery_mode: 'in_person',
    exam_category_id: null,
    created_by: null,
    created_at: null,
    updated_at: null,
    online_exam_detail: {
      id: null,
      exam_id: null,
      starts_at: null,
      ends_at: null,
      time_limit_minutes: null,
      visible_at: null,
      answers_visible_at: null,
      content: null,
      solution: null,
      created_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      sessions: [],
      booklets: [],
      createdBy: null
    },
    in_person_exam_detail: null,
    answer_keys: [],
    class_ids: [],
    academic_level_ids: [],
    classes: [],
    academic_levels: []
  })

  function validate (): boolean {
    if (!form.name || !String(form.name).trim()) {
      $q.notify({ icon: 'warning', message: 'نام آزمون الزامی است.', color: 'warning' })
      return false
    }

    if (!form.exam_category_id) {
      $q.notify({ icon: 'warning', message: 'دسته‌بندی آزمون الزامی است.', color: 'warning' })
      return false
    }

    if (!form.delivery_mode || !['online', 'in_person'].includes(form.delivery_mode)) {
      $q.notify({ icon: 'warning', message: 'نوع تحویل آزمون الزامی است.', color: 'warning' })
      return false
    }

    if (form.delivery_mode === 'online') {
      if (!form.online_exam_detail?.starts_at) {
        $q.notify({ icon: 'warning', message: 'زمان شروع آزمون الزامی است.', color: 'warning' })
        return false
      }

      if (!form.online_exam_detail?.ends_at) {
        $q.notify({ icon: 'warning', message: 'زمان پایان آزمون الزامی است.', color: 'warning' })
        return false
      }

      if (form.online_exam_detail.starts_at && form.online_exam_detail.ends_at) {
        if (new Date(form.online_exam_detail.ends_at) <= new Date(form.online_exam_detail.starts_at)) {
          $q.notify({ icon: 'warning', message: 'زمان پایان باید بعد از زمان شروع باشد.', color: 'warning' })
          return false
        }
      }
    }

    if (form.min_passing_score !== null && form.min_passing_score < 0) {
      $q.notify({ icon: 'warning', message: 'نمره گذرا نمی‌تواند منفی باشد.', color: 'warning' })
      return false
    }

    if (form.max_score !== null && form.max_score < 0) {
      $q.notify({ icon: 'warning', message: 'حداکثر نمره نمی‌تواند منفی باشد.', color: 'warning' })
      return false
    }

    return true
  }

  function buildFormData (): FormData {
    const fd = new FormData()

    fd.append('name', form.name || '')
    fd.append('description', form.description || '')
    fd.append('lesson_id', String(form.lesson_id ?? ''))
    fd.append('min_passing_score', String(form.min_passing_score ?? ''))
    fd.append('max_score', String(form.max_score ?? ''))
    fd.append('exam_category_id', String(form.exam_category_id ?? ''))
    fd.append('delivery_mode', form.delivery_mode || 'in_person')

    if (form.delivery_mode === 'online' && form.online_exam_detail) {
      fd.append('starts_at', form.online_exam_detail.starts_at || '')
      fd.append('ends_at', form.online_exam_detail.ends_at || '')
      fd.append('time_limit_minutes', String(form.online_exam_detail.time_limit_minutes ?? ''))
      fd.append('visible_at', form.online_exam_detail.visible_at || '')
      fd.append('answers_visible_at', form.online_exam_detail.answers_visible_at || '')

      if (form.online_exam_detail.content) {
        const contentMeta = { ...form.online_exam_detail.content }
        delete contentMeta.file
        fd.append('content', JSON.stringify(contentMeta))
        if (form.online_exam_detail.content.file) {
          fd.append('content_file', form.online_exam_detail.content.file)
        }
      }

      if (form.online_exam_detail.solution) {
        const solutionMeta = { ...form.online_exam_detail.solution }
        delete solutionMeta.file
        fd.append('solution', JSON.stringify(solutionMeta))
        if (form.online_exam_detail.solution.file) {
          fd.append('solution_file', form.online_exam_detail.solution.file)
        }
      }

      if (form.online_exam_detail.booklets?.length) {
        fd.append('booklets', JSON.stringify(form.online_exam_detail.booklets))
      }
    }

    if (form.delivery_mode === 'in_person' && form.in_person_exam_detail) {
      fd.append('held_at', form.in_person_exam_detail.held_at || '')
      fd.append('is_descriptive', String(form.in_person_exam_detail.is_descriptive ?? false))
    }

    if (form.answer_keys?.length) {
      fd.append('answer_keys', JSON.stringify(form.answer_keys))
    }

    fd.append('class_ids', JSON.stringify(form.class_ids || []))
    fd.append('academic_level_ids', JSON.stringify(form.academic_level_ids || []))

    return fd
  }

  function resetForm () {
    form.id = null
    form.name = null
    form.description = null
    form.lesson_id = null
    form.min_passing_score = null
    form.max_score = null
    form.delivery_mode = 'in_person'
    form.exam_category_id = null
    form.created_by = null
    form.created_at = null
    form.updated_at = null
    form.online_exam_detail = {
      id: null,
      exam_id: null,
      starts_at: null,
      ends_at: null,
      time_limit_minutes: null,
      visible_at: null,
      answers_visible_at: null,
      content: null,
      solution: null,
      created_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      sessions: [],
      booklets: [],
      createdBy: null
    }
    form.in_person_exam_detail = null
    form.answer_keys = []
    form.class_ids = []
    form.academic_level_ids = []
    form.classes = []
    form.academic_levels = []
  }

  function loadFromExam (exam: ExamType) {
    form.id = exam.id
    form.name = exam.name
    form.description = exam.description
    form.lesson_id = exam.lesson_id
    form.min_passing_score = exam.min_passing_score
    form.max_score = exam.max_score
    form.delivery_mode = exam.delivery_mode
    form.exam_category_id = exam.exam_category_id
    form.created_by = exam.created_by ?? null
    form.created_at = exam.created_at
    form.updated_at = exam.updated_at
    form.classes = exam.classes || []
    form.academic_levels = exam.academic_levels || []
    form.class_ids = (exam.classes || []).map((c: any) => c.id)
    form.academic_level_ids = (exam.academic_levels || []).map((l: any) => l.id)

    if (exam.online_exam_detail) {
      form.online_exam_detail = {
        ...exam.online_exam_detail,
        content: exam.online_exam_detail.content || null,
        solution: exam.online_exam_detail.solution || null,
        booklets: exam.online_exam_detail.booklets || []
      }
    }

    if (exam.in_person_exam_detail) {
      form.in_person_exam_detail = { ...exam.in_person_exam_detail }
    }

    form.answer_keys = exam.answer_keys || []
  }

  return {
    form,
    validate,
    buildFormData,
    resetForm,
    loadFromExam
  }
}
