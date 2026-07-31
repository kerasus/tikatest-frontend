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
              <q-select
                v-model="form.school_id"
                :options="schoolOptions"
                option-value="id"
                option-label="name"
                label="انتخاب مدرسه *"
                outlined
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'مدرسه الزامی است']"
                @update:model-value="onSchoolChange" />
            </div>
          </div>

          <!-- Step 2: Academic Field -->
          <div
            v-if="form.school_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.field_id"
                :options="fieldOptions"
                option-value="id"
                option-label="name"
                label="انتخاب رشته *"
                outlined
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'رشته الزامی است']"
                @update:model-value="onFieldChange" />
            </div>
          </div>

          <!-- Step 3: Academic Level -->
          <div
            v-if="form.field_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.level_id"
                :options="levelOptions"
                option-value="id"
                option-label="name"
                label="انتخاب پایه *"
                outlined
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'پایه الزامی است']"
                @update:model-value="onLevelChange" />
            </div>
          </div>

          <!-- Step 4: Class and Lesson -->
          <div
            v-if="form.level_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="انتخاب کلاس *"
                outlined
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'کلاس الزامی است']"
                @update:model-value="onClassChange" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="انتخاب درس *"
                outlined
                emit-value
                map-options
                clearable
                :rules="[(v) => !!v || 'درس الزامی است']" />
            </div>
          </div>

          <!-- Step 5: Exam Form -->
          <div v-if="form.class_id && form.lesson_id">
            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <form-builder-date
                  v-model:value="form.exam_date"
                  label="تاریخ آزمون *"
                  outlined
                  :rules="[() => !!form.exam_date || 'تاریخ الزامی است']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.grade_type"
                  :options="gradeTypeOptions"
                  option-value="value"
                  option-label="label"
                  label="نوع نمره *"
                  outlined
                  emit-value
                  map-options
                  :rules="[(v) => !!v || 'نوع نمره الزامی است']"
                  @update:model-value="onGradeTypeChange" />
              </div>
              <div
                v-if="form.grade_type === 'other'"
                class="col-12">
                <q-input
                  v-model="form.grade_name_for_other_type"
                  label="نام نمره برای نوع دیگر"
                  outlined
                  :rules="[(v) => !!v || 'نام نمره الزامی است']" />
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
              :disable="!form.class_id || !form.lesson_id" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Grade.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import SchoolAPI from 'src/repositories/school'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import SchoolClassAPI from 'src/repositories/schoolClass'
import LessonAPI from 'src/repositories/lesson'
import StudentAPI from 'src/repositories/student'
import GradeAPI from 'src/repositories/grade'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import type { SchoolType } from 'src/repositories/school'
import type { AcademicFieldType } from 'src/repositories/academicField'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import type { LessonType } from 'src/repositories/lesson'
import type { StudentType } from 'src/repositories/student'

const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()
const classApi = new SchoolClassAPI()
const lessonApi = new LessonAPI()
const studentApi = new StudentAPI()
const gradeApi = new GradeAPI()

const $q = useQuasar()

const schoolOptions = ref<SchoolType[]>([])
const fieldOptions = ref<AcademicFieldType[]>([])
const levelOptions = ref<AcademicLevelType[]>([])
const classOptions = ref<SchoolClassType[]>([])
const lessonOptions = ref<LessonType[]>([])
const studentOptions = ref<any[]>([])
const saving = ref(false)

const descriptiveOptions = [
  { label: 'خیلی خوب', value: 1 },
  { label: 'خوب', value: 2 },
  { label: 'قابل قبول', value: 3 },
  { label: 'نیاز به آموزش و تلاش بیشتر', value: 4 }
]

const gradeTypeOptions = [
  { label: 'آزمون کلاسی', value: 'class_quiz' },
  { label: 'آزمون ماهانه', value: 'monthly_quiz' },
  { label: 'میان ترم اول', value: 'mid_term_1' },
  { label: 'مستمر اول', value: 'continuous_1' },
  { label: 'پایان ترم اول', value: 'final_1' },
  { label: 'میان ترم دوم', value: 'mid_term_2' },
  { label: 'مستمر دوم', value: 'continuous_2' },
  { label: 'پایان ترم دوم', value: 'final_2' },
  { label: 'سایر', value: 'other' }
]

