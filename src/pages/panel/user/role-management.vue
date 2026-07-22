<template>
  <div class="user-role-management-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">مدیریت نقش‌های آموزشی</div>
      </q-card-section>

      <q-separator />

      <q-tabs
        v-model="activeTab"
        class="q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="left">
        <q-tab
          name="teachers"
          label="معلمان" />
        <q-tab
          name="managers"
          label="مدیران" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="activeTab"
        animated>
        <q-tab-panel name="teachers">
          <div class="row q-col-gutter-md items-end q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="teacherSearch"
                label="جستجوی معلم"
                outlined
                dense
                clearable
                @update:model-value="loadTeachers" />
            </div>
            <div class="col-12 col-md-6">
              <q-btn
                color="primary"
                icon="person_add"
                label="افزودن معلم"
                :to="{ name: 'Panel.User.Create' }"
                class="full-width" />
            </div>
          </div>

          <q-table
            :rows="teachers"
            :columns="userColumns"
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
        </q-tab-panel>

        <q-tab-panel name="managers">
          <div class="row q-col-gutter-md items-end q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="managerSearch"
                label="جستجوی مدیر"
                outlined
                dense
                clearable
                @update:model-value="loadManagers" />
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

          <q-table
            :rows="managers"
            :columns="userColumns"
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
        </q-tab-panel>
      </q-tab-panels>
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

const activeTab = ref('teachers')
const teachers = ref<UserType[]>([])
const managers = ref<UserType[]>([])
const loading = ref(false)

const teacherSearch = ref('')
const managerSearch = ref('')

const pagination = ref({
  sortBy: 'firstname',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const userColumns = [
  { name: 'firstname', required: true, label: 'نام', align: 'right' as const, field: 'firstname', sortable: true },
  { name: 'lastname', required: true, label: 'نام خانوادگی', align: 'right' as const, field: 'lastname', sortable: true },
  { name: 'username', label: 'نام کاربری', align: 'right' as const, field: 'username' },
  { name: 'mobile', label: 'موبایل', align: 'right' as const, field: 'mobile' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadTeachers () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (teacherSearch.value) params.full_name = teacherSearch.value

    const result = await userApi.index(params)
    const allUsers = result.data.filter((u: any) => u.roles_list?.includes('Teacher'))
    teachers.value = allUsers
    pagination.value.rowsNumber = allUsers.length
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست معلمان.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function loadManagers () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (managerSearch.value) params.full_name = managerSearch.value

    const result = await userApi.index(params)
    const allUsers = result.data.filter((u: any) => u.roles_list?.includes('Manager'))
    managers.value = allUsers
    pagination.value.rowsNumber = allUsers.length
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

  if (activeTab.value === 'teachers') {
    loadTeachers()
  } else {
    loadManagers()
  }
}

onMounted(() => {
  loadTeachers()
})
</script>

<style lang="scss" scoped>
.user-role-management-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
