<template>
  <q-page class="q-pa-md quiz-attempt-page">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <q-btn
          flat
          icon="arrow_back"
          color="primary"
          label="بازگشت به جزئیات آزمون"
          :disable="attemptStarted && !isFinalized"
          @click="goBack"
        />
      </div>
      <div v-if="attemptStarted" class="col-auto">
        <q-chip color="primary" text-color="white" icon="timer">
          زمان باقی‌مانده: {{ formatTime(remainingTime) }}
        </q-chip>
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="80px" />
      <div class="q-mt-md">در حال آماده‌سازی آزمون...</div>
    </div>

    <q-card v-else-if="loadError" class="q-pa-lg text-center">
      <q-icon name="error_outline" color="negative" size="64px" />
      <div class="text-h6 q-mt-md">{{ loadError }}</div>
      <q-btn class="q-mt-lg" color="primary" label="بازگشت" @click="goBack" />
    </q-card>

    <template v-else-if="quiz">
      <q-card v-if="!attemptStarted" class="q-mb-lg">
        <q-card-section>
          <div class="text-h5 q-mb-md">تایید اطلاعات آزمون</div>
          <div class="text-h6 q-mb-sm">{{ quiz.name }}</div>
          <p v-if="quiz.description" class="text-body1 text-grey-8">{{ quiz.description }}</p>

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 col-md-3">
              <q-card flat bordered class="q-pa-md full-height">
                <div class="text-caption text-grey">مدت آزمون</div>
                <div class="text-subtitle1">{{ formatDuration(quiz.timer || quiz.time_limit) }}</div>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered class="q-pa-md full-height">
                <div class="text-caption text-grey">تعداد سوال‌ها</div>
                <div class="text-subtitle1">{{ questions.length }} سوال</div>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered class="q-pa-md full-height">
                <div class="text-caption text-grey">شروع</div>
                <div class="text-subtitle1">{{ formatDateTime(quiz.start_time || quiz.starts_at) }}</div>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered class="q-pa-md full-height">
                <div class="text-caption text-grey">پایان</div>
                <div class="text-subtitle1">{{ formatDateTime(quiz.end_time || quiz.ends_at) }}</div>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-banner rounded class="bg-orange-1 text-orange-10 q-mb-md">
            بعد از شروع آزمون، خروج از صفحه، تغییر تب، کپی/پیست و کلیک راست به عنوان رویداد ضدتقلب ثبت می‌شود.
          </q-banner>
          <q-checkbox
            v-model="confirmedInfo"
            label="اطلاعات آزمون را بررسی کردم و آماده شروع هستم."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="انصراف" @click="goBack" />
          <q-btn
            color="primary"
            label="شروع آزمون"
            icon="play_arrow"
            :disable="!confirmedInfo"
            :loading="starting"
            @click="startSession"
          />
        </q-card-actions>
      </q-card>

      <div v-else>
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col-12 col-md">
                <div class="text-h5">{{ quiz.name }}</div>
                <div class="text-caption text-grey">
                  هر انتخاب بلافاصله با API ذخیره می‌شود. قبل از ثبت نهایی پاسخ‌ها را مرور کنید.
                </div>
              </div>
              <div class="col-12 col-md-auto">
                <q-linear-progress
                  :value="totalTime > 0 ? remainingTime / totalTime : 0"
                  color="primary"
                  size="12px"
                  style="width: 220px"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-for="(question, index) in questions" :key="question.id" class="q-mb-lg">
          <q-card :class="{ 'saving-card': savingQuestionIds.has(question.id) }">
            <q-card-section>
              <div class="row items-start q-col-gutter-md">
                <div class="col">
                  <div class="text-subtitle1 q-mb-md">
                    سوال {{ index + 1 }}: {{ question.question_text }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-chip
                    dense
                    :color="savedQuestionIds.has(question.id) ? 'positive' : 'grey-5'"
                    text-color="white"
                    :icon="savedQuestionIds.has(question.id) ? 'cloud_done' : 'cloud_queue'"
                  >
                    {{ savedQuestionIds.has(question.id) ? 'ذخیره شد' : 'ذخیره نشده' }}
                  </q-chip>
                </div>
              </div>

              <q-img
                v-if="question.question_image_url"
                :src="question.question_image_url"
                class="q-mb-md rounded-borders"
                fit="contain"
                style="max-width: 100%; max-height: 300px"
              />

              <q-option-group
                v-if="isChoiceQuestion(question)"
                :model-value="getSelectedOption(question.id)"
                :options="getQuestionOptions(question)"
                color="primary"
                @update:model-value="(value) => recordChoice(question, value)"
              />

              <q-input
                v-else
                :model-value="getAnswerText(question.id)"
                :type="question.question_type === 'essay' ? 'textarea' : 'text'"
                outlined
                label="پاسخ خود را بنویسید"
                :rows="question.question_type === 'essay' ? 5 : undefined"
                debounce="700"
                @update:model-value="(value) => recordTextAnswer(question, value)"
              />

              <div v-if="saveErrors[question.id]" class="text-negative text-caption q-mt-sm">
                {{ saveErrors[question.id] }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <q-card class="q-mt-lg q-mb-lg">
          <q-card-section>
            <div class="row items-center q-col-gutter-md">
              <div class="col-12 col-md">
                <div class="text-h6">مرور و ثبت نهایی</div>
                <div class="text-body2 text-grey-8">
                  {{ answeredCount }} از {{ questions.length }} سوال پاسخ داده شده است.
                  ابتدا مطمئن شوید همه انتخاب‌های شما ذخیره شده‌اند، سپس آزمون را نهایی کنید.
                </div>
              </div>
              <div class="col-12 col-md-auto">
                <q-btn
                  color="positive"
                  label="تایید پاسخ‌ها و ثبت نهایی آزمون"
                  size="lg"
                  icon="check_circle"
                  :loading="submitting"
                  :disable="hasPendingSaves"
                  @click="confirmSubmit"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { quizRepository } from 'src/repositories/quiz'
import { quizSession } from 'src/repositories/quizSession'

type QuestionOption = {
  id: number
  option_text?: string | null
  option_label?: string | null
}

type Question = {
  id: number
  question_text: string
  question_type?: string | null
  question_image_url?: string | null
  options?: QuestionOption[]
}

type AnswerState = {
  quiz_question_option_id: number | null
  answer_text: string | null
}

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const quizId = Number(route.params.id)
const quiz = ref<any>(null)
const session = ref<any>(null)
const sessionId = ref<number | null>(null)
const loading = ref(true)
const loadError = ref('')
const confirmedInfo = ref(false)
const starting = ref(false)
const submitting = ref(false)
const attemptStarted = ref(false)
const isFinalized = ref(false)
const remainingTime = ref(0)
const totalTime = ref(0)
const answers = ref<Map<number, AnswerState>>(new Map())
const savedQuestionIds = ref<Set<number>>(new Set())
const savingQuestionIds = ref<Set<number>>(new Set())
const saveErrors = reactive<Record<number, string>>({})

let timerInterval: ReturnType<typeof setInterval> | null = null
let antiCheatEventsAttached = false

const questions = computed<Question[]>(() => quiz.value?.questions || [])
const answeredCount = computed(() => Array.from(answers.value.values()).filter((answer) => answer.quiz_question_option_id || answer.answer_text).length)
const hasPendingSaves = computed(() => savingQuestionIds.value.size > 0)

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

const formatDuration = (value: string | number | null | undefined): string => {
  if (!value) return '-'
  if (typeof value === 'number') return `${value} دقیقه`
  const parts = value.split(':').map(Number)
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    const labels = []
    if (hours) labels.push(`${hours} ساعت`)
    if (minutes) labels.push(`${minutes} دقیقه`)
    if (seconds) labels.push(`${seconds} ثانیه`)
    return labels.join(' و ') || '-'
  }
  return value
}

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const normalizeResponseData = (response: any) => response?.data?.data || response?.data || response

const loadQuizInfo = async () => {
  loading.value = true
  loadError.value = ''
  try {
    quiz.value = normalizeResponseData(await quizRepository.get(quizId))
  } catch (error: any) {
    loadError.value = error.response?.data?.message || 'خطا در بارگذاری اطلاعات آزمون'
  } finally {
    loading.value = false
  }
}

const startSession = async () => {
  starting.value = true
  try {
    const payload = normalizeResponseData(await quizSession.startSession(quizId))
    session.value = payload.session
    sessionId.value = payload.session.id
    quiz.value = payload.session.quiz || quiz.value
    totalTime.value = payload.session.duration_seconds || payload.remaining_time || 0
    remainingTime.value = payload.remaining_time || totalTime.value
    attemptStarted.value = true
    attachAntiCheatEvents()
    startTimer()
    reportEvent('session_started', { quiz_id: quizId })
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'خطا در شروع آزمون'
    })
  } finally {
    starting.value = false
  }
}

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    remainingTime.value = Math.max(0, remainingTime.value - 1)
    if (remainingTime.value === 0) {
      reportEvent('time_finished')
      submitQuiz()
    }
  }, 1000)
}

