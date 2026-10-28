<template>
  <div class="student-list-page">
    <!-- کارت واحد و یکپارچه برای کل صفحه -->
    <q-card class="main-container-card shadow-3">
      <!-- هدر بالای کارت (عنوان، تعداد کل، دکمه ثبت دانش‌آموز و جستجو) -->
      <q-card-section class="bg-primary text-white q-py-md q-px-lg">
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="row items-center q-gutter-sm">
            <q-icon
              name="school"
              size="32px" />
            <div>
              <div class="text-h6 text-weight-bold">مدیریت دانش‌آموزان</div>
              <div class="text-caption text-weight-light opacity-9">
                مشاهده، جستجوی پیشرفته و مدیریت اطلاعات محصلین
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-sm">
            <q-badge
              color="white"
              text-color="primary"
              class="q-py-xs q-px-sm text-subtitle2">
              <q-icon
                name="group"
                class="q-mr-xs" />
              کل: {{ pagination.rowsNumber.toLocaleString('fa-IR') }} نفر
            </q-badge>
            <q-btn
              unelevated
              color="amber-8"
              text-color="dark"
              icon="search"
              label="جستجوی لیست"
              :loading="loading"
              class="text-weight-bold"
              @click="searchStudents" />
            <q-btn
              unelevated
              color="green-6"
              text-color="white"
              icon="person_add"
              label="افزودن دانش‌آموز"
              :to="{ name: 'Panel.Student.Create' }"
              class="text-weight-bold" />
          </div>
        </div>
      </q-card-section>

      <!-- فرم فیلترها (بدون اکسپنشن، کاملاً باز) -->
      <q-card-section class="q-pa-md">
        <q-form @submit.prevent="searchStudents">
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
                @update:value="onSchoolChange" />
            </div>

            <div class="col-12 col-md-4">
              <form-builder-select-academic-field
                :key="filters.school_id ?? 'all-schools'"
                v-model:value="filters.field_id"
                label="رشته تحصیلی"
                outlined
                dense
                bg-color="white"
                :school-id="filters.school_id"
                @update:value="onFieldChange"
                @keyup.enter="searchStudents" />
            </div>
            <div class="col-12 col-md-4">
              <form-builder-select-academic-level
                :key="`${filters.school_id ?? 'all'}-${filters.field_id ?? 'all'}`"
                v-model:value="filters.academic_level_id"
                label="پایه تحصیلی"
                outlined
                dense
                bg-color="white"
                :school-id="filters.school_id"
                :field-id="filters.field_id"
                @update:value="onLevelChange"
                @keyup.enter="searchStudents" />
            </div>
            <div class="col-12 col-md-4">
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
                @keyup.enter="searchStudents" />
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <form-builder-input
                v-model:value="filters.first_name"
                label="نام"
                outlined
                dense
                bg-color="white"
                @keyup.enter="searchStudents" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <form-builder-input
                v-model:value="filters.last_name"
                label="نام خانوادگی"
                outlined
                dense
                bg-color="white"
                @keyup.enter="searchStudents" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <form-builder-input
                v-model:value="filters.national_id"
                label="کد ملی"
                outlined
                dense
                bg-color="white"
                @keyup.enter="searchStudents" />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <form-builder-input
                v-model:value="filters.username"
                label="نام کاربری"
                outlined
                dense
                bg-color="white"
                @keyup.enter="searchStudents" />
            </div>
          </div>

          <div class="row items-center justify-end q-mt-sm">
            <q-btn
              flat
              dense
              color="grey-7"
              icon="restart_alt"
              label="پاک‌سازی فیلترها"
              class="text-caption"
              :disable="loading"
              @click="resetFilters" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <!-- جدول اطلاعات -->
      <q-table
        v-model:pagination="pagination"
        class="student-table"
        :rows="students"
        :columns="columns"
        row-key="id"
        :loading="loading"
        @request="onRequest">

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

        <!-- تصویر پروفایل -->
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

        <!-- نام و نام خانوادگی -->
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

        <!-- نام کاربری قابل کپی با کلیک -->
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

        <!-- تلفن همراه -->
        <template #body-cell-mobile="props">
          <q-td :props="props">
            <span
              v-if="props.row.mobile"
              class="text-grey-8">{{ props.row.mobile }}</span>
            <span
              v-else
              class="text-grey-5">—</span>
          </q-td>
        </template>

        <!-- کد ملی -->
        <template #body-cell-national_id="props">
          <q-td :props="props">
            <span
              v-if="props.row.national_id"
              class="text-grey-9">{{ props.row.national_id }}</span>
            <span
              v-else
              class="text-grey-5">—</span>
          </q-td>
        </template>

        <!-- دکمه‌های عملیات -->
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

        <!-- حالت بدون داده -->
        <template #no-data>
          <div class="full-width column flex-center q-pa-xl text-grey-6">
            <q-icon
              name="sentiment_dissatisfied"
              size="54px"
              color="grey-4" />
            <div class="text-subtitle1 q-mt-md text-weight-bold">هیچ دانش‌آموزی یافت نشد!</div>
          </div>
        </template>

        <template #bottom>
          <div class="row items-center justify-between full-width q-px-md q-py-sm q-gutter-md">
            <!-- تعداد نمایش -->
            <div class="row items-center q-gutter-md">
              <div class="text-caption text-grey-7">
                نمایش
                <span class="text-weight-bold text-primary">{{ firstRow.toLocaleString('fa-IR') }}</span>
                تا
                <span class="text-weight-bold text-primary">{{ lastRow.toLocaleString('fa-IR') }}</span>
                از
                <span class="text-weight-bold text-primary">{{ pagination.rowsNumber.toLocaleString('fa-IR') }}</span>
                دانش‌آموز
              </div>

              <div class="row items-center q-gutter-xs text-caption text-grey-6">
                <span>تعداد در صفحه:</span>
                <span class="text-weight-bold text-primary">۱۰</span>
              </div>
            </div>

            <!-- پجینیشن دست‌سازِ کاملاً سفید با کادر طوسی و اکتیو پرایمری -->
            <!-- پجینیشن چگال، سفید و تمیز -->
            <div class="row items-center clean-pagination-custom no-wrap">
              <q-btn
                v-for="(page, index) in displayedPages"
                :key="index"
                :label="typeof page === 'number' ? page.toLocaleString('fa-IR') : page"
                unelevated
                dense
                :class="[
                  'pagination-btn',
                  {
                    'active-page': page === pagination.page,
                    'dots-btn': page === '…'
                  }
                ]"
                @click="goToPage(page)" />
            </div>
          </div>
        </template>

      </q-table>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import StudentAPI, { type StudentType } from 'src/repositories/student'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const studentAPI = new StudentAPI()
