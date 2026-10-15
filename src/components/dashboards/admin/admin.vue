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
    <q-card class="magic-welcome-banner q-mb-lg">
      <div class="banner-noise" />
      <div class="banner-light-sweep" />

      <div class="banner-orbit orbit-one" />
      <div class="banner-orbit orbit-two" />

      <div class="banner-sparkle sparkle-1">✦</div>
      <div class="banner-sparkle sparkle-2">✧</div>
      <div class="banner-sparkle sparkle-3">✦</div>
      <div class="banner-sparkle sparkle-4">✧</div>

      <q-card-section class="banner-inner row items-center justify-between">
        <div class="col-12 col-md-8 banner-copy">

          <div class="row items-center q-gutter-sm q-mb-md">
            <div class="status-pill">
              <span class="status-dot" />
              <span>سامانه آنلاین و پایدار</span>
            </div>

            <q-badge class="super-admin-badge">
              <q-icon
                name="auto_awesome"
                size="15px"
                class="q-mr-xs" />
              پنل راهبر ارشد سنجاد
            </q-badge>
          </div>

          <div class="welcome-kicker">
            <span class="kicker-line" />
            <span>مرکز فرماندهی هوشمند</span>
            <span class="kicker-line" />
          </div>

          <h1 class="welcome-title q-my-sm">
            داشبورد مدیریت
            <span class="shiny-text">سَـنـجـاد</span>
          </h1>

          <p class="welcome-subtext q-mb-md">
            پایش لحظه‌ای آزمون‌ها، مدیریت یکپارچه شعب مدارس و نظارت بر عملکرد کاربران
          </p>

          <div class="row items-center q-gutter-sm system-metrics">
            <div class="metric-item">
              <q-icon
                name="bolt"
                size="18px" />

              <span>پاسخگویی:</span>

              <strong v-if="responseTime !== null">
                {{ responseTime }}ms
              </strong>

              <q-spinner
                v-else
                size="16px" />
            </div>

            <div class="metric-item">
              <q-icon
                :name="serverHealth.icon"
                size="18px" />

              <span>وضعیت:</span>

              <strong :class="serverHealth.className">
                {{ serverHealth.label }}
              </strong>
            </div>

            <div class="metric-item">
              <q-icon
                name="verified_user"
                size="18px" />

              <span>Sanctum Active</span>
            </div>
          </div>
        </div>

        <!-- سیاره مرکزی و المان‌های شناور -->
        <div class="col-12 col-md-4 gt-sm flex justify-center">
          <div class="hero-planet">
            <div class="planet-ring planet-ring-one" />
            <div class="planet-ring planet-ring-two" />

            <div class="planet-glow" />

            <div class="planet-core">
              <div class="planet-core-shine" />

              <q-icon
                name="school"
                size="76px" />
            </div>

            <div class="planet-satellite satellite-one">
              <q-icon
                name="quiz"
                size="20px" />
            </div>

            <div class="planet-satellite satellite-two">
              <q-icon
                name="insights"
                size="20px" />
            </div>

            <div class="planet-satellite satellite-three">
              <q-icon
                name="psychology"
                size="20px" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>



    <check-health />

    <admin-stats
      :loading="loading"
      :stats="stats" />

    <!-- دکمه دسکتاپ -->
    <div class="gt-xs q-mt-lg text-center">
      <q-btn
        unelevated
        class="magic-launch-btn"
        icon="terminal"
        label="ورود به کنسول عملیات DevOps"
        @click="openDevModal">
        <q-badge class="btn-live-badge">
          SAFE
        </q-badge>
      </q-btn>
    </div>

    <!-- دکمه موبایل -->
    <div class="lt-sm q-mt-lg">
      <q-btn
        unelevated
        class="magic-launch-btn full-width"
        icon="terminal"
        label="کنسول عملیات DevOps"
        @click="openDevModal" />
    </div>

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

type DevActionType = 'migrate-exam-files' | 'recalculate-exam-results'

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
const confirmationWord = ref('')
const migrationLimit = ref<number | null>(5)
const scriptResult = ref<Record<string, any> | null>(null)
const executingScript = ref(false)
const logs = ref<string[]>([])
const selectedDevAction = ref<DevActionType>('migrate-exam-files')
const recalculateExamId = ref<number | null>(null)

