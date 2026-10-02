<template>
  <q-card-section class="q-pb-none">
    <div class="text-subtitle1 text-weight-bold q-mb-md flex justify-between">
      <div>
        <div class="text-subtitle2 text-weight-bold">
          نتیجه کل آزمون
        </div>

        <div class="text-caption text-grey-7 q-mt-xs">
          {{ overallResult.totalQuestions }}
          سوال
        </div>
      </div>
      <q-chip
        color="info"
        text-color="white">
        {{ resultPercent(session.percent) }}
      </q-chip>
    </div>

    <div class="row q-col-gutter-sm">
      <div
        v-for="stat in resultStats"
        :key="stat.label"
        class="col-6">
        <div :class="['result-stat-card', stat.className]">
          <div class="result-stat-card__label">
            {{ stat.label }}
          </div>
          <div :class="['result-stat-card__value', { 'result-stat-card__value--small': stat.small }]">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-sm text-caption">
      <div class="col-6">
        <div class="text-grey-7">شروع</div>
        <div class="text-subtitle2 ltr">{{ formatSessionDateTime(session.started_at) }}</div>
      </div>

      <div class="col-6">
        <div class="text-grey-7">پایان</div>
        <div class="text-subtitle2 ltr">{{ formatSessionDateTime(session.submitted_at) }}</div>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import moment from 'jalali-moment'
import { useDate } from 'src/composables/Date'
import type { OnlineExamAnswerKeyType } from 'src/repositories/exam'
import type { OnlineExamSessionType, OnlineExamSessionResponseItemType } from 'src/repositories/onlineExamSession'

const props = defineProps<{
  session: OnlineExamSessionType
  answerKeys: OnlineExamAnswerKeyType[] | null
  sessionResponses: OnlineExamSessionResponseItemType[] | null
  statusLabel: string
  usedTimeSeconds: number | null
}>()

const dateManager = useDate()

const overallResult = computed(() => ({
  totalQuestions: props.answerKeys?.length ?? null,
  answeredQuestions: props.sessionResponses?.length ?? null,
  correctAnswers: props.sessionResponses?.filter((key) => key.is_correct).length ?? null,
  incorrectAnswers: props.sessionResponses?.filter((key) => !key.is_correct && key.submitted_option).length ?? null,
  unansweredQuestions: props.sessionResponses?.filter((key) => !key.submitted_option).length ?? null
}))

const resultStats = computed(() => [
  // { label: 'نمره کل', value: resultValue(props.session.t_score, '۰') },
  // { label: 'درصد کل', value: resultPercent(props.session.percent) },
  // { label: 'تعداد سوال', value: resultValue(overallResult.value.totalQuestions) },
  // { label: 'پاسخ‌داده‌شده', value: resultValue(overallResult.value.answeredQuestions) },
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
  { label: 'بی‌پاسخ', value: resultValue(overallResult.value.unansweredQuestions) },
  // { label: 'وضعیت', value: props.statusLabel, small: true }
  // { label: 'زمان مصرف‌شده', value: `${props.usedTimeSeconds ?? 0} ثانیه `, small: true }
  {
    label: 'زمان مصرف‌شده',
    value: `${formattedUsedTime.value} دقیقه`, // یا اگر می‌خوای فقط mm:ss باشه، فقط ${formattedUsedTime.value} بذار
    small: true
  }

])

// فرض بر این است که props.usedTimeSeconds از قبل در setup وجود دارد
const formattedUsedTime = computed(() => dateManager.formatSeconds(props.usedTimeSeconds))


function resultValue (value: number | null | undefined, fallback = '-') {
  return value ?? fallback
}

function resultPercent (value: number | null | undefined) {
  return value != null ? `${value}٪` : '-'
}

function formatSessionDateTime (value: string | null | undefined) {
  if (!value) return '-'
  return moment(value).locale('fa').format('jYYYY/jMM/jDD HH:mm:ss')
}
</script>

<style scoped lang="scss">
.result-stat-card {
  height: 100%;
  padding: 10px;
  border: 1px solid $grey-4;
  border-radius: 8px;
  background: $grey-1;

  &--positive {
    border-color: rgba($positive, 0.35);
    background: rgba($positive, 0.08);
  }

  &--negative {
    border-color: rgba($negative, 0.35);
    background: rgba($negative, 0.08);
  }

  &__label {
    color: $grey-7;
    font-size: 12px;
  }

  &__value {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 700;

    &--small {
      font-size: 14px;
    }
  }
}
</style>
