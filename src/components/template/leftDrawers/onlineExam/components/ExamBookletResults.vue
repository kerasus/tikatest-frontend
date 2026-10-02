<template>
  <q-card-section
    v-if="results.length"
    class="q-pt-md">
    <q-separator class="q-mb-md" />

    <div class="text-subtitle1 text-weight-bold q-mb-md">
      نتیجه به تفکیک دفترچه
    </div>

    <div class="column q-gutter-md">
      <q-card
        v-for="result in results"
        :key="result.id"
        flat
        bordered
        class="booklet-result-card">
        <q-card-section class="q-pb-sm">
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-weight-bold">
                {{ getBookletTitle(result) }}
              </div>

              <div
                v-if="getBookletSubtitle(result)"
                class="text-caption text-grey-7 q-mt-xs">
                {{ getBookletSubtitle(result) }}
              </div>
            </div>

            <q-chip
              color="info"
              text-color="white">
              {{ resultPercent(result.percent) }}
            </q-chip>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div
              v-for="stat in getResultStats(result)"
              :key="stat.label"
              class="col-6">
              <div :class="['result-stat-card', stat.className]">
                <div class="result-stat-card__label">{{ stat.label }}</div>
                <div class="result-stat-card__value">{{ stat.value }}</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section
          v-if="hasRank(result)"
          class="q-pt-none">
          <q-separator class="q-mb-sm" />

          <div class="row q-col-gutter-sm text-caption">
            <div
              v-if="result.rank_in_lesson != null"
              class="col-4">
              <div class="text-grey-7">رتبه درس</div>
              <div class="text-subtitle2">{{ result.rank_in_lesson }}</div>
            </div>

            <div
              v-if="result.rank_in_booklet != null"
              class="col-4">
              <div class="text-grey-7">رتبه دفترچه</div>
              <div class="text-subtitle2">{{ result.rank_in_booklet }}</div>
            </div>

            <div
              v-if="result.rank_in_exam != null"
              class="col-4">
              <div class="text-grey-7">رتبه آزمون</div>
              <div class="text-subtitle2">{{ result.rank_in_exam }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import type { BookletType } from 'src/repositories/exam'
import type { OnlineExamSessionResultType } from 'src/repositories/onlineExamSession'

const props = defineProps<{
  results: OnlineExamSessionResultType[]
  booklets: BookletType[]
}>()

function getBookletOfOnlineExamSessionResult (result: OnlineExamSessionResultType): BookletType | null {
  const bookletId = result.online_exam_booklet_id
  if (!bookletId) return null
  const booklet = props.booklets.find((booklet) => booklet.id === bookletId)
  if (!booklet) return null
  return booklet
}

function getBookletTitle (result: OnlineExamSessionResultType) {
  const emptyTitle = 'دفترچه'
  const booklet = getBookletOfOnlineExamSessionResult(result)
  if (!booklet) return emptyTitle
  return booklet.title ?? emptyTitle
}

function getBookletSubtitle (result: OnlineExamSessionResultType) {
  const booklet = getBookletOfOnlineExamSessionResult(result)

  if (!booklet) return result.lesson?.name ?? ''

  const range = [booklet.from_question, booklet.to_question]
    .filter((value) => value != null)
    .join(' تا ')
  const lessonName = result.lesson?.name ?? booklet.lesson?.name

  if (range && lessonName) return `سوال ${range} • ${lessonName}`
  if (range) return `سوال ${range}`
  return lessonName ?? ''
}

function getResultStats (result: OnlineExamSessionResultType) {
  return [
    // { label: 'نمره', value: resultValue(result.raw_score, '۰') },
    // { label: 'درصد', value: resultPercent(result.percent) },
    {
      label: 'صحیح',
      value: resultValue(result.correct_count, '۰'),
      className: 'result-stat-card--positive'
    },
    {
      label: 'غلط',
      value: resultValue(result.wrong_count, '۰'),
      className: 'result-stat-card--negative'
    },
    { label: 'بی‌پاسخ', value: resultValue(result.unanswered_count, '۰') },
    { label: 'تعداد سوال', value: resultValue(result.question_count, '۰') }
  ]
}

function hasRank (result: OnlineExamSessionResultType) {
  return result.rank_in_lesson != null ||
    result.rank_in_booklet != null ||
    result.rank_in_exam != null
}

function resultValue (value: number | null | undefined, fallback = '-') {
  return value ?? fallback
}

function resultPercent (value: number | null | undefined) {
  return value != null ? `${value}٪` : '-'
}

function getPercentClass (percent: number | null | undefined) {
  if (percent == null) return 'percent-chip--neutral'
  if (percent >= 60) return 'percent-chip--positive'
  if (percent >= 35) return 'percent-chip--warning'
  return 'percent-chip--negative'
}

</script>

<style scoped lang="scss">
.booklet-result-card {
  border-radius: 10px;
}

.result-stat-card {
  height: 100%;
  padding: $space-2;
  border: 1px solid $grey-4;
  border-radius: 8px;
  background: $grey-1;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  gap: 4px;

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
    font-size: 18px;
    font-weight: 700;
  }
}
</style>
