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
          :to="{ name: 'Panel.Exam.Online.Show', params: { id: examId } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="!isResultMode && form.delivery_mode">
      <exam-detail-card
        :exam="form"
        :editable="true"
        :lesson-options="lessonOptions"
        :category-options="categoryOptions"
        :academic-level-options="academicLevelOptions"
        :school-class-options="schoolClassOptions" />

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
import AcademicLevelAPI from 'src/repositories/academicLevel'
import SchoolClassAPI from 'src/repositories/schoolClass'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
import { useExamForm } from 'src/composables/useExamForm'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const lessonApi = new LessonAPI()
const academicLevelApi = new AcademicLevelAPI()
const schoolClassApi = new SchoolClassAPI()

const loading = ref(true)
const saving = ref(false)
const examId = computed(() => parseInt(route.params.id as string))
const lessonOptions = ref<any[]>([])
const categoryOptions = ref<any[]>([])
const academicLevelOptions = ref<any[]>([])
const schoolClassOptions = ref<any[]>([])

const isResultMode = computed(() => !!route.query.result_id)

const { form, validate, buildFormData, loadFromExam } = useExamForm(true)

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
      loadFromExam(examData)

      await loadLessons()
      await loadCategories()
      await loadAcademicLevels()
      await loadSchoolClasses()
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

async function loadAcademicLevels () {
  try {
    const response = await academicLevelApi.index({ length: 100 })
    academicLevelOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading academic levels:', error)
  }
}

async function loadSchoolClasses () {
  try {
    const response = await schoolClassApi.index({ length: 100 })
    schoolClassOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading school classes:', error)
  }
}

async function onSubmitExam () {
  if (!validate()) {
    return
  }

  saving.value = true
  try {
    const formData = buildFormData()

    if (form.delivery_mode === 'online') {
      await exam.updateWithOnlineDetail(examId.value, formData)
    } else {
      await exam.update(examId.value, formData)
    }

    $q.notify({ type: 'positive', message: 'آزمون با موفقیت به‌روز شد' })
    router.push({ name: 'Panel.Exam.Online.Show', params: { id: examId.value } })
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
    router.push({ name: 'Panel.Exam.Online.Show', params: { id: examId.value } })
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی نمره' })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>
