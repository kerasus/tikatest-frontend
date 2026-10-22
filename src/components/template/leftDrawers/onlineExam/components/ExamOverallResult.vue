<template>
  <q-card-section class="q-pb-md exam-overall-container">
    <!-- هدر شیشه‌ای و نئونی نتیجه آزمون -->
    <div class="glass-hero-banner q-mb-md">
      <div class="glass-hero-banner__deco-circle" />
      <div class="row items-center justify-between no-wrap relative-position">
        <div class="col">
          <div class="hero-title flex items-center q-gutter-x-xs">
            <q-icon
              name="military_tech"
              size="22px"
              class="hero-title__icon" />
            <span>نتیجه کارنامه آزمون</span>
          </div>
          <div class="hero-subtitle q-mt-xs">
            <span>مجموع پرسش‌ها:</span>
            <span class="hero-pill">{{ overallResult.totalQuestions ?? '-' }} سوال</span>
          </div>
        </div>

        <div class="hero-score-badge">
          <span class="hero-score-badge__glow" />
          <div class="hero-score-badge__label">درصد نهایی</div>
          <div class="hero-score-badge__value">{{ resultPercent(session.percent) }}</div>
        </div>
      </div>
    </div>

    <!-- بخش فشرده و شیشه‌ای رتبه‌بندی‌ها -->
    <div
      v-if="primaryClassRanking || primaryLevelRanking"
      class="q-mb-md">
      <div class="glass-section-title q-mb-xs">
        <q-icon
          name="insights"
          size="16px"
          class="text-primary" />
        <span>جایگاه و رتبه کارنامه</span>
      </div>

      <div class="row q-col-gutter-xs items-stretch">
        <!-- رتبه در کلاس -->
        <div
          v-if="primaryClassRanking"
          class="col-6">
          <div class="compact-glass-card compact-glass-card--class">
            <div class="compact-glass-card__top">
              <span class="compact-badge">
                <q-icon
                  name="school"
                  size="12px" />
                کلاس
              </span>
              <div class="compact-rank">
                <span class="compact-rank__hash">#</span>
                <span class="compact-rank__num">{{ primaryClassRanking.rank ?? '-' }}</span>
              </div>
            </div>

            <div
              class="compact-glass-card__name ellipsis"
              :title="primaryClassRanking.class_name">
              {{ primaryClassRanking.class_name }}
            </div>

            <div class="compact-glass-card__footer">
              <span class="text-caption">از {{ primaryClassRanking.total_participants }} شرکت‌کننده</span>
            </div>
          </div>
        </div>

        <!-- رتبه در پایه -->
        <div
          v-if="primaryLevelRanking"
          class="col-6">
          <div class="compact-glass-card compact-glass-card--level">
            <div class="compact-glass-card__top">
              <span class="compact-badge">
                <q-icon
                  name="auto_stories"
                  size="12px" />
                پایه
              </span>
              <div class="compact-rank">
                <span class="compact-rank__hash">#</span>
                <span class="compact-rank__num">{{ primaryLevelRanking.rank ?? '-' }}</span>
              </div>
            </div>

            <div
              class="compact-glass-card__name ellipsis"
              :title="primaryLevelRanking.academic_level_name">
              پایه {{ primaryLevelRanking.academic_level_name }}
            </div>

            <div class="compact-glass-card__footer">
              <span class="text-caption">از {{ primaryLevelRanking.total_participants }} شرکت‌کننده</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- کارت‌های آمار شیشه‌ای رنگی، آب‌نباتی و جذاب (پایان دوران ماست‌بندی! 🎉) -->
    <div class="glass-section-title q-mb-xs">
      <q-icon
        name="analytics"
        size="16px"
        class="text-secondary" />
      <span>تحلیل پاسخ‌ها</span>
    </div>

    <div class="row q-col-gutter-xs items-stretch">
      <div
        v-for="stat in resultStats"
        :key="stat.label"
        class="col-6">
        <div :class="['candy-glass-card', stat.className]">
          <!-- دکوراسیون شیشه‌ای پس‌زمینه کارت -->
          <div class="candy-glass-card__glow" />

          <div class="candy-glass-card__content">
            <div class="candy-glass-card__header">
              <span class="candy-glass-card__label">{{ stat.label }}</span>
              <q-icon
                :name="
                  stat.className.includes('positive') ? 'check_circle' :
                  stat.className.includes('negative') ? 'cancel' :
                  stat.className.includes('time') ? 'schedule' : 'help_outline'
                "
                size="15px"
                class="candy-glass-card__icon" />
            </div>

            <div :class="['candy-glass-card__value', { 'candy-glass-card__value--small': stat.small }]">
              {{ stat.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- نوار شیشه‌ای زمان آزمون -->
    <div class="glass-time-bar q-mt-sm">
      <div class="time-item">
        <span class="time-item__dot time-item__dot--start" />
        <span class="time-item__label">شروع:</span>
        <span class="time-item__val ltr">{{ formatSessionDateTime(session.started_at) }}</span>
      </div>

      <div class="time-item">
        <span class="time-item__dot time-item__dot--end" />
        <span class="time-item__label">پایان:</span>
        <span class="time-item__val ltr">{{ formatSessionDateTime(session.submitted_at) }}</span>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import moment from 'jalali-moment'
import { useDate } from 'src/composables/Date'
import type { OnlineExamAnswerKeyType } from 'src/repositories/exam'
import type {
  OnlineExamSessionType,
  OnlineExamSessionResponseItemType,
  ExamSessionRankingsResponse
} from 'src/repositories/onlineExamSession'

const props = defineProps<{
  session: OnlineExamSessionType;
  rankings: ExamSessionRankingsResponse;
  answerKeys: OnlineExamAnswerKeyType[] | null;
  sessionResponses: OnlineExamSessionResponseItemType[] | null;
  statusLabel: string;
  usedTimeSeconds: number | null;
}>()

const dateManager = useDate()

// استخراج اولین آیتم رتبه کلاس و پایه برای نمایش مستقیم
const primaryClassRanking = computed(() => props.rankings?.classes?.[0] ?? null)
const primaryLevelRanking = computed(() => props.rankings?.levels?.[0] ?? null)

const overallResult = computed(() => {
  const totalQuestions = props.answerKeys?.length ?? null
  const correctAnswers = props.sessionResponses?.filter((key) => key.is_correct).length ?? null
  const incorrectAnswers =
    props.sessionResponses?.filter((key) => !key.is_correct && key.submitted_option).length ?? null
  const answeredQuestions = (correctAnswers ?? 0) + (incorrectAnswers ?? 0)
  const unansweredQuestions = (totalQuestions ?? 0) - answeredQuestions
  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions
  }
})

const resultStats = computed(() => [
  {
    label: 'پاسخ صحیح',
    value: resultValue(overallResult.value.correctAnswers),
    className: 'result-stat-card--positive'
  },
  {
    label: 'پاسخ غلط',
    value: resultValue(overallResult.value.incorrectAnswers),
    className: 'result-stat-card--negative'
  },
  {
    label: 'بی‌پاسخ',
    value: resultValue(overallResult.value.unansweredQuestions),
    className: 'result-stat-card--neutral'
  },
  {
    label: 'زمان مصرف‌شده',
    value: `${formattedUsedTime.value} دقیقه`,
    small: true,
    className: 'result-stat-card--time'
  }
])

const formattedUsedTime = computed(() => dateManager.formatSeconds(props.usedTimeSeconds))

function resultValue (value: number | null | undefined, fallback = '-') {
  return value ?? fallback
}

function resultPercent (value: number | null | undefined) {
  return value != null ? `${value}٪` : '-'
}

function rankDisplay (rank: number | null | undefined) {
  return rank != null ? `#${rank}` : 'تعیین نشده'
}

function formatSessionDateTime (value: string | null | undefined) {
  if (!value) return '-'
  return moment(value).locale('fa').format('jYYYY/jMM/jDD HH:mm:ss')
}
</script>

<style scoped lang="scss">
.exam-overall-container {
  background: transparent;
}

/* عنوان‌های بخش */
.glass-section-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 800;
  color: #334155;
}

