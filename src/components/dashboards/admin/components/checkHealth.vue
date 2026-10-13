<template>
  <section class="health-panel">
    <!-- هدر مانیتورینگ با المان‌های وضعیت و رفرش -->
    <div class="section-heading row items-center justify-between q-mt-xl q-mb-md">
      <div>
        <div class="section-eyebrow">
          <q-icon
            name="monitor_heart"
            size="18px"
            class="heartbeat-icon" />
          <span>مرکز مانیتورینگ زیرساخت تیکا‌تست</span>
        </div>

        <div class="section-title">
          وضعیت سلامت و پایداری سرور
        </div>
      </div>

      <div class="row items-center q-gutter-sm">
        <!-- دکمه بهینه‌سازی سرور و پاکسازی/ساخت کش -->
        <q-btn
          round
          flat
          dense
          color="amber-9"
          icon="bolt"
          :loading="optimizing"
          class="optimize-btn"
          @click="handleOptimize">
          <q-tooltip class="bg-dark text-white">
            بهینه‌سازی کش و کانفیگ لاراول (Optimize)
          </q-tooltip>
        </q-btn>

        <!-- دکمه بروزرسانی وضعیت -->
        <q-btn
          flat
          round
          dense
          color="primary"
          icon="refresh"
          :loading="loading"
          class="refresh-btn"
          @click="loadHealth">
          <q-tooltip class="bg-dark text-white">بروزرسانی وضعیت</q-tooltip>
        </q-btn>

        <div
          v-if="!loading && health"
          class="health-status-badge"
          :class="hasIssues ? 'badge-degraded' : 'badge-healthy'">
          <span
            class="status-dot"
            :class="{ 'dot-red': hasIssues }" />
          <span>{{ hasIssues ? `${issueResults.length} سرویس نیازمند اقدام فوری` : 'تمام سرویس‌ها پایدار' }}</span>
        </div>
      </div>
    </div>

    <!-- بنر خطای ارتباط با API -->
    <transition name="fade">
      <div
        v-if="errorMessage"
        class="health-alert-box alert-error q-pa-md q-mb-md">
        <div class="row items-center no-wrap">
          <div class="alert-icon-wrap q-mr-md">
            <q-icon
              name="error_outline"
              size="24px" />
          </div>
          <div class="col">
            <div class="text-subtitle2 text-weight-bolder text-negative">
              {{ errorMessage }}
            </div>
          </div>
          <q-btn
            unelevated
            rounded
            color="negative"
            label="تلاش مجدد"
            icon-right="refresh"
            :loading="loading"
            @click="loadHealth" />
        </div>
      </div>
    </transition>

    <!-- هشدار تجمیعی در بالای پنل -->
    <transition name="fade">
      <div
        v-if="!errorMessage && hasIssues"
        class="health-alert-box alert-warning q-pa-md q-mb-lg">
        <div class="row items-start no-wrap">
          <div class="alert-icon-wrap q-mr-md">
            <q-icon
              name="warning_amber"
              size="26px" />
          </div>
          <div class="col">
            <div class="text-subtitle2 text-weight-bolder text-negative q-mb-xs">
              تعداد {{ issueResults.length }} هشدار سیستمی گزارش شده است:
            </div>
            <div class="issue-chips row wrap q-gutter-xs q-mt-xs">
              <span
                v-for="issue in issueResults"
                :key="issue.name"
                class="issue-chip">
                <strong>{{ issue.label }}:</strong>
                {{ issue.shortSummary || issue.notificationMessage }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- لیست کارت‌های مانیتورینگ -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- اسکلتون و لودینگ کارت‌ها -->
      <template v-if="loading">
        <div
          v-for="index in 3"
          :key="`health-loading-${index}`"
          class="col-12 col-md-6 col-lg-4">
          <div class="command-card health-loading-card">
            <div class="command-card-noise" />
            <div class="command-scanline" />
            <q-spinner-orbit
              color="deep-purple-3"
              size="50px" />
            <span class="loading-text">در حال پایش و سنجش سلامت سرویس‌ها...</span>
          </div>
        </div>
      </template>

      <!-- کارت‌های اصلی پس از بارگذاری -->
      <template v-else>
        <div
          v-for="check in sortedCheckResults"
          :key="check.name"
          class="col-12 col-md-6 col-lg-4">
          <div
            class="command-card"
            :class="[
              checkThemeClass(check.status, check.name),
              { 'is-critical': check.status === 'failed' || check.status === 'crashed' }
            ]">
            <div class="command-card-noise" />
            <div class="command-scanline" />

            <!-- هدر کارت -->
            <div class="command-head">
              <div class="row items-center no-wrap q-gutter-xs">
                <span class="command-tag">{{ check.name }}</span>
                <span
                  v-if="check.status !== 'ok'"
                  class="pulse-indicator" />
              </div>
              <q-badge
                class="fancy-badge"
                :class="statusBadgeClass(check.status)">
                {{ statusLabel(check.status) }}
              </q-badge>
            </div>

            <!-- بدنه کارت: گیج درصدی یا آیکون ۸۸ پیکسلی متناسب با سرویس -->
            <div class="command-body">
              <!-- حالت اول: سرویس‌های دارای درصد یا حجم (OPcache و Disk) -->
              <q-circular-progress
                v-if="isGaugeMetric(check.name)"
                :value="getMetricProgress(check)"
                size="88px"
                :thickness="0.12"
                :color="statusColor(check.status)"
                track-color="blue-grey-10"
                class="command-gauge">
                <div class="gauge-inner">
                  <span class="gauge-percentage-value ltr-num">{{ Math.round(getMetricProgress(check)) }}%</span>
                  <span class="gauge-status-label">{{ statusLabel(check.status) }}</span>
                </div>
              </q-circular-progress>

              <!-- حالت دوم: سرویس‌های منطقی/وضعیتی (مانند OptimizedApp, DebugMode, DB, Ping, SSL) -->
              <div
                v-else
                class="command-icon-display"
                :class="`icon-display-${check.status}`">
                <div class="icon-ring-pulse" />
                <q-icon
                  :name="serviceIcon(check.name)"
                  size="40px"
                  :color="statusColor(check.status)" />
                <span
                  class="icon-status-sub"
                  :class="`text-${statusColor(check.status)}`">
                  {{ statusLabel(check.status) }}
                </span>
              </div>

              <!-- مشخصات و مقادیر متنی -->
              <div class="command-legend">
                <div class="legend-title">
                  <q-icon
                    :name="serviceIcon(check.name)"
                    size="16px" />
                  <span>{{ check.label }}</span>
                </div>

                <!-- مقادیر متادیتا در صورت وجود -->
                <div
                  v-if="metaItems(check.meta).length > 0"
                  class="legend-rows">
                  <div
                    v-for="item in metaItems(check.meta)"
                    :key="item.key"
                    class="mini-row">
                    <span class="row-label">{{ item.label }}</span>
                    <strong class="row-value ltr-num">{{ item.value }}</strong>
                  </div>
                </div>

                <!-- خلاصه استاندارد برای مواردی که متادیتا ندارند -->
                <div
                  v-else
                  class="summary-container">
                  <span class="summary-title">خلاصه وضعیت:</span>
                  <span class="summary-text ltr-num">{{ check.shortSummary || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- بخش اختصاصی پیام هشدار/خطای سرور روی همان کارت -->
            <div
              v-if="check.notificationMessage"
              class="issue-notification-box"
              :class="`box-${check.status}`">
              <div class="notification-header">
                <q-icon
                  name="report_problem"
                  size="14px" />
                <span>پیام رخداد سرور</span>
              </div>
              <div class="notification-body ltr-text">
                {{ check.notificationMessage }}
              </div>
            </div>

            <div class="command-footer-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- فوتر آخرین تاریخ همگام‌سازی -->
    <div
      v-if="health && !loading"
      class="health-checked-at row items-center justify-between">
      <span>آخرین گزارش دوره‌ای سیستم: {{ formatFinishedAt(health.finishedAt) }}</span>
      <span class="total-count-badge">تعداد سرویس‌های فعال: {{ health.storedCheckResults.length }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import DevAdminAPI from 'src/repositories/devAdmin'
import DashboardAPI, {
  type HealthCheckResponse,
  type HealthCheckStatus,
  type StoredCheckResult
} from 'src/repositories/dashboard'

interface MetaItem {
  key: string
  label: string
  value: string
}

const $q = useQuasar()
const devAdminAPI = new DevAdminAPI()
const dashboardAPI = new DashboardAPI()

const health = ref<HealthCheckResponse | null>(null)
const loading = ref(true)
const optimizing = ref(false)
const errorMessage = ref('')

const issueResults = computed(() => {
  return health.value?.storedCheckResults.filter((check) => check.status !== 'ok') ?? []
})

const hasIssues = computed(() => issueResults.value.length > 0)

// مرتب‌سازی برای اینکه کارت‌های دارای خطا همیشه اول نمایش داده شوند و شاخص باشند
const sortedCheckResults = computed<StoredCheckResult[]>(() => {
  if (!health.value?.storedCheckResults) return []
  return [...health.value.storedCheckResults].sort((a, b) => {
    const priority = { crashed: 0, failed: 1, warning: 2, ok: 3 }
    return priority[a.status] - priority[b.status]
  })
})

const metaLabels: Record<string, string> = {
  enabled: 'وضعیت',
  hit_rate: 'نرخ موفقیت (Hit Rate)',
  memory_used_mb: 'حافظه اختصاص‌یافته',
  cached_scripts: 'اسکریپت‌های کش‌شده',
  disk_space_used_percentage: 'درصد اشغال دیسک',
  connection_name: 'نام اتصال DB',
  latency_ms: 'تاخیر پینگ',
  domain: 'دامنه بررسی‌شده',
  actual: 'مقدار فعلی',
  expected: 'مقدار مورد انتظار',
  free_gb: 'فضای آزاد (GB)',
  used_gb: 'مصرف‌شده (GB)',
  total_gb: 'سهمیه کل (GB)',
  size_mb: 'حجم دیتابیس',
  version: 'نسخه سرویس'
}

/**
 * تعیین اینکه آیا متریک ماهیت درصد/پیشرفت دایره‌ای دارد یا خیر
 */
function isGaugeMetric (name: string): boolean {
  return name === 'UsedDiskSpace' || name === 'Opcache'
}

/**
 * محاسبه مقدار واقعی درصد برای سرویس‌های گیج‌دار
 */
function getMetricProgress (check: StoredCheckResult): number {
  const meta = (check.meta || {}) as Record<string, any>
  if (check.name === 'UsedDiskSpace') {
    return Number(meta.disk_space_used_percentage ?? 0)
  }
  if (check.name === 'Opcache') {
    return Number(meta.hit_rate ?? 0)
  }
  return check.status === 'ok' ? 100 : (check.status === 'warning' ? 50 : 15)
}

async function loadHealth () {
  loading.value = true
  errorMessage.value = ''

  try {
    health.value = await dashboardAPI.adminHealth()
  } catch (error) {
    console.error('Error loading admin health:', error)
    health.value = null
    errorMessage.value = 'دریافت گزارش وضعیت سلامت سیستم با خطا مواجه شد. لطفاً ارتباط با سرور را بررسی کنید.'
  } finally {
    loading.value = false
  }
}

const handleOptimize = () => {
  $q.dialog({
    title: 'تأیید بهینه‌سازی سیستم',
    message: 'آیا می‌خواهید کش‌های Route، Config و View مجدداً ساخته و بهینه‌سازی شوند؟',
    cancel: {
      label: 'انصراف',
      flat: true,
      color: 'grey-7'
    },
    ok: {
      label: 'شروع Optimize',
      color: 'amber-9',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    optimizing.value = true
    try {
      const res = await devAdminAPI.runOptimize()

      $q.notify({
        type: 'positive',
        message: res.message || 'سیستم با موفقیت بهینه‌سازی شد!',
        caption: 'کانفیگ، روت‌ها و ویوها کش شدند.',
        icon: 'check_circle',
        position: 'top'
      })

      await loadHealth()
    } catch (err: any) {
      $q.notify({
        type: 'negative',
        message: 'خطا در بهینه‌سازی سرور!',
        caption: err?.response?.data?.message || err.message,
        icon: 'report_problem',
        position: 'top'
      })
    } finally {
      optimizing.value = false
    }
  })
}

function checkThemeClass (status: HealthCheckStatus, name: string) {
  if (status === 'failed' || status === 'crashed') return 'card-alert-failed'
  if (status === 'warning') return 'card-alert-warning'

  if (name.includes('Opcache')) return 'card-opcache'
  if (name.includes('Database')) return 'card-db'
  if (name.includes('Disk')) return 'card-disk'
  return 'card-default'
}

function serviceIcon (name: string) {
  switch (name) {
    case 'UsedDiskSpace': return 'storage'
    case 'Database': return 'dns'
    case 'DebugMode': return 'bug_report'
    case 'OptimizedApp': return 'rocket_launch'
    case 'Opcache': return 'memory'
    case 'DatabasePing': return 'speed'
    case 'SslCertificate': return 'lock'
    default: return 'developer_board'
  }
}

function statusBadgeClass (status: HealthCheckStatus) {
  if (status === 'ok') return 'badge-on'
  if (status === 'warning') return 'badge-warn'
  return 'badge-off'
}

function statusLabel (status: HealthCheckStatus) {
  return {
    ok: 'عملیاتی / سالم',
    warning: 'هشدار',
    failed: 'خطا / ناموفق',
    crashed: 'متوقف‌شده'
  }[status]
}

function statusColor (status: HealthCheckStatus) {
  if (status === 'ok') return 'teal-4'
  if (status === 'warning') return 'amber-5'
  return 'red-5'
}

function metaItems (meta: unknown): MetaItem[] {
  if (!meta || Array.isArray(meta) || typeof meta !== 'object') {
    return []
  }

  return Object.entries(meta as Record<string, unknown>)
    .slice(0, 4)
    .map(([key, value]) => ({
      key,
      label: metaLabels[key] ?? key.replaceAll('_', ' '),
      value: formatMetaValue(key, value)
    }))
}

function formatMetaValue (key: string, value: unknown) {
  if (typeof value === 'boolean') return value ? 'فعال (true)' : 'غیرفعال (false)'
  if (typeof value === 'number') {
    const localizedValue = value.toLocaleString('fa-IR')
    if (key.includes('percentage') || key.includes('rate')) return `${localizedValue}٪`
    if (key.includes('_mb')) return `${localizedValue} MB`
    if (key.includes('latency') || key.includes('ms')) return `${value} ms`
    return localizedValue
  }
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function formatFinishedAt (value: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(loadHealth)
</script>

<style scoped lang="scss">
$violet: #7657f5;
$ink: #16152d;
$danger-color: #ef4444;
$warning-color: #f59e0b;
$success-color: #10b981;

.health-panel {
  position: relative;
}

.section-heading {
  padding: 0 4px;
}

.section-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $violet;
  font-size: 13px;
  font-weight: 800;

  .heartbeat-icon {
    animation: heartbeat 2s ease-in-out infinite;
  }
}

.section-title {
  margin-top: 4px;
  color: $ink;
  font-size: 22px;
  font-weight: 900;
}

.refresh-btn {
  background: rgba(118, 87, 245, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(180deg);
  }
}

.optimize-btn {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(245, 158, 11, 0.2);
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
    transform: rotate(12deg) scale(1.05);
  }
}

/* کارت‌های مانیتورینگ پایه */
.command-card {
  position: relative;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 24px;
  color: #e2e8f0;
  background: linear-gradient(145deg, #181534 0%, #1f1943 55%, #131c36 100%);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 20px 45px -18px rgba(15, 10, 45, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 55px -15px rgba(15, 10, 45, 0.8), 0 0 30px rgba(139, 92, 246, 0.25);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    z-index: 3;
    box-shadow: 0 0 14px var(--neon);
  }
}

/* پوسته‌های موضوعی */
.card-opcache { --neon: #a78bfa; &::before { background: linear-gradient(90deg, #a78bfa, #6d28d9); } }
.card-db { --neon: #2dd4bf; &::before { background: linear-gradient(90deg, #2dd4bf, #0f766e); } }
.card-disk { --neon: #38bdf8; &::before { background: linear-gradient(90deg, #38bdf8, #0284c7); } }
.card-default { --neon: #818cf8; &::before { background: linear-gradient(90deg, #818cf8, #4f46e5); } }

/* تم کارت‌های دارای خطا */
.card-alert-failed {
  --neon: #ef4444;
  border: 1.5px solid rgba(239, 68, 68, 0.45);
  background: linear-gradient(145deg, #2a1222 0%, #20132b 50%, #151026 100%);
  box-shadow: 0 20px 45px -15px rgba(239, 68, 68, 0.25), inset 0 0 25px rgba(239, 68, 68, 0.08);

  &::before {
    background: linear-gradient(90deg, #f87171, #ef4444);
    animation: flashAlert 2.5s infinite alternate;
  }

  &:hover {
    box-shadow: 0 28px 60px -15px rgba(239, 68, 68, 0.4), 0 0 32px rgba(239, 68, 68, 0.3);
  }
}

.card-alert-warning {
  --neon: #f59e0b;
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  background: linear-gradient(145deg, #2b1d16 0%, #221a2c 50%, #161426 100%);

  &::before {
    background: linear-gradient(90deg, #fbbf24, #d97706);
  }
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $danger-color;
  box-shadow: 0 0 8px $danger-color;
  animation: pulseDot 1.4s infinite;
}

.command-card-noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.9) 0.7px, transparent 0.7px);
  background-size: 15px 15px;
}

.command-scanline {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.035) 48%, transparent 52%);
  background-size: 100% 220%;
  animation: radarScan 5.5s linear infinite;
}

.command-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
}

.command-tag {
  color: rgba(226, 232, 240, 0.65);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.command-body {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px 10px;
}

/* گیج مدور */
.command-gauge {
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
}

.gauge-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  .gauge-percentage-value {
    color: #f8fafc;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
  }

  .gauge-status-label {
    color: rgba(226, 232, 240, 0.6);
    font-size: 8px;
    font-weight: 700;
    margin-top: 2px;
  }
}

/* نماد آیکون ۸۸ پیکسلی هم‌اندازه گیج */
.command-icon-display {
  position: relative;
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%);
  border: 2px dashed rgba(255, 255, 255, 0.16);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;

  .icon-ring-pulse {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  .icon-status-sub {
    font-size: 8px;
    font-weight: 800;
    margin-top: 3px;
    opacity: 0.9;
  }

  &.icon-display-ok {
    border-color: rgba(45, 212, 191, 0.35);
    background: radial-gradient(circle at center, rgba(45, 212, 191, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%);
    box-shadow: 0 0 16px rgba(45, 212, 191, 0.18);
  }

  &.icon-display-warning {
    border-color: rgba(245, 158, 11, 0.45);
    background: radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%);
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
  }

  &.icon-display-failed,
  &.icon-display-crashed {
    border-color: rgba(239, 68, 68, 0.55);
    background: radial-gradient(circle at center, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.7) 100%);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.25);
  }
}

.command-legend {
  flex: 1;
  min-width: 0;
}

.legend-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--neon);
  font-size: 13.5px;
  font-weight: 800;
}

.legend-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mini-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 11px;

  .row-label {
    color: rgba(226, 232, 240, 0.65);
    font-weight: 600;
  }

  .row-value {
    overflow: hidden;
    color: #f8fafc;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.summary-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 11.5px;

  .summary-title {
    color: rgba(226, 232, 240, 0.5);
    font-size: 10px;
  }

  .summary-text {
    color: #f1f5f9;
    font-weight: 700;
  }
}

/* باکس اختصاصی پیام رخداد/خطا در انتهای کارت */
.issue-notification-box {
  position: relative;
  z-index: 2;
  margin: 4px 16px 14px;
  padding: 8px 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  font-size: 11px;

  &.box-failed, &.box-crashed {
    background: rgba(239, 68, 68, 0.16);
    border: 1px solid rgba(248, 113, 113, 0.35);
    color: #fca5a5;
  }

  &.box-warning {
    background: rgba(245, 158, 11, 0.14);
    border: 1px solid rgba(251, 191, 36, 0.35);
    color: #fcd34d;
  }

  .notification-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    font-size: 10px;
    opacity: 0.9;
    margin-bottom: 2px;
  }

  .notification-body {
    line-height: 1.5;
    word-break: break-word;
    font-family: monospace, sans-serif;
  }
}

.command-footer-dots {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 0 20px 12px;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--neon);
    opacity: 0.6;
  }
}

