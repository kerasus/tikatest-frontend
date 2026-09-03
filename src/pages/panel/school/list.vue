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
                  :to="{
                    name: 'Panel.School.AcademicTree',
                    params: { school_id: inputData.props.row.id },
                  }">
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
                  :to="{
                    name: 'Panel.School.Classes',
                    params: { school_id: inputData.props.row.id },
                  }">
                  <q-item-section avatar>
                    <q-icon
                      name="class_"
                      color="accent" />
                  </q-item-section>
                  <q-item-section>مدیریت کلاس‌ها</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  :to="{
                    name: 'Panel.School.Terms',
                    params: { school_id: inputData.props.row.id },
                  }">
                  <q-item-section avatar>
                    <q-icon
                      name="event_available"
                      color="secondary" />
                  </q-item-section>
                  <q-item-section>مدیریت ترم‌ها</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'type'">
        <q-chip
          :color="typeChipColor(inputData.props.row.type)"
          text-color="white"
          dense
          no-caps>
          {{ t(`schoolType.${inputData.props.row.type}`) }}
        </q-chip>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EntityIndex } from 'quasar-crud'
import SchoolAPI, {
  type SchoolType,
  SchoolTypeEnum,
  SCHOOL_TYPE_LABELS
} from 'src/repositories/school'

const { t } = useI18n()
const schoolAPI = new SchoolAPI()

const typeLabel = (type: string | null): string => {
  if (!type) return t('schoolType.null')
  return SCHOOL_TYPE_LABELS[type as SchoolTypeEnum] || '-'
}

const typeChipColor = (type: string | null): string => {
  if (type === SchoolTypeEnum.School) return 'primary'
  if (type === SchoolTypeEnum.Institute) return 'secondary'
  return 'grey'
}

const typeOptions = [
  { label: t('schoolType.school'), value: SchoolTypeEnum.School },
  { label: t('schoolType.institute'), value: SchoolTypeEnum.Institute }
]

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
    {
      name: 'type',
      label: 'نوع',
      align: 'center' as const,
      field: (row: SchoolType) => t(`schoolType.${row.type}`)
    },
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
</script>

<style lang="scss" scoped>
.school-list-page {
  width: 100%;
  margin: 0 auto;
}
</style>
