<template>
  <div class="homework-detail-page">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ homeworkData.title }}</div>
        <div class="text-grey-7 q-mt-sm">
          درس: {{ homeworkData.lesson?.name || '-' }} | کلاس: {{ homeworkData.schoolClass?.name || '-' }}
        </div>
        <div
          v-if="homeworkData.description"
          class="q-mt-sm">
          <div class="text-subtitle2">توضیحات:</div>
          <p>{{ homeworkData.description }}</p>
        </div>
        <div
          v-if="homeworkData.due_date"
          class="q-mt-sm">
          <div class="text-subtitle2">موعد تحویل:</div>
          <p>{{ formatDate(homeworkData.due_date) }}</p>
        </div>
        <div
          v-if="homeworkData.attachment"
          class="q-mt-sm">
          <div class="text-subtitle2">ضمیمه ۱:</div>
          <a
            :href="homeworkData.attachment"
            target="_blank"
            class="text-primary">دانلود فایل</a>
        </div>
        <div
          v-if="homeworkData.attachment_2"
          class="q-mt-sm">
          <div class="text-subtitle2">ضمیمه ۲:</div>
          <a
            :href="homeworkData.attachment_2"
            target="_blank"
            class="text-primary">دانلود فایل</a>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">لیست دانش‌آموزان و وضعیت تکلیف</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="owners"
          :columns="ownerColumns"
          row-key="id"
          :loading="loading"
          flat
          bordered>
          <template #body-cell-student_name="props">
            <q-td :props="props">
              {{ props.row.student?.full_name || '-' }}
            </q-td>
          </template>
          <template #body-cell-read_status="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'positive' : 'negative'"
                text-color="white"
                :label="props.value ? 'خوانده شده' : 'خوانده نشده'" />
            </q-td>
          </template>
          <template #body-cell-submitted_at="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          <template #body-cell-submission_file="props">
            <q-td :props="props">
              <q-btn
                v-if="props.value"
                flat
                dense
                icon="download"
                color="primary"
                :href="props.value"
                target="_blank" />
              <span v-else>-</span>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkOwnerType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()

const homeworkData = ref<Partial<HomeworkType>>({})
const owners = ref<HomeworkOwnerType[]>([])
const loading = ref(false)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const ownerColumns = [
  { name: 'student_name', label: 'دانش‌آموز', align: 'right' as const, field: 'student.full_name' },
  { name: 'read_status', label: 'وضعیت مشاهده', align: 'center' as const, field: 'read_status' },
  { name: 'submitted_at', label: 'زمان ارسال', align: 'center' as const, field: 'submitted_at' },
  { name: 'submission_file', label: 'فایل ارسال شده', align: 'center' as const, field: 'submission_file' }
]

onMounted(async () => {
  loading.value = true
  try {
    homeworkData.value = await homeworkApi.get(Number(route.params.id))
    owners.value = homeworkData.value.owners || []
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات تکلیف.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
</style>
