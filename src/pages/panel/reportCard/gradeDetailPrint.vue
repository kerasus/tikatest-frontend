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
      v-else-if="!gradeDetails"
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
          v-for="(studentReport, studentIndex) in gradeDetails.students"
          :key="studentReport.student.id"
          class="student-report-card q-mb-xl">
          <!-- هدر آموزشگاه -->
          <header-type1
            v-if="headerType === 1"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type2
            v-if="headerType === 2"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type3
            v-if="headerType === 3"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type4
            v-if="headerType === 4"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type5
            v-if="headerType === 5"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type6
            v-if="headerType === 6"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type7
            v-if="headerType === 7"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type8
            v-if="headerType === 8"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />
          <header-type9
            v-if="headerType === 9"
            :school="gradeDetails.school"
            :student="studentReport.student"
            :title="formSettings.title"
            :term-name="gradeDetails.term?.name"
            :class-name="gradeDetails.class?.name" />

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

            <!-- نمودارهای درس (کنار هم در چاپ) -->
            <div
              v-if="formSettings.show_grade_chart || formSettings.show_taraz_chart"
              class="charts-row">
              <div
                v-if="formSettings.show_grade_chart"
                class="chart-container">
                <v-chart
                  :option="buildLessonGradeChart(lesson)"
                  :init-options="{ renderer: 'svg' }"
                  :autoresize="true"
                  style="width: 125mm; height: 45mm" />
              </div>

              <div
                v-if="formSettings.show_taraz_chart"
                class="chart-container">
                <v-chart
                  :option="buildLessonTarazChart(lesson)"
                  :init-options="{ renderer: 'svg' }"
                  :autoresize="true"
                  style="width: 125mm; height: 45mm" />
              </div>
            </div>
          </div>

          <!-- صفحه‌break بین کارنامه‌ها -->
          <div
            v-if="studentIndex < gradeDetails.students.length - 1"
            class="page-break" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { QTableColumn } from 'quasar'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import HeaderType1 from 'src/components/reportCard/gradeDetail/headers/type1.vue'
import HeaderType2 from 'src/components/reportCard/gradeDetail/headers/type2.vue'
import HeaderType3 from 'src/components/reportCard/gradeDetail/headers/type3.vue'
import HeaderType4 from 'src/components/reportCard/gradeDetail/headers/type4.vue'
import HeaderType5 from 'src/components/reportCard/gradeDetail/headers/type5.vue'
import HeaderType6 from 'src/components/reportCard/gradeDetail/headers/type6.vue'
import HeaderType7 from 'src/components/reportCard/gradeDetail/headers/type7.vue'
import HeaderType8 from 'src/components/reportCard/gradeDetail/headers/type8.vue'
import HeaderType9 from 'src/components/reportCard/gradeDetail/headers/type9.vue'
import { useRouter } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import { useDate } from 'src/composables/Date'
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

const router = useRouter()
const dateManager = useDate()
const reportCardStore = useReportCardStore()

const headerType = ref<number>(5)
const loading = ref(false)
const isPreparingPrint = ref(false)
const gradeDetails = computed(() => reportCardStore.gradeDetails)
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