.fancy-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.badge-on {
  color: #5eead4;
  background: rgba(45, 212, 191, 0.14);
  border: 1px solid rgba(45, 212, 191, 0.35);
}

.badge-warn {
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.badge-off {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.45);
}

.health-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.badge-healthy {
  color: #166534;
  background: rgba(220, 252, 231, 0.85);
}

.badge-degraded {
  color: #991b1b;
  background: rgba(254, 226, 226, 0.9);
}

.status-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #86efac;
  box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.2), 0 0 12px #86efac;
}

.dot-red {
  background: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25), 0 0 12px #ef4444 !important;
  animation: pulseDot 1.5s infinite;
}

.health-alert-box {
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.08);

  &.alert-error {
    background: linear-gradient(135deg, rgba(254, 242, 242, 0.95), rgba(255, 228, 230, 0.9));
    border: 1.5px solid rgba(244, 63, 94, 0.4);
  }

  &.alert-warning {
    background: linear-gradient(135deg, rgba(255, 251, 235, 0.95), rgba(254, 242, 242, 0.9));
    border: 1.5px solid rgba(245, 158, 11, 0.4);
  }
}

.alert-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #dc2626;
  background: #fee2e2;
}

.issue-chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #b91c1c;
  font-size: 11.5px;
}

.health-loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(226, 232, 240, 0.7);

  .loading-text {
    font-size: 12px;
    font-weight: 700;
  }
}

.health-checked-at {
  margin-top: -6px;
  margin-bottom: 24px;
  padding: 0 4px;
  color: #858198;
  font-size: 11.5px;
  font-weight: 600;

  .total-count-badge {
    padding: 3px 8px;
    border-radius: 6px;
    background: rgba(118, 87, 245, 0.08);
    color: $violet;
  }
}

.ltr-num {
  direction: ltr;
  unicode-bidi: embed;
}

.ltr-text {
  direction: ltr;
  text-align: left;
}

/* انیمیشن‌ها */
@keyframes radarScan {
  from { background-position: 0 -110%; }
  to { background-position: 0 110%; }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes flashAlert {
  0% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
  100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
}

@media (max-width: 600px) {
  .section-title { font-size: 18px; }
  .health-status-badge { margin-top: 8px; }
}
</style>
