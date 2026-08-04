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
      <template v-if="inputData.col.name === 'lesson'">
        {{ inputData.props.row.lesson?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'category'">
        {{ inputData.props.row.category?.title || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'delivery_mode'">
        <q-chip
          :color="inputData.props.row.delivery_mode === 'online' ? 'primary' : 'secondary'"
          text-color="white"
          dense>
          {{ inputData.props.row.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
        </q-chip>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn
            :row="inputData.props.row"
            :api="examApi"
            :use-flag="false"
            @change="afterRemove" />
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
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
import { exam } from 'src/repositories/exam'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'

const $q = useQuasar()
const FormBuilderSelectLessonComponent = shallowRef(FormBuilderSelectLesson)

const examApi = exam

const api = ref(exam.endpoints.base)
const label = ref('آزمون‌ها')
const createRouteName = ref('Panel.Exam.Create')
const showRouteName = ref('Panel.Exam.Show')
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
      name: 'name',
      required: true,
      label: 'نام آزمون',
      align: 'center' as const,
      field: 'name',
      sortable: true
    },
    { name: 'lesson', label: 'درس', align: 'center' as const, field: 'lesson' },
    { name: 'category', label: 'دسته‌بندی', align: 'center' as const, field: 'category' },
    { name: 'delivery_mode', label: 'نوع تحویل', align: 'center' as const, field: 'delivery_mode' },
    { name: 'created_at', label: 'تاریخ ثبت', align: 'center' as const, field: 'created_at' },
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
    name: 'name',
    label: 'نام آزمون',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectLessonComponent,
    name: 'lesson_id',
    label: 'درس',
    col: 'col-md-3 col-12'
  },
  {
    type: 'select',
    name: 'delivery_mode',
    label: 'نوع تحویل',
    col: 'col-md-3 col-12',
    options: [
      { label: 'آنلاین', value: 'online' },
      { label: 'حضوری', value: 'in_person' }
    ]
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