// پیکربندی نمودار نمرات درس (کاملاً خطی)
function buildLessonGradeChart (lesson: any) {
  const inPersonResults: any[] = lesson.in_person_results || []
  const onlineResults: any[] = lesson.online_results || []
  const allResults = [...inPersonResults, ...onlineResults]

  if (allResults.length === 0) return { title: { text: 'بدون نمره' } }

  // استخراج عناوین آزمون‌ها/جلسات برای محور X
  const xCategories: string[] = []
  const studentGrade: number[] = []
  const maxGrade: number[] = []
  const minGrade: number[] = []
  const avgGrade: number[] = []

  allResults.forEach((r: any, idx: number) => {
    const title = r.title || r.test_title || r.date || `آزمون ${(idx + 1).toLocaleString('fa-IR')}`
    xCategories.push(title)

    // نمره دانش‌آموز
    const studentScore =
      parseFloat(r.scaled_score?.toString() ?? r.raw_score?.toString() ?? '0') || 0
    studentGrade.push(fmt(studentScore))

    // داده‌های آماری کلاس برای این آزمون
    const classMax = parseFloat(r.max_grade?.toString() ?? studentScore.toString()) || studentScore
    const classMin = parseFloat(r.min_grade?.toString() ?? studentScore.toString()) || studentScore
    const classAvg = parseFloat(r.avg_grade?.toString() ?? studentScore.toString()) || studentScore

    maxGrade.push(fmt(classMax))
    minGrade.push(fmt(classMin))
    avgGrade.push(fmt(classAvg))
  })

  return {
    animation: false,
    title: {
      text: 'نمودار مقایسه نمرات درس',
      left: 'center',
      top: 2,
      textStyle: { fontSize: 12, fontFamily: 'inherit' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''

        // والد اصلی با دایرکشن راست به چپ و فونت خوانا
        let result = '<div style="direction: rtl; text-align: right; min-width: 140px; font-family: inherit;">'

        // عنوان آزمون (راست‌چین)
        result += `<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px;">${params[0].axisValue}</div>`

        params.forEach((item: any) => {
          const rawVal = typeof item.value === 'number' ? item.value : parseFloat(item.value || 0)
          const formattedVal = Math.round(rawVal).toLocaleString('fa-IR')

          result += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0; font-size: 11px;">
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
      data: ['نمرات دانش‌آموز', 'حداکثر', 'میانگین', 'حداقل'],
      bottom: 2,
      textStyle: { fontSize: 10 },
      itemWidth: 16,
      itemHeight: 8
    },
    grid: {
      left: '0%',
      right: '0%',
      top: 32,
      bottom: 42,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xCategories,
      axisLabel: { fontSize: 10, interval: 0, rotate: xCategories.length > 5 ? 25 : 0 }
    },
    yAxis: {
      type: 'value',
      scale: true, // 👈 این باعث میشه از صفر شروع نکنه و بر اساس داده‌ها زوم بشه
      min: (value: { min: number }) => Math.max(0, Math.floor(value.min - 1)), // یکی کمتر از حداقل نمره واقعی
      max: (value: { max: number }) => Math.min(20, Math.ceil(value.max + 1)), // یکی بیشتر از حداکثر نمره (سقف ۲۰)
      axisLabel: {
        fontSize: 11,
        formatter: (val: number) => Math.round(val).toLocaleString('fa-IR')
      }
    },
    series: [
      {
        name: 'نمرات دانش‌آموز',
        type: 'line',
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 8,
        data: studentGrade,
        itemStyle: { color: '#1976d2' },
        lineStyle: { width: 3, color: '#1976d2' },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: (p: any) => fmt(p.value).toLocaleString('fa-IR')
        }
      },
      {
        name: 'حداکثر',
        type: 'line',
        smooth: 0.2,
        symbol: 'triangle',
        symbolSize: 5,
        data: maxGrade,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#10b981' }
      },
      {
        name: 'میانگین',
        type: 'line',
        smooth: 0.2,
        symbol: 'diamond',
        symbolSize: 5,
        data: avgGrade,
        itemStyle: { color: '#3598ff' },
        lineStyle: { width: 1.5, type: 'dotted', color: '#3598ff' }
      },
      {
        name: 'حداقل',
        type: 'line',
        smooth: 0.2,
        symbol: 'rect',
        symbolSize: 5,
        data: minGrade,
        itemStyle: { color: '#ef4444' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#ef4444' }
      }
    ]
  }
}

// پیکربندی نمودار تراز درس (کاملاً خطی با مقایسه خطوط)
function buildLessonTarazChart (lesson: any) {
  const inPersonResults: any[] = lesson.in_person_results || []
  const onlineResults: any[] = lesson.online_results || []
  const allResults = [...inPersonResults, ...onlineResults]

  if (allResults.length === 0) return { title: { text: 'بدون تراز' } }

  const xCategories: string[] = []
  const studentTaraz: number[] = []
  const maxTaraz: number[] = []
  const minTaraz: number[] = []
  const avgTaraz: number[] = []

  allResults.forEach((r: any, idx: number) => {
    const title = r.title || r.test_title || r.date || `آزمون ${(idx + 1).toLocaleString('fa-IR')}`
    xCategories.push(title)

    // تراز دانش‌آموز
    const sTaraz = parseFloat(r.student_score?.toString() ?? '0') || 0
    studentTaraz.push(fmt(sTaraz))

    // مقادیر آماری تراز کلاس
    const mxTaraz = parseFloat(r.max_score?.toString() ?? sTaraz.toString()) || sTaraz
    const mnTaraz = parseFloat(r.min_score?.toString() ?? sTaraz.toString()) || sTaraz
    const agTaraz = parseFloat(r.avg_score?.toString() ?? sTaraz.toString()) || sTaraz

    maxTaraz.push(fmt(mxTaraz))
    minTaraz.push(fmt(mnTaraz))
    avgTaraz.push(fmt(agTaraz))
  })

  return {
    animation: false,
    title: {
      text: 'نمودار تراز',
      left: 'center',
      top: 2,
      textStyle: { fontSize: 12, fontFamily: 'inherit' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''

        // والد اصلی با دایرکشن راست به چپ و فونت خوانا
        let result = '<div style="direction: rtl; text-align: right; min-width: 140px; font-family: inherit;">'

        // عنوان آزمون (راست‌چین)
        result += `<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px;">${params[0].axisValue}</div>`

        params.forEach((item: any) => {
          const rawVal = typeof item.value === 'number' ? item.value : parseFloat(item.value || 0)
          const formattedVal = Math.round(rawVal).toLocaleString('fa-IR')

          result += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0; font-size: 11px;">
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
      // data: ['تراز'],
      data: ['تراز دانش‌آموز', 'حداکثر', 'میانگین', 'حداقل'],
      bottom: 2,
      textStyle: { fontSize: 10 },
      itemWidth: 16,
      itemHeight: 8
    },
    grid: {
      left: '0%',
      right: '0%',
      top: 32,
      bottom: 42,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xCategories,
      // data: ['تراز دانش‌آموز', 'حداکثر تراز', 'کمترین تراز', 'میانگین تراز'],
      // axisLabel: { fontSize: 10, interval: 0 }
      axisLabel: { fontSize: 9, interval: 0, rotate: xCategories.length > 5 ? 25 : 0 }
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: (value: { min: number; max: number }) => {
        const delta = value.max - value.min
        const pad = delta > 0 ? Math.ceil(delta * 0.1) : 50
        return Math.max(0, Math.floor(value.min - pad))
      },
      max: (value: { min: number; max: number }) => {
        const delta = value.max - value.min
        const pad = delta > 0 ? Math.ceil(delta * 0.1) : 50
        return Math.ceil(value.max + pad)
      },
      axisLabel: {
        fontSize: 11,
        formatter: (val: number) => Math.round(val).toLocaleString('fa-IR')
      }
    },
    series: [
      {
        name: 'تراز دانش‌آموز',
        type: 'line',
        smooth: 0.3,
        symbol: 'diamond',
        symbolSize: 9,
        // data: [studentScore, maxScore, minScore, avgScore],
        data: studentTaraz,
        itemStyle: { color: '#1976d2' },
        lineStyle: { width: 3, color: '#1976d2' },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: (p: any) => fmt(p.value).toLocaleString('fa-IR')
        }
      },
      {
        name: 'حداکثر',
        type: 'line',
        smooth: 0.2,
        symbol: 'triangle',
        symbolSize: 5,
        data: maxTaraz,
        itemStyle: { color: '#00d807' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#00d807' }
      },
      {
        name: 'میانگین',
        type: 'line',
        smooth: 0.2,
        symbol: 'none',
        data: avgTaraz,
        itemStyle: { color: '#3598ff' },
        lineStyle: { width: 1.5, type: 'dotted', color: '#3598ff' }
      },
      {
        name: 'حداقل',
        type: 'line',
        smooth: 0.2,
        symbol: 'rect',
        symbolSize: 5,
        data: minTaraz,
        itemStyle: { color: '#d32f2f' },
        lineStyle: { width: 1.5, type: 'dashed', color: '#d32f2f' }
      }
    ]
  }
}

function fmt (n: number): number {
  return Math.round(n * 100) / 100
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

.charts-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.chart-container {
  flex: 1 1 50%;
  min-width: 125mm;
  max-width: 125mm;
  :deep(x-vue-echarts) {
    & > div {
      direction: rtl !important;
    }
  }
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

  .lesson-section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

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
    page-break-inside: avoid !important;
    break-inside: avoid !important;

    .echarts,
    svg {
      width: 125mm !important;
      height: 45mm !important;
    }
  }

  /* ✅ کل ردیف نمودارها یکپارچه — یا هر دو در این صفحه، یا هر دو در بعدی */
  .charts-row {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}

@page {
  size: A4 landscape;
  margin: 0;
}
</style>
