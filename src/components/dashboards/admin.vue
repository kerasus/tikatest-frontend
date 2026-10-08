<template>
  <div class="dashboard-page q-pa-md">
    <!-- پس‌زمینه فانتزی پررنگ‌تر -->
    <div class="dreamy-background">
      <div class="floating-blob blob-lavender" />
      <div class="floating-blob blob-indigo" />
      <div class="floating-blob blob-coral" />
      <div class="grid-pattern" />
    </div>

    <!-- بنر گرادیانی پررنگ -->
    <q-card class="magic-welcome-banner q-mb-lg">
      <div class="banner-sparkle sparkle-1">✨</div>
      <div class="banner-sparkle sparkle-2">🚀</div>
      <div class="banner-sparkle sparkle-3">💡</div>

      <q-card-section class="q-pa-lg row items-center justify-between no-wrap banner-inner">
        <div class="col">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <div class="status-pill">
              <span class="status-dot" />
              <span class="text-caption text-weight-bold status-label">سامانه آنلاین و پایدار</span>
            </div>
            <q-badge class="super-admin-badge q-px-sm q-py-xs text-weight-bold">
              👑 پنل راهبر ارشد سنجاد
            </q-badge>
          </div>

          <div class="text-h4 text-weight-bolder welcome-title q-mt-xs">
            داشبورد مدیریت هوشمند <span class="shiny-text">سَـنـجـاد</span>
          </div>

          <div class="text-subtitle2 welcome-subtext q-mt-xs">
            پایش لحظه‌ای آزمون‌ها، مدیریت یکپارچه شعب مدارس و نظارت بر عملکرد کاربران
          </div>

          <div class="row items-center q-gutter-x-sm q-mt-sm text-caption">
            <div class="metric-item row items-center">
              <q-icon
                name="bolt"
                size="16px"
                class="q-mr-xs text-warning" />
              <span>پاسخگویی سرور: <strong class="text-warning-dark">24ms</strong></span>
            </div>
            <div class="metric-item row items-center">
              <q-icon
                name="verified_user"
                size="16px"
                class="q-mr-xs text-info-dark" />
              <span>امنیت: <strong class="text-info-dark">Sanctum Active</strong></span>
            </div>
          </div>
        </div>

        <div class="col-auto gt-sm">
          <q-btn
            v-if="false"
            unelevated
            class="magic-launch-btn"
            icon="admin_panel_settings"
            label="کنسول عملیات اضطراری (DevOps)"
            @click="openDevModal">
            <q-tooltip class="bg-neutral-dark-30 text-white text-body2 text-bold shadow-5">
              🛠️ اجرای اسکریپت‌های ترمیمی دیتابیس
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- کارت‌های آمار رنگی و چگال -->
    <div class="row q-col-gutter-sm">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="col-12 col-sm-6 col-lg-3">
        <q-card
          class="color-stat-card"
          :class="card.theme">
          <div class="card-top-accent" />

          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap q-mb-sm">
              <div>
                <div class="text-caption text-weight-bold card-subtitle">{{ card.subtitle }}</div>
                <div class="text-subtitle2 text-weight-bolder card-title">{{ card.title }}</div>
              </div>
              <div class="card-icon-bubble">
                <q-icon
                  :name="card.icon"
                  size="26px" />
              </div>
            </div>

            <div class="text-h4 text-weight-bolder card-number">
              <q-spinner-dots
                v-if="loading"
                color="primary"
                size="28px" />
              <span
                v-else
                class="counter-digits">{{ card.value.toLocaleString('fa-IR') }}</span>
            </div>

            <div class="progress-container q-mt-sm">
              <div class="progress-track">
                <div
                  class="progress-bar-fill"
                  :style="{ width: `${card.progress}%` }" />
              </div>
              <div class="row justify-between items-center q-mt-xs">
                <span class="text-caption text-neutral">{{ card.caption }}</span>
                <span class="text-caption text-weight-bolder progress-percent">{{ card.progress }}٪</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- دکمه موبایل -->
    <div class="lt-md q-mt-lg text-center">
      <q-btn
        unelevated
        class="magic-launch-btn full-width q-py-sm shadow-3"
        icon="admin_panel_settings"
        label="کنسول عملیات اضطراری (DevOps)"
        @click="openDevModal" />
    </div>

    <!-- مودال DevOps -->
    <q-dialog
      v-model="showDevModal"
      backdrop-filter="blur(12px) brightness(95%)">
      <q-card class="light-dev-modal">
        <div class="modal-top-accent" />

        <q-card-section class="row items-center q-pa-md modal-head">
          <div class="modal-badge-icon q-mr-md">
            <q-icon
              name="terminal"
              size="24px" />
          </div>
          <div>
            <div class="text-h6 text-weight-bolder text-neutral-dark-20 row items-center">
              کنسول اجرای دستورات هسته
              <q-badge
                color="error"
                text-color="white"
                class="q-ml-sm text-bold pulse-tag">
                CRITICAL
              </q-badge>
            </div>
            <div class="text-caption text-neutral">ارتقای استاندارد هش پسوردها به Bcrypt</div>
          </div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense
            color="neutral-50" />
        </q-card-section>

        <q-separator color="primary-95" />

        <q-card-section class="q-pa-md">
          <div class="warning-soft-box q-pa-sm q-mb-md">
            <div class="row items-start no-wrap">
              <q-icon
                name="shield"
                color="warning-dark"
                size="22px"
                class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-weight-bold text-neutral-dark-20">تأییدیه تغییرات دیتابیس</div>
                <div
                  class="text-caption text-neutral-dark"
                  style="line-height: 1.7;">
                  کاربران بدون هش امن شناسایی و با متد <code class="highlight-code">PASSWORD_BCRYPT</code> ایمن‌سازی می‌شوند.
                </div>
              </div>
            </div>
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">محدوده مدارس هدف:</label>
            <div class="row q-gutter-sm">
              <q-checkbox
                v-model="targetSchools"
                :val="2"
                label="اسدی‌کیا (ID: 2)"
                color="primary"
                dense />
              <q-checkbox
                v-model="targetSchools"
                :val="1"
                label="مبتکران (ID: 1)"
                color="secondary"
                dense />
            </div>
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold text-neutral-dark-20 q-mb-xs block">کلید امنیتی (Dev Key):</label>
            <q-input
              v-model="customKey"
              dense
              outlined
              placeholder="DEV_KEY از .env بک‌اند..."
              class="soft-input"
              :disable="executingScript">
              <template #prepend>
                <q-icon
                  name="key"
                  color="primary" />
              </template>
            </q-input>
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
              <span class="text-caption font-mono text-neutral-dark-40">System Logs</span>
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
                <span class="log-arrow">➜</span> {{ log }}
              </div>
              <div
                v-if="scriptResult"
                class="result-pill-box q-mt-sm q-pa-sm">
                <div class="text-success-dark text-weight-bold">✔ عملیات موفق</div>
                <div>🔑 هش‌شده: <strong>{{ scriptResult.fixed }}</strong></div>
                <div>⏭️ از قبل Bcrypt: <strong>{{ scriptResult.skipped_already_bcrypt }}</strong></div>
                <div v-if="scriptResult.skipped_empty_password">
                  ⚠️ بدون رمز: <strong class="text-error">{{ scriptResult.skipped_empty_password }}</strong>
                </div>
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
            label="انصراف"
            color="neutral-dark-40"
            :disable="executingScript" />
          <q-btn
            unelevated
            class="run-action-btn"
            icon="offline_bolt"
            label="شروع عملیات ترمیم"
            :loading="executingScript"
            :disable="confirmationWord.trim() !== 'تایید' || targetSchools.length === 0"
            @click="handleRunPasswordFix" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import SchoolAPI from 'src/repositories/school'
