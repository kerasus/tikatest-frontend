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
        <q-btn
          v-if="!getOwner(inputData.props.row)?.submitted_at"
          flat
          dense
          color="positive"
          icon="send"
          :to="{ name: 'Student.Homework.Submit', params: { id: inputData.props.row.id } }" />
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkOwnerType } from 'src/repositories/homework'

const $q = useQuasar()
const dateManager = useDate()

const homeworkApi = new HomeworkAPI()

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
    type: 'input',
    name: 'title',
    label: 'عنوان تکلیف',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  }
])

const entityIndexRef = ref()

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.miladiToShamsi(value, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || value
}

const getOwner = (
  homework: HomeworkType & { owners?: HomeworkOwnerType[] }
): HomeworkOwnerType | undefined => {
  return homework.owners?.[0]
}

const getStatusColor = (homework: HomeworkType & { owners?: HomeworkOwnerType[] }): string => {
  const owner = getOwner(homework)
  if (!owner) return 'info'
  return owner.submitted_at ? 'positive' : 'info'
}

const getStatusLabel = (homework: HomeworkType & { owners?: HomeworkOwnerType[] }): string => {
  const owner = getOwner(homework)
  if (!owner) return 'در انتظار ارسال'
  return owner.submitted_at ? 'ارسال شده' : 'در انتظار ارسال'
}
</script>

<style lang="scss" scoped></style>
