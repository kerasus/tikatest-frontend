<template>
  <div class="dash q-pa-md">
    <!-- HERO FANTASY & CANDY EDITION -->
    <q-card
      flat
      class="hero-fantasy overflow-hidden q-mb-lg relative-position">

      <!-- پس‌زمینه‌های انیمیشنی معلق (Blobs) -->
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
      <div class="sparkle sparkle-1">✨</div>
      <div class="sparkle sparkle-2">🚀</div>
      <div class="sparkle sparkle-3">🎯</div>

      <q-card-section
        class="row items-center q-col-gutter-lg relative-position"
        style="z-index: 2;">
        <!-- بخش اصلی سلام و دکمه‌ها -->
        <div class="col-12 col-md-7">
          <div class="row items-center q-gutter-md no-wrap">
            <div class="avatar-wrapper">
              <q-avatar
                size="56px"
                class="hero__avatar shadow-3"
                text-color="deep-purple-9"
                icon="auto_awesome" />
              <span class="avatar-badge">⚡</span>
            </div>

            <div>
              <div class="hero__badge q-mb-xs">
                <q-badge
                  rounded
                  color="yellow-7"
                  text-color="dark"
                  class="text-weight-bold q-px-sm q-py-xs">
                  آماده برای یادگیری؟ 🔥
                </q-badge>
              </div>
              <div class="text-h5 text-weight-bolder text-white hero__title">
                داشبورد دانش‌آموزی <span class="brand-glow">سنجاد</span>
              </div>
              <div class="text-subtitle2 hero__sub q-mt-xs">
                امروز قراره بترکونی؛ کلاس‌ها، آزمون‌ها و تمرین‌هات منتظر درخشش تواند! ✨
              </div>
            </div>
          </div>

          <!-- دکمه‌های شاد و کپسولی -->
          <div class="row q-gutter-sm q-mt-md items-center">
            <q-btn
              unelevated
              rounded
              icon="quiz"
              label="لیست آزمون‌ها"
              class="btn-candy btn-candy--primary q-px-md text-weight-bold"
              :to="{ name: 'Student.Exam.List' }" />
            <q-btn
              flat
              rounded
              icon="assignment"
              label="مشاهده تکالیف"
              class="btn-candy btn-candy--glass q-px-md text-weight-medium"
              :to="{ name: 'Student.Homework.List' }" />
            <q-btn
              flat
              rounded
              icon="grading"
              label="مشاهده نمرات"
              class="btn-candy btn-candy--glass q-px-md text-weight-medium"
              :to="{ name: 'Student.Grade.List' }" />
          </div>
        </div>

        <!-- باکس شیشه‌ای مطالعه (Study Card) -->
        <div class="col-12 col-md-5">
          <div class="hero__glass-card q-pa-md">
            <div class="row items-center justify-between">
              <div class="row items-center q-gutter-xs">
                <span class="text-h6">⏳</span>
                <span class="text-subtitle2 text-weight-bolder text-white">ماراتن مطالعه این ماه</span>
              </div>
              <q-chip
                dense
                class="chip-status text-weight-bolder"
                color="white"
                text-color="purple-9"
                icon="bolt">
                Super Focus
              </q-chip>
            </div>

            <div class="row items-baseline q-mt-md q-gutter-xs">
              <span class="text-h3 text-weight-bolder text-white score-counter">
                {{ stats.total_study_hours_this_month }}
              </span>
              <span class="text-body2 text-white-8 text-weight-medium">ساعت تمرکز طلایی</span>
            </div>

            <!-- پروگرس‌بار دو رنگ و براق -->
            <div class="progress-container q-mt-md">
              <q-linear-progress
                rounded
                size="14px"
                :value="studyProgress"
                class="custom-progress" />
              <div class="row items-center justify-between q-mt-xs">
                <span class="text-caption text-white-8">پیشرفت هدف ماه</span>
                <span class="text-caption text-weight-bold text-yellow-3">
                  {{ Math.round(studyProgress * 100) }}٪
                </span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>


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
            <!-- آواتار نئونی متحرک -->
            <div class="live-avatar-box">
              <q-avatar
                size="48px"
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
                هم‌اکنون سشن باز است • ساعت
                {{ liveClass.start_time }}
                تا
                {{ liveClass.end_time }}
                <span v-if="liveClass.class_name"> • {{ liveClass.class_name }}</span>
              </div>
            </div>
          </div>

          <!-- دکمه ورود فانتزی -->
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

    <!-- KPI STRIP -->
    <div class="row q-col-gutter-md">
      <!-- 1. KPI Skyroom (اولویت اول زمانی) -->
      <div
        v-if="stats.has_skyroom_feature"
        class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="kpi kpi--skyroom">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">کلاس‌های آنلاین امروز</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ activeOnlineClasses.length }}
              </div>
              <div class="text-caption text-teal-8 q-mt-xs text-weight-medium">
                {{ liveOnlineClasses.length ? `${liveOnlineClasses.length} جلسه لایو` : 'اسکای‌روم فعال' }}
              </div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="cast_for_education" />
          </q-card-section>
        </q-card>
      </div>

      <!-- 2. KPI Exams (اولویت دوم زمانی) -->
      <div
        class="col-12 col-sm-6"
        :class="stats.has_skyroom_feature ? 'col-md-3' : 'col-md-4'">
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
              <div class="text-caption text-grey-7 q-mt-xs">نزدیک‌ترین آزمون‌ها</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="quiz" />
          </q-card-section>
        </q-card>
      </div>

      <!-- 3. KPI Homeworks (اولویت سوم زمانی) -->
      <div
        class="col-12 col-sm-6"
        :class="stats.has_skyroom_feature ? 'col-md-3' : 'col-md-4'">
        <q-card
          flat
          bordered
          class="kpi kpi--homework">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">تکالیف در انتظار ارسال</div>
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

      <!-- 4. KPI Grades / Calendar -->
      <div
        class="col-12 col-sm-6"
        :class="stats.has_skyroom_feature ? 'col-md-3' : 'col-md-4'">
        <q-card
          flat
          bordered
          class="kpi kpi--grades">
          <q-card-section class="row items-start justify-between">
            <div>
              <div class="text-caption kpi__label">نمرات کارنامه اخیر</div>
              <div class="text-h5 text-weight-bolder kpi__value">
                {{ stats.recent_grades.length }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">آخرین ارزیابی‌ها</div>
            </div>
            <q-avatar
              size="44px"
              class="kpi__icon"
              icon="grading" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MAIN CRITICAL ACTION ROW: سه بخش با بیشترین اهمیت زمانی -->
    <div class="row q-col-gutter-md q-mt-md">

      <!-- اولویت ۱: کلاس‌های آنلاین اسکای‌روم -->
      <div
        v-if="stats.has_skyroom_feature"
        class="col-12 col-lg-4">
        <q-card
          flat
          bordered
          class="panel full-height">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="teal-1"
                text-color="teal-9"
                icon="cast_for_education" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">کلاس‌های آنلاین اسکای‌روم</div>
                <div class="text-caption text-grey-7">جلسات زنده و پیش‌رو</div>
              </div>
            </div>
            <q-badge
              v-if="activeOnlineClasses.length"
              color="teal-1"
              text-color="teal-9"
              class="text-weight-bold">
              {{ activeOnlineClasses.length }} جلسه
            </q-badge>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- اسکلتون لودینگ -->
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
                  <q-skeleton
                    type="text"
                    width="60%" />
                  <q-skeleton
                    type="text"
                    width="40%" />
                </q-item-section>
              </q-item>
            </q-list>

            <!-- امپتی استیت -->
            <div
              v-else-if="!activeOnlineClasses.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="videocam_off"
                size="42px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">فعلاً کلاس آنلاینی در برنامه نیست</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                به محض نزدیک شدن به شروع جلسه، لینک ورود در این قسمت قرار می‌گیرد.
              </div>
            </div>

            <!-- لیست جلسات اسکای‌روم فانتزی -->
            <q-list
              v-else
              class="q-gutter-y-sm">
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
                      class="chip-status-active">
                      درحال برگزاری
                    </q-chip>
                    <q-chip
                      v-else
                      dense
                      class="chip-status-waiting">
                      به‌زودی
                    </q-chip>
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
          </q-card-section>
        </q-card>
      </div>

      <!-- اولویت ۲: آزمون‌های پیش‌رو (با اولویت و تفکیک آزمون‌های آنلاین) -->
      <div :class="stats.has_skyroom_feature ? 'col-12 col-lg-4' : 'col-12 col-lg-6'">
        <q-card
          flat
          bordered
          class="panel full-height">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="purple-1"
                text-color="purple-9"
                icon="quiz" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">آزمون‌های پیش‌رو</div>
                <div class="text-caption text-grey-7">ارزیابی‌های آنلاین و حضوری</div>
              </div>
            </div>

            <q-btn
              flat
              dense
              color="primary"
              icon-right="chevron_left"
              label="همه"
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
                  <q-skeleton
                    type="text"
                    width="60%" />
                  <q-skeleton
                    type="text"
                    width="40%" />
                </q-item-section>
              </q-item>
            </q-list>

            <div
              v-else-if="!upcomingExams.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="celebration"
                size="42px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">فعلاً آزمون نزدیکی نداری</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                فرصت عالی برای مرور و استراحت!
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
                <q-item-section avatar>
                  <q-avatar
                    :color="e.delivery_mode === 'online' ? 'purple-1' : 'blue-grey-1'"
                    :text-color="e.delivery_mode === 'online' ? 'purple-9' : 'blue-grey-9'"
                    :icon="e.delivery_mode === 'online' ? 'devices' : 'edit_calendar'"
                    size="42px" />
                </q-item-section>

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

                  <div class="row items-center text-caption text-grey-7 q-gutter-x-sm q-mt-xs">
                    <span>{{ formatDateTime(examDate(e)) }}</span>
                    <span v-if="e.online_exam_detail?.time_limit_minutes">
                      • {{ e.online_exam_detail.time_limit_minutes }} دقیقه
                    </span>
                  </div>
                </q-item-section>

                <q-item-section
                  side
                  class="column items-end">
                  <q-chip
                    dense
                    size="11px"
                    text-color="white"
                    :color="getExamStatus(e).color"
                    :icon="getExamStatus(e).icon"
                    class="q-ma-none text-weight-bold">
                    {{ getExamStatus(e).label }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- اولویت ۳: تکالیف پیش‌رو و ارسال‌نشده -->
      <div :class="stats.has_skyroom_feature ? 'col-12 col-lg-4' : 'col-12 col-lg-6'">
        <q-card
          flat
          bordered
          class="panel full-height">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                color="orange-1"
                text-color="orange-9"
                icon="assignment" />
              <div>
                <div class="text-subtitle1 text-weight-bolder">تکالیف در انتظار ارسال</div>
                <div class="text-caption text-grey-7">نیازمند اقدام دانش‌آموز</div>
              </div>
            </div>

            <q-btn
              flat
              dense
              color="primary"
              icon-right="chevron_left"
              label="همه"
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
                  <q-skeleton
                    type="text"
                    width="60%" />
                  <q-skeleton
                    type="text"
                    width="40%" />
                </q-item-section>
              </q-item>
            </q-list>

            <div
              v-else-if="!pendingHomeworks.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="done_all"
                size="42px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">تمام تکالیف ارسال شده‌اند</div>
              <div class="text-caption text-grey-7 q-mt-xs">خیالت راحت، کار عقب‌افتاده‌ای نداری!</div>
            </div>

            <q-list
              v-else
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
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- SECONDARY SECTION: Recent Grades & Calendar Events -->
    <div class="row q-col-gutter-md q-mt-md">
      <!-- نمرات اخیر -->
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
                <div class="text-caption text-grey-7">آخرین نمرات ثبت‌شده</div>
              </div>
            </div>

            <q-btn
              flat
              dense
              color="primary"
              icon-right="chevron_left"
              label="همه نمرات"
              :to="{ name: 'Student.Grade.List' }" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div
              v-if="!stats.recent_grades.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="inbox"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">هنوز نمره‌ای ثبت نشده</div>
              <div class="text-caption text-grey-7 q-mt-xs">به محض ثبت، اینجا میاد تو ویترین.</div>
            </div>

            <q-list
              v-else
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
          </q-card-section>
        </q-card>
      </div>

      <!-- تقویم آموزشی -->
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
                <div class="text-caption text-grey-7">رویدادها و برنامه‌های نزدیک</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div
              v-if="!upcomingEvents.length"
              class="empty q-pa-lg rounded-borders">
              <q-icon
                name="event_available"
                size="40px"
                class="text-grey-5" />
              <div class="text-subtitle2 text-weight-bolder q-mt-sm">رویدادی ثبت نشده است</div>
              <div class="text-caption text-grey-7 q-mt-xs">تقویم فعلاً خلوت است.</div>
            </div>

            <q-list
              v-else
              bordered
              separator
              class="rounded-borders">
              <q-item
                v-for="ev in upcomingEvents.slice(0, 5)"
                :key="String((ev as any).id)"
                class="q-py-sm">
                <q-item-section avatar>
                  <q-avatar
                    :style="{
                      background: (ev as any).color || '#E0F2F1',
                      color: '#0F766E'
                    }"
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
                    {{ formatDateTime((ev as any).starts_at) }}
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useDate } from 'src/composables/Date'
import {
  student,
  type StudentDashboardData,
  type UpcomingExam
} from 'src/repositories/student'

