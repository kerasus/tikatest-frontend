<template>
  <exam-detail-card
    :exam="exam"
    :school-id="schoolId"
    :editable="editable" />

  <!-- کارت اطلاعات زمانی آزمون (طراحی شیشه‌ای و رنگی) -->
  <div
    v-if="exam.online_exam_detail"
    class="fancy-time-wrapper q-mb-lg">

    <!-- هدر شیشه‌ای و گرادیانتی خوش‌رنگ -->
    <div class="fancy-header q-pa-md">
      <div class="fancy-header__glow" />
      <div class="row items-center justify-between no-wrap relative-position">
        <div class="row items-center no-wrap">
          <div class="fancy-icon-bubble">
            <q-icon
              name="schedule"
              size="24px"
              class="text-white" />
          </div>
          <div class="q-ml-sm">
            <div class="fancy-header__title">
              بازه زمانی و محدودیت‌های آزمون
            </div>
            <div class="fancy-header__subtitle">
              تنظیم ساعات شروع، خاتمه، سیاست‌های نمایش و مدت زمان پاسخگویی
            </div>
          </div>
        </div>

        <!-- نشانگر جذاب مدت زمان آزمون -->
        <div
          v-if="exam.online_exam_detail.time_limit_minutes"
          class="fancy-time-chip">
          <q-icon
            name="timer"
            size="18px"
            class="q-mr-xs pulse-anim" />
          <span class="text-weight-bold">{{ exam.online_exam_detail.time_limit_minutes }} دقیقه</span>
          <span class="q-ml-xs text-caption">زمان آزمون</span>
        </div>
      </div>
    </div>

    <!-- بدنه کارت‌ها -->
    <div class="fancy-body q-pa-md">
      <div class="row q-col-gutter-md">

        <!-- ۱. بازه برگزاری آزمون (سبز نعنایی شیشه‌ای) -->
        <div class="col-12 col-lg-6">
          <div class="candy-panel candy-panel--emerald">
            <div class="candy-panel__header">
              <div class="row items-center">
                <span class="candy-panel__dot bg-positive" />
                <q-icon
                  name="event_available"
                  color="positive"
                  size="19px"
                  class="q-mr-xs" />
                <span class="candy-panel__title">بازه مجاز شرکت در آزمون</span>
              </div>
              <span class="candy-panel__badge candy-panel__badge--positive">پنجره فعال</span>
            </div>

            <div class="candy-panel__body">
              <div class="row q-col-gutter-sm">
                <!-- زمان شروع -->
                <div class="col-12 col-sm-6">
                  <div class="crystal-box">
                    <form-builder-date-time
                      v-if="editable"
                      v-model:value="exam.online_exam_detail.starts_at"
                      label="زمان شروع آزمون"
                      outlined
                      dense />
                    <div
                      v-else
                      class="crystal-info">
                      <div class="crystal-info__top">
                        <q-icon
                          name="play_circle_filled"
                          size="16px"
                          class="text-positive" />
                        <span>شروع آزمون:</span>
                      </div>
                      <div class="crystal-info__val ltr">{{ startsAtFormatted || 'تعیین نشده' }}</div>
                    </div>
                  </div>
                </div>

                <!-- زمان پایان -->
                <div class="col-12 col-sm-6">
                  <div class="crystal-box">
                    <form-builder-date-time
                      v-if="editable"
                      v-model:value="exam.online_exam_detail.ends_at"
                      label="زمان پایان آزمون"
                      outlined
                      dense />
                    <div
                      v-else
                      class="crystal-info">
                      <div class="crystal-info__top">
                        <q-icon
                          name="stop_circle"
                          size="16px"
                          class="text-negative" />
                        <span>پایان آزمون:</span>
                      </div>
                      <div class="crystal-info__val ltr">{{ endsAtFormatted || 'تعیین نشده' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ۲. بازه انتشار و نمایش (آبی فیروزه‌ای شیشه‌ای) -->
        <div class="col-12 col-lg-6">
          <div class="candy-panel candy-panel--cyan">
            <div class="candy-panel__header">
              <div class="row items-center">
                <span class="candy-panel__dot bg-cyan-7" />
                <q-icon
                  name="visibility"
                  color="cyan-8"
                  size="19px"
                  class="q-mr-xs" />
                <span class="candy-panel__title">سیاست‌های انتشار و دسترسی</span>
              </div>
              <span class="candy-panel__badge candy-panel__badge--cyan">کلید و دفترچه</span>
            </div>

            <div class="candy-panel__body">
              <div class="row q-col-gutter-sm">
                <!-- رویت آزمون -->
                <div class="col-12 col-sm-6">
                  <div class="crystal-box">
                    <form-builder-date-time
                      v-if="editable"
                      v-model:value="exam.online_exam_detail.visible_at"
                      label="قابل رویت از تاریخ"
                      outlined
                      dense />
                    <div
                      v-else
                      class="crystal-info">
                      <div class="crystal-info__top">
                        <q-icon
                          name="visibility"
                          size="16px"
                          class="text-cyan-8" />
                        <span>نمایش سوالات:</span>
                      </div>
                      <div class="crystal-info__val ltr">{{ visibleAtFormatted || 'همزمان با شروع' }}</div>
                    </div>
                  </div>
                </div>

                <!-- رویت پاسخ‌ها -->
                <div class="col-12 col-sm-6">
                  <div class="crystal-box">
                    <form-builder-date-time
                      v-if="editable"
                      v-model:value="exam.online_exam_detail.answers_visible_at"
                      label="انتشار پاسخنامه از تاریخ"
                      outlined
                      dense />
                    <div
                      v-else
                      class="crystal-info">
                      <div class="crystal-info__top">
                        <q-icon
                          name="verified"
                          size="16px"
                          class="text-cyan-8" />
                        <span>نمایش پاسخ‌ها:</span>
                      </div>
                      <div class="crystal-info__val ltr">{{ answersVisibleAtFormatted || 'پس از پایان آزمون' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ۳. محدودیت مدت زمان پاسخگویی (تم کهربایی/بنفش جذاب) -->
        <div class="col-12">
          <div class="candy-panel candy-panel--amber">
            <div class="candy-panel__header">
              <div class="row items-center">
                <span class="candy-panel__dot bg-amber-8" />
                <q-icon
                  name="hourglass_bottom"
                  color="amber-9"
                  size="19px"
                  class="q-mr-xs" />
                <span class="candy-panel__title">مدت زمان مجاز پاسخگویی (تایمر معکوس)</span>
              </div>
              <div class="timer-tag">
                {{ exam.online_exam_detail.time_limit_minutes ? `${exam.online_exam_detail.time_limit_minutes} دقیقه مهلت اختصاصی` : 'بدون محدودیت' }}
              </div>
            </div>

            <div class="candy-panel__body">
              <div class="row items-center justify-between q-col-gutter-md">
                <div class="col-12 col-md-7">
                  <div class="timer-desc">
                    <div class="timer-desc__title">
                      <q-icon
                        name="bolt"
                        color="amber-9"
                        size="18px" />
                      شمارش معکوس انفرادی داوطلب
                    </div>
                    <div class="timer-desc__caption">
                      از لحظه کلیک دانش‌آموز روی دکمه شروع آزمون، تایمر به این میزان فعال می‌شود. در صورت خالی بودن، زمان پایان بازه ملاک اتمام خواهد بود.
                    </div>
                  </div>
                </div>

                <div class="col-12 col-md-5">
                  <div class="crystal-box crystal-box--timer">
                    <q-input
                      v-if="editable"
                      v-model.number="exam.online_exam_detail.time_limit_minutes"
                      outlined
                      dense
                      type="number"
                      min="1"
                      placeholder="مثال: ۹۰"
                      hint="مدت زمان آزمون به دقیقه">
                      <template #prepend>
                        <q-icon
                          name="timer"
                          size="20px"
                          color="amber-9" />
                      </template>
                      <template #append>
                        <span class="text-caption text-weight-bold text-amber-10">دقیقه</span>
                      </template>
                    </q-input>

                    <div
                      v-else
                      class="timer-display-pill">
                      <div class="timer-display-pill__label">مدت زمان تعیین‌شده:</div>
                      <div class="timer-display-pill__value">
                        <q-icon
                          name="timer"
                          size="18px"
                          class="q-mr-xs" />
                        {{ exam.online_exam_detail.time_limit_minutes ? `${exam.online_exam_detail.time_limit_minutes} دقیقه` : 'بدون محدودیت (اتمام با پایان بازه)' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- بخش تنظیمات محتوایی و دفترچه‌ها -->
  <div
    v-if="exam.online_exam_detail"
    class="fancy-content-wrapper q-mb-lg">

    <!-- هدر شیک بخش محتوا -->
    <div class="content-header q-mb-md">
      <div class="content-header__glow" />
      <div class="row items-center justify-between relative-position">
        <div class="row items-center">
          <div class="content-header__icon-box">
            <q-icon
              name="auto_stories"
              size="22px"
              class="text-white" />
          </div>
          <div class="q-ml-sm">
            <div class="content-header__title">تنظیمات محتوایی، سوالات و دفترچه‌ها</div>
            <div class="content-header__subtitle">فایل‌های سوالات، کلید تستی و بخش‌بندی دروس آزمون</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ۱. فایل سوالات و پاسخنامه تشریحی -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <div class="file-card file-card--primary">
          <div class="file-card__head">
            <div class="row items-center justify-between">
              <div class="row items-center text-primary text-weight-bold">
                <q-icon
                  name="picture_as_pdf"
                  size="20px"
                  class="q-mr-xs" />
                <span>فایل / تصویر سوالات آزمون</span>
              </div>
              <span class="file-card__badge bg-primary text-white">دفترچه اصلی</span>
            </div>
          </div>
          <div class="file-card__body">
            <content-editor
              v-model:value="exam.online_exam_detail.content"
              :editable="editable" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="file-card file-card--teal">
          <div class="file-card__head">
            <div class="row items-center justify-between">
              <div class="row items-center text-teal-8 text-weight-bold">
                <q-icon
                  name="menu_book"
                  size="20px"
                  class="q-mr-xs" />
                <span>فایل / تصویر پاسخنامه تشریحی</span>
              </div>
              <span class="file-card__badge bg-teal text-white">اختیاری / راهنما</span>
            </div>
          </div>
          <div class="file-card__body">
            <content-editor
              v-model:value="exam.online_exam_detail.solution"
              :editable="editable" />
          </div>
        </div>
      </div>
    </div>

    <!-- ۲. پاسخنامه کلیدی آزمون -->
    <div class="key-sheet-card q-mb-md">
      <div class="key-sheet-card__head q-pa-sm">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <div class="key-icon-bubble">
              <q-icon
                name="checklist_rtl"
                size="20px"
                class="text-white" />
            </div>
            <div class="q-ml-sm">
              <div class="text-subtitle1 text-weight-bolder text-grey-9">پاسخنامه کلیدی (تستی)</div>
              <div class="text-caption text-grey-6">تعیین گزینه‌های صحیح، ضرایب دروس و نمره منفی سوالات</div>
            </div>
          </div>
          <div class="key-count-pill">
            <q-icon
              name="key"
              size="14px"
              class="q-mr-xs" />
            <span>{{ exam.online_exam_detail?.answer_keys?.length || 0 }} کلید ثبت‌شده</span>
          </div>
        </div>
      </div>
      <div class="q-pa-md bg-white">
        <exam-answer-key-editor
          v-model:value="exam.answer_keys"
          :readonly="!editable" />
      </div>
    </div>

    <!-- ۳. مدیریت دفترچه‌ها -->
    <div class="booklet-main-card">
      <div class="booklet-main-card__head q-pa-md">
        <div class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bolder text-purple-10 flex items-center">
              <q-icon
                name="collections_bookmark"
                color="purple"
                class="q-mr-xs"
                size="24px" />
              دفترچه‌های آزمون
              <span class="booklet-counter q-ml-sm">
                {{ exam.online_exam_detail.booklets?.length || 0 }} دفترچه
              </span>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              تفکیک سوالات در قالب دفترچه‌های مجزا با درس اختصاصی
            </div>
          </div>

          <div v-if="editable">
            <q-btn
              unelevated
              color="purple-7"
              icon="add"
              label="افزودن دفترچه جدید"
              class="fancy-add-btn"
              @click="addBooklet" />
          </div>
        </div>
      </div>

      <!-- هشدار قفل بودن درس‌ها -->
      <q-banner
        v-if="!!exam.lesson_id"
        dense
        class="bg-amber-1 text-amber-10 q-px-md q-py-sm border-bottom-light">
        <template #avatar>
          <q-icon
            name="info"
            color="amber-9" />
        </template>
        <span class="text-body2 font-weight-medium">
          به دلیل انتخاب «درس برای کل آزمون»، فیلد درس برای دفترچه‌ها غیرفعال است.
        </span>
      </q-banner>

      <div class="q-pa-md">
        <!-- لیست دفترچه‌ها -->
        <div
          v-if="exam.online_exam_detail?.booklets?.length"
          class="row q-col-gutter-md">
          <div
            v-for="(booklet, index) in exam.online_exam_detail.booklets"
            :key="index"
            class="col-12">
            <div class="booklet-item-box">
              <div class="booklet-item-box__head q-px-md q-py-sm">
                <div class="row items-center justify-between">
                  <div class="text-subtitle2 text-weight-bold text-grey-9 flex items-center">
                    <span class="booklet-num">{{ index + 1 }}</span>
                    <span>{{ booklet.title || `دفترچه شماره ${index + 1}` }}</span>
                  </div>
                  <q-btn
                    v-if="editable"
                    flat
                    round
                    dense
                    icon="delete_outline"
                    color="negative"
                    size="sm"
                    class="del-booklet-btn"
                    title="حذف دفترچه"
                    @click="removeBooklet(index)">
                    <q-tooltip>حذف این دفترچه</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <!-- فیلدهای دفترچه -->
              <div class="q-pa-md bg-white">
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12 col-md-4">
                    <q-input
                      v-if="editable"
                      v-model="booklet.title"
                      label="عنوان دفترچه *"
                      placeholder="مثال: عمومی، اختصاصی ریاضی"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'عنوان الزامی است']" />
                    <div
                      v-else
                      class="crystal-info crystal-info--plain">
                      <div class="text-caption text-grey-6">عنوان دفترچه:</div>
                      <div class="text-body1 text-weight-bold text-grey-9">{{ booklet.title || '-' }}</div>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <form-builder-select-lesson
                      v-if="editable"
                      v-model:value="booklet.lesson_id"
                      :school-id="schoolId"
                      :level-id="levelIds"
                      :class-id="classIds"
                      label="درس دفترچه"
                      dense
                      clearable
                      :disable="!!exam.lesson_id"
                      :placeholder="exam.lesson_id ? 'غیرفعال (درس آزمون پر است)' : ''" />
                    <div
                      v-else
                      class="crystal-info crystal-info--plain">
                      <div class="text-caption text-grey-6">درس اختصاصی:</div>
                      <div class="text-body1 text-weight-bold text-grey-9">
                        {{ booklet.lesson?.name || booklet.lesson_id || 'عمومی / بدون درس' }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <q-input
                          v-if="editable"
                          v-model.number="booklet.from_question"
                          label="از سوال"
                          outlined
                          dense
                          type="number"
                          min="1" />
                        <div
                          v-else
                          class="crystal-info crystal-info--plain text-center">
                          <div class="text-caption text-grey-6">از سوال:</div>
                          <div class="text-body2 text-weight-bolder text-primary">{{ booklet.from_question ?? '-' }}</div>
                        </div>
                      </div>
                      <div class="col-6">
                        <q-input
                          v-if="editable"
                          v-model.number="booklet.to_question"
                          label="تا سوال"
                          outlined
                          dense
                          type="number"
                          min="1" />
                        <div
                          v-else
                          class="crystal-info crystal-info--plain text-center">
                          <div class="text-caption text-grey-6">تا سوال:</div>
                          <div class="text-body2 text-weight-bolder text-primary">{{ booklet.to_question ?? '-' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- حالت خالی (Empty State) -->
        <div
          v-else
          class="empty-booklet-box q-pa-xl text-center">
          <div class="empty-icon-circle q-mb-sm">
            <q-icon
              name="menu_book"
              size="36px"
              color="purple-5" />
          </div>
          <div class="text-subtitle1 text-grey-8 text-weight-bold">هیچ دفترچه‌ای تعریف نشده است</div>
          <div class="text-caption text-grey-6 q-mb-md">
            در صورت عدم تعریف دفترچه‌ها، تمام سوالات این آزمون تحت یک دفترچه واحد محاسبه می‌شوند.
          </div>
          <q-btn
            v-if="editable"
            outline
            color="purple-7"
            icon="add"
            label="افزودن اولین دفترچه"
            class="fancy-add-btn"
            @click="addBooklet" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDate } from 'src/composables/Date'
import type { ExamType } from 'src/repositories/exam'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import ExamAnswerKeyEditor from 'src/components/exam/ExamAnswerKeyEditor.vue'
import ContentEditor from 'src/components/ContentEditor.vue'

defineProps<{
  editable?: boolean;
  schoolId?: number;
}>()
const exam = defineModel<ExamType>('exam')
const dateManager = useDate()

const startsAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.starts_at
  if (!raw) return '-'
  return dateManager.isoToLocalShamsi(raw) || raw
})

const endsAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.ends_at
  if (!raw) return '-'
  return dateManager.isoToLocalShamsi(raw) || raw
})

const visibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.visible_at
  if (!raw) return '-'
  return dateManager.isoToLocalShamsi(raw) || raw
})

const answersVisibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.answers_visible_at
  if (!raw) return '-'
  return dateManager.isoToLocalShamsi(raw) || raw
})

