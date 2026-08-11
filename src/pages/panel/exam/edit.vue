<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">{{ isResultMode ? 'ویرایش نمره دانش‌آموز' : 'ویرایش آزمون' }}</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Exam.Show', params: { id: examId } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="!isResultMode && examItem">
      <exam-detail-card
        :exam="examItem"
        :editable="true"
        :lesson-options="lessonOptions"
        :category-options="categoryOptions" />

      <div class="row q-mt-md">
        <div class="col-12">
          <q-btn
            color="primary"
            label="ذخیره تغییرات"
            :loading="saving"
            @click="onSubmitExam" />
        </div>
      </div>
    </template>

    <template v-else-if="resultItem">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="onSubmitResult">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="text-subtitle2">دانش‌آموز:</div>
                <div class="text-body1">{{ resultItem.student?.full_name || '-' }}</div>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="resultForm.raw_score"
                  label="نمره خام *"
                  outlined
                  type="number"
                  step="0.01"
                  :rules="[(v) => v !== null && v !== '' || 'نمره الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="resultForm.scaled_score"
                  label="نمره محاسبه شده"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="resultForm.z_score"
                  label="Z نمره"
                  outlined
                  type="number"
                  step="0.0001" />
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="ذخیره تغییرات"
                :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam, ExamType } from 'src/repositories/exam'
import { inPersonExamResult } from 'src/repositories/inPersonExamResult'
import { examCategory } from 'src/repositories/examCategory'
import LessonAPI from 'src/repositories/lesson'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const lessonApi = new LessonAPI()

const loading = ref(true)
const saving = ref(false)
const examId = computed(() => parseInt(route.params.id as string))
const lessonOptions = ref<any[]>([])
const categoryOptions = ref<any[]>([])

const isResultMode = computed(() => !!route.query.result_id)

const examItem = ref<ExamType | null>(null)

const resultForm = reactive({
  raw_score: null as number | null,
  scaled_score: null as number | null,
  z_score: null as number | null
})

const resultItem = ref<any>(null)

onMounted(async () => {
  loading.value = true
  try {
    if (isResultMode.value) {
      const resultId = parseInt(route.query.result_id as string)
      const result = await inPersonExamResult.get(resultId)
      resultItem.value = result
      resultForm.raw_score = result.raw_score
      resultForm.scaled_score = result.scaled_score
      resultForm.z_score = result.z_score
    } else {
      const examData = await exam.get(examId.value)
      examItem.value = examData

      await loadLessons()
      await loadCategories()
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات' })
  } finally {
    loading.value = false
  }
})

async function loadLessons () {
  try {
    const response = await lessonApi.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

async function loadCategories () {
  try {
    const response = await examCategory.index({ length: 100 })
    categoryOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading categories:', error)
  }
}

async function onSubmitExam () {
  if (!examItem.value) return

  saving.value = true
  try {
    if (examItem.value.delivery_mode === 'online' && examItem.value.online_exam_detail) {
      const fd = new FormData()

      fd.append('name', examItem.value.name || '')
      fd.append('description', examItem.value.description || '')
      fd.append('lesson_id', String(examItem.value.lesson_id ?? ''))
      fd.append('min_passing_score', String(examItem.value.min_passing_score ?? ''))
      fd.append('max_score', String(examItem.value.max_score ?? ''))
      fd.append('exam_category_id', String(examItem.value.exam_category_id ?? ''))
      fd.append('delivery_mode', examItem.value.delivery_mode || 'online')
      fd.append('starts_at', examItem.value.online_exam_detail.starts_at || '')
      fd.append('ends_at', examItem.value.online_exam_detail.ends_at || '')
      fd.append('time_limit_minutes', String(examItem.value.online_exam_detail.time_limit_minutes ?? ''))
      fd.append('visible_at', examItem.value.online_exam_detail.visible_at || '')
      fd.append('answers_visible_at', examItem.value.online_exam_detail.answers_visible_at || '')
      fd.append('class_ids', JSON.stringify((examItem.value.classes || []).map((c: any) => c.id)))
      fd.append('academic_level_ids', JSON.stringify((examItem.value.academic_levels || []).map((l: any) => l.id)))

      const content = examItem.value.online_exam_detail.content
      if (content) {
        const contentMeta = { ...content }
        delete contentMeta.file
        fd.append('content', JSON.stringify(contentMeta))
        if (content.file) {
          fd.append('content_file', content.file)
        }
      }

      const solution = examItem.value.online_exam_detail.solution
      if (solution) {
        const solutionMeta = { ...solution }
        delete solutionMeta.file
        fd.append('solution', JSON.stringify(solutionMeta))
        if (solution.file) {
          fd.append('solution_file', solution.file)
        }
      }

      if (examItem.value.online_exam_detail.booklets?.length) {
        fd.append('booklets', JSON.stringify(examItem.value.online_exam_detail.booklets))
      }

      if (examItem.value.answer_keys?.length) {
        fd.append('answer_keys', JSON.stringify(examItem.value.answer_keys))
      }

      await exam.updateWithOnlineDetail(examId.value, fd)

      $q.notify({ type: 'positive', message: 'آزمون با موفقیت به‌روز شد' })
      router.push({ name: 'Panel.Exam.Show', params: { id: examId.value } })
    } else {
      const payload: any = {
        name: examItem.value.name,
        description: examItem.value.description,
        lesson_id: examItem.value.lesson_id,
        min_passing_score: examItem.value.min_passing_score,
        max_score: examItem.value.max_score,
        exam_category_id: examItem.value.exam_category_id,
        delivery_mode: examItem.value.delivery_mode
      }

      if (examItem.value.online_exam_detail) {
        payload.starts_at = examItem.value.online_exam_detail.starts_at
        payload.ends_at = examItem.value.online_exam_detail.ends_at
        payload.time_limit_minutes = examItem.value.online_exam_detail.time_limit_minutes
        payload.visible_at = examItem.value.online_exam_detail.visible_at
        payload.answers_visible_at = examItem.value.online_exam_detail.answers_visible_at
      }

      if (examItem.value.in_person_exam_detail) {
        payload.held_at = examItem.value.in_person_exam_detail.held_at
        payload.is_descriptive = examItem.value.in_person_exam_detail.is_descriptive
      }

      await exam.update(examId.value, payload)

      $q.notify({ type: 'positive', message: 'آزمون با موفقیت به‌روز شد' })
      router.push({ name: 'Panel.Exam.Show', params: { id: examId.value } })
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی آزمون' })
  } finally {
    saving.value = false
  }
}

async function onSubmitResult () {
  saving.value = true
  try {
    const resultId = parseInt(route.query.result_id as string)
    await inPersonExamResult.update(resultId, resultForm as any)
    $q.notify({ type: 'positive', message: 'نمره با موفقیت به‌روز شد' })
    router.push({ name: 'Panel.Exam.Show', params: { id: examId.value } })
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی نمره' })
  } finally {
    saving.value = false
  }
}
</script>
