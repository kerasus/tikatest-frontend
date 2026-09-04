<template>
  <div class="report-card-page">
    <q-form @submit.prevent="generateReportCards">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">تنظیمات کارنامه</div>
        </q-card-section>

        <q-card-section>
          <!-- فیلترها (مدرسه، رشته، پایه، کلاس، ترم) -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school
                v-model:value="form.school_id"
                label="انتخاب مدرسه"
                outlined
                :rules="[(v) => !!v || 'مدرسه الزامی است']"
                @update:value="onSchoolChange" />
            </div>
          </div>

          <div
            v-if="form.school_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-field
                v-model:value="form.field_id"
                label="انتخاب رشته"
                outlined
                :disable="!form.school_id"
                :rules="[(v) => !!v || 'رشته الزامی است']"
                :school-id="form.school_id"
                @update:value="onFieldChange" />
            </div>
          </div>

          <div
            v-if="form.field_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-level
                v-model:value="form.academic_level_id"
                label="انتخاب پایه"
                outlined
                :disable="!form.field_id"
                :rules="[(v) => !!v || 'پایه الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                @update:value="onLevelChange" />
            </div>
          </div>

          <div
            v-if="form.academic_level_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school-class
                v-model:value="form.class_id"
                label="انتخاب کلاس"
                outlined
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'کلاس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id"
                @update:value="onClassChange" />
            </div>
          </div>

          <div
            v-if="form.class_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-term
                v-model:value="form.term_id"
                label="انتخاب ترم"
                outlined
                :disable="!form.class_id"
                :rules="[(v) => !!v || 'ترم الزامی است']"
                :school-id="form.school_id"
                active-only />
            </div>
          </div>

          <div
            v-if="form.term_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-input
                v-model:value="form.title"
                label="عنوان کارنامه"
                outlined
                dense />
            </div>
          </div>

          <!-- گزینه‌های نمایش ستون‌ها و نمودارها -->
          <div
            v-if="form.term_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm text-primary font-bold">
                تنظیمات نمایش ستون‌ها و نمودارها:
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_row_number"
                    label="نمایش شماره ردیف"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_dates"
                    label="نمایش تاریخ آزمون‌ها"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_titles"
                    label="نمایش عنوان آزمون‌ها"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_student_grade"
                    label="نمایش نمره دانش‌آموز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_max_grade"
                    label="نمایش بیشترین نمره کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_min_grade"
                    label="نمایش کمترین نمره کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_avg_grade"
                    label="نمایش میانگین نمرات کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_student_score"
                    label="نمایش تراز دانش‌آموز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_max_score"
                    label="نمایش بیشترین تراز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_min_score"
                    label="نمایش کمترین تراز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_grade_chart"
                    label="نمایش نمودار مقایسه‌ای نمرات"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_taraz_chart"
                    label="نمایش نمودار تراز"
                    dense />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="تولید کارنامه"
                :loading="generating"
                :disable="!canGenerate" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-form>

    <div
      v-if="generating"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="80px" />
      <p class="q-mt-md text-grey">در حال بارگذاری کارنامه‌ها...</p>
    </div>

    <q-card
      v-if="reportCards"
      class="q-mt-md">
      <q-card-section>
        <div class="text-h6 text-positive">کارنامه‌ها با موفقیت بارگذاری شدند</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="مشاهده و چاپ کارنامه‌ها"
          icon="print"
          @click="goToPrint" />
        <q-btn
          flat
          label="بازنشانی"
          @click="resetForm" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'

// ایمپورت هسته ECharts و ماژول‌های مورد نیاز
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// رجیستر کردن ماژول‌های ECharts جهت Tree-shaking بهینه
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// کامپوننت‌های فرم و ابزارها
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import { reportCardAPI } from 'src/repositories/reportCard'
import { useReportCardStore } from 'src/stores/reportCard'
import { useRouter } from 'vue-router'
import { useDate } from 'src/composables/Date'

const $q = useQuasar()
const dateManager = useDate()
const router = useRouter()
const reportCardStore = useReportCardStore()

const generating = ref(false)
const reportCards = ref<any>(null)

