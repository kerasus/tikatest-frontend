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
            <template #body-cell-term="props">
              <q-td :props="props">{{ props.row.term?.name || '-' }}</q-td>
            </template>
            <template #body-cell-source="props">
              <q-td :props="props">{{ sourceLabel(props.row.source) }}</q-td>
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
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import { studySession } from 'src/repositories/studySession'
import type { StudySessionType } from 'src/repositories/studySession'

const $q = useQuasar()
const userStore = useUser()
const loading = ref(false)
const sessions = ref<StudySessionType[]>([])

const studentId = computed(() => userStore.me?.id ?? null)

const sourceLabels: Record<string, string> = {
  manual: 'دستی',
  lms: 'سیستم مدیریت یادگیری',
  online_class: 'کلاس آنلاین'
}

function sourceLabel (source: string | null): string {
  return sourceLabels[source ?? ''] ?? source ?? '-'
}

const columns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'term', label: 'ترم', field: 'term', align: 'center' as const },
  { name: 'started_at', label: 'شروع', field: 'started_at', align: 'center' as const },
  { name: 'ended_at', label: 'پایان', field: 'ended_at', align: 'center' as const },
  { name: 'description', label: 'توضیحات', field: 'description', align: 'center' as const },
  { name: 'source', label: 'منبع', field: 'source', align: 'center' as const }
]

onMounted(async () => {
  loading.value = true
  try {
    const response = await studySession.index({
      student_id: studentId.value,
      length: 100
    })
    sessions.value = response.data ?? []
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری ساعات مطالعه' })
  } finally {
    loading.value = false
  }
})
</script>
