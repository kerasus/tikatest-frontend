<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">پروفایل‌های دانش‌آموزی</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="ثبت پروفایل جدید"
          :to="{ name: 'Panel.StudentProfile.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="profiles.data"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-user="props">
            <q-td :props="props">
              {{ props.row.user?.full_name || `${props.row.user?.first_name || ''} ${props.row.user?.last_name || ''}`.trim() || '-' }}
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
                @click="viewProfile(props.row.id)" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="deleteProfile(props.row)" />
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
import { studentProfile } from 'src/repositories/studentProfile'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const profiles = ref<any>({ data: [], current_page: 1, per_page: 10, total: 0 })

const columns = [
  { name: 'user', label: 'دانش‌آموز', align: 'right' as const, field: 'user' },
  { name: 'code', label: 'کد دانش‌آموزی', align: 'center' as const, field: 'code' },
  { name: 'xp', label: 'امتیاز XP', align: 'center' as const, field: 'xp' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const loadProfiles = async () => {
  loading.value = true
  try {
    const response = await studentProfile.index({
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    })
    profiles.value = response.data
    pagination.value.rowsNumber = response.total
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری پروفایل‌ها' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadProfiles()
}

const viewProfile = (id: number) => {
  router.push({ name: 'Panel.StudentProfile.Show', params: { id } })
}

const deleteProfile = async (item: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: `پروفایل ${item.user?.full_name || item.id} حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await studentProfile.delete(item.id)
      $q.notify({ type: 'positive', message: 'پروفایل با موفقیت حذف شد' })
      loadProfiles()
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف پروفایل' })
    }
  })
}

onMounted(() => {
  loadProfiles()
})
</script>
