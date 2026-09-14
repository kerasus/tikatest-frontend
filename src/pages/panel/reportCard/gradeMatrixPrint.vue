<template>
  <div class="print-page">
    <div
      v-if="!reportData"
      class="text-center q-pa-xl">
      <q-icon
        name="grid_on"
        size="80px"
        color="grey-4" />
      <p class="text-subtitle1 q-mt-md text-grey">هیچ ماتریسی یافت نشد.</p>
      <q-btn
        color="primary"
        label="بازگشت"
        icon="arrow_back"
        class="q-mt-md"
        @click="goBack" />
    </div>

    <div
      v-else
      class="print-container">
      <!-- دکمه‌های عملیات (در پرینت مخفی می‌شوند) -->
      <div class="print-actions q-mb-md row justify-between items-center no-wrap">
        <div>
          <q-btn
            color="primary"
            label="چاپ گزارش"
            icon="print"
            :loading="isPreparingPrint"
            @click="printReport" />
          <q-btn
            flat
            label="بازگشت"
            icon="arrow_back"
            class="q-ml-sm"
            @click="goBack" />
        </div>
        <div class="text-grey-7 text-caption">تاریخ گزارش: {{ currentDateShamsi }}</div>
      </div>

      <div class="matrix-container">
        <!-- هدر مینیمال و شیک گزارش -->
        <header-type5
          :school="reportData.school"
          :title="formSettings.title"
          :term-name="reportData.term?.name"
          :class-name="reportData.class?.name" />


        <!-- کارت‌های آماره کلی -->
        <div class="stats-section q-mb-md row q-col-gutter-sm">
          <div class="col-4">
            <q-card class="mini-card card-blue">
              <q-card-section class="q-pa-sm text-center">
                <div class="text-caption text-blue-9 font-bold">میانگین کل کلاس</div>
                <div class="text-h6 text-blue-10 q-mt-xs">{{ reportData.class_avg ? formatScore(reportData.class_avg) : '-' }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-4">
            <q-card class="mini-card card-green">
              <q-card-section class="q-pa-sm text-center">
                <div class="text-caption text-green-9 font-bold">بالاترین نمره کلاس</div>
                <div class="text-h6 text-green-10 q-mt-xs">{{ getOverallMax() ?? '-' }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-4">
            <q-card class="mini-card card-red">
              <q-card-section class="q-pa-sm text-center">
                <div class="text-caption text-red-9 font-bold">پایین‌ترین نمره کلاس</div>
                <div class="text-h6 text-red-10 q-mt-xs">{{ getOverallMin() ?? '-' }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- جدول ماتریس نمرات -->
        <div class="matrix-table q-mb-md">
          <q-table
            :rows="matrixRows"
            :columns="matrixColumns"
            row-key="student_id"
            dense
            bordered
            flat
            separator="cell"
            :rows-per-page-options="[0]"
            class="compact-table grade-matrix-table"
            hide-bottom>
            <template #header-cell="props">
              <q-th
                :props="props"
                :class="{ 'exam-header-th': props.col.name.startsWith('exam_') }">
                <template v-if="props.col.name.startsWith('exam_')">
                  <div class="vertical-header-content">
                    <span class="exam-title-text">{{ props.col.exam?.name }}</span>
                    <span class="exam-date-text">{{ formatJalaliDate(props.col.exam?.held_at) }}</span>
                  </div>
                </template>
                <template v-else>
                  <span class="standard-header-text">{{ props.col.label }}</span>
                </template>
              </q-th>
            </template>
            <template #body-cell-avg_score="props">
              <q-td class="bg-yellow-1 text-weight-bold text-center font-mono">
                {{ formatScore(props.row.avg_score) }}
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- نمودار مقایسه‌ای -->
        <div class="chart-section q-mb-md">
          <div class="text-subtitle2 text-weight-bold q-mb-xs flex items-center">
            <q-icon
              name="show_chart"
              class="q-ml-xs text-primary"
              size="18px" />
            نمودار مقایسه‌ای آزمون‌ها (بیشترین، میانگین، کمترین)
          </div>
          <div class="chart-container">
            <v-chart
              :option="buildExamComparisonChart()"
              :autoresize="true"
              style="width: 270mm; height: 50mm" />
          </div>
        </div>

        <!-- جدول آماره آزمون‌ها -->
        <div class="exam-stats">
          <div class="text-subtitle2 text-weight-bold q-mb-xs flex items-center">
            <q-icon
              name="analytics"
              class="q-ml-xs text-primary"
              size="18px" />
            آماره تفصیلی آزمون‌ها
          </div>
          <q-table
            :rows="mergedExamStats"
            :columns="examStatsColumns"
            row-key="exam_id"
            dense
            bordered
            flat
            separator="cell"
            :rows-per-page-options="[0]"
            hide-bottom
            class="compact-table" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import HeaderType5 from 'src/components/reportCard/gradeMatrix/headers/type5.vue'

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const $q = useQuasar()
const router = useRouter()
const reportCardStore = useReportCardStore()

const isPreparingPrint = ref(false)

const reportData = computed(() => reportCardStore.reportCards)
const formSettings = computed(() => reportCardStore.formSettings)

const toPersianDigits = (n: string | number | null | undefined): string => {
  if (n === null || n === undefined || n === '') return '-'
  return n.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])
}

const formatScore = (val: number | string | null | undefined): string => {
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return '-'
  const num = typeof val === 'number' ? val : parseFloat(val)
  return Number.isInteger(num) ? toPersianDigits(num) : toPersianDigits(num.toFixed(2))
}

const currentDateShamsi = computed(() => {
  return new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
})

// تابع کمکی برای تبدیل تاریخ به شمسی
const formatJalaliDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const matrixColumns = computed<QTableColumn[]>(() => {
  if (!reportData.value) return []
  const cols: QTableColumn[] = [
    {
      name: 'full_name',
      label: 'نام و نام خانوادگی',
      field: (row) => (row.first_name ?? '') + ' ' + (row.last_name ?? ''),
      align: 'left',
      style: 'min-width: 130px; width: 140px;'
    }
  ]
  reportData.value.exams.forEach((exam, idx) => {
    cols.push({
      name: `exam_${exam.id}`,
      label: exam.name,
      field: `scores.${idx}`,
      // @ts-ignore
      exam,
      align: 'center'
    })
  })
  cols.push({
    name: 'avg_score',
    label: 'میانگین',
    field: 'avg_score',
    align: 'center',
    style: 'min-width: 70px'
  })
  return cols
})

const matrixRows = computed(() => {
  if (!reportData.value) return []
  return reportData.value.students.map((s) => ({
    student_id: s.id,
    first_name: s.first_name,
    last_name: s.last_name,
    ...Object.fromEntries(s.scores.map((score, idx) => [`scores.${idx}`, formatScore(score)])),
    avg_score: s.avg_score
  }))
})

// ادغام تاریخ آزمون با آماره آزمون
const mergedExamStats = computed(() => {
  if (!reportData.value) return []
  return reportData.value.exam_stats.map((stat, idx) => {
    const exam = reportData.value!.exams[idx]
    return {
      ...stat,
      held_at: exam?.held_at ?? null
    }
  })
})

const examStatsColumns: QTableColumn[] = [
  {
    name: 'exam_name',
    label: 'عنوان آزمون',
    field: 'exam_name',
    align: 'left',
    style: 'min-width: 150px'
  },
  {
    name: 'held_at',
    label: 'تاریخ',
    field: (row: any) => formatJalaliDate(row.held_at),
    align: 'left',
    style: 'min-width: 100px'
  },
  {
    name: 'category',
    label: 'دسته‌بندی',
    field: 'category',
    align: 'left',
    style: 'min-width: 100px'
  },
  {
    name: 'max_score',
    label: 'بیشترین',
    field: (row) => formatScore(row.max_score),
    align: 'center',
    style: 'min-width: 80px'
  },
  {
    name: 'avg_score',
    label: 'میانگین',
    field: (row) => formatScore(row.avg_score),
    align: 'center',
    style: 'min-width: 80px'
  },
  {
    name: 'min_score',
    label: 'کمترین',
    field: (row) => formatScore(row.min_score),
    align: 'center',
    style: 'min-width: 80px'
  }
]

function getOverallMax (): string | null {
  if (!reportData.value) return null
  const maxes = reportData.value.exam_stats
    .map((e) => e.max_score)
    .filter((s) => s !== null) as number[]
  return maxes.length > 0 ? formatScore(Math.max(...maxes)) : null
}

function getOverallMin (): string | null {
  if (!reportData.value) return null
  const mins = reportData.value.exam_stats
    .map((e) => e.min_score)
    .filter((s) => s !== null) as number[]
  return mins.length > 0 ? formatScore(Math.min(...mins)) : null
}

function buildExamComparisonChart () {
  if (!reportData.value) return {}

  const exams = reportData.value.exams
  const stats = reportData.value.exam_stats

  const xCategories = exams.map((e) => e.name)
  const maxData = stats.map((s) => s.max_score ?? 0)
  const minData = stats.map((s) => s.min_score ?? 0)
  const avgData = stats.map((s) => s.avg_score ?? 0)

  const fmt = (val: number) => Math.round(val)

  return {
    animation: false,
    title: {
      text: 'نمودار مقایسه نمرات آزمون‌ها',
      left: 'center',
      top: 2,
      textStyle: { fontSize: 13, fontFamily: 'inherit', fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        let result =
          '<div style="direction: rtl; text-align: right; min-width: 140px; font-family: inherit; font-size: 11px;">'
        result += `<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; font-size: 12px;">${params[0].axisValue}</div>`
        params.forEach((item: any) => {
          const rawVal = typeof item.value === 'number' ? item.value : parseFloat(item.value || 0)
          const formattedVal = fmt(rawVal).toLocaleString('fa-IR')
          result += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0;">
              <span style="display: inline-flex; align-items: center; gap: 6px;">
                ${item.marker}
                <span>${item.seriesName}</span>
              </span>
              <span style="font-weight: bold; direction: ltr; margin-left: 8px;">${formattedVal}</span>
            </div>
          `
        })
        result += '</div>'
        return result
      }
    },
    legend: {
      data: ['بیشترین', 'میانگین', 'کمترین'],
      bottom: 0,
      textStyle: { fontSize: 11, fontFamily: 'inherit' },
      itemWidth: 16,
      itemHeight: 8
    },
    grid: {
      left: '2%',
      right: '2%',
      top: 35,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xCategories,
      axisLabel: {
        fontSize: 10,
        fontFamily: 'inherit',
        interval: 0,
        rotate: xCategories.length > 5 ? 25 : 0
      },
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: (value: { min: number }) => Math.max(0, Math.floor(value.min - 1)),
      max: (value: { max: number }) => Math.min(20, Math.ceil(value.max + 1)),
      axisLabel: {
        fontSize: 10,
        fontFamily: 'inherit',
        formatter: (val: number) => Math.round(val).toLocaleString('fa-IR')
      },
      splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
    },
    series: [
      {
        name: 'بیشترین',
        type: 'line',
        smooth: 0.2,
        symbol: 'triangle',
        symbolSize: 6,
        data: maxData,
        itemStyle: { color: '#00d807' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#00d807' }
      },
      {
        name: 'میانگین',
        type: 'line',
        smooth: 0.2,
        symbol: 'circle',
        symbolSize: 6,
        data: avgData,
        itemStyle: { color: '#3598ff' },
        lineStyle: { width: 2, type: 'solid', color: '#3598ff' },
        label: {
          show: true,
          position: 'top',
          fontSize: 9,
          fontFamily: 'inherit',
          formatter: (p: any) => fmt(p.value).toLocaleString('fa-IR')
        }
      },
      {
        name: 'کمترین',
        type: 'line',
        smooth: 0.2,
        symbol: 'rect',
        symbolSize: 6,
        data: minData,
        itemStyle: { color: '#d32f2f' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#d32f2f' }
      }
    ]
  }
}

function goBack () {
  router.back()
}

function printReport () {
  isPreparingPrint.value = true

  // اجازه می‌دهیم Vue و ECharts چرخه رندر را در DOM تثبیت کنند
  nextTick(() => {
    setTimeout(() => {
      isPreparingPrint.value = false
      setTimeout(() => {
        nextTick(() => {
          window.print()
        })
      }, 300)
    }, 800)
  })
}
</script>

<style lang="scss" scoped>
.print-page {
  padding: 12px;
  max-width: 100%;
  font-family: 'Vazirmatn', 'IRANSans', Tahoma, sans-serif;
}

.print-container {
  background: #fff;
}

.print-actions {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* ─── هدر گزارش ─── */
.report-header-compact {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 14px 10px 14px;
  overflow: hidden;
  direction: rtl;
}

.color-ribbon {
  height: 4px;
  margin: 0 -14px 8px -14px;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
  width: calc(100% + 28px);
}

.main-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
}

.school-block,
.info-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-block {
  justify-content: flex-end;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid currentColor;
}

.school-text {
  display: flex;
  flex-direction: column;
  .label {
    font-size: 9px;
    font-weight: 600;
    color: #6b7280;
  }
  .name {
    margin: 1px 0 0 0;
    font-size: 13px;
    font-weight: 800;
    color: #111827;
  }
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  .info-label {
    color: #6b7280;
    font-size: 10px;
  }
  .info-value {
    color: #111827;
  }
}

.title-block {
  text-align: center;
  padding: 4px 18px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 8px;
  border: 1px dashed #d1d5db;

  .title-sub {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #111827;
  }
  .title-year {
    font-size: 10px;
    font-weight: 600;
    color: #6b7280;
  }
}

/* ─── کارت‌های آماره ─── */
.mini-card {
  border-radius: 6px;
  border: 1px solid;

  &.card-blue {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
  &.card-green {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }
  &.card-red {
    background: #fef2f2;
    border-color: #fecaca;
  }
}

/* ─── استایل جداول و عناوین عمودی ─── */
.compact-table {
  border-radius: 6px;

  :deep(.q-table__top),
  :deep(.q-table__bottom) {
    display: none;
  }

  :deep(tbody tr td) {
    font-size: 10.5px !important;
    font-weight: 500;
    color: #374151;
    height: 22px !important;
    padding: 2px 3px !important;
    border-color: #e5e7eb !important;
  }
}

/* ماتریس نمرات: ارتفاع هدر بیشتر + عرض ستون‌های آزمون بسیار باریک */
.grade-matrix-table {
  :deep(thead tr th) {
    height: 90px !important;
    padding: 2px !important;
    vertical-align: bottom;
    background-color: #f8fafc !important;
    border-color: #cbd5e1 !important;

    &.exam-header-th {
      padding: 4px 0 !important;
      text-align: center;
      /* عرض فیکس و بدون تغییر برای تمام ستون‌های آزمون */
      width: 32px !important;
      min-width: 32px !important;
      max-width: 32px !important;
      position: relative;
      /* اضافه کردن فلکس برای تراز کردن محتوا */
      //display: flex;
      //flex-direction: column;
      //align-items: center;
      //justify-content: flex-end;
    }
  }

  .vertical-header-content {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-end;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin: auto;

    /* مدیریت طول محتوا */
    height: 85px;
    white-space: nowrap;
    overflow: hidden;


    .exam-title-text {
      font-size: 10px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 4px;
    }

    .exam-date-text {
      font-size: 8.5px;
      font-weight: 500;
      color: #64748b;
      letter-spacing: -0.2px;
    }
  }

  .standard-header-text {
    font-size: 11px;
    font-weight: 700;
    color: #1e293b;
  }
}

.chart-container {
  direction: ltr;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  .echarts {
    margin: auto;
  }
}

/* ─── تنظیمات چاپ ─── */
@media print {
  @page {
    size: A4 landscape;
    margin: 6mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    background: #fff !important;
  }

  .print-page {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }

  .print-actions {
    display: none !important;
  }

  .report-header-compact,
  .mini-card,
  .grade-matrix-table,
  .chart-section,
  .exam-stats {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
</style>
