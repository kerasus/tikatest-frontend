<template>
  <div class="homework-list-page">
    <crud-index
      ref="crudIndexRef"
      title="تکالیف"
      icon="assignment"
      :create-button="{ tooltip: 'ثبت تکلیف جدید', to: { name: createRouteName } }"
      :request="onRequest"
      :get-filters="getFilters"
      @reset="resetFiltersHandler">

      <!-- ۱. اسلات فیلترها -->
      <template #filters="{ search }">
        <div class="row q-col-gutter-md">
          <div
            v-if="!currentSchoolId"
            class="col-12 col-md-4">
            <form-builder-select-school
              v-model:value="filters.inSchool"
              label="مدرسه"
              outlined
              dense
              bg-color="white"
              @update:value="() => onSchoolChange(search)" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-select-academic-field
              :key="effectiveSchoolId ?? 'all-fields'"
              v-model:value="filters.field_id"
              label="رشته"
              outlined
              dense
              bg-color="white"
              :school-id="effectiveSchoolId"
              @update:value="() => onFieldChange(search)"
              @keyup.enter="() => search()" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-select-academic-level
              :key="`${effectiveSchoolId ?? 'all'}-${filters.field_id ?? 'all'}`"
              v-model:value="filters.academic_level_id"
              label="پایه"
              outlined
              dense
              bg-color="white"
              :school-id="effectiveSchoolId"
              :field-id="filters.field_id"
              @update:value="() => onLevelChange(search)"
              @keyup.enter="() => search()" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-select-school-class
              :key="`${effectiveSchoolId ?? 'all'}-${filters.field_id ?? 'all'}-${filters.academic_level_id ?? 'all'}`"
              v-model:value="filters.class_id"
              label="کلاس"
              outlined
              dense
              bg-color="white"
              :school-id="effectiveSchoolId"
              :field-id="filters.field_id"
              :level-id="filters.academic_level_id"
              @update:value="() => search()"
              @keyup.enter="() => search()" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-select-lesson
              :key="effectiveSchoolId ?? 'all-lessons'"
              v-model:value="filters.lesson_id"
              label="درس"
              outlined
              dense
              bg-color="white"
              :school-id="effectiveSchoolId"
              @update:value="() => search()"
              @keyup.enter="() => search()" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-select-term
              :key="effectiveSchoolId ?? 'all-terms'"
              v-model:value="filters.term_id"
              label="ترم"
              outlined
              dense
              bg-color="white"
              :school-id="effectiveSchoolId"
              @update:value="() => search()"
              @keyup.enter="() => search()" />
          </div>

          <div class="col-12 col-md-4">
            <form-builder-input
              v-model:value="filters.title"
              label="عنوان تکلیف"
              placeholder=" "
              outlined
              dense
              bg-color="white"
              @keyup.enter="() => search()" />
          </div>
        </div>
      </template>

      <!-- ۲. اسلات جدول -->
      <template #table="{ rows, loading, pagination, onRequest: tableRequest }">
        <q-table
          :pagination="pagination"
          class="homework-table"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          @request="tableRequest">

          <template #loading>
            <q-inner-loading
              showing
              color="primary">
              <q-spinner-dots
                size="45px"
                color="primary" />
              <div class="text-caption text-primary q-mt-xs">در حال دریافت تکالیف...</div>
            </q-inner-loading>
          </template>

          <template #body-cell-title="props">
            <q-td :props="props">
              <span class="text-weight-bold text-dark">{{ props.row.title || '-' }}</span>
            </q-td>
          </template>

          <template #body-cell-schoolClass="props">
            <q-td :props="props">
              {{ props.row.schoolClass?.name || '-' }}
            </q-td>
          </template>

          <template #body-cell-due_date="props">
            <q-td :props="props">
              {{ formatDate(props.row.due_date) }}
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="action-column-entity-index">
                <q-btn
                  color="primary"
                  flat
                  round
                  dense
                  icon="visibility"
                  :to="{ name: showRouteName, params: { id: props.row.id } }">
                  <q-tooltip>مشاهده جزئیات</q-tooltip>
                </q-btn>
                <q-btn
                  color="secondary"
                  flat
                  round
                  dense
                  icon="edit"
                  :to="{ name: 'Panel.Homework.Edit', params: { id: props.row.id } }">
                  <q-tooltip>ویرایش تکلیف</q-tooltip>
                </q-btn>
                <delete-btn
                  :row="props.row"
                  :api="homeworkApi"
                  :use-flag="false"
                  @change="afterRemove" />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="full-width column flex-center q-pa-xl text-grey-6">
              <q-icon
                name="sentiment_dissatisfied"
                size="48px"
                color="grey-4" />
              <div class="text-subtitle2 q-mt-sm">هیچ تکلیفی یافت نشد!</div>
            </div>
          </template>
        </q-table>
      </template>

    </crud-index>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useDate } from 'src/composables/Date'
