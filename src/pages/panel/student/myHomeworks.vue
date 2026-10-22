<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="true"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'lesson'">
        {{ inputData.props.row.lesson?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'due_date'">
        {{ formatDate(inputData.props.row.due_date) }}
      </template>
      <template v-else-if="inputData.col.name === 'status'">
        <q-chip
          :color="getStatusColor(inputData.props.row)"
          text-color="white"
          dense>
          {{ getStatusLabel(inputData.props.row) }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <q-btn
          flat
          dense
          color="primary"
          icon="visibility"
          :to="{ name: 'Student.Homework.Show', params: { id: inputData.props.row.id } }" />
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import HomeworkAPI from 'src/repositories/homework'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'

const dateManager = useDate()
const homeworkApi = new HomeworkAPI()
const currentSchoolManager = useCurrentSchool()

const FormBuilderInputComponent = shallowRef(FormBuilderInput)
const FormBuilderSelectLessonComponent = shallowRef(FormBuilderSelectLesson)

const api = ref(homeworkApi.endpoints.myHomeworks)
const label = ref('تکالیف من')
const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    {
      name: 'title',
      required: true,
      label: 'عنوان تکلیف',
      align: 'center' as const,
      field: 'title',
      sortable: true
    },
    { name: 'lesson', label: 'درس', align: 'center' as const, field: 'lesson' },
    {
      name: 'due_date',
      label: 'مهلت',
      align: 'center' as const,
      field: 'due_date',
      sortable: true
    },
    {
      name: 'status',
      label: 'وضعیت',
      align: 'center' as const,
      field: 'status'
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})

const inputs = ref([
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'due_date'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'asc'
  },
  {
    type: 'hidden',
    name: 'length',
    value: 10
  },
  {
    type: 'hidden',
    name: 'school_id',
    value: currentSchoolManager.currentSchool.value?.id
  },
  {
    type: FormBuilderInputComponent,
    name: 'title',
    label: 'عنوان تکلیف',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectLessonComponent,
    name: 'lesson_id',
    label: 'درس',
    col: 'col-md-4 col-12'
  }
])

const entityIndexRef = ref()

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.isoToLocalShamsiDateTime(value) || value
}

// 🎯 مپ جامع ترجمه استاتوس‌های سرور به رنگ و لیبل UI
const HOMEWORK_STATUS_MAP: Record<string, { label: string; color: string }> = {
  reviewed: { label: 'بررسی شده', color: 'positive' },
  submitted: { label: 'ارسال شده', color: 'teal' },
  overdue: { label: 'مهلت پایان یافته', color: 'negative' },
  pending: { label: 'در انتظار ارسال', color: 'warning' }
}

const getStatusColor = (homework: any): string => {
  const state = homework?.student_status?.state
  if (state && HOMEWORK_STATUS_MAP[state]) {
    return HOMEWORK_STATUS_MAP[state].color
  }

  // فال‌بک تمیز در صورتی که ساختار داده هنوز کش یا قدیمی باشد
  const sub = homework?.submission
  if (sub?.submitted_at) return sub.feedback ? 'positive' : 'teal'
  return 'warning'
}

const getStatusLabel = (homework: any): string => {
  const state = homework?.student_status?.state
  if (state && HOMEWORK_STATUS_MAP[state]) {
    return HOMEWORK_STATUS_MAP[state].label
  }

  // فال‌بک تمیز در صورتی که ساختار داده هنوز کش یا قدیمی باشد
  const sub = homework?.submission
  if (sub?.submitted_at) return sub.feedback ? 'بررسی شده' : 'ارسال شده'
  return 'در انتظار ارسال'
}
</script>

<style lang="scss" scoped></style>