/* بنر هدر */
.glass-hero-banner {
  position: relative;
  overflow: hidden;
  padding: 12px 14px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(238, 242, 255, 0.75) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px -6px rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.9);

  &__deco-circle {
    position: absolute;
    width: 110px;
    height: 110px;
    top: -40px;
    left: -20px;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }
}

.hero-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #1e1b4b;

  &__icon {
    color: #f59e0b;
    filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.35));
  }
}

.hero-subtitle {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.hero-pill {
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  padding: 1px 6px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 10.5px;
}

.hero-score-badge {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  color: #fff;
  box-shadow: 0 6px 16px -2px rgba(79, 70, 229, 0.45);

  &__glow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4), transparent 70%);
    pointer-events: none;
  }

  &__label {
    font-size: 9px;
    opacity: 0.9;
    font-weight: 600;
  }

  &__value {
    font-size: 17px;
    font-weight: 900;
    line-height: 1.15;
  }
}

/* کارت‌های رتبه فشرده */
.compact-glass-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1.5px);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .compact-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 6px;
  }

  .compact-rank {
    display: flex;
    align-items: baseline;
    gap: 1px;

    &__hash {
      font-size: 11px;
      font-weight: 800;
      opacity: 0.7;
    }

    &__num {
      font-size: 17px;
      font-weight: 900;
      line-height: 1;
    }
  }

  &__name {
    font-size: 11px;
    font-weight: 700;
    color: #1e293b;
    margin: 4px 0 2px;
  }

  &__footer {
    font-size: 9.5px;
    color: #64748b;
  }

  &--class {
    background: linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(255, 255, 255, 0.9) 100%);
    border: 1px solid rgba(199, 210, 254, 0.85);

    .compact-badge {
      background: rgba(99, 102, 241, 0.15);
      color: #4338ca;
    }

    .compact-rank {
      color: #4338ca;
    }
  }

  &--level {
    background: linear-gradient(135deg, rgba(250, 245, 255, 0.85) 0%, rgba(255, 255, 255, 0.9) 100%);
    border: 1px solid rgba(233, 213, 255, 0.85);

    .compact-badge {
      background: rgba(168, 85, 247, 0.15);
      color: #7e22ce;
    }

    .compact-rank {
      color: #7e22ce;
    }
  }
}