const hasAnyBookletLesson = computed(() =>
  (exam.value.online_exam_detail?.booklets || []).some((b) => !!b?.lesson_id)
)

const levelIds = computed(() => exam.value.academic_levels?.map((l: any) => l.id) || [])

const classIds = computed(() => exam.value.classes?.map((c: any) => c.id) || [])

function addBooklet () {
  if (!exam.value.online_exam_detail) return
  exam.value.online_exam_detail.booklets = exam.value.online_exam_detail.booklets || []
  exam.value.online_exam_detail.booklets.push({
    id: null,
    online_exam_id: null,
    lesson_id: null,
    title: '',
    from_question: null,
    to_question: null,
    booklet_scores: null,
    created_by: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    lesson: null
  })
}

function removeBooklet (index: number) {
  if (!exam.value.online_exam_detail?.booklets) return
  exam.value.online_exam_detail.booklets.splice(index, 1)
}

watch(
  () => exam.value.lesson_id,
  () => {
    const booklets = exam.value.online_exam_detail?.booklets || []
    booklets.forEach((b) => {
      b.lesson_id = null
    })
  }
)

watch(
  () => exam.value.online_exam_detail?.booklets?.map((b) => b.lesson_id) || [],
  () => {
    if (hasAnyBookletLesson.value) {
      exam.value.lesson_id = null
    }
  },
  { deep: true }
)