const isChoiceQuestion = (question: Question) => {
  return ['multiple_choice', 'single_choice', 'true_false'].includes(question.question_type || '') || Boolean(question.options?.length)
}

const getQuestionOptions = (question: Question) => {
  if (question.options?.length) {
    return question.options.map((option) => ({
      label: option.option_text || option.option_label || `گزینه ${option.id}`,
      value: option.id
    }))
  }

  return [
    { label: 'صحیح', value: 'true' },
    { label: 'غلط', value: 'false' }
  ]
}

const getSelectedOption = (questionId: number) => answers.value.get(questionId)?.quiz_question_option_id
const getAnswerText = (questionId: number) => answers.value.get(questionId)?.answer_text || ''

const setAnswerState = (questionId: number, answer: AnswerState) => {
  const nextAnswers = new Map(answers.value)
  nextAnswers.set(questionId, answer)
  answers.value = nextAnswers
}

const recordChoice = (question: Question, value: number | string) => {
  const answer: AnswerState = typeof value === 'number'
    ? { quiz_question_option_id: value, answer_text: null }
    : { quiz_question_option_id: null, answer_text: String(value) }

  setAnswerState(question.id, answer)
  saveAnswer(question.id, answer)
}

const recordTextAnswer = (question: Question, value: string | number | null) => {
  const answer = {
    quiz_question_option_id: null,
    answer_text: value === null || value === undefined ? null : String(value)
  }
  setAnswerState(question.id, answer)
  saveAnswer(question.id, answer)
}

