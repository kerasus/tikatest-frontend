<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ساعات مطالعه</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="ثبت ساعت جدید"
          :to="{ name: 'Student.StudySessions.Create' }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else>
      <q-card>
        <q-card-section>
          <q-table
            v-if="sessions.length > 0"
            :rows="sessions"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-lesson="props">
              <q-td :props="props">{{ props.row.lesson?.name || '-' }}</q-td>
            </template>
            <template #body-cell-duration="props">
              <q-td :props="props">{{ props.row.duration_minutes || 0 }} دقیقه</q-td>
            </template>
          </q-table>
          <div
            v-else
            class="text-center q-pa-lg">
            <q-icon
              name="menu_book"
              size="100px"
              color="primary" />
            <p class="text-subtitle1 q-mt-md">هنوز ساعت مطالعه‌ای ثبت نشده است</p>
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
const sessions = ref<any[]>([])

const columns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'started_at', label: 'شروع', field: 'started_at', align: 'center' as const },
  { name: 'ended_at', label: 'پایان', field: 'ended_at', align: 'center' as const },
  { name: 'duration', label: 'مدت (دقیقه)', field: 'duration', align: 'center' as const },
  { name: 'notes', label: 'یادداشت', field: 'notes', align: 'center' as const }
]

onMounted(async () => {
  loading.value = true
  try {
    const response = await student.studySessions()
    sessions.value = response.data.data || response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری ساعات مطالعه' })
  } finally {
    loading.value = false
  }
})
</script>