</script>

<style scoped lang="scss">
/* انیمیشن پالس نرم برای آیکون تایمر */
@keyframes softPulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}

.pulse-anim {
  animation: softPulse 2s infinite ease-in-out;
}

/* =========================================================
   ۱. محفظه اصلی کارت زمان‌بندی (Candy Glass Time Wrapper)
   ========================================================= */
.fancy-time-wrapper {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 12px 32px -10px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.02);
}

.fancy-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #ffffff 100%);
  border-bottom: 1px solid #e0e7ff;

  &__glow {
    position: absolute;
    top: -50px;
    right: -40px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  &__title {
    font-size: 15px;
    font-weight: 900;
    color: #1e1b4b;
    letter-spacing: -0.3px;
  }

  &__subtitle {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 600;
    margin-top: 2px;
  }
}

.fancy-icon-bubble {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35);
}

.fancy-time-chip {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
  font-size: 12px;
}

/* =========================================================
   ۲. پنل‌های آب‌نباتی (Candy Panels)
   ========================================================= */
.candy-panel {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-left: 6px;
  }

  &__title {
    font-size: 12.5px;
    font-weight: 800;
    color: #1e293b;
  }

  &__badge {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;

    &--positive {
      background: rgba(34, 197, 94, 0.15);
      color: #15803d;
    }

    &--cyan {
      background: rgba(6, 182, 212, 0.15);
      color: #0e7490;
    }
  }

  &__body {
    padding: 12px;
    flex-grow: 1;
  }

  /* تم سبز نعنایی برای بازه برگزاری */
  &--emerald {
    background: linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(220, 252, 231, 0.6) 100%);
    border: 1.5px solid #86efac;
    box-shadow: 0 6px 20px -8px rgba(34, 197, 94, 0.2);

    .candy-panel__header {
      background: rgba(220, 252, 231, 0.7);
      border-bottom: 1px solid rgba(134, 239, 172, 0.7);
    }
  }

  /* تم آبی فیروزه‌ای برای سیاست‌های انتشار */
  &--cyan {
    background: linear-gradient(135deg, rgba(236, 254, 255, 0.9) 0%, rgba(207, 250, 254, 0.6) 100%);
    border: 1.5px solid #a5f3fc;
    box-shadow: 0 6px 20px -8px rgba(6, 182, 212, 0.2);

    .candy-panel__header {
      background: rgba(207, 250, 254, 0.7);
      border-bottom: 1px solid rgba(165, 243, 252, 0.7);
    }
  }

  /* تم کهربایی برای مدت زمان */
  &--amber {
    background: linear-gradient(135deg, rgba(254, 252, 232, 0.9) 0%, rgba(254, 243, 199, 0.55) 100%);
    border: 1.5px solid #fde68a;
    box-shadow: 0 6px 20px -8px rgba(245, 158, 11, 0.18);

    .candy-panel__header {
      background: rgba(254, 243, 199, 0.75);
      border-bottom: 1px solid rgba(253, 230, 138, 0.8);
    }
  }
}

