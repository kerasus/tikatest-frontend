<template>
  <div>
    <exam-detail-card
      :exam="exam"
      :editable="editable"
      :lesson-options="lessonOptions"
      :category-options="categoryOptions" />

    <q-card
      v-if="exam.in_person_exam_detail"
      class="q-mb-md">
      <q-card-section>
        <div class="text-h6">جزئیات آزمون حضوری</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
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
          <div class="col-12 col-md-6">
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

        <q-separator class="q-my-md" />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">پایه های انتخابی:</div>
            <q-chip
              v-for="level in exam.academic_levels"
              :key="level.id"
              color="primary"
              text-color="white"
              dense>
              {{ level.name || '-' }}
            </q-chip>
            <span
              v-if="!exam.academic_levels?.length"
              class="text-grey">هیچ سطح آموزشی انتخاب نشده است.</span>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">کلاس های انتخابی:</div>
            <q-chip
              v-for="cls in exam.classes"
              :key="cls.id"
              color="secondary"
              text-color="white"
              dense>
              {{ cls.name || '-' }}
            </q-chip>
            <span
              v-if="!exam.classes?.length"
              class="text-grey">هیچ کلاسی انتخاب نشده است.</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import { ExamType } from 'src/repositories/exam'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import { ExamCategoryType } from 'src/repositories/examCategory'
import { LessonType } from 'src/repositories/lesson'

const exam = defineModel<ExamType>('exam')
const props = defineProps<{
  editable?: boolean;
  lessonOptions?: LessonType[];
  categoryOptions?: ExamCategoryType[];
}>()

const dateManager = useDate()

const heldAtFormatted = computed(() => {
  const raw = exam.value.in_person_exam_detail?.held_at
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
