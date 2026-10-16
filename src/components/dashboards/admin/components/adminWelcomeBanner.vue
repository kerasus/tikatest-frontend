<template>
  <q-card class="dev-banner q-mb-md">
    <!-- لایه‌های پس‌زمینه فنی -->
    <div class="dev-banner-grid" />
    <div class="dev-banner-glow glow-cyan" />
    <div class="dev-banner-glow glow-emerald" />
    <div class="dev-banner-scanline" />

    <q-card-section class="dev-banner-inner">
      <!-- ردیف اصلی: اطلاعات هدر و رادار پایش -->
      <div class="dev-banner-head row items-center justify-between no-wrap">
        <!-- تگ‌های وضعیت و پرامپت ترمینال -->
        <div class="row items-center q-gutter-x-sm">
          <span class="terminal-prompt">
            <span class="prompt-sym">&gt;_</span>
            <span class="prompt-txt">sanjad-admin-console</span>
            <span class="prompt-cursor" />
          </span>

          <div class="dev-badge badge-live">
            <span class="live-dot" />
            <span class="text-weight-bold">LIVE</span>
          </div>

          <div class="dev-badge badge-role gt-xs">
            <q-icon
              name="admin_panel_settings"
              size="13px"
              class="q-mr-xs" />
            <span>Root Admin</span>
          </div>
        </div>

        <!-- المان متحرک زنده: میکرو رادار پایش شبکه و تله‌متری هگز -->
        <div class="dev-telemetry row items-center q-gutter-x-md">
          <!-- جریان بایت‌های هگزادسیمال متحرک -->
          <div class="hex-stream gt-sm">
            <span class="hex-label">BUS:</span>
            <span class="hex-bytes">{{ hexStream }}</span>
          </div>

          <!-- ویجت رادار پایش گرافیکی -->
          <div
            class="radar-widget"
            title="Telemetry Active">
            <div class="radar-ping-ring ring-1" />
            <div class="radar-ping-ring ring-2" />
            <div class="radar-sweep" />
            <div class="radar-core" />
          </div>
        </div>
      </div>

      <!-- ردیف میانی: عنوان فشرده -->
      <div class="dev-banner-mid row items-center justify-between q-my-xs">
        <div class="banner-title-wrap">
          <h1 class="banner-title">
            داشبورد مدیریت <span class="highlight-cyan">سَـنـجـاد</span>
            <span class="version-tag">v2.4-prod</span>
          </h1>
        </div>
      </div>

      <!-- ردیف پایینی: شاخص‌های فنی + دکمه‌های اکشن -->
      <div class="dev-banner-foot row items-center justify-between q-col-gutter-y-sm">
        <!-- متریک‌های مونو لاگ -->
        <div class="system-metrics row items-center q-gutter-xs">
          <div class="metric-pill">
            <q-icon
              name="speed"
              size="13px"
              class="text-cyan-4" />
            <span class="metric-label">ping:</span>
            <span
              v-if="responseTime !== null"
              class="metric-val text-cyan-3">
              {{ responseTime }}ms
            </span>
            <q-spinner
              v-else
              size="11px"
              color="cyan-3" />
          </div>

          <div class="metric-pill">
            <q-icon
              :name="serverHealth.icon"
              size="13px"
              :class="serverHealth.className" />
            <span class="metric-label">health:</span>
            <span
              class="metric-val"
              :class="serverHealth.className">
              {{ serverHealth.label }}
            </span>
          </div>

          <div class="metric-pill gt-xs">
            <q-icon
              name="lock"
              size="12px"
              class="text-emerald-4" />
            <span class="metric-label">sanctum:</span>
            <span class="metric-val text-emerald-3">active</span>
          </div>
        </div>

        <!-- دکمه‌های کامپکت و دارک دواپس و لاگ -->
        <div class="banner-actions row items-center q-gutter-xs">
          <q-btn
            unelevated
            no-caps
            class="btn-dev btn-devops"
            @click="emit('open-dev-modal')">
            <q-icon
              name="terminal"
              size="14px"
              class="q-mr-xs" />
            <span>کنسول DevOps</span>
            <span class="btn-safe-pill">SAFE</span>
            <q-tooltip class="bg-dark text-caption">اجرای فرمان‌های امن Artisan و پایش کانتینر</q-tooltip>
          </q-btn>

          <q-btn
            unelevated
            no-caps
            class="btn-dev btn-logs"
            @click="emit('open-log-modal')">
            <q-icon
              name="receipt_long"
              size="14px"
              class="q-mr-xs" />
            <span>لاگ‌های سامانه</span>
            <q-tooltip class="bg-dark text-caption">مشاهده خطاهای لاراول و لاگ کوئری‌ها</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  responseTime: number | null
}>()

const emit = defineEmits<{
  (e: 'open-dev-modal'): void
  (e: 'open-log-modal'): void
}>()

const serverHealth = computed(() => {
  if (props.responseTime === null) {
    return { label: 'بررسی...', icon: 'sync', className: 'health-pending' }
  }

  if (props.responseTime <= 250) {
    return { label: 'عالی', icon: 'bolt', className: 'health-excellent' }
  }

  if (props.responseTime <= 700) {
    return { label: 'پایدار', icon: 'check_circle', className: 'health-stable' }
  }

  return { label: 'کند', icon: 'warning', className: 'health-slow' }
})

