<template>
  <div class="print-page">
    <div
      v-if="!reportData"
      class="text-center q-pa-xl">
      <q-icon
        name="menu_book"
        size="80px"
        color="grey-4" />
      <p class="text-subtitle1 q-mt-md text-grey">هیچ کارنامه‌ای یافت نشد.</p>
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
      <div class="print-actions q-mb-md">
        <q-btn
          color="primary"
          label="چاپ"
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

      <div class="cards-list">
        <div
          v-for="(studentReport, studentIndex) in reportData.students"
          :key="studentReport.student.id"
          class="student-report-card q-mb-xl">

          <header-type5
            v-if="headerType === 5"
            :school="reportData.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="reportData.term?.name"
            :class-name="reportData.class?.name" />

          <q-table
            :rows="studentReport.lessons"
            :columns="lessonColumns"
            row-key="id"
            dense
            bordered
            flat
            separator="cell"
            class="lesson-matrix-table" />

          <!-- بلوک نمودار مقایسه‌ای کارنامه -->
          <div class="report-chart-section">
            <v-chart
              :option="getStudentChartOption(studentReport.lessons)"
              :autoresize="true"
              class="student-echart"
              style="width: 170mm; height: 45mm" />
          </div>

          <div
            v-if="studentIndex < reportData.students.length - 1"
            class="page-break" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { QTableColumn } from 'quasar'
import { useRouter } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import HeaderType5 from 'src/components/reportCard/gradeDetail/headers/type5.vue'
import type { ComprehensiveReportResponse } from 'src/repositories/reportCard'
import HeaderType4 from 'components/reportCard/gradeDetail/headers/type4.vue'

use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const $q = useQuasar()
const router = useRouter()
const reportCardStore = useReportCardStore()

const headerType = ref<number>(5)
const isPreparingPrint = ref(false)

const reportData = computed(() => reportCardStore.comprehensiveReports)
const formSettings = computed(() => reportCardStore.formSettings)

const lessonColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = [
    { name: 'name', label: 'درس', field: 'name', align: 'right' },
    { name: 'coefficient', label: 'ضریب', field: 'coefficient', align: 'center' }
  ]

  if (formSettings.value.show_student_grade !== false) {
    cols.push({
      name: 'student_avg',
      label: 'نمره دانش‌آموز',
      field: 'student_avg',
      align: 'center'
    })
  }
  if (formSettings.value.show_avg_grade !== false) {
    cols.push({ name: 'class_avg', label: 'میانگین', field: 'class_avg', align: 'center' })
  }
  if (formSettings.value.show_max_grade !== false) {
    cols.push({
      name: 'class_max',
      label: 'بیشترین',
      field: 'class_max',
      align: 'center'
    })
  }
  if (formSettings.value.show_min_grade !== false) {
    cols.push({
      name: 'class_min',
      label: 'کمترین',
      field: 'class_min',
      align: 'center'
    })
  }
  if (formSettings.value.show_student_score !== false) {
    cols.push({
      name: 'student_score',
      label: 'تراز دانش‌آموز',
      field: 'student_score',
      align: 'center'
    })
  }
  if (formSettings.value.show_max_score !== false) {
    cols.push({ name: 'max_score', label: 'بیشترین تراز', field: 'max_score', align: 'center' })
  }
  if (formSettings.value.show_min_score !== false) {
    cols.push({ name: 'min_score', label: 'کمترین تراز', field: 'min_score', align: 'center' })
  }

  return cols
})


// تبدیل ارقام به فارسی
const toFarsi = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined || val === '') return '-'
  return val.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])
}

