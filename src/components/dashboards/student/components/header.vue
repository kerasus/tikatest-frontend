<template>
  <q-card
    flat
    class="student-header-compact q-mb-md">
    <!-- افکت‌های شیشه‌ای و نورهای امبینت پاستلی پشت صحنه -->
    <div class="header-aurora header-aurora--one" />
    <div class="header-aurora header-aurora--two" />
    <div class="header-aurora header-aurora--three" />
    <div class="header-specular" />

    <div class="sparkle sparkle--1">✨</div>
    <div class="sparkle sparkle--2">⚡</div>

    <q-card-section class="header-main-row q-pa-none">
      <!-- بخش برند و پیام خوش‌آمد فشرده -->
      <div class="welcome-box">
        <div class="brand-bar row items-center no-wrap q-gutter-x-sm">
          <!-- لوگوی اپلیکیشن -->
          <div class="compact-logo-badge compact-logo-badge--app">
            <img
              :src="appLogo"
              alt="سنجاد"
              class="logo-img">
            <span class="logo-name text-weight-bolder">سنجاد</span>
          </div>

          <q-icon
            name="bolt"
            class="divider-lightning" />

          <!-- لوگوی مدرسه -->
          <div class="compact-logo-badge compact-logo-badge--school">
            <img
              :src="currentSchoolLogo"
              :alt="schoolName"
              class="logo-img"
              @error="handleSchoolLogoError">
            <span class="logo-name text-weight-bolder ellipsis">{{ schoolName }}</span>
          </div>

          <!-- بج وضعیت فعال و پرانرژی -->
          <div class="status-pill">
            <span class="status-dot" />
            <span>آماده یادگیری 🚀</span>
          </div>
        </div>

        <div class="welcome-titles">
          <h1 class="hero-title">
            داشبورد دانش‌آموزی
            <span class="gradient-text">سنجاد</span>
          </h1>
          <p class="hero-subtitle">
            امروز هم یک قدم پرانرژی‌تر به سمت هدفت بردار! ✨
          </p>
        </div>
      </div>

      <!-- پنل دسترسی سریع فشرده و افقی -->
      <div class="quick-nav-panel">
        <div class="quick-nav-header row items-center justify-between">
          <div class="row items-center q-gutter-x-xs text-caption text-weight-bolder text-deep-fantasy">
            <q-icon
              name="local_fire_department"
              color="orange-8"
              size="18px" />
            <span>دسترسی سریع</span>
          </div>
          <span class="quick-nav-hint">انتخاب کن</span>
        </div>

        <div class="quick-nav-buttons">
          <q-btn
            unelevated
            no-caps
            dense
            icon="quiz"
            label="آزمون‌ها"
            class="nav-btn nav-btn--exam"
            :to="{ name: 'Student.Exam.List' }" />

          <q-btn
            unelevated
            no-caps
            dense
            icon="assignment"
            label="تکالیف"
            class="nav-btn nav-btn--homework"
            :to="{ name: 'Student.Homework.List' }" />

          <q-btn
            unelevated
            no-caps
            dense
            icon="grading"
            label="نمرات"
            class="nav-btn nav-btn--grades"
            :to="{ name: 'Student.Grade.List' }" />

          <q-btn
            v-if="hasFtpPanelFeature"
            unelevated
            no-caps
            dense
            icon="smart_display"
            label="فیلم‌ها"
            class="nav-btn nav-btn--films"
            :to="{ name: 'Student.Film.List' }" />
        </div>
      </div>
    </q-card-section>

    <!-- فوتر خطی فوق‌العاده باریک -->
    <div class="header-strip-footer row items-center justify-between no-wrap">
      <div class="row items-center q-gutter-x-sm">
        <div class="strip-item">
          <q-icon
            name="school"
            size="15px"
            class="text-indigo-6" />
          <span class="ellipsis">{{ schoolName }}</span>
        </div>
        <span class="strip-bullet">•</span>
        <div class="strip-item gt-xs">
          <q-icon
            name="verified"
            size="15px"
            class="text-teal-6" />
          <span>یادگیری هوشمند و پویا</span>
        </div>
      </div>

      <div class="strip-indicator row items-center q-gutter-x-xs">
        <span class="indicator-glow" />
        <span>سیستم فعال</span>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SchoolFeatureKey } from 'src/repositories/schoolFeature'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const currentSchoolManager = useCurrentSchool()
const appLogo = '/images/logo.png'

const currentSchool = computed(() => {
  return currentSchoolManager.currentSchool.value as any
})

const schoolName = computed(() => {
  return (
    currentSchool.value?.name ||
    currentSchool.value?.title ||
    currentSchool.value?.school_name ||
    'مدرسه شما'
  )
})

const currentSchoolLogo = computed(() => {
  const logo = currentSchool.value?.logo

  if (!logo) {
    return appLogo
  }

  const logoValue = String(logo).trim()

  if (
    logoValue.startsWith('http://') ||
    logoValue.startsWith('https://') ||
    logoValue.startsWith('//') ||
    logoValue.startsWith('/') ||
    logoValue.startsWith('data:')
  ) {
    return logoValue
  }

  return `/${logoValue.replace(/^\/+/, '')}`
})

const hasFtpPanelFeature = computed(() => {
  const features = currentSchool.value?.features || []

  return features.some((feature: any) =>
    feature?.feature_key === SchoolFeatureKey.FtpPanel &&
    (
      feature?.is_enabled === true ||
      feature?.is_enabled === 1 ||
      feature?.is_enabled === '1'
    )
  )
})

function handleSchoolLogoError (event: Event) {
  const image = event.currentTarget as HTMLImageElement

  if (!image || image.dataset.fallback === 'true') {
    return
  }

  image.dataset.fallback = 'true'
  image.src = appLogo
}
</script>

