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
          class="column items-start q-gutter-y-xs">

          <!-- نمایش فقط جزئیات زمان‌بندی -->
          <div
            class="text-caption text-grey-8 column q-gutter-y-xs"
            style="font-size: 11px; line-height: 1.3;">
            <div class="row items-center no-wrap">
              <q-icon
                name="schedule"
                size="14px"
                class="q-mr-xs text-primary" />
              <span>شروع: {{ formatDateTime(inputData.props.row.online_exam_detail.starts_at) }}</span>
            </div>

            <div
              v-if="inputData.props.row.online_exam_detail.ends_at"
              class="row items-center no-wrap">
              <q-icon
                name="event_busy"
                size="14px"
                class="q-mr-xs text-negative" />
              <span>پایان: {{ formatDateTime(inputData.props.row.online_exam_detail.ends_at) }}</span>
            </div>

            <div
              v-if="inputData.props.row.online_exam_detail.time_limit_minutes"
              class="row items-center no-wrap text-weight-medium text-blue-grey-9">
              <q-icon
                name="timer"
                size="14px"
                class="q-mr-xs text-amber-9" />
              <span>مدت: {{ inputData.props.row.online_exam_detail.time_limit_minutes }} دقیقه</span>
            </div>
          </div>
        </div>
        <span
          v-else
          class="text-grey-5">-</span>
      </template>
      <template v-else-if="inputData.col.name === 'session_status'">

        <!-- چیپ وضعیت با آیکون -->
        <q-chip
          :color="getExamTimingStatus(inputData.props.row).color"
          :icon="getExamTimingStatus(inputData.props.row).icon"
          text-color="white"
          size="11px"
          dense
          class="q-ma-none font-weight-bold">
          {{ getExamTimingStatus(inputData.props.row).label }}
        </q-chip>

        <!--        <q-chip-->
        <!--          :color="getStatusColor(inputData.props.row)"-->
        <!--          text-color="white"-->
        <!--          dense>-->
        <!--          {{ getStatusLabel(inputData.props.row) }}-->
        <!--        </q-chip>-->
      </template>
      <template v-else-if="inputData.col.name === 'exam_status'">
        <q-chip
          :color="getExamStatusInfo(inputData.props.row).color"
          :icon="getExamStatusInfo(inputData.props.row).icon"
          text-color="white"
          size="sm"
          dense>
          {{ getExamStatusInfo(inputData.props.row).label }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'participation_status'">
        <q-chip
          :color="getParticipationInfo(inputData.props.row).color"
          :icon="getParticipationInfo(inputData.props.row).icon"
          :outline="getParticipationInfo(inputData.props.row).outline"
          :text-color="getParticipationInfo(inputData.props.row).textColor"
          size="sm"
          dense>
          {{ getParticipationInfo(inputData.props.row).label }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'percent'">
        {{ inputData.props.row.latest_session?.percent ? inputData.props.row.latest_session.percent + '%' : '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'timing'">
        <div
          v-if="getLatestSession(inputData.props.row)"
          class="column items-start q-gutter-y-xs text-caption text-grey-8">

          <!-- ۱. زمان شروع پاسخگویی دانش‌آموز -->
          <div
            v-if="getLatestSession(inputData.props.row)?.started_at"
            class="row items-center no-wrap">
            <q-icon
              name="play_circle_outline"
              size="14px"
              class="q-mr-xs text-primary" />
            <span>شروع: {{ formatDateTime(getLatestSession(inputData.props.row)?.started_at) }}</span>
          </div>

          <!-- ۲. زمان استفاده شده (با تفکیک کل زمان در صورت وجود) -->
          <div
            v-if="getLatestSession(inputData.props.row)?.time_used_seconds !== null && getLatestSession(inputData.props.row)?.time_used_seconds !== undefined"
            class="row items-center no-wrap text-weight-medium text-blue-grey-9">
            <q-icon
              name="timer"
              size="14px"
              class="q-mr-xs text-amber-9" />
            <span>
              استفاده شده: {{ formatTimeUsed(getLatestSession(inputData.props.row)?.time_used_seconds) }}
              <template v-if="getLatestSession(inputData.props.row)?.duration_limit_seconds">
                <span class="text-grey-6 text-weight-regular">
                  / {{ formatTimeUsed(getLatestSession(inputData.props.row)?.duration_limit_seconds) }}
                </span>
              </template>
            </span>
          </div>

          <!-- ۳. زمان ارسال پاسخ / پایان جلسه -->
          <div
            v-if="getLatestSession(inputData.props.row)?.submitted_at"
            class="row items-center no-wrap text-positive">
            <q-icon
              name="task_alt"
              size="14px"
              class="q-mr-xs" />
            <span>ارسال: {{ formatDateTime(getLatestSession(inputData.props.row)?.submitted_at) }}</span>
          </div>

          <!-- اگر هنوز ارسال نکرده و در حال آزمونه -->
          <div
            v-else-if="getLatestSession(inputData.props.row)?.status === 'in_progress'"
            class="row items-center no-wrap text-warning text-weight-medium">
            <q-icon
              name="pending"
              size="14px"
              class="q-mr-xs" />
            <span>در حال آزمون...</span>
          </div>

        </div>

        <!-- حالتی که هنوز هیچ جلسه‌ای ثبت نشده -->
        <span
          v-else
          class="text-grey-5">-</span>
      </template>

      <template v-else-if="inputData.col.name === 'actions'">
        <div class="row items-center no-wrap q-gutter-x-sm action-column-entity-index">

          <!-- ۱. دکمه شروع / ادامه آزمون -->
          <q-btn
            v-if="canStart(inputData.props.row)"
            unelevated
            dense
            no-caps
            :color="getStartBtnColor(inputData.props.row)"
            :icon="getStartBtnIcon(inputData.props.row)"
            :label="getActionLabel(inputData.props.row)"
            class="q-px-sm action-btn-main"
            @click.stop="startExam(inputData.props.row)">
            <q-tooltip>
              {{ getActionTooltip(inputData.props.row) }}
            </q-tooltip>
          </q-btn>

          <!-- ۲. دکمه مشاهده کارنامه / نتیجه آزمون -->
          <q-btn
            v-else-if="canViewResult(inputData.props.row)"
            outline
            dense
            no-caps
            color="info"
            icon="analytics"
            label="مشاهده کارنامه"
            class="q-px-sm action-btn-main"
            @click.stop="viewResult(inputData.props.row)">
            <q-tooltip>
              مشاهده جزئیات کارنامه و درصدها
            </q-tooltip>
          </q-btn>

          <!-- ۳. حالت غیرقابل دسترس (مثلاً قبل از شروع آزمون یا بدون دسترسی) -->
          <q-btn
            v-else
            flat
            dense
            disable
            color="grey-6"
            icon="lock"
            label="غیرفعال"
            class="q-px-sm text-grey-6 action-btn-disabled">
            <q-tooltip>
              امکان شرکت در این آزمون وجود ندارد
            </q-tooltip>
          </q-btn>

          <!-- ۴. دکمه مشاهده اطلاعات / جزئیات آزمون (Secondary Action) -->
          <q-btn
            round
            flat
            dense
            size="sm"
            color="grey-7"
            icon="visibility"
            class="action-btn-icon"
            @click.stop="viewExam(inputData.props.row)">
            <q-tooltip>
              مشاهده جزئیات آزمون
            </q-tooltip>
          </q-btn>

        </div>
      </template>

      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { EntityIndex } from 'quasar-crud'
import { exam, type ExamType } from 'src/repositories/exam'
import type { OnlineExamSessionType } from 'src/repositories/onlineExamSession'

interface ExamTimingStatus {
  label: string
  color: string
  icon: string
}


const router = useRouter()
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
    { name: 'participation_status', label: 'وضعیت شرکت', align: 'center' as const, field: 'latest_session' },
    { name: 'percent', label: 'درصد', align: 'center' as const, field: 'percent' },
    { name: 'timing', label: 'زمان', align: 'center' as const, field: 'latest_session' },
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

const getExamTimingStatus = (row: any): ExamTimingStatus => {
  const detail = row?.online_exam_detail
  if (!detail) {
    return { label: 'نامشخص', color: 'grey-6', icon: 'help_outline' }
  }

  const now = Date.now()
  const startsAt = detail.starts_at ? new Date(detail.starts_at).getTime() : null
  const endsAt = detail.ends_at ? new Date(detail.ends_at).getTime() : null

  // آزمون هنوز نرسیده
  if (startsAt && now < startsAt) {
    return {
      label: 'شروع نشده',
      color: 'blue-7',
      icon: 'schedule'
    }
  }

  // آزمون تموم شده
  if (endsAt && now > endsAt) {
    return {
      label: 'پایان یافته',
      color: 'grey-7',
      icon: 'event_busy'
    }
  }

  // در حال حاضر فعاله و میشه شرکت کرد
  if (startsAt && now >= startsAt && (!endsAt || now <= endsAt)) {
    return {
      label: 'در حال برگزاری',
      color: 'positive',
      icon: 'play_circle'
    }
  }

  // آزمون بدون تاریخ مشخص (آزاد)
  return {
    label: 'آزاد',
    color: 'teal-7',
    icon: 'all_inclusive'
  }
}

interface StatusBadgeInfo {
  label: string
  color: string
  icon: string
  outline?: boolean
  textColor?: string
}

// 🎯 محاسبه وضعیت کلی آزمون (پنجره زمانی آزمون)
const getExamStatusInfo = (examItem: ExamType): StatusBadgeInfo => {
  const detail = examItem.online_exam_detail
  if (!detail) {
    return { label: 'بدون جزئیات', color: 'grey-6', icon: 'help_outline' }
  }

  const now = Date.now()
  const startsAt = detail.starts_at ? new Date(detail.starts_at).getTime() : null
  const endsAt = detail.ends_at ? new Date(detail.ends_at).getTime() : null

  if (startsAt && now < startsAt) {
    return { label: 'شروع نشده', color: 'blue-7', icon: 'schedule' }
  }

  if (endsAt && now > endsAt) {
    return { label: 'پایان یافته', color: 'grey-7', icon: 'event_busy' }
  }

  if (startsAt && now >= startsAt && (!endsAt || now <= endsAt)) {
    return { label: 'در حال برگزاری', color: 'positive', icon: 'sensors' }
  }

  return { label: 'آزاد', color: 'teal-7', icon: 'all_inclusive' }
}

// 🎯 محاسبه وضعیت حضور و مشارکت دانش‌آموز در آزمون
const getParticipationInfo = (examItem: ExamType): StatusBadgeInfo => {
  const session = getLatestSession(examItem)

  // دانش‌آموز اصلاً تلاشی نکرده
  if (!session || !session.status || session.status === 'not_started') {
    return {
      label: 'شرکت نکرده',
      color: 'grey-5',
      textColor: 'grey-8',
      icon: 'person_off',
      outline: true // ظاهر Outline باعث می‌شه سطر خلوت بمونه
    }
  }

  // وضعیت‌های مربوط به جلسه فعال یا ارسال شده
  switch (session.status) {
    case 'in_progress':
      return {
        label: 'در حال پاسخگویی',
        color: 'warning',
        textColor: 'white',
        outline: false,
        icon: 'edit_note'
      }
    case 'submitted':
      return {
        label: 'ارسال شده',
        color: 'info',
        textColor: 'white',
        outline: false,
        icon: 'mark_email_read'
      }
    case 'graded':
      return {
        label: 'اتمام یافته',
        color: 'positive',
        textColor: 'white',
        outline: false,
        icon: 'check_circle'
      }
    case 'expired':
      return {
        label: 'منقضی شده',
        color: 'negative',
        textColor: 'white',
        outline: false,
        icon: 'timer_off'
      }
    default:
      return {
        label: 'نامشخص',
        color: 'grey-6',
        textColor: 'white',
        outline: false,
        icon: 'help'
      }
  }
}

// رنگ داینامیک دکمه شرکت/ادامه
const getStartBtnColor = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  if (session?.status === 'in_progress') {
    return 'warning' // رنگ نارنجی/امبر برای «ادامه آزمون»
  }
  return 'positive' // رنگ سبز برای «شروع آزمون»
}

// آیکون داینامیک دکمه شرکت/ادامه
const getStartBtnIcon = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  if (session?.status === 'in_progress') {
    return 'play_arrow'
  }
  return 'login'
}

// متن تولتیپ کمکی
const getActionTooltip = (examItem: ExamType) => {
  const session = getLatestSession(examItem)
  if (session?.status === 'in_progress') {
    return 'ادامه پاسخگویی به سوالات آزمون'
  }
  return 'ورود به محیط آزمون و شروع'
}

</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
