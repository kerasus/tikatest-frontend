<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            flat
            icon="more"
            color="primary">
            <q-menu
              transition-show="jump-down"
              transition-hide="jump-up">
              <q-list>
                <q-item
                  v-close-popup
                  clickable
                  :to="{ name: showRouteName, params: { id: inputData.props.row.id } }">
                  <q-item-section avatar>
                    <q-icon
                      name="visibility"
                      color="primary" />
                  </q-item-section>
                  <q-item-section>مشاهده و ویرایش</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  :to="{ name: 'Panel.School.AcademicTree', params: { school_id: inputData.props.row.id } }">
                  <q-item-section avatar>
                    <q-icon
                      name="account_tree"
                      color="secondary" />
                  </q-item-section>
                  <q-item-section>ساختار دروس و مقاطع</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  :to="{ name: 'Panel.School.Classes', params: { school_id: inputData.props.row.id } }">
                  <q-item-section avatar>
                    <q-icon
                      name="class_"
                      color="accent" />
                  </q-item-section>
                  <q-item-section>مدیریت کلاس‌ها</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'type'">
        <q-chip
          :text="typeLabel(inputData.props.row.type)"
          :color="typeChipColor(inputData.props.row.type)"
          text-color="white"
          dense
          no-caps />
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EntityIndex } from 'quasar-crud'
import SchoolAPI from 'src/repositories/school'

const schoolAPI = new SchoolAPI()

const api = ref(schoolAPI.endpoints.base)
const label = ref('مدارس')
const createRouteName = ref('Panel.School.Create')
const showRouteName = ref('Panel.School.Show')
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
      name: 'code',
      required: true,
      label: 'کد',
      align: 'right' as const,
      field: 'code',
      sortable: true
    },
    {
      name: 'name',
      required: true,
      label: 'نام',
      align: 'right' as const,
      field: 'name',
      sortable: true
    },
    { name: 'type', label: 'نوع', align: 'center' as const, field: 'type' },
    { name: 'address', label: 'آدرس', align: 'right' as const, field: 'address' },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left' as const,
      field: () => ''
    }
  ]
})
const typeOptions = [
  { label: 'مدرسه', value: 'school' },
  { label: 'موسسه', value: 'institute' }
]

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
    label: 'جستجو در نام مدرسه',
    col: 'col-md-6 col-12'
  },
  {
    type: 'select',
    name: 'type',
    label: 'نوع',
    options: typeOptions,
    optionValue: 'value',
    optionLabel: 'label',
    clearable: true,
    outlined: true,
    dense: true,
    col: 'col-md-3 col-12'
  }
])

function typeLabel (type: string | null) {
  return typeOptions.find((o) => o.value === type)?.label || '-'
}

function typeChipColor (type: string | null) {
  if (type === 'school') return 'primary'
  if (type === 'institute') return 'secondary'
  return 'grey'
}
</script>

<style lang="scss" scoped>
.school-list-page {
  width: 100%;
  margin: 0 auto;
}
</style>