const devActionMeta = computed(() => {
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

const serverHealth = computed(() => {
  if (responseTime.value === null) {
    return {
      label: 'در حال بررسی',
      color: 'text-warning',
      icon: 'sync',
      className: 'health-pending'
    }
  }

  if (responseTime.value <= 250) {
    return {
      label: 'عالی',
      color: 'text-positive',
      icon: 'bolt',
      className: 'health-excellent'
    }
  }

  if (responseTime.value <= 700) {
    return {
      label: 'پایدار',
      color: 'text-warning',
      icon: 'speed',
      className: 'health-stable'
    }
  }

  return {
    label: 'کند',
    color: 'text-negative',
    icon: 'warning',
    className: 'health-slow'
  }
})

function openDevModal () {
  selectedDevAction.value = 'migrate-exam-files'
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
    if (selectedDevAction.value === 'migrate-exam-files') {
      if (
        migrationLimit.value === null ||
        !Number.isInteger(Number(migrationLimit.value)) ||
        Number(migrationLimit.value) < 0
      ) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'تعداد رکورد باید عدد صحیح صفر یا بزرگ‌تر باشد.',
          position: 'top'
        })
        executingScript.value = false
        return
      }

      const limit = Number(migrationLimit.value)

      logs.value = [
        'اتصال امن به Sanctum API...',
        limit === 0
          ? 'محدودیتی ثبت نشده؛ همه رکوردهای منطبق بررسی می‌شوند...'
          : `حداکثر ${limit} رکورد بررسی می‌شود...`,
        'جست‌وجوی فایل‌های خارجی در content و solution...'
      ]

      const result = await devAdmin.runDevScript(
        'migrate-exam-files',
        { limit }
      )

      scriptResult.value = result

      logs.value.push(`پاسخ سرور: ${result.message}`)
      logs.value.push(`رکوردهای منطبق: ${result.total_matched_records}`)
      logs.value.push(`رکوردهای به‌روزشده: ${result.updated_records}`)
      logs.value.push(`فایل‌های دانلودشده: ${result.downloaded_files}`)
      logs.value.push(`دانلودهای ناموفق: ${result.failed_count}`)

      if (result.failed_count > 0) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          message: `${result.downloaded_files} فایل دانلود شد؛ ${result.failed_count} مورد ناموفق بود.`,
          position: 'top',
          timeout: 6000
        })
      } else {
        $q.notify({
          type: 'positive',
          icon: 'check_circle',
          message: `${result.downloaded_files} فایل با موفقیت منتقل شد.`,
          position: 'top',
          timeout: 5000
        })
      }

      return
    }

    if (selectedDevAction.value === 'recalculate-exam-results') {
      if (
        recalculateExamId.value !== null &&
        (
          !Number.isInteger(Number(recalculateExamId.value)) ||
          Number(recalculateExamId.value) <= 0
        )
      ) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'شناسه آزمون باید یک عدد صحیح بزرگ‌تر از صفر باشد یا خالی بماند.',
          position: 'top'
        })
        executingScript.value = false
        return
      }

      logs.value = [
        'اتصال امن به Sanctum API...',
        recalculateExamId.value
          ? `بازشماری فقط برای آزمون #${recalculateExamId.value} آغاز شد...`
          : 'بازشماری برای همه آزمون‌های قابل‌بررسی آغاز شد...',
        'در حال بازسازی شمارش پاسخ‌ها و نتایج جلسات...'
      ]

      const payload = recalculateExamId.value
        ? { exam_id: Number(recalculateExamId.value) }
        : {}

      const result = await devAdmin.runDevScript(
        'recalculate-exam-results',
        payload
      )

      scriptResult.value = result

      logs.value.push(`پاسخ سرور: ${result.message}`)

      if ('sessions_processed' in result) {
        logs.value.push(`تعداد سشن‌های پردازش‌شده: ${result.sessions_processed}`)
      }

      if ('responses_updated' in result) {
        logs.value.push(`تعداد پاسخ‌های به‌روزشده: ${result.responses_updated}`)
      }

      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: recalculateExamId.value
          ? `بازشماری آزمون #${recalculateExamId.value} با موفقیت انجام شد.`
          : 'بازشماری نتایج آزمون‌ها با موفقیت انجام شد.',
        position: 'top',
        timeout: 5000
      })
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