import StudentAPI from 'src/repositories/student'
import UserAPI from 'src/repositories/user'
import { devAdmin, type DevScriptRunResultType } from 'src/repositories/devAdmin'

const $q = useQuasar()

const schoolAPI = new SchoolAPI()
const studentAPI = new StudentAPI()
const userAPI = new UserAPI()

const loading = ref(true)
const stats = ref({ schools: 0, users: 0, teachers: 0, students: 0 })

const statCards = computed(() => [
  { key: 'schools', title: 'مراکز و مدارس همکار', subtitle: 'CENTERS', value: stats.value.schools, icon: 'school', theme: 'theme-lavender', caption: 'پوشش استانی', progress: 88 },
  { key: 'users', title: 'کل اعضای سامانه', subtitle: 'ACCOUNTS', value: stats.value.users, icon: 'groups_3', theme: 'theme-indigo', caption: 'فعالیت بالا', progress: 94 },
  { key: 'teachers', title: 'اساتید و دبیران', subtitle: 'FACULTY', value: stats.value.teachers, icon: 'psychology_alt', theme: 'theme-coral', caption: 'طراحی آزمون', progress: 76 },
  { key: 'students', title: 'دانش‌آموزان فعال', subtitle: 'STUDENTS', value: stats.value.students, icon: 'auto_stories', theme: 'theme-emerald', caption: 'آزمون آنلاین', progress: 98 }
])