const dateManager = useDate()

const stats = ref<StudentDashboardData>(getDefaultStats())
const loading = ref(false)

// لیست‌های استخراج‌شده
const activeOnlineClasses = computed(() => stats.value.active_online_classes || [])
const liveOnlineClasses = computed(() => activeOnlineClasses.value.filter((c) => c.is_live_now))
const upcomingExams = computed(() => stats.value.upcoming_exams || [])
const pendingHomeworks = computed(() => stats.value.pending_homeworks || [])
const upcomingEvents = computed(() => stats.value.upcoming_events || [])

const studyProgress = computed(() => {
  const minutes = stats.value.total_study_minutes_this_month || 0
  const goal = 600
  return Math.max(0, Math.min(1, minutes / goal))
})

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

async function loadDashboard () {
  loading.value = true
  try {
    stats.value = await student.dashboard()
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
  background:
    radial-gradient(1200px 600px at 12% 0%, rgba(124, 77, 255, 0.08), transparent 60%),
    radial-gradient(900px 500px at 92% 18%, rgba(45, 127, 249, 0.08), transparent 55%),
    radial-gradient(900px 500px at 70% 80%, rgba(255, 152, 0, 0.06), transparent 60%);
  min-height: calc(100vh - 120px);
}

/* ========================================================
   FANTASY HERO STYLES & ANIMATIONS
   ======================================================== */
.hero-fantasy {
  border-radius: 28px !important;
  color: #fff;
  border: none !important;
  background: linear-gradient(125deg, #4f46e5 0%, #7c3aed 35%, #ec4899 75%, #f59e0b 100%);
  background-size: 300% 300%;
  animation: gradientShift 10s ease infinite;
  box-shadow: 0 20px 45px -10px rgba(124, 58, 237, 0.45);
  overflow: hidden;
}

/* ۱. انیمیشن پس‌زمینه رنگی متحرک */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ۲. گوی‌های رنگی ژله‌ای معلق (Organic Blobs) */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(55px);
  pointer-events: none;
  opacity: 0.65;
  mix-blend-mode: overlay;
  z-index: 1;
}

.blob-1 {
  width: 260px;
  height: 260px;
  background: #38bdf8;
  top: -60px;
  right: 15%;
  animation: floatOrb 8s ease-in-out infinite alternate;
}

.blob-2 {
  width: 220px;
  height: 220px;
  background: #f43f5e;
  bottom: -40px;
  left: 20%;
  animation: floatOrb 6s ease-in-out infinite alternate-reverse;
}

.blob-3 {
  width: 180px;
  height: 180px;
  background: #facc15;
  top: 40%;
  left: 5%;
  animation: floatOrb 9s ease-in-out infinite alternate;
}

@keyframes floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(25px, -30px) scale(1.15);
  }
}

