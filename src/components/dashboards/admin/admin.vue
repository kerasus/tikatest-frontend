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
            animationDuration: particle.duration
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

    <!-- مودال فعلی DevOps خودت را اینجا بدون تغییر قرار بده -->
    <q-dialog
      v-model="showDevModal"
      :persistent="executingScript"
      backdrop-filter="blur(12px) brightness(95%)">
      <q-card class="light-dev-modal">
        <div class="modal-top-accent" />

        <q-card-section class="row items-center q-pa-md modal-head">
          <div class="modal-badge-icon q-mr-md">
            <q-icon
              :name="devActionMeta.icon"
              size="24px" />

          </div>

          <div>
            <div class="text-h6 text-weight-bolder text-neutral-dark-20 row items-center">
              {{ devActionMeta.title }}
              <q-badge
                :color="devActionMeta.badgeColor"
                text-color="white"
                class="q-ml-sm text-bold pulse-tag">
                {{ devActionMeta.badge }}
              </q-badge>
            </div>
            <div class="text-caption text-neutral">
              {{ devActionMeta.description }}
            </div>
          </div>

          <q-space />

          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense
            color="neutral-50"
            :disable="executingScript" />
        </q-card-section>

        <q-separator color="primary-95" />

        <q-card-section class="q-pa-md">
          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
              نوع عملیات:
            </label>

            <!-- در بخش نوع عملیات q-select -->
            <q-select
              v-model="selectedDevAction"
              dense
              outlined
              emit-value
              map-options
              class="soft-input"
              :disable="executingScript"
              :options="[
                {
                  label: 'اصلاح رمز عبور دانش‌آموزان (Bcrypt)',
                  value: 'fix-student-passwords'
                },
                {
                  label: 'انتقال فایل‌های خارجی آزمون',
                  value: 'migrate-exam-files'
                },
                {
                  label: 'بازشماری نتایج آزمون',
                  value: 'recalculate-exam-results'
                }
              ]">
              <template #prepend>
                <q-icon
                  name="settings_suggest"
                  color="primary" />
              </template>
            </q-select>

          </div>


          <div class="warning-soft-box q-pa-sm q-mb-md">
            <div class="row items-start no-wrap">
              <q-icon
                name="info"
                color="warning-dark"
                size="22px"
                class="q-mr-sm" />

              <div>
                <div class="text-subtitle2 text-weight-bold text-neutral-dark-20">
                  {{ devActionMeta.introTitle }}
                </div>

                <div
                  class="text-caption text-neutral-dark"
                  style="line-height: 1.8;">
                  {{ devActionMeta.introText }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedDevAction === 'migrate-exam-files'"
            class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
              حداکثر تعداد رکورد برای بررسی:
            </label>

            <q-input
              v-model.number="migrationLimit"
              type="number"
              min="0"
              dense
              outlined
              placeholder="مثلاً 5"
              class="soft-input"
              :disable="executingScript">
              <template #prepend>
                <q-icon
                  name="filter_5"
                  color="primary" />
              </template>
            </q-input>
          </div>

          <div
            v-if="selectedDevAction === 'recalculate-exam-results'"
            class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
              شناسه آزمون برای بازشماری:
            </label>

            <q-input
              v-model.number="recalculateExamId"
              type="number"
              min="1"
              dense
              outlined
              placeholder="مثلاً 5 - اگر خالی بماند، همه آزمون‌ها بررسی می‌شوند"
              class="soft-input"
              :disable="executingScript">
              <template #prepend>
                <q-icon
                  name="tag"
                  color="secondary" />
              </template>
            </q-input>

            <div class="text-caption text-neutral q-mt-xs">
              خالی بگذار تا همه‌ی آزمون‌های قابل‌بررسی بازشماری شوند.
            </div>
          </div>

          <!-- فیلد ورودی شناسه‌های مدرسه برای fix-student-passwords -->
          <div
            v-if="selectedDevAction === 'fix-student-passwords'"
            class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
              شناسه مدارس هدف (با کاما جدا کنید):
            </label>

            <q-input
              v-model="targetSchoolIdsInput"
              dense
              outlined
              placeholder="مثلاً 1, 2"
              class="soft-input"
              :disable="executingScript">
              <template #prepend>
                <q-icon
                  name="domain"
                  color="accent" />
              </template>
            </q-input>

            <div class="text-caption text-neutral q-mt-xs">
              پیش‌فرض مدارس ۱ (مبتکران) و ۲ (اسدی کیا) هستند.
            </div>
          </div>


          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">
              برای آغاز، کلمه <strong class="text-error">«تایید»</strong> را بنویسید:
            </label>

            <q-input
              v-model="confirmationWord"
              dense
              outlined
              placeholder="تایید"
              class="soft-input"
              :disable="executingScript" />
          </div>

          <div
            v-if="logs.length > 0 || scriptResult"
            class="light-terminal-window q-pa-sm q-mt-md">

            <div class="terminal-bar row items-center justify-between q-mb-xs">
              <span class="text-caption font-mono text-neutral-dark-40">
                Migration Logs
              </span>

              <div class="row q-gutter-x-xs">
                <span class="dot d-red" />
                <span class="dot d-yellow" />
                <span class="dot d-green" />
              </div>
            </div>

            <div class="terminal-body font-mono">
              <div
                v-for="(log, idx) in logs"
                :key="idx"
                class="log-row">
                <span class="log-arrow">➜</span>
                {{ log }}
              </div>

              <div
                v-if="scriptResult"
                class="result-pill-box q-mt-sm q-pa-sm">

                <template v-if="selectedDevAction === 'migrate-exam-files'">
                  <div
                    class="text-weight-bold"
                    :class="scriptResult.failed_count > 0 ? 'text-warning-dark' : 'text-success-dark'">
                    {{ scriptResult.failed_count > 0 ? '⚠ عملیات با موارد ناموفق تمام شد' : '✔ عملیات موفق' }}
                  </div>

                  <div>
                    رکوردهای منطبق:
                    <strong>{{ scriptResult.total_matched_records }}</strong>
                  </div>

                  <div>
                    رکوردهای به‌روزشده:
                    <strong>{{ scriptResult.updated_records }}</strong>
                  </div>

                  <div>
                    فایل‌های دانلودشده:
                    <strong>{{ scriptResult.downloaded_files }}</strong>
                  </div>

                  <div>
                    دانلودهای ناموفق:
                    <strong>{{ scriptResult.failed_count }}</strong>
                  </div>

                  <div
                    v-if="scriptResult.failed_urls?.length > 0"
                    class="failed-url-list q-mt-sm">
                    <div class="text-weight-bold q-mb-xs">
                      فایل‌های ناموفق:
                    </div>

                    <div
                      v-for="(failure, index) in scriptResult.failed_urls"
                      :key="`${failure.url}-${index}`"
                      class="failed-url-item">
                      <div class="failed-url">
                        {{ failure.url }}
                      </div>

                      <div class="text-caption">
                        {{ failure.reason }}
                        <span v-if="failure.status">
                          (HTTP {{ failure.status }})
                        </span>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="selectedDevAction === 'recalculate-exam-results'">
                  <div class="text-weight-bold text-success-dark">
                    ✔ بازشماری نتایج با موفقیت انجام شد
                  </div>

                  <div v-if="'sessions_processed' in scriptResult">
                    سشن‌های پردازش‌شده:
                    <strong>{{ scriptResult.sessions_processed }}</strong>
                  </div>

                  <div v-if="'responses_updated' in scriptResult">
                    پاسخ‌های به‌روزشده:
                    <strong>{{ scriptResult.responses_updated }}</strong>
                  </div>

                  <div v-if="scriptResult.message">
                    پیام:
                    <strong>{{ scriptResult.message }}</strong>
                  </div>
                </template>

                <!-- نمایش خروجی عملیات هش رمز عبور در ترمینال -->
                <template v-else-if="selectedDevAction === 'fix-student-passwords'">
                  <div class="text-weight-bold text-success-dark">
                    ✔ عملیات اصلاح رمز عبور با موفقیت پایان یافت
                  </div>

                  <div v-if="'fixed' in scriptResult">
                    تعداد رکوردهای هش‌شده:
                    <strong class="text-primary">{{ scriptResult.fixed }}</strong>
                  </div>

                  <div v-if="'skipped_already_bcrypt' in scriptResult">
                    رد شده (از قبل هش معتبر داشتند):
                    <strong>{{ scriptResult.skipped_already_bcrypt }}</strong>
                  </div>

                  <div v-if="'skipped_empty_password' in scriptResult">
                    رد شده (رمز خالی):
                    <strong>{{ scriptResult.skipped_empty_password }}</strong>
                  </div>

                  <div v-if="'total_checked' in scriptResult">
                    کل دانش‌آموزان بررسی‌شده:
                    <strong>{{ scriptResult.total_checked }}</strong>
                  </div>

                  <div v-if="scriptResult.schools">
                    مدارس پردازش‌شده:
                    <q-badge
                      v-for="sId in scriptResult.schools"
                      :key="sId"
                      color="primary"
                      class="q-mr-xs">
                      مدرسه {{ sId }}
                    </q-badge>
                  </div>
                </template>

              </div>

            </div>
          </div>
        </q-card-section>

        <q-card-actions
          align="right"
          class="q-px-md q-pb-md">

          <q-btn
            v-close-popup
            flat
            label="بستن"
            color="neutral-dark-40"
            :disable="executingScript" />

          <q-btn
            unelevated
            class="run-action-btn"
            :icon="devActionMeta.buttonIcon"
            :label="devActionMeta.buttonLabel"
            :loading="executingScript"
            :disable="!canRunDevAction"
            @click="handleRunDevAction" />

        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import DashboardAPI from 'src/repositories/dashboard'
import { devAdmin, type ExamFilesMigrationResultType } from 'src/repositories/devAdmin'
import CheckHealth from './components/checkHealth.vue'
import AdminStats from './components/adminStats.vue'
import AdminWelcomeBanner from './components/adminWelcomeBanner.vue'
import LogViewerDialog from './components/logViewerDialog.vue'

type DevActionType = 'migrate-exam-files' | 'recalculate-exam-results' | 'fix-student-passwords'

const $q = useQuasar()
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

const showDevModal = ref(false)
const showLogModal = ref(false)
const confirmationWord = ref('')
const migrationLimit = ref<number | null>(5)
const scriptResult = ref<Record<string, any> | null>(null)
const executingScript = ref(false)
const logs = ref<string[]>([])
const targetSchoolIdsInput = ref('1, 2')
const selectedDevAction = ref<DevActionType>('fix-student-passwords')
const recalculateExamId = ref<number | null>(null)

const devActionMeta = computed(() => {
  if (selectedDevAction.value === 'fix-student-passwords') {
    return {
      title: 'اصلاح رمز عبور دانش‌آموزان',
      badge: 'BCRYPT FIX',
      badgeColor: 'accent',
      description: 'تبدیل کدهای ملی خام به هش Bcrypt استاندارد جهت فعال‌سازی امکان لاگین دانش‌آموزان',
      icon: 'lock_reset',
      buttonLabel: 'شروع هش‌گذاری امن',
      buttonIcon: 'security',
      introTitle: 'توجه به عملکرد امنیتی کاربران',
      introText:
        'این اسکریپت رکوردهای دانش‌آموزان مدارس انتخاب‌شده را بررسی کرده و رمزهای متنی خام (کد ملی) را بدون دستکاری پسوردهای هش‌شده قبلی، به هش استاندارد Bcrypt لاراول تبدیل می‌کند.'
    }
  }

  if (selectedDevAction.value === 'recalculate-exam-results') {
    return {
      title: 'بازشماری نتایج آزمون',
      badge: 'RECALCULATE',
      badgeColor: 'secondary',
      description: 'بازسازی شمارش پاسخ‌های درست، غلط، بی‌پاسخ و نمره نهایی جلسات آزمون',
      icon: 'calculate',
      buttonLabel: 'شروع بازشماری نتایج',
      buttonIcon: 'restart_alt',
      introTitle: 'قبل از اجرای نهایی، بهتر است روی یک آزمون تست بگیری',
      introText:
        'اگر شناسه آزمون را وارد کنی، فقط همان آزمون بازشماری می‌شود. اگر خالی بگذاری، همه‌ی جلسات آزمون‌های منطبق بررسی و بازسازی می‌شوند.'
    }
  }

  return {
    title: 'انتقال فایل‌های خارجی آزمون',
    badge: 'MIGRATION',
    badgeColor: 'warning',
    description: 'انتقال فایل‌های content و solution به استوریج محلی',
    icon: 'sync',
    buttonLabel: 'شروع انتقال فایل‌ها',
    buttonIcon: 'cloud_download',
    introTitle: 'قبل از اجرای کامل، ابتدا با تعداد کم تست کن',
    introText:
      'مقدار ۵ حداکثر پنج رکورد را بررسی می‌کند. مقدار ۰ یعنی همه‌ی رکوردهای منطبق بررسی شوند. فایل‌های دانلودشده در پوشه‌ی exam-files دیسک public ذخیره می‌شوند.'
  }
})

const canRunDevAction = computed(() => {
  if (confirmationWord.value.trim() !== 'تایید') return false

  if (selectedDevAction.value === 'fix-student-passwords') {
    const ids = targetSchoolIdsInput.value
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0)
    return ids.length > 0
  }

  if (selectedDevAction.value === 'migrate-exam-files') {
    return (
      migrationLimit.value !== null &&
      Number.isInteger(Number(migrationLimit.value)) &&
      Number(migrationLimit.value) >= 0
    )
  }

  if (selectedDevAction.value === 'recalculate-exam-results') {
    return (
      recalculateExamId.value === null ||
      (
        Number.isInteger(Number(recalculateExamId.value)) &&
        Number(recalculateExamId.value) > 0
      )
    )
  }

  return false
})