// شبیه‌سازی جریان هگزادسیمال متحرک برای حس فنی زنده بودن سیستم
const hexStream = ref('0x7F 0x45 0x4C 0x46')
let hexInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const hexChars = ['3A', 'B4', '7F', 'C1', '90', 'E8', '00', 'FA', '5D', '4C']
  hexInterval = setInterval(() => {
    const b1 = hexChars[Math.floor(Math.random() * hexChars.length)]
    const b2 = hexChars[Math.floor(Math.random() * hexChars.length)]
    const b3 = hexChars[Math.floor(Math.random() * hexChars.length)]
    const b4 = hexChars[Math.floor(Math.random() * hexChars.length)]
    hexStream.value = `0x${b1} 0x${b2} 0x${b3} 0x${b4}`
  }, 650)
})

onBeforeUnmount(() => {
  if (hexInterval) clearInterval(hexInterval)
})
</script>

<style lang="scss" scoped>
.dev-banner {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  background-color: #0a0f1d;
  border: 1px solid rgba(56, 189, 248, 0.18);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  color: #e2e8f0;
  isolation: isolate;
}

/* شبکه ماتریسی بسیار محو پس‌زمینه */
.dev-banner-grid {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 40%, transparent 80%);
  pointer-events: none;
}

/* هاله‌های نوری استاتیک مدرن */
.dev-banner-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(55px);
  pointer-events: none;
  opacity: 0.22;
}
.glow-cyan {
  top: -80px;
  left: 20%;
  background: #38bdf8;
  animation: glowFloat 3s ease-in-out infinite alternate;
}
.glow-emerald {
  bottom: -90px;
  right: 15%;
  background: #10b981;
  animation: glowFloat 2s ease-in-out infinite alternate-reverse;
}

/* خط اسکن عمودی ملایم */
.dev-banner-scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(56, 189, 248, 0.04) 50%,
    transparent 100%
  );
  animation: scanlineSweep 2s linear infinite;
}

.dev-banner-inner {
  position: relative;
  z-index: 2;
  padding: 14px 18px !important;
}

/* بخش هدر و پرامپت ترمینالی */
.terminal-prompt {
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.16);
  direction: ltr;

  .prompt-sym {
    color: #10b981;
    font-weight: 800;
    margin-right: 5px;
  }
  .prompt-txt {
    color: #94a3b8;
  }
  .prompt-cursor {
    display: inline-block;
    width: 6px;
    height: 11px;
    background: #38bdf8;
    margin-left: 4px;
    animation: cursorBlink 1s infinite;
  }
}

.dev-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  padding: 3px 8px;
  border-radius: 6px;
  line-height: 1;
}

.badge-live {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-family: ui-monospace, monospace;

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    margin-right: 6px;
    box-shadow: 0 0 8px #10b981;
    animation: livePulse 1.6s infinite;
  }
}

.badge-role {
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
}

/* رادار پایش گرافیکی زنده */
.hex-stream {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  color: #64748b;
  direction: ltr;

  .hex-label {
    color: #38bdf8;
    margin-right: 4px;
    font-weight: 700;
  }
  .hex-bytes {
    color: #94a3b8;
    letter-spacing: 0.5px;
  }
}

.radar-widget {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-sweep {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 65%, rgba(56, 189, 248, 0.55) 100%);
  animation: radarSpin 2.4s linear infinite;
}

.radar-core {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
  position: relative;
  z-index: 2;
}

.radar-ping-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid #38bdf8;
  animation: pingOut 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.ring-2 {
  animation-delay: 1.2s;
}

/* عنوان داشبورد */
.banner-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .highlight-cyan {
    color: #38bdf8;
    text-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
  }

  .version-tag {
    font-family: ui-monospace, monospace;
    font-size: 9.5px;
    font-weight: 600;
    color: #64748b;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.18);
    padding: 2px 6px;
    border-radius: 4px;
    vertical-align: middle;
  }
}

/* شاخص‌های فنی (Pills) */
.metric-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.15);

  .metric-label {
    color: #64748b;
    font-size: 10px;
    text-transform: lowercase;
  }
  .metric-val {
    font-weight: 700;
  }
}

.health-excellent { color: #34d399 !important; }
.health-stable { color: #facc15 !important; }
.health-slow { color: #f87171 !important; }
.health-pending { color: #94a3b8 !important; }

/* دکمه‌های اکشن به سبک Hacker / Dev */
.btn-dev {
  font-size: 11.5px;
  padding: 5px 12px;
  border-radius: 7px;
  font-weight: 600;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
}

.btn-devops {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #bae6fd;

  &:hover {
    background: rgba(56, 189, 248, 0.22);
    border-color: #38bdf8;
    color: #ffffff;
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.25);
  }
}

.btn-safe-pill {
  font-family: ui-monospace, monospace;
  font-size: 8.5px;
  font-weight: 800;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 1px 4px;
  border-radius: 3px;
  margin-right: 6px;
}

.btn-logs {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #cbd5e1;

  &:hover {
    background: rgba(51, 65, 85, 0.9);
    border-color: rgba(148, 163, 184, 0.45);
    color: #ffffff;
  }
}

/* انیمیشن‌ها */
@keyframes radarSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pingOut {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes livePulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes scanlineSweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes glowFloat {
  from { transform: translate(-20px, -80px) scale(0.8); }
  to { transform: translate(25px, 15px) scale(2.8); }
}

@media (max-width: 600px) {
  .dev-banner-foot {
    flex-direction: column;
    align-items: stretch;
  }
  .banner-actions {
    width: 100%;
    margin-top: 6px;
    .btn-dev {
      flex: 1;
      justify-content: center;
    }
  }
  .system-metrics {
    justify-content: flex-start;
  }
}
</style>
