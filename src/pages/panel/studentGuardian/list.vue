<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">وصی نگهبانان دانش‌آموزی</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="ثبت وصی نگهبان جدید"
          :to="{ name: 'Panel.StudentGuardian.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="guardians.data"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-student="props">
            <q-td :props="props">
              {{ props.row.studentProfile?.user?.full_name || '-' }}
            </q-td>
          </template>
          <template #body-cell-guardian="props">
            <q-td :props="props">
              {{ props.row.user?.full_name || '-' }}
            </q-td>
          </template>
          <template #body-cell-relationship_type="props">
            <q-td :props="props">
              {{ getRelationshipLabel(props.row.relationship_type) }}
            </q-td>
          </template>
          <template #body-cell-is_primary_contact="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.is_primary_contact ? 'primary' : 'grey-4'"
                text-color="white"
                dense>
                {{ props.row.is_primary_contact ? 'اصلی' : 'غیر اصلی' }}
              </q-chip>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="info"
                size="sm"
                @click="viewGuardian(props.row.id)" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="deleteGuardian(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { studentGuardian } from 'src/repositories/studentGuardian'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const guardians = ref<any>({ data: [], current_page: 1, per_page: 10, total: 0 })

const columns = [
  { name: 'student', label: 'دانش‌آموز', align: 'right' as const, field: 'student' },
  { name: 'guardian', label: 'وصی', align: 'right' as const, field: 'guardian' },
  { name: 'relationship_type', label: 'نوع رابطه', align: 'center' as const, field: 'relationship_type' },
  { name: 'job', label: 'شغل', align: 'center' as const, field: 'job' },
  { name: 'is_primary_contact', label: 'تماس اصلی', align: 'center' as const, field: 'is_primary_contact' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const relationshipLabels: Record<string, string> = {
  father: 'پدر',
  mother: 'مادر',
  guardian: 'سایر'
}

function getRelationshipLabel (value: string | null): string {
  if (!value) return '-'
  return relationshipLabels[value] || value
}

const loadGuardians = async () => {
  loading.value = true
  try {
    const response = await studentGuardian.index({
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    })
    guardians.value = response.data
    pagination.value.rowsNumber = response.total
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری وصیان' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadGuardians()
}

const viewGuardian = (id: number) => {
  router.push({ name: 'Panel.StudentGuardian.Show', params: { id } })
}

const deleteGuardian = async (item: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: `وصی ${item.user?.full_name || item.id} حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await studentGuardian.delete(item.id)
      $q.notify({ type: 'positive', message: 'وصی با موفقیت حذف شد' })
      loadGuardians()
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف وصی' })
    }
  })
}

onMounted(() => {
  loadGuardians()
})
</script>
