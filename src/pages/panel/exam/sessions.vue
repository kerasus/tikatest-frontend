<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جلسات آزمون آنلاین — {{ examName || '-' }}</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="بازگشت"
          :to="{ name: 'Panel.Exam.Online.Show', params: { id: examId } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <q-table
        :rows="sessions"
        :columns="columns"
        row-key="id"
        dense
        separator="cell"
        :rows-per-page-options="[15, 30, 50]"
        :pagination="{ rowsPerPage: 15 }"
        class="q-mb-md">
        <template #body-cell-starts_at="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.started_at) }}
          </q-td>
        </template>
        <template #body-cell-submitted_at="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.submitted_at) }}
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense>
              {{ getStatusLabel(props.row.status) }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-score="props">
          <q-td :props="props">
            {{ props.row.score ?? '-' }}
          </q-td>
        </template>
        <template #body-cell-percent="props">
          <q-td :props="props">
            {{ props.row.percent ?? '-' }}
          </q-td>
        </template>
        <template #body-cell-time_used_seconds="props">
          <q-td :props="props">
            {{ formatDuration(props.row.time_used_seconds) }}
          </q-td>
        </template>
        <template #body-cell-duration_limit_seconds="props">
          <q-td :props="props">
            {{ formatDuration(props.row.duration_limit_seconds) }}
          </q-td>
        </template>
        <template #body-cell-student="props">
          <q-td :props="props">
            {{
              props.row.student?.full_name ||
                props.row.student?.first_name ||
                props.row.student?.last_name ||
                '-'
            }}
          </q-td>
        </template>
        <template #body-cell-attempt_number="props">
          <q-td :props="props">
            {{ props.row.attempt_number ?? '-' }}
          </q-td>
        </template>
      </q-table>

      <div
        v-if="!sessions.length"
        class="text-center q-pa-lg text-grey">جلسه آزمونی یافت نشد.</div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDate } from 'src/composables/Date'
import { exam } from 'src/repositories/exam'
import OnlineExamSessionAPI, { OnlineExamSessionType } from 'src/repositories/onlineExamSession'

const route = useRoute()
const $q = useQuasar()
const dateManager = useDate()
const onlineExamSessionAPI = new OnlineExamSessionAPI()

const loading = ref(true)
const examName = ref<string | null>(null)
const sessions = ref<OnlineExamSessionType[]>([])
const examId = computed(() => parseInt(route.params.id as string))

const columns = [
  { name: 'student', label: 'دانش‌آموز', field: 'student', align: 'left' as const },
  { name: 'status', label: 'وضعیت', field: 'status', align: 'center' as const },
  {
    name: 'attempt_number',
    label: 'شماره تلاش',
    field: 'attempt_number',
    align: 'center' as const
  },
  { name: 'started_at', label: 'شروع شده در', field: 'started_at', align: 'center' as const },
  { name: 'submitted_at', label: 'ثبت شده در', field: 'submitted_at', align: 'center' as const },
  {
    name: 'time_used_seconds',
    label: 'زمان صرف شده',
    field: 'time_used_seconds',
    align: 'center' as const
  },
  {
    name: 'duration_limit_seconds',
    label: 'محدودیت زمان',
    field: 'duration_limit_seconds',
    align: 'center' as const
  },
  { name: 'score', label: 'نمره', field: 'score', align: 'center' as const },
  { name: 'percent', label: 'درصد', field: 'percent', align: 'center' as const }
]

const statusLabels: Record<string, string> = {
  not_started: 'شروع نشده',
  in_progress: 'در حال انجام',
  submitted: 'ثبت شده',
  graded: 'نمره‌گذاری شده',
  expired: 'منقضی شده'
}

const statusColors: Record<string, string> = {
  not_started: 'grey',
  in_progress: 'primary',
  submitted: 'warning',
  graded: 'positive',
  expired: 'negative'
}

function getStatusColor (status: string | null): string {
  if (!status) return 'grey'
  return statusColors[status] ?? 'grey'
}

function getStatusLabel (status: string | null): string {
  if (!status) return '-'
  return statusLabels[status] ?? status
}

function formatDateTime (value: string | null): string {
  if (!value) return '-'
  return (
    dateManager.miladiToShamsi(value, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || value
  )
}

function formatDuration (seconds: number | null): string {
  if (seconds == null) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ساعت`
  }
  return `${m}:${String(s).padStart(2, '0')} دقیقه`
}

async function loadExam () {
  loading.value = true
  try {
    const response = await exam.get(examId.value)
    examName.value = response.name || null

    const sessionsResponse = await onlineExamSessionAPI.getExamSessions(examId.value)
    sessions.value = sessionsResponse
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadExam()
})
</script>
