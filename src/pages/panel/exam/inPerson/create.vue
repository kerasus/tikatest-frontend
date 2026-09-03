<template>
  <div class="grade-create-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ثبت نمره جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <!-- Step 1: School -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school
                v-model:value="form.school_id"
                label="انتخاب مدرسه"
                outlined
                :rules="[(v) => !!v || 'مدرسه الزامی است']"
                @update:value="onSchoolChange" />
            </div>
          </div>

          <!-- Step 2: Academic Field -->
          <div
            v-if="form.school_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-field
                v-model:value="form.field_id"
                label="انتخاب رشته"
                outlined
                :disable="!form.school_id"
                :rules="[(v) => !!v || 'رشته الزامی است']"
                :school-id="form.school_id"
                @update:value="onFieldChange" />
            </div>
          </div>

          <!-- Step 3: Academic Level -->
          <div
            v-if="form.field_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-level
                v-model:value="form.academic_level_id"
                label="انتخاب پایه"
                outlined
                :disable="!form.field_id"
                :rules="[(v) => !!v || 'پایه الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                @update:value="onLevelChange" />
            </div>
          </div>

          <!-- Step 4: Class and Lesson -->
          <div
            v-if="form.academic_level_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school-class
                v-model:value="form.class_id"
                label="انتخاب کلاس"
                outlined
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'کلاس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id"
                @update:value="onClassChange" />
            </div>
            <div class="col-12 col-md-6">
              <form-builder-select-lesson
                v-model:value="form.lesson_id"
                label="انتخاب درس"
                outlined
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'درس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id" />
            </div>
          </div>

          <!-- Step 5: Exam Form -->
          <div v-if="form.class_id && form.lesson_id">
            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.exam_date"
                  label="تاریخ آزمون"
                  outlined
                  :rules="[() => !!form.exam_date || 'تاریخ الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <form-builder-select-exam-category
                  v-model:value="form.exam_category_id"
                  label="دسته‌بندی آزمون"
                  outlined
                  :disable="!form.school_id" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="examName"
                  label="نام آزمون"
                  outlined
                  :rules="[(v) => !!v || 'نام آزمون الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <q-checkbox
                  v-model="form.is_descriptive"
                  label="نمره توصیفی" />
              </div>
              <div
                v-if="!form.is_descriptive"
                class="col-12 col-md-6">
                <q-input
                  v-model="form.min_passing_score"
                  label="حداقل نمره قبولی"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div
                v-if="!form.is_descriptive"
                class="col-12 col-md-6">
                <q-input
                  v-model="form.max_score"
                  label="حداکثر نمره"
                  outlined
                  type="number"
                  step="0.01" />
              </div>
              <div class="col-12 col-md-6">
                <form-builder-date-time
                  v-model:value="form.results_visible_at"
                  label="زمان نمایش نتایج به دانش‌آموزان"
                  outlined
                  dense />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Student List -->
            <div class="text-subtitle1 q-mb-md">لیست دانش آموزان کلاس</div>

            <div
              v-if="studentOptions.length === 0"
              class="text-center q-pa-lg text-grey">
              ابتدا کلاس را انتخاب کنید تا لیست دانش آموزان نمایش داده شود
            </div>

            <q-list
              v-else
              bordered
              separator>
              <q-item
                v-for="student in studentOptions"
                :key="student.id"
                class="q-py-sm">
                <q-item-section>
                  <q-item-label>{{ student.full_name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-col-gutter-sm">
                    <div
                      class="col-auto"
                      style="width: 130px">
                      <q-input
                        v-model="student.raw_grade"
                        label="نمره"
                        outlined
                        dense
                        type="number"
                        step="0.01"
                        :disable="form.is_descriptive" />
                    </div>
                    <div
                      v-if="form.is_descriptive"
                      class="col-auto"
                      style="width: 160px">
                      <q-select
                        v-model="student.descriptive_value"
                        :options="descriptiveOptions"
                        option-value="value"
                        option-label="label"
                        outlined
                        dense
                        emit-value
                        map-options />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت نمره‌ها"
              :loading="saving"
              :disable="!form.class_id || !form.lesson_id || !form.exam_category_id" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Exam.InPerson.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ExamAPI from 'src/repositories/exam'
import StudentAPI from 'src/repositories/student'
import FormBuilderDate from 'components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderDateTime from 'components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectLesson from 'components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchool from 'components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectExamCategory from 'components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'
import FormBuilderSelectAcademicField from 'components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const examApi = new ExamAPI()
const studentApi = new StudentAPI()

const $q = useQuasar()

const studentOptions = ref<any[]>([])
const saving = ref(false)

const descriptiveOptions = [
  { label: 'خیلی خوب', value: 1 },
  { label: 'خوب', value: 2 },
  { label: 'قابل قبول', value: 3 },
  { label: 'نیاز به آموزش و تلاش بیشتر', value: 4 }
]

const form = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  exam_date: new Date().toISOString() as string | null,
  is_descriptive: false,
  min_passing_score: 10 as number | null,
  max_score: 20 as number | null,
  results_visible_at: null as string | null,
  exam_name: 'آزمون کلاسی',
  exam_category_id: null as number | null
})

