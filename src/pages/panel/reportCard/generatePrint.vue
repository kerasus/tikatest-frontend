<template>
  <div class="print-page">
    <div
      v-if="loading"
      class="text-center q-pa-xl">
      <q-spinner
        color="primary"
        size="60px" />
      <p class="q-mt-md text-grey">در حال بارگذاری کارنامه‌ها...</p>
    </div>

    <div
      v-else-if="!reportCards"
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
          @click="printReportCards" />

        <q-btn
          flat
          label="بازگشت"
          icon="arrow_back"
          class="q-ml-sm"
          @click="goBack" />
      </div>

      <div class="cards-list">
        <div
          v-for="(studentReport, studentIndex) in reportCards.students"
          :key="studentReport.student.id"
          class="student-report-card q-mb-xl">
          <!-- هدر آموزشگاه -->
          <header-type1
            v-if="false"
            :school="reportCards.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="reportCards.term?.name"
            :class-name="reportCards.class?.name"
            :academic-year="reportCards.academic_year?.name" />

          <header-type2
            v-if="false"
            :school="reportCards.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="reportCards.term?.name"
            :class-name="reportCards.class?.name"
            :academic-year="reportCards.academic_year?.name" />

          <header-type3
            v-if="true"
            :school="reportCards.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="reportCards.term?.name"
            :class-name="reportCards.class?.name"
            :academic-year="reportCards.academic_year?.name" />

          <header-type4
            v-if="false"
            :school="reportCards.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="reportCards.term?.name"
            :class-name="reportCards.class?.name"
            :academic-year="reportCards.academic_year?.name" />

          <!-- بخش دروس -->
          <div
            v-for="lesson in studentReport.lessons"
            :key="lesson.id"
            class="lesson-section q-mb-lg">
            <div class="row items-center justify-between bg-blue-grey-1 q-pa-xs q-px-sm rounded-borders q-mb-xs">
              <div class="text-subtitle1 font-bold text-blue-grey-9">
                {{ lesson.name }}
                <span class="text-caption text-grey-8">(ضریب: {{ lesson.coefficient }})</span>
              </div>
              <div
                v-if="lesson.results"
                class="text-subtitle2 text-positive">
                میانگین نمره دانش‌آموز در این درس: {{ lesson.results.avg_score }}
              </div>
            </div>

            <!-- جدول ریز نمرات حضوری -->
            <div
              v-if="lesson.in_person_results && lesson.in_person_results.length > 0"
              class="q-mb-md">
              <q-table
                :rows="lesson.in_person_results"
                :columns="dynamicInPersonColumns"
                :rows-per-page-options="[0]"
                row-key="id"
                dense
                bordered
                flat
                separator="cell">
                <template #body-cell-row_number="props">
                  <q-td>{{ props.rowIndex + 1 }}</q-td>
                </template>
              </q-table>
            </div>

            <!-- جدول آزمون‌های آنلاین -->
            <div
              v-if="lesson.online_results && lesson.online_results.length > 0"
              class="q-mb-md">
              <q-table
                :rows="lesson.online_results"
                :columns="dynamicOnlineColumns"
                :rows-per-page-options="[0]"
                row-key="id"
                dense
                bordered
                flat
                separator="cell" />
            </div>

            <!-- نمودار نمرات آزمون‌های این درس -->
            <div
              v-if="formSettings.show_grade_chart"
              class="chart-container q-mt-sm">
              <v-chart
                :option="buildLessonGradeChart(lesson)"
                :init-options="{ renderer: 'svg' }"
                :autoresize="true"
                style="width: 1100px; height: 260px" />
            </div>

            <!-- نمودار تراز آزمون‌های این درس -->
            <div
              v-if="formSettings.show_taraz_chart"
              class="chart-container q-mt-sm">
              <v-chart
                :option="buildLessonTarazChart(lesson)"
                :init-options="{ renderer: 'svg' }"
                :autoresize="true"
                style="width: 1100px; height: 260px" />
            </div>
          </div>

          <!-- صفحه‌break بین کارنامه‌ها -->
          <div
            v-if="studentIndex < reportCards.students.length - 1"
            class="page-break" />
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
import { SVGRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import HeaderType1 from 'src/components/reportCard/gradeDetail/headers/type1.vue'
import HeaderType2 from 'src/components/reportCard/gradeDetail/headers/type2.vue'
import HeaderType3 from 'src/components/reportCard/gradeDetail/headers/type3.vue'
import HeaderType4 from 'src/components/reportCard/gradeDetail/headers/type4.vue'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  SVGRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

import { useRouter, useRoute } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import { useDate } from 'src/composables/Date'
import type { ReportCardLesson } from 'src/repositories/reportCard'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const dateManager = useDate()
const reportCardStore = useReportCardStore()

const loading = ref(false)
const isPreparingPrint = ref(false)
const reportCards = computed(() => reportCardStore.reportCards)
const formSettings = computed(() => reportCardStore.formSettings)

const dynamicInPersonColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = []

  if (formSettings.value.show_exam_row_number) {
    cols.push({
      name: 'row_number',
      label: '#',
      field: '#',
      align: 'center'
    })
  }
  cols.push({ name: 'category', label: 'دسته‌بندی', field: 'category', align: 'left' })

  if (formSettings.value.show_exam_dates) {
    cols.push({
      name: 'held_at',
      label: 'تاریخ',
      field: (row) => (row.held_at ? dateManager.isoToLocalShamsiDate(row.held_at) : '-'),
      align: 'center'
    })
  }

  if (formSettings.value.show_exam_titles) {
    cols.push({ name: 'exam_name', label: 'عنوان آزمون', field: 'exam_name', align: 'left' })
  }

  if (formSettings.value.show_student_grade) {
    cols.push({
      name: 'student_grade',
      label: 'نمره دانش‌آموز',
      field: 'student_grade',
      align: 'center'
    })
  }

  if (formSettings.value.show_avg_grade) {
    cols.push({ name: 'avg_grade', label: 'میانگین کلاس', field: 'avg_grade', align: 'center' })
  }

  if (formSettings.value.show_max_grade) {
    cols.push({ name: 'max_grade', label: 'بیشترین نمره', field: 'max_grade', align: 'center' })
  }

  if (formSettings.value.show_min_grade) {
    cols.push({ name: 'min_grade', label: 'کمترین نمره', field: 'min_grade', align: 'center' })
  }

  if (formSettings.value.show_student_score) {
    cols.push({
      name: 'student_score',
      label: 'تراز دانش‌آموز',
      field: 'student_score',
      align: 'center'
    })
  }

  if (formSettings.value.show_max_score) {
    cols.push({ name: 'max_score', label: 'بیشترین تراز', field: 'max_score', align: 'center' })
  }

  if (formSettings.value.show_min_score) {
    cols.push({ name: 'min_score', label: 'کمترین تراز', field: 'min_score', align: 'center' })
  }

  return cols
})

const dynamicOnlineColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = []

  if (formSettings.value.show_exam_row_number) {
    cols.push({
      name: 'row_number',
      label: '#',
      field: '#',
      align: 'center'
    })
  }
  cols.push({ name: 'booklet_title', label: 'دفترچه', field: 'booklet_title', align: 'left' })

  if (formSettings.value.show_exam_dates) {
    cols.push({
      name: 'held_at',
      label: 'تاریخ',
      field: (row) => (row.held_at ? dateManager.isoToLocalShamsiDate(row.held_at) : '-'),
      align: 'center'
    })
  }

  if (formSettings.value.show_exam_titles) {
    cols.push({ name: 'exam_name', label: 'عنوان آزمون', field: 'exam_name', align: 'left' })
  }

  if (formSettings.value.show_student_grade) {
    cols.push({
      name: 'student_grade',
      label: 'نمره دانش‌آموز',
      field: 'student_grade',
      align: 'center'
    })
  }

  if (formSettings.value.show_avg_grade) {
    cols.push({ name: 'avg_grade', label: 'میانگین کلاس', field: 'avg_grade', align: 'center' })
  }

  if (formSettings.value.show_max_grade) {
    cols.push({ name: 'max_grade', label: 'بیشترین نمره', field: 'max_grade', align: 'center' })
  }

  if (formSettings.value.show_min_grade) {
    cols.push({ name: 'min_grade', label: 'کمترین نمره', field: 'min_grade', align: 'center' })
  }

  if (formSettings.value.show_student_score) {
    cols.push({
      name: 'student_score',
      label: 'تراز دانش‌آموز',
      field: 'student_score',
      align: 'center'
    })
  }

  if (formSettings.value.show_max_score) {
    cols.push({ name: 'max_score', label: 'بیشترین تراز', field: 'max_score', align: 'center' })
  }

  if (formSettings.value.show_min_score) {
    cols.push({ name: 'min_score', label: 'کمترین تراز', field: 'min_score', align: 'center' })
  }

  return cols
})

function goBack () {
  router.back()
}

function printReportCards () {
  isPreparingPrint.value = true

  // اجازه می‌دهیم Vue و ECharts چرخه رندر را در DOM تثبیت کنند
  nextTick(() => {
    setTimeout(() => {
      isPreparingPrint.value = false
      setTimeout(() => {
        nextTick(() => {
          window.print()
        })
      }, 500)
    }, 1200) // ۱.۲ ثانیه برای رندر شدن SVGها کاملاً کافیست و کاربر هم معطل نمی‌شود
  })
}

