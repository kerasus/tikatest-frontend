<template>
  <div class="school-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام مدرسه"
              outlined
              dense
              clearable
              @update:model-value="loadSchools" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.type"
              :options="typeOptions"
              label="نوع"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadSchools" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن مدرسه"
              :to="{ name: 'Panel.School.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="schools"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="more"
                color="primary">
                <q-menu
                  transition-show="jump-down"
                  transition-hide="jump-up">
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      :to="{ name: 'Panel.School.Show', params: { id: props.row.id } }">
                      <q-item-section avatar>
                        <q-icon
                          name="visibility"
                          color="primary" />
                      </q-item-section>
                      <q-item-section>مشاهده و ویرایش</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      :to="{ name: 'Panel.AcademicTree', params: { school_id: props.row.id } }">
                      <q-item-section avatar>
                        <q-icon
                          name="account_tree"
                          color="secondary" />
                      </q-item-section>
                      <q-item-section>ساختار دروس و مقطع‌ها</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      :to="{ name: 'Panel.School.Classes', params: { school_id: props.row.id } }">
                      <q-item-section avatar>
                        <q-icon
                          name="class_"
                          color="accent" />
                      </q-item-section>
                      <q-item-section>مدیریت کلاس‌ها</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
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
import SchoolAPI from 'src/repositories/school'
import type { ListType } from 'src/repositories/BaseAPI'
import type { SchoolType } from 'src/repositories/school'

const schoolApi = new SchoolAPI()

const $q = useQuasar()

const schools = ref<SchoolType[]>([])
const loading = ref(false)

const filters = reactive({
  search: '' as string | null,
  type: null as string | null,
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

const typeOptions = [
  { label: 'مدرسه', value: 'school' },
  { label: 'موسسه', value: 'institute' }
]

const columns = [
  {
    name: 'code',
    required: true,
    label: 'کد',
    align: 'right' as const,
    field: 'code',
    sortable: true
  },
  {
    name: 'name',
    required: true,
    label: 'نام',
    align: 'right' as const,
    field: 'name',
    sortable: true
  },
  { name: 'type', label: 'نوع', align: 'right' as const, field: 'type' },
  { name: 'address', label: 'آدرس', align: 'right' as const, field: 'address' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadSchools () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.search) params.name = filters.search
    if (filters.type) params.type = filters.type

    const result = await schoolApi.index(params)
    schools.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست مدارس.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadSchools()
}

onMounted(() => {
  loadSchools()
})
</script>

<style lang="scss" scoped>
.school-list-page {
  width: 100%;
  margin: 0 auto;
}
</style>
