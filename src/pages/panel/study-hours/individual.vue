<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">گزارش ساعت مطالعه - انفرادی</h4>
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
              map-options
              use-input
              @filter="filterStudents" />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.date_from"
              label="از تاریخ"
              outlined
              dense
              mask="date">
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-date
                      v-model="filters.date_from"
                      color="primary" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.date_to"
              label="تا تاریخ"
              outlined
              dense
              mask="date">
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-date
                      v-model="filters.date_to"
                      color="primary" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="selectedStudent && totalMinutes !== null"
      class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md text-center">
          <div class="col-6 col-md-4">
            <q-chip
              color="primary"
              text-color="white"
              class="full-width">
              <div class="column">
                <span class="text-h6">{{ studentName }}</span>
                <span class="text-caption">دانش آموز</span>
              </div>
            </q-chip>
          </div>
          <div class="col-6 col-md-4">
            <q-chip
              color="green"
              text-color="white"
              class="full-width">
              <div class="column">
                <span class="text-h6">{{ totalMinutes }}</span>
                <span class="text-caption">کل دقیقه</span>
              </div>
            </q-chip>
          </div>
          <div class="col-6 col-md-4">
            <q-chip
              color="blue"
              text-color="white"
              class="full-width">
              <div class="column">
                <span class="text-h6">{{ totalHours }}</span>
                <span class="text-caption">کل ساعت</span>
              </div>
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <q-table
          :rows="sessions"
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { studySession } from 'src/repositories/studySession'
import { student } from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()

const selectedStudent = ref<number | null>(null)
const studentOptions = ref<any[]>([])
const allStudents = ref<any[]>([])
const sessions = ref<any[]>([])
const loading = ref(false)
const studentName = ref('')
const totalMinutes = ref<number | null>(null)
const totalHours = ref<number | null>(null)

const filters = reactive({
  date_from: null as string | null,
  date_to: null as string | null,
  length: 20,
  page: 1
})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'lesson', label: 'درس', align: 'center' as const, field: 'lesson' },
  { name: 'started_at', label: 'زمان شروع', align: 'center' as const, field: 'started_at' },
  { name: 'duration_minutes', label: 'مدت زمان (دقیقه)', align: 'center' as const, field: 'duration_minutes' }
]

const loadStudents = async () => {
  try {
    const result = await student.index({ length: 100 })
    allStudents.value = result.data.map((s: any) => ({
      id: s.id,
      full_name: s.full_name || `${s.first_name} ${s.last_name}`,
      ...s
    }))
    studentOptions.value = allStudents.value
  } catch (error) {
    $q.notify({ color: 'negative', message: 'خطا در بارگذاری دانش آموزان' })
  }
}

const filterStudents = (val: string, update: any) => {
  if (val === '') {
    update(() => { studentOptions.value = allStudents.value })
    return
  }
  update(() => {
    studentOptions.value = allStudents.value.filter((s: any) =>
      s.full_name?.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const loadReport = async () => {
  if (!selectedStudent.value) {
    sessions.value = []
    totalMinutes.value = null
    totalHours.value = null
    return
  }

  loading.value = true
  try {
    const student = allStudents.value.find((s: any) => s.id === selectedStudent.value)
    studentName.value = student?.full_name || ''

    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    }
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to

    const result = await studySession.studentReport(selectedStudent.value, params)
    sessions.value = result.sessions?.data || result.sessions || []
    totalMinutes.value = result.total_minutes
    totalHours.value = result.total_hours
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری گزارش' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadReport()
}

onMounted(() => {
  loadStudents()
  if (route.params.studentId) {
    selectedStudent.value = Number(route.params.studentId)
    loadReport()
  }
})
</script>

<style scoped>
</style>
