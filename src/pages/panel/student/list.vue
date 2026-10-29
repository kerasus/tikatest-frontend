<template>
  <div class="student-list-page">
    <crud-index
      ref="crudIndexRef"
      title="مدیریت دانش‌آموزان"
      icon="school"
      :create-button="{
        tooltip: 'ثبت دانش‌آموز جدید',
        to: { name: 'Panel.Student.Create' },
      }"
      :request="onRequest"
      :get-filters="getFilters"
      @reset="resetFiltersHandler">
      <!-- ۱. بخش فیلترها -->
      <template #filters="{ search }">
        <div class="row q-col-gutter-md">
          <div
            v-if="!currentSchoolId"
            class="col-12 col-md-12">
            <form-builder-select-school
              v-model:value="filters.school_id"
              label="مدرسه"
              outlined
              dense
              bg-color="white"
              @update:value="() => onSchoolChange(search)" />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-select-academic-field
              :key="filters.school_id ?? 'all-schools'"
              v-model:value="filters.field_id"
              label="رشته تحصیلی"
              outlined
              dense
              bg-color="white"
              :school-id="filters.school_id"
              @update:value="() => onFieldChange(search)"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-select-academic-level
              :key="`${filters.school_id ?? 'all'}-${filters.field_id ?? 'all'}`"
              v-model:value="filters.academic_level_id"
              label="پایه تحصیلی"
              outlined
              dense
              bg-color="white"
              :school-id="filters.school_id"
              :field-id="filters.field_id"
              @update:value="() => onLevelChange(search)"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-select-school-class
              :key="`${filters.school_id ?? 'all'}-${filters.field_id ?? 'all'}-${filters.academic_level_id ?? 'all'}`"
              v-model:value="filters.class_id"
              label="کلاس"
              outlined
              dense
              bg-color="white"
              :school-id="filters.school_id"
              :field-id="filters.field_id"
              :level-id="filters.academic_level_id"
              @update:value="() => search()"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.bale_status"
              :options="[{label:'همه',value:null},{label:'متصل',value:'connected'},{label:'عدم اتصال',value:'not_connected'}]"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="وضعیت بله"
              outlined
              dense
              bg-color="white"
              @update:model-value="() => search()" />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-input
              v-model:value="filters.first_name"
              label="نام"
              outlined
              dense
              bg-color="white"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-input
              v-model:value="filters.last_name"
              label="نام خانوادگی"
              outlined
              dense
              bg-color="white"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-input
              v-model:value="filters.national_id"
              label="کد ملی"
              outlined
              dense
              bg-color="white"
              @keyup.enter="() => search()" />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <form-builder-input
              v-model:value="filters.username"
              label="نام کاربری"
              outlined
              dense
              bg-color="white"
              @keyup.enter="() => search()" />
          </div>
        </div>
      </template>

      <!-- ۲. بخش جدول -->
      <template #table="{ rows, loading, pagination, onRequest: tableRequest }">
        <q-table
          :pagination="pagination"
          class="student-table"
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
                size="50px"
                color="primary" />
              <div class="text-caption text-primary q-mt-sm">در حال بارگذاری لیست...</div>
            </q-inner-loading>
          </template>

          <template #body-cell-picture="props">
            <q-td :props="props">
              <q-avatar
                size="40px"
                class="shadow-1">
                <img
                  :src="props.row.picture ?? '/images/blankProfile.png'"
                  alt="avatar">
              </q-avatar>
            </q-td>
          </template>

          <template #body-cell-first_name="props">
            <q-td :props="props">
              <span class="text-weight-bold text-dark">{{ props.row.first_name }}</span>
            </q-td>
          </template>

          <template #body-cell-last_name="props">
            <q-td :props="props">
              <span class="text-weight-bold text-dark">{{ props.row.last_name }}</span>
            </q-td>
          </template>

          <template #body-cell-username="props">
            <q-td :props="props">
              <q-badge
                outline
                color="indigo-7"
                class="q-px-sm q-py-xs cursor-pointer username-badge"
                @click="copyUsername(props.row.username)">
                @{{ props.row.username }}
                <q-icon
                  name="content_copy"
                  size="12px"
                  class="q-ml-xs" />
                <q-tooltip>کلیک برای کپی نام کاربری</q-tooltip>
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-bale="props">
            <q-td :props="props">
              <div
                v-if="props.row.bale_username || props.row.bale_chat_id"
                class="column items-center q-gutter-xs">
                <img
                  src="/images/bale.webp"
                  alt="بله"
                  style="width:24px;height:24px;object-fit:contain">
                <div class="text-caption">{{ props.row.bale_username || '-' }}</div>
                <div class="text-caption">{{ props.row.bale_chat_id || '-' }}</div>
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-xs">
                <q-btn
                  round
                  dense
                  flat
                  color="primary"
                  icon="visibility"
                  :to="{ name: 'Panel.Student.Show', params: { id: props.row.id } }">
                  <q-tooltip>مشاهده جزئیات</q-tooltip>
                </q-btn>
                <delete-btn
                  :row="props.row"
                  :api="studentAPI"
                  @change="afterRemove" />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="full-width column flex-center q-pa-xl text-grey-6">
              <q-icon
                name="sentiment_dissatisfied"
                size="54px"
                color="grey-4" />
              <div class="text-subtitle1 q-mt-md text-weight-bold">هیچ دانش‌آموزی یافت نشد!</div>
            </div>
          </template>
        </q-table>
      </template>
    </crud-index>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import StudentAPI from 'src/repositories/student'
