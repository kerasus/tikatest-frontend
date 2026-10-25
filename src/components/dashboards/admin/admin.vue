<template>
  <div class="dashboard-page">
    <!-- پس‌زمینه متحرک -->
    <div class="dreamy-background">
      <div class="aurora aurora-one" />
      <div class="aurora aurora-two" />
      <div class="aurora aurora-three" />

      <div class="star-field">
        <span
          v-for="particle in floatingParticles"
          :key="particle.id"
          class="floating-particle"
          :style="{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }" />
      </div>

      <div class="grid-pattern" />
    </div>

    <!-- بنر اصلی -->
    <admin-welcome-banner
      :response-time="responseTime"
      @open-dev-modal="openDevModal"
      @open-log-modal="showLogModal = true" />

    <check-health />

    <admin-stats
      :loading="loading"
      :stats="stats" />

    <log-viewer-dialog v-model="showLogModal" />
    <component
      :is="DevOpsDialog"
      ref="devOpsDialog" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardAPI from 'src/repositories/dashboard'
import CheckHealth from './components/checkHealth.vue'
import AdminStats from './components/adminStats.vue'
import AdminWelcomeBanner from './components/adminWelcomeBanner.vue'
import LogViewerDialog from './components/logViewerDialog.vue'
import DevOpsDialog from './components/devOpsDialog.vue'

const dashboardAPI = new DashboardAPI()

const loading = ref(true)
const responseTime = ref<number | null>(null)

const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})

const floatingParticles = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: `${(index % 8) * 0.55}s`,
  duration: `${5 + (index % 6)}s`,
  size: `${4 + (index % 4) * 2}px`
}))

const devOpsDialog = ref<InstanceType<typeof DevOpsDialog> | null>(null)
const showLogModal = ref(false)

function openDevModal () {
  devOpsDialog.value?.open()
}

onMounted(async () => {
  loading.value = true
  responseTime.value = null

  const requestStartedAt = performance.now()

  try {
    const dashboardStats = await dashboardAPI.adminDashboard()

    stats.value.students = dashboardStats.students_count || 0
    stats.value.classes = dashboardStats.classes_count || 0
    stats.value.exams = dashboardStats.online_exams_count || 0
    stats.value.homework = dashboardStats.homeworks_count || 0
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  } finally {
    // زمان کامل رفت‌وبرگشت درخواست از مرورگر تا پاسخ
    responseTime.value = Math.max(1, Math.round(performance.now() - requestStartedAt))

    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
$violet: #7657f5;
$blue: #2563eb;
$pink: #ec4899;
$cyan: #0891b2;
$ink: #16152d;

* {
  box-sizing: border-box;
}

.dashboard-page {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

/* پس‌زمینه */

.dreamy-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 15%, rgba(167, 139, 250, 0.2), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.18), transparent 28%),
    linear-gradient(135deg, #f8f7ff 0%, #f4f8ff 48%, #fff5fa 100%);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.38;
  background-image:
    linear-gradient(rgba(118, 87, 245, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(118, 87, 245, 0.06) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, black, transparent 85%);
}

.aurora {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.48;
  animation: auroraFloat 14s ease-in-out infinite alternate;
}

.aurora-one {
  top: -160px;
  right: -80px;
  background: #c4b5fd;
}

.aurora-two {
  bottom: -180px;
  left: 8%;
  background: #93c5fd;
  animation-delay: -5s;
}

.aurora-three {
  top: 36%;
  left: 48%;
  background: #f9a8d4;
  animation-delay: -9s;
}

.star-field {
  position: absolute;
  inset: 0;
}

.floating-particle {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 8px rgba(118, 87, 245, 0.9),
    0 0 18px rgba(56, 189, 248, 0.6);
  animation: particleFloat ease-in-out infinite alternate;
}

/* دکمه */

.magic-launch-btn {
  position: relative;
  overflow: visible;
  padding: 13px 25px;
  border-radius: 17px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(135deg, #7657f5, #2563eb, #ec4899);
  background-size: 200% 200%;
  box-shadow:
    0 14px 30px rgba(76, 29, 149, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.25) inset;
  animation: buttonGradient 5s ease infinite;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow:
      0 20px 35px rgba(76, 29, 149, 0.42),
      0 0 24px rgba(236, 72, 153, 0.35);
  }
}

.btn-live-badge {
  position: absolute;
  top: -10px;
  left: -10px;
  border-radius: 8px;
  color: #14532d;
  background: #bbf7d0;
  font-size: 9px;
}

/* انیمیشن‌ها */

@keyframes auroraFloat {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(45px, 35px) scale(1.18);
  }
}

@keyframes particleFloat {
  from {
    opacity: 0.15;
    transform: translateY(0) scale(0.7);
  }

  to {
    opacity: 0.9;
    transform: translateY(-45px) scale(1.35);
  }
}

@keyframes buttonGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* ریسپانسیو */

@media (max-width: 600px) {
  .dashboard-page {
    padding: 12px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
</style>