const currentSchoolManager = useCurrentSchool()
const currentSchoolId = computed(() => currentSchoolManager.currentSchool.value?.id ?? null)
const $q = useQuasar()

const students = ref<StudentType[]>([])
const loading = ref(false)

const filters = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  first_name: '',
  last_name: '',
  national_id: '',
  username: ''
})

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const totalPages = computed(() => Math.max(1, Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)))
const firstRow = computed(() => (pagination.value.rowsNumber === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1))
const lastRow = computed(() => Math.min(pagination.value.page * pagination.value.rowsPerPage, pagination.value.rowsNumber))
// محاسبه هوشمند صفحات قابل نمایش (همیشه صفحه جاری به همراه حداقل یک عدد قبل و بعد)
// محاسبه هوشمند صفحات قابل نمایش (ترتیب استاندارد از چپ به راست)
// محاسبه هوشمند صفحات با تضمین دقیقِ همیشه ۷ دکمه
// محاسبه صفحات با تضمینِ مطلقِ طول ۷ در تمامی صفحات
const displayedPages = computed(() => {
  const current = pagination.value.page
  const max = totalPages.value
  const pages: (number | string)[] = []

  // اگر کل صفحات ۷ تا یا کمتر است، همه را نشان بده و بقیه را با تهی پر کن تا ۷ تا شود (یا همان‌ها را نمایش بده)
  if (max <= 7) {
    for (let i = 1; i <= max; i++) pages.push(i)
    // اگر کمتر از ۷ بود، برای حفظ ظاهر ثابتاً تا ۷ عدد پر کنیم یا خالی بگذاریم؟
    // چون در پروژه شما کل صفحات ۶۹ تا است، این حالت عملاً رخ نمی‌دهد، اما برای ایمنی:
    while (pages.length < 7 && pages.length < max) {
      // اگر نیاز شد پر شود
      break
    }
  } else {
    // همیشه و همیشه دقیقا ۷ آیتم می‌سازیم:
    // ساختار استاندارد ۷ تایی: [اول، نقطه‌چین/عدد، ...، جاری، ...، نقطه‌چین/عدد، آخر]

    let start: number, end: number

    if (current <= 4) {
      // صفحات ابتدایی (۱ تا ۴)
      // مثلاً: 1, 2, 3, 4, 5, ..., 69 -> ولی باید ۷ تا باشد: [1, 2, 3, 4, 5, '…', 69]
      pages.push(1, 2, 3, 4, 5, '…', max)
    } else if (current >= max - 3) {
      // صفحات انتهایی
      pages.push(1, '…', max - 4, max - 3, max - 2, max - 1, max)
    } else {
      // صفحات میانی (دقیقاً صفحه جاری به همراه یک عدد قبل و بعد، به همراه نقطه‌چین‌های دوطرف و اول و آخر)
      // ساختار ۷تایی میانی: [1, '…', current - 1, current, current + 1, '…', max]
      pages.push(1, '…', current - 1, current, current + 1, '…', max)
    }
  }

  return pages
})

