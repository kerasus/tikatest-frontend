<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">{{ quiz?.name }}</h4>
      </div>
      <div class="col-auto">
        <div class="text-h6 text-primary">
          زمان باقی‌مانده: <span class="font-weight-bold">{{ formatTime(remainingTime) }}</span>
        </div>
      </div>
    </div>

    <!-- Timer Progress -->
    <q-linear-progress
      :value="remainingTime / totalTime"
      color="primary"
      class="q-mb-lg"
      :indeterminate="remainingTime <= 0"
    />

    <!-- Quiz Content -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <div v-else-if="!session || !quiz" class="text-center q-pa-lg">
      <p>خطا در بارگذاری آزمون</p>
      <q-btn color="primary" label="بازگشت" to="/panel/quizzes" />
    </div>

    <div v-else>
      <!-- Questions -->
      <div v-for="(question, index) in quiz.questions" :key="question.id" class="q-mb-lg">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1 q-mb-md">
              سوال {{ index + 1 }}: {{ question.question_text }}
            </div>

            <!-- Question Image -->
            <img
              v-if="question.question_image_url"
              :src="question.question_image_url"
              class="q-mb-md"
              style="max-width: 100%; max-height: 300px"
            />

            <!-- Multiple Choice -->
            <div v-if="question.question_type === 'multiple_choice'">
              <q-option-group
                :model-value="getAnswerForQuestion(question.id)"
                :options="
                  question.options.map((opt) => ({
                    label: opt.option_text,
                    value: opt.id
                  }))
                "
                color="primary"
                @update:model-value="(val) => setAnswer(question.id, { option_id: val })"
              />
            </div>

            <!-- True/False -->
            <div v-else-if="question.question_type === 'true_false'">
              <q-option-group
                :model-value="getAnswerForQuestion(question.id)"
                :options="[
                  { label: 'صحیح', value: 'true' },
                  { label: 'غلط', value: 'false' }
                ]"
                color="primary"
                @update:model-value="(val) => setAnswer(question.id, { answer: val, answer_text: val })"
              />
            </div>

            <!-- Fill in Blank -->
            <div v-else-if="question.question_type === 'fill_blank'">
              <q-input
                :model-value="getAnswerTextForQuestion(question.id)"
                type="text"
                outlined
                label="پاسخ خود را بنویسید"
                @update:model-value="(val) => setAnswer(question.id, { answer_text: val })"
              />
            </div>

            <!-- Essay -->
            <div v-else-if="question.question_type === 'essay'">
              <q-input
                :model-value="getAnswerTextForQuestion(question.id)"
                type="textarea"
                outlined
                label="پاسخ خود را بنویسید"
                rows="5"
                @update:model-value="(val) => setAnswer(question.id, { answer_text: val })"
              />
            </div>

            <!-- Explanation -->
            <div v-if="question.explanation" class="q-mt-md text-caption text-grey">
              <strong>توضیح:</strong> {{ question.explanation }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Submit Button -->
      <div class="q-mt-lg q-mb-lg text-center">
        <q-btn
          color="positive"
          label="ثبت پاسخ ها"
          size="lg"
          @click="submitQuiz"
          :loading="submitting"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { quizSession } from 'src/repositories/quizSession'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const quizId = parseInt(route.params.id as string)
const sessionId = ref<number | null>(null)
const quiz = ref<any>(null)
const session = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const remainingTime = ref(0)
const totalTime = ref(3600)
const answers = ref<Map<number, any>>(new Map())

let timerInterval: ReturnType<typeof setInterval> | null = null
let isSubmitted = false

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (n: number) => (n < 10 ? '0' + n : n)
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

const startSession = async () => {
  try {
    const response = await quizSession.startSession(quizId)
    sessionId.value = response.data.session.id
    session.value = response.data.session
    quiz.value = response.data.session.quiz
    totalTime.value = response.data.session.duration_seconds
    remainingTime.value = response.data.remaining_time

    startTimer()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'خطا در شروع آزمون'
    })
  } finally {
    loading.value = false
  }
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    remainingTime.value = Math.max(0, remainingTime.value - 1)

    if (remainingTime.value <= 0) {
      clearInterval(timerInterval!)
      submitQuiz()
    }
  }, 1000)
}

const getAnswerForQuestion = (questionId: number) => {
  return answers.value.get(questionId)?.option_id || answers.value.get(questionId)?.answer
}

const getAnswerTextForQuestion = (questionId: number) => {
  return answers.value.get(questionId)?.answer_text || ''
}

const setAnswer = (questionId: number, answerData: any) => {
  answers.value.set(questionId, answerData)
  // Auto-save answer
  if (sessionId.value) {
    saveAnswer(questionId, answerData)
  }
}

const saveAnswer = async (questionId: number, answerData: any) => {
  if (!sessionId.value) return

  try {
    await quizSession.submitAnswer(sessionId.value, {
      quiz_question_id: questionId,
      quiz_question_option_id: answerData.option_id || null,
      answer_text: answerData.answer_text || answerData.answer || null
    })
  } catch (error: any) {
    console.error('Error saving answer:', error)
  }
}

const submitQuiz = async () => {
  if (!sessionId.value || isSubmitted) return

  isSubmitted = true
  submitting.value = true

  try {
    await quizSession.submitQuiz(sessionId.value)
    $q.notify({
      type: 'positive',
      message: 'آزمون با موفقیت ثبت شد'
    })

    setTimeout(() => {
      router.push({ name: 'Student.Quiz.Show', params: { id: quizId } })
    }, 1500)
  } catch (error: any) {
    isSubmitted = false
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'خطا در ثبت آزمون'
    })
  } finally {
    submitting.value = false
  }
}

const reportEvent = (eventType: string, eventData: Record<string, unknown> = {}) => {
  if (!sessionId.value || isSubmitted) return
  quizSession.reportAntiCheatEvent(sessionId.value, eventType, {
    ...eventData,
    remaining_time: remainingTime.value,
    at: new Date().toISOString()
  }).catch(() => undefined)
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    reportEvent('tab_hidden')
  }
}

const handleWindowBlur = () => reportEvent('window_blur')
const handleCopyPaste = (event: ClipboardEvent) => {
  reportEvent(event.type)
}
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  reportEvent('context_menu')
}

onMounted(() => {
  startSession()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleWindowBlur)
  document.addEventListener('copy', handleCopyPaste)
  document.addEventListener('paste', handleCopyPaste)
  document.addEventListener('cut', handleCopyPaste)
  document.addEventListener('contextmenu', handleContextMenu)
})

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('blur', handleWindowBlur)
  document.removeEventListener('copy', handleCopyPaste)
  document.removeEventListener('paste', handleCopyPaste)
  document.removeEventListener('cut', handleCopyPaste)
  document.removeEventListener('contextmenu', handleContextMenu)
})
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}
</style>