function openDevModal () {
  selectedDevAction.value = 'fix-student-passwords'
  targetSchoolIdsInput.value = '1, 2'
  confirmationWord.value = ''
  migrationLimit.value = 5
  recalculateExamId.value = null
  scriptResult.value = null
  logs.value = []
  showDevModal.value = true
}

async function handleRunDevAction () {
  if (confirmationWord.value.trim() !== 'تایید') return

  executingScript.value = true
  scriptResult.value = null
  logs.value = []

  try {
    if (selectedDevAction.value === 'fix-student-passwords') {
      const parsedSchoolIds = targetSchoolIdsInput.value
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0)

      if (parsedSchoolIds.length === 0) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'حداقل یک شناسه مدرسه معتبر وارد کنید.',
          position: 'top'
        })
        executingScript.value = false
        return
      }

      logs.value = [
        'اتصال امن به Sanctum API...',
        `مدارس هدف: [${parsedSchoolIds.join(', ')}]`,
        'در حال جست‌وجوی دانش‌آموزان با رمز عبور غیرهش و تبدیل به Bcrypt...'
      ]

      const result = await devAdmin.runDevScript(
        'fix-student-passwords',
        { school_ids: parsedSchoolIds }
      )

      scriptResult.value = result

      logs.value.push(`پاسخ سرور: ${result.message}`)
      if ('fixed' in result) {
        logs.value.push(`تعداد پسوردهای اصلاح‌شده: ${result.fixed}`)
      }
      if ('skipped_already_bcrypt' in result) {
        logs.value.push(`تعداد از قبل هش‌شده: ${result.skipped_already_bcrypt}`)
      }
      if ('skipped_empty_password' in result) {
        logs.value.push(`تعداد پسورد خالی: ${result.skipped_empty_password}`)
      }

      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: `رمز عبور ${result.fixed ?? 0} دانش‌آموز با موفقیت هش شد.`,
        position: 'top',
        timeout: 5000
      })
      return
    }

    if (selectedDevAction.value === 'migrate-exam-files') {
      // ... کد قبلی migration ...
    }

    if (selectedDevAction.value === 'recalculate-exam-results') {
      // ... کد قبلی recalculate ...
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error
      ? err.message
      : 'خطای نامشخص'

    logs.value.push(`[ERROR]: ${errorMessage}`)

    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message: errorMessage,
      position: 'top',
      timeout: 6000
    })
  } finally {
    executingScript.value = false
  }
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
    responseTime.value = Math.max(
      1,
      Math.round(performance.now() - requestStartedAt)
    )

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



.failed-url-list {
  max-height: 180px;
  overflow-y: auto;
  direction: ltr;
  text-align: left;
}

.failed-url-item {
  padding: 7px 0;
  border-top: 1px solid rgba(118, 87, 245, 0.12);
}

.failed-url {
  overflow-wrap: anywhere;
  color: #b4234d;
  font-size: 11px;
}

</style>
