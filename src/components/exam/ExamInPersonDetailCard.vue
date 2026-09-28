<template>
  <div>
    <!-- کارت اطلاعات کلی پایه و عمومی -->
    <exam-detail-card
      :exam="exam"
      :school-id="schoolId"
      :editable="editable" />

    <!-- کارت جزییات آزمون حضوری -->
    <q-card
      v-if="exam.in_person_exam_detail"
      flat
      bordered
      class="rounded-borders q-mb-md">
      <!-- هدر سکشن -->
      <q-card-section class="bg-blue-grey-1 q-py-sm">
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-avatar
              size="32px"
              color="teal"
              text-color="white"
              icon="school"
              class="q-mr-sm shadow-1" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                جزئیات و زمان‌بندی آزمون حضوری
              </div>
              <div class="text-caption text-grey-7">
                زمان برگزاری در محل، انتشار کارنامه و نوع ارزیابی (نمره‌ای / توصیفی)
              </div>
            </div>
          </div>

          <q-badge
            :color="exam.in_person_exam_detail.is_descriptive ? 'purple' : 'teal'"
            class="text-weight-bold q-px-sm">
            <q-icon
              :name="exam.in_person_exam_detail.is_descriptive ? 'spellcheck' : 'format_list_numbered'"
              size="14px"
              class="q-mr-xs" />
            {{ exam.in_person_exam_detail.is_descriptive ? 'ارزیابی کیفی / توصیفی' : 'ارزیابی کمی / نمره‌ای' }}
          </q-badge>
        </div>
      </q-card-section>

      <q-separator />

      <!-- محتوای فیلدها -->
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-stretch">

          <!-- تاریخ و زمان برگزاری -->
          <div class="col-12 col-md-4">
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.in_person_exam_detail.held_at"
              label="تاریخ و زمان برگزاری حضوری"
              outlined
              dense />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6 flex items-center">
                <q-icon
                  name="event"
                  size="14px"
                  class="q-mr-xs text-teal" />
                تاریخ برگزاری در مدرسه:
              </div>
              <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                {{ heldAtFormatted }}
              </div>
            </div>
          </div>

          <!-- زمان انتشار نتایج -->
          <div class="col-12 col-md-4">
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.in_person_exam_detail.results_visible_at"
              label="زمان نمایش نتایج به دانش‌آموزان"
              outlined
              dense />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6 flex items-center">
                <q-icon
                  name="visibility"
                  size="14px"
                  class="q-mr-xs text-primary" />
                زمان نمایش کارنامه:
              </div>
              <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                {{ resultsVisibleAtFormatted }}
              </div>
            </div>
          </div>

          <!-- نوع ارزیابی: توصیفی / نمره‌ای -->
          <div class="col-12 col-md-4">
            <div
              v-if="editable"
              class="bg-grey-1 q-px-md q-py-xs rounded-borders border row items-center justify-between full-height">
              <div>
                <div class="text-caption text-weight-bold text-blue-grey-9">آزمون توصیفی (کیفی)</div>
                <div class="text-caption text-grey-6">بدون نمره عددی (خیلی خوب، خوب، ...)</div>
              </div>
              <q-toggle
                v-model="exam.in_person_exam_detail.is_descriptive"
                color="purple"
                dense />
            </div>

            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6 flex items-center">
                <q-icon
                  name="grade"
                  size="14px"
                  class="q-mr-xs text-purple" />
                نوع نمره‌دهی:
              </div>
              <div class="row items-center q-mt-xs">
                <q-chip
                  :color="exam.in_person_exam_detail.is_descriptive ? 'purple-1' : 'teal-1'"
                  :text-color="exam.in_person_exam_detail.is_descriptive ? 'purple-9' : 'teal-9'"
                  dense
                  class="text-weight-bold q-px-sm">
                  {{ exam.in_person_exam_detail.is_descriptive ? 'نظام کیفی - توصیفی' : 'نظام نمره‌ای (کمی)' }}
                </q-chip>
              </div>
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import type { ExamType } from 'src/repositories/exam'
import type { LessonType } from 'src/repositories/lesson'
import type { ExamCategoryType } from 'src/repositories/examCategory'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'

const props = defineProps<{
  editable?: boolean;
  schoolId?: number;
  lessonOptions?: LessonType[];
  categoryOptions?: ExamCategoryType[];
}>()
const exam = defineModel<ExamType>('exam')
const dateManager = useDate()

const heldAtFormatted = computed(() => {
  const raw = exam.value.in_person_exam_detail?.held_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const resultsVisibleAtFormatted = computed(() => {
  const raw = exam.value.in_person_exam_detail?.results_visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const classIds = computed({
  get: () => exam.value.classes?.map((c: any) => c.id) || [],
  set: (val: any[]) => {
    exam.value.classes = (val || []).map((id) => ({ id })) as any[]
  }
})

const levelIds = computed({
  get: () => exam.value.academic_levels?.map((l: any) => l.id) || [],
  set: (val: any[]) => {
    exam.value.academic_levels = (val || []).map((id) => ({ id })) as any[]
  }
})
</script>

<style scoped></style>
