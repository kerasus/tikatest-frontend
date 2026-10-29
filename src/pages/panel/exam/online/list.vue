<template>
  <div class="online-exam-list-page">
    <crud-index
      ref="crudIndexRef"
      title="آزمون‌ها"
      icon="quiz"
      :create-button="{tooltip: 'افزودن آزمون جدید', to: { name: createRouteName }}"
      :request="onRequest"
      :get-filters="getFilters"
      @reset="resetFiltersHandler">

      <!-- ۲. اسلات فیلترها -->
      <template #filters="{ search }">
        <div class="row q-col-gutter-md">
          <div
            v-if="!currentSchoolId"
            class="col-12 col-md-4">
            <form-builder-select-school
              v-model:value="filters.school_id"
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
            <form-builder-input
              v-model:value="filters.name"
              label="نام آزمون"
              placeholder=" "
              outlined
              dense
              bg-color="white"
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
            <form-builder-select-exam-category
              v-model:value="filters.exam_category_id"
              label="دسته‌بندی آزمون"
              outlined
              dense
              bg-color="white"
              @update:value="() => search()"
              @keyup.enter="() => search()" />
          </div>
        </div>
      </template>

      <!-- ۳. اسلات جدول -->
      <template #table="{ rows, loading, pagination, onRequest }">
        <q-table
          :pagination="pagination"
          class="online-exam-table"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          @request="onRequest">

          <template #loading>
            <q-inner-loading
              showing
              color="primary">
              <q-spinner-dots
                size="45px"
                color="primary" />
              <div class="text-caption text-primary q-mt-xs">در حال دریافت آزمون‌ها...</div>
            </q-inner-loading>
          </template>

          <template #body-cell-name="props">
            <q-td :props="props">
              <span class="text-weight-bold text-dark">{{ props.row.name || '-' }}</span>
            </q-td>
          </template>

          <template #body-cell-lesson="props">
            <q-td :props="props">
              {{ props.row.lesson?.name || '-' }}
            </q-td>
          </template>

          <template #body-cell-category="props">
            <q-td :props="props">
              {{ props.row.category?.title || '-' }}
            </q-td>
          </template>

          <template #body-cell-created_at="props">
            <q-td :props="props">
              {{ props.row.created_at ? dateManager.isoToLocalShamsi(props.row.created_at) : '-' }}
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="action-column-entity-index">
                <q-btn
                  class="icon-button"
                  color="secondary"
                  flat
                  round
                  dense
                  icon="notifications_active"
                  :loading="notifyingExamId === props.row.id"
                  :disable="notifyingExamId !== null"
                  @click="confirmNotification(props.row)">
                  <q-tooltip>اطلاع‌رسانی به دانش‌آموزان شرکت‌نکرده</q-tooltip>
                </q-btn>

                <q-btn
                  class="icon-button"
                  color="primary"
                  flat
                  round
                  dense
                  icon="visibility"
                  :to="{ name: showRouteName, params: { id: props.row.id } }">
                  <q-tooltip>مشاهده جزئیات</q-tooltip>
                </q-btn>

                <delete-btn
                  :row="props.row"
                  :api="examApi"
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
              <div class="text-subtitle2 q-mt-sm">هیچ آزمونی یافت نشد!</div>
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
import { exam, type ExamType } from 'src/repositories/exam'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import CrudIndex from 'src/components/CrudIndex/CrudIndex.vue'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import type { CrudPaginationState } from 'src/components/CrudIndex/CrudIndex.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectExamCategory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const $q = useQuasar()
const dateManager = useDate()
const currentSchoolManager = useCurrentSchool()

const crudIndexRef = ref()
const examApi = exam

const createRouteName = 'Panel.Exam.Online.Create'
const showRouteName = 'Panel.Exam.Online.Show'

const currentSchoolId = computed(() => currentSchoolManager.currentSchool.value?.id ?? null)
const effectiveSchoolId = computed(() => filters.school_id || currentSchoolId.value)

const notifyingExamId = ref<number | null>(null)

const filters = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  exam_category_id: null as number | null,
  name: ''
})

const columns = [
  { name: 'name', label: 'نام آزمون', align: 'left' as const, field: 'name' },
  { name: 'lesson', label: 'درس', align: 'center' as const, field: 'lesson' },
  { name: 'category', label: 'دسته‌بندی', align: 'center' as const, field: 'category' },
  { name: 'created_at', label: 'تاریخ ثبت', align: 'center' as const, field: 'created_at' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'id' }
]

const fetchExams = (params: Record<string, any>) => {
  return exam.index(params)
}

function getFilters (): Record<string, any> {
  const result: Record<string, any> = {
    delivery_mode: 'online'
  }

  const school = effectiveSchoolId.value
  if (school) result.inSchool = school
  if (filters.field_id) result.field_id = filters.field_id
  if (filters.academic_level_id) result.academic_level_id = filters.academic_level_id
  if (filters.class_id) result.class_id = filters.class_id
  if (filters.lesson_id) result.lesson_id = filters.lesson_id
  if (filters.exam_category_id) result.exam_category_id = filters.exam_category_id
  if (filters.name?.trim()) result.name = filters.name.trim()

  return result
}

function onSchoolChange (search: () => void) {
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
  filters.lesson_id = null
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

const onRequest = async (
  _crudFilters: Record<string, unknown>,
  pagination: CrudPaginationState
) => {
  // فیلترهای فعال فرم + دلیوری مود آنلاین
  const queryParams: Record<string, any> = {
    delivery_mode: 'online',
    page: pagination.page,
    length: pagination.rowsPerPage,
    sort_by: pagination.sortBy,
    descending: pagination.descending ? 1 : 0
  }

  const school = effectiveSchoolId.value
  if (school) queryParams.inSchool = school
  if (filters.field_id) queryParams.field_id = filters.field_id
  if (filters.academic_level_id) queryParams.academic_level_id = filters.academic_level_id
  if (filters.class_id) queryParams.class_id = filters.class_id
  if (filters.lesson_id) queryParams.lesson_id = filters.lesson_id
  if (filters.exam_category_id) queryParams.exam_category_id = filters.exam_category_id
  if (filters.name?.trim()) queryParams.name = filters.name.trim()

  return await exam.index(queryParams)
}

function resetFiltersHandler () {
  filters.name = ''
  filters.lesson_id = null
  filters.exam_category_id = null
  filters.class_id = null
  filters.academic_level_id = null
  filters.field_id = null
  if (!currentSchoolId.value) {
    filters.school_id = null
  }
  crudIndexRef.value?.search()
}

function confirmNotification (item: ExamType) {
  if (item.id === null) return

  $q.dialog({
    title: 'تأیید اطلاع‌رسانی',
    message: `به دانش‌آموزانی که در آزمون «${item.name || ''}» شرکت نکرده‌اند، از طریق بله اطلاع‌رسانی شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    if (notifyingExamId.value !== null || item.id === null) return

    notifyingExamId.value = item.id
    try {
      const stats = await examApi.notifyUnparticipatedStudents(item.id)
      $q.notify({
        type: stats.failed ? 'warning' : 'positive',
        message: `ارسال: ${stats.sent}، بدون اتصال بله: ${stats.skipped}، ناموفق: ${stats.failed}`
      })
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'خطا در ارسال اطلاع‌رسانی'
      })
    } finally {
      notifyingExamId.value = null
    }
  })
}

function afterRemove () {
  crudIndexRef.value?.refresh()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

watch(
  currentSchoolId,
  (schoolId) => {
    if (schoolId) {
      filters.school_id = schoolId
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
</style>