/* ۳. استیکرها و جرقه‌های معلق در هوا */
.sparkle {
  position: absolute;
  user-select: none;
  pointer-events: none;
  font-size: 22px;
  z-index: 1;
  opacity: 0.7;
  animation: sparkleBounce 4s ease-in-out infinite alternate;
}
.sparkle-1 { top: 12px; left: 10%; animation-delay: 0.2s; }
.sparkle-2 { bottom: 15px; right: 28%; font-size: 26px; animation-delay: 1.1s; }
.sparkle-3 { top: 40%; right: 4%; animation-delay: 0.7s; }

@keyframes sparkleBounce {
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
  100% { transform: translateY(-12px) rotate(15deg); opacity: 0.9; }
}

/* ۴. آواتار با افکت پالس */
.avatar-wrapper {
  position: relative;

  .hero__avatar {
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    &:hover {
      transform: scale(1.1) rotate(-8deg);
    }
  }

  .avatar-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 16px;
    background: #ffdd00;
    border-radius: 50%;
    padding: 2px 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
}

.brand-glow {
  color: #fff;
  text-shadow: 0 0 16px rgba(255, 255, 255, 0.8), 0 0 30px rgba(250, 204, 21, 0.6);
}

.hero__sub {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* ۵. دکمه‌های جذاب کپسولی و آبنباتی */
.btn-candy {
  transition: all 0.25s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }

  &--primary {
    background: #ffffff !important;
    color: #6366f1 !important;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

    &:hover {
      box-shadow: 0 10px 22px rgba(255, 255, 255, 0.3);
      color: #4f46e5 !important;
    }
  }

  &--glass {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.28) !important;
    }
  }
}