// پیکربندی نمودار نمرات درس
function buildLessonGradeChart (lesson: any) {
  const inPersonResults: any[] = lesson.in_person_results || []
  const onlineResults: any[] = lesson.online_results || []

  const getScore = (r: any) =>
    parseFloat(r.scaled_score?.toString() ?? r.raw_score?.toString() ?? '0') || 0

  const allScores = [...inPersonResults.map(getScore), ...onlineResults.map(getScore)]

  if (allScores.length === 0) return { title: { text: 'بدون نمره' } }

  const maxScore = Math.max(...allScores, 0)
  const minScore = Math.min(...allScores, 0)
  const avgScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length

  const sortedScores = [...allScores].sort((a, b) => a - b)

  return {
    animation: false,
    title: { text: 'نمودار نمرات', left: 'center', top: 5, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['نمره‌ها', 'حداکثر', 'حداقل', 'میانگین'], left: 'center', top: 'bottom' },
    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
    xAxis: { type: 'category', data: ['نمرات دانش‌آموز', 'حداکثر', 'حداقل', 'میانگین'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'نمرات',
        type: 'bar',
        data: [avgScore, maxScore, minScore, avgScore],
        itemStyle: { color: '#1976d2' },
        label: { show: true, position: 'top' }
      },
      {
        name: 'نمرات دانش‌آموز',
        type: 'bar',
        data: sortedScores.map((s: number) => s),
        itemStyle: { color: '#05f706' },
        label: { show: false }
      }
    ]
  }
}

// پیکربندی نمودار تراز درس
function buildLessonTarazChart (lesson: any) {
  const inPersonResults: any[] = lesson.in_person_results || []
  const onlineResults: any[] = lesson.online_results || []

  const getScore = (r: any) =>
    parseFloat(r.scaled_score?.toString() ?? r.raw_score?.toString() ?? '0') || 0

  const allScores = [...inPersonResults.map(getScore), ...onlineResults.map(getScore)]

  if (allScores.length === 0) return { title: { text: 'بدون داده' } }

  const maxScore = Math.max(...allScores, 0)
  const minScore = Math.min(...allScores, 0)
  const avgScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length

  return {
    animation: false,
    title: { text: 'نمودار تراز', left: 'center', top: 5, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['حداکثر تراز', 'تراز دانش‌آموز', 'کمترین تراز', 'میانگین تراز'],
      left: 'center',
      top: 'bottom'
    },
    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
    xAxis: { type: 'category', data: ['حداکثر', 'دانش‌آموز', 'کمترین', 'میانگین'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'حداکثر تراز',
        type: 'bar',
        data: [maxScore, maxScore, maxScore, maxScore],
        itemStyle: { color: '#388e3c' },
        label: { show: true, position: 'top' }
      },
      {
        name: 'تراز دانش‌آموز',
        type: 'bar',
        data: [avgScore, avgScore, avgScore, avgScore],
        itemStyle: { color: '#1976d2' },
        label: { show: true, position: 'top' }
      },
      {
        name: 'کمترین تراز',
        type: 'bar',
        data: [minScore, minScore, minScore, minScore],
        itemStyle: { color: '#d32f2f' },
        label: { show: true, position: 'top' }
      },
      {
        name: 'میانگین تراز',
        type: 'line',
        data: [avgScore, avgScore, avgScore, avgScore],
        itemStyle: { color: '#f57c00' },
        label: { show: true, position: 'top' }
      }
    ]
  }
}

function onLogoError (e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/images/logo.png'
}

function onStudentPhotoError (e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/images/blankProfile.png'
}
</script>

<style lang="scss" scoped>
.print-page {
  padding: 16px;
  width: 100%;
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
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.cards-list {
  margin-top: 16px;
}

.student-report-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.lesson-section {
  background: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
}

.page-break {
  page-break-after: always;
  break-after: page;
}

.chart-container {
  direction: ltr;
}

/* ═══ تنظیمات جدول کوآزار ═══ */
:deep(.q-table) {
  thead tr th {
    font-size: 14px !important;
    font-weight: 500;
    line-height: 12px;
    letter-spacing: 0.005em;
    text-align: center;
    height: 34px !important;
    padding: 0 !important;
  }

  tbody tr td {
    font-size: 12px !important;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.0025em;
    color: #526075;
    text-align: center;
    height: 0 !important;
    padding: 0 !important;
    border-bottom-width: 1px;
  }
}

/* ═══ بهینه‌سازی چاپ و خروجی PDF ═══ */
@media print {
  html,
  body,
  #q-app,
  .print-page,
  .print-container,
  .cards-list {
    width: 100% !important;
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
    position: static !important;
    transform: none !important;
  }

  .q-loading,
  .q-loading__backdrop,
  .print-actions {
    display: none !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    opacity: 1 !important;
  }

  .student-report-card {
    page-break-after: always !important;
    break-after: page !important;
    border: 1px solid #999 !important;
    box-shadow: none !important;
    margin-bottom: 0 !important;
    padding: 8mm !important;
    display: block !important;
    width: 100% !important;
    box-sizing: border-box !important;

    &:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  }

  table,
  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .lesson-section,
  table,
  tr {
    page-break-inside: auto !important;
    break-inside: auto !important;
    .row:first-child {
      // نوار عنوان درس
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
  }

  .chart-container {
    width: 100% !important;
    max-width: 100% !important;
    height: 260px !important;
    display: block !important;
    visibility: visible !important;
    overflow: hidden !important;
    direction: rtl !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;

    .echarts,
    svg {
      $chart-width: 400px;
      position: relative !important;
      display: block !important;
      width: $chart-width !important;
      min-width: $chart-width !important;
      max-width: $chart-width !important;
      height: 260px !important;
    }
  }
}

@page {
  size: A4 landscape;
  margin: 0;
}
</style>
