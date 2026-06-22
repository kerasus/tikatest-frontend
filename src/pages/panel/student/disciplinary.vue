<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">موارد انضباطی</h4>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else>
      <q-card>
        <q-card-section>
          <q-table
            v-if="records.length > 0"
            :rows="records"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-case="{ props }">
              <q-td :props="props">{{ props.row.disciplinaryCase?.name || '-' }}</q-td>
            </template>
          </q-table>
          <div v-else class="text-center q-pa-lg">
            <q-icon name="gavel" size="100px" color="positive" />
            <p class="text-subtitle1 q-mt-md">هیچ مورد انضباطی ثبت نشده است</p>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'

const $q = useQuasar()
const loading = ref(false)
const records = ref<any[]>([])

const columns = [
  { name: 'case', label: 'نوع مورد', field: 'case', align: 'center' as const },
  { name: 'incident_date', label: 'تاریخ', field: 'incident_date', align: 'center' as const },
  { name: 'description', label: 'توضیحات', field: 'description', align: 'center' as const },
]

onMounted(async () => {
  loading.value = true
  try {
    const response = await student.disciplinary()
    records.value = response.data.data || response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری موارد انضباطی' })
  } finally {
    loading.value = false
  }
})
</script>