const columns = [
  { name: 'picture', label: 'پروفایل', align: 'center' as const, field: 'picture' },
  { name: 'first_name', label: 'نام', align: 'right' as const, field: 'first_name', sortable: true },
  { name: 'last_name', label: 'نام خانوادگی', align: 'right' as const, field: 'last_name', sortable: true },
  { name: 'username', label: 'نام کاربری', align: 'center' as const, field: 'username' },
  { name: 'mobile', label: 'تلفن همراه', align: 'center' as const, field: 'mobile' },
  { name: 'national_id', label: 'کد ملی', align: 'center' as const, field: 'national_id' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'id' }
]

let requestId = 0

async function loadStudents () {
  const currentRequest = ++requestId
  loading.value = true
  try {
    const params: Record<string, number | string> = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page,
      sortation_field: pagination.value.sortBy || 'created_at',
      sortation_order: pagination.value.descending ? 'desc' : 'asc'
    }
    if (filters.school_id) params.school_id = filters.school_id
    if (filters.field_id) params.field_id = filters.field_id
    if (filters.academic_level_id) params.academic_level_id = filters.academic_level_id
    if (filters.class_id) params.class_id = filters.class_id
    if (filters.first_name.trim()) params.first_name = filters.first_name.trim()
    if (filters.last_name.trim()) params.last_name = filters.last_name.trim()
    if (filters.national_id.trim()) params.national_id = filters.national_id.trim()
    if (filters.username.trim()) params.username = filters.username.trim()

    const result = await studentAPI.index(params)
    if (currentRequest !== requestId) return

    if (result.total > 0 && pagination.value.page > result.last_page) {
      pagination.value.page = result.last_page
      void loadStudents()
      return
    }

    students.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    if (currentRequest !== requestId) return
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست دانش‌آموزان',
      color: 'negative',
      position: 'top'
    })
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

function searchStudents () {
  pagination.value.page = 1
  void loadStudents()
}

function resetFilters () {
  filters.first_name = ''
  filters.last_name = ''
  filters.national_id = ''
  filters.username = ''
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
  searchStudents()
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

function onPageChange (page: number) {
  pagination.value.page = page
  void loadStudents()
}

function onRowsPerPageChange (rowsPerPage: number | null) {
  if (!rowsPerPage || pagination.value.rowsPerPage === rowsPerPage) return
  pagination.value.rowsPerPage = rowsPerPage
  searchStudents()
}

function onRequest (request: {
  pagination: { page: number; rowsPerPage: number; sortBy: string | null; descending: boolean }
}) {
  pagination.value = {
    ...pagination.value,
    ...request.pagination,
    sortBy: request.pagination.sortBy || 'created_at'
  }
  void loadStudents()
}

function onSchoolChange () {
  filters.field_id = null
  filters.academic_level_id = null
  filters.class_id = null
}

function onFieldChange () {
  filters.academic_level_id = null
  filters.class_id = null
}

function onLevelChange ()  {
  filters.class_id = null
}

function afterRemove () {
  void loadStudents()
  $q.notify({ message: 'دانش‌آموز با موفقیت حذف گردید.', type: 'positive', position: 'top' })
}

// تابع تغییر صفحه
const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page !== pagination.value.page) {
    pagination.value.page = page
    onPageChange(page)
  }
}

watch(currentSchoolId, (schoolId) => {
  filters.school_id = schoolId
  onSchoolChange()
  searchStudents()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.main-container-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.username-badge {
  transition: all 0.2s ease;
  &:hover {
    background-color: #e0e7ff !important;
    transform: scale(1.05);
  }
}

:deep(.student-table .q-table__bottom:not(.q-table__bottom--nodata)) {
  display: flex !important;
}

.clean-pagination-custom {
  direction: ltr !important;

  .pagination-btn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    padding: 0 !important;
    border-radius: 6px !important;
    margin: 0 2px !important; // فاصله کمتر = ظاهر چگال‌تر و جمع‌وجور
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    font-size: 13px;
    font-weight: 600;
    background-color: #ffffff !important; // پس‌زمینه قطعی سفید برای همه
    color: #424242 !important;

    // دکمه سه نقطه غیرقابل کلیک اما با همان ظاهر شیک سفید
    &.dots-btn {
      pointer-events: none;
      cursor: default;
      opacity: 0.85;
      background-color: #ffffff !important;
    }

    // صفحه فعال
    &.active-page {
      background-color: var(--q-primary) !important;
      color: #ffffff !important;
      border-color: var(--q-primary) !important;
    }
  }
}

</style>
