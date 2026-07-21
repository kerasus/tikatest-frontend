<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">آزمون‌های آنلاین من</h4>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="quizzes.length === 0"
      class="text-center q-pa-lg">
      <q-icon
        name="assignment"
        size="100px"
        color="primary" />
      <p class="text-subtitle1 q-mt-md">هیچ آزمونی برای شما موجود نیست</p>
    </div>

    <!-- Quizzes List -->
    <div
      v-else
      class="row q-col-gutter-md">
      <div
        v-for="quiz in quizzes"
        :key="quiz.id"
        class="col-12 col-md-6">
        <q-card
          class="quiz-card cursor-pointer"
          @click="navigateTo(quiz)">
          <q-card-section>
            <div class="text-h6">{{ quiz.name }}</div>
            <div class="text-caption text-grey q-mt-sm">
              مدت زمان: {{ quiz.time_limit ? quiz.time_limit + ' دقیقه' : '-' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none">
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey">وضعیت</div>
                <q-chip
                  :color="getStatusColor(quiz)"
                  text-color="white"
                  :label="getStatusLabel(quiz)"
                  size="sm" />
              </div>
              <q-btn
                flat
                round
                dense
                icon="arrow_forward"
                color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appApi } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const quizzes = ref<any[]>([])
const loading = ref(true)

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '-'
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  if (hours > 0) {
    return `${hours} ساعت ${minutes} دقیقه`
  }
  return `${minutes} دقیقه`
}

const getStatusColor = (quiz: any): string => {
  const now = new Date()
  const startTime = new Date(quiz.start_time)
  const endTime = new Date(quiz.end_time)

  if (now < startTime) return 'info'
  if (now > endTime) return 'negative'
  return 'positive'
}

const getStatusLabel = (quiz: any): string => {
  const now = new Date()
  const startTime = new Date(quiz.start_time)
  const endTime = new Date(quiz.end_time)

  if (now < startTime) return 'هنوز شروع نشده'
  if (now > endTime) return 'پایان یافته'
  return 'در حال برگزاری'
}

const navigateTo = (quiz: any) => {
  const now = new Date()
  const startTime = new Date(quiz.start_time)
  const endTime = new Date(quiz.end_time)

  if (now >= startTime && now <= endTime) {
    router.push({ name: 'Student.Quiz.Attempt', params: { id: quiz.id } })
  } else {
    router.push({ name: 'Student.Quiz.Show', params: { id: quiz.id } })
  }
}

const loadQuizzes = async () => {
  loading.value = true
  try {
    const response = await appApi.get('/student-portal/quizzes', { params: { length: 100 } })
    quizzes.value = response.data.data || []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری آزمون‌ها'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuizzes()
})
</script>

<style scoped>
.quiz-card {
  transition: all 0.3s ease;
}

.quiz-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}
</style>