const showDevModal = ref(false)
const confirmationWord = ref('')
const customKey = ref('')
const targetSchools = ref<number[]>([2, 1])
const executingScript = ref(false)
const scriptResult = ref<DevScriptRunResultType | null>(null)
const logs = ref<string[]>([])

function openDevModal () {
  confirmationWord.value = ''
  scriptResult.value = null
  logs.value = []
  showDevModal.value = true
}

async function handleRunPasswordFix () {
  if (confirmationWord.value.trim() !== 'تایید') return

  executingScript.value = true
  logs.value = [
    'اتصال امن به Sanctum API...',
    `مدارس هدف: [${targetSchools.value.join(', ')}]...`,
    'شناسایی پسوردهای غیر Bcrypt...'
  ]

  try {
    const result = await devAdmin.runDevScript('fix-student-passwords', targetSchools.value)
    scriptResult.value = result
    logs.value.push(`پاسخ سرور: ${result.message || 'انجام شد'}`)
    logs.value.push(`${result.fixed} کلمه عبور ارتقا یافت.`)

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `${result.fixed} پسورد ایمن‌سازی شد!`,
      position: 'top',
      timeout: 4000
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'خطای نامشخص'
    logs.value.push(`[ERROR]: ${errorMessage}`)
    $q.notify({ type: 'negative', icon: 'error_outline', message: errorMessage, position: 'top', timeout: 6000 })
  } finally {
    executingScript.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [schoolsRes, usersRes, teachersRes, studentsRes] = await Promise.all([
      schoolAPI.index({ length: 1 }),
      userAPI.index({ length: 1 }),
      userAPI.index({ length: 1, role: 'teacher' }),
      studentAPI.index({ length: 1 })
    ])
    stats.value.schools = schoolsRes.total
    stats.value.users = usersRes.total
    stats.value.teachers = teachersRes.total
    stats.value.students = studentsRes.total
  } catch (error) {
    console.error('Error loading stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap');

$primary: #8B7FD4;
$primary-50: #7560BD;
$primary-70: #A59BE0;
$primary-90: #D9D4F5;
$primary-95: #ECEAFB;

$secondary: #3B5BDB;
$secondary-50: #3550BD;
$secondary-90: #CBD8F8;
$secondary-95: #E5ECFC;

$neutral: #76808F;
$neutral-dark-20: #1B2134;
$neutral-dark-30: #2A3041;
$neutral-dark-40: #3E424E;
$neutral-dark: #535762;

$error: #EE4266;
$success: #4CAF7D;
$success-dark: #3A8F65;
$success-lighten: #E6F8EE;
$info: #5AB2FF;
$info-dark: #3A9BE6;
$warning: #FF9F43;
$warning-dark: #E68A2E;
$warning-lighten: #FFF0E3;

.font-mono {
  font-family: 'JetBrains Mono', monospace;
  direction: ltr;
  text-align: left;
}

.dashboard-page {
  position: relative;
  min-height: 100vh;

  .dreamy-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #F3F0FC 0%, #EEF3FE 50%, #FDF3F7 100%);
    pointer-events: none;
    z-index: -1;
    overflow: hidden;

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-size: 32px 32px;
      background-image:
        linear-gradient(to right, rgba(139, 127, 212, 0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(139, 127, 212, 0.07) 1px, transparent 1px);
    }

    .floating-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.55;
      animation: floatDream 14s infinite alternate ease-in-out;
    }
    .blob-lavender { width: 480px; height: 480px; background: $primary-70; top: -100px; right: -60px; }
    .blob-indigo { width: 520px; height: 520px; background: $secondary-90; bottom: -120px; left: 5%; animation-delay: -5s; }
    .blob-coral { width: 380px; height: 380px; background: #FFC9D6; top: 30%; left: 55%; animation-delay: -9s; }
  }

  @keyframes floatDream {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 30px) scale(1.1); }
  }

  /* ✅ بنر گرادیانی پررنگ */
  .magic-welcome-banner {
    position: relative;
    border-radius: 24px;
    background: linear-gradient(120deg, #7560BD 0%, #8B7FD4 35%, #5A6FD6 70%, #3B5BDB 100%);
    box-shadow: 0 15px 35px -10px rgba(90, 72, 160, 0.5);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 15% 20%, rgba(255,255,255,0.25) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(255,255,255,0.15) 0%, transparent 40%);
      pointer-events: none;
    }

    .banner-sparkle {
      position: absolute;
      font-size: 20px;
      pointer-events: none;
      opacity: 0.9;
      animation: bounceSparkle 3s infinite ease-in-out;
      z-index: 1;
    }
    .sparkle-1 { top: 16px; left: 35%; }
    .sparkle-2 { bottom: 20px; right: 28%; animation-delay: 1.2s; }
    .sparkle-3 { top: 30px; right: 45%; animation-delay: 2s; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      padding: 4px 12px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.35);

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #7CFFB2;
        box-shadow: 0 0 8px #7CFFB2;
      }
      .status-label { color: #Eafff3; }
    }

    .super-admin-badge {
      background: rgba(255, 255, 255, 0.22);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }

    .welcome-title { color: #fff; }

    .shiny-text {
      background: linear-gradient(90deg, #FFE985, #FFD1E8, #B8F5FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: none;
    }

    .welcome-subtext { color: rgba(255, 255, 255, 0.85); }

    .metric-item {
      background: rgba(255, 255, 255, 0.18);
      padding: 4px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);

      strong { color: #FFE985; }
      .text-warning, .text-info-dark { color: #FFE985 !important; }
    }
  }

  @keyframes bounceSparkle {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-8px) scale(1.15); }
  }

  .magic-launch-btn {
    background: rgba(255, 255, 255, 0.95);
    color: $secondary-50;
    font-weight: 800;
    font-size: 14px;
    padding: 12px 22px;
    border-radius: 16px;
    box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.25);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      transform: translateY(-3px) scale(1.02);
      background: #fff;
      box-shadow: 0 12px 28px -5px rgba(0, 0, 0, 0.35);
    }
  }

  /* ✅ کارت‌های رنگی چگال */
  .color-stat-card {
    position: relative;
    background: #fff;
    border-radius: 20px;
    border: 1px solid rgba(139, 127, 212, 0.12);
    box-shadow: 0 8px 24px -8px rgba(139, 127, 212, 0.15);
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      transform: translateY(-5px);
      .card-icon-bubble { transform: scale(1.12) rotate(8deg); }
    }

    .card-top-accent {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 5px;
    }

    .card-subtitle {
      font-size: 10px;
      letter-spacing: 1px;
      color: $neutral;
    }
    .card-title { color: $neutral-dark-20; }
    .counter-digits { color: $neutral-dark-20; }

    .card-icon-bubble {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: all 0.4s ease;
      flex-shrink: 0;
    }

    .progress-container {
      .progress-track {
        width: 100%;
        height: 7px;
        background: #F1F3F9;
        border-radius: 20px;
        overflow: hidden;

        .progress-bar-fill {
          height: 100%;
          border-radius: 20px;
          transition: width 1s ease;
        }
      }
    }

    &.theme-lavender {
      .card-top-accent { background: linear-gradient(90deg, $primary, $primary-70); }
      .card-icon-bubble { background: linear-gradient(135deg, $primary, $primary-50); box-shadow: 0 6px 14px -4px rgba(139,127,212,0.6); }
      .progress-bar-fill { background: linear-gradient(90deg, $primary, $primary-70); }
      .progress-percent { color: $primary-50; }
      &:hover { box-shadow: 0 15px 30px -8px rgba(139, 127, 212, 0.4); }
    }

    &.theme-indigo {
      .card-top-accent { background: linear-gradient(90deg, $secondary, #6B85E5); }
      .card-icon-bubble { background: linear-gradient(135deg, $secondary, $secondary-50); box-shadow: 0 6px 14px -4px rgba(59,91,219,0.6); }
      .progress-bar-fill { background: linear-gradient(90deg, $secondary, #6B85E5); }
      .progress-percent { color: $secondary-50; }
      &:hover { box-shadow: 0 15px 30px -8px rgba(59, 91, 219, 0.4); }
    }

    &.theme-coral {
      .card-top-accent { background: linear-gradient(90deg, $error, #F98D8F); }
      .card-icon-bubble { background: linear-gradient(135deg, #F4707F, $error); box-shadow: 0 6px 14px -4px rgba(238,66,102,0.6); }
      .progress-bar-fill { background: linear-gradient(90deg, $error, #F98D8F); }
      .progress-percent { color: $error; }
      &:hover { box-shadow: 0 15px 30px -8px rgba(238, 66, 102, 0.4); }
    }

    &.theme-emerald {
      .card-top-accent { background: linear-gradient(90deg, $success, #72d9a5); }
      .card-icon-bubble { background: linear-gradient(135deg, $success, $success-dark); box-shadow: 0 6px 14px -4px rgba(76,175,125,0.6); }
      .progress-bar-fill { background: linear-gradient(90deg, $success, #72d9a5); }
      .progress-percent { color: $success-dark; }
      &:hover { box-shadow: 0 15px 30px -8px rgba(76, 175, 125, 0.4); }
    }
  }

  /* مودال روشن چگال */
  .light-dev-modal {
    min-width: 480px;
    max-width: 600px;
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 25px 60px -15px rgba(59, 91, 219, 0.3);
    overflow: hidden;

    .modal-top-accent {
      height: 5px;
      background: linear-gradient(90deg, $primary, $secondary, $error, $primary);
      background-size: 200% 100%;
      animation: gradientMove 3s linear infinite;
    }

    .modal-badge-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, $primary, $secondary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .pulse-tag { font-size: 10px; padding: 2px 7px; border-radius: 6px; }

    .warning-soft-box {
      background: $warning-lighten;
      border: 1px solid rgba(255, 159, 67, 0.35);
      border-radius: 14px;
    }

    .highlight-code {
      background: rgba(59, 91, 219, 0.08);
      color: $secondary-50;
      padding: 1px 6px;
      border-radius: 6px;
      font-weight: bold;
    }

    .soft-input {
      :deep(.q-field__control) {
        border-radius: 12px;
        background: #FAF9FE;
      }
    }

    .light-terminal-window {
      background: #F6F7FD;
      border-radius: 14px;
      border: 1px solid $primary-95;

      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        display: inline-block;
        &.d-red { background: #FF605C; }
        &.d-yellow { background: #FFBD44; }
        &.d-green { background: #00CA4E; }
      }

      .terminal-body {
        font-size: 12px;
        color: $neutral-dark-20;
        line-height: 1.6;
        max-height: 130px;
        overflow-y: auto;

        .log-row .log-arrow { color: $primary; font-weight: bold; }
      }

      .result-pill-box {
        background: $success-lighten;
        border-radius: 10px;
        border: 1px solid rgba(76, 175, 125, 0.35);
      }
    }

    .run-action-btn {
      background: linear-gradient(135deg, $primary 0%, $secondary 100%);
      color: #fff;
      font-weight: 700;
      border-radius: 12px;
      padding: 8px 20px;
      box-shadow: 0 8px 20px -5px rgba(59, 91, 219, 0.4);
    }
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
}
</style>
