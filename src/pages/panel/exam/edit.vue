<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">{{ isResultMode ? 'ویرایش نمره دانش آموز' : 'ویرایش آزمون' }}</h4>
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

    <template v-else-if="!isResultMode">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="onSubmitExam">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.name"
                  label="نام آزمون *"
                  outlined
                  :rules="[(v) => !!v || 'نام الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.lesson_id"
                  :options="lessonOptions"
                  option-value="id"
                  option-label="name"
                  label="درس"
                  outlined
                  emit-value
                  map-options
                  clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.exam_category_id"
                  :options="categoryOptions"
                  option-value="id"
                  option-label="title"
                  label="دسته‌بندی"
                  outlined
                  emit-value
                  map-options
                  clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.min_passing_score"
                  label="حداقل نمره قبولی"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.max_score"
                  label="حداکثر نمره"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.description"
                  label="توضیحات"
                  outlined
                  type="textarea"
                  rows="3" />
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

    <template v-else-if="resultItem">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="onSubmitResult">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="text-subtitle2">دانش آموز:</div>
                <div class="text-body1">{{ resultItem.student?.full_name || '-' }}</div>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="resultForm.raw_score"
                  label="نمره خام *"
                  outlined
                  type="number"
                  step="0.01"
                  :rules="[(v) => v !== null && v !== '' || 'نمره الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="resultForm.scaled_score"
                  label="نمره محاسبه شده"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="resultForm.z_score"
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
import { exam } from 'src/repositories/exam'
import { inPersonExamResult } from 'src/repositories/inPersonExamResult'
import { lesson } from 'src/repositories/lesson'
import { examCategory } from 'src/repositories/examCategory'
import LessonAPI from 'src/repositories/lesson'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const lessonApi = new LessonAPI()

const loading = ref(true)
const saving = ref(false)
const examId = ref<number>(0)
const lessonOptions = ref<any[]>([])
const categoryOptions = ref<any[]>([])

const isResultMode = computed(() => !!route.query.result_id)

const form = reactive({
  name: '',
  lesson_id: null as number | null,
  exam_category_id: null as number | null,
  min_passing_score: null as number | null,
  max_score: null as number | null,
  description: ''
})

const resultForm = reactive({
  raw_score: null as number | null,
  scaled_score: null as number | null,
  z_score: null as number | null
})

const resultItem = ref<any>(null)

onMounted(async () => {
  loading.value = true
  try {
    examId.value = parseInt(route.params.id as string)

    if (isResultMode.value) {
      const resultId = parseInt(route.query.result_id as string)
      const result = await inPersonExamResult.get(resultId)
      resultItem.value = result
      resultForm.raw_score = result.raw_score
      resultForm.scaled_score = result.scaled_score
      resultForm.z_score = result.z_score
    } else {
      const examData = await exam.get(examId.value)
      form.name = examData.name || ''
      form.lesson_id = examData.lesson_id
      form.exam_category_id = examData.exam_category_id
      form.min_passing_score = examData.min_passing_score
      form.max_score = examData.max_score
      form.description = examData.description || ''

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
  saving.value = true
  try {
    await exam.update(examId.value, form as any)
    $q.notify({ type: 'positive', message: 'اطلاعات آزمون با موفقیت به‌روز شد' })
    router.push({ name: 'Panel.Exam.Show', params: { id: examId.value } })
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی اطلاعات آزمون' })
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
