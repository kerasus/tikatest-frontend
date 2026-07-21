<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">غیبت‌ها</h4>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.date_from"
            label="از تاریخ"
            outlined
            type="date"
            @update:model-value="loadAbsences" />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.date_to"
            label="تا تاریخ"
            outlined
            type="date"
            @update:model-value="loadAbsences" />
        </div>
      </div>

      <q-card>
        <q-card-section>
          <q-table
            v-if="absences.length > 0"
            :rows="absences"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-case="props">
              <q-td :props="props">{{ props.row.disciplinaryCase?.name || '-' }}</q-td>
            </template>
          </q-table>
          <div
            v-else
            class="text-center q-pa-lg">
            <q-icon
              name="event_available"
              size="100px"
              color="positive" />
            <p class="text-subtitle1 q-mt-md">هیچ غیبتی ثبت نشده است</p>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'

const $q = useQuasar()
const loading = ref(false)
const absences = ref<any[]>([])

const filters = reactive({
  date_from: null as string | null,
  date_to: null as string | null
})

const columns = [
  { name: 'case', label: 'نوع', field: 'case', align: 'center' as const },
  { name: 'incident_date', label: 'تاریخ', field: 'incident_date', align: 'center' as const },
  { name: 'description', label: 'توضیحات', field: 'description', align: 'center' as const }
]

const loadAbsences = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to
    const response = await student.absences(params)
    absences.value = response.data.data || response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری غیبت‌ها' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAbsences()
})
</script>
