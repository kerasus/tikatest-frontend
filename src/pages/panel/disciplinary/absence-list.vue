<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">مشاهده غیبت های ثبت شده</h4>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.date_from"
              label="از تاریخ"
              outlined
              dense
              mask="date">
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-date
                      v-model="filters.date_from"
                      color="primary" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.date_to"
              label="تا تاریخ"
              outlined
              dense
              mask="date">
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-date
                      v-model="filters.date_to"
                      color="primary" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              label="فیلتر"
              :loading="loading"
              class="full-height"
              @click="loadAbsences" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <q-table
          :rows="absences"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-student="props">
            <q-td :props="props">
              {{ props.row.student?.name }} {{ props.row.student?.lastname }}
            </q-td>
          </template>
          <template #body-cell-case="props">
            <q-td :props="props">
              {{ props.row.disciplinaryCase?.name || '-' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { disciplinaryRecord } from 'src/repositories/disciplinaryRecord'

const $q = useQuasar()

const absences = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  date_from: null as string | null,
  date_to: null as string | null,
  length: 20,
  page: 1
})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'student', label: 'دانش آموز', align: 'center' as const, field: 'student' },
  { name: 'case', label: 'نوع غیبت', align: 'center' as const, field: 'case' },
  { name: 'incident_date', label: 'تاریخ', align: 'center' as const, field: 'incident_date' },
  { name: 'description', label: 'توضیحات', align: 'center' as const, field: 'description' }
]

const loadAbsences = async () => {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page
    }
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to

    const result = await disciplinaryRecord.viewAbsences(params)
    absences.value = result.data || result
    pagination.value.rowsNumber = result.total || result.length
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در بارگذاری غیبت ها' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadAbsences()
}

onMounted(() => {
  loadAbsences()
})
</script>

<style scoped>
</style>