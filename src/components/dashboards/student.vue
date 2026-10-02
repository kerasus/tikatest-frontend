<template>
  <div class="dash q-pa-md">
    <!-- HERO -->
    <q-card
      flat
      bordered
      class="hero overflow-hidden q-mb-md">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-8">
          <div class="row items-center q-gutter-sm">
            <q-avatar
              size="44px"
              class="hero__avatar"
              text-color="white"
              icon="auto_awesome" />
            <div>
              <div class="text-h6 text-weight-bolder">
                داشبورد دانش‌آموزی <span class="text-weight-bolder">تیکا تست</span>
              </div>
              <div class="text-body2 hero__sub q-mt-xs">
                امروز قراره بدرخشی؛ من فقط وضعیت رو قشنگ و مرتب نشون می‌دم، اجرا با تو.
              </div>
            </div>
          </div>

          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              unelevated
              color="white"
              text-color="primary"
              icon="quiz"
              label="لیست آزمون‌ها"
              class="q-px-md"
              :to="{ name: 'Student.Exam.List' }" />
            <q-btn
              flat
              color="white"
              icon="grading"
              label="مشاهده نمرات"
              class="q-px-md"
              :to="{ name: 'Student.Grade.List' }" />
            <q-btn
              flat
              color="white"
              icon="assignment"
              label="مشاهده تکالیف"
              class="q-px-md"
              :to="{ name: 'Student.Homework.List' }" />
          </div>
        </div>

        <!-- Study highlight -->
        <div class="col-12 col-md-4">
          <div class="hero__glass q-pa-md rounded-borders">
            <div class="row items-center justify-between">
              <div class="text-caption hero__muted">مطالعه این ماه</div>
              <q-chip
                dense
                color="white"
                text-color="primary"
                icon="timer">
                Focus
              </q-chip>
            </div>

            <div class="text-h5 text-weight-bolder q-mt-sm">
              {{ stats.total_study_hours_this_month }}
              <span class="text-caption hero__muted">ساعت</span>
            </div>

            <q-linear-progress
              class="q-mt-md"
              rounded
              size="10px"
              :value="studyProgress"
              color="white"
              track-color="white"
              style="opacity: 0.28" />
            <div class="text-caption hero__muted q-mt-xs">
              پیشرفت نمادین: {{ Math.round(studyProgress * 100) }}٪
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- KPI STRIP -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card
          flat
          bordered
          class="kpi kpi--exams">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">آزمون‌های پیش‌رو</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ upcomingExams.length }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">نزدیک‌ترین‌ها</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="quiz" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card
          flat
          bordered
          class="kpi kpi--homework">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">تکالیف ارسال‌نشده</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ pendingHomeworks.length }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">نیازمند ارسال</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="assignment_late" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card
          flat
          bordered
          class="kpi kpi--grades">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">نمرات اخیر</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ stats.recent_grades.length }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">آخرین ثبت‌ها</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="grading" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card
          flat
          bordered
          class="kpi kpi--calendar">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">رویدادهای نزدیک</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ upcomingEvents.length }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">تقویم آموزشی</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="event" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="row q-col-gutter-md q-mt-md">
      <!-- Upcoming exams -->
      <div class="col-12 col-lg-6">
        <q-card
          flat
          bordered
          class="panel">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="purple-1"
                text-color="purple-9"
                icon="quiz" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">آزمون‌های پیش‌رو</div>
                <div class="text-caption text-grey-7">نزدیک‌ترین آزمون‌هایی که باید آماده‌شون باشی</div>
              </div>
            </div>

            <q-btn
              flat
              color="primary"
              icon-right="chevron_left"
              label="همه آزمون‌ها"
              :to="{ name: 'Student.Exam.List' }" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-list
              v-if="loading"
              bordered
              class="rounded-borders">
              <q-item
                v-for="n in 3"
                :key="n">
                <q-item-section avatar>
                  <q-skeleton
                    type="QAvatar"
                    size="40px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="60%" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton
                      type="text"
                      width="40%" />
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-skeleton
                    type="QBadge"
                    width="50px"
                    height="24px" />
                </q-item-section>
              </q-item>
            </q-list>


            <div
              v-else-if="!upcomingExams.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="celebration"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">فعلاً آزمون نزدیک نداریم</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                یعنی فرصت طلایی برای مرور… یا چرت علمی.
              </div>
            </div>
            <q-list
              v-else
              bordered
              separator
              class="rounded-borders overflow-hidden">
              <q-item
                v-for="e in upcomingExams.slice(0, 5)"
                :key="String(e.id)"
                v-ripple
                clickable
                :to="{ name: 'Student.Exam.Show', params: { id: e.id } }"
                class="q-py-md hover-scale">

                <!-- آیکون نوع برگزاری -->
                <q-item-section avatar>
                  <q-avatar
                    :color="e.delivery_mode === 'online' ? 'purple-1' : 'blue-grey-1'"
                    :text-color="e.delivery_mode === 'online' ? 'purple-9' : 'blue-grey-9'"
                    :icon="e.delivery_mode === 'online' ? 'devices' : 'edit_calendar'"
                    size="44px" />
                </q-item-section>

                <!-- اطلاعات جامع آزمون -->
                <q-item-section>
                  <div class="row items-center q-gutter-x-sm no-wrap">
                    <span class="text-subtitle2 text-weight-bolder ellipsis text-grey-9">
                      {{ e.name || 'بدون عنوان' }}
                    </span>
                    <q-badge
                      v-if="e.category?.title"
                      color="purple-1"
                      text-color="purple-9"
                      class="q-px-xs text-weight-medium">
                      {{ e.category.title }}
                    </q-badge>
                  </div>

                  <!-- جزئیات زمان‌بندی -->
                  <div class="row items-center text-caption text-grey-7 q-gutter-x-md q-mt-xs">
                    <!-- تاریخ / زمان شروع -->
                    <div class="row items-center no-wrap">
                      <q-icon
                        :name="e.delivery_mode === 'online' ? 'play_circle_outline' : 'event'"
                        size="15px"
                        class="q-mr-xs text-primary" />
                      <span>
                        {{ e.delivery_mode === 'online' ? 'شروع:' : 'برگزاری:' }}
                        {{ formatDateTime(examDate(e)) }}
                      </span>
                    </div>

                    <!-- مهلت پایان در صورت وجود -->
                    <div
                      v-if="e.delivery_mode === 'online' && e.online_exam_detail?.ends_at"
                      class="row items-center no-wrap">
                      <q-icon
                        name="event_busy"
                        size="15px"
                        class="q-mr-xs text-negative" />
                      <span>پایان: {{ formatDateTime(e.online_exam_detail.ends_at) }}</span>
                    </div>

                    <!-- مدت آزمون -->
                    <div
                      v-if="e.online_exam_detail?.time_limit_minutes"
                      class="row items-center no-wrap text-weight-medium text-blue-grey-9">
                      <q-icon
                        name="timer"
                        size="15px"
                        class="q-mr-xs text-amber-9" />
                      <span>{{ e.online_exam_detail.time_limit_minutes }} دقیقه</span>
                    </div>
                  </div>
                </q-item-section>

                <!-- نشانگر وضعیت و فلش هدایت -->
                <q-item-section
                  side
                  class="column items-end q-gutter-y-xs">
                  <q-chip
                    dense
                    size="12px"
                    text-color="white"
                    :color="getExamStatus(e).color"
                    :icon="getExamStatus(e).icon"
                    class="q-ma-none text-weight-bold">
                    {{ getExamStatus(e).label }}
                  </q-chip>

                  <q-icon
                    name="chevron_left"
                    size="20px"
                    color="grey-5" />
                </q-item-section>
              </q-item>
            </q-list>

          </q-card-section>
        </q-card>
      </div>

      <!-- Pending homework -->
      <div class="col-12 col-lg-6">
        <q-card
          flat
          bordered
          class="panel">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="orange-1"
                text-color="orange-9"
                icon="assignment" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">تکالیف ارسال‌نشده</div>
                <div class="text-caption text-grey-7">
                  همون‌ها که “فقط یه فایل مونده” ولی ۳ روزه مونده
                </div>
              </div>
            </div>

            <q-btn
              flat
              color="primary"
              icon-right="chevron_left"
              label="همه تکالیف"
              :to="{ name: 'Student.Homework.List' }" />
          </q-card-section>

          <q-separator />

          <q-card-section>

            <q-list
              v-if="loading"
              bordered
              class="rounded-borders">
              <q-item
                v-for="n in 3"
                :key="n">
                <q-item-section avatar>
                  <q-skeleton
                    type="QAvatar"
                    size="40px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="60%" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton
                      type="text"
                      width="40%" />
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-skeleton
                    type="QBadge"
                    width="50px"
                    height="24px" />
                </q-item-section>
              </q-item>
            </q-list>

            <div
              v-else-if="!pendingHomeworks.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="done_all"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">همه تکالیف ارسال شدن</div>
              <div class="text-caption text-grey-7 q-mt-xs">این سطح از نظم… مشکوکه! ولی عالیه.</div>
            </div>

            <q-list
              v-else
              bordered
              class="rounded-borders">
              <q-item
                v-for="h in pendingHomeworks.slice(0, 5)"
                :key="String((h as any).id)"
                clickable>
                <q-item-section avatar>
                  <q-avatar
                    color="orange-1"
                    text-color="orange-9"
                    icon="assignment_late" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bolder">
                    {{ (h as any).title || 'تکلیف' }}
                  </q-item-label>
                  <q-item-label caption>
                    مهلت: {{ formatDateTime((h as any).due_date) }}
                    <span v-if="(h as any).lesson?.name"> • درس: {{ (h as any).lesson.name }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-chip
                    dense
                    color="orange-2"
                    text-color="orange-10"
                    icon="upload">
                    ارسال نشده
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Bottom row: Recent grades + Calendar -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-lg-6">
        <q-card
          flat
          bordered
          class="panel">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="blue-1"
                text-color="primary"
                icon="grading" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">نمرات اخیر</div>
                <div class="text-caption text-grey-7">آخرین رکوردها</div>
              </div>
            </div>

            <q-btn
              flat
              color="primary"
              icon-right="chevron_left"
              label="همه نمرات"
              :to="{ name: 'Student.Grade.List' }" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-list
              v-if="loading"
              bordered
              class="rounded-borders">
              <q-item
                v-for="n in 3"
                :key="n">
                <q-item-section avatar>
                  <q-skeleton
                    type="QAvatar"
                    size="40px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="60%" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton
                      type="text"
                      width="40%" />
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-skeleton
                    type="QBadge"
                    width="50px"
                    height="24px" />
                </q-item-section>
              </q-item>
            </q-list>

            <div
              v-else-if="!stats.recent_grades.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="inbox"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">هنوز نمره‌ای ثبت نشده</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                به محض ثبت، اینجا میاد تو ویترین.
              </div>
            </div>

            <q-list
              v-else
              bordered
              class="rounded-borders">
              <q-item
                v-for="(g, i) in stats.recent_grades.slice(0, 5)"
                :key="g.id"
                clickable>
                <q-item-section avatar>
                  <q-avatar
                    color="blue-1"
                    text-color="primary">
                    {{ i + 1 }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bolder">
                    {{ g.exam_name || 'آزمون' }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ g.type === 'online' ? 'آنلاین' : 'حضوری' }}
                    <span v-if="g.lesson_name"> • درس: {{ g.lesson_name }}</span>
                    <span> • نمره: {{ g.score ?? '-' }}</span>
                    <span v-if="g.percent !== null"> • {{ g.percent }}٪</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-chip
                    dense
                    color="blue-2"
                    text-color="blue-10"
                    icon="star">
                    جدید
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-6">
        <q-card
          flat
          bordered
          class="panel">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="teal-1"
                text-color="teal-9"
                icon="event" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">تقویم آموزشی</div>
                <div class="text-caption text-grey-7">رویدادهای نزدیک</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>

            <q-list
              v-if="loading"
              bordered
              class="rounded-borders">
              <q-item
                v-for="n in 3"
                :key="n">
                <q-item-section avatar>
                  <q-skeleton
                    type="QAvatar"
                    size="40px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="60%" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton
                      type="text"
                      width="40%" />
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-skeleton
                    type="QBadge"
                    width="50px"
                    height="24px" />
                </q-item-section>
              </q-item>
            </q-list>

            <div
              v-else-if="!upcomingEvents.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="event_available"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">رویداد نزدیک نداریم</div>
              <div class="text-caption text-grey-7 q-mt-xs">تقویم فعلاً خلوت و دوست‌داشتنیه.</div>
            </div>

            <q-list
              v-else
              bordered
              class="rounded-borders">
              <q-item
                v-for="ev in upcomingEvents.slice(0, 6)"
                :key="String((ev as any).id)">
                <q-item-section avatar>
                  <q-avatar
                    :style="{
                      background: ((ev as any).color || '#E0F2F1'),
                      color: '#0F766E'
                    }"
                    icon="event" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bolder">
                    {{ (ev as any).title || 'رویداد' }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ formatDateTime((ev as any).starts_at) }}
                    <span v-if="(ev as any).all_day"> • تمام‌روز</span>
                    <span v-if="(ev as any).type"> • {{ mapEventType((ev as any).type) }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-chip
                    dense
                    color="teal-2"
                    text-color="teal-10"
                    icon="near_me">
                    نزدیک
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useDate } from 'src/composables/Date'
import { student } from 'src/repositories/student'

