<template>
  <div class="exam-detail-page page-container">
    <!-- هدر صفحه -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          flat
          round
          dense
          color="grey-8"
          icon="arrow_forward"
          class="bg-white shadow-1"
          @click="goBack">
          <q-tooltip>بازگشت به لیست آزمون‌ها</q-tooltip>
        </q-btn>

        <div>
          <div class="text-caption text-grey-6">پنل دانش‌آموز</div>
          <h1 class="text-h6 text-weight-bolder text-grey-9 q-my-none">
            جزئیات و وضعیت شرکت در آزمون
          </h1>
        </div>
      </div>

      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="بروزرسانی"
        class="rounded-borders"
        :loading="loading"
        @click="loadExam" />
    </div>

    <!-- لودینگ با اسکلتون -->
    <div
      v-if="loading"
      class="column q-gutter-y-md">
      <q-skeleton
        type="rect"
        height="160px"
        class="rounded-xl" />

      <div class="row q-col-gutter-md">
        <div
          v-for="i in 4"
          :key="i"
          class="col-12 col-sm-6 col-md-3">
          <q-skeleton
            type="rect"
            height="100px"
            class="rounded-xl" />
        </div>
      </div>

      <q-skeleton
        type="rect"
        height="300px"
        class="rounded-xl" />
    </div>

    <!-- محتوای اصلی -->
    <div
      v-else-if="examData"
      class="column q-gutter-y-lg">

      <!-- هیرو کارت با گرادیان مدرن -->
      <q-card
        flat
        class="hero-card overflow-hidden">
        <div class="hero-overlay" />

        <q-card-section class="relative-position q-pa-lg text-white">
          <div class="row items-center justify-between q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <div class="row items-center q-gutter-x-sm q-mb-sm">
                <q-chip
                  dense
                  color="white"
                  text-color="primary"
                  icon="category"
                  class="text-weight-bold">
                  {{ examData.category?.title || 'آزمون' }}
                </q-chip>

                <q-chip
                  v-if="examData.lesson?.name"
                  dense
                  color="white"
                  text-color="primary"
                  icon="menu_book"
                  class="text-weight-bold">
                  {{ examData.lesson.name }}
                </q-chip>
              </div>

              <div class="text-h5 text-weight-bolder text-shadow q-mb-xs">
                {{ examData.name }}
              </div>

              <div class="text-subtitle2 text-white-8">
                جزئیات زمان‌بندی، وضعیت شرکت و اطلاعات جلسه آزمون
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="column items-end q-gutter-y-sm">
                <!-- وضعیت زمان‌بندی آزمون -->
                <q-badge
                  :color="examStatus.color"
                  class="q-pa-sm text-subtitle2 text-weight-bold shadow-2 rounded-borders">
                  <q-icon
                    :name="examStatus.icon"
                    size="18px"
                    class="q-mr-xs" />
                  {{ examStatus.label }}
                </q-badge>

                <!-- وضعیت شرکت دانش‌آموز -->
                <q-badge
                  :color="participationInfo.color"
                  class="q-pa-sm text-subtitle2 text-weight-bold shadow-2 rounded-borders">
                  <q-icon
                    :name="participationInfo.icon"
                    size="18px"
                    class="q-mr-xs" />
                  {{ participationInfo.label }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- کارت‌های آماری بالا (Metric Cards) -->
      <div class="row q-col-gutter-md">
        <!-- مدت آزمون -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            class="metric-card bg-white">
            <q-card-section class="row items-center no-wrap">
              <div class="metric-icon-box bg-blue-1 text-primary q-mr-md">
                <q-icon
                  name="timer"
                  size="28px" />
              </div>

              <div>
                <div class="text-caption text-grey-6 text-weight-medium">
                  مدت زمان آزمون
                </div>

                <div class="text-h6 text-weight-bolder text-blue-grey-9">
                  {{ examData.online_exam_detail?.time_limit_minutes ?? '-' }}
                  <span class="text-caption">دقیقه</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- شماره تلاش دانش‌آموز -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            class="metric-card bg-white">
            <q-card-section class="row items-center no-wrap">
              <div class="metric-icon-box bg-purple-1 text-purple-8 q-mr-md">
                <q-icon
                  name="repeat"
                  size="28px" />
              </div>

              <div>
                <div class="text-caption text-grey-6 text-weight-medium">
                  شماره تلاش
                </div>

                <div class="text-h6 text-weight-bolder text-purple-9">
                  {{ examData.student_online_exam_session?.attempt_number ?? '-' }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- وضعیت پاسخ‌گویی -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            class="metric-card bg-white">
            <q-card-section class="row items-center no-wrap">
              <div
                class="metric-icon-box q-mr-md"
                :class="participationInfo.iconBackground">
                <q-icon
                  :name="participationInfo.icon"
                  size="28px"
                  :color="participationInfo.iconColor" />
              </div>

              <div>
                <div class="text-caption text-grey-6 text-weight-medium">
                  وضعیت پاسخ‌گویی
                </div>

                <div
                  class="text-body1 text-weight-bolder"
                  :class="`text-${participationInfo.textColor}`">
                  {{ participationInfo.label }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- زمان سپری شده یا مانده -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            class="metric-card bg-white">
            <q-card-section class="row items-center no-wrap">
              <div class="metric-icon-box bg-amber-1 text-amber-9 q-mr-md">
                <q-icon
                  :name="timeMetric.icon"
                  size="28px" />
              </div>

              <div>
                <div class="text-caption text-grey-6 text-weight-medium">
                  {{ timeMetric.label }}
                </div>

                <div class="text-h6 text-weight-bolder text-amber-9">
                  {{ timeMetric.value }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- کارت جزئیات سشن دانش‌آموز -->
      <q-card
        flat
        class="bg-white rounded-xl shadow-sm">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center">
              <q-icon
                name="person"
                size="25px"
                color="primary"
                class="q-mr-sm" />

              <div class="text-subtitle1 text-weight-bold text-grey-9">
                جزئیات شرکت شما در آزمون
              </div>
            </div>

            <q-chip
              v-if="examData.student_online_exam_session"
              dense
              :color="participationInfo.color"
              text-color="white"
              :icon="participationInfo.icon">
              {{ participationInfo.label }}
            </q-chip>
          </div>

          <!-- حالتی که هنوز هیچ نشستی شروع نشده -->
          <div
            v-if="!examData.student_online_exam_session"
            class="empty-session-box">
            <q-icon
              name="person_off"
              size="42px"
              color="grey-5" />

            <div class="text-body1 text-weight-bold text-grey-8 q-mt-sm">
              هنوز در این آزمون شرکت نکرده‌اید
            </div>

            <div class="text-caption text-grey-6 q-mt-xs">
              پس از فشردن دکمه شروع آزمون، زمان‌سنج و جزئیات جلسه شما ثبت و در این قسمت فعال می‌شود.
            </div>
          </div>

          <!-- اطلاعات دقیق جلسه فعلی -->
          <div
            v-else
            class="column q-gutter-y-md">

            <div class="row q-col-gutter-md">
              <!-- زمان شروع -->
              <div class="col-12 col-sm-6 col-md-3">
                <div class="session-detail-item">
                  <q-icon
                    name="play_circle"
                    color="primary"
                    size="22px" />

                  <div>
                    <div class="text-caption text-grey-6">زمان شروع</div>
                    <div class="text-body2 text-weight-bold text-grey-9">
                      {{ formatDateTime(examData.student_online_exam_session.started_at) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- زمان ارسال پاسخ -->
              <div class="col-12 col-sm-6 col-md-3">
                <div class="session-detail-item">
                  <q-icon
                    :name="examData.student_online_exam_session.submitted_at ? 'task_alt' : 'pending'"
                    :color="examData.student_online_exam_session.submitted_at ? 'positive' : 'warning'"
                    size="22px" />

                  <div>
                    <div class="text-caption text-grey-6">زمان ارسال پاسخ</div>
                    <div class="text-body2 text-weight-bold text-grey-9">
                      {{
                        examData.student_online_exam_session.submitted_at
                          ? formatDateTime(examData.student_online_exam_session.submitted_at)
                          : 'هنوز ارسال نشده'
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- مدت زمان سپری شده -->
              <div class="col-12 col-sm-6 col-md-3">
                <div class="session-detail-item">
                  <q-icon
                    name="hourglass_bottom"
                    color="deep-purple"
                    size="22px" />

                  <div>
                    <div class="text-caption text-grey-6">زمان سپری‌شده</div>
                    <div class="text-body2 text-weight-bold text-grey-9">
                      {{ elapsedTimeLabel }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- فرصت باقی‌مانده -->
              <div class="col-12 col-sm-6 col-md-3">
                <div class="session-detail-item">
                  <q-icon
                    :name="remainingTimeSeconds > 0 ? 'alarm' : 'alarm_off'"
                    :color="remainingTimeSeconds > 0 ? 'negative' : 'grey-6'"
                    size="22px" />

                  <div>
                    <div class="text-caption text-grey-6">زمان باقی‌مانده</div>
                    <div
                      class="text-body2 text-weight-bold"
                      :class="remainingTimeSeconds > 0 ? 'text-negative' : 'text-grey-7'">
                      {{ remainingTimeLabel }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- نوار پیشرفت مصرف زمان آزمون -->
            <div
              v-if="examData.student_online_exam_session.status === 'in_progress' && sessionDurationSeconds"
              class="q-mt-sm">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-grey-7">میزان استفاده از زمان آزمون</span>
                <span class="text-caption text-weight-bold text-grey-8">{{ elapsedPercent }}٪</span>
              </div>

              <q-linear-progress
                rounded
                size="10px"
                :value="elapsedPercent / 100"
                :color="remainingTimeSeconds > 0 ? 'primary' : 'negative'"
                track-color="grey-3" />
            </div>

            <!-- هشدارهای وضعیت نشست -->
            <q-banner
              v-if="isSessionTimeExpired"
              rounded
              class="bg-red-1 text-negative">
              <template #avatar>
                <q-icon
                  name="timer_off"
                  color="negative" />
              </template>
              زمان مجاز پاسخ‌گویی این جلسه به پایان رسیده است. برای محاسبه نتایج لطفاً پاسخ‌ها را ارسال نمایید.
            </q-banner>

            <q-banner
              v-else-if="examData.student_online_exam_session.status === 'in_progress'"
              rounded
              class="bg-orange-1 text-orange-10">
              <template #avatar>
                <q-icon
                  name="info"
                  color="orange-9" />
              </template>
              آزمون شما در حال برگزاری است. زمان‌سنج فعال است؛ لطفاً پیش از پایان مهلت پاسخ‌های خود را ثبت کنید.
            </q-banner>
          </div>
        </q-card-section>
      </q-card>

      <!-- اطلاعات زمان‌بندی کلی آزمون -->
      <q-card
        v-if="examData.online_exam_detail"
        flat
        class="bg-white rounded-xl shadow-sm">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-icon
              name="event"
              size="25px"
              color="primary"
              class="q-mr-sm" />

            <div class="text-subtitle1 text-weight-bold text-grey-9">زمان‌بندی آزمون</div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <div class="schedule-item">
                <q-icon
                  name="event_available"
                  color="positive"
                  size="24px" />

                <div>
                  <div class="text-caption text-grey-6">شروع آزمون</div>
                  <div class="text-body2 text-weight-bold text-grey-9">
                    {{ formatDateTime(examData.online_exam_detail.starts_at) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="schedule-item">
                <q-icon
                  name="event_busy"
                  color="negative"
                  size="24px" />

                <div>
                  <div class="text-caption text-grey-6">پایان مهلت شرکت</div>
                  <div class="text-body2 text-weight-bold text-grey-9">
                    {{ formatDateTime(examData.online_exam_detail.ends_at) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="schedule-item">
                <q-icon
                  name="timer"
                  color="amber-9"
                  size="24px" />

                <div>
                  <div class="text-caption text-grey-6">مدت پاسخ‌گویی</div>
                  <div class="text-body2 text-weight-bold text-grey-9">
                    {{ examData.online_exam_detail.time_limit_minutes }} دقیقه
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- توضیحات و دستورالعمل آزمون -->
      <q-card
        flat
        class="bg-white rounded-xl shadow-sm">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-icon
              name="article"
              size="25px"
              color="primary"
              class="q-mr-sm" />

            <div class="text-subtitle1 text-weight-bold text-grey-9">دستورالعمل و توضیحات آزمون</div>
          </div>

          <div
            v-if="examData.description"
            class="exam-description bg-grey-1 q-pa-md rounded-borders text-body2 text-grey-8"
            v-html="examData.description" />

          <div
            v-else
            class="text-grey-6 bg-grey-1 q-pa-md rounded-borders text-body2">
            توضیح خاصی برای این آزمون ثبت نشده است.
          </div>
        </q-card-section>
      </q-card>

      <!-- وضعیت انتشار پاسخ‌نامه -->
      <q-banner
        rounded
        :class="examData.sensitive_data_available ? 'bg-green-1 text-positive' : 'bg-blue-1 text-blue-10'">
        <template #avatar>
          <q-icon
            :name="examData.sensitive_data_available ? 'lock_open' : 'lock'"
            :color="examData.sensitive_data_available ? 'positive' : 'primary'" />
        </template>
        {{
          examData.sensitive_data_available
            ? 'پاسخ‌نامه تشریحی و کلید سوالات این آزمون منتشر شده و قابل بررسی است.'
            : 'کلید پاسخ‌ها و فایل‌های تشریحی تا زمان اعلام شده توسط دبیر مخفی می‌باشند.'
        }}
      </q-banner>

      <!-- نوار عملیات (CTA) -->
      <q-card
        flat
        class="bg-white rounded-xl shadow-sm">
        <q-card-actions
          align="between"
          class="q-pa-md items-center">
          <div>
            <div class="text-caption text-grey-7">وضعیت فعلی:</div>
            <div
              class="text-body2 text-weight-bold"
              :class="`text-${participationInfo.textColor}`">
              {{ actionHint }}
            </div>
          </div>

          <div class="row items-center q-gutter-sm">
            <!-- دکمه شروع یا ادامه آزمون -->
            <q-btn
              v-if="canStart"
              unelevated
              size="lg"
              :color="sessionStatus === 'in_progress' ? 'warning' : 'primary'"
              class="start-exam-btn q-px-xl rounded-borders text-weight-bolder"
              :icon="sessionStatus === 'in_progress' ? 'play_arrow' : 'login'"
              :label="sessionStatus === 'in_progress' ? 'ادامه آزمون' : 'شروع آزمون'"
              @click="startExam" />

            <!-- دکمه کارنامه -->
            <q-btn
              v-else-if="canViewResult"
              unelevated
              size="lg"
              color="positive"
              icon="analytics"
              label="مشاهده کارنامه"
              class="q-px-xl rounded-borders text-weight-bolder"
              @click="viewResult" />

            <!-- دکمه غیرفعال -->
            <q-btn
              v-else
              disable
              unelevated
              size="lg"
              color="grey-5"
              icon="lock"
              label="امکان ورود وجود ندارد"
              class="q-px-xl rounded-borders" />
          </div>
        </q-card-actions>
      </q-card>
    </div>

    <!-- آزمون یافت نشد -->
    <q-card
      v-else
      flat
      class="bg-white rounded-xl q-pa-xl text-center shadow-sm">
      <q-icon
        name="sentiment_dissatisfied"
        size="64px"
        color="grey-5"
        class="q-mb-md" />

      <div class="text-h6 text-grey-8">آزمون مورد نظر یافت نشد!</div>
      <div class="text-caption text-grey-6 q-mb-md">ممکن است آزمون حذف شده باشد یا به آن دسترسی نداشته باشید.</div>

      <q-btn
        color="primary"
        outline
        label="بازگشت به لیست آزمون‌ها"
        @click="goBack" />
    </q-card>
  </div>
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
  iconBackground: string;
  iconColor: string;
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
    return 'بدون محدودیت'
  }
  if (sessionStatus.value !== 'in_progress') {
    return 'پایان یافته'
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
      label: 'قابل مشاهده نیست',
      color: 'grey-7',
      icon: 'visibility_off'
    }
  }

  if (startsAt && now < startsAt) {
    return {
      label: 'هنوز شروع نشده',
      color: 'warning',
      icon: 'hourglass_empty'
    }
  }

  if (endsAt && now > endsAt) {
    return {
      label: 'مهلت آزمون پایان یافته',
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
      textColor: 'grey-8',
      icon: 'person_off',
      iconBackground: 'bg-grey-2',
      iconColor: 'grey-7'
    }
  }

  if (sessionStatus.value === 'in_progress' && isSessionTimeExpired.value) {
    return {
      label: 'مهلت زمان تمام شده',
      color: 'negative',
      textColor: 'negative',
      icon: 'timer_off',
      iconBackground: 'bg-red-1',
      iconColor: 'negative'
    }
  }

  switch (sessionStatus.value) {
    case 'in_progress':
      return {
        label: 'در حال پاسخ‌گویی',
        color: 'warning',
        textColor: 'orange-9',
        icon: 'edit_note',
        iconBackground: 'bg-orange-1',
        iconColor: 'orange-9'
      }

    case 'submitted':
      return {
        label: 'پاسخ‌ها ارسال شده',
        color: 'info',
        textColor: 'info',
        icon: 'mark_email_read',
        iconBackground: 'bg-blue-1',
        iconColor: 'info'
      }

    case 'graded':
      return {
        label: 'نمره‌گذاری شده',
        color: 'positive',
        textColor: 'positive',
        icon: 'check_circle',
        iconBackground: 'bg-green-1',
        iconColor: 'positive'
      }

    case 'expired':
      return {
        label: 'منقضی شده',
        color: 'negative',
        textColor: 'negative',
        icon: 'timer_off',
        iconBackground: 'bg-red-1',
        iconColor: 'negative'
      }

    default:
      return {
        label: 'وضعیت نامشخص',
        color: 'grey-6',
        textColor: 'grey-8',
        icon: 'help_outline',
        iconBackground: 'bg-grey-2',
        iconColor: 'grey-7'
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
      label: 'زمان باقی‌مانده',
      value: sessionDurationSeconds.value
        ? formatDuration(remainingTimeSeconds.value)
        : 'بدون محدودیت',
      icon: remainingTimeSeconds.value > 0 ? 'alarm' : 'alarm_off'
    }
  }

  return {
    label: 'زمان استفاده‌شده',
    value: formatDuration(elapsedTimeSeconds.value),
    icon: 'timer'
  }
})

const canStart = computed(() => {
  const session = examData.value?.student_online_exam_session

  // اگر سشن در حال برگزاری است و زمانش نسوخته، می‌تواند ادامه دهد
  if (session?.status === 'in_progress') {
    return !isSessionTimeExpired.value
  }

  // سشن‌های ارسال‌شده یا منقضی نباید مجدداً شروع شوند
  if (
    session?.status === 'submitted'
    || session?.status === 'graded'
    || session?.status === 'expired'
  ) {
    return false
  }

  // اگر هنوز شرکتی نبوده، باید پنجره زمانی آزمون باز باشد
  return isExamWindowOpen.value
})

const canViewResult = computed(() => {
  return sessionStatus.value === 'submitted'
    || sessionStatus.value === 'graded'
})

const actionHint = computed(() => {
  if (!examData.value?.student_online_exam_session) {
    if (isExamWindowOpen.value) {
      return 'شما هنوز در آزمون شرکت نکرده‌اید و می‌توانید پاسخ‌گویی را آغاز کنید.'
    }
    return examStatus.value.label
  }

  if (sessionStatus.value === 'in_progress') {
    if (isSessionTimeExpired.value) {
      return 'زمان پاسخ‌گویی شما به پایان رسیده است؛ لطفاً آزمون را ثبت نمایید.'
    }
    return 'آزمون شما در وضعیت در حال اجرا است؛ می‌توانید به پاسخ‌گویی ادامه دهید.'
  }

  if (sessionStatus.value === 'submitted') {
    return 'پاسخ‌نامه شما با موفقیت ثبت شده و در انتظار تصحیح است.'
  }

  if (sessionStatus.value === 'graded') {
    return 'کارنامه آزمون آماده است و می‌توانید نتایج را مشاهده کنید.'
  }

  if (sessionStatus.value === 'expired') {
    return 'این آزمون منقضی شده و مهلت شرکت در آن سپری شده است.'
  }

  return 'وضعیت آزمون نامشخص است.'
})

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) {
    return '-'
  }
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
.exam-detail-page {
  min-height: 100vh;
}

.page-container {
  padding-bottom: 32px;
}

.rounded-xl {
  border-radius: 16px;
}

.hero-card {
  position: relative;
  border-radius: 20px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 48%, #0891b2 100%);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 60%),
              radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.08), transparent 55%);
}

.text-white-8 {
  color: rgba(255, 255, 255, 0.88);
}

.metric-card {
  min-height: 100px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px -4px rgba(0, 0, 0, 0.08);
  }
}

.metric-icon-box {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.session-detail-item,
.schedule-item {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.empty-session-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 24px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
}

.exam-description {
  line-height: 1.9;
}

.start-exam-btn {
  box-shadow: 0 4px 14px 0 rgba(30, 58, 138, 0.39);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.5);
  }
}

@media (max-width: 599px) {
  .hero-card {
    border-radius: 16px;
  }

  .metric-card {
    min-height: 88px;
  }

  .q-card-actions {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }

  .q-card-actions > div {
    width: 100%;
  }

  .start-exam-btn {
    width: 100%;
  }
}
</style>
