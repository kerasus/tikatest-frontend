<template>
  <div class="school-dashboard q-pa-md">
    <!-- بنر خوش‌آمدگویی فانتزی، شاد و متحرک سنجاد -->
    <div class="welcome-hero q-mb-xl">
      <!-- لایه‌های پس‌زمینه زنده و پترن متحرک -->
      <div class="hero-animated-canvas">
        <div class="ambient-glow glow-1" />
        <div class="ambient-glow glow-2" />
        <div class="ambient-glow glow-3" />
        <div class="moving-pattern-grid" />
        <div class="glass-layer" />
      </div>

      <div class="hero-content row items-center justify-between no-wrap q-pa-lg">
        <div class="col-12 col-md-8 hero-text-col">
          <div class="badge-tag q-mb-sm">
            <q-icon
              name="auto_awesome"
              size="18px"
              class="q-mr-xs text-amber-9 spin-slow" />
            <span class="badge-text">سامانه هوشمند سنجاد</span>
            <span class="badge-pulse" />
          </div>

          <h1 class="hero-title text-h4 text-weight-bolder q-my-none">
            داشبورد مدیریت
            <span class="highlight-text">
              {{ currentSchoolManager.currentSchool.value?.name || 'مدرسه' }}
            </span>
          </h1>

          <p class="hero-subtitle text-body1 q-mt-sm q-mb-none">
            گزارش عملکرد، شاخص‌های کلیدی و مدیریت امور آموزشی در یک نگاه
          </p>
        </div>

        <div class="col-md-4 gt-sm flex justify-end">
          <div class="hero-icon-container">
            <div class="icon-halo-effect" />
            <div class="floating-wrapper">
              <q-icon
                name="school"
                size="96px"
                class="hero-floating-icon" />
            </div>
            <!-- ذرات درخشان شاد -->
            <div class="sparkle s1">✦</div>
            <div class="sparkle s2">★</div>
            <div class="sparkle s3">✦</div>
          </div>
        </div>
      </div>
    </div>


    <!-- کارت‌های آمار فانتزی و تعاملی -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div
        v-for="(card, index) in statCards"
        :key="index"
        class="col-12 col-sm-6 col-lg-3">
        <q-card
          v-ripple
          class="stat-card cursor-pointer"
          :class="`stat-card--${card.theme}`"
          flat
          @click="toStat(card.to)">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="stat-label text-subtitle2 text-weight-medium">{{ card.title }}</div>
                <div class="stat-value text-h3 text-weight-bolder q-mt-xs">
                  <q-skeleton
                    v-if="loading"
                    type="text"
                    width="80px"
                    height="48px" />
                  <span v-else>{{ card.value.toLocaleString('fa-IR') }}</span>
                </div>
              </div>
              <div class="stat-icon-wrapper flex flex-center">
                <q-icon
                  :name="card.icon"
                  size="32px" />
              </div>
            </div>

            <!-- فوتر کوچک برای حس زنده بودن داده‌ها + آیکون فلش شیک -->
            <div class="stat-footer row items-center justify-between q-mt-md text-caption">
              <div class="row items-center no-wrap">
                <q-icon
                  :name="card.subIcon"
                  size="16px"
                  class="q-mr-xs" />
                <span>{{ card.subText }}</span>
              </div>
              <q-icon
                name="arrow_forward"
                size="14px"
                class="stat-footer__arrow" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- دسترسی‌های سریع و اکشن‌های کلیدی (Quick Actions) -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-12">
        <q-card
          class="action-card"
          flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="section-title text-h6 text-weight-bold">
                <q-icon
                  name="bolt"
                  color="amber-8"
                  size="24px"
                  class="q-mr-xs" />
                دسترسی‌های سریع و پرکاربرد
              </div>
              <span class="text-caption text-grey-6">میان‌برهای سامانه</span>
            </div>

            <div class="row q-col-gutter-md">
              <div
                v-for="(action, idx) in quickActions"
                :key="idx"
                class="col-6 col-sm-4">
                <q-btn
                  flat
                  no-caps
                  class="quick-action-btn full-width"
                  :to="action.to">
                  <div class="column items-center q-py-sm">
                    <div
                      class="action-icon-circle q-mb-sm"
                      :style="{ backgroundColor: action.bgColor, color: action.color }">
                      <q-icon
                        :name="action.icon"
                        size="24px" />
                    </div>
                    <div class="text-weight-bold text-body2 text-grey-9">{{ action.label }}</div>
                    <div class="text-caption text-grey-6">{{ action.caption }}</div>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- وضعیت اسکای‌روم و کلاس‌های آنلاین -->
      <div
        v-if="false"
        class="col-12 col-lg-4">
        <q-card
          class="action-card skyroom-preview-card"
          flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="section-title text-h6 text-weight-bold">
                <q-icon
                  name="video_camera_front"
                  color="primary"
                  size="24px"
                  class="q-mr-xs" />
                کلاس آنلاین (اسکای‌روم)
              </div>
              <q-badge
                color="positive"
                rounded
                floating
                label="فعال" />
            </div>

            <p class="text-body2 text-grey-7 line-height-relaxed">
              اتاق‌ها و زمان‌بندی جلسات اسکای‌روم را بررسی، پیکربندی یا همگام‌سازی کنید.
            </p>

            <div class="q-mt-lg flex flex-center">
              <q-btn
                unelevated
                color="primary"
                rounded
                icon="meeting_room"
                label="مدیریت اتاق‌های اسکای‌روم"
                class="full-width q-py-sm text-weight-bold"
                to="/school/skyroom" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import ExamAPI from 'src/repositories/exam'
