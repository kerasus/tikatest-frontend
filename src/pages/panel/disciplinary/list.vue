<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">امور انضباطی</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="ثبت مورد جدید" :to="{ name: 'Panel.Disciplinary.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div v-if="loading" class="text-center q-pa-lg">
          <q-spinner color="primary" size="100px" />
        </div>

        <div v-else-if="records.data.length === 0" class="text-center q-pa-lg">
          <q-icon name="gavel" size="100px" color="primary" />
          <p class="text-subtitle1 q-mt-md">هیچ مورد انضباطی ثبت نشده است</p>
        </div>

        <q-table
          v-else
          :rows="records.data"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          @request="onTableRequest"
        >
          <template #body-cell-student="{ props }">
            <q-td :props="props">
              {{ props.row.student?.full_name || '-' }}
            </q-td>
          </template>
          <template #body-cell-case="{ props }">
            <q-td :props="props">
              {{ props.row.disciplinaryCase?.name || '-' }}
            </q-td>
          </template>
          <template #body-cell-actions="{ props }">
            <q-td :props="props">
              <q-btn flat round dense icon="visibility" color="info" size="sm" @click="viewRecord(props.row.id)" />
              <q-btn flat round dense icon="delete" color="negative" size="sm" @click="deleteRecord(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { disciplinaryRecord } from 'src/repositories/disciplinaryRecord'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const records = ref<any>({ data: [], current_page: 1, per_page: 10, total: 0 })

const columns = [
  { name: 'student', label: 'دانش آموز', field: 'student', align: 'center' as const },
  { name: 'case', label: 'نوع مورد', field: 'case', align: 'center' as const },
  { name: 'incident_date', label: 'تاریخ واقعه', field: 'incident_date', align: 'center' as const },
  { name: 'description', label: 'توضیحات', field: 'description', align: 'center' as const },
  { name: 'actions', label: 'عملیات', field: 'actions', align: 'center' as const },
]

const pagination = ref({
  sortBy: 'incident_date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const loadRecords = async () => {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page,
      sortation_field: 'incident_date',
      sortation_order: 'desc',
    }
    const response = await disciplinaryRecord.index(params)
    records.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری موارد انضباطی' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  pagination.value.sortBy = props.pagination.sortBy
  pagination.value.descending = props.pagination.descending
  loadRecords()
}

const viewRecord = (id: number) => {
  router.push({ name: 'Panel.Disciplinary.Show', params: { id } })
}

const deleteRecord = async (record: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: 'مورد انضباطی حذف شود؟',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await disciplinaryRecord.delete(record.id)
      $q.notify({ type: 'positive', message: 'مورد با موفقیت حذف شد' })
      loadRecords()
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف مورد' })
    }
  })
}

onMounted(() => {
  loadRecords()
})
</script>