// تابع جنریت آپشن چارت متناسب با هر دانش‌آموز
function getStudentChartOption (lessons: any[]) {
  if (!lessons || lessons.length === 0) return {}


  // مپر امن: undefined، null، '' و NaN رو همه به null تبدیل می‌کنه
  const safeNum = (val: unknown): number | null => {
    const n = Number(val)
    return val !== null && val !== undefined && val !== '' && !Number.isNaN(n) ? n : null
  }

  // اگه ممکنه سرور کلیدهای مختلف بفرسته، fallback هم بذار
  const pick = (l: any, ...keys: string[]) => {
    for (const k of keys) {
      if (l[k] !== undefined && l[k] !== null) return l[k]
    }
    return null
  }

  const lessonNames    = lessons.map((l) => l.name)
  const studentGrades  = lessons.map((l) => safeNum(pick(l, 'student_avg')))
  const classAverages  = lessons.map((l) => safeNum(pick(l, 'class_avg', 'avg')))
  const classMaxGrades = lessons.map((l) => safeNum(pick(l, 'class_max', 'max')))
  const classMinGrades = lessons.map((l) => safeNum(pick(l, 'class_min', 'min')))

  const fmt = (val: number) => Math.round(val)

  return {
    animation: false, // خاموش بودن انیمیشن جهت رندر فوری در حالت پرینت و PDF
    title: {
      text: 'نمودار تحلیل و مقایسه عملکرد دروس با میانگین و رکورد کلاس',
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
      data: ['نمره دانش‌آموز', 'میانگین', 'بالاترین', 'پایین‌ترین'],
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
      data: lessonNames,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#94a3b8' } },
      axisLabel: {
        fontSize: 9.5,
        color: '#1e293b',
        interval: 0,
        rotate: lessonNames.length > 7 ? 20 : 0
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: (value: { min: number }) => Math.max(0, Math.floor(value.min - 1)),
      max: (value: { max: number }) => Math.min(20, Math.ceil(value.max + 1)),
      axisLabel: {
        fontSize: 10,
        fontFamily: 'inherit',
        color: '#64748b',
        formatter: (val: number) => toFarsi(val)
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9', type: 'dashed' }
      }
    },
    series: [
      {
        name: 'نمره دانش‌آموز',
        type: 'bar',
        barMaxWidth: 16,
        itemStyle: {
          color: '#2563eb', // آبی پررنگ شاخص
          borderRadius: [4, 4, 0, 0]
        },
        data: studentGrades,
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#1d4ed8',
          fontWeight: 'bold',
          formatter: (p: any) => fmt(p.value).toLocaleString('fa-IR')
        }
      },
      {
        name: 'میانگین',
        type: 'bar',
        barMaxWidth: 10,
        itemStyle: {
          color: '#60a5fa',
          borderRadius: [3, 3, 0, 0]
        },
        data: classAverages
      },
      {
        name: 'بالاترین',
        type: 'bar',
        barMaxWidth: 8,
        symbol: 'triangle',
        symbolSize: 5,
        itemStyle: {
          color: '#10b981', // آبی ملایم‌تر
          borderRadius: [3, 3, 0, 0]
        },
        data: classMaxGrades
      },
      {
        name: 'پایین‌ترین',
        type: 'bar',
        barMaxWidth: 8,
        itemStyle: {
          color: '#f87171',
          borderRadius: [3, 3, 0, 0]
        },
        data: classMinGrades
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
  max-width: 100%;
}

.print-container {
  background: #fff;
}

.print-actions {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.cards-list {
  margin-top: 0;
}

.student-report-card {
  overflow: hidden;
  background: #fff;
  padding: 12px;
  box-sizing: border-box;
  .echarts {
    margin: auto;
  }
}

.school-header {
  border-bottom: 2px solid #1976d2;
}

.student-info {
  border: 1px solid #b0bec5;
}

.lesson-section {
  border: 1px solid #eeeeee;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  background: #fafafa;
}

.page-break {
  page-break-after: always;
  break-after: page;
}

:deep(.q-table) {
  thead tr th {
    font-size: 13px !important;
    font-weight: 500;
    line-height: 12px;
    letter-spacing: 0.005em;
    text-align: center;
    height: 32px !important;
    padding: 0 4px !important;
  }
  tbody tr td {
    font-size: 11px !important;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.0025em;
    color: #526075;
    text-align: center;
    height: 0px !important;
    padding: 2px 4px !important;
    border-bottom-width: 1px;
  }
}

.report-chart-section {
  direction: ltr;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  margin-top: 10px;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    margin: 0 !important;
  }

  .print-actions {
    display: none !important;
  }

  .print-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  .cards-list {
    margin: 0 !important;
    padding: 0 !important;
  }

  .student-report-card {
    padding: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .student-report-card:not(:last-child) {
    page-break-after: always !important;
    break-after: page !important;
  }

  .lesson-section,
  .report-chart-section,
  table,
  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .matrix-table,
  .sheet-table {
    overflow: visible !important;
  }
}

@page {
  size: A4 portrait;
  margin: 5mm;
}
</style>

