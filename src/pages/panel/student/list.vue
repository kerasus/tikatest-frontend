<template>
  <div class="student-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.school_id"
              :options="schoolOptions"
              option-value="id"
              option-label="name"
              label="مدرسه"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="onSchoolChange" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.field_id"
              :options="fieldOptions"
              option-value="id"
              option-label="name"
              label="رشته"
              outlined
              dense
              clearable
              emit-value
              map-options
              :disable="!filters.school_id"
              @update:model-value="onFieldChange" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.level_id"
              :options="levelOptions"
              option-value="id"
              option-label="name"
              label="پایه"
              outlined
              dense
              clearable
              emit-value
              map-options
              :disable="!filters.field_id"
              @update:model-value="onLevelChange" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.class_id"
              :options="classOptions"
              option-value="id"
              option-label="name"
              label="کلاس"
              outlined
              dense
              clearable
              emit-value
              map-options
              :disable="!filters.level_id"
              @update:model-value="loadStudents" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.search"
              label="جستجو (نام، نام خانوادگی، کد ملی)"
              outlined
              dense
              clearable
              @update:model-value="loadStudents" />
          </div>
          <div class="col-12 col-md-3 flex items-center">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن دانش آموز"
              :to="{ name: 'Panel.Student.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="students"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar
                  size="40px"
                  class="q-ml-sm">
                  <q-img :src="props.row.picture || '/images/blankProfile.png'" />
                </q-avatar>
                <span>{{ props.row.name }}</span>
              </div>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                :to="{ name: 'Panel.Student.Show', params: { id: props.row.id } }" />
              <q-btn
                flat
                dense
                icon="edit"
                color="warning"
                :to="{ name: 'Panel.Student.Edit', params: { id: props.row.id } }" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import StudentAPI from 'src/repositories/student'
import SchoolAPI from 'src/repositories/school'
import SchoolClassAPI from 'src/repositories/schoolClass'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import type { StudentType } from 'src/repositories/student'

const studentAPI = new StudentAPI()
const schoolAPI = new SchoolAPI()
const schoolClassAPI = new SchoolClassAPI()
const academicFieldAPI = new AcademicFieldAPI()
const academicLevelAPI = new AcademicLevelAPI()

const $q = useQuasar()

const students = ref<StudentType[]>([])
const schoolOptions = ref<any[]>([])
const fieldOptions = ref<any[]>([])
const levelOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  search: '',
  school_id: null as number | null,
  field_id: null as number | null,
  level_id: null as number | null,
  class_id: null as number | null,
  length: 10,
  page: 1
})

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'نام و نام خانوادگی',
    align: 'right' as const,
    field: 'name',
    sortable: true
  },
  { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
  { name: 'student_phone', label: 'تلفن', align: 'right' as const, field: 'student_phone' },
  { name: 'melli_code', label: 'کد ملی', align: 'right' as const, field: 'melli_code' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadStudents () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.school_id) params.school_id = filters.school_id
    if (filters.field_id) params.field_id = filters.field_id
    if (filters.level_id) params.level_id = filters.level_id
    if (filters.class_id) params.class_id = filters.class_id
    if (filters.search) {
      params.full_name_search = filters.search
    }

    const result = await studentAPI.index(params)
    students.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست دانش آموزان',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function loadSchools () {
  try {
    const result = await schoolAPI.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

async function loadFields (schoolId: number) {
  try {
    const result = await academicFieldAPI.index({ length: 100, school_id: schoolId })
    fieldOptions.value = result.data
    filters.field_id = null
    filters.level_id = null
    filters.class_id = null
    levelOptions.value = []
    classOptions.value = []
    loadStudents()
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadLevels (fieldId: number) {
  try {
    const result = await academicLevelAPI.index({ length: 100, field_id: fieldId })
    levelOptions.value = result.data
    filters.level_id = null
    filters.class_id = null
    classOptions.value = []
    loadStudents()
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClasses (levelId: number) {
  try {
    const result = await schoolClassAPI.index({ length: 100, level_id: levelId })
    classOptions.value = result.data
    filters.class_id = null
    loadStudents()
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

function onSchoolChange (schoolId: number | null) {
  if (schoolId) {
    loadFields(schoolId)
  } else {
    fieldOptions.value = []
    levelOptions.value = []
    classOptions.value = []
    filters.field_id = null
    filters.level_id = null
    filters.class_id = null
    loadStudents()
  }
}

function onFieldChange (fieldId: number | null) {
  if (fieldId) {
    loadLevels(fieldId)
  } else {
    levelOptions.value = []
    classOptions.value = []
    filters.level_id = null
    filters.class_id = null
    loadStudents()
  }
}

function onLevelChange (levelId: number | null) {
  if (levelId) {
    loadClasses(levelId)
  } else {
    classOptions.value = []
    filters.class_id = null
    loadStudents()
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadStudents()
}

onMounted(() => {
  loadSchools()
  loadStudents()
})
</script>

<style lang="scss" scoped>
.student-list-page {
}
</style>