import StudentAPI from 'src/repositories/student'
import HomeworkAPI from 'src/repositories/homework'
import SchoolClassAPI from 'src/repositories/schoolClass'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const router = useRouter()
const examAPI = new ExamAPI()
const studentAPI = new StudentAPI()
const homeworkAPI = new HomeworkAPI()
const schoolClassAPI = new SchoolClassAPI()

const currentSchoolManager = useCurrentSchool()

const loading = ref(true)
const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})
const statCards = ref([
  {
    title: 'دانش‌آموزان ثبت‌نامی',
    value: stats.value.students,
    icon: 'groups',
    theme: 'indigo',
    subIcon: 'trending_up',
    subText: 'کل محصلین فعال',
    to: { name: 'Panel.Student.List' }
  },
  {
    title: 'مدیریت کلاس‌ها',
    value: stats.value.classes,
    icon: 'class',
    theme: 'emerald',
    subIcon: 'domain',
    subText: 'پایه‌ها و گروه‌ها',
    to: { name: 'Panel.CurrentSchool.Classes' }
  },
  {
    title: 'آزمون‌های برگزارشده',
    value: stats.value.exams,
    icon: 'quiz',
    theme: 'rose',
    subIcon: 'fact_check',
    subText: 'آنلاین و تستی',
    to: { name: 'Panel.Exam.Online.List' }
  },
  {
    title: 'تکالیف ثبت‌شده',
    value: stats.value.homework,
    icon: 'assignment',
    theme: 'amber',
    subIcon: 'task_alt',
    subText: 'پروژه‌ها و تمرین‌ها',
    to: { name: 'Panel.Homework.List' }
  }
])
const quickActions = ref([
  {
    label: 'آزمون آنلاین جدید',
    caption: 'طراحی آزمون و سوالات تستی',
    icon: 'quiz', // یا 'laptop_chromebook' / 'timer'
    bgColor: '#e0f2fe',
    color: '#0284c7', // تم آبی آسمانی/تکنولوژی و آزمون آنلاین
    to: { name: 'Panel.Exam.Online.Create' }
  },
  {
    label: 'ثبت نمره',
    caption: 'ورود نمرات آزمون حضوری',
    icon: 'fact_check', // یا 'grade' / 'edit_note'
    bgColor: '#dcfce7',
    color: '#16a34a', // تم سبز ارزیابی، ثبت نمره و موفقیت
    to: { name: 'Panel.Exam.InPerson.Create' }
  },
  {
    label: 'تعریف تکلیف',
    caption: 'ارسال تمرین و تکالیف کلاسی',
    icon: 'assignment_add', // یا 'menu_book' / 'history_edu'
    bgColor: '#fef3c7',
    color: '#d97706', // تم کهربایی/نارنجی تکالیف و کار در منزل
    to: { name: 'Panel.Homework.Create' }
  }
])

function toStat (route: RouteLocationRaw) {
  router.push(route)
}

