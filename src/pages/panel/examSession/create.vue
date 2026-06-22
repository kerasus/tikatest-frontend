<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت آزمون کلاسی</h4>
      </div>
    </div>

    <q-card style="max-width: 900px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="درس *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'درس را انتخاب کنید']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="کلاس *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'کلاس را انتخاب کنید']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.gregorian_date" label="تاریخ Exam *" outlined type="date" :rules="[val => !!val || 'تاریخ را وارد کنید']" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.persian_date" label="تاریخ شمسی" outlined dir="ltr" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.grade_type"
                :options="gradeTypeOptions"
                label="نوع نمره *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'نوع نمره را انتخاب کنید']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.grade_name_for_other_type" label="نام نوع نمره (برای سایر)" outlined />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="form.min_grade" label="حداقل نمره قبولی" outlined type="number" />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="form.is_report_card"
                :options="[{label: 'بله', value: true}, {label: 'خیر', value: false}]"
                label="در کارنامه"
                outlined
                emit-value
                map-options
                default-value="false"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.is_descriptive"
                :options="[{label: 'بله', value: true}, {label: 'خیر', value: false}]"
                label="نوع توصیفی"
                outlined
                emit-value
                map-options
                default-value="false"
              />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn type="submit" color="primary" label="ثبت آزمون" :loading="saving" class="q-ml-sm" />
            <q-btn flat label="انصراف" :to="{ name: 'Panel.ExamSession.List' }" />
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
import { examSession } from 'src/repositories/examSession'
import { lesson } from 'src/repositories/lesson'
import { schoolClass } from 'src/repositories/schoolClass'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const lessonOptions = ref<any[]>([])
const classOptions = ref<any[]>([])

const gradeTypeOptions = [
  { label: 'آزمون کلاسی', value: 'class_quiz' },
  { label: 'آزمون ماهانه', value: 'monthly_quiz' },
  { label: 'میان ترم اول', value: 'mid_term_1' },
  { label: 'مستمر اول', value: 'continuous_1' },
  { label: 'پایان ترم اول', value: 'final_1' },
  { label: 'میان ترم دوم', value: 'mid_term_2' },
  { label: 'مستمر دوم', value: 'continuous_2' },
  { label: 'پایان ترم دوم', value: 'final_2' },
  { label: 'سایر', value: 'other' },
]

const form = reactive({
  lesson_id: null as number | null,
  class_id: null as number | null,
  gregorian_date: null as string | null,
  persian_date: null as string | null,
  grade_type: null as string | null,
  grade_name_for_other_type: null as string | null,
  min_grade: null as number | null,
  is_report_card: false,
  is_descriptive: false,
})

const loadLessons = async () => {
  try {
    const response = await lesson.index({ length: 100 })
    lessonOptions.value = response.data.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

const loadClasses = async () => {
  try {
    const response = await schoolClass.index({ length: 100 })
    classOptions.value = response.data.data || []
  } catch (error: any) {
    console.error('Error loading classes:', error)
  }
}

const onSubmit = async () => {
  saving.value = true
  try {
    await examSession.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.ExamSession.List' })
  } catch (error) {
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
  loadClasses()
})
</script>
