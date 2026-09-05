<template>
  <div class="print-page">
    <div
      v-if="!reportData"
      class="text-center q-pa-xl">
      <q-icon
        name="assignment"
        size="80px"
        color="grey-4" />
      <p class="text-subtitle1 q-mt-md text-grey">هیچ شیتی یافت نشد.</p>
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
          @click="printReport" />
        <q-btn
          flat
          label="بازگشت"
          icon="arrow_back"
          class="q-ml-sm"
          @click="goBack" />
      </div>

      <div class="sheet-container">
        <div class="school-header bg-grey-2 q-pa-md rounded-borders text-center q-mb-md">
          <div class="text-h6 font-bold">{{ reportData.school.name }}</div>
          <div
            v-if="reportData.term"
            class="text-subtitle2 text-grey-8">ترم: {{ reportData.term.name }}</div>
          <div class="text-subtitle1 font-bold text-primary q-mt-xs">
            {{ formSettings.title || 'شیت نمرات کلاسی' }}
          </div>
          <div class="text-subtitle2">کلاس: {{ reportData.class.name }}</div>
        </div>

        <div
          v-if="reportData.lesson_stats && reportData.lesson_stats.length > 0"
          class="lesson-stats-section q-mb-md">
          <div class="text-subtitle1 font-bold q-mb-sm">میانگین دروس</div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="ls in reportData.lesson_stats"
              :key="ls.lesson_id"
              class="col-12 col-sm-6 col-md-4 col-lg-3">
              <q-card class="bg-grey-1">
                <q-card-section class="text-center">
                  <div class="text-caption text-grey-8">{{ ls.lesson_name }}</div>
                  <div class="text-h6">{{ ls.avg_score ?? '-' }}</div>
                  <div class="text-caption">
                    بیش: {{ ls.max_score ?? '-' }} | کم: {{ ls.min_score ?? '-' }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="sheet-table q-mb-md">
          <q-table
            :rows="matrixRows"
            :columns="matrixColumns"
            row-key="student_id"
            dense
            bordered
            flat
            separator="cell"
            :rows-per-page-options="[0]">
            <template #body-cell-overall_avg="props">
              <q-td class="bg-yellow-1">
                <b>{{ props.row.overall_avg ?? '-' }}</b>
              </q-td>
            </template>
          </q-table>
        </div>

        <div
          v-if="reportData.lesson_stats && reportData.lesson_stats.length > 1"
          class="chart-section q-mb-md">
          <div class="text-subtitle1 font-bold q-mb-sm">نمودار مقایسه‌ای میانگین دروس</div>
          <div class="chart-container">
            <v-chart
              :option="buildLessonComparisonChart()"
              :autoresize="true"
              style="width: 100%; height: 300px" />
          </div>
        </div>

        <div class="column-stats-section">
          <div class="text-subtitle1 font-bold q-mb-sm">آماره آزمون‌ها</div>
          <q-table
            :rows="reportData.column_stats"
            :columns="columnStatsColumns"
            row-key="exam_id"
            dense
            bordered
            flat
            separator="cell" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import type { ClassGradeSheetResponse } from 'src/repositories/reportCard'

use([CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const $q = useQuasar()
const router = useRouter()
const reportCardStore = useReportCardStore()

const reportData = computed(() => reportCardStore.reportCards as ClassGradeSheetResponse | null)
const formSettings = computed(() => reportCardStore.formSettings)

const matrixColumns = computed<QTableColumn[]>(() => {
  if (!reportData.value) return []
  const cols: QTableColumn[] = [
    { name: 'name', label: 'نام', field: 'name', align: 'right' },
    { name: 'last_name', label: 'نام خانوادگی', field: 'last_name', align: 'right' }
  ]
  reportData.value.exams.forEach((exam, idx) => {
    cols.push({
      name: `exam_${exam.id}`,
      label: `${exam.lesson_name ? exam.lesson_name + ' - ' : ''}${exam.name}`,
      field: `scores.${idx}`,
      align: 'center'
    })
  })
  cols.push({ name: 'overall_avg', label: 'میانگین کلی', field: 'overall_avg', align: 'center' })
  return cols
})

const matrixRows = computed(() => {
  if (!reportData.value) return []
  return reportData.value.students.map((s) => ({
    student_id: s.student_id,
    name: s.name,
    last_name: s.last_name,
    ...Object.fromEntries(s.scores.map((score, idx) => [`scores.${idx}`, score])),
    overall_avg: s.overall_avg
  }))
})

const columnStatsColumns: QTableColumn[] = [
  { name: 'exam_name', label: 'آزمون', field: 'exam_name', align: 'left' },
  { name: 'lesson_name', label: 'درس', field: 'lesson_name', align: 'center' },
  { name: 'max_score', label: 'بیشترین', field: 'max_score', align: 'center' },
  { name: 'min_score', label: 'کمترین', field: 'min_score', align: 'center' },
  { name: 'avg_score', label: 'میانگین', field: 'avg_score', align: 'center' }
]

function buildLessonComparisonChart () {
  if (!reportData.value || !reportData.value.lesson_stats) return {}

  const stats = reportData.value.lesson_stats
  const names = stats.map((s) => s.lesson_name || '')
  const maxData = stats.map((s) => s.max_score ?? 0)
  const minData = stats.map((s) => s.min_score ?? 0)
  const avgData = stats.map((s) => s.avg_score ?? 0)

  return {
    title: { text: 'مقایسه میانگین دروس', left: 'center', top: 5 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['بیشترین', 'میانگین', 'کمترین'], left: 'center', top: 'bottom' },
    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
    xAxis: { type: 'category', data: names },
    yAxis: { type: 'value' },
    series: [
      { name: 'بیشترین', type: 'bar', data: maxData, itemStyle: { color: '#388e3c' } },
      { name: 'میانگین', type: 'bar', data: avgData, itemStyle: { color: '#1976d2' } },
      { name: 'کمترین', type: 'bar', data: minData, itemStyle: { color: '#d32f2f' } }
    ]
  }
}

function goBack () {
  router.back()
}

function printReport () {
  window.print()
}
</script>

<style lang="scss" scoped>
.print-page {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
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
.sheet-container {
  margin-top: 16px;
}
.school-header {
  border-bottom: 2px solid #1976d2;
}
.lesson-stats-section {
  margin-bottom: 16px;
}
.sheet-table {
  overflow-x: auto;
}
.chart-section {
  margin-top: 16px;
}
.chart-container {
  direction: ltr;
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

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  .print-actions {
    display: none !important;
  }
  .student-report-card,
  .matrix-container,
  .sheet-container {
    page-break-after: always;
    break-after: page;
    border: 1px solid #999 !important;
    box-shadow: none !important;
    margin-bottom: 0 !important;
    padding: 8mm !important;
  }
  .lesson-section,
  .chart-container,
  table,
  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  .chart-container {
    width: 100% !important;
    height: auto !important;
    min-height: 200px !important;
  }
  .chart-container canvas,
  .chart-container svg {
    max-width: 100% !important;
    height: auto !important;
  }
  .matrix-table,
  .sheet-table {
    overflow: visible !important;
  }
}

@page {
  size: A4 landscape;
  margin: 5mm;
}

</style>
