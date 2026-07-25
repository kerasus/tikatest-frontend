<template>
  <div class="grade-school-create-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">ثبت نمره برای مدرسه</div>
            <div class="text-caption text-grey">
              {{ school?.name || 'در حال بارگذاری...' }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="refresh"
              label="بروزرسانی"
              :loading="loading"
              @click="resetForm" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

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
                clearable
                :rules="[v => !!v || 'درس الزامی است']"
                @update:model-value="onLessonChange" />
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
                clearable
                :rules="[v => !!v || 'کلاس الزامی است']"
                @update:model-value="onClassChange" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.exam_date"
                label="تاریخ آزمون *"
                outlined
                type="date"
                :rules="[v => !!v || 'تاریخ آزمون الزامی است']" />
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
                clearable
                :rules="[v => !!v || 'نوع نمره الزامی است']"
                @update:model-value="onGradeTypeChange" />
            </div>
            <div
              v-if="form.grade_type === 'other'"
              class="col-12 col-md-6">
              <q-input
                v-model="form.grade_name_for_other_type"
                label="نام نوع نمره (برای سایر)"
                outlined
                :rules="[v => !!v || 'نام نوع نمره الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-toggle
                v-model="form.is_descriptive"
                label="نمره تشریحی"
                color="primary" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.max_score"
                label="حداکثر نمره ممکن"
                outlined
                type="number"
                step="0.01"
                :rules="[v => v > 0 || 'حداکثر نمره باید بزرگتر از 0 باشد']"
                @update:model-value="onMaxPossibleGradeChange" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.min_passing_score"
                label="حداقل نمره قبولی"
                outlined
                type="number"
                step="0.01" />
            </div>
          </div>

          <div
            v-if="students.length > 0"
            class="q-mt-lg">
            <div class="text-h6 q-mb-md">لیست دانش‌آموزان و نمرات</div>
            <q-table
              :rows="students"
              :columns="studentColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 50 }">
              <template #body-cell-raw_grade="props">
                <q-td :props="props">
                  <q-input
                    v-model="studentGrades[props.row.id]"
                    label="نمره"
                    outlined
                    dense
                    type="number"
                    step="0.01"
                    min="0"
                    class="q-mb-none"
                    style="max-width: 150px;" />
                </q-td>
              </template>
              <template #body-cell-descriptive_value="props">
                <q-td :props="props">
                  <q-select
                    v-model="studentGrades[props.row.id]"
                    :options="descriptiveOptions"
                    option-value="value"
                    option-label="label"
                    label="ارزش‌گذاری"
                    outlined
                    dense
                    emit-value
                    map-options
                    clearable
                    class="q-mb-none"
                    style="max-width: 200px;" />
                </q-td>
              </template>
            </q-table>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت نمرات"
              :loading="saving"
              :disable="students.length === 0" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.School.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import GradeAPI from 'src/repositories/grade'
import LessonAPI from 'src/repositories/lesson'
import ClassAPI from 'src/repositories/schoolClass'
import SchoolAPI from 'src/repositories/school'
import StudentAPI from 'src/repositories/student'
import type { LessonType } from 'src/repositories/lesson'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import type { SchoolType } from 'src/repositories/school'
import type { StudentType } from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()

const gradeApi = new GradeAPI()
const lessonApi = new LessonAPI()
const classApi = new ClassAPI()
const schoolApi = new SchoolAPI()
const studentApi = new StudentAPI()

const schoolId = parseInt(route.params.school_id as string)
const loading = ref(false)
const saving = ref(false)

const school = ref<SchoolType | null>(null)
const lessons = ref<LessonType[]>([])
const classes = ref<SchoolClassType[]>([])
const students = ref<StudentType[]>([])
const studentGrades = ref<Record<number, any>>({})

const form = reactive({
  lesson_id: null as number | null,
  class_id: null as number | null,
  exam_date: null as string | null,
  grade_type: null as string | null,
  grade_name_for_other_type: null as string | null,
  is_descriptive: false,
  min_passing_score: null as number | null,
  max_score: null as number | null,
  school_id: schoolId
})

const lessonOptions = ref<{ label: string; value: number }[]>([])
const classOptions = ref<{ label: string; value: number }[]>([])

const gradeTypeOptions = [
  { label: 'آزمون کلاسی', value: 'class_quiz' },
  { label: 'آزمون ماهیانه', value: 'monthly_quiz' },
  { label: 'میان ترم ۱', value: 'mid_term_1' },
  { label: 'مداوم ۱', value: 'continuous_1' },
  { label: 'پایانی ۱', value: 'final_1' },
  { label: 'میان ترم ۲', value: 'mid_term_2' },
  { label: 'مداوم ۲', value: 'continuous_2' },
  { label: 'پایانی ۲', value: 'final_2' },
  { label: 'سایر', value: 'other' }
]

const descriptiveOptions = [
  { label: 'خیلی خوب', value: 1 },
  { label: 'خوب', value: 2 },
  { label: 'قابل قبول', value: 3 },
  { label: 'نیاز به آموزش و تلاش بیشتر', value: 4 }
]

const studentColumns = [
  { name: 'full_name', required: true, label: 'نام دانش آموز', align: 'right' as const, field: 'full_name', sortable: true },
  { name: 'student_code', label: 'کد دانش آموزی', align: 'right' as const, field: 'student_code' },
  { name: 'raw_grade', label: 'نمره', align: 'center' as const, field: 'raw_grade' },
  { name: 'descriptive_value', label: 'ارزش‌گذاری تشریحی', align: 'center' as const, field: 'descriptive_value' }
]

async function loadSchool () {
  try {
    const result = await schoolApi.get(schoolId)
    school.value = result
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات مدرسه',
      color: 'negative'
    })
  }
}