import CrudIndex from 'src/components/CrudIndex/CrudIndex.vue'
import type { CrudPaginationState } from 'src/components/CrudIndex/CrudIndex.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const studentAPI = new StudentAPI()
const currentSchoolManager = useCurrentSchool()
const currentSchoolId = computed(() => currentSchoolManager.currentSchool.value?.id ?? null)
const $q = useQuasar()
const crudIndexRef = ref()

const filters = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  first_name: '',
  last_name: '',
  national_id: '',
  username: '',
  bale_status: null as string | null
})

const columns = [
  { name: 'picture', label: 'پروفایل', align: 'center' as const, field: 'picture' },
  { name: 'first_name', label: 'نام', align: 'left' as const, field: 'first_name' },
  { name: 'last_name', label: 'نام خانوادگی', align: 'left' as const, field: 'last_name' },
  { name: 'username', label: 'نام کاربری', align: 'center' as const, field: 'username' },
  { name: 'bale', label: 'بله', align: 'center' as const, field: 'bale_chat_id' },
  { name: 'mobile', label: 'تلفن همراه', align: 'center' as const, field: 'mobile' },
  { name: 'national_id', label: 'کد ملی', align: 'center' as const, field: 'national_id' },
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

  if (filters.school_id) params.school_id = filters.school_id
  if (filters.field_id) params.field_id = filters.field_id
  if (filters.academic_level_id) params.academic_level_id = filters.academic_level_id
  if (filters.class_id) params.class_id = filters.class_id
  if (filters.first_name.trim()) params.first_name = filters.first_name.trim()
  if (filters.last_name.trim()) params.last_name = filters.last_name.trim()
  if (filters.national_id.trim()) params.national_id = filters.national_id.trim()
  if (filters.username.trim()) params.username = filters.username.trim()
  if (filters.bale_status) params.bale_status = filters.bale_status

  return await studentAPI.index(params)
}

function copyUsername (username: string) {
  copyToClipboard(username)
    .then(() => {
      $q.notify({
        message: `نام کاربری (@${username}) کپی شد!`,
        color: 'positive',
        position: 'top',
        timeout: 1500,
        icon: 'content_copy'
      })
    })
    .catch(() => {
      $q.notify({ message: 'خطا در کپی کردن', color: 'negative', position: 'top' })
    })
}

function onSchoolChange (search: () => void) {
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
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
  filters.first_name = ''
  filters.last_name = ''
  filters.national_id = ''
  filters.username = ''
  filters.bale_status = null
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
  if (!currentSchoolId.value) {
    filters.school_id = null
  }
  crudIndexRef.value?.search()
}

function afterRemove () {
  crudIndexRef.value?.refresh()
  $q.notify({ message: 'دانش‌آموز با موفقیت حذف گردید.', type: 'positive', position: 'top' })
}

watch(currentSchoolId, (schoolId) => {
  if (schoolId) {
    filters.school_id = schoolId
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.username-badge {
  transition: all 0.2s ease;
  &:hover {
    background-color: #e0e7ff !important;
    transform: scale(1.05);
  }
}

// استایل پجینیشن ۷ دکمه‌ای که در EntityIndex.scss یا CrudPagination اعمال می‌شود
// اگر استایل خاصی در این صفحه نیاز است، اینجا بماند.
</style>
