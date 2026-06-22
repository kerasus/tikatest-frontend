<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">کارنامه دانش آموز</h4>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="selectedStudent"
              :options="studentOptions"
              option-value="id"
              option-label="full_name"
              label="دانش آموز"
              outlined
              dense
              clearable
              emit-value
              map-options />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              label="مشاهده کارنامه"
              @click="loadReportCard"
              :loading="loading"
              class="full-height" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="reportCard.length > 0">
      <q-card-section>
        <q-table
          :rows="reportCard"
          :columns="columns"
          row-key="id"
          flat>
          <template #body-cell-lesson="{ props }">
            <q-td :props="props">
              {{ props.row.lesson?.name || '-' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <div v-if="!reportCard.length && !loading && selectedStudent" class="text-center q-pa-lg">
      <q-icon name="grading" size="100px" color="grey-5" />
      <p class="text-subtitle1 q-mt-md">کارنامه ای برای این دانش آموز یافت نشد</p>
    </div>

    <div v-if="!selectedStudent && !loading" class="text-center q-pa-lg">
      <q-icon name="person" size="100px" color="grey-5" />
      <p class="text-subtitle1 q-mt-md">دانش آموزی را انتخاب کنید تا کارنامه نمایش داده شود</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { grade } from 'src/repositories/grade'
import { student } from 'src/repositories/student'

const $q = useQuasar()

const selectedStudent = ref<number | null>(null)
const studentOptions = ref<any[]>([])
const reportCard = ref<any[]>([])
const loading = ref(false)

const columns = [
  { name: 'lesson', label: 'درس', align: 'right' as const, field: 'lesson' },
  { name: 'raw_grade', label: 'نمره', align: 'center' as const, field: 'raw_grade' },
  { name: 'grade_type', label: 'نوع نمره', align: 'center' as const, field: 'grade_type' },
  { name: 'persian_date', label: 'تاریخ', align: 'center' as const, field: 'persian_date' }
]

const loadStudents = async () => {
  try {
    const result = await student.index({ length: 100 })
    studentOptions.value = result.data.map((s: any) => ({
      id: s.id,
      full_name: s.full_name || `${s.firstname} ${s.lastname}`,
      ...s
    }))
  } catch (error) {
    $q.notify({ color: 'negative', message: 'خطا در بارگذاری دانش آموزان' })
  }
}

const loadReportCard = async () => {
  if (!selectedStudent.value) {
    $q.notify({ color: 'warning', message: 'دانش آموزی را انتخاب کنید' })
    return
  }

  loading.value = true
  try {
    const result = await grade.index({ student_ids: [selectedStudent.value], is_report_card: true })
    reportCard.value = result.data
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری کارنامه' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
</style>