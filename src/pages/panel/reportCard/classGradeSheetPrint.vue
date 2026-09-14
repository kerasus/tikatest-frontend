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

      <div class="class-grade-sheet-print">
        <!-- حلقه روی صفحات تقطیع شده برای خروجی چاپی A4 -->
        <div
          v-for="page in pages"
          :key="page.pageIndex"
          class="print-page-wrapper q-mb-xl">
          <!-- هدر اولترا کامپکت اختصاصی Type5 -->
          <report-header-type5
            :title="reportTitle"
            :academic-year="academicYear"
            :class-name="className"
            :page-number="page.pageIndex"
            :total-pages="pages.length" />

          <!-- جدول اصلی ماتریسی با QTable -->
          <q-table
            flat
            bordered
            dense
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="students"
            :columns="page.columns"
            row-key="id"
            class="matrix-q-table q-mt-sm">
            <!-- ساختار هدر دوطبقه (Multi-level Header Slot) -->
            <template v-slot:header>
              <!-- ردیف اول: نام دروس (Colspan بر اساس تعداد آزمون‌های هر درس در صفحه) -->
              <q-tr class="header-level-1">
                <q-th
                  rowspan="2"
                  class="text-center font-bold">ردیف</q-th>
                <q-th
                  rowspan="2"
                  class="text-right font-bold">نام و نام خانوادگی</q-th>
                <q-th
                  v-for="group in page.lessonGroups"
                  :key="group.lesson_id"
                  :colspan="group.exams.length"
                  class="text-center lesson-header-cell">
                  {{ group.lesson_name }}
                </q-th>
                <q-th
                  rowspan="2"
                  class="text-center font-bold">معدل کل</q-th>
              </q-tr>

              <!-- ردیف دوم: عنوان ۳ سطری آزمون‌ها (نام، نوع، تاریخ) -->
              <q-tr class="header-level-2">
                <q-th
                  v-for="exam in page.exams"
                  :key="exam.id"
                  class="text-center exam-header-cell">
                  <div class="exam-header-content">
                    <!-- سطر ۱: نام آزمون -->
                    <div
                      class="exam-name text-weight-bold"
                      :title="exam.name">
                      {{ exam.name }}
                    </div>
                    <!-- سطر ۲: نوع/دسته‌بندی آزمون -->
                    <div
                      class="exam-category text-grey-8"
                      :title="exam.category">
                      {{ exam.category }}
                    </div>
                    <!-- سطر ۳: تاریخ برگزاری آزمون -->
                    <div class="exam-date text-caption text-grey-6 font-mono">
                      {{ formatExamDate(exam.date) }}
                    </div>
                  </div>
                </q-th>
              </q-tr>
            </template>

            <!-- نمایش سطر دانش‌آموزان -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="index"
                  :props="props"
                  class="text-center">
                  {{ props.rowIndex + 1 }}
                </q-td>
                <q-td
                  key="student_name"
                  :props="props"
                  class="text-right font-medium">
                  {{ `${props.row.first_name || ''} ${props.row.last_name || ''}` }}
                </q-td>

                <!-- سلول نمرات اصلاح شده -->
                <q-td
                  v-for="exam in page.exams"
                  :key="exam.id"
                  class="text-center grade-cell">
                  {{ getStudentGrade(props.row, exam.id) }}
                </q-td>

                <q-td
                  key="overall_avg"
                  :props="props"
                  class="text-center font-bold bg-grey-2">
                  {{
                    props.row.overall_avg != null ? Number(props.row.overall_avg).toFixed(2) : '-'
                  }}
                </q-td>
              </q-tr>
            </template>

            <!-- فوتر آماری متصل اصلاح شده -->
            <template v-slot:bottom-row>
              <!-- سطر میانگین آزمون -->
              <q-tr class="stat-row avg-row">
                <q-td
                  colspan="2"
                  class="text-right font-bold">میانگین کلاس</q-td>
                <q-td
                  v-for="exam in page.exams"
                  :key="'avg-' + exam.id"
                  class="text-center font-bold">
                  {{ columnStatsMap.get(exam.id)?.avg_score ?? '-' }}
                </q-td>
                <q-td class="text-center font-bold bg-grey-3">-</q-td>
              </q-tr>

              <!-- سطر بالاترین نمره -->
              <q-tr class="stat-row max-row">
                <q-td
                  colspan="2"
                  class="text-right font-medium">بیشترین نمره</q-td>
                <q-td
                  v-for="exam in page.exams"
                  :key="'max-' + exam.id"
                  class="text-center text-green-9">
                  {{ columnStatsMap.get(exam.id)?.max_score ?? '-' }}
                </q-td>
                <q-td class="text-center bg-grey-3">-</q-td>
              </q-tr>

              <!-- سطر کمترین نمره -->
              <q-tr class="stat-row min-row">
                <q-td
                  colspan="2"
                  class="text-right font-medium">کمترین نمره</q-td>
                <q-td
                  v-for="exam in page.exams"
                  :key="'min-' + exam.id"
                  class="text-center text-negative">
                  {{ columnStatsMap.get(exam.id)?.min_score ?? '-' }}
                </q-td>
                <q-td class="text-center bg-grey-3">-</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { useReportCardStore } from 'src/stores/reportCard'