type UpcomingExam = {
  id: number
  name: string
  delivery_mode: 'online' | 'in_person'
  category?: {
    id: number
    title: string
  } | null
  online_exam_detail?: {
    starts_at?: string | null
    ends_at?: string | null
    time_limit_minutes?: number | null
  } | null
  in_person_exam_detail?: {
    held_at?: string | null
  } | null
}

type PendingHomework = {
  id: number
  title: string
  due_date?: string | null
  lesson?: {
    name?: string | null
  } | null
}

type RecentGrade = {
  id: string
  type: 'online' | 'in_person'
  exam_name?: string | null
  lesson_name?: string | null
  score?: string | number | null
  percent?: string | number | null
  graded_at?: string | null
}

type UpcomingEvent = {
  id: number
  title: string
  starts_at?: string | null
  all_day?: boolean
  type?: string
  color?: string | null
}

type StudentDashboardStats = {
  upcoming_exams: UpcomingExam[]
  pending_homeworks: PendingHomework[]
  recent_grades: RecentGrade[]
  upcoming_events: UpcomingEvent[]
  total_study_minutes_this_month: number
  total_study_hours_this_month: number
}

const dateManager = useDate()

const stats = ref<StudentDashboardStats>({
  upcoming_exams: [],
  pending_homeworks: [],
  recent_grades: [],
  upcoming_events: [],
  total_study_minutes_this_month: 0,
  total_study_hours_this_month: 0
})

