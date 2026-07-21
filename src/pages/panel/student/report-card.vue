<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">کارنامه</h4>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.grade_type"
            :options="gradeTypeOptions"
            label="نوع نمره"
            outlined
            clearable
            emit-value
            map-options
            @update:model-value="loadReportCard" />
        </div>
      </div>

      <q-card>
        <q-card-section>
          <q-table
            v-if="grades.length > 0"
            :rows="grades"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 20 }">
            <template #body-cell-lesson="{ row }">
              <q-td>{{ row.lesson?.name || '-' }}</q-td>
            </template>
            <template #body-cell-class="{ row }">
              <q-td>{{ row.schoolClass?.name || '-' }}</q-td>
            </template>
            <template #body-cell-raw_grade="{ row }">
              <q-td>
                <q-chip
                  :color="getGradeColor(row)"
                  text-color="white"
                  :label="row.raw_grade" />
              </q-td>
            </template>
          </q-table>
          <div
            v-else
            class="text-center q-pa-lg">
            <p>هیچ کارنامه‌ای یافت نشد</p>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'

const $q = useQuasar()
const loading = ref(false)
const grades = ref<any[]>([])

const filters = reactive({
  grade_type: null as string | null
})

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

const columns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'class', label: 'کلاس', field: 'class', align: 'center' as const },
  { name: 'raw_grade', label: 'نمره', field: 'raw_grade', align: 'center' as const },
  {
    name: 'calculated_grade',
    label: 'نمره محاسبه',
    field: 'calculated_grade',
    align: 'center' as const
  },
  { name: 'grade_type', label: 'نوع', field: 'grade_type', align: 'center' as const },
  { name: 'gregorian_date', label: 'تاریخ', field: 'gregorian_date', align: 'center' as const }
]

const getGradeColor = (grade: any): string => {
  if (!grade.min_grade) return 'primary'
  return grade.raw_grade >= grade.min_grade ? 'positive' : 'negative'
}

const loadReportCard = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filters.grade_type) params.grade_type = filters.grade_type
    const response = await student.reportCard(params)
    grades.value = response.data.data || response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری کارنامه' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReportCard()
})
</script>