const form = ref({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  term_id: null as number | null,
  title: 'کارنامه ریز نمرات' as string,
  show_exam_row_number: true,
  show_exam_dates: true,
  show_exam_titles: true,
  show_student_grade: true,
  show_max_grade: true,
  show_min_grade: true,
  show_avg_grade: true,
  show_student_score: true,
  show_max_score: true,
  show_min_score: true,
  show_grade_chart: true,
  show_taraz_chart: true
})

const canGenerate = computed(() => {
  return !!(
    form.value.school_id &&
    form.value.field_id &&
    form.value.academic_level_id &&
    form.value.class_id &&
    form.value.term_id
  )
})

function onSchoolChange () {
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.term_id = null
}

function onFieldChange () {
  form.value.academic_level_id = null
  form.value.class_id = null
}

function onLevelChange () {
  form.value.class_id = null
}

function onClassChange () {
  form.value.term_id = null
}

// تعریف داینامیک ستون‌های جدول آزمون‌های حضوری
const dynamicInPersonColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = []

  if (form.value.show_exam_row_number) {
    cols.push({
      name: 'row_number',
      label: '#',
      field: '#',
      align: 'center'
    })
  }
  cols.push({ name: 'category', label: 'دسته‌بندی', field: 'category', align: 'left' })

  if (form.value.show_exam_dates) {
    cols.push({
      name: 'held_at',
      label: 'تاریخ',
      field: (row) => (row.held_at ? dateManager.isoToLocalShamsiDate(row.held_at) : '-'),
      align: 'center'
    })
  }

  if (form.value.show_exam_titles) {
    cols.push({ name: 'exam_name', label: 'عنوان آزمون', field: 'exam_name', align: 'left' })
  }

  if (form.value.show_student_grade) {
    cols.push({
      name: 'student_grade',
      label: 'نمره دانش‌آموز',
      field: 'student_grade',
      align: 'center'
    })
  }

  if (form.value.show_avg_grade) {
    cols.push({ name: 'avg_grade', label: 'میانگین کلاس', field: 'avg_grade', align: 'center' })
  }

  if (form.value.show_max_grade) {
    cols.push({ name: 'max_grade', label: 'بیشترین نمره', field: 'max_grade', align: 'center' })
  }

  if (form.value.show_min_grade) {
    cols.push({ name: 'min_grade', label: 'کمترین نمره', field: 'min_grade', align: 'center' })
  }

  if (form.value.show_student_score) {
    cols.push({
      name: 'student_score',
      label: 'تراز دانش‌آموز',
      field: 'student_score',
      align: 'center'
    })
  }

  if (form.value.show_max_score) {
    cols.push({ name: 'max_score', label: 'بیشترین تراز', field: 'max_score', align: 'center' })
  }

  if (form.value.show_min_score) {
    cols.push({ name: 'min_score', label: 'کمترین تراز', field: 'min_score', align: 'center' })
  }

  return cols
})

// تعریف داینامیک ستون‌های جدول آزمون‌های آنلاین
const dynamicOnlineColumns = computed<QTableColumn[]>(() => {
  const cols: QTableColumn[] = []

  if (form.value.show_exam_row_number) {
    cols.push({
      name: 'row_number',
      label: '#',
      field: '#',
      align: 'center'
    })
  }
  cols.push({ name: 'booklet_title', label: 'دفترچه', field: 'booklet_title', align: 'left' })

  if (form.value.show_exam_dates) {
    cols.push({
      name: 'held_at',
      label: 'تاریخ',
      field: (row) => (row.held_at ? dateManager.isoToLocalShamsiDate(row.held_at) : '-'),
      align: 'center'
    })
  }

  if (form.value.show_exam_titles) {
    cols.push({ name: 'exam_name', label: 'عنوان آزمون', field: 'exam_name', align: 'left' })
  }

  if (form.value.show_student_grade) {
    cols.push({
      name: 'student_grade',
      label: 'نمره دانش‌آموز',
      field: 'student_grade',
      align: 'center'
    })
  }

  if (form.value.show_avg_grade) {
    cols.push({ name: 'avg_grade', label: 'میانگین کلاس', field: 'avg_grade', align: 'center' })
  }

  if (form.value.show_max_grade) {
    cols.push({ name: 'max_grade', label: 'بیشترین نمره', field: 'max_grade', align: 'center' })
  }

  if (form.value.show_min_grade) {
    cols.push({ name: 'min_grade', label: 'کمترین نمره', field: 'min_grade', align: 'center' })
  }

  if (form.value.show_student_score) {
    cols.push({
      name: 'student_score',
      label: 'تراز دانش‌آموز',
      field: 'student_score',
      align: 'center'
    })
  }

  return cols
})

