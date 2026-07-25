<template>
  <div class="academic-level-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام مقطع"
              outlined
              dense
              clearable
              @update:model-value="loadLevels" />
          </div>
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
              @update:model-value="loadLevels" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن مقطع"
              :to="{ name: 'Panel.AcademicLevel.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="levels"
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
                :to="{ name: 'Panel.AcademicLevel.Show', params: { id: props.row.id } }" />
              <q-btn
                flat
                dense
                icon="edit"
                color="primary"
                :to="{ name: 'Panel.AcademicLevel.Edit', params: { id: props.row.id } }" />
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
import AcademicLevelAPI from 'src/repositories/academicLevel'
import AcademicFieldAPI from 'src/repositories/academicField'
import type { ListType } from 'src/repositories/BaseAPI'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { AcademicFieldType } from 'src/repositories/academicField'

const levelApi = new AcademicLevelAPI()
const fieldApi = new AcademicFieldAPI()
const $q = useQuasar()

const levels = ref<AcademicLevelType[]>([])
const fieldOptions = ref<AcademicFieldType[]>([])
const loading = ref(false)

const filters = reactive({
  search: '' as string | null,
  field_id: null as number | null,
  length: 10,
  page: 1
})

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'name', required: true, label: 'نام مقطع', align: 'right' as const, field: 'name', sortable: true },
  { name: 'field', label: 'رشته', align: 'right' as const, field: 'academicField' },
  { name: 'school', label: 'مدرسه', align: 'right' as const, field: 'school' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadLevels () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.search) params.name = filters.search
    if (filters.field_id) params.field_id = filters.field_id

    const result = await levelApi.index(params)
    levels.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست مقطع‌ها.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadLevels()
}

onMounted(async () => {
  try {
    const result = await fieldApi.index({ length: 100 })
    fieldOptions.value = result.data
  } catch (error) {
    console.error('Error loading fields:', error)
  }
  loadLevels()
})
</script>

<style lang="scss" scoped>
.academic-level-list-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
