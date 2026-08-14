<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'category'">
        {{ inputData.props.row.category?.title || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'exam_timing'">
        <div
          v-if="inputData.props.row.online_exam_detail"
          class="text-caption">
          <div>شروع: {{ formatDateTime(inputData.props.row.online_exam_detail.starts_at) }}</div>
          <div v-if="inputData.props.row.online_exam_detail.ends_at">
            پایان: {{ formatDateTime(inputData.props.row.online_exam_detail.ends_at) }}
          </div>
          <div v-if="inputData.props.row.online_exam_detail.time_limit_minutes">
            مدت: {{ inputData.props.row.online_exam_detail.time_limit_minutes }} دقیقه
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template v-else-if="inputData.col.name === 'session_status'">
        <q-chip
          :color="getStatusColor(inputData.props.row)"
          text-color="white"
          dense>
          {{ getStatusLabel(inputData.props.row) }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'percent'">
        {{ inputData.props.row.latest_session?.percent ? inputData.props.row.latest_session.percent + '%' : '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'timing'">
        <div
          v-if="inputData.props.row.latest_session"
          class="text-caption">
          <div>استفاده شده: {{ formatTimeUsed(inputData.props.row.latest_session.time_used_seconds) }}</div>
          <div>کل زمان: {{ formatTimeUsed(inputData.props.row.latest_session.duration_limit_seconds) }}</div>
        </div>
        <div v-else>-</div>
      </template>
      <template v-else-if="inputData.col.name === 'attempt'">
        {{ inputData.props.row.latest_session?.attempt_number || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            v-if="canStart(inputData.props.row)"
            flat
            dense
            color="positive"
            icon="play_arrow"
            :label="getActionLabel(inputData.props.row)"
            @click.stop="startExam(inputData.props.row)" />
          <q-btn
            v-else-if="canViewResult(inputData.props.row)"
            flat
            dense
            color="info"
            icon="visibility"
            label="نتیجه"
            @click.stop="viewResult(inputData.props.row)" />
          <q-btn
            flat
            dense
            color="primary"
            icon="visibility"
            @click.stop="viewExam(inputData.props.row)" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { exam, ExamType } from 'src/repositories/exam'
import { OnlineExamSessionType } from 'src/repositories/onlineExamSession'

const router = useRouter()
const $q = useQuasar()
const entityIndexRef = ref()

const api = ref(exam.endpoints.studentOnlineExams)
const label = ref('آزمون‌های آنلاین')
const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    {
      name: 'name',
      required: true,
      label: 'نام آزمون',
      align: 'center' as const,
      field: 'name',
      sortable: true
    },
    { name: 'category', label: 'دسته‌بندی', align: 'center' as const, field: 'category' },
    { name: 'exam_timing', label: 'برنامه زمانی', align: 'center' as const, field: 'online_exam_detail' },
    { name: 'session_status', label: 'وضعیت جلسه', align: 'center' as const, field: 'session_status' },
    { name: 'percent', label: 'درصد', align: 'center' as const, field: 'percent' },
    { name: 'timing', label: 'زمان', align: 'center' as const, field: 'latest_session' },
    { name: 'attempt', label: 'تلاش', align: 'center' as const, field: 'attempt_number' },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})

const inputs = ref([
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
  },
  {
    type: 'hidden',
    name: 'length',
    value: 10
  }
])

const getLatestSession = (examItem: ExamType): OnlineExamSessionType | null => {
  return examItem.latest_session ?? examItem.online_exam_sessions?.[0] ?? null
}

const isExamWindowOpen = (examItem: ExamType) => {
  if (!examItem.online_exam_detail) return false
  const detail = examItem.online_exam_detail
  if (detail.visible_at && new Date(detail.visible_at) > new Date()) return false
  if (detail.starts_at && new Date(detail.starts_at) > new Date()) return false
  if (detail.ends_at && new Date(detail.ends_at) < new Date()) return false
  return true
}

const canStart = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  if (session?.status === 'in_progress') return true
  if (session && ['submitted', 'graded', 'expired'].includes(session.status || '')) return false
  return isExamWindowOpen(examItem)
}

const canViewResult = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  return ['submitted', 'graded'].includes(session?.status || '')
}

const getSessionStatusLabel = (status: OnlineExamSessionType['status']) => {
  const labels: Record<string, string> = {
    not_started: 'شرکت نکرده',
    in_progress: 'در حال انجام',
    submitted: 'ارسال شده',
    graded: 'اتمام یافته',
    expired: 'منقضی شده'
  }
  return labels[status || ''] || 'نامشخص'
}

const getStatusLabel = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  if (session?.status) {
    return getSessionStatusLabel(session.status)
  }
  if (!examItem.online_exam_detail) return 'بدون جزئیات'
  if (!isExamWindowOpen(examItem)) return 'غیرفعال'
  return 'فعال'
}

const getStatusColor = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  switch (session?.status) {
    case 'in_progress':
      return 'warning'
    case 'submitted':
    case 'graded':
      return 'positive'
    case 'expired':
      return 'negative'
    default:
      return isExamWindowOpen(examItem) ? 'primary' : 'grey'
  }
}

const getActionLabel = (examItem: ExamType) => {
  return getLatestSession(examItem)?.status === 'in_progress' ? 'ادامه' : 'شرکت'
}

const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fa-IR')
}

const formatTimeUsed = (seconds: number | null | undefined) => {
  if (!seconds && seconds !== 0) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startExam = (examItem: ExamType) => {
  router.push({ name: 'Student.Exam.Attempt', params: { id: examItem.id } })
}

const viewExam = (examItem: ExamType) => {
  router.push({ name: 'Student.Exam.Show', params: { id: examItem.id } })
}

const viewResult = (examItem: ExamType) => {
  router.push({ name: 'Student.Exam.Result', params: { id: examItem.id } })
}
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