const saveAnswer = async (questionId: number, answer: AnswerState) => {
  if (!sessionId.value || isFinalized.value) return

  const savingSet = new Set(savingQuestionIds.value)
  savingSet.add(questionId)
  savingQuestionIds.value = savingSet
  delete saveErrors[questionId]

  try {
    await quizSession.submitAnswer(sessionId.value, {
      quiz_question_id: questionId,
      quiz_question_option_id: answer.quiz_question_option_id,
      answer_text: answer.answer_text
    })
    const savedSet = new Set(savedQuestionIds.value)
    savedSet.add(questionId)
    savedQuestionIds.value = savedSet
  } catch (error: any) {
    saveErrors[questionId] = error.response?.data?.message || 'ذخیره پاسخ ناموفق بود. دوباره انتخاب کنید.'
    const savedSet = new Set(savedQuestionIds.value)
    savedSet.delete(questionId)
    savedQuestionIds.value = savedSet
  } finally {
    const nextSavingSet = new Set(savingQuestionIds.value)
    nextSavingSet.delete(questionId)
    savingQuestionIds.value = nextSavingSet
  }
}

const confirmSubmit = () => {
  $q.dialog({
    title: 'ثبت نهایی آزمون',
    message: `آیا از ثبت نهایی ${answeredCount.value} پاسخ از ${questions.value.length} سوال مطمئن هستید؟ بعد از ثبت نهایی امکان تغییر پاسخ‌ها وجود ندارد.`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'ثبت نهایی',
      color: 'positive'
    },
    cancel: {
      label: 'بازبینی پاسخ‌ها',
      flat: true
    }
  }).onOk(() => {
    submitQuiz()
  })
}

const submitQuiz = async () => {
  if (!sessionId.value || submitting.value || isFinalized.value) return

  submitting.value = true
  try {
    await quizSession.submitQuiz(sessionId.value)
    isFinalized.value = true
    detachAntiCheatEvents()
    if (timerInterval) clearInterval(timerInterval)
    $q.notify({ type: 'positive', message: 'آزمون با موفقیت ثبت نهایی شد' })
    router.push({ name: 'Student.Quiz.Show', params: { id: quizId } })
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'خطا در ثبت نهایی آزمون'
    })
  } finally {
    submitting.value = false
  }
}

const reportEvent = (eventType: string, eventData: Record<string, unknown> = {}) => {
  if (!sessionId.value || isFinalized.value) return
  quizSession.reportAntiCheatEvent(sessionId.value, eventType, {
    ...eventData,
    remaining_time: remainingTime.value,
    url: window.location.href,
    at: new Date().toISOString()
  }).catch(() => undefined)
}

const handleVisibilityChange = () => {
  if (document.hidden) reportEvent('tab_hidden')
}

const handleWindowBlur = () => reportEvent('window_blur')
const handleCopyPaste = (event: ClipboardEvent) => reportEvent(event.type)
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  reportEvent('context_menu')
}
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!attemptStarted.value || isFinalized.value) return
  reportEvent('page_unload_attempt')
  event.preventDefault()
  event.returnValue = ''
}

const attachAntiCheatEvents = () => {
  if (antiCheatEventsAttached) return
  antiCheatEventsAttached = true
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleWindowBlur)
  document.addEventListener('copy', handleCopyPaste)
  document.addEventListener('paste', handleCopyPaste)
  document.addEventListener('cut', handleCopyPaste)
  document.addEventListener('contextmenu', handleContextMenu)
  window.addEventListener('beforeunload', handleBeforeUnload)
}

const detachAntiCheatEvents = () => {
  if (!antiCheatEventsAttached) return
  antiCheatEventsAttached = false
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('blur', handleWindowBlur)
  document.removeEventListener('copy', handleCopyPaste)
  document.removeEventListener('paste', handleCopyPaste)
  document.removeEventListener('cut', handleCopyPaste)
  document.removeEventListener('contextmenu', handleContextMenu)
  window.removeEventListener('beforeunload', handleBeforeUnload)
}

const goBack = () => {
  router.push({ name: 'Student.Quiz.Show', params: { id: quizId } })
}

onMounted(() => {
  loadQuizInfo()
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
  detachAntiCheatEvents()
})
</script>

<style scoped>
.quiz-attempt-page {
  max-width: 1100px;
  margin: 0 auto;
}

.saving-card {
  opacity: 0.86;
}
</style>