onMounted(async () => {
  loading.value = true
  const schoolId = currentSchoolManager.currentSchool.value?.id

  try {
    const [studentsRes, classesRes, examsRes, homeworkRes] = await Promise.all([
      studentAPI.index({ length: 1, school_id: schoolId }),
      schoolClassAPI.index({ length: 1, school_id: schoolId }),
      examAPI.index({ length: 1, school_id: schoolId }),
      homeworkAPI.index({ length: 1, school_id: schoolId })
    ])

    stats.value.students = studentsRes.total || 0
    stats.value.classes = classesRes.total || 0
    stats.value.exams = examsRes.total || 0
    stats.value.homework = homeworkRes.total || 0
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.school-dashboard {

  /* ==========================================================================
   🌈 Bright, Candy-Vibrant Hero Banner with Dynamic Moving Pattern
   ========================================================================== */
.welcome-hero {
  position: relative;
  border-radius: 28px;
  /* بک‌گراند گرادیان شاد و پرطراوت (آبی-بنفش روشن به ارغوانی و فیروزه‌ای) */
  background: linear-gradient(125deg, #4f46e5 0%, #7c3aed 35%, #06b6d4 100%);
  overflow: hidden;
  box-shadow: 0 16px 36px -10px rgba(99, 102, 241, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.4) inset;
  isolation: isolate;

  /* 🎨 پس‌زمینه متحرک و جلوه‌های بصری */
  .hero-animated-canvas {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;

    /* اورب‌های رنگی نوری شاداب */
    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(65px);
      opacity: 0.85;
      mix-blend-mode: screen;
      will-change: transform;
    }

    /* حباب طلایی/هلویی شاد */
    .glow-1 {
      top: -20%;
      right: 15%;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, #f43f5e 0%, #fb923c 70%);
      animation: floatOrbit1 12s ease-in-out infinite alternate;
    }

    /* حباب سبز آبی / فیروزه‌ای خنک */
    .glow-2 {
      bottom: -35%;
      left: 10%;
      width: 360px;
      height: 360px;
      background: radial-gradient(circle, #2dd4bf 0%, #38bdf8 70%);
      animation: floatOrbit2 15s ease-in-out infinite alternate;
    }

    /* حباب بنفش پاستلی درخشان */
    .glow-3 {
      top: 15%;
      left: 45%;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #ec4899 0%, #c084fc 70%);
      animation: floatOrbit3 10s ease-in-out infinite alternate;
    }

    /* 🌊 پترن هندسی متحرک بی‌نهایت (Moving Polka & Mesh Pattern) */
    .moving-pattern-grid {
      position: absolute;
      inset: -100px;
      background-image:
        radial-gradient(circle, rgba(255, 255, 255, 0.28) 2px, transparent 2.5px),
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 32px 32px, 64px 64px, 64px 64px;
      animation: infinitePatternMove 5s linear infinite;
      opacity: 0.65;
    }

    /* لایه شیشه‌ای ملایم روی پترن برای عمق‌دهی */
    .glass-layer {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
      backdrop-filter: blur(2px);
    }
  }

  /* محتوای بنر */
  .hero-content {
    position: relative;
    z-index: 2;
  }

  /* نشان (Badge) کریستالی با رنگ شاد */
  .badge-tag {
    display: inline-flex;
    align-items: center;
    position: relative;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(10px);
    padding: 6px 16px;
    border-radius: 999px;
    color: #4338ca;
    font-size: 0.88rem;
    font-weight: 700;
    box-shadow: 0 6px 18px rgba(31, 38, 135, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.8);

    .badge-pulse {
      position: absolute;
      left: 10px;
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulseVibrant 2s infinite;
    }
  }

  /* عنوان شاد و چشم‌نواز */
  .hero-title {
    color: #ffffff;
    line-height: 1.45;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 10px rgba(30, 27, 75, 0.25);

    .highlight-text {
      /* گرادیان رنگی پرانرژی زرد لیمویی به نارنجی تابستانی */
      background: linear-gradient(135deg, #fffbeb 0%, #fef08a 35%, #fed7aa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
      position: relative;
    }
  }

  .hero-subtitle {
    color: #e0f2fe;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    font-weight: 400;
  }

  /* 🎓 آیکون شناور با استایل شاداب */
  .hero-icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;

    .icon-halo-effect {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
      filter: blur(14px);
      animation: pulseHalo 3.5s ease-in-out infinite alternate;
    }

    .floating-wrapper {
      animation: floatToy 4.5s ease-in-out infinite;
    }

    .hero-floating-icon {
      color: #ffffff;
      filter: drop-shadow(0 10px 20px rgba(30, 27, 75, 0.3))
              drop-shadow(0 0 16px rgba(255, 255, 255, 0.7));
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover {
        transform: scale(1.15) rotate(12deg);
        filter: drop-shadow(0 14px 26px rgba(30, 27, 75, 0.4))
                drop-shadow(0 0 25px #fed7aa);
      }
    }

    /* ستاره‌ها و جرقه‌های شاد */
    .sparkle {
      position: absolute;
      font-size: 14px;
      pointer-events: none;
      animation: sparkleTwinkle 2.8s ease-in-out infinite alternate;

      &.s1 { top: 8%; right: 5%; color: #fef08a; animation-delay: 0.2s; font-size: 18px; }
      &.s2 { bottom: 12%; right: 18%; color: #fed7aa; animation-delay: 0.9s; font-size: 14px; }
      &.s3 { top: 22%; left: 2%; color: #ffffff; animation-delay: 1.8s; font-size: 20px; }
    }
  }
}

/* ==========================================================================
   🎬 انیمیشن‌های پترن و المان‌ها
   ========================================================================== */
/* حرکت روان و مورب پترن به صورت پیوسته (بی‌نهایت) */
@keyframes infinitePatternMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(64px, 64px);
  }
}

@keyframes floatOrbit1 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(-45px, 35px) scale(1.2); }
  100% { transform: translate(25px, -20px) scale(0.9); }
}

@keyframes floatOrbit2 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, -40px) scale(1.15); }
  100% { transform: translate(-30px, 25px) scale(0.95); }
}

@keyframes floatOrbit3 {
  0%   { transform: translate(0, 0) scale(0.95); }
  50%  { transform: translate(-35px, -25px) scale(1.2); }
  100% { transform: translate(40px, 30px) scale(1); }
}

@keyframes floatToy {
  0%, 100% { transform: translateY(0px) rotate(-6deg); }
  50%      { transform: translateY(-14px) rotate(5deg); }
}

@keyframes pulseHalo {
  0%   { transform: scale(0.85); opacity: 0.4; }
  100% { transform: scale(1.3); opacity: 0.9; }
}

@keyframes sparkleTwinkle {
  0%   { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
  50%  { opacity: 1; transform: scale(1.25) rotate(60deg); filter: drop-shadow(0 0 6px currentColor); }
  100% { opacity: 0.4; transform: scale(0.85) rotate(120deg); }
}

@keyframes pulseVibrant {
  0%   { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70%  { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.spin-slow {
  animation: spinSlow 9s linear infinite;
}

@keyframes spinSlow {
  100% { transform: rotate(360deg); }
}


  /* Stat Cards */
  .stat-card {
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -2px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-6px);
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.08),
        0 8px 10px -6px rgba(0, 0, 0, 0.04);
    }

    .stat-icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      transition: transform 0.3s ease;
    }

    &:hover .stat-icon-wrapper {
      transform: scale(1.1) rotate(6deg);
    }

    /* Themes */
    &--indigo {
      .stat-icon-wrapper {
        background: #e0e7ff;
        color: #4f46e5;
      }
      .stat-value {
        color: #3730a3;
      }
      .stat-label,
      .stat-footer {
        color: #6366f1;
      }
    }

    &--emerald {
      .stat-icon-wrapper {
        background: #d1fae5;
        color: #059669;
      }
      .stat-value {
        color: #065f46;
      }
      .stat-label,
      .stat-footer {
        color: #10b981;
      }
    }

    &--rose {
      .stat-icon-wrapper {
        background: #ffe4e6;
        color: #e11d48;
      }
      .stat-value {
        color: #9f1239;
      }
      .stat-label,
      .stat-footer {
        color: #f43f5e;
      }
    }

    &--amber {
      .stat-icon-wrapper {
        background: #fef3c7;
        color: #d97706;
      }
      .stat-value {
        color: #92400e;
      }
      .stat-label,
      .stat-footer {
        color: #f59e0b;
      }
    }
  }

  /* Action Cards */
  .action-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

    .section-title {
      color: #1e293b;
    }
  }

  /* Quick Action Buttons */
  .quick-action-btn {
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
    background: #f8fafc;
    transition: all 0.25s ease;

    &:hover {
      background: #ffffff;
      border-color: #6366f1;
      transform: translateY(-3px);
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1);
    }

    .action-icon-circle {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    &:hover .action-icon-circle {
      transform: scale(1.1);
    }
  }

  .skyroom-preview-card {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;

    .line-height-relaxed {
      line-height: 1.8;
    }
  }
}
</style>
