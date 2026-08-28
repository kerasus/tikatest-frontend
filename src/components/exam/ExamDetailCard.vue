<template>
  <q-card class="q-mb-md">
    <q-card-section style="margin-bottom: 1px;">
      <div class="flex justify-between">
        <div class="text-h6">جزئیات آزمون</div>
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
            v-if="editable"
            flat
            label="انصراف"
            :to="{ name: showExamRouteName, params: { id: exam?.id } }" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-select
            v-if="editable"
            v-model="exam.exam_category_id"
            :options="categoryOptions"
            option-value="id"
            option-label="title"
            label="دسته‌بندی"
            outlined
            dense
            emit-value
            map-options
            clearable />
          <div v-else>
            <div class="text-subtitle2">دسته‌بندی:</div>
            <div class="text-body1">{{ exam.category?.title || '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-4">
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
        <div class="col-12 col-md-4">
          <form-builder-select-lesson
            v-if="editable"
            v-model:value="exam.lesson_id"
            label="درس"
            outlined
            clearable />
          <div v-else>
            <div class="text-subtitle2">درس:</div>
            <div class="text-body1">{{ exam.lesson?.name || '-' }}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
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
        <div class="col-12 col-md-6">
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
    </q-card-section>
  </q-card>

  <q-card
    v-if="!editable"
    class="q-mb-md">
    <q-card-section>
      <div class="text-h6">اطلاعات ایجاد کننده</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">نام و نام خانوادگی:</div>
          <div class="text-body1">
            {{ `${exam.created_by?.first_name} ${exam.created_by?.last_name}` }}
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">نام کاربری:</div>
          <div class="text-body1">{{ exam.created_by?.username || '-' }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ExamType } from 'src/repositories/exam'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import { ExamCategoryType } from 'src/repositories/examCategory'
import { LessonType } from 'src/repositories/lesson'
import { computed } from 'vue'

const exam = defineModel<ExamType>('exam')
const props = defineProps<{
  editable?: boolean;
  lessonOptions?: LessonType[];
  categoryOptions?: ExamCategoryType[];
}>()

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
</script>

<style scoped></style>
