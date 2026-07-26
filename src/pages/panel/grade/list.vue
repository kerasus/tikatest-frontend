<template>
  <div class="grade-list-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">لیست نمرات</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
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
              dense
              @update:model-value="onSchoolChange" />
          </div>
          <div class="col-12 col-md-4">
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
              :disable="!form.school_id"
              :rules="[(v) => !!v || 'رشته الزامی است']"
              dense
              @update:model-value="onFieldChange" />
          </div>
          <div class="col-12 col-md-4">
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
              :disable="!form.field_id"
              :rules="[(v) => !!v || 'پایه الزامی است']"
              dense
              @update:model-value="onLevelChange" />
          </div>
          <div class="col-12 col-md-4">
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
              :disable="!form.level_id"
              :rules="[(v) => !!v || 'کلاس الزامی است']"
              dense
              @update:model-value="onClassChange" />
          </div>
          <div class="col-12 col-md-4">
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
              :disable="!form.level_id"
              :rules="[(v) => !!v || 'درس الزامی است']"
              dense
              @update:model-value="onLessonChange" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.grade_type"
              :options="gradeTypeOptions"
              option-value="value"
              option-label="label"
              label="نوع نمره"
              outlined
              emit-value
              map-options
              clearable
              :disable="!form.lesson_id"
              dense
              @update:model-value="loadGrades" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="ثبت نمره"
              :to="{ name: 'Panel.Grade.Create' }"
              class="full-width"
              :disable="!form.school_id || !form.field_id || !form.level_id || !form.class_id || !form.lesson_id"
              dense />
          </div>
        </div>
      </q-card-section>

      <q-separator v-if="showTable" />

      <q-card-section v-if="showTable">
        <q-table
          :rows="grades"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-student="props">
            <q-td :props="props">
              {{ (props.row.student?.full_name || [props.row.student?.firstname, props.row.student?.lastname].filter(Boolean).join(' ')) || '-' }}
            </q-td>
          </template>
          <template #body-cell-grade_type="props">
            <q-td :props="props">
              {{ getGradeTypeLabel(props.row.grade_type) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section
        v-else-if="form.school_id && form.field_id && form.level_id && form.class_id && form.lesson_id"
        class="text-center text-grey">
        <div class="q-pa-md">هیچ نمره‌ای یافت نشد.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import GradeAPI from 'src/repositories/grade'
import LessonAPI from 'src/repositories/lesson'
import SchoolClassAPI from 'src/repositories/schoolClass'
import SchoolAPI from 'src/repositories/school'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import type { ListType, GradeType } from 'src/repositories/grade'

const gradeApi = new GradeAPI()
const lessonApi = new LessonAPI()
const schoolClassApi = new SchoolClassAPI()
const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()

const $q = useQuasar()

const grades = ref<GradeType[]>([])
const schoolOptions = ref<any[]>([])
const fieldOptions = ref<any[]>([])
const levelOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const lessonOptions = ref<any[]>([])
const loading = ref(false)

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
  grade_type: null as string | null,
  length: 10,
  page: 1
})

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const showTable = ref(false)

const columns = [
  { name: 'student', label: 'دانش آموز', align: 'right' as const, field: 'student' },
  { name: 'lesson', label: 'درس', align: 'right' as const, field: 'lesson.name' },
  { name: 'grade_type', label: 'نوع نمره', align: 'right' as const, field: 'grade_type' },
  { name: 'raw_grade', label: 'نمره خام', align: 'center' as const, field: 'raw_grade' },
  { name: 'max_score', label: 'حداکثر نمره', align: 'center' as const, field: 'max_score' },
  { name: 'min_passing_score', label: 'حداقل قبولی', align: 'center' as const, field: 'min_passing_score' },
  { name: 'persian_date', label: 'تاریخ', align: 'center' as const, field: 'persian_date' }
]

function getGradeTypeLabel (value: string | null): string {
  if (!value) return '-'
  const option = gradeTypeOptions.find((o) => o.value === value)
  return option?.label || value
}

async function loadGrades () {
  if (!form.class_id || !form.lesson_id) {
    grades.value = []
    showTable.value = false
    return
  }

  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1,
      school_id: form.school_id || undefined,
      field_id: form.field_id || undefined,
      level_id: form.level_id || undefined,
      class_ids: [form.class_id],
      lesson_id: form.lesson_id,
      grade_type: form.grade_type || undefined
    }

    const result = await gradeApi.index(params)
    grades.value = result.data
    pagination.value.rowsNumber = result.total
    showTable.value = true
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری نمرات.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function loadSchools () {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

async function loadFields (schoolId: number) {
  try {
    const result = await fieldApi.index({ length: 100, school_id: schoolId })
    fieldOptions.value = result.data
    form.field_id = null
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
    levelOptions.value = []
    classOptions.value = []
    lessonOptions.value = []
    grades.value = []
    showTable.value = false
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadLevels (fieldId: number) {
  try {
    const result = await levelApi.index({ length: 100, field_id: fieldId })
    levelOptions.value = result.data
    form.level_id = null
    form.class_id = null
    form.lesson_id = null
    classOptions.value = []
    lessonOptions.value = []
    grades.value = []
    showTable.value = false
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClasses (levelId: number) {
  try {
    const result = await schoolClassApi.index({ length: 100, level_id: levelId })
    classOptions.value = result.data
    form.class_id = null
    grades.value = []
    showTable.value = false
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

async function loadLessons (levelId: number) {
  try {
    const result = await lessonApi.index({ length: 100, level_id: levelId })
    lessonOptions.value = result.data
    form.lesson_id = null
    grades.value = []
    showTable.value = false
  } catch (error) {
    console.error('Error loading lessons:', error)
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
    grades.value = []
    showTable.value = false
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
    grades.value = []
    showTable.value = false
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
    grades.value = []
    showTable.value = false
    form.class_id = null
    form.lesson_id = null
  }
}

function onClassChange (classId: number | null) {
  grades.value = []
  showTable.value = false
  if (classId && form.lesson_id) {
    loadGrades()
  }
}

function onLessonChange (lessonId: number | null) {
  grades.value = []
  showTable.value = false
  if (lessonId && form.class_id) {
    loadGrades()
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadGrades()
}

onMounted(() => {
  loadSchools()
})
</script>