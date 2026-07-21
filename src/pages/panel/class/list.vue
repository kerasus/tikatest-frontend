<template>
  <div class="class-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
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
              @update:model-value="loadClasses" />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام کلاس"
              outlined
              dense
              clearable
              @update:model-value="loadClasses" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن کلاس"
              :to="{ name: 'Panel.Class.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="classes"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                :to="{ name: 'Panel.Class.Show', params: { id: props.row.id } }" />
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
import SchoolClassAPI from 'src/repositories/schoolClass'
import AcademicFieldAPI from 'src/repositories/academicField'
import type { ListType, SchoolClassType } from 'src/repositories/schoolClass'

const schoolClassApi = new SchoolClassAPI()
const academicFieldApi = new AcademicFieldAPI()

const $q = useQuasar()

const classes = ref<SchoolClassType[]>([])
const fieldOptions = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  search: '',
  field_id: null as number | null,
  level_name: null as string | null,
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
  { name: 'name', required: true, label: 'نام کلاس', align: 'right' as const, field: 'name', sortable: true },
  { name: 'field', label: 'رشته', align: 'right' as const, field: 'academicField.name' },
  { name: 'level', label: 'پایه', align: 'right' as const, field: 'academicLevel.name' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadClasses () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.field_id) params.field_id = filters.field_id
    if (filters.search) params.name = filters.search

    const result = await schoolClassApi.index(params)
    classes.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست کلاس‌ها.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function loadFields () {
  try {
    const result = await academicFieldApi.index({ length: 100 })
    fieldOptions.value = result.data
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadClasses()
}

onMounted(() => {
  loadFields()
  loadClasses()
})
</script>

<style lang="scss" scoped>
</style>
