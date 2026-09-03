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
      <template v-if="inputData.col.name === 'school'">
        {{ inputData.props.row.school?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'is_system'">
        <q-chip
          :color="inputData.props.row.is_system ? 'positive' : 'grey'"
          text-color="white"
          dense>
          {{ inputData.props.row.is_system ? 'سیستمی' : 'سفارشی' }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
          <q-btn
            v-if="isAdmin && !inputData.props.row.is_system"
            color="primary"
            flat
            icon="edit"
            :to="{ name: editRouteName, params: { id: inputData.props.row.id } }" />
          <delete-btn
            v-if="isAdmin && !inputData.props.row.is_system"
            :row="inputData.props.row"
            :api="examCategoryApi"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import { useUser } from 'src/stores/user'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import { examCategory, ExamCategoryType } from 'src/repositories/examCategory'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'

const $q = useQuasar()
const dateManager = useDate()
const { isAdmin } = useUser()
const examCategoryApi = examCategory

const api = ref(examCategory.endpoints.base)
const label = ref('دسته‌بندی‌های آزمون')
const createRouteName = ref('Panel.ExamCategory.Create')
const showRouteName = ref('Panel.ExamCategory.Show')
const editRouteName = ref('Panel.ExamCategory.Edit')
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
      label: 'عنوان',
      align: 'right',
      field: 'title',
      sortable: true
    },
    { name: 'term_number', label: 'شماره ترم', align: 'center', field: 'term_number' },
    { name: 'school', label: 'مدرسه', align: 'center', field: 'school' },
    { name: 'is_system', label: 'نوع', align: 'center', field: 'is_system' },
    {
      name: 'created_at',
      required: true,
      label: 'تاریخ ثبت',
      align: 'left',
      field: (row: ExamCategoryType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
            row.created_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
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
    type: FormBuilderSelectSchool,
    name: 'school_id',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInput,
    name: 'title',
    label: 'عنوان',
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
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
