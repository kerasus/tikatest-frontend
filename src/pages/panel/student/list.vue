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
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn
            :row="inputData.props.row"
            :api="studentAPI"
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
import { ref, onMounted, reactive, shallowRef } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import SchoolAPI from 'src/repositories/school'
import StudentAPI from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import type { StudentType } from 'src/repositories/student'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const studentAPI = new StudentAPI()
const schoolAPI = new SchoolAPI()
const schoolClassAPI = new SchoolClassAPI()
const academicFieldAPI = new AcademicFieldAPI()
const academicLevelAPI = new AcademicLevelAPI()

const $q = useQuasar()
const FormBuilderSelectSchoolComponent = shallowRef(FormBuilderSelectSchool)
const FormBuilderSelectSchoolClassComponent = shallowRef(FormBuilderSelectSchoolClass)
const FormBuilderSelectAcademicFieldComponent = shallowRef(FormBuilderSelectAcademicField)
const FormBuilderSelectAcademicLevelComponent = shallowRef(FormBuilderSelectAcademicLevel)

const api = ref(studentAPI.endpoints.base)
const label = ref('دانش آموزان')
const createRouteName = ref('Panel.Student.Create')
const showRouteName = ref('Panel.Student.Show')
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
      name: 'first_name',
      required: true,
      label: 'نام',
      align: 'right' as const,
      field: 'first_name',
      sortable: true
    },
    {
      name: 'last_name',
      required: true,
      label: 'نام خانوادگی',
      align: 'right' as const,
      field: 'last_name',
      sortable: true
    },
    { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
    { name: 'mobile', label: 'تلفن', align: 'right' as const, field: 'mobile' },
    { name: 'national_id', label: 'کد ملی', align: 'right' as const, field: 'national_id' },
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
    type: FormBuilderSelectSchoolComponent,
    name: 'school_id',
    label: 'مدرسه',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectAcademicFieldComponent,
    name: 'field_id',
    label: 'رشته',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectAcademicLevelComponent,
    name: 'academic_level_id',
    label: 'پایه',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectSchoolClassComponent,
    name: 'class_id',
    label: 'کلاس',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'first_name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'last_name',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'national_id',
    label: 'کدملی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'username',
    label: 'نام کاربری',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  }
])
const entityIndexRef = ref()

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
  academic_level_id: null as number | null,
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

async function loadStudents () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.school_id) params.school_id = filters.school_id
    if (filters.field_id) params.field_id = filters.field_id
    if (filters.academic_level_id) params.academic_level_id = filters.academic_level_id
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
    filters.academic_level_id = null
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
    filters.academic_level_id = null
    filters.class_id = null
    classOptions.value = []
    loadStudents()
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClasses (levelId: number) {
  try {
    const result = await schoolClassAPI.index({ length: 100, academic_level_id: levelId })
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
    filters.academic_level_id = null
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
    filters.academic_level_id = null
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

function afterRemove () {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
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
