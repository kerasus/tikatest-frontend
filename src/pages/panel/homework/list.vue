<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'schoolClass'">
        {{ inputData.props.row.schoolClass?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'due_date'">
        {{ formatDate(inputData.props.row.due_date) }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
          <q-btn
            color="secondary"
            flat
            icon="edit"
            :to="{ name: 'Panel.Homework.Edit', params: { id: inputData.props.row.id } }" />
          <delete-btn
            :row="inputData.props.row"
            :api="homeworkApi"
            :use-flag="false"
            @change="afterRemove" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { homework, HomeworkType } from 'src/repositories/homework'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import { useDate } from 'src/composables/Date'

const $q = useQuasar()
const dateManager = useDate()

const homeworkApi = homework

const api = ref(homework.endpoints.base)
const label = ref('تکالیف')
const createRouteName = ref('Panel.Homework.Create')
const showRouteName = ref('Panel.Homework.Show')
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
    { name: 'schoolClass', label: 'کلاس', align: 'center' as const, field: 'schoolClass' },
    {
      name: 'due_date',
      label: 'موعد تحویل',
      align: 'center' as const,
      field: 'due_date',
      sortable: true
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
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
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

const afterRemove = () => {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.miladiToShamsi(value, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || value
}
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
