<template>
  <section class="health-panel">
    <div class="section-heading row items-center justify-between q-mt-xl q-mb-md">
      <div>
        <div class="section-eyebrow">
          <q-icon
            name="monitor_heart"
            size="17px" />
          مرکز مانیتورینگ زیرساخت
        </div>

        <div class="section-title">
          سلامت و پایداری سرور
        </div>
      </div>

      <div
        v-if="!loading && health"
        class="health-status-badge"
        :class="hasIssues ? 'badge-degraded' : 'badge-healthy'">
        <span
          class="status-dot"
          :class="{ 'dot-red': hasIssues }" />
        {{ hasIssues ? 'نیازمند بررسی زیرساخت' : 'تمام سرویس‌ها پایدار' }}
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="health-alert-box q-pa-md q-mb-md">
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
          flat
          round
          color="negative"
          icon="refresh"
          :loading="loading"
          @click="loadHealth" />
      </div>
    </div>

    <div
      v-else-if="hasIssues"
      class="health-alert-box q-pa-md q-mb-md">
      <div class="row items-start no-wrap">
        <div class="alert-icon-wrap q-mr-md">
          <q-icon
            name="warning_amber"
            size="24px" />
        </div>

        <div class="col">
          <div class="text-subtitle2 text-weight-bolder text-negative q-mb-xs">
            هشدارهای زیرساخت:
          </div>

          <ul class="health-issues-list">
            <li
              v-for="issue in issueResults"
              :key="issue.name">
              {{ issue.label }}: {{ issue.notificationMessage || issue.shortSummary }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="index in loading ? 3 : 0"
        :key="`health-loading-${index}`"
        class="col-12 col-md-4">
        <div class="command-card health-loading-card">
          <div class="command-card-noise" />
          <div class="command-scanline" />
          <q-spinner-orbit
            color="deep-purple-3"
            size="54px" />
          <span>در حال بررسی سرویس‌ها...</span>
        </div>
      </div>

      <div
        v-for="(check, index) in health?.storedCheckResults ?? []"
        :key="check.name"
        class="col-12 col-md-4">
        <div
          class="command-card"
          :class="cardTheme(index)">
          <div class="command-card-noise" />
          <div class="command-scanline" />

          <div class="command-head">
            <span class="command-tag">{{ check.name }}</span>
            <q-badge
              class="fancy-badge"
              :class="statusBadgeClass(check.status)">
              {{ statusLabel(check.status) }}
            </q-badge>
          </div>

          <div class="command-body">
            <q-circular-progress
              :value="statusProgress(check.status)"
              size="92px"
              :thickness="0.09"
              :color="statusColor(check.status)"
              track-color="grey-9"
              class="command-gauge">
              <div class="gauge-inner">
                <q-icon
                  :name="statusIcon(check.status)"
                  size="25px" />
                <span>{{ statusLabel(check.status) }}</span>
              </div>
            </q-circular-progress>

            <div class="command-legend">
              <div class="legend-title">
                <q-icon
                  name="monitor_heart"
                  size="16px" />
                {{ check.label }}
              </div>

              <div class="legend-rows">
                <div
                  v-for="item in metaItems(check.meta)"
                  :key="item.key"
                  class="mini-row">
                  <span>{{ item.label }}</span>
                  <strong class="ltr-num">{{ item.value }}</strong>
                </div>

                <div
                  v-if="metaItems(check.meta).length === 0"
                  class="health-summary">
                  {{ check.shortSummary || check.notificationMessage || 'بررسی با موفقیت انجام شد.' }}
                </div>
              </div>
            </div>
          </div>

          <div class="command-footer-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="health && !loading"
      class="health-checked-at">
      آخرین بررسی: {{ formatFinishedAt(health.finishedAt) }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardAPI from 'src/repositories/dashboard'
import type {
  HealthCheckResponse,
  HealthCheckStatus
} from 'src/repositories/dashboard'

interface MetaItem {
  key: string
  label: string
  value: string
}

const dashboardAPI = new DashboardAPI()
const health = ref<HealthCheckResponse | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const issueResults = computed(() => health.value?.storedCheckResults.filter(
  (check) => check.status !== 'ok'
) ?? [])

const hasIssues = computed(() => issueResults.value.length > 0)

const metaLabels: Record<string, string> = {
  enabled: 'وضعیت',
  hit_rate: 'نرخ موفقیت',
  memory_used_mb: 'حافظه مصرفی',
  cached_scripts: 'اسکریپت‌های کش',
  used_space_percentage: 'فضای مصرف‌شده'
}

async function loadHealth () {
  loading.value = true
  errorMessage.value = ''

  try {
    health.value = await dashboardAPI.adminHealth()
  } catch (error) {
    console.error('Error loading admin health:', error)
    health.value = null
    errorMessage.value = 'دریافت وضعیت سلامت سیستم با خطا مواجه شد.'
  } finally {
    loading.value = false
  }
}

function cardTheme (index: number) {
  return ['card-opcache', 'card-ssl', 'card-db'][index % 3]
}

function statusBadgeClass (status: HealthCheckStatus) {
  if (status === 'ok') return 'badge-on'
  if (status === 'warning') return 'badge-warn'
  return 'badge-off'
}

function statusLabel (status: HealthCheckStatus) {
  return {
    ok: 'سالم',
    warning: 'هشدار',
    failed: 'ناموفق',
    crashed: 'متوقف'
  }[status]
}

function statusColor (status: HealthCheckStatus) {
  if (status === 'ok') return 'teal'
  if (status === 'warning') return 'amber-6'
  return 'red-5'
}

function statusProgress (status: HealthCheckStatus) {
  if (status === 'ok') return 100
  if (status === 'warning') return 65
  return 20
}

function statusIcon (status: HealthCheckStatus) {
  if (status === 'ok') return 'check_circle'
  if (status === 'warning') return 'warning_amber'
  return 'error_outline'
}

function metaItems (meta: Record<string, unknown>): MetaItem[] {
  return Object.entries(meta)
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      label: metaLabels[key] ?? key.replaceAll('_', ' '),
      value: formatMetaValue(key, value)
    }))
}

