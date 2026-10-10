<template>
  <section class="admin-stats">
    <div class="section-heading row items-center justify-between q-mb-md">
      <div>
        <div class="section-eyebrow">
          <q-icon
            name="analytics"
            size="17px" />
          نمای کلی سامانه
        </div>

        <div class="section-title">
          نبض مدرسه در یک نگاه
        </div>
      </div>

      <div class="live-indicator">
        <span class="live-indicator-dot" />
        داده‌ها زنده هستند
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="col-12 col-sm-6 col-lg-3">
        <q-card
          class="color-stat-card"
          :class="card.theme">
          <div class="card-glow" />
          <div class="card-top-accent" />

          <q-card-section class="card-content">
            <div class="row items-start justify-between no-wrap">
              <div>
                <div class="card-subtitle">
                  {{ card.subtitle }}
                </div>

                <div class="card-title">
                  {{ card.title }}
                </div>
              </div>

              <div class="card-icon-bubble">
                <q-icon
                  :name="card.icon"
                  size="27px" />
              </div>
            </div>

            <div class="card-number q-mt-lg">
              <q-spinner-dots
                v-if="loading"
                size="30px" />

              <span v-else>
                {{ formatNumber(card.value) }}
              </span>
            </div>

            <div class="progress-container q-mt-md">
              <div class="progress-meta">
                <span>{{ card.caption }}</span>
                <strong>{{ card.progress }}٪</strong>
              </div>

              <div class="progress-track">
                <div
                  class="progress-bar-fill"
                  :style="{ width: `${card.progress}%` }" />
              </div>
            </div>
          </q-card-section>

          <div class="card-bottom-decoration">
            <span />
            <span />
            <span />
          </div>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AdminStats {
  students: number
  classes: number
  exams: number
  homework: number
}

const props = defineProps<{
  loading: boolean
  stats: AdminStats
}>()

const statCards = computed(() => [
  { key: 'students', title: 'دانش‌آموزان فعال', subtitle: 'STUDENTS', value: props.stats.students, icon: 'groups_3', theme: 'theme-violet', caption: 'ثبت‌نام در ترم فعال', progress: 88 },
  { key: 'classes', title: 'کلاس‌های تعریف‌شده', subtitle: 'CLASSES', value: props.stats.classes, icon: 'class', theme: 'theme-blue', caption: 'کل کلاس‌های سامانه', progress: 94 },
  { key: 'exams', title: 'آزمون‌های آنلاین', subtitle: 'ONLINE EXAMS', value: props.stats.exams, icon: 'quiz', theme: 'theme-pink', caption: 'آزمون‌های تعریف‌شده', progress: 76 },
  { key: 'homework', title: 'تکالیف ثبت‌شده', subtitle: 'HOMEWORK', value: props.stats.homework, icon: 'assignment', theme: 'theme-cyan', caption: 'کل تکالیف سامانه', progress: 98 }
])

function formatNumber (value: number) {
  return value.toLocaleString('fa-IR')
}
</script>

<style scoped lang="scss">
$violet: #7657f5;
$ink: #16152d;

.section-heading { padding: 0 4px; }
.section-eyebrow { display: flex; align-items: center; gap: 6px; color: $violet; font-size: 12px; font-weight: 800; }
.section-title { margin-top: 4px; color: $ink; font-size: 21px; font-weight: 900; }
.live-indicator { display: flex; align-items: center; gap: 8px; color: #6f6c82; font-size: 12px; font-weight: 700; }
.live-indicator-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #86efac; box-shadow: 0 0 0 5px rgba(134, 239, 172, 0.16), 0 0 15px #86efac; animation: livePulse 1.7s infinite; }

.color-stat-card {
  --card-color: #7657f5;
  --card-gradient: linear-gradient(135deg, #7657f5, #a78bfa);
  --card-shadow: rgba(118, 87, 245, 0.38);

  position: relative;
  min-height: 220px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 14px 35px rgba(76, 61, 140, 0.09), 0 0 0 1px rgba(255, 255, 255, 0.45) inset;
  backdrop-filter: blur(18px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;

  &:hover { transform: translateY(-9px) rotate(1deg); box-shadow: 0 25px 50px rgba(76, 61, 140, 0.18), 0 0 30px var(--card-shadow); }
}

.theme-violet { --card-color: #7657f5; --card-gradient: linear-gradient(135deg, #7657f5, #a78bfa); --card-shadow: rgba(118, 87, 245, 0.38); }
.theme-blue { --card-color: #2563eb; --card-gradient: linear-gradient(135deg, #2563eb, #38bdf8); --card-shadow: rgba(37, 99, 235, 0.38); }
.theme-pink { --card-color: #ec4899; --card-gradient: linear-gradient(135deg, #ec4899, #fb7185); --card-shadow: rgba(236, 72, 153, 0.38); }
.theme-cyan { --card-color: #0891b2; --card-gradient: linear-gradient(135deg, #0891b2, #2dd4bf); --card-shadow: rgba(8, 145, 178, 0.38); }
.card-glow { position: absolute; top: -75px; left: -50px; width: 180px; height: 180px; border-radius: 50%; opacity: 0.22; filter: blur(18px); background: var(--card-color); }
.card-top-accent { position: absolute; top: 0; right: 0; left: 0; height: 5px; background: var(--card-gradient); }
.card-content { position: relative; z-index: 2; padding: 22px; }
.card-subtitle { color: #9290a3; font-size: 10px; font-weight: 700; letter-spacing: 1px; }
.card-title { margin-top: 6px; color: $ink; font-size: 14px; font-weight: 800; }
.card-icon-bubble { display: flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 18px; color: #fff; background: var(--card-gradient); box-shadow: 0 12px 22px var(--card-shadow); transition: transform 0.4s ease; }
.color-stat-card:hover .card-icon-bubble { transform: rotate(12deg) scale(1.14); }
.card-number { color: $ink; font-size: 34px; font-weight: 900; line-height: 1; }
.progress-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; color: #9693a7; font-size: 10px; strong { color: var(--card-color); font-size: 12px; } }
.progress-track { height: 8px; overflow: hidden; border-radius: 20px; background: #ececf5; }
.progress-bar-fill { height: 100%; border-radius: inherit; background: var(--card-gradient); box-shadow: 0 0 12px var(--card-color); transition: width 1.2s ease; }
.card-bottom-decoration { position: absolute; right: 22px; bottom: 13px; display: flex; gap: 4px; span { width: 5px; height: 5px; border-radius: 50%; background: var(--card-color); opacity: 0.55; } }

@keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.65; transform: scale(0.86); } }

@media (max-width: 600px) {
  .section-title { font-size: 18px; }
  .live-indicator { display: none; }
  .color-stat-card { min-height: 205px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
</style>
