<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">گزارش نمرات دانش آموز</h4>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="grades"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-lesson="props">
            <q-td :props="props">
              {{ props.row.lesson?.name || '-' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { grade } from 'src/repositories/grade'

const route = useRoute()
const $q = useQuasar()

const grades = ref<any[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'lesson', label: 'درس', align: 'right' as const, field: 'lesson' },
  { name: 'raw_grade', label: 'نمره خام', align: 'center' as const, field: 'raw_grade' },
  { name: 'calculated_grade', label: 'نمره محاسبه شده', align: 'center' as const, field: 'calculated_grade' },
  { name: 'grade_type', label: 'نوع نمره', align: 'center' as const, field: 'grade_type' },
  { name: 'persian_date', label: 'تاریخ', align: 'center' as const, field: 'persian_date' }
]

const loadGrades = async () => {
  const studentId = route.params.studentId as string
  if (!studentId) return

  loading.value = true
  try {
    const result = await grade.studentReport(Number(studentId))
    grades.value = result
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری گزارش' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadGrades()
}

onMounted(() => {
  loadGrades()
})
</script>

<style scoped>
</style>