import ReportHeaderType5 from 'src/components/reportCard/gradeMatrix/headers/type5.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const reportCardStore = useReportCardStore()

const isPreparingPrint = ref(false)
const reportData = computed(() => reportCardStore.classGradeSheet)
const formSettings = computed(() => reportCardStore.formSettings)

// حداکثر تعداد ستون آزمون در هر برگه A4 Landscape (قابل تنظیم از فرم یا مقدار پیش‌فرض ۱۰)
const maxExamsPerPage = computed(() => formSettings.value?.max_exams_per_page || 10)

// --- استخراج داده‌ها با نال چک متناسب با Structure API ---
const exams = computed(() => reportData.value?.exams || [])
const students = computed(() => reportData.value?.students || [])

// فرمت تاریخ به صورت شمسی کوتاه یا بازگرداندن مقدار ساده
const formatExamDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return new Intl.DateTimeFormat('fa-IR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).format(d)
  } catch {
    return String(dateStr)
  }
}

// ۱. نگاشت کلید-مقدار آماره‌ها بر اساس exam_id
const columnStatsMap = computed(() => {
  const map = new Map<number, any>()
  if (Array.isArray(reportData.value?.column_stats)) {
    reportData.value.column_stats.forEach((stat: any) => {
      map.set(stat.exam_id, stat)
    })
  }
  return map
})

// ۲. نگاشت اندیس آزمون در لیست کل آزمون‌ها برای واکشی نمره از آرایه scores
const examIndexMap = computed(() => {
  const map = new Map<number, number>()
  exams.value.forEach((exam: any, index: number) => {
    map.set(exam.id, index)
  })
  return map
})

// ۳. تابع دریافت نمره ایمن
const getStudentGrade = (student: any, examId: number) => {
  if (!student) return '-'

  // اگر scores آرایه ایندکس‌دار باشد:
  if (Array.isArray(student.scores)) {
    const idx = examIndexMap.value.get(examId)
    if (idx !== undefined && student.scores[idx] !== undefined && student.scores[idx] !== null) {
      return student.scores[idx]
    }
  }

  // اگر scores به صورت آبجکت { exam_id: score } باشد:
  if (student.scores && typeof student.scores === 'object' && !Array.isArray(student.scores)) {
    return student.scores[examId] ?? '-'
  }

  return '-'
}

// عنوان‌ها و متای هدر از روی تنظیمات استور
const reportTitle = computed(() => formSettings.value?.report_title || 'گزارش ماتریسی نمرات کلاس')
const academicYear = computed(() => reportData.value?.term?.name || 'سال تحصیلی جاری')
const className = computed(() => reportData.value?.class?.name || 'کلاس')

// --- تایپ‌ها و اینترفیس‌های داخلی برای رندر شیت ---
interface ExamItem {
  id: number;
  name: string;
  category: string;
  date: string;
  max_grade: number;
  lesson_id: number;
  lesson_name: string;
}

interface LessonGroup {
  lesson_id: number;
  lesson_name: string;
  exams: ExamItem[];
}

interface PageChunk {
  pageIndex: number;
  lessonGroups: LessonGroup[];
  exams: ExamItem[];
  columns: QTableColumn[];
}

// ۱. گروه‌بندی اولیه‌ی آزمون‌ها بر اساس lesson_id جهت ساخت هدر دوطبقه
const lessonGroups = computed<LessonGroup[]>(() => {
  const map = new Map<number, LessonGroup>()

  exams.value.forEach((exam: any) => {
    const lessonId = exam.lesson_id ?? exam.lesson?.id ?? 0
    const lessonName = exam.lesson_name ?? exam.lesson?.name ?? 'سایر دروس'

    if (!map.has(lessonId)) {
      map.set(lessonId, {
        lesson_id: lessonId,
        lesson_name: lessonName,
        exams: []
      })
    }

    map.get(lessonId)!.exams.push({
      id: exam.id,
      name: exam.name || exam.title || 'آزمون',
      category: exam.category || exam.category_name || 'کلاسی',
      date: exam.held_at || exam.date || exam.exam_date || '',
      max_grade: exam.max_grade || 20,
      lesson_id: lessonId,
      lesson_name: lessonName
    })
  })

  return Array.from(map.values())
})

