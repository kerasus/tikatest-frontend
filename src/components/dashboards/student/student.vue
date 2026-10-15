<template>
  <div class="dash q-pa-md">
    <student-header />

    <!-- LIVE SKYROOM ALERT BANNER (فانتزی و سبز نئونی - سشن فعال اسکای‌روم) -->
    <transition-group
      appear
      enter-active-class="animated bounceInDown"
      leave-active-class="animated bounceOutUp">
      <div
        v-for="liveClass in liveOnlineClasses"
        :key="liveClass.schedule_id"
        class="live-banner-fantasy q-pa-md q-mb-md shadow-5">
        <div class="row items-center justify-between no-wrap q-gutter-x-md">
          <div class="row items-center no-wrap q-gutter-x-md">
            <div class="live-avatar-box">
              <q-avatar
                size="44px"
                class="live-avatar"
                icon="sensors"
                text-color="white" />
              <span class="live-orbit" />
              <span class="live-orbit live-orbit--delay" />
            </div>

            <div>
              <div class="row items-center q-gutter-x-sm">
                <span class="text-subtitle1 text-weight-bolder text-white">
                  کلاس «{{ liveClass.title || liveClass.class_name || 'اسکای‌روم' }}» آماده پرواز است!
                </span>
                <q-chip
                  dense
                  class="badge-live-tag text-weight-bolder">
                  <span class="blinking-dot" /> LIVE
                </q-chip>
              </div>
              <div class="text-caption text-emerald-light q-mt-xs">
                هم‌اکنون سشن باز است • ساعت {{ liveClass.start_time }} تا {{ liveClass.end_time }}
                <span v-if="liveClass.class_name"> • {{ liveClass.class_name }}</span>
              </div>
            </div>
          </div>

          <div>
            <q-btn
              unelevated
              class="btn-enter-live text-weight-bolder q-px-md"
              icon-right="rocket_launch"
              label="ورود به اتاق"
              target="_blank"
              :href="liveClass.join_url" />
          </div>
        </div>
      </div>
    </transition-group>

    <!-- MAIN CRITICAL ACTION ROW: سه بخش با بیشترین اهمیت زمانی -->
    <div class="row q-col-gutter-md">
      <!-- اولویت ۱: کلاس‌های آنلاین اسکای‌روم -->
      <div
        v-if="stats.has_skyroom_feature"
        class="col-12 col-lg-4">
        <dashboard-card
          title="کلاس‌های آنلاین اسکای‌روم"
          subtitle="جلسات زنده و پیش‌رو"
          icon="cast_for_education"
          icon-color="teal-1"
          icon-text-color="teal-9"
          :empty="!activeOnlineClasses.length"
          empty-icon="videocam_off"
          empty-message="فعلاً کلاس آنلاینی در برنامه نیست"
          empty-subtitle="به محض نزدیک شدن به شروع جلسه، لینک ورود اینجا قرار می‌گیرد."
          :loading="loading"
          full-height>
          <template #header-action>
            <q-badge
              v-if="activeOnlineClasses.length"
              color="teal-1"
              text-color="teal-9"
              class="text-weight-bold">
              {{ activeOnlineClasses.length }} جلسه
            </q-badge>
          </template>
          <q-list class="q-gutter-y-sm">
            <q-item
              v-for="c in activeOnlineClasses"
              :key="c.schedule_id"
              class="sky-item-card"
              :class="{ 'sky-item-card--live': c.is_live_now }">
              <q-item-section avatar>
                <div class="relative-position">
                  <q-avatar
                    :class="c.is_live_now ? 'avatar-sky--live' : 'avatar-sky--idle'"
                    :icon="c.is_live_now ? 'videocam' : 'alarm'"
                    size="42px" />
                  <span
                    v-if="c.is_live_now"
                    class="pulse-indicator" />
                </div>
              </q-item-section>

              <q-item-section>
                <div class="row items-center q-gutter-x-xs no-wrap">
                  <span class="text-subtitle2 text-weight-bolder ellipsis text-grey-9">
                    {{ c.title || 'کلاس آنلاین' }}
                  </span>
                  <q-chip
                    v-if="c.is_live_now"
                    dense
                    class="chip-status-active">درحال برگزاری</q-chip>
                  <q-chip
                    v-else
                    dense
                    class="chip-status-waiting">به‌زودی</q-chip>
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  <q-icon
                    name="schedule"
                    size="14px"
                    class="q-mr-xs text-teal" />
                  <span>{{ c.start_time }} تا {{ c.end_time }}</span>
                  <span v-if="c.class_name"> • {{ c.class_name }}</span>
                </div>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  unelevated
                  :class="c.is_live_now ? 'btn-sky--active' : 'btn-sky--idle'"
                  :icon-right="c.is_live_now ? 'login' : 'link'"
                  :label="c.is_live_now ? 'ورود سریع' : 'دریافت لینک'"
                  dense
                  target="_blank"
                  :href="c.join_url" />
              </q-item-section>
            </q-item>
          </q-list>
        </dashboard-card>
      </div>

      <!-- اولویت ۲: آزمون‌های پیش‌رو -->
      <div :class="stats.has_skyroom_feature ? 'col-12 col-lg-4' : 'col-12 col-lg-6'">
        <dashboard-card
          title="آزمون‌های پیش‌رو"
          subtitle="ارزیابی‌های آنلاین و حضوری"
          icon="quiz"
          icon-color="purple-1"
          icon-text-color="purple-9"
          all-label="همه"
          :all-to="{ name: 'Student.Exam.List' }"
          :empty="!upcomingExams.length"
          empty-icon="celebration"
          empty-message="فعلاً آزمون نزدیکی نداری"
          empty-subtitle="فرصت عالی برای مرور و استراحت!"
          :loading="loading"
          full-height>
          <q-list
            bordered
            separator
            class="rounded-borders overflow-hidden">
            <q-item
              v-for="e in upcomingExams.slice(0, 5)"
              :key="String(e.id)"
              v-ripple
              clickable
              :to="{ name: 'Student.Exam.Show', params: { id: e.id } }"
              class="q-py-md hover-scale items-center">
              <q-item-section
                avatar
                top>
                <q-avatar
                  :color="e.delivery_mode === 'online' ? 'purple-1' : 'blue-grey-1'"
                  :text-color="e.delivery_mode === 'online' ? 'purple-9' : 'blue-grey-9'"
                  :icon="e.delivery_mode === 'online' ? 'devices' : 'edit_calendar'"
                  size="42px" />
              </q-item-section>

              <!-- با افزودن overflow-hidden و min-width صفر، ellipsis دقیقاً کار می‌کند -->
              <q-item-section
                class="overflow-hidden col"
                style="min-width: 0;">
                <div class="row items-center q-gutter-x-sm no-wrap full-width">
                  <span
                    class="text-subtitle2 text-weight-bolder ellipsis text-grey-9 col-shrink"
                    :title="e.name">
                    {{ e.name || 'بدون عنوان' }}
                  </span>
                  <q-badge
                    v-if="e.category?.title"
                    color="purple-1"
                    text-color="purple-9"
                    class="q-px-xs text-weight-medium flex-shrink-0">
                    {{ e.category.title }}
                  </q-badge>
                </div>

                <div class="row items-center text-caption text-grey-7 q-gutter-x-sm q-mt-xs no-wrap ellipsis">
                  <span class="ellipsis">{{ formatDateTime(examDate(e)) }}</span>
                  <span
                    v-if="e.online_exam_detail?.time_limit_minutes"
                    class="flex-shrink-0">
                    • {{ e.online_exam_detail.time_limit_minutes }} دقیقه
                  </span>
                </div>
              </q-item-section>

              <!-- ساید سکشن با قفل کردن عرض و جلوگیری از فشرده‌شدن یا همپوشانی -->
              <q-item-section
                side
                class="column items-end justify-center q-pl-sm"
                style="min-width: fit-content; flex-shrink: 0;">
                <q-chip
                  dense
                  size="11px"
                  text-color="white"
                  :color="getExamStatus(e).color"
                  :icon="getExamStatus(e).icon"
                  class="q-ma-none text-weight-bold no-wrap">
                  {{ getExamStatus(e).label }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>

        </dashboard-card>
      </div>

      <!-- اولویت ۳: تکالیف پیش‌رو و ارسال‌نشده -->
      <div :class="stats.has_skyroom_feature ? 'col-12 col-lg-4' : 'col-12 col-lg-6'">
        <dashboard-card
          title="تکالیف در انتظار ارسال"
          subtitle="نیازمند اقدام دانش‌آموز"
          icon="assignment"
          icon-color="orange-1"
          icon-text-color="orange-9"
          all-label="همه"
          :all-to="{ name: 'Student.Homework.List' }"
          :empty="!pendingHomeworks.length"
          empty-icon="done_all"
          empty-message="تمام تکالیف ارسال شده‌اند"
          empty-subtitle="خیالت راحت، کار عقب‌افتاده‌ای نداری!"
          :loading="loading"
          full-height>
          <q-list
            bordered
            separator
            class="rounded-borders overflow-hidden">
            <q-item
              v-for="h in pendingHomeworks.slice(0, 5)"
              :key="String((h as any).id)"
              v-ripple
              clickable
              :to="{ name: 'Student.Homework.Show', params: { id: (h as any).id } }"
              class="q-py-md hover-scale">
              <q-item-section avatar>
                <q-avatar
                  color="orange-1"
                  text-color="orange-9"
                  icon="assignment_late"
                  size="42px" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bolder ellipsis">
                  {{ (h as any).title || 'تکلیف' }}
                </q-item-label>
                <q-item-label
                  caption
                  class="text-grey-7 q-mt-xs">
                  مهلت: {{ formatDateTime((h as any).due_date) }}
                  <span v-if="(h as any).lesson?.name"> • {{ (h as any).lesson.name }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip
                  dense
                  size="11px"
                  color="orange-2"
                  text-color="orange-10"
                  icon="pending"
                  class="text-weight-bold">
                  ارسال نشده
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </dashboard-card>
      </div>
    </div>

    <!-- SECONDARY SECTION: Recent Grades & Calendar Events -->
    <div class="row q-col-gutter-md q-mt-md">
      <!-- نمرات اخیر -->
      <div class="col-12 col-lg-6">
        <dashboard-card
          title="نمرات اخیر"
          subtitle="آخرین نمرات ثبت‌شده"
          icon="grading"
          icon-color="blue-1"
          icon-text-color="primary"
          all-label="همه نمرات"
          :all-to="{ name: 'Student.Grade.List' }"
          :empty="!stats.recent_grades.length"
          empty-icon="inbox"
          empty-message="هنوز نمره‌ای ثبت نشده"
          empty-subtitle="به محض ثبت، اینجا میاد تو ویترین.">
          <q-list
            bordered
            separator
            class="rounded-borders">
            <q-item
              v-for="(g, i) in stats.recent_grades.slice(0, 5)"
              :key="g.id"
              class="q-py-sm">
              <q-item-section avatar>
                <q-avatar
                  color="blue-1"
                  text-color="primary"
                  size="36px">
                  {{ i + 1 }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bolder">
                  {{ g.exam_name || 'آزمون' }}
                </q-item-label>
                <q-item-label
                  caption
                  class="text-grey-7">
                  {{ g.type === 'online' ? 'آنلاین' : 'حضوری' }}
                  <span v-if="g.lesson_name"> • درس: {{ g.lesson_name }}</span>
                  <span v-if="g.percent !== null"> • درصد: <b>{{ g.percent }}٪</b></span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-weight-bolder text-primary text-subtitle2">
                  {{ g.score ?? '-' }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </dashboard-card>
      </div>

      <!-- تقویم آموزشی -->
      <div class="col-12 col-lg-6">
        <dashboard-card
          title="تقویم آموزشی"
          subtitle="رویدادها و برنامه‌های نزدیک"
          icon="event"
          icon-color="teal-1"
          icon-text-color="teal-9"
          :empty="!upcomingEvents.length"
          empty-icon="event_available"
          empty-message="رویدادی ثبت نشده است"
          empty-subtitle="تقویم فعلاً خلوت است.">
          <q-list
            bordered
            separator
            class="rounded-borders">
            <q-item
              v-for="ev in upcomingEvents.slice(0, 5)"
              :key="String((ev as any).id)"
              class="q-py-sm">
              <q-item-section avatar>
                <q-avatar
                  :style="{ background: (ev as any).color || '#E0F2F1', color: '#0F766E' }"
                  icon="event"
                  size="36px" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bolder">
                  {{ (ev as any).title || 'رویداد' }}
                </q-item-label>
                <q-item-label
                  caption
                  class="text-grey-7">
                  {{ formatDateTime(ev.starts_at) }}
                  <span v-if="(ev as any).all_day"> • تمام‌روز</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip
                  dense
                  size="11px"
                  color="teal-1"
                  text-color="teal-10"
                  icon="near_me">
                  نزدیک
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </dashboard-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDate } from 'src/composables/Date'
import StudentHeader from './components/header.vue'
import DashboardCard from './components/dashboardCard.vue'
import {
  dashboard,
  type StudentDashboardData,
  type UpcomingExam
} from 'src/repositories/dashboard'

const dateManager = useDate()

const stats = ref<StudentDashboardData>(getDefaultStats())
const loading = ref(false)

const activeOnlineClasses = computed(() => stats.value.active_online_classes || [])
const liveOnlineClasses = computed(() => activeOnlineClasses.value.filter((c) => c.is_live_now))
const upcomingExams = computed(() => stats.value.upcoming_exams || [])
const pendingHomeworks = computed(() => stats.value.pending_homeworks || [])
const upcomingEvents = computed(() => stats.value.upcoming_events || [])

function getDefaultStats (): StudentDashboardData {
  return {
    has_skyroom_feature: false,
    active_online_classes: [],
    upcoming_exams: [],
    pending_homeworks: [],
    recent_grades: [],
    upcoming_events: [],
    total_study_minutes_this_month: 0,
    total_study_hours_this_month: 0
  }
}

function getExamStatus (e: UpcomingExam) {
  if (e.delivery_mode === 'in_person') {
    return { label: 'حضوری', color: 'blue-grey-6', icon: 'apartment' }
  }

  const detail = e.online_exam_detail
  if (!detail) {
    return { label: 'آنلاین', color: 'purple-7', icon: 'devices' }
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

function formatDateTime (value?: string | null) {
  if (!value) return '-'
  return dateManager.isoToLocalShamsiDateTime(value)
}

function examDate (exam: UpcomingExam) {
  return exam.delivery_mode === 'online'
    ? exam.online_exam_detail?.starts_at
    : exam.in_person_exam_detail?.held_at
}

async function loadDashboard () {
  loading.value = true
  try {
    stats.value = await dashboard.studentDashboard()
  } catch (e) {
    stats.value = getDefaultStats()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboard()
})
</script>

<style lang="scss" scoped>
.dash {
  min-height: calc(100vh - 120px);
  background: radial-gradient(circle at 10% 10%, #ede9fe 0%, #fef2f2 45%, #fefce8 100%);
  padding-bottom: 40px;
}

/* بنر کلاس زنده */
.live-banner-fantasy {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 20px;
  border: 1.5px solid #a7f3d0;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.badge-live-tag {
  background: #ffffff !important;
  color: #065f46 !important;
}

.btn-enter-live {
  background: #ffffff;
  color: #047857;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.04);
  }
}

.sky-item-card {
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &--live {
    background: #ecfdf5;
    border: 1.5px solid #a7f3d0;
  }
}

</style>
