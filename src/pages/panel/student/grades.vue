<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">نمرات من</h4>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="grades.length === 0"
      class="text-center q-pa-lg">
      <q-icon
        name="grade"
        size="100px"
        color="primary" />
      <p class="text-subtitle1 q-mt-md">هیچ نمره‌ای ثبت نشده</p>
    </div>

    <!-- Grades Table -->
    <q-table
      v-else
      flat
      bordered
      :rows="grades"
      :columns="columns"
      row-key="id"
      class="grades-table"
      pagination.sync="pagination">
      <template #body-cell-lesson_name="props">
        <q-td :props="props">
          {{ props.row.lesson?.name || '-' }}
        </q-td>
      </template>

      <template #body-cell-grade_value="props">
        <q-td :props="props">
          <q-chip
            :color="getGradeColor(props.row.grade_value)"
            text-color="white"
            :label="`${props.row.grade_value.toFixed(2)}`" />
        </q-td>
      </template>

      <template #body-cell-exam_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.exam_date) }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gradeRepository } from 'src/repositories/grade'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const grades = ref<any[]>([])
const loading = ref(true)
const pagination = ref({ rowsPerPage: 10 })

const columns = [
  { name: 'lesson_name', label: 'درس', field: 'lesson_name' },
  { name: 'grade_value', label: 'نمره', field: 'grade_value' },
  { name: 'exam_date', label: 'تاریخ', field: 'exam_date' }
]

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getGradeColor = (grade: number): string => {
  if (grade >= 90) return 'positive'
  if (grade >= 70) return 'info'
  if (grade >= 50) return 'warning'
  return 'negative'
}

const loadGrades = async () => {
  loading.value = true
  try {
    const response = await gradeRepository.list()
    grades.value = response.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری نمرات'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGrades()
})
</script>

<style scoped>
.grades-table {
  border-radius: 8px;
}
</style>