/* ۶. باکس شیشه‌ای نئومورفیک مطالعه */
.hero__glass-card {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.chip-status {
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.score-counter {
  text-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.text-white-8 {
  color: rgba(255, 255, 255, 0.85);
}

/* پروگرس بار کاستوم */
.custom-progress {
  background: rgba(255, 255, 255, 0.2) !important;
  :deep(.q-linear-progress__model) {
    background: linear-gradient(90deg, #facc15 0%, #38bdf8 100%) !important;
    box-shadow: 0 0 10px rgba(250, 204, 21, 0.6);
  }
}


/* LIVE SKYROOM ALERT BANNER */
.live-banner {
  border-radius: 14px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.live-pulse {
  position: absolute;
  top: 0;
  right: 0;
  width: 13px;
  height: 13px;
  background-color: #22c55e;
  border-radius: 50%;
  border: 2px solid #fff;
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.live-btn {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

/* KPI CARDS */
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
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(30, 41, 59, 0.09);
    border-color: rgba(45, 127, 249, 0.3);

    &::before {
      opacity: 0.38;
    }
  }
}

.kpi__label {
  color: #64748b;
  font-size: 0.8rem;
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

/* PANELS */
.panel {
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
  display: flex;
  flex-direction: column;
}

.bg-teal-0 {
  background-color: #f0fdfa;
}

.hover-scale {
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }
}

.empty {
  text-align: center;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(255, 255, 255, 1));
  border: 1.5px dashed rgba(15, 23, 42, 0.16);
}


/* =========================================
   FANTASY SKYROOM & EMERALD LIVE STYLES
   ========================================= */

/* بنر بزرگ اعلان زنده (سبز زمردی فانتزی با عمق سه بعدی) */
.live-banner-fantasy {
  border-radius: 20px;
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 12px 30px -6px rgba(16, 185, 129, 0.45);

  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 60%);
    pointer-events: none;
    animation: rotateGlow 10s linear infinite;
  }
}

.text-emerald-light {
  color: #d1fae5;
}

/* آواتار متحرک بنر */
.live-avatar-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid #a7f3d0;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
}

.live-orbit {
  position: absolute;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  animation: orbitPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;

  &--delay {
    animation-delay: 0.9s;
  }
}

/* بج متنی چشمک‌زن */
.badge-live-tag {
  background: #ffffff !important;
  color: #059669 !important;
  font-size: 11px;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.blinking-dot {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  display: inline-block;
  margin-left: 5px;
  animation: blink 1s ease infinite alternate;
}

/* دکمه ورود موشکی */
.btn-enter-live {
  background: #ffffff;
  color: #047857;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: scale(1.06) translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    color: #065f46;
  }
}

/* کارت‌های اختصاصی آیتم‌های اسکای روم داخل پنل */
.sky-item-card {
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;

  &--live {
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    border: 1.5px solid #a7f3d0;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.12);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
    }
  }
}

.avatar-sky--live {
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

.avatar-sky--idle {
  background: #f1f5f9;
  color: #64748b;
}

.pulse-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border: 2px solid #ffffff;
  border-radius: 50%;
  animation: pulsePoint 1.4s infinite;
}

.chip-status-active {
  background: #d1fae5;
  color: #065f46;
  font-weight: 700;
  font-size: 10px;
}

.chip-status-waiting {
  background: #f1f5f9;
  color: #64748b;
  font-weight: 600;
  font-size: 10px;
}

.btn-sky--active {
  background: #10b981;
  color: #fff;
  border-radius: 10px;
  font-weight: 700;
  padding: 4px 12px;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.35);

  &:hover {
    background: #059669;
  }
}

.btn-sky--idle {
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-weight: 600;
  padding: 4px 10px;
}

/* انیمیشن‌ها */
@keyframes orbitPulse {
  0% { transform: scale(0.85); opacity: 0.9; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes pulsePoint {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes blink {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
