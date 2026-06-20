<template>
  <div class="student-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
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
              @update:model-value="loadStudents" />
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
                <q-avatar size="40px" class="q-ml-sm">
                  <img :src="props.row.picture || 'https://cdn.quasar.dev/img/avatar.png'" />
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
import SchoolClassAPI from 'src/repositories/schoolClass'
import AcademicFieldAPI from 'src/repositories/academicField'
import type { ListType, StudentType } from 'src/repositories/student'

const $q = useQuasar()

const students = ref<StudentType[]>([])
const fieldOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  search: '',
  field_id: null as number | null,
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
  { name: 'name', required: true, label: 'نام و نام خانوادگی', align: 'right' as const, field: 'name', sortable: true },
  { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
  { name: 'student_phone', label: 'تلفن', align: 'right' as const, field: 'student_phone' },
  { name: 'melli_code', label: 'کد ملی', align: 'right' as const, field: 'melli_code' },
  { name: 'actions', label: 'عملیات', align: 'center' as const }
]

async function loadStudents () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.field_id) params.field_id = filters.field_id
    if (filters.class_id) params.class_ids = [filters.class_id]
    if (filters.search) {
      params.full_name_search = filters.search
    }

    const result = await StudentAPI.prototype.index(params)
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

async function loadFields () {
  try {
    const result = await AcademicFieldAPI.prototype.index({ length: 100 })
    fieldOptions.value = result.data
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadClasses () {
  try {
    const result = await SchoolClassAPI.prototype.index({ length: 100 })
    classOptions.value = result.data
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadStudents()
}

onMounted(() => {
  loadFields()
  loadClasses()
  loadStudents()
})
</script>

<style lang="scss" scoped>
.student-list-page {
  .q-avatar {
    border: 2px solid $primary;
  }
}
</style>
