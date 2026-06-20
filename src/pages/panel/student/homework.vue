<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">تکالیف من</h4>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="homeworks.length === 0" class="text-center q-pa-lg">
      <q-icon name="assignment" size="100px" color="primary" />
      <p class="text-subtitle1 q-mt-md">هیچ تکلیفی برای شما موجود نیست</p>
    </div>

    <!-- Homeworks List -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="homework in homeworks" :key="homework.id" class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-start q-col-gutter-md">
              <div class="col">
                <h6 class="q-ma-none q-mb-sm">{{ homework.title }}</h6>
                <p class="q-ma-none q-mb-md text-caption text-grey">
                  {{ homework.description }}
                </p>
                <div class="row q-col-gutter-md">
                  <div class="col-auto">
                    <strong>درس:</strong> {{ homework.lesson?.name || '-' }}
                  </div>
                  <div class="col-auto">
                    <strong>مهلت:</strong> {{ formatDate(homework.due_date) }}
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getStatusColor(homework)"
                  text-color="white"
                  :label="getStatusLabel(homework)"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="homework.submissions?.length > 0" />

          <q-card-section v-if="homework.submissions?.length > 0">
            <strong>تکالیف ارسال‌شده:</strong>
            <q-list v-for="submission in homework.submissions" :key="submission.id" class="q-mt-md">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ formatDate(submission.submitted_at) }}</q-item-label>
                  <q-item-label caption>
                    <q-chip
                      v-if="submission.grade"
                      color="positive"
                      text-color="white"
                      :label="`نمره: ${submission.grade}`"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { homeworkRepository } from 'src/repositories/homework'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const homeworks = ref<any[]>([])
const loading = ref(true)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getStatusColor = (homework: any): string => {
  const now = new Date()
  const dueDate = new Date(homework.due_date)

  if (homework.submissions?.length > 0) return 'positive'
  if (now > dueDate) return 'negative'
  return 'info'
}

const getStatusLabel = (homework: any): string => {
  if (homework.submissions?.length > 0) return 'ارسال‌شده'
  const now = new Date()
  const dueDate = new Date(homework.due_date)
  if (now > dueDate) return 'مهلت تمام‌شده'
  return 'در انتظار ارسال'
}

const loadHomeworks = async () => {
  loading.value = true
  try {
    const response = await homeworkRepository.list()
    homeworks.value = response.data.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری تکالیف'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHomeworks()
})
</script>