const loading = ref(false)
const upcomingExams = computed(() => stats.value.upcoming_exams)
const pendingHomeworks = computed(() => stats.value.pending_homeworks)
const upcomingEvents = computed(() => stats.value.upcoming_events)

const studyProgress = computed(() => {
  const minutes = stats.value.total_study_minutes_this_month || 0
  const goal = 600
  return Math.max(0, Math.min(1, minutes / goal))
})

function getExamStatus (e: UpcomingExam) {
  if (e.delivery_mode === 'in_person') {
    return {
      label: 'حضوری',
      color: 'blue-grey-6',
      icon: 'apartment'
    }
  }

  const detail = e.online_exam_detail
  if (!detail) {
    return { label: 'آنلاین', color: 'purple-7', icon: 'devices' }
  }

  const now = Date.now()
  const startsAt = detail.starts_at ? new Date(detail.starts_at).getTime() : null
  const endsAt = detail.ends_at ? new Date(detail.ends_at).getTime() : null

  if (startsAt && now < startsAt) {
    return {
      label: 'شروع نشده',
      color: 'blue-7',
      icon: 'schedule'
    }
  }

  if (endsAt && now > endsAt) {
    return {
      label: 'پایان یافته',
      color: 'grey-7',
      icon: 'event_busy'
    }
  }

  if (startsAt && now >= startsAt && (!endsAt || now <= endsAt)) {
    return {
      label: 'در حال برگزاری',
      color: 'positive',
      icon: 'sensors'
    }
  }

  return {
    label: 'آزاد',
    color: 'teal-7',
    icon: 'all_inclusive'
  }
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

function mapEventType (t: any) {
  switch (t) {
    case 'exam': return 'آزمون'
    case 'homework': return 'تکلیف'
    case 'meeting': return 'جلسه'
    case 'holiday': return 'تعطیل'
    case 'reminder': return 'یادآور'
    case 'class': return 'کلاس'
    default: return 'عمومی'
  }
}

async function loadDashboard () {
  loading.value = true
  try {
    stats.value = await student.dashboard()
  } catch (e) {
    stats.value = {
      upcoming_exams: [],
      pending_homeworks: [],
      recent_grades: [],
      upcoming_events: [],
      total_study_minutes_this_month: 0,
      total_study_hours_this_month: 0
    }
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
  background:
    radial-gradient(1200px 600px at 12% 0%, rgba(124, 77, 255, 0.10), transparent 60%),
    radial-gradient(900px 500px at 92% 18%, rgba(45, 127, 249, 0.10), transparent 55%),
    radial-gradient(900px 500px at 70% 80%, rgba(255, 152, 0, 0.08), transparent 60%);
  min-height: calc(100vh - 120px);
}

/* HERO */
.hero {
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(135deg, #2d7ff9 0%, #6a5cff 45%, #ff7aa2 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(800px 400px at 20% 30%, rgba(255, 255, 255, 0.18), transparent 55%),
      radial-gradient(700px 300px at 80% 10%, rgba(255, 255, 255, 0.12), transparent 60%);
    pointer-events: none;
  }
}

.hero__avatar {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
}

.hero__sub,
.hero__muted {
  color: rgba(255, 255, 255, 0.78);
}

.hero__glass {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
}

/* KPI */
.kpi {
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    filter: blur(36px);
    opacity: 0.22;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 40px rgba(30, 41, 59, 0.10);
    border-color: rgba(45, 127, 249, 0.30);

    &::before {
      opacity: 0.40;
    }
  }
}

.kpi__label {
  color: #64748b;
}

.kpi__value {
  color: #0f172a;
  letter-spacing: -0.5px;
}

.kpi__icon {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
}

.kpi--exams::before {
  background: #7c4dff;
}

.kpi--homework::before {
  background: #ff9800;
}

.kpi--grades::before {
  background: #2d7ff9;
}

.kpi--calendar::before {
  background: #14b8a6;
}

/* Panels */
.panel {
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
}

.empty {
  text-align: center;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.03), rgba(255, 255, 255, 1));
  border: 1.5px dashed rgba(15, 23, 42, 0.18);
}
</style>