/* بنر اصلی */

.magic-welcome-banner {
  position: relative;
  min-height: 310px;
  overflow: hidden;
  border-radius: 32px;
  color: #fff;
  background:
    radial-gradient(circle at 80% 10%, rgba(244, 114, 182, 0.55), transparent 25%),
    radial-gradient(circle at 15% 90%, rgba(34, 211, 238, 0.45), transparent 28%),
    linear-gradient(125deg, #25135f 0%, #4c1d95 42%, #4338ca 72%, #0369a1 100%);
  box-shadow:
    0 30px 70px -24px rgba(76, 29, 149, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  isolation: isolate;
}

.banner-inner {
  position: relative;
  z-index: 5;
  min-height: 310px;
  padding: 38px 42px;
}

.banner-noise {
  position: absolute;
  inset: 0;
  opacity: 0.13;
  pointer-events: none;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.8) 0.8px, transparent 0.8px);
  background-size: 17px 17px;
  mix-blend-mode: overlay;
}

.banner-light-sweep {
  position: absolute;
  inset: -50%;
  z-index: 2;
  pointer-events: none;
  transform: translateX(100%) rotate(18deg);
  background: linear-gradient(
    90deg,
    transparent 35%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 65%
  );
  animation: lightSweep 8s ease-in-out infinite;
}

.banner-orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  pointer-events: none;
}

.orbit-one {
  width: 520px;
  height: 220px;
  top: 34%;
  left: 38%;
  transform: rotate(-18deg);
  animation: orbitRotate 18s linear infinite;
}

.orbit-two {
  width: 430px;
  height: 170px;
  top: 42%;
  left: 51%;
  transform: rotate(25deg);
  border-color: rgba(103, 232, 249, 0.26);
  animation: orbitRotateReverse 23s linear infinite;
}

.banner-sparkle {
  position: absolute;
  z-index: 6;
  color: #fef08a;
  font-size: 26px;
  text-shadow: 0 0 16px currentColor;
  animation: sparklePulse 2.8s ease-in-out infinite alternate;
}

.sparkle-1 {
  top: 22px;
  left: 36%;
}

.sparkle-2 {
  top: 52px;
  right: 31%;
  color: #67e8f9;
  animation-delay: -1s;
}

.sparkle-3 {
  bottom: 30px;
  left: 45%;
  color: #f9a8d4;
  animation-delay: -1.8s;
}

.sparkle-4 {
  right: 44%;
  bottom: 54px;
  animation-delay: -2.3s;
}

.banner-copy {
  position: relative;
  z-index: 10;
}

.status-pill,
.super-admin-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.status-pill {
  gap: 8px;
  padding: 7px 13px;
  border-radius: 999px;
  color: #eafff4;
  font-size: 12px;
  font-weight: 700;
}

.status-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #86efac;
  box-shadow:
    0 0 0 5px rgba(134, 239, 172, 0.16),
    0 0 15px #86efac;
  animation: livePulse 1.7s infinite;
}

.super-admin-badge {
  padding: 7px 13px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
}

.welcome-kicker {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 700;
}

.kicker-line {
  width: 28px;
  height: 2px;
  border-radius: 4px;
  background: linear-gradient(90deg, #67e8f9, #c4b5fd);
}

.welcome-title {
  margin: 0;
  color: #fff;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 900;
  line-height: 1.35;
  text-shadow: 0 7px 24px rgba(15, 23, 42, 0.35);
}

.shiny-text {
  display: inline-block;
  background: linear-gradient(
    90deg,
    #fef08a,
    #f9a8d4,
    #67e8f9,
    #fef08a
  );
  background-size: 260% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shinyText 5s linear infinite;
}

.welcome-subtext {
  max-width: 660px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  line-height: 2;
}

.system-metrics {
  position: relative;
  z-index: 10;
}

.metric-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);

  .q-icon {
    color: #fef08a;
  }

  strong {
    color: #fef08a;
    direction: ltr;
  }
}