<style scoped lang="scss">
.student-header-compact {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  direction: rtl;
  border-radius: 26px !important;

  /* استفاده از عکس پس‌زمینه جدید با پوشش گرادیانتی نوری شیشه‌ای */
  background:
    linear-gradient(135deg, rgba(20, 10, 45, 0.45) 0%, rgba(45, 20, 80, 0.35) 100%),
    url('/images/background/header-bg-1.png') center/cover no-repeat !important;

  backdrop-filter: blur(28px) saturate(210%);
  -webkit-backdrop-filter: blur(28px) saturate(210%);

  border: 1.5px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 20px 45px -10px rgba(76, 29, 149, 0.3),
    0 8px 20px -6px rgba(14, 165, 233, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.7),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}


/* نورهای فانتزی و امبینت پشت زمینه */
.header-aurora {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(36px);
  opacity: 0.6;
  z-index: 0;
}

.header-aurora--one {
  top: -40px;
  right: 15%;
  width: 170px;
  height: 170px;
  background: radial-gradient(circle, #fbcfe8 0%, #e9d5ff 70%, transparent 80%);
}

.header-aurora--two {
  bottom: -45px;
  left: 20%;
  width: 190px;
  height: 190px;
  background: radial-gradient(circle, #fed7aa 0%, #fef08a 60%, transparent 80%);
}

.header-aurora--three {
  top: 10%;
  left: -20px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #bae6fd 0%, #c7d2fe 70%, transparent 80%);
}

/* افکت شیشه‌ای داخلی روی عکس */
.header-specular {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.02) 100%);
  pointer-events: none;
  z-index: 0;
}

.sparkle {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  opacity: 0.75;
  animation: sparkle-glow 3s ease-in-out infinite alternate;
}

.sparkle--1 {
  top: 14px;
  right: 38%;
  font-size: 17px;
}

.sparkle--2 {
  bottom: 34px;
  left: 36%;
  font-size: 15px;
  animation-delay: -1.5s;
}

/* ساختار گرید چگال هدر */
.header-main-row {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(310px, 0.95fr);
  align-items: center;
  gap: 18px;
  padding: 16px 20px !important; /* پدینگ کامپکت برای حذف اسکرول */
}

/* استایل باکس خوش‌آمد */
.welcome-box {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-bar {
  flex-wrap: wrap;
  gap: 8px;
}

.compact-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px 3px 5px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.08);

  .logo-img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 7px;
  }

  .logo-name {
    font-size: 12px;
    color: #1e1b4b;
    max-width: 130px;
  }
}

.compact-logo-badge--app {
  border-color: rgba(168, 85, 247, 0.35);
}

.compact-logo-badge--school {
  border-color: rgba(251, 146, 60, 0.4);
}

.divider-lightning {
  color: #f59e0b;
  font-size: 15px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(240, 253, 250, 0.85);
  border: 1px solid rgba(45, 212, 191, 0.5);
  color: #0f766e;
  font-size: 10.5px;
  font-weight: 700;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
  }
}

.welcome-titles {
  .hero-title {
    margin: 0;
    font-size: clamp(19px, 2.2vw, 24px);
    font-weight: 900;
    line-height: 1.25;
    color: #1e1b4b;
    letter-spacing: -0.4px;

    .gradient-text {
      background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .hero-subtitle {
    margin: 3px 0 0;
    font-size: 12px;
    color: #6b21a8;
    opacity: 0.88;
    line-height: 1.5;
  }
}

/* پنل دسترسی سریع (فوق‌العاده کامپکت) */
.quick-nav-panel {
  border-radius: 18px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 8px 20px -6px rgba(118, 75, 162, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}

.text-deep-fantasy {
  color: #1e1b4b;
}

.quick-nav-hint {
  font-size: 10px;
  color: #7c3aed;
  opacity: 0.75;
}

.quick-nav-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 8px;
}

.nav-btn {
  min-height: 38px;
  padding: 0 10px;
  border-radius: 12px !important;
  color: #ffffff !important;
  font-weight: 800;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);

  :deep(.q-btn__content) {
    gap: 6px;
    font-size: 11.5px;
  }

  :deep(.q-icon) {
    font-size: 17px;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }
}

.nav-btn--exam {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
}

.nav-btn--homework {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
}

.nav-btn--grades {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
}

.nav-btn--films {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
}

/* فوتر باریک چسبیده */
.header-strip-footer {
  position: relative;
  z-index: 2;
  min-height: 32px;
  padding: 0 20px;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  background: rgba(255, 255, 255, 0.35);
  font-size: 11px;
  color: #475569;
}

.strip-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.strip-bullet {
  color: #cbd5e1;
}

.strip-indicator {
  font-size: 10.5px;
  font-weight: 700;
  color: #0d9488;

  .indicator-glow {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
  }
}

@keyframes sparkle-glow {
  0% { transform: scale(0.85); opacity: 0.5; }
  100% { transform: scale(1.15) rotate(10deg); opacity: 1; }
}

/* ریسپانسیو و حفظ فشردگی */
@media (max-width: 960px) {
  .header-main-row {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 14px 16px !important;
  }
}

@media (max-width: 520px) {
  .student-header-compact {
    border-radius: 18px !important;
  }

  .header-main-row {
    padding: 12px 14px !important;
  }

  .compact-logo-badge .logo-name {
    max-width: 90px;
  }

  .welcome-titles .hero-title {
    font-size: 18px;
  }

  .nav-btn {
    min-height: 36px;
    :deep(.q-btn__content) {
      font-size: 11px;
    }
  }

  .header-strip-footer {
    padding: 0 14px;
  }
}
</style>
