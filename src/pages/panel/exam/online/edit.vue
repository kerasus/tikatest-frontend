<template>
  <div>
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <exam-online-detail-card
        :exam="form"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'
import { examCategory } from 'src/repositories/examCategory'
import LessonAPI from 'src/repositories/lesson'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import SchoolClassAPI from 'src/repositories/schoolClass'
import ExamOnlineDetailCard from 'src/components/exam/ExamOnlineDetailCard.vue'
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

const { form, validate, buildFormData, loadFromExam } = useExamForm(true)

onMounted(async () => {
  loading.value = true
  try {
    const examData = await exam.get(examId.value)
    loadFromExam(examData)

    await loadLessons()
    await loadCategories()
    await loadAcademicLevels()
    await loadSchoolClasses()
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

    await exam.updateWithOnlineDetail(examId.value, formData)

    $q.notify({ type: 'positive', message: 'آزمون با موفقیت به‌روز شد' })
    router.push({ name: 'Panel.Exam.Online.Show', params: { id: examId.value } })
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی آزمون' })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped></style>