async function generateReportCards () {
  if (!canGenerate.value) return

  generating.value = true
  reportCards.value = null

  try {
    const data = await reportCardAPI.classReportCards({
      school_id: form.value.school_id,
      term_id: form.value.term_id,
      class_id: form.value.class_id
    })
    reportCards.value = data
    reportCardStore.setReportCards(data)
    reportCardStore.setFormSettings({
      ...form.value
    })
    router.push({ name: 'Panel.ReportCard.Generate.Print' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری کارنامه‌ها' })
  } finally {
    generating.value = false
  }
}

function goToPrint () {
  router.push({ name: 'Panel.ReportCard.Generate.Print' })
}

function resetForm () {
  reportCards.value = null
  reportCardStore.clear()
  form.value.school_id = null
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.term_id = null
  form.value.title = 'کارنامه ریز نمرات'
}

// پیکربندی آپشن‌های ECharts برای نمودار مقایسه‌ای نمرات
function buildLessonGradeChart (lesson: any) {
  const allResults = [...(lesson.in_person_results || []), ...(lesson.online_results || [])]
  if (allResults.length === 0) return { title: { text: 'بدون داده برای نمودار نمرات' } }

  const categories = allResults.map((r, i) => r.exam_name || `آزمون ${i + 1}`)
  const studentScores = allResults.map((r) => r.student_grade)
  const avgScores = allResults.map((r) => r.avg_grade)
  const maxScores = allResults.map((r) => r.max_grade)
  const minScores = allResults.map((r) => r.min_grade)

  return {
    title: {
      text: `نمودار مقایسه‌ای نمرات - ${lesson.name}`,
      left: 'center',
      top: 5,
      textStyle: { fontSize: 13 }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['نمره دانش‌آموز', 'میانگین کلاس', 'بیشترین نمره', 'کمترین نمره'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: [
      { name: 'نمره دانش‌آموز', type: 'bar', data: studentScores, itemStyle: { color: '#21ba45' } },
      {
        name: 'میانگین کلاس',
        type: 'line',
        data: avgScores,
        itemStyle: { color: '#1976d2' },
        lineStyle: { width: 3 }
      },
      { name: 'بیشترین نمره', type: 'bar', data: maxScores, itemStyle: { color: '#26a69a' } },
      { name: 'کمترین نمره', type: 'bar', data: minScores, itemStyle: { color: '#e53935' } }
    ]
  }
}

// پیکربندی آپشن‌های ECharts برای نمودار تخصصی تراز
function buildLessonTarazChart (lesson: any) {
  const allResults = [...(lesson.in_person_results || []), ...(lesson.online_results || [])]
  if (allResults.length === 0) return { title: { text: 'بدون داده برای نمودار تراز' } }

  const categories = allResults.map((r, i) => r.exam_name || `آزمون ${i + 1}`)
  const studentTaraz = allResults.map((r) => r.student_score)
  const maxTaraz = allResults.map((r) => r.max_score)
  const minTaraz = allResults.map((r) => r.min_score)

  return {
    title: {
      text: `نمودار تراز دانش‌آموز - ${lesson.name}`,
      left: 'center',
      top: 5,
      textStyle: { fontSize: 13 }
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['تراز دانش‌آموز', 'بالاترین تراز کلاس', 'پایین‌ترین تراز کلاس'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value', min: 2000, max: 9000 },
    series: [
      {
        name: 'تراز دانش‌آموز',
        type: 'line',
        data: studentTaraz,
        itemStyle: { color: '#9c27b0' },
        lineStyle: { width: 3 }
      },
      {
        name: 'بالاترین تراز کلاس',
        type: 'line',
        data: maxTaraz,
        itemStyle: { color: '#21ba45' },
        lineStyle: { type: 'dashed' }
      },
      {
        name: 'پایین‌ترین تراز کلاس',
        type: 'line',
        data: minTaraz,
        itemStyle: { color: '#f44336' },
        lineStyle: { type: 'dashed' }
      }
    ]
  }
}

function printReportCards () {
  window.print()
}
</script>

<style lang="scss" scoped>
.report-card-page {
  padding: 16px;
}
.chart-container {
  direction: ltr;
}
</style>