const form = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  exam_date: null as string | null,
  grade_type: '',
  grade_name_for_other_type: '',
  is_descriptive: false,
  min_passing_score: null as number | null,
  max_score: null as number | null
})

async function loadSchools () {
  try {
    const result = await schoolApi.index({ length: 1000 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

async function loadFields (schoolId: number) {
  try {
    const result = await fieldApi.index({ length: 1000, school_id: schoolId })
    fieldOptions.value = result.data
    form.field_id = null
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
    studentOptions.value = []
    levelOptions.value = []
    classOptions.value = []
    lessonOptions.value = []
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadLevels (fieldId: number) {
  try {
    const result = await levelApi.index({ length: 1000, field_id: fieldId })
    levelOptions.value = result.data
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
    studentOptions.value = []
    classOptions.value = []
    lessonOptions.value = []
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClasses (levelId: number) {
  try {
    const result = await classApi.index({ length: 1000, level_id: levelId })
    classOptions.value = result.data
    form.class_id = null
    form.lesson_id = null
    studentOptions.value = []
    lessonOptions.value = []
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

async function loadLessons (levelId: number) {
  try {
    const result = await lessonApi.index({ length: 1000, level_id: levelId })
    lessonOptions.value = result.data
    form.lesson_id = null
    studentOptions.value = []
  } catch (error) {
    console.error('Error loading lessons:', error)
  }
}

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
  if (schoolId) {
    loadFields(schoolId)
  } else {
    fieldOptions.value = []
    levelOptions.value = []
    classOptions.value = []
    lessonOptions.value = []
    studentOptions.value = []
    form.field_id = null
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
  }
}

function onFieldChange (fieldId: number | null) {
  if (fieldId) {
    loadLevels(fieldId)
  } else {
    levelOptions.value = []
    classOptions.value = []
    lessonOptions.value = []
    studentOptions.value = []
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
  }
}

function onLevelChange (levelId: number | null) {
  if (levelId) {
    loadClasses(levelId)
    loadLessons(levelId)
  } else {
    classOptions.value = []
    lessonOptions.value = []
    studentOptions.value = []
    form.class_id = null
    form.lesson_id = null
  }
}

function onClassChange (classId: number | null) {
  if (classId) {
    loadStudents(classId)
  } else {
    studentOptions.value = []
  }
}

function onGradeTypeChange () {
  // Template handles visibility of conditional fields
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

      if (form.min_passing_score !== null && Number(form.min_passing_score) >= Number(form.max_score)) {
        $q.notify({
          icon: 'error',
          message: 'حداقل نمره قبولی باید از حداکثر نمره کمتر باشد.',
          color: 'negative'
        })
        return
      }

      for (const student of studentOptions.value) {
        const rawGrade = student.raw_grade
        if (rawGrade === null || rawGrade === '' || isNaN(Number(rawGrade))) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید عدد باشد.`,
            color: 'negative'
          })
          return
        }

        if (Number(rawGrade) >= Number(form.max_score)) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید کمتر از حداکثر نمره (${form.max_score}) باشد.`,
            color: 'negative'
          })
          return
        }
      }
    }

    const payload = {
      lesson_id: form.lesson_id,
      class_id: form.class_id,
      exam_date: form.exam_date,
      grade_type: form.grade_type,
      grade_name_for_other_type: form.grade_name_for_other_type || null,
      is_descriptive: form.is_descriptive,
      min_passing_score: form.min_passing_score,
      max_score: form.max_score,
      grades: studentOptions.value.map((s: any) => ({
        student_id: s.id,
        raw_grade: s.raw_grade,
        descriptive_value: s.descriptive_value
      }))
    }

    await gradeApi.createExamWithGrades(payload)

    $q.notify({
      icon: 'check',
      message: 'نمرات با موفقیت ثبت شد.',
      color: 'positive'
    })
  } catch (error: any) {
    const message = error?.response?.data?.message || 'خطا در ثبت نمرات.'
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
  loadSchools()
})
</script>

<style lang="scss" scoped>
.grade-create-page {
  width: 100%;
  margin: 0 auto;
}
</style>
