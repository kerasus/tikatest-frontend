<template>
  <div class="academic-field-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام رشته"
              outlined
              dense
              clearable
              @update:model-value="loadFields" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن رشته"
              :to="{ name: 'Panel.AcademicField.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="fields"
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
                :to="{ name: 'Panel.AcademicField.Show', params: { id: props.row.id } }" />
              <q-btn
                flat
                dense
                icon="edit"
                color="primary"
                :to="{ name: 'Panel.AcademicField.Edit', params: { id: props.row.id } }" />
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
import AcademicFieldAPI from 'src/repositories/academicField'
import type { ListType } from 'src/repositories/BaseAPI'
import type { AcademicFieldType } from 'src/repositories/academicField'

const fieldApi = new AcademicFieldAPI()
const $q = useQuasar()

const fields = ref<AcademicFieldType[]>([])
const loading = ref(false)

const filters = reactive({
  search: '' as string | null,
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
  { name: 'name', required: true, label: 'نام رشته', align: 'right' as const, field: 'name', sortable: true },
  { name: 'school', label: 'مدرسه', align: 'right' as const, field: 'school' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadFields () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.search) params.name = filters.search

    const result = await fieldApi.index(params)
    fields.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست رشته‌ها.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadFields()
}

onMounted(() => {
  loadFields()
})
</script>

<style lang="scss" scoped>
.academic-field-list-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
