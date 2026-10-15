<template>
  <q-page class="q-pa-md">

    <!-- هدر صفحه کاملاً همسو با سیستم لایوت Quasar -->
    <div
      class="row items-center justify-between q-col-gutter-sm"
      style="margin-bottom: 40px;">
      <div
        class="col-12 col-sm-auto row items-center no-wrap"
        style="min-width: 0;">
        <q-btn
          flat
          round
          dense
          color="grey-8"
          icon="arrow_forward"
          class="bg-white shadow-1 q-mr-sm flex-shrink-0"
          @click="goBack">
          <q-tooltip>بازگشت به لیست آزمون‌ها</q-tooltip>
        </q-btn>

        <div style="min-width: 0; flex: 1 1 auto; overflow: hidden;">
          <div class="text-caption text-grey-7 ellipsis">پنل دانش‌آموز / جزئیات آزمون</div>
          <div class="text-h6 text-weight-bolder text-dark q-my-none ellipsis">
            سکوی ورود به آزمون
          </div>
        </div>
      </div>

      <!-- دکمه‌های اکشن بالا -->
      <div class="col-12 col-sm-auto row items-center justify-end q-gutter-x-sm">
        <q-btn
          flat
          dense
          color="primary"
          icon="refresh"
          label="بروزرسانی"
          class="bg-white shadow-1 q-px-sm"
          :loading="loading"
          @click="loadExam" />
      </div>
    </div>

    <!-- اسکلتون لودینگ -->
    <div
      v-if="loading"
      class="column q-gutter-y-md">
      <q-skeleton
        type="rect"
        height="120px"
        class="rounded-borders" />
      <div class="row q-col-gutter-md">
        <div
          v-for="i in 4"
          :key="i"
          class="col-6 col-md-3">
          <q-skeleton
            type="rect"
            height="70px"
            class="rounded-borders" />
        </div>
      </div>
      <q-skeleton
        type="rect"
        height="220px"
        class="rounded-borders" />
    </div>

    <!-- محتوای اصلی پنل -->
    <div
      v-else-if="examData"
      class="column q-gutter-y-md">

      <!-- هیرو کارت اصلی (CTA Hero) -->
      <div class="q-pa-md row items-center justify-between q-col-gutter-md bg-white shadow-1 rounded-borders">
        <div class="col-12 col-md-7">
          <div class="row items-center q-gutter-x-xs q-mb-xs">
            <q-badge
              rounded
              color="blue-1"
              text-color="primary">
              <q-icon
                name="category"
                size="13px"
                class="q-mr-xs" />
              {{ examData.category?.title || 'آزمون آنلاین' }}
            </q-badge>
            <q-badge
              v-if="examData.lesson?.name"
              rounded
              color="teal-1"
              text-color="teal-9">
              <q-icon
                name="menu_book"
                size="13px"
                class="q-mr-xs" />
              {{ examData.lesson.name }}
            </q-badge>
            <q-badge
              dense
              :color="examStatus.color"
              class="q-px-sm text-weight-bold">
              <q-icon
                :name="examStatus.icon"
                size="13px"
                class="q-mr-xs" />
              {{ examStatus.label }}
            </q-badge>
          </div>

          <div class="text-h6 text-weight-bolder text-grey-9 ellipsis q-mt-xs">
            {{ examData.name }}
          </div>
          <div class="text-caption text-grey-7 ellipsis">
            {{ actionHint }}
          </div>
        </div>

        <!-- بخش عملیات مستقیم (CTA Button) -->
        <div class="col-12 col-md-5 row items-center justify-end q-gutter-x-sm">
          <q-btn
            v-if="canStart"
            unelevated
            size="md"
            :color="sessionStatus === 'in_progress' ? 'warning' : 'primary'"
            class="action-btn text-weight-bolder text-white q-px-lg shadow-2"
            :icon="sessionStatus === 'in_progress' ? 'play_arrow' : 'rocket_launch'"
            :label="sessionStatus === 'in_progress' ? 'ادامه آزمون' : 'شروع آزمون'"
            @click="startExam" />

          <q-btn
            v-else-if="canViewResult"
            unelevated
            size="md"
            color="positive"
            class="action-btn text-weight-bolder text-white q-px-lg shadow-2"
            icon="analytics"
            label="مشاهده کارنامه"
            @click="viewResult" />

          <q-btn
            v-else
            disable
            unelevated
            size="md"
            color="grey-4"
            text-color="grey-7"
            icon="lock"
            label="ورود غیرفعال" />
        </div>
      </div>

      <!-- نوار متریک‌های چهارگانه (Mini Stat Strip) -->
      <div class="row q-col-gutter-sm">
        <div class="col-6 col-md-4">
          <div class="row items-center no-wrap bg-white shadow-1 rounded-borders q-pa-sm">
            <q-avatar
              size="34px"
              class="q-mr-sm"
              color="blue-1"
              text-color="primary"
              icon="timer" />
            <div style="min-width: 0; overflow: hidden;">
              <div
                class="text-caption text-grey-7"
                style="font-size: 11px;">مدت زمان</div>
              <div class="text-subtitle2 text-weight-bolder text-grey-9">
                {{ examData.online_exam_detail?.time_limit_minutes ?? '-' }} <span class="text-caption">دقیقه</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <div class="row items-center no-wrap bg-white shadow-1 rounded-borders q-pa-sm">
            <q-avatar
              size="34px"
              class="q-mr-sm"
              :color="participationInfo.bgLight"
              :text-color="participationInfo.textColor"
              :icon="participationInfo.icon" />
            <div style="min-width: 0; overflow: hidden;">
              <div
                class="text-caption text-grey-7"
                style="font-size: 11px;">وضعیت پاسخ</div>
              <div
                class="text-subtitle2 text-weight-bolder ellipsis"
                :class="`text-${participationInfo.textColor}`">
                {{ participationInfo.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <div class="row items-center no-wrap bg-white shadow-1 rounded-borders q-pa-sm">
            <q-avatar
              size="34px"
              class="q-mr-sm"
              color="amber-1"
              text-color="amber-9"
              :icon="timeMetric.icon" />
            <div style="min-width: 0; overflow: hidden;">
              <div
                class="text-caption text-grey-7"
                style="font-size: 11px;">{{ timeMetric.label }}</div>
              <div class="text-subtitle2 text-weight-bolder text-amber-9">
                {{ timeMetric.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ساختار دو ستونه فشرده -->
      <div class="row q-col-gutter-md">
        <!-- ستون راست: وضعیت نشست و تایمر زنده -->
        <div class="col-12 col-md-7 column q-gutter-y-sm">
          <div class="bg-white shadow-1 rounded-borders q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center text-subtitle2 text-weight-bolder text-grey-9">
                <q-icon
                  name="badge"
                  size="18px"
                  color="primary"
                  class="q-mr-xs" />
                نشست پاسخ‌گویی من
              </div>
              <q-chip
                v-if="examData.student_online_exam_session"
                dense
                size="11px"
                :color="participationInfo.color"
                text-color="white"
                :icon="participationInfo.icon">
                {{ participationInfo.label }}
              </q-chip>
            </div>

            <!-- حالت بدون نشست -->
            <div
              v-if="!examData.student_online_exam_session"
              class="bg-grey-1 text-center q-pa-md rounded-borders border-dashed">
              <q-icon
                name="schedule"
                size="26px"
                color="primary" />
              <div class="text-caption text-weight-bold text-grey-8 q-mt-xs">
                هنوز پاسخی ثبت نشده است
              </div>
              <div
                class="text-grey-6"
                style="font-size: 11px;">
                با زدن دکمه «شروع آزمون»، ثانیه‌شمار فعال می‌شود.
              </div>
            </div>

            <!-- اطلاعات نشست -->
            <div
              v-else
              class="column q-gutter-y-xs">
              <div class="row q-col-gutter-xs text-caption">
                <div class="col-6">
                  <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                    <span class="text-grey-6">شروع:</span>
                    <b class="text-grey-9">{{ formatDateTime(examData.student_online_exam_session.started_at) }}</b>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                    <span class="text-grey-6">ارسال:</span>
                    <b class="text-grey-9">
                      {{
                        examData.student_online_exam_session.submitted_at
                          ? formatDateTime(examData.student_online_exam_session.submitted_at)
                          : 'در جریان...'
                      }}
                    </b>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                    <span class="text-grey-6">سپری‌شده:</span>
                    <b class="text-primary">{{ elapsedTimeLabel }}</b>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                    <span class="text-grey-6">فرصت مانده:</span>
                    <b :class="remainingTimeSeconds > 0 ? 'text-negative' : 'text-grey-7'">
                      {{ remainingTimeLabel }}
                    </b>
                  </div>
                </div>
              </div>

              <!-- پروگرس‌بار زمان -->
              <div
                v-if="examData.student_online_exam_session.status === 'in_progress' && sessionDurationSeconds"
                class="q-mt-xs">
                <div
                  class="row items-center justify-between text-grey-7 q-mb-xs"
                  style="font-size: 11px;">
                  <span>پیشرفت زمان آزمون</span>
                  <span class="text-weight-bold">{{ elapsedPercent }}٪</span>
                </div>
                <q-linear-progress
                  rounded
                  size="6px"
                  :value="elapsedPercent / 100"
                  :color="remainingTimeSeconds > 0 ? 'primary' : 'negative'" />
              </div>

              <!-- هشدار اتمام وقت -->
              <div
                v-if="isSessionTimeExpired"
                class="bg-red-1 text-negative q-pa-xs rounded-borders text-weight-medium"
                style="font-size: 11px;">
                <q-icon
                  name="warning"
                  size="14px"
                  class="q-mr-xs" />
                مهلت پاسخ‌گویی به اتمام رسیده؛ برای ثبت نهایی روی دکمه کلیک کنید.
              </div>
            </div>
          </div>

          <!-- توضیحات و دستورالعمل -->
          <div class="bg-white shadow-1 rounded-borders q-pa-sm">
            <div class="row items-center text-subtitle2 text-weight-bolder text-grey-9 q-mb-xs">
              <q-icon
                name="lightbulb"
                size="16px"
                color="amber-9"
                class="q-mr-xs" />
              توضیحات و دستورالعمل
            </div>
            <div
              v-if="examData.description"
              class="text-caption text-grey-8 scrollable-desc"
              v-html="examData.description" />
            <div
              v-else
              class="text-grey-6"
              style="font-size: 11px;">
              دستورالعمل خاصی برای این ارزیابی قید نشده است.
            </div>
          </div>
        </div>

        <!-- ستون چپ: بازه‌های زمانی رسمی و انتشار کلید -->
        <div class="col-12 col-md-5 column q-gutter-y-sm">
          <div
            v-if="examData.online_exam_detail"
            class="bg-white shadow-1 rounded-borders q-pa-md">
            <div class="row items-center text-subtitle2 text-weight-bolder text-grey-9 q-mb-sm">
              <q-icon
                name="calendar_month"
                size="18px"
                color="secondary"
                class="q-mr-xs" />
              بازه زمانی رسمی سرور
            </div>

            <div class="column q-gutter-y-xs">
              <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                <div class="row items-center">
                  <q-icon
                    name="play_circle"
                    color="positive"
                    size="16px"
                    class="q-mr-xs" />
                  <span
                    class="text-grey-7"
                    style="font-size: 11px;">شروع مجاز:</span>
                </div>
                <span class="text-caption text-weight-bold text-grey-9">
                  {{ formatDateTime(examData.online_exam_detail.starts_at) }}
                </span>
              </div>

              <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                <div class="row items-center">
                  <q-icon
                    name="stop_circle"
                    color="negative"
                    size="16px"
                    class="q-mr-xs" />
                  <span
                    class="text-grey-7"
                    style="font-size: 11px;">پایان مهلت:</span>
                </div>
                <span class="text-caption text-weight-bold text-grey-9">
                  {{ formatDateTime(examData.online_exam_detail.ends_at) }}
                </span>
              </div>

              <div class="row items-center justify-between bg-grey-1 q-pa-xs rounded-borders border-grey">
                <div class="row items-center">
                  <q-icon
                    name="timelapse"
                    color="purple"
                    size="16px"
                    class="q-mr-xs" />
                  <span
                    class="text-grey-7"
                    style="font-size: 11px;">مهلت پاسخ‌گویی:</span>
                </div>
                <span class="text-caption text-weight-bold text-grey-9">
                  {{ examData.online_exam_detail.time_limit_minutes }} دقیقه
                </span>
              </div>
            </div>
          </div>

          <!-- کلید و پاسخ‌نامه -->
          <div class="bg-white shadow-1 rounded-borders q-pa-sm row items-center">
            <q-avatar
              size="30px"
              :color="examData.sensitive_data_available ? 'green-1' : 'blue-1'"
              :text-color="examData.sensitive_data_available ? 'positive' : 'primary'"
              :icon="examData.sensitive_data_available ? 'lock_open' : 'lock'"
              class="q-mr-sm" />
            <div
              class="col"
              style="min-width: 0; overflow: hidden;">
              <div class="text-caption text-weight-bold text-grey-9">
                {{ examData.sensitive_data_available ? 'کلید منتشر شد' : 'پاسخ‌نامه قفل است' }}
              </div>
              <div
                class="text-grey-6 ellipsis"
                style="font-size: 11px;">
                {{
                  examData.sensitive_data_available
                    ? 'پاسخ‌نامه تشریحی هم‌اکنون قابل بررسی است.'
                    : 'پس از اتمام بازه و تایید دبیر باز خواهد شد.'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- آزمون یافت نشد -->
    <div
      v-else
      class="bg-white shadow-1 rounded-borders q-pa-xl text-center">
      <q-icon
        name="sentiment_dissatisfied"
        size="48px"
        color="grey-5"
        class="q-mb-sm" />
      <div class="text-subtitle1 text-grey-8">آزمون مورد نظر یافت نشد!</div>
      <q-btn
        flat
        color="primary"
        label="بازگشت به لیست آزمون‌ها"
        class="q-mt-md"
        @click="goBack" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { exam, type ExamType } from 'src/repositories/exam'
import { useDate } from 'src/composables/Date'

interface StatusInfo {
  label: string;
  color: string;
  icon: string;
  textColor: string;
  bgLight: string;
}

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const dateManager = useDate()

const loading = ref(true)
const examData = ref<ExamType | null>(null)
const currentTimestamp = ref(Date.now())

let timerInterval: ReturnType<typeof setInterval> | null = null

const sessionStatus = computed(() => {
  return examData.value?.student_online_exam_session?.status
    || examData.value?.participation_status
    || 'not_started'
})

const sessionDurationSeconds = computed(() => {
  const minutes = examData.value?.online_exam_detail?.time_limit_minutes
  if (!minutes || minutes <= 0) {
    return null
  }
  return minutes * 60
})

const isExamWindowOpen = computed(() => {
  const detail = examData.value?.online_exam_detail
  if (!detail) {
    return false
  }

  const now = currentTimestamp.value

  if (detail.visible_at && new Date(detail.visible_at).getTime() > now) {
    return false
  }
  if (detail.starts_at && new Date(detail.starts_at).getTime() > now) {
    return false
  }
  if (detail.ends_at && new Date(detail.ends_at).getTime() < now) {
    return false
  }

  return true
})

const isSessionTimeExpired = computed(() => {
  const session = examData.value?.student_online_exam_session
  if (!session || session.status !== 'in_progress') {
    return false
  }
  if (!session.started_at || !sessionDurationSeconds.value) {
    return false
  }

  const startedAt = new Date(session.started_at).getTime()
  const endAt = startedAt + (sessionDurationSeconds.value * 1000)

  return currentTimestamp.value >= endAt
})

const remainingTimeSeconds = computed(() => {
  const session = examData.value?.student_online_exam_session
  if (
    !session
    || session.status !== 'in_progress'
    || !session.started_at
    || !sessionDurationSeconds.value
  ) {
    return 0
  }

  const startedAt = new Date(session.started_at).getTime()
  const endAt = startedAt + (sessionDurationSeconds.value * 1000)

  return Math.max(0, Math.floor((endAt - currentTimestamp.value) / 1000))
})

const elapsedTimeSeconds = computed(() => {
  const session = examData.value?.student_online_exam_session
  if (!session?.started_at) {
    return 0
  }

  const startedAt = new Date(session.started_at).getTime()
  const endAt = session.submitted_at
    ? new Date(session.submitted_at).getTime()
    : currentTimestamp.value

  return Math.max(0, Math.floor((endAt - startedAt) / 1000))
})

const elapsedPercent = computed(() => {
  if (!sessionDurationSeconds.value) {
    return 0
  }
  return Math.min(
    100,
    Math.round((elapsedTimeSeconds.value / sessionDurationSeconds.value) * 100)
  )
})

const formatDuration = (totalSeconds: number): string => {
  const seconds = Math.max(0, totalSeconds)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSecs = seconds % 60

  const mm = minutes.toString().padStart(2, '0')
  const ss = remainingSecs.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`
  }
  return `${minutes}:${ss}`
}

const elapsedTimeLabel = computed(() => {
  if (!examData.value?.student_online_exam_session) {
    return '-'
  }
  return formatDuration(elapsedTimeSeconds.value)
})

const remainingTimeLabel = computed(() => {
  if (!examData.value?.student_online_exam_session) {
    return '-'
  }
  if (!sessionDurationSeconds.value) {
    return 'آزاد'
  }
  if (sessionStatus.value !== 'in_progress') {
    return 'پایان'
  }
  return formatDuration(remainingTimeSeconds.value)
})

const examStatus = computed(() => {
  const detail = examData.value?.online_exam_detail
  if (!detail) {
    return {
      label: 'غیر آنلاین',
      color: 'grey-7',
      icon: 'do_not_disturb'
    }
  }

  const now = currentTimestamp.value
  const startsAt = detail.starts_at ? new Date(detail.starts_at).getTime() : null
  const endsAt = detail.ends_at ? new Date(detail.ends_at).getTime() : null

  if (detail.visible_at && new Date(detail.visible_at).getTime() > now) {
    return {
      label: 'مخفی',
      color: 'grey-7',
      icon: 'visibility_off'
    }
  }

  if (startsAt && now < startsAt) {
    return {
      label: 'شروع نشده',
      color: 'warning',
      icon: 'hourglass_empty'
    }
  }

  if (endsAt && now > endsAt) {
    return {
      label: 'پایان یافته',
      color: 'negative',
      icon: 'lock_clock'
    }
  }

  return {
    label: 'در حال برگزاری',
    color: 'positive',
    icon: 'play_circle'
  }
})

const participationInfo = computed<StatusInfo>(() => {
  const session = examData.value?.student_online_exam_session

  if (!session || sessionStatus.value === 'not_started') {
    return {
      label: 'شرکت نکرده',
      color: 'grey-6',
      textColor: 'grey-7',
      bgLight: 'grey-2',
      icon: 'person_off'
    }
  }

  if (sessionStatus.value === 'in_progress' && isSessionTimeExpired.value) {
    return {
      label: 'پایان مهلت',
      color: 'negative',
      textColor: 'negative',
      bgLight: 'red-1',
      icon: 'timer_off'
    }
  }

  switch (sessionStatus.value) {
    case 'in_progress':
      return {
        label: 'در حال پاسخ',
        color: 'warning',
        textColor: 'orange-9',
        bgLight: 'amber-1',
        icon: 'edit_note'
      }

    case 'submitted':
      return {
        label: 'ارسال شده',
        color: 'info',
        textColor: 'info',
        bgLight: 'blue-1',
        icon: 'mark_email_read'
      }

    case 'graded':
      return {
        label: 'تصحیح شده',
        color: 'positive',
        textColor: 'positive',
        bgLight: 'green-1',
        icon: 'check_circle'
      }

    case 'expired':
      return {
        label: 'منقضی شده',
        color: 'negative',
        textColor: 'negative',
        bgLight: 'red-1',
        icon: 'timer_off'
      }

    default:
      return {
        label: 'نامشخص',
        color: 'grey-6',
        textColor: 'grey-7',
        bgLight: 'grey-2',
        icon: 'help_outline'
      }
  }
})

const timeMetric = computed(() => {
  const session = examData.value?.student_online_exam_session
  if (!session) {
    return {
      label: 'وضعیت زمان',
      value: 'شروع نشده',
      icon: 'schedule'
    }
  }

  if (session.status === 'in_progress') {
    return {
      label: 'مانده به پایان',
      value: sessionDurationSeconds.value
        ? formatDuration(remainingTimeSeconds.value)
        : 'آزاد',
      icon: remainingTimeSeconds.value > 0 ? 'alarm' : 'alarm_off'
    }
  }

  return {
    label: 'زمان مصرفی',
    value: formatDuration(elapsedTimeSeconds.value),
    icon: 'timer'
  }
})

const canStart = computed(() => {
  const session = examData.value?.student_online_exam_session

  if (session?.status === 'in_progress') {
    return !isSessionTimeExpired.value
  }

  if (
    session?.status === 'submitted'
    || session?.status === 'graded'
    || session?.status === 'expired'
  ) {
    return false
  }

  return isExamWindowOpen.value
})

const canViewResult = computed(() => {
  return sessionStatus.value === 'submitted'
    || sessionStatus.value === 'graded'
})

const actionHint = computed(() => {
  const session = examData.value?.student_online_exam_session
  if (!session) {
    if (isExamWindowOpen.value) {
      return 'هم‌اکنون درگاه باز است و آماده ورود به آزمون هستید.'
    }
    return examStatus.value.label
  }

  if (sessionStatus.value === 'in_progress') {
    if (isSessionTimeExpired.value) {
      return 'زمان پاسخ‌گویی منقضی شده، آزمون را ببندید.'
    }
    return 'آزمون شما فعال است؛ برای ادامه پاسخ دکمه بالا را بزنید.'
  }

  if (sessionStatus.value === 'submitted') {
    return 'پاسخ‌های شما با موفقیت تحویل داده شده است.'
  }

  if (sessionStatus.value === 'graded') {
    return 'کارنامه و رتبه آزمون شما صادر شده است.'
  }

  return 'آزمون پایان یافته است.'
})

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.isoToLocalShamsiDateTime(value)
}

const loadExam = async () => {
  loading.value = true
  try {
    const response = await exam.showStudentOnlineExam(Number(route.params.id))
    examData.value = response
    currentTimestamp.value = Date.now()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || 'خطا در بارگذاری جزئیات آزمون',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const startExam = () => {
  router.push({
    name: 'Student.Exam.Attempt',
    params: { id: route.params.id }
  })
}

const viewResult = () => {
  router.push({
    name: 'Student.Exam.Result',
    params: { id: route.params.id }
  })
}

const goBack = () => {
  router.push({
    name: 'Student.Exam.List'
  })
}

onMounted(() => {
  loadExam()
  timerInterval = setInterval(() => {
    currentTimestamp.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style lang="scss" scoped>
.scrollable-desc {
  max-height: 80px;
  overflow-y: auto;
  line-height: 1.6;
}

.border-dashed {
  border: 1px dashed rgba(0, 0, 0, 0.15);
}

.border-grey {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

@media (max-width: 599px) {
  .action-btn {
    width: 100%;
  }
}
</style>
