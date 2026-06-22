<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <q-btn flat icon="arrow_back" color="primary" @click="$router.back()" label="بازگشت" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <!-- Quiz Details -->
    <div v-else-if="quiz">
      <q-card class="q-mb-lg">
        <q-card-section>
          <h4 class="q-ma-none q-mb-md">{{ quiz.name }}</h4>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="q-mb-md">
                <strong>مدت زمان:</strong> {{ formatTime(quiz.timer) }}
              </div>
              <div class="q-mb-md">
                <strong>شروع:</strong> {{ formatDateTime(quiz.start_time) }}
              </div>
              <div class="q-mb-md">
                <strong>پایان:</strong> {{ formatDateTime(quiz.end_time) }}
              </div>
              <div class="q-mb-md">
                <strong>نمایش پاسخ‌ها:</strong> {{ formatDateTime(quiz.show_answer_date) }}
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="q-mb-md">
                <q-chip
                  :color="getStatusColor(quiz)"
                  text-color="white"
                  :label="getStatusLabel(quiz)"
                />
              </div>

              <div v-if="canAttemptQuiz" class="q-mb-md">
                <q-btn
                  color="primary"
                  label="شرکت در آزمون"
                  size="lg"
                  @click="startAttempt"
                  :loading="attempting"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="quiz.explanation" class="q-mt-lg">
            <strong>توضیحات:</strong>
            <p>{{ quiz.explanation }}</p>
          </div>
        </q-card-section>
      </q-card>

      <!-- Previous Attempts -->
      <q-card v-if="attempts.length > 0">
        <q-card-section>
          <h6 class="q-ma-none q-mb-md">تلاش‌های قبلی</h6>

          <q-list>
            <q-item v-for="attempt in attempts" :key="attempt.id">
              <q-item-section>
                <q-item-label>
                  <strong>نمره:</strong> {{ attempt.percent }}%
                </q-item-label>
                <q-item-label caption>
                  {{ formatDateTime(attempt.started_at) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center q-pa-lg">
      <p>آزمون یافت نشد</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { quizRepository } from 'src/repositories/quiz'
import { quizSession } from 'src/repositories/quizSession'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const quizId = parseInt(route.params.id as string)
const quiz = ref<any>(null)
const attempts = ref<any[]>([])
const loading = ref(true)
const attempting = ref(false)

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '-'
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  if (hours > 0) {
    return `${hours} ساعت ${minutes} دقیقه`
  }
  return `${minutes} دقیقه`
}

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
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

const canAttemptQuiz = computed(() => {
  if (!quiz.value) return false
  const now = new Date()
  const startTime = new Date(quiz.value.start_time)
  const endTime = new Date(quiz.value.end_time)
  return now >= startTime && now <= endTime
})

const startAttempt = async () => {
  attempting.value = true
  try {
    await quizSession.startSession(quizId)
    router.push({ name: 'Student.Quiz.Attempt', params: { id: quizId } })
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'خطا در شروع آزمون'
    })
  } finally {
    attempting.value = false
  }
}

const loadQuizDetails = async () => {
  loading.value = true
  try {
    quiz.value = await quizRepository.get(quizId)

    const attemptsRes = await quizSession.getMyAttempts()
    attempts.value = attemptsRes.data.filter((a: any) => a.quiz_id === quizId)
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری جزئیات آزمون'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuizDetails()
})
</script>