// ۲. تقطیع ستون‌ها جهت چیدمان چاپی A4 Landscape (Page Chunking)
const pages = computed<PageChunk[]>(() => {
  const result: PageChunk[] = []
  let currentExams: ExamItem[] = []
  let currentLessons: LessonGroup[] = []
  let pageIdx = 1

  const finalizePage = () => {
    if (currentExams.length === 0) return

    const cols: QTableColumn[] = [
      {
        name: 'index',
        label: 'ردیف',
        field: 'index',
        align: 'center',
        style: 'width: 40px'
      },
      {
        name: 'student_name',
        label: 'نام و نام خانوادگی',
        field: (row: any) => `${row.first_name || ''} ${row.last_name || ''}`,
        align: 'right',
        style: 'min-width: 140px'
      }
    ]

    currentExams.forEach((exam) => {
      cols.push({
        name: `exam_${exam.id}`,
        label: exam.name,
        field: () => '-',
        align: 'center',
        style: 'width: 65px'
      })
    })

    cols.push({
      name: 'overall_avg',
      label: 'معدل کل',
      field: (row: any) => {
        const avg = row.overall_avg ?? row.avg
        return typeof avg === 'number' ? avg.toFixed(2) : (avg ?? '-')
      },
      align: 'center',
      style: 'width: 70px; font-weight: bold;'
    })

    result.push({
      pageIndex: pageIdx++,
      lessonGroups: JSON.parse(JSON.stringify(currentLessons)),
      exams: [...currentExams],
      columns: cols
    })

    currentExams = []
    currentLessons = []
  }

  lessonGroups.value.forEach((group) => {
    let examBuffer: ExamItem[] = []

    group.exams.forEach((exam) => {
      examBuffer.push(exam)
      currentExams.push(exam)

      if (currentExams.length >= maxExamsPerPage.value) {
        currentLessons.push({
          lesson_id: group.lesson_id,
          lesson_name: group.lesson_name,
          exams: [...examBuffer]
        })
        examBuffer = []
        finalizePage()
      }
    })

    if (examBuffer.length > 0) {
      currentLessons.push({
        lesson_id: group.lesson_id,
        lesson_name: group.lesson_name,
        exams: [...examBuffer]
      })
    }
  })

  finalizePage()
  return result
})

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

.class-grade-sheet-print {
  width: 100%;
}

.print-page-wrapper {
  background: #fff;
  width: 100%;
}

.matrix-q-table {
  border: 1px solid #cfd8dc;
}

.lesson-header-cell {
  background-color: #f1f5f9 !important;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 1px solid #cfd8dc;
  font-size: 12px;
}

.exam-header-cell {
  padding: 4px 2px !important;
  vertical-align: middle;
  background-color: #fafafa;
}

.exam-header-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  min-width: 60px;
  max-width: 80px;
  margin: 0 auto;
  line-height: 1.15;

  .exam-name {
    font-size: 11px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .exam-category {
    font-size: 9px;
    color: #546e7a;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .exam-date {
    font-size: 8.5px;
    direction: ltr;
    color: #78909c;
    letter-spacing: -0.3px;
  }
}

/* ۱. ردیف اول هدر (نام درس‌ها و ستون‌های ثابت) */
:deep(.q-table) {
  thead tr.header-level-1 th {
    font-size: 12px !important;
    font-weight: 700;
    height: 32px !important;
    padding: 2px 4px !important;
    vertical-align: middle;
    border-bottom: 2px solid #94a3b8 !important;/* خط جداکننده افقی محکم بین نام درس و آزمون‌ها */
  }

  /* سلول‌های ثابت: ردیف، نام و نام خانوادگی، معدل کل */
  thead tr.header-level-1 th[rowspan="2"] {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
    border-left: 1px solid #cbd5e1 !important;
    border-right: 1px solid #cbd5e1 !important;
  }

  /* سلول عنوان هر درس (آموزش قرآن، فارسی و...) */
  thead tr.header-level-1 th.lesson-header-cell {
    background-color: #e2e8f0 !important; /* رنگ مشخص‌تر و باکلاس‌تر نسبت به پس‌زمینه آزمون‌ها */
    color: #1e293b !important;
    letter-spacing: -0.2px;

    /* مرز عمودی واضح در دو طرف هر درس برای تفکیک کامل */
    border-right: 2px solid #94a3b8 !important;
    border-left: 2px solid #94a3b8 !important;
  }

  thead tr.header-level-2 th {
    height: 54px !important;
    padding: 2px !important;
    background-color: #f8fafc !important;
    border-bottom: 2px solid #cbd5e1 !important;
    border-right: 1px solid #e2e8f0 !important;
  }

  tbody tr td {
    font-size: 11px !important;
    font-weight: 400;
    line-height: 16px;
    color: #374151;
    text-align: center;
    height: 28px !important;
    padding: 2px 4px !important;
    border-bottom: 1px solid #e2e8f0;
  }
}

.stat-row {
  background-color: #f8fafc;
  td {
    font-size: 10.5px !important;
    height: 26px !important;
    border-top: 1px solid #cbd5e1;
  }
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-page-wrapper {
    page-break-after: always;
    break-after: page;
    margin-bottom: 0 !important;
  }
}

@page {
  size: A4 landscape;
  margin: 6mm;
}
</style>