const examName = computed({
  get () {
    return form.exam_name
  },
  set (val) {
    form.exam_name = val
  }
})

async function loadStudents (classId: number) {
  try {
    const result = await studentApi.index({ length: 1000, class_id: classId })
    studentOptions.value = result.data.map((s: any) => ({
      id: s.id,
      full_name: s.full_name || `${s.first_name} ${s.last_name}`,
      raw_grade: null,
      descriptive_value: null
    }))
  } catch (error) {
    console.error('Error loading students:', error)
  }
}

function onSchoolChange (schoolId: number | null) {
  form.field_id = null
  form.academic_level_id = null
  form.class_id = null
  form.lesson_id = null
  form.exam_category_id = null
  form.exam_name = 'آزمون کلاسی'
  studentOptions.value = []
}

function onFieldChange (fieldId: number | null) {
  form.academic_level_id = null
  form.class_id = null
  form.lesson_id = null
  studentOptions.value = []
}

function onLevelChange (levelId: number | null) {
  form.class_id = null
  form.lesson_id = null
  studentOptions.value = []
}

function onClassChange (classId: number | null) {
  studentOptions.value = []
  if (classId) {
    loadStudents(classId)
  }
}

async function onSubmit () {
  saving.value = true

  try {
    if (!form.is_descriptive) {
      if (!form.max_score || Number(form.max_score) <= 0) {
        $q.notify({
          icon: 'error',
          message: 'حداکثر نمره معتبر نیست.',
          color: 'negative'
        })
        return
      }

      if (
        form.min_passing_score !== null &&
        Number(form.min_passing_score) >= Number(form.max_score)
      ) {
        $q.notify({
          icon: 'error',
          message: 'حداقل نمره قبولی باید از حداکثر نمره کمتر باشد.',
          color: 'negative'
        })
        return
      }

      for (const student of studentOptions.value) {
        const rawGrade = student.raw_grade

        const isEmpty = rawGrade === null || rawGrade === ''
        if (!isEmpty && isNaN(Number(rawGrade))) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید عدد باشد.`,
            color: 'negative'
          })
          return
        }

        if (!isEmpty && Number(rawGrade) > Number(form.max_score)) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید کمتر از حداکثر نمره (${form.max_score}) باشد.`,
            color: 'negative'
          })
          return
        }
      }
    }

    const results = studentOptions.value
      .map((s: any) => {
        const rawScore = form.is_descriptive
          ? s.descriptive_value || 0
          : s.raw_grade === null || s.raw_grade === ''
            ? null
            : Number(s.raw_grade)
        let scaledScore = null
        if (
          !form.is_descriptive &&
          rawScore !== null &&
          form.max_score &&
          Number(form.max_score) > 0
        ) {
          scaledScore = Math.round((rawScore / Number(form.max_score)) * 20)
        }

        return {
          user_id: s.id,
          raw_score: rawScore,
          scaled_score: scaledScore,
          z_score: null
        }
      })
      .filter(
        (r) => typeof r.raw_score !== 'undefined' && r.raw_score !== null && !isNaN(r.raw_score)
      )

    const payload = {
      name: examName.value || form.exam_name,
      description: null,
      lesson_id: form.lesson_id,
      min_passing_score: form.min_passing_score,
      max_score: form.max_score,
      exam_category_id: form.exam_category_id,
      held_at: form.exam_date,
      is_descriptive: form.is_descriptive,
      results_visible_at: form.results_visible_at,
      class_ids: [form.class_id],
      results
    }

    await examApi.storeWithInPersonDetailAndResults(payload)

    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ثبت شد.',
      color: 'positive'
    })
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
  // No need to load schools - FormBuilderSelectSchool loads internally
})
</script>

<style lang="scss" scoped>
.grade-create-page {
  width: 100%;
  margin: 0 auto;
}
</style>