/* =========================================================
   ۳. جعبه‌های اطلاعات کریستالی (Crystal Boxes)
   ========================================================= */
.crystal-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.05);

  &--timer {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #fde68a;
  }
}

.crystal-info {
  &__top {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  }

  &__val {
    font-size: 13.5px;
    font-weight: 800;
    color: #1e293b;
    margin-top: 4px;
    direction: ltr;
    text-align: right;
  }

  &--plain {
    background: #f8fafc;
    border-radius: 10px;
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
  }
}

.timer-tag {
  background: rgba(245, 158, 11, 0.2);
  color: #b45309;
  font-weight: 800;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 999px;
}

.timer-desc {
  &__title {
    font-size: 13px;
    font-weight: 900;
    color: #78350f;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  &__caption {
    font-size: 11px;
    color: #92400e;
    margin-top: 3px;
    line-height: 1.6;
    font-weight: 500;
  }
}

.timer-display-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &__label {
    font-size: 10.5px;
    color: #92400e;
    font-weight: 700;
  }

  &__value {
    font-size: 14.5px;
    font-weight: 900;
    color: #d97706;
    display: flex;
    align-items: center;
    margin-top: 2px;
  }
}

/* =========================================================
   ۴. استایل بخش محتوا، سوالات و دفترچه‌ها
   ========================================================= */
