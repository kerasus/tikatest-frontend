<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت آزمون جدید</h4>
      </div>
    </div>

    <q-card style="max-width: 900px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام آزمون *"
                outlined
                :rules="[val => !!val || 'نام آزمون الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="درس"
                outlined
                clearable
                emit-value
                map-options />
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
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.delivery_mode"
                :options="deliveryModeOptions"
                label="نوع تحویل *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'نوع تحویل را انتخاب کنید']" />
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
                :rules="[val => !!val || 'دسته‌بندی الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox
                v-model="form.is_descriptive"
                label="نوع توصیفی (برای حضوری)" />
            </div>

            <template v-if="form.delivery_mode === 'in_person'">
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.held_at"
                  label="تاریخ برگزاری *"
                  outlined
                  :rules="[() => !!form.held_at || 'تاریخ الزامی است']" />
              </div>
            </template>

            <template v-else-if="form.delivery_mode === 'online'">
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.starts_at"
                  label="زمان شروع"
                  outlined
                  date-format="YYYY-MM-DD HH:mm"
                  time-format="24h" />
              </div>
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.ends_at"
                  label="زمان پایان"
                  outlined
                  date-format="YYYY-MM-DD HH:mm"
                  time-format="24h" />
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
                <form-builder-date
                  v-model:value="form.visible_at"
                  label="زمان انتشار"
                  outlined
                  date-format="YYYY-MM-DD HH:mm"
                  time-format="24h" />
              </div>
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.answers_visible_at"
                  label="زمان نمایش پاسخ‌نامه"
                  outlined
                  date-format="YYYY-MM-DD HH:mm"
                  time-format="24h" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.content"
                  label="محتوا (JSON)"
                  outlined
                  type="textarea"
                  rows="4"
                  hint="محتوای آزمون به صورت JSON وارد کنید" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.solution"
                  label="پاسخ‌نامه (JSON)"
                  outlined
                  type="textarea"
                  rows="4"
                  hint="پاسخ‌نامه آزمون به صورت JSON وارد کنید" />
              </div>
            </template>

            <div class="col-12">
              <q-select
                v-model="form.class_ids"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="کلاس‌ها"
                outlined
                clearable
                emit-value
                multiple
                map-options />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.academic_level_ids"
                :options="levelOptions"
                option-value="id"
                option-label="name"
                label="پایه‌ها"
                outlined
                clearable
                emit-value
                multiple
                map-options />
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
import { exam } from 'src/repositories/exam'
import { examCategory } from 'src/repositories/examCategory'
import { lesson } from 'src/repositories/lesson'
import { schoolClass } from 'src/repositories/schoolClass'
import { academicLevel } from 'src/repositories/academicLevel'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const lessonOptions = ref<any[]>([])
const categoryOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const levelOptions = ref<any[]>([])

const deliveryModeOptions = [
  { label: 'آنلاین', value: 'online' },
  { label: 'حضوری', value: 'in_person' }
]

const form = reactive({
  name: null as string | null,
  description: null as string | null,
  lesson_id: null as number | null,
  min_passing_score: null as number | null,
  max_score: null as number | null,
  delivery_mode: 'in_person' as 'online' | 'in_person',
  exam_category_id: null as number | null,
  is_descriptive: false,
  held_at: null as string | null,
  starts_at: null as string | null,
  ends_at: null as string | null,
  time_limit_minutes: null as number | null,
  visible_at: null as string | null,
  answers_visible_at: null as string | null,
  content: null as string | null,
  solution: null as string | null,
  class_ids: [] as number[],
  academic_level_ids: [] as number[]
})

const loadLessons = async () => {
  try {
    const response = await lesson.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

const loadCategories = async () => {
  try {
    const response = await examCategory.index({ length: 100 })
    categoryOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading categories:', error)
  }
}

const loadClasses = async () => {
  try {
    const response = await schoolClass.index({ length: 100 })
    classOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading classes:', error)
  }
}

const loadLevels = async () => {
  try {
    const response = await academicLevel.index({ length: 100 })
    levelOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading levels:', error)
  }
}

const onSubmit = async () => {
  saving.value = true
  try {
    const formData: any = { ...form }
    if (formData.content) {
      try {
        formData.content = JSON.parse(form.content)
      } catch (e) {
        $q.notify({
          icon: 'error',
          message: 'فرمت JSON محتوا نامعتبر است.',
          color: 'negative'
        })
        saving.value = false
        return
      }
    }
    if (formData.solution) {
      try {
        formData.solution = JSON.parse(form.solution)
      } catch (e) {
        $q.notify({
          icon: 'error',
          message: 'فرمت JSON پاسخ‌نامه نامعتبر است.',
          color: 'negative'
        })
        saving.value = false
        return
      }
    }
    await exam.create(formData as any)
    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Exam.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت آزمون.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadLessons()
  loadCategories()
  loadClasses()
  loadLevels()
})
</script>