import { homework } from 'src/repositories/homework'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import CrudIndex from 'src/components/CrudIndex/CrudIndex.vue'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import type { CrudPaginationState } from 'src/components/CrudIndex/CrudIndex.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const $q = useQuasar()
const dateManager = useDate()
const currentSchoolManager = useCurrentSchool()

const homeworkApi = homework
const crudIndexRef = ref()

const createRouteName = 'Panel.Homework.Create'
const showRouteName = 'Panel.Homework.Show'

const currentSchoolId = computed(() => currentSchoolManager?.currentSchool.value?.id ?? null)
const effectiveSchoolId = computed(() => filters.inSchool ?? currentSchoolId.value)

const filters = reactive({
  inSchool: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  term_id: null as number | null,
  title: ''
})

const columns = [
  { name: 'title', label: 'عنوان تکلیف', align: 'center' as const, field: 'title', sortable: true },
  { name: 'schoolClass', label: 'کلاس', align: 'center' as const, field: 'schoolClass' },
  { name: 'due_date', label: 'موعد تحویل', align: 'center' as const, field: 'due_date', sortable: true },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'id' }
]

const onRequest = async (
  _crudFilters: Record<string, unknown>,
  pagination: CrudPaginationState
) => {
  const params: Record<string, any> = {
    length: pagination.rowsPerPage,
    page: pagination.page,
    sortation_field: pagination.sortBy || 'created_at',
    sortation_order: pagination.descending ? 'desc' : 'asc'
  }

  const school = effectiveSchoolId.value
  if (school) params.inSchool = school
  if (filters.field_id) params.field_id = filters.field_id
  if (filters.academic_level_id) params.academic_level_id = filters.academic_level_id
  if (filters.class_id) params.class_id = filters.class_id
  if (filters.lesson_id) params.lesson_id = filters.lesson_id
  if (filters.term_id) params.term_id = filters.term_id
  if (filters.title.trim()) params.title = filters.title.trim()

  return await homeworkApi.index(params)
}

function onSchoolChange (search: () => void) {
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
  filters.lesson_id = null
  filters.term_id = null
  search()
}

function onFieldChange (search: () => void) {
  filters.academic_level_id = null
  filters.class_id = null
  search()
}

function onLevelChange (search: () => void) {
  filters.class_id = null
  search()
}

function getFilters () { return { ...filters } }

function resetFiltersHandler () {
  filters.title = ''
  filters.lesson_id = null
  filters.term_id = null
  filters.class_id = null
  filters.academic_level_id = null
  filters.field_id = null
  if (!currentSchoolId.value) {
    filters.inSchool = null
  }
  crudIndexRef.value?.search()
}

function afterRemove () {
  crudIndexRef.value?.refresh()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

function formatDate (value: string | null | undefined): string {
  if (!value) return '-'
  return dateManager.isoToLocalShamsiDate(value) || value
}

watch(
  currentSchoolId,
  (schoolId) => {
    if (schoolId) {
      filters.inSchool = schoolId
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}
</style>
