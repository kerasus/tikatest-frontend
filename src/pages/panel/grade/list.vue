<template>
  <div class="grade-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.lesson_id"
              :options="lessonOptions"
              option-value="id"
              option-label="name"
              label="درس"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadGrades" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.class_id"
              :options="classOptions"
              option-value="id"
              option-label="name"
              label="کلاس"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadGrades" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.grade_type"
              :options="gradeTypeOptions"
              label="نوع نمره"
              outlined
              dense
              clearable
              @update:model-value="loadGrades" />
          </div>
          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              icon="add"
              label="ثبت نمره"
              :to="{ name: 'Panel.Grade.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="grades"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-student="props">
            <q-td :props="props">
              {{ props.row.student?.name }} {{ props.row.student?.lastname }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import GradeAPI from 'src/repositories/grade'
import LessonAPI from 'src/repositories/lesson'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { ListType, GradeType } from 'src/repositories/grade'

const $q = useQuasar()

const grades = ref<GradeType[]>([])
const lessonOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
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

const filters = reactive({
  lesson_id: null,
  class_id: null,
  grade_type: null,
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

const columns = [
  { name: 'student', label: 'دانش آموز', align: 'right' as const, field: 'student' },
  { name: 'lesson', label: 'درس', align: 'right' as const, field: 'lesson.name' },
  { name: 'grade_type', label: 'نوع نمره', align: 'right' as const, field: 'grade_type' },
  { name: 'raw_grade', label: 'نمره خام', align: 'center' as const, field: 'raw_grade' },
  { name: 'calculated_grade', label: 'نمره محاسبه شده', align: 'center' as const, field: 'calculated_grade' },
  { name: 'persian_date', label: 'تاریخ', align: 'center' as const, field: 'persian_date' }
]

async function loadGrades () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.lesson_id) params.lesson_id = filters.lesson_id
    if (filters.class_id) params.class_ids = [filters.class_id]
    if (filters.grade_type) params.grade_type = filters.grade_type

    const result = await GradeAPI.prototype.index(params)
    grades.value = result.data
    pagination.value.rowsNumber = result.total
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

async function loadLessons () {
  const result = await LessonAPI.prototype.index({ length: 100 })
  lessonOptions.value = result.data
}

async function loadClasses () {
  const result = await SchoolClassAPI.prototype.index({ length: 100 })
  classOptions.value = result.data
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadGrades()
}

onMounted(() => {
  loadLessons()
  loadClasses()
  loadGrades()
})
</script>

<style lang="scss" scoped>
</style>
