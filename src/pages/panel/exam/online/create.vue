<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت آزمون آنلاین جدید</h4>
      </div>
    </div>

    <q-form @submit.prevent="onSubmit">
      <exam-online-detail-card
        :exam="form"
        :school-id="currentSchoolId"
        :editable="true" />

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
          :to="{ name: 'Panel.Exam.Online.List' }" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { exam } from 'src/repositories/exam'
import { ref, onMounted, computed } from 'vue'
import LessonAPI from 'src/repositories/lesson'
import { useExamForm } from 'src/composables/useExamForm'
import { examCategory } from 'src/repositories/examCategory'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import ExamOnlineDetailCard from 'components/exam/ExamOnlineDetailCard.vue'

const $q = useQuasar()
const router = useRouter()
const lessonApi = new LessonAPI()
const currentSchoolManager = useCurrentSchool()

const saving = ref(false)

const categoryOptions = ref<any[]>([])
const lessonOptions = ref<any[]>([])
const { form, validate, buildFormData, resetForm } = useExamForm()
form.delivery_mode = 'online'

const currentSchoolId = computed(() => currentSchoolManager?.currentSchool.value?.id)

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

const onSubmit = async () => {
  if (!validate()) {
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
    resetForm()
    router.push({ name: 'Panel.Exam.Online.List' })
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
