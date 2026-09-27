<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="flex justify-between">
        <div class="text-h6">اطلاعات کلی آزمون</div>
        <div class="actions">
          <q-btn
            v-if="!editable"
            flat
            label="بازگشت"
            :to="{ name: examListRouteName }" />
          <q-btn
            v-if="!editable && exam?.delivery_mode === 'online'"
            color="secondary"
            label="جلسات آزمون"
            icon="menu_book"
            :to="{ name: 'Panel.Exam.Sessions', params: { id: exam?.id } }"
            class="q-ml-sm" />
          <q-btn
            v-if="!editable"
            color="primary"
            label="ویرایش آزمون"
            :to="{ name: editExamRouteName, params: { id: exam?.id } }"
            class="q-ml-sm" />
          <q-btn
            v-if="editable && exam?.id"
            flat
            label="انصراف"
            :to="{ name: showExamRouteName, params: { id: exam?.id } }" />
          <q-btn
            v-if="editable && !exam?.id"
            flat
            label="انصراف"
            :to="{ name: examListRouteName }" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <form-builder-select-exam-category
            v-if="editable"
            v-model:value="exam.exam_category_id"
            :school-id="schoolId"
            clearable />
          <div v-else>
            <div class="text-subtitle2">دسته‌بندی:</div>
            <div class="text-body1">{{ exam.category?.title || '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-if="editable"
            v-model="exam.name"
            label="نام آزمون"
            outlined
            dense />
          <div v-else>
            <div class="text-subtitle2">نام آزمون:</div>
            <div class="text-body1">
              {{ exam.name || '-' }}
              <q-chip
                v-if="!editable"
                color="info"
                text-color="white">
                {{ exam?.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
              </q-chip>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <form-builder-select-lesson
            v-if="editable"
            v-model:value="exam.lesson_id"
            :school-id="schoolId"
            clearable />
          <div v-else>
            <div class="text-subtitle2">درس:</div>
            <div class="text-body1">{{ exam.lesson?.name || '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <form-builder-select-term
            v-if="editable"
            v-model:value="exam.term_id"
            :school-id="schoolId"
            active-only
            label="ترم"
            outlined
            dense
            clearable />
          <div v-else>
            <div class="text-subtitle2">ترم:</div>
            <div class="text-body1">{{ exam.term?.name || '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-if="editable"
            v-model.number="exam.min_passing_score"
            label="حداقل نمره قبولی"
            outlined
            dense
            type="number"
            step="0.01" />
          <div v-else>
            <div class="text-subtitle2">حداقل نمره قبولی:</div>
            <div class="text-body1">{{ exam.min_passing_score ?? '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-if="editable"
            v-model.number="exam.max_score"
            label="حداکثر نمره"
            outlined
            dense
            type="number"
            step="0.01" />
          <div v-else>
            <div class="text-subtitle2">حداکثر نمره:</div>
            <div class="text-body1">{{ exam.max_score ?? '-' }}</div>
          </div>
        </div>
        <div
          v-if="!editable"
          class="col-12 col-md-4">
          <div class="text-subtitle2">ایجاد کننده:</div>
          {{ `${exam.created_by?.first_name} ${exam.created_by?.last_name}` }}
          <q-chip
            v-if="exam.created_by?.username"
            color="primary"
            text-color="white">
            {{ exam.created_by?.username }}
          </q-chip>
        </div>
        <div
          v-if="exam.description"
          class="col-12">
          <div class="text-subtitle2">توضیحات:</div>
          <q-input
            v-if="editable"
            v-model="exam.description"
            label="توضیحات"
            outlined
            dense
            type="textarea"
            rows="3" />
          <div v-else>
            <div class="text-subtitle2">توضیحات:</div>
            <div class="text-body1">{{ exam.description }}</div>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />

      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <form-builder-select-academic-level
              v-if="editable"
              v-model:value="levelIds"
              label="پایه‌ها"
              :school-id="schoolId"
              outlined
              clearable
              multiple
              use-chips />
            <div v-else>
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
          </div>
          <div class="col-12 col-md-6">
            <form-builder-select-school-class
              v-if="editable"
              v-model:value="classIds"
              label="کلاس‌ها"
              :school-id="schoolId"
              outlined
              clearable
              multiple
              use-chips />
            <div v-else>
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
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExamType } from 'src/repositories/exam'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectExamCategory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'
import FormBuilderSelectTerm from 'components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectSchoolClass from 'components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel
  from 'components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

defineProps<{
  editable?: boolean;
  schoolId?: number;
}>()
const exam = defineModel<ExamType>('exam')
const examListRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.List'
  }

  return 'Panel.Exam.InPerson.List'
})

const editExamRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.Edit'
  }

  return 'Panel.Exam.InPerson.Edit'
})

const showExamRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.Show'
  }

  return 'Panel.Exam.InPerson.Show'
})

const levelIds = computed({
  get: () => exam.value.academic_levels?.map((l: any) => l.id) || [],
  set: (val: any[]) => {
    exam.value.academic_level_ids = val || []
    exam.value.academic_levels = (val || []).map((id) => ({ id })) as any[]
  }
})

const classIds = computed({
  get: () => exam.value.classes?.map((c: any) => c.id) || [],
  set: (val: any[]) => {
    exam.value.class_ids = val || []
    exam.value.classes = (val || []).map((id) => ({ id })) as any[]
  }
})
</script>

<style scoped></style>
