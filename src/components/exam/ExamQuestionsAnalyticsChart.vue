<template>
  <div
    class="exam-questions-analytics"
    dir="rtl">
    <div
      v-if="loading"
      class="state-container">
      <q-spinner-dots
        color="primary"
        size="56px" />
      <div class="q-mt-md">در حال دریافت آمار سوالات...</div>
    </div>

    <div
      v-else-if="errorMessage"
      class="state-container">
      <q-icon
        name="error_outline"
        size="56px"
        color="negative" />
      <div class="text-negative q-mt-md">{{ errorMessage }}</div>
      <q-btn
        class="q-mt-md"
        color="primary"
        icon="refresh"
        label="تلاش مجدد"
        :loading="loading"
        @click="fetchAnalytics" />
    </div>

    <div
      v-else-if="!questions.length"
      class="state-container">
      <q-icon
        name="analytics"
        size="56px"
        color="grey-5" />
      <div class="q-mt-md text-grey-7">داده‌ای برای نمایش وجود ندارد.</div>
    </div>

    <template v-else>
      <q-card
        flat
        bordered
        class="q-mb-lg">
        <q-card-section class="row text-center">
          <div class="col-12 col-sm-4 q-pa-sm">
            <div class="text-caption text-grey-7">تعداد سوالات</div>
            <div class="text-h6 text-primary">
              {{ formatNumber(analyticsData?.total_questions ?? questions.length) }}
            </div>
          </div>

          <div class="col-12 col-sm-4 q-pa-sm">
            <div class="text-caption text-grey-7">شرکت‌کنندگان</div>
            <div class="text-h6 text-secondary">
              {{ formatNumber(analyticsData?.total_participants ?? 0) }}
            </div>
          </div>

          <div class="col-12 col-sm-4 q-pa-sm">
            <div class="text-caption text-grey-7">میانگین پاسخ صحیح</div>
            <div class="text-h6 text-positive">{{ formatNumber(averageCorrectPercentage) }}٪</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        flat
        bordered
        class="q-mb-lg chart-card">
        <q-card-section class="text-subtitle1 text-weight-bold">
          تحلیل پاسخ‌ها به تفکیک سوال
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="chart-wrapper">
            <v-chart
              :option="statusChartOption"
              :init-options="{ renderer: 'svg' }"
              :autoresize="true"
              class="chart" />
          </div>
        </q-card-section>
      </q-card>

      <q-card
        flat
        bordered
        class="chart-card">
        <q-card-section class="text-subtitle1 text-weight-bold">
          تعداد انتخاب گزینه‌ها به تفکیک سوال
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="chart-wrapper">
            <v-chart
              :option="optionsChartOption"
              :init-options="{ renderer: 'svg' }"
              :autoresize="true"
              class="chart" />
          </div>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import OnlineExamSessionAPI, {
  type ExamQuestionsAnalyticsResponseType,
  type QuestionAnalyticsItemType
} from 'src/repositories/onlineExamSession'

const props = defineProps<{
  examId: number | string
}>()

use([
  SVGRenderer,
  BarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent
])

const api = new OnlineExamSessionAPI()

const loading = ref(false)
const errorMessage = ref('')
const analyticsData = ref<ExamQuestionsAnalyticsResponseType | null>(null)

const questions = computed<QuestionAnalyticsItemType[]>(() => {
  return [...(analyticsData.value?.questions ?? [])].sort(
    (a, b) => a.question_number - b.question_number
  )
})

const averageCorrectPercentage = computed(() => {
  if (!questions.value.length) return 0

  const total = questions.value.reduce(
    (sum, question) => sum + (question.correct_percentage ?? 0),
    0
  )

  return Math.round((total / questions.value.length) * 10) / 10
})

function formatNumber (value: number | null | undefined): string {
  return (value ?? 0).toLocaleString('fa-IR')
}

function questionLabel (question: QuestionAnalyticsItemType, index: number): string {
  return `سوال ${formatNumber(question.question_number ?? index + 1)}`
}

const questionLabels = computed(() =>
  questions.value.map((question, index) => questionLabel(question, index))
)

const statusChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    textStyle: { fontFamily: 'inherit' },
    formatter: (params: Array<{
      dataIndex: number
      marker: string
      seriesName: string
      value: number
    }>) => {
      if (!params.length) return ''

      const question = questions.value[params[0].dataIndex]
      const total = question?.total_participants ?? 0

      const rows = params.map((item) => `
        <div style="display:flex;justify-content:space-between;gap:16px;margin-top:4px">
          <span>${item.marker}${item.seriesName}</span>
          <b>${formatNumber(item.value)}</b>
        </div>
      `).join('')

      return `
        <div style="direction:rtl;text-align:right;font-family:inherit">
          <b>${questionLabel(question, params[0].dataIndex)}</b>
          <div style="color:#777;margin-top:4px">شرکت‌کنندگان: ${formatNumber(total)}</div>
          ${rows}
        </div>
      `
    }
  },
  legend: {
    data: ['درست', 'غلط', 'بی‌پاسخ'],
    bottom: 0,
    textStyle: { fontFamily: 'inherit' }
  },
  grid: {
    left: 16,
    right: 20,
    top: 20,
    bottom: 55,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: questionLabels.value,
    axisLabel: {
      interval: 0,
      rotate: questions.value.length > 8 ? 35 : 0,
      fontFamily: 'inherit'
    }
  },
  yAxis: {
    type: 'value',
    name: 'تعداد دانش‌آموز',
    axisLabel: {
      fontFamily: 'inherit',
      formatter: (value: number) => value.toLocaleString('fa-IR')
    }
  },
  series: [
    {
      name: 'درست',
      type: 'bar',
      stack: 'answers',
      barMaxWidth: 40,
      itemStyle: { color: '#22c55e' },
      data: questions.value.map((q) => q.correct_count ?? 0)
    },
    {
      name: 'غلط',
      type: 'bar',
      stack: 'answers',
      barMaxWidth: 40,
      itemStyle: { color: '#ef4444' },
      data: questions.value.map((q) => q.wrong_count ?? 0)
    },
    {
      name: 'بی‌پاسخ',
      type: 'bar',
      stack: 'answers',
      barMaxWidth: 40,
      itemStyle: { color: '#9ca3af' },
      data: questions.value.map((q) => q.unanswered_count ?? 0)
    }
  ]
}))

const optionKeys = computed(() => {
  const keys = new Set<string>()

  for (const question of questions.value) {
    for (const key of Object.keys(question.options_breakdown ?? {})) {
      keys.add(key)
    }
  }

  return [...keys].sort((a, b) => {
    const numberA = Number(a)
    const numberB = Number(b)

    if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
      return numberA - numberB
    }

    return a.localeCompare(b)
  })
})

const optionColors = [
  '#3b82f6',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316'
]

function optionLabel (key: string): string {
  const number = Number(key)
  return Number.isFinite(number)
    ? `گزینه ${number.toLocaleString('fa-IR')}`
    : `گزینه ${key}`
}

const optionsChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    textStyle: { fontFamily: 'inherit' },
    formatter: (params: Array<{
      dataIndex: number
      marker: string
      seriesName: string
      value: number
    }>) => {
      if (!params.length) return ''

      const question = questions.value[params[0].dataIndex]
      const correctOption = question?.correct_option
        ? optionLabel(String(question.correct_option))
        : 'نامشخص'

      const rows = params.map((item) => `
        <div style="display:flex;justify-content:space-between;gap:16px;margin-top:4px">
          <span>${item.marker}${item.seriesName}</span>
          <b>${formatNumber(item.value)}</b>
        </div>
      `).join('')

      return `
        <div style="direction:rtl;text-align:right;font-family:inherit">
          <b>${questionLabel(question, params[0].dataIndex)}</b>
          <div style="color:#16a34a;margin-top:4px">پاسخ صحیح: ${correctOption}</div>
          ${rows}
        </div>
      `
    }
  },
  legend: {
    data: optionKeys.value.map(optionLabel),
    bottom: 0,
    textStyle: { fontFamily: 'inherit' }
  },
  grid: {
    left: 16,
    right: 20,
    top: 20,
    bottom: 55,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: questionLabels.value,
    axisLabel: {
      interval: 0,
      rotate: questions.value.length > 8 ? 35 : 0,
      fontFamily: 'inherit'
    }
  },
  yAxis: {
    type: 'value',
    name: 'تعداد انتخاب',
    axisLabel: {
      fontFamily: 'inherit',
      formatter: (value: number) => value.toLocaleString('fa-IR')
    }
  },
  series: optionKeys.value.map((key, index) => ({
    name: optionLabel(key),
    type: 'bar',
    stack: 'options',
    barMaxWidth: 40,
    itemStyle: { color: optionColors[index % optionColors.length] },
    data: questions.value.map((question) =>
      question.options_breakdown?.[key] ?? 0
    )
  }))
}))

async function fetchAnalytics (): Promise<void> {
  if (!props.examId) {
    analyticsData.value = null
    errorMessage.value = 'شناسه آزمون معتبر نیست.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    analyticsData.value = await api.getExamQuestionsAnalytics(props.examId)
  } catch (error: unknown) {
    console.error('دریافت آمار سوالات آزمون ناموفق بود:', error)

    const err = error as {
      response?: { data?: { message?: string } }
      message?: string
    }

    errorMessage.value =
      err.response?.data?.message ??
      err.message ??
      'خطایی در دریافت آمار رخ داد. دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.examId,
  () => {
    void fetchAnalytics()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.exam-questions-analytics {
  width: 100%;
}

.state-container {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.chart-card {
  border-radius: 10px;
}

.chart-wrapper {
  width: 100%;
  height: 380px;
  direction: ltr;
}

.chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 600px) {
  .chart-wrapper {
    height: 300px;
  }
}
</style>