.content-header {
  position: relative;
  overflow: hidden;
  padding: 12px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
  border: 1px solid #ddd6fe;
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.08);

  &__glow {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
  }

  &__icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(126, 34, 206, 0.35);
  }

  &__title {
    font-size: 14px;
    font-weight: 900;
    color: #3b0764;
  }

  &__subtitle {
    font-size: 11px;
    color: #7e22ce;
    font-weight: 500;
  }
}

/* کارت‌های فایل سوالات و پاسخنامه تشریحی */
.file-card {
  border-radius: 16px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.05);

  &__head {
    padding: 10px 14px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  &__badge {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
  }

  &__body {
    padding: 12px;
  }

  &--primary {
    border-color: #c7d2fe;
    .file-card__head {
      background: #eef2ff;
      border-bottom-color: #c7d2fe;
    }
  }

  &--teal {
    border-color: #ccfbf1;
    .file-card__head {
      background: #f0fdfa;
      border-bottom-color: #ccfbf1;
    }
  }
}

/* پاسخنامه کلیدی */
.key-sheet-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.05);

  &__head {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
  }
}

.key-icon-bubble {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.key-count-pill {
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
}

/* دفترچه‌ها */
.booklet-main-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1.5px solid #f3e8ff;
  box-shadow: 0 10px 30px -10px rgba(168, 85, 247, 0.1);
  overflow: hidden;

  &__head {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-bottom: 1px solid #e9d5ff;
  }
}

.booklet-counter {
  background: #7e22ce;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.fancy-add-btn {
  border-radius: 10px;
  font-weight: 800;
  box-shadow: 0 4px 14px rgba(126, 34, 206, 0.3);
}

.booklet-item-box {
  border-radius: 14px;
  border: 1px solid #e9d5ff;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  &__head {
    background: #faf5ff;
    border-bottom: 1px solid #f3e8ff;
  }
}

.booklet-num {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #7e22ce;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
}

.del-booklet-btn {
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
}

.empty-booklet-box {
  background: #faf5ff;
  border-radius: 16px;
  border: 1.5px dashed #d8b4fe;
}

.empty-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(147, 51, 234, 0.15);
}
</style>