async function loadLessons () {
  try {
    const result = await lessonApi.index({ length: 1000, school_id: schoolId })
    lessons.value = result.data
    lessonOptions.value = result.data.map((l: LessonType) => ({
      label: l.name || '',
      value: l.id as number
    }))
  } catch (error) {
    console.error('Error loading lessons:', error)
  }
}

async function loadClasses () {
  try {
    const result = await classApi.index({ length: 1000, school_id: schoolId })
    classes.value = result.data
    classOptions.value = result.data.map((c: SchoolClassType) => ({
      label: c.name || '',
      value: c.id as number
    }))
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

async function loadStudents (classId: number) {
  loading.value = true
  try {
    const result = await studentApi.index({ class_ids: [classId], length: 1000 })
    students.value = result.data
    studentGrades.value = {}
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست دانش‌آموزان',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onLessonChange () {
  // Reset dependent fields when lesson changes
  form.class_id = null
  students.value = []
  studentGrades.value = {}
}

function onClassChange () {
  if (form.class_id) {
    loadStudents(form.class_id)
  } else {
    students.value = []
    studentGrades.value = {}
  }
}

function onMaxPossibleGradeChange () {
  if (form.max_score && !form.min_passing_score) {
    form.min_passing_score = Number((form.max_score / 2).toFixed(2))
  }
}

function onGradeTypeChange () {
  if (form.grade_type !== 'other') {
    form.grade_name_for_other_type = null
  }
}

function resetForm () {
  form.lesson_id = null
  form.class_id = null
  form.exam_date = null
  form.grade_type = null
  form.grade_name_for_other_type = null
  form.is_descriptive = false
  form.min_passing_score = null
  students.value = []
  studentGrades.value = {}
}

async function onSubmit () {
  if (students.value.length === 0) {
    $q.notify({
      icon: 'warning',
      message: 'لطفا کلاس را انتخاب کنید.',
      color: 'warning'
    })
    return
  }

  saving.value = true
  try {
    const grades = students.value.map((student) => {
      const rawGrade = studentGrades.value[student.id]
      return {
        school_id: schoolId,
        lesson_id: form.lesson_id,
        class_id: form.class_id,
        student_id: student.id,
        grade_type: form.grade_type,
        grade_name_for_other_type: form.grade_type === 'other' ? form.grade_name_for_other_type : null,
        is_descriptive: form.is_descriptive,
        min_passing_score: form.min_passing_score,
        max_score: form.max_score,
        grade_date: form.exam_date,
        raw_grade: form.is_descriptive ? null : (rawGrade || null),
        descriptive_value: form.is_descriptive ? rawGrade : null,
        is_visible: true,
        is_report_card: ['mid_term_1', 'continuous_1', 'final_1', 'mid_term_2', 'continuous_2', 'final_2'].includes(form.grade_type || '')
      }
    })

    await gradeApi.bulkStore({ grades })
    $q.notify({
      icon: 'check',
      message: 'نمرات با موفقیت ثبت شد.',
      color: 'positive'
    })
    resetForm()
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت نمرات.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      loadSchool(),
      loadLessons(),
      loadClasses()
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.grade-school-create-page {
  max-width: 100%;
  margin: 0 auto;
}
</style>