.health-excellent {
  color: #86efac !important;
}

.health-stable {
  color: #fde68a !important;
}

.health-slow {
  color: #fda4af !important;
}

.health-pending {
  color: #fde68a !important;
}

/* سیاره مرکزی */

.hero-planet {
  position: relative;
  width: 245px;
  height: 245px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: planetFloat 5s ease-in-out infinite;
}

.planet-glow {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8),
    rgba(103, 232, 249, 0.2) 45%,
    transparent 70%
  );
  filter: blur(15px);
  animation: planetGlow 3s ease-in-out infinite alternate;
}

.planet-core {
  position: relative;
  z-index: 4;
  width: 125px;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.66);
  border-radius: 37px;
  color: #fff;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.38),
    rgba(255, 255, 255, 0.08)
  );
  box-shadow:
    0 25px 45px rgba(15, 23, 42, 0.3),
    0 0 35px rgba(255, 255, 255, 0.35) inset;
  backdrop-filter: blur(18px);
  transform: rotate(-8deg);
}

.planet-core-shine {
  position: absolute;
  top: 9px;
  left: 13px;
  width: 45px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  filter: blur(8px);
  transform: rotate(-25deg);
}

.planet-ring {
  position: absolute;
  border: 1px dashed rgba(255, 255, 255, 0.48);
  border-radius: 50%;
}

.planet-ring-one {
  width: 220px;
  height: 86px;
  animation: ringOne 13s linear infinite;
}

.planet-ring-two {
  width: 240px;
  height: 130px;
  border-color: rgba(254, 240, 138, 0.46);
  animation: ringTwo 17s linear infinite;
}

.planet-satellite {
  position: absolute;
  z-index: 7;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 15px;
  color: #fff;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(10px);
}

.satellite-one {
  top: 5px;
  right: 18px;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  animation: satelliteFloat 4s ease-in-out infinite alternate;
}

.satellite-two {
  bottom: 23px;
  left: 3px;
  background: linear-gradient(135deg, #06b6d4, #2563eb);
  animation: satelliteFloat 5s ease-in-out infinite alternate-reverse;
}

.satellite-three {
  right: 15px;
  bottom: 0;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  animation: satelliteFloat 4.5s ease-in-out infinite alternate;
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

@keyframes lightSweep {
  0%,
  55% {
    transform: translateX(100%) rotate(18deg);
  }

  80%,
  100% {
    transform: translateX(-100%) rotate(18deg);
  }
}

@keyframes sparklePulse {
  from {
    opacity: 0.25;
    transform: scale(0.65) rotate(0deg);
  }

  to {
    opacity: 1;
    transform: scale(1.3) rotate(90deg);
  }
}

@keyframes livePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(134, 239, 172, 0.45);
  }

  50% {
    box-shadow: 0 0 0 7px rgba(134, 239, 172, 0);
  }
}

@keyframes planetFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-14px) rotate(3deg);
  }
}

@keyframes planetGlow {
  from {
    transform: scale(0.85);
    opacity: 0.45;
  }

  to {
    transform: scale(1.25);
    opacity: 0.9;
  }
}

@keyframes satelliteFloat {
  from {
    transform: translateY(0) rotate(-5deg);
  }

  to {
    transform: translateY(-13px) rotate(8deg);
  }
}

@keyframes ringOne {
  from {
    transform: rotate(-20deg) rotate(0deg);
  }

  to {
    transform: rotate(-20deg) rotate(360deg);
  }
}

@keyframes ringTwo {
  from {
    transform: rotate(25deg) rotate(360deg);
  }

  to {
    transform: rotate(25deg) rotate(0deg);
  }
}

@keyframes shinyText {
  from {
    background-position: 0% center;
  }

  to {
    background-position: 260% center;
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

@media (max-width: 900px) {
  .banner-inner {
    padding: 30px 24px;
  }

  .welcome-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 12px !important;
  }

  .banner-inner {
    min-height: 340px;
    padding: 25px 20px;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-subtext {
    font-size: 12px;
  }

  .system-metrics {
    flex-direction: column;
    align-items: stretch;
  }

  .metric-item {
    justify-content: center;
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
