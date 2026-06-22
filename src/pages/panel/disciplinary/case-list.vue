<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">موارد انضباطی تعریف شده</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="تعریف مورد جدید" :to="{ name: 'Panel.DisciplinaryCase.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="cases"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-actions="{ props }">
            <q-td :props="props">
              <q-btn flat round dense icon="edit" color="primary" size="sm" @click="editCase(props.row)" class="q-mr-xs" />
              <q-btn flat round dense icon="delete" color="negative" size="sm" @click="deleteCase(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { disciplinaryCase } from 'src/repositories/disciplinaryCase'

const $q = useQuasar()

const cases = ref<any[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'name', label: 'نام مورد انضباطی', align: 'right' as const, field: 'name' },
  { name: 'description', label: 'توضیحات', align: 'center' as const, field: 'description' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

const loadCases = async () => {
  loading.value = true
  try {
    const result = await disciplinaryCase.index({
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    })
    cases.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری موارد انضباطی' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadCases()
}

const editCase = (item: any) => {
  $q.dialog({
    title: 'ویرایش مورد انضباطی',
    prompt: {
      model: item.name,
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(async (data: string) => {
    try {
      await disciplinaryCase.update(item.id, { name: data })
      $q.notify({ color: 'positive', message: 'مورد انضباطی با موفقیت ویرایش شد' })
      loadCases()
    } catch (error: any) {
      $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در ویرایش مورد انضباطی' })
    }
  })
}

const deleteCase = async (item: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: 'مورد انضباطی حذف شود؟',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await disciplinaryCase.delete(item.id)
      $q.notify({ color: 'positive', message: 'مورد با موفقیت حذف شد' })
      loadCases()
    } catch (error: any) {
      $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در حذف مورد' })
    }
  })
}

onMounted(() => {
  loadCases()
})
</script>

<style scoped>
</style>