/* ========================================================
   کارت‌های آب‌نباتی و شیشه‌ای تحلیل پاسخ‌ها (Candy Glass Cards)
   ======================================================== */
.candy-glass-card {
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 8px 10px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid transparent;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }

  &__glow {
    position: absolute;
    width: 60px;
    height: 60px;
    top: -20px;
    left: -20px;
    border-radius: 50%;
    opacity: 0.6;
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    font-size: 10.5px;
    font-weight: 700;
  }

  &__icon {
    opacity: 0.7;
  }

  &__value {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 900;
    line-height: 1.1;

    &--small {
      font-size: 13.5px;
      font-weight: 800;
    }
  }

  /* ۱. پاسخ صحیح: سبز نئونی و باطراوت */
  &.result-stat-card--positive {
    background: linear-gradient(135deg, rgba(220, 252, 231, 0.85) 0%, rgba(240, 253, 244, 0.65) 100%);
    border-color: rgba(134, 239, 172, 0.8);
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.1);

    .candy-glass-card__glow {
      background: radial-gradient(circle, #86efac 0%, transparent 70%);
    }
    .candy-glass-card__label,
    .candy-glass-card__icon {
      color: #166534;
    }
    .candy-glass-card__value {
      color: #15803d;
    }
  }

  /* ۲. پاسخ غلط: قرمز / صورتی مرجانی شیشه‌ای */
  &.result-stat-card--negative {
    background: linear-gradient(135deg, rgba(254, 226, 226, 0.85) 0%, rgba(254, 242, 242, 0.65) 100%);
    border-color: rgba(252, 165, 165, 0.8);
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.1);

    .candy-glass-card__glow {
      background: radial-gradient(circle, #fca5a5 0%, transparent 70%);
    }
    .candy-glass-card__label,
    .candy-glass-card__icon {
      color: #991b1b;
    }
    .candy-glass-card__value {
      color: #b91c1c;
    }
  }

  /* ۳. بی‌پاسخ: آبی اقیانوسی کریستالی */
  &.result-stat-card--neutral {
    background: linear-gradient(135deg, rgba(224, 242, 254, 0.85) 0%, rgba(240, 249, 255, 0.65) 100%);
    border-color: rgba(147, 197, 253, 0.8);
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.1);

    .candy-glass-card__glow {
      background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
    }
    .candy-glass-card__label,
    .candy-glass-card__icon {
      color: #075985;
    }
    .candy-glass-card__value {
      color: #0284c7;
    }
  }

  /* ۴. زمان مصرف‌شده: کهربایی طلایی گرم و جذاب */
  &.result-stat-card--time {
    background: linear-gradient(135deg, rgba(254, 243, 199, 0.85) 0%, rgba(255, 251, 235, 0.65) 100%);
    border-color: rgba(252, 211, 77, 0.8);
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.1);

    .candy-glass-card__glow {
      background: radial-gradient(circle, #fcd34d 0%, transparent 70%);
    }
    .candy-glass-card__label,
    .candy-glass-card__icon {
      color: #92400e;
    }
    .candy-glass-card__value {
      color: #d97706;
    }
  }
}

/* نوار شیشه‌ای زمان‌ها */
.glass-time-bar {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px dashed rgba(203, 213, 225, 0.8);

  .time-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    gap: 4px;

    &__dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      &--start { background: #22c55e; }
      &--end { background: #ef4444; }
    }

    &__label {
      color: #64748b;
      font-weight: 600;
    }

    &__val {
      color: #334155;
      font-weight: 700;
    }
  }
}
</style>