function formatMetaValue (key: string, value: unknown) {
  if (typeof value === 'boolean') return value ? 'فعال' : 'غیرفعال'
  if (typeof value === 'number') {
    const localizedValue = value.toLocaleString('fa-IR')
    if (key.includes('percentage') || key.includes('rate')) return `${localizedValue}٪`
    if (key.includes('_mb')) return `${localizedValue} MB`
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

.section-heading { padding: 0 4px; }
.section-eyebrow { display: flex; align-items: center; gap: 6px; color: $violet; font-size: 12px; font-weight: 800; }
.section-title { margin-top: 4px; color: $ink; font-size: 21px; font-weight: 900; }

.command-card {
  position: relative;
  min-height: 250px;
  overflow: hidden;
  border-radius: 24px;
  color: #e2e8f0;
  background: linear-gradient(145deg, #191635 0%, #211a45 55%, #14213d 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 20px 45px -18px rgba(15, 10, 45, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;

  &:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -18px rgba(15, 10, 45, 0.8), 0 0 28px rgba(139, 92, 246, 0.25); }
}

.card-opcache { --neon: #a78bfa; &::before { background: linear-gradient(90deg, #a78bfa, #6d28d9); } }
.card-ssl { --neon: #f472b6; &::before { background: linear-gradient(90deg, #f472b6, #be185d); } }
.card-db { --neon: #2dd4bf; &::before { background: linear-gradient(90deg, #2dd4bf, #0f766e); } }

.command-card::before { content: ''; position: absolute; top: 0; right: 0; left: 0; height: 4px; z-index: 3; box-shadow: 0 0 14px var(--neon); }
.command-card-noise { position: absolute; inset: 0; opacity: 0.08; pointer-events: none; background-image: radial-gradient(rgba(255, 255, 255, 0.9) 0.7px, transparent 0.7px); background-size: 15px 15px; }
.command-scanline { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.035) 48%, transparent 52%); background-size: 100% 220%; animation: radarScan 5.5s linear infinite; }
.command-head { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 0; }
.command-tag { overflow: hidden; color: rgba(226, 232, 240, 0.55); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-overflow: ellipsis; white-space: nowrap; }
.command-body { position: relative; z-index: 2; display: flex; align-items: center; gap: 16px; padding: 16px 20px 14px; }
.command-gauge { flex-shrink: 0; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.08)); }
.gauge-inner { display: flex; flex-direction: column; align-items: center; span { color: rgba(226, 232, 240, 0.5); font-size: 9px; letter-spacing: 0.5px; } }
.command-legend { flex: 1; min-width: 0; }
.legend-title { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; color: var(--neon); font-size: 13px; font-weight: 800; }
.legend-rows { display: flex; flex-direction: column; gap: 6px; }
.mini-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 11px; border-radius: 11px; background: rgba(255, 255, 255, 0.055); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 11.5px; span { color: rgba(226, 232, 240, 0.6); font-weight: 600; } strong { overflow: hidden; color: #f8fafc; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; } }
.health-summary { display: -webkit-box; overflow: hidden; color: rgba(226, 232, 240, 0.72); font-size: 11px; font-weight: 600; line-height: 1.8; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.ltr-num { direction: ltr; unicode-bidi: embed; }
.command-footer-dots { position: absolute; z-index: 2; right: 20px; bottom: 12px; display: flex; gap: 4px; span { width: 5px; height: 5px; border-radius: 50%; background: var(--neon); opacity: 0.7; } }
.fancy-badge { padding: 5px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; letter-spacing: 0.8px; }
.badge-on { color: #5eead4; background: rgba(45, 212, 191, 0.14); border: 1px solid rgba(45, 212, 191, 0.35); }
.badge-warn { color: #fcd34d; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); }
.badge-off { color: #fca5a5; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); }
.health-status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 800; backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.7); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); }
.badge-healthy { color: #166534; background: rgba(220, 252, 231, 0.85); }
.badge-degraded { color: #991b1b; background: rgba(254, 226, 226, 0.9); animation: pulseDegraded 2s infinite alternate; }
.status-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #86efac; box-shadow: 0 0 0 5px rgba(134, 239, 172, 0.16), 0 0 15px #86efac; animation: livePulse 1.7s infinite; }
.dot-red { background: #ef4444 !important; box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.2), 0 0 15px #ef4444 !important; }
.health-alert-box { border-radius: 20px; background: linear-gradient(135deg, rgba(254, 242, 242, 0.9), rgba(255, 237, 213, 0.85)); border: 1px solid rgba(248, 113, 113, 0.35); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.08); backdrop-filter: blur(12px); }
.alert-icon-wrap { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 14px; color: #dc2626; background: #fee2e2; box-shadow: 0 6px 15px rgba(220, 38, 38, 0.15); }
.health-issues-list { margin: 0; padding-right: 18px; li { color: #991b1b; font-size: 12.5px; font-weight: 600; line-height: 1.9; } }
.health-loading-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: rgba(226, 232, 240, 0.68); font-size: 12px; font-weight: 700; }
.health-checked-at { margin-top: -8px; margin-bottom: 20px; padding: 0 4px; color: #858198; font-size: 11px; font-weight: 600; text-align: left; }

@keyframes radarScan { from { background-position: 0 -110%; } to { background-position: 0 110%; } }
@keyframes pulseDegraded { from { transform: scale(1); } to { transform: scale(1.02); box-shadow: 0 0 16px 2px rgba(239, 68, 68, 0.3); } }
@keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.65; transform: scale(0.86); } }

@media (max-width: 600px) {
  .section-title { font-size: 18px; }
  .health-status-badge { margin-top: 12px; }
  .command-body { align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
</style>
