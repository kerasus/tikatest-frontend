<template>
  <div>
    <exam-detail-card
      :exam="exam"
      :school-id="schoolId"
      :editable="editable" />

    <q-card
      v-if="exam.in_person_exam_detail"
      class="q-mb-md">
      <q-card-section>
        <div class="text-h6">جزئیات آزمون حضوری</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.in_person_exam_detail.held_at"
              label="تاریخ برگزاری"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ heldAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-4">
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.in_person_exam_detail.results_visible_at"
              label="زمان نمایش نتایج به دانش‌آموزان"
              outlined
              dense />
            <template v-else>
              <div class="text-subtitle2">زمان نمایش نتایج به دانش‌آموزان:</div>
              <div class="text-body1">{{ resultsVisibleAtFormatted }}</div>
            </template>
          </div>
          <div class="col-12 col-md-4">
            <q-toggle
              v-if="editable"
              v-model="exam.in_person_exam_detail.is_descriptive"
              label="توصیفی"
              dense
              color="primary"
              checked-label="بله"
              unchecked-label="خیر" />
            <template v-else>
              <div class="text-subtitle2">توصیفی:</div>
              <q-chip
                :color="exam.in_person_exam_detail.is_descriptive ? 'primary' : 'grey'"
                text-color="white"
                dense>
                {{ exam.in_person_exam_detail.is_descriptive ? 'بله' : 'خیر' }}
              </q-chip>
            </template>
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
