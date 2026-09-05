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
          <div class="school-header bg-grey-2 q-pa-md rounded-borders text-center q-mb-md">
            <div class="text-h6 font-bold">{{ reportData.school.name }}</div>
            <div
              v-if="reportData.term"
              class="text-subtitle2 text-grey-8">ترم: {{ reportData.term.name }}</div>
            <div class="text-subtitle1 font-bold text-primary q-mt-xs">
              {{ formSettings.title || 'کارنامه جامع' }}
            </div>
          </div>

          <div class="student-info bg-blue-grey-1 q-pa-sm rounded-borders q-mb-md">
            <div class="row">
              <div class="col">
                <div class="text-subtitle2">
                  نام و نام خانوادگی:
                  <b>{{ studentReport.student.name }} {{ studentReport.student.last_name }}</b>
                </div>
                <div
                  v-if="studentReport.student.student_code"
                  class="text-subtitle2">
                  کد دانش‌آموزی: <b>{{ studentReport.student.student_code }}</b>
                </div>
                <div class="text-subtitle2">
                  کلاس: <b>{{ reportData.class.name }}</b>
                </div>
              </div>
            </div>
          </div>

          <q-table
            :rows="studentReport.lessons"
            :columns="lessonColumns"
            row-key="id"
            dense
            bordered
            flat
            separator="cell"
            class="lesson-matrix-table">
            <template #body-cell-coefficient="props">
              <q-td>{{ props.row.coefficient ?? '-' }}</q-td>
            </template>
            <template #body-cell-student_avg="props">
              <q-td class="bg-blue-1">
                <b>{{ props.row.student_avg ?? '-' }}</b>
              </q-td>
            </template>
            <template #body-cell-class_avg="props">
              <q-td>{{ props.row.class_avg ?? '-' }}</q-td>
            </template>
            <template #body-cell-class_max="props">
              <q-td class="bg-green-1">{{ props.row.class_max ?? '-' }}</q-td>
            </template>
            <template #body-cell-class_min="props">
              <q-td class="bg-red-1">{{ props.row.class_min ?? '-' }}</q-td>
            </template>
            <template #body-cell-student_score="props">
              <q-td class="bg-yellow-1">
                <b>{{ props.row.student_score ?? '-' }}</b>
              </q-td>
            </template>
            <template #body-cell-max_score="props">
              <q-td>{{ props.row.max_score ?? '-' }}</q-td>
            </template>
            <template #body-cell-min_score="props">
              <q-td>{{ props.row.min_score ?? '-' }}</q-td>
            </template>
          </q-table>

          <div
            v-if="studentIndex < reportData.students.length - 1"
            class="page-break" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import { useRouter } from 'vue-router'
import { useReportCardStore } from 'src/stores/reportCard'
import type { ComprehensiveReportResponse } from 'src/repositories/reportCard'

const $q = useQuasar()
const router = useRouter()
const reportCardStore = useReportCardStore()

const reportData = computed(() => reportCardStore.reportCards as ComprehensiveReportResponse | null)
const formSettings = computed(() => reportCardStore.formSettings)

const lessonColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = [
    { name: 'name', label: 'درس', field: 'name', align: 'right' },
    { name: 'coefficient', label: 'ضریب', field: 'coefficient', align: 'center' }
  ]

  if (formSettings.value.show_student_grade !== false) {
    cols.push({ name: 'student_avg', label: 'میانگین نمره دانش‌آموز', field: 'student_avg', align: 'center' })
  }
  if (formSettings.value.show_avg_grade !== false) {
    cols.push({ name: 'class_avg', label: 'میانگین کلاس', field: 'class_avg', align: 'center' })
  }
  if (formSettings.value.show_max_grade !== false) {
    cols.push({ name: 'class_max', label: 'بیشترین نمره کلاس', field: 'class_max', align: 'center' })
  }
  if (formSettings.value.show_min_grade !== false) {
    cols.push({ name: 'class_min', label: 'کمترین نمره کلاس', field: 'class_min', align: 'center' })
  }
  if (formSettings.value.show_student_score !== false) {
    cols.push({ name: 'student_score', label: 'تراز دانش‌آموز', field: 'student_score', align: 'center' })
  }
  if (formSettings.value.show_max_score !== false) {
    cols.push({ name: 'max_score', label: 'بیشترین تراز', field: 'max_score', align: 'center' })
  }
  if (formSettings.value.show_min_score !== false) {
    cols.push({ name: 'min_score', label: 'کمترین تراز', field: 'min_score', align: 'center' })
  }

  return cols
})

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
  max-width: 1200px;
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
.cards-list {
  margin-top: 16px;
}
.student-report-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  padding: 16px;
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
