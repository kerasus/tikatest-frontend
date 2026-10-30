<template>
  <q-card
    flat
    class="student-header-compact q-mb-md">
    <!-- لایه گرادیان شیشه‌ای و الگوی مدرن هدر -->
    <div class="header-overlay" />

    <q-card-section class="header-main-row q-pa-none">
      <!-- بخش برند، وضعیت و پیام خوش‌آمد -->
      <div class="welcome-box">
        <div class="brand-bar row items-center justify-between no-wrap">
          <div class="row items-center q-gutter-x-sm no-wrap">
            <!-- لوگوی پلتفرم سنجاد -->
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

            <!-- لوگوی مدرسه دانش‌آموز -->
            <div class="compact-logo-badge compact-logo-badge--school">
              <img
                :src="currentSchoolLogo"
                :alt="schoolName"
                class="logo-img"
                @error="handleSchoolLogoError">
              <span class="logo-name text-weight-bolder ellipsis">{{ schoolName }}</span>
            </div>
          </div>

          <!-- بج مدرن وضعیت پیام‌رسان بله (مدال افتخار یا دکمه فراخوان پرانرژی) -->
          <div class="bale-badge-slot">
            <student-bale-badge />
          </div>
        </div>

        <div class="welcome-titles q-mt-xs">
          <h1 class="hero-title row items-center no-wrap">
            <span>داشبورد دانش‌آموزی</span>
            <span class="gradient-text q-mr-xs">سنجاد</span>
          </h1>
          <p class="hero-subtitle">
            امروز هم یک قدم پرانرژی‌تر به سمت هدفت بردار! ✨
          </p>
        </div>
      </div>

      <!-- پنل دسترسی سریع فشرده و افقی -->
      <div class="quick-nav-panel">
        <div class="quick-nav-header row items-center justify-between">
          <div class="row items-center q-gutter-x-xs text-caption text-weight-bolder text-white">
            <q-icon
              name="local_fire_department"
              color="amber-4"
              size="18px" />
            <span>دسترسی سریع</span>
          </div>
          <span class="quick-nav-hint">میانبرها</span>
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

    <!-- فوتر خطی -->
    <div class="header-strip-footer row items-center justify-between no-wrap">
      <div class="row items-center q-gutter-x-sm">
        <div class="strip-item">
          <q-icon
            name="school"
            size="15px"
            class="text-amber-3" />
          <span class="ellipsis">{{ schoolName }}</span>
        </div>
        <span class="strip-bullet">•</span>
        <div class="strip-item gt-xs">
          <q-icon
            name="verified"
            size="15px"
            class="text-teal-3" />
          <span>یادگیری هوشمند و پیوسته</span>
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
import StudentBaleBadge from './StudentBaleBadge.vue'

const currentSchoolManager = useCurrentSchool()
const appLogo = '/images/logo.png'

const schoolName = computed(() => {
  return currentSchoolManager.currentSchool.value?.name || 'مدرسه شما'
})

const currentSchoolLogo = computed(() => {
  const logo = currentSchoolManager.currentSchool.value?.logo

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
  const features = currentSchoolManager.currentSchoolFeatures.value

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
  border-radius: 24px !important;

  /* تصویر پس‌زمینه با گرادیان تیره هماهنگ */
  background:
    linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(88, 28, 135, 0.65) 100%),
    url('/images/background/bg-2.jpeg') center/cover no-repeat !important;

  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 16px 36px -8px rgba(20, 10, 45, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.35);
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* ساختار گرید هدر */
.header-main-row {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(310px, 0.9fr);
  align-items: center;
  gap: 18px;
  padding: 18px 24px !important;
}

/* باکس خوش‌آمد */
.welcome-box {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.brand-bar {
  gap: 10px;
}

.compact-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 6px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  .logo-img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 6px;
    background: #ffffff;
    padding: 2px;
  }

  .logo-name {
    font-size: 12px;
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    max-width: 130px;
  }
}

.divider-lightning {
  color: #fbbf24;
  font-size: 16px;
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.7));
}

.welcome-titles {
  .hero-title {
    margin: 0;
    font-size: clamp(20px, 2.2vw, 24px);
    font-weight: 900;
    line-height: 1.3;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
    letter-spacing: -0.4px;

    .gradient-text {
      background: linear-gradient(135deg, #c084fc 0%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 6px rgba(192, 132, 252, 0.4));
    }
  }

  .hero-subtitle {
    margin: 4px 0 0;
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(243, 232, 255, 0.9);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    line-height: 1.5;
  }
}

/* پنل دسترسی سریع */
.quick-nav-panel {
  border-radius: 18px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.quick-nav-hint {
  font-size: 10.5px;
  color: rgba(233, 213, 255, 0.85);
}

.quick-nav-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.nav-btn {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 12px !important;
  color: #ffffff !important;
  font-weight: 800;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);

  :deep(.q-btn__content) {
    gap: 6px;
    font-size: 12px;
  }

  :deep(.q-icon) {
    font-size: 18px;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.32);
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

/* فوتر خطی */
.header-strip-footer {
  position: relative;
  z-index: 2;
  min-height: 32px;
  padding: 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 4, 22, 0.45);
  font-size: 11.5px;
  color: rgba(241, 245, 249, 0.85);
}

.strip-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.strip-bullet {
  color: rgba(255, 255, 255, 0.35);
}

.strip-indicator {
  font-size: 11px;
  font-weight: 700;
  color: #5eead4;

  .indicator-glow {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2dd4bf;
    box-shadow: 0 0 6px #2dd4bf;
  }
}

/* ریسپانسیو */
@media (max-width: 960px) {
  .header-main-row {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px !important;
  }

  .brand-bar {
    flex-wrap: wrap;
    gap: 8px;
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
    max-width: 80px;
  }

  .welcome-titles .hero-title {
    font-size: 18px;
  }

  .bale-badge-slot {
    width: 100%;
    margin-top: 4px;
    display: flex;
    justify-content: flex-start;
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
