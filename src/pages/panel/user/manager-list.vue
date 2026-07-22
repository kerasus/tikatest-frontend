<template>
  <div class="user-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-6">
            <q-input
              v-model="search"
              label="جستجو"
              outlined
              dense
              clearable
              @update:model-value="loadUsers" />
          </div>
          <div class="col-12 col-md-6">
            <q-btn
              color="primary"
              icon="person_add"
              label="افزودن مدیر"
              :to="{ name: 'Panel.User.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="users"
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
                :to="{ name: 'Panel.User.Show', params: { id: props.row.id } }" />
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
import UserAPI from 'src/repositories/user'
import type { UserType } from 'src/repositories/user'

const userApi = new UserAPI()

const $q = useQuasar()

const users = ref<UserType[]>([])
const loading = ref(false)
const search = ref('')

const pagination = ref({
  sortBy: 'firstname',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'firstname', required: true, label: 'نام', align: 'right' as const, field: 'firstname', sortable: true },
  { name: 'lastname', required: true, label: 'نام خانوادگی', align: 'right' as const, field: 'lastname', sortable: true },
  { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
  { name: 'mobile', label: 'موبایل', align: 'right' as const, field: 'mobile' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadUsers () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (search.value) params.full_name = search.value

    const result = await userApi.getByRole('manager')
    users.value = result
    pagination.value.rowsNumber = result.length
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست مدیران.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style lang="scss" scoped>
.user-list-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
