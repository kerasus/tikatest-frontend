<template>
  <exam-detail-card
    :exam="exam"
    :school-id="schoolId"
    :editable="editable" />
  <!-- کارت اطلاعات زمانی آزمون -->
  <q-card
    v-if="exam.online_exam_detail"
    flat
    bordered
    class="rounded-borders q-mb-md">

    <!-- هدر بخش -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <q-avatar
            size="32px"
            color="primary"
            text-color="white"
            icon="schedule"
            class="q-mr-sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
              بازه زمانی و محدودیت‌های آزمون
            </div>
            <div class="text-caption text-grey-7">
              تنظیم ساعات شروع، خاتمه، دسترسی شرکت‌کنندگان و مدت زمان پاسخگویی
            </div>
          </div>
        </div>

        <!-- نشانگر وضعیت مدت زمان -->
        <q-chip
          v-if="exam.online_exam_detail.time_limit_minutes"
          outline
          color="primary"
          icon="timer"
          class="text-weight-medium">
          {{ exam.online_exam_detail.time_limit_minutes }} دقیقه زمان آزمون
        </q-chip>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md">
      <div class="row q-col-gutter-md">

        <!-- ۱. بازه برگزاری آزمون (شروع و پایان) -->
        <div class="col-12 col-lg-6">
          <q-card
            flat
            bordered
            class="rounded-borders bg-grey-1">
            <q-card-section class="q-py-xs bg-grey-2 text-weight-bold text-grey-8 text-caption row items-center">
              <q-icon
                name="event_available"
                color="positive"
                size="18px"
                class="q-mr-xs" />
              بازه مجاز شرکت در آزمون
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-md">
              <div class="row q-col-gutter-md">
                <!-- زمان شروع -->
                <div class="col-12 col-sm-6">
                  <form-builder-date-time
                    v-if="editable"
                    v-model:value="exam.online_exam_detail.starts_at"
                    label="زمان شروع آزمون"
                    outlined
                    dense />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="play_arrow"
                        size="14px"
                        class="q-mr-xs text-positive" />
                      شروع:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ startsAtFormatted || 'تعیین نشده' }}
                    </div>
                  </div>
                </div>

                <!-- زمان پایان -->
                <div class="col-12 col-sm-6">
                  <form-builder-date-time
                    v-if="editable"
                    v-model:value="exam.online_exam_detail.ends_at"
                    label="زمان پایان آزمون"
                    outlined
                    dense />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="stop"
                        size="14px"
                        class="q-mr-xs text-negative" />
                      پایان:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ endsAtFormatted || 'تعیین نشده' }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ۲. بازه انتشار و نمایش (رویت آزمون و کلید) -->
        <div class="col-12 col-lg-6">
          <q-card
            flat
            bordered
            class="rounded-borders bg-grey-1">
            <q-card-section class="q-py-xs bg-grey-2 text-weight-bold text-grey-8 text-caption row items-center">
              <q-icon
                name="visibility"
                color="teal"
                size="18px"
                class="q-mr-xs" />
              سیاست‌های انتشار و دسترسی
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-md">
              <div class="row q-col-gutter-md">
                <!-- رویت آزمون -->
                <div class="col-12 col-sm-6">
                  <form-builder-date-time
                    v-if="editable"
                    v-model:value="exam.online_exam_detail.visible_at"
                    label="قابل رویت از تاریخ"
                    outlined
                    dense />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="visibility"
                        size="14px"
                        class="q-mr-xs text-teal" />
                      نمایش سوالات:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ visibleAtFormatted || 'همزمان با شروع' }}
                    </div>
                  </div>
                </div>

                <!-- رویت پاسخ‌ها -->
                <div class="col-12 col-sm-6">
                  <form-builder-date-time
                    v-if="editable"
                    v-model:value="exam.online_exam_detail.answers_visible_at"
                    label="انتشار پاسخنامه از تاریخ"
                    outlined
                    dense />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="task_alt"
                        size="14px"
                        class="q-mr-xs text-teal" />
                      نمایش پاسخ‌ها:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ answersVisibleAtFormatted || 'پس از پایان آزمون' }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ۳. محدودیت مدت زمان پاسخگویی (Timer) -->
        <div class="col-12">
          <q-card
            flat
            bordered
            class="rounded-borders bg-grey-1">
            <q-card-section class="q-py-xs bg-grey-2 text-weight-bold text-grey-8 text-caption row items-center justify-between">
              <div class="row items-center">
                <q-icon
                  name="timer"
                  color="primary"
                  size="18px"
                  class="q-mr-xs" />
                مدت زمان مجاز پاسخگویی (تایمر معکوس)
              </div>
              <q-badge
                color="primary"
                outline>
                {{ exam.online_exam_detail.time_limit_minutes ? `${exam.online_exam_detail.time_limit_minutes} دقیقه` : 'بدون محدودیت' }}
              </q-badge>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between q-col-gutter-md">
                <div class="col-12 col-md-7">
                  <div class="text-subtitle2 text-weight-bold text-blue-grey-9">
                    شمارش معکوس انفرادی داوطلب
                  </div>
                  <div class="text-caption text-grey-7">
                    از لحظه ورود دانش‌آموز به صفحه آزمون، تایمر به این میزان فعال می‌شود. در صورت خالی بودن، زمان پایان آزمون ملاک خاتمه خواهد بود.
                  </div>
                </div>

                <div class="col-12 col-md-5">
                  <q-input
                    v-if="editable"
                    v-model.number="exam.online_exam_detail.time_limit_minutes"
                    outlined
                    dense
                    type="number"
                    min="1"
                    placeholder="مثال: ۹۰"
                    hint="مدت زمان آزمون را به دقیقه وارد کنید">
                    <template #prepend>
                      <q-icon
                        name="hourglass_top"
                        size="20px"
                        color="primary" />
                    </template>
                    <template #append>
                      <span class="text-caption text-weight-medium text-grey-7">دقیقه</span>
                    </template>
                  </q-input>

                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders text-center border">
                    <span class="text-caption text-grey-7">مدت زمان تعیین‌شده: </span>
                    <span class="text-body2 text-weight-bold text-primary">
                      {{ exam.online_exam_detail.time_limit_minutes ? `${exam.online_exam_detail.time_limit_minutes} دقیقه` : 'بدون محدودیت (اتمام با زمان پایان بازه)' }}
                    </span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>


      </div>
    </q-card-section>
  </q-card>

  <div
    v-if="exam.online_exam_detail"
    class="q-mb-lg">
    <!-- هدر بخش -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6 text-weight-bold text-primary flex items-center">
          <q-icon
            name="tune"
            class="q-mr-sm"
            size="24px" />
          تنظیمات محتوایی و دفترچه‌ها
        </div>
        <div class="text-caption text-grey-7">
          فایل‌های سوالات، کلید آزمون و ساختار دفترچه‌های اختصاصی
        </div>
      </div>
    </div>

    <!-- ۱. فایل سوالات و پاسخنامه تشریحی -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-grey-1 row items-center justify-between q-py-sm">
            <div class="text-subtitle2 text-weight-bold text-grey-8">
              <q-icon
                name="picture_as_pdf"
                color="primary"
                class="q-mr-xs"
                size="18px" />
              فایل / تصویر سوالات آزمون
            </div>
            <q-badge
              color="primary"
              label="اصلی" />
          </q-card-section>
          <q-card-section>
            <content-editor
              v-model:value="exam.online_exam_detail.content"
              :editable="editable" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-grey-1 row items-center justify-between q-py-sm">
            <div class="text-subtitle2 text-weight-bold text-grey-8">
              <q-icon
                name="menu_book"
                color="teal"
                class="q-mr-xs"
                size="18px" />
              فایل / تصویر پاسخنامه تشریحی
            </div>
            <q-badge
              color="teal"
              label="اختیاری" />
          </q-card-section>
          <q-card-section>
            <content-editor
              v-model:value="exam.online_exam_detail.solution"
              :editable="editable" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- ۲. پاسخنامه کلیدی آزمون -->
    <q-card>
      <q-card-section class="bg-blue-grey-1 q-py-sm">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-avatar
              size="32px"
              color="primary"
              text-color="white"
              icon="fact_check"
              class="q-mr-sm" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                پاسخنامه کلیدی (تستی)
              </div>
              <div class="text-caption text-grey-7">
                تعیین گزینه‌های صحیح، ضرایب و نمره منفی سوالات
              </div>
            </div>
          </div>
          <q-badge
            color="primary"
            outline
            class="text-bold">
            {{ exam.answer_keys?.length || 0 }} کلید ثبت‌شده
          </q-badge>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md">
        <exam-answer-key-editor
          v-model:value="exam.answer_keys"
          :readonly="!editable" />
      </q-card-section>
    </q-card>

    <!-- ۳. مدیریت دفترچه‌ها -->
    <q-card
      flat
      bordered
      class="rounded-borders-md shadow-1 bg-white">
      <q-card-section class="row items-center justify-between q-pb-sm bg-grey-2">
        <div>
          <div class="text-subtitle1 text-weight-bold flex items-center">
            <q-icon
              name="collections_bookmark"
              color="accent"
              class="q-mr-xs"
              size="22px" />
            دفترچه‌های آزمون
            <q-badge
              class="q-ml-sm"
              :color="exam.online_exam_detail.booklets?.length ? 'positive' : 'grey-6'">
              {{ exam.online_exam_detail.booklets?.length || 0 }} دفترچه
            </q-badge>
          </div>
          <div class="text-caption text-grey-7">
            تفکیک سوالات در قالب دفترچه‌های مجزا با درس اختصاصی
          </div>
        </div>

        <div v-if="editable">
          <q-btn
            unelevated
            color="primary"
            icon="add"
            label="افزودن دفترچه جدید"
            @click="addBooklet" />
        </div>
      </q-card-section>

      <!-- هشدار در صورت قفل بودن درس‌ها -->
      <q-banner
        v-if="!!exam.lesson_id"
        dense
        class="bg-amber-1 text-amber-10 q-px-md q-py-sm border-bottom-light">
        <template #avatar>
          <q-icon
            name="info"
            color="amber-9" />
        </template>
        <span class="text-body2">
          به دلیل انتخاب «درس برای کل آزمون»، فیلد درس برای دفترچه‌ها غیرفعال است.
        </span>
      </q-banner>

      <q-separator />

      <q-card-section class="q-pa-md">
        <!-- لیست دفترچه‌ها -->
        <div
          v-if="exam.online_exam_detail?.booklets?.length"
          class="row q-col-gutter-md">
          <div
            v-for="(booklet, index) in exam.online_exam_detail.booklets"
            :key="index"
            class="col-12">
            <q-card
              flat
              bordered
              class="booklet-item-card">
              <!-- هدر کارت دفترچه -->
              <div class="row items-center justify-between bg-blue-grey-1 q-px-md q-py-xs border-bottom-light">
                <div class="text-subtitle2 text-weight-medium text-blue-grey-9 flex items-center">
                  <q-avatar
                    size="24px"
                    color="primary"
                    text-color="white"
                    class="q-mr-sm text-caption">
                    {{ index + 1 }}
                  </q-avatar>
                  {{ booklet.title || `دفترچه شماره ${index + 1}` }}
                </div>
                <q-btn
                  v-if="editable"
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="negative"
                  size="sm"
                  title="حذف دفترچه"
                  @click="removeBooklet(index)">
                  <q-tooltip>حذف این دفترچه</q-tooltip>
                </q-btn>
              </div>

              <!-- فیلدهای دفترچه -->
              <q-card-section class="q-pa-md">
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
                    <div v-else>
                      <div class="text-caption text-grey-7">عنوان:</div>
                      <div class="text-body1 text-weight-medium">{{ booklet.title || '-' }}</div>
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
                    <div v-else>
                      <div class="text-caption text-grey-7">درس اختصاصی:</div>
                      <div class="text-body1">
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
                        <div v-else>
                          <div class="text-caption text-grey-7">از سوال:</div>
                          <div class="text-body2 text-weight-bold">{{ booklet.from_question ?? '-' }}</div>
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
                        <div v-else>
                          <div class="text-caption text-grey-7">تا سوال:</div>
                          <div class="text-body2 text-weight-bold">{{ booklet.to_question ?? '-' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- حالت خالی (Empty State) -->
        <div
          v-else
          class="text-center q-pa-xl empty-booklets-box rounded-borders-md">
          <q-icon
            name="menu_book"
            size="48px"
            color="grey-4"
            class="q-mb-sm" />
          <div class="text-subtitle1 text-grey-7 text-weight-medium">هیچ دفترچه‌ای ثبت نشده است.</div>
          <div class="text-caption text-grey-5 q-mb-md">
            در صورت عدم تعریف دفترچه، تمامی سوالات در قالب یک دفترچه واحد ارزیابی می‌شوند.
          </div>
          <q-btn
            v-if="editable"
            outline
            color="primary"
            icon="add"
            label="افزودن اولین دفترچه"
            @click="addBooklet" />
        </div>
      </q-card-section>
    </q-card>
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
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const endsAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.ends_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const visibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const answersVisibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.answers_visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
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

<style scoped></style>
