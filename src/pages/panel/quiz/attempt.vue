<template>
  <q-page class="quiz-attempt-page">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="80px" />
      <div class="q-mt-md">در حال آماده‌سازی آزمون...</div>
    </div>

    <q-card v-else-if="loadError" class="q-pa-lg text-center">
      <q-icon name="error_outline" color="negative" size="64px" />
      <div class="text-h6 q-mt-md">{{ loadError }}</div>
      <q-btn class="q-mt-lg" color="primary" label="بازگشت" @click="goBack" />
    </q-card>

    <!-- Pre-start confirmation (Quiz.Confirm) -->
    <q-card v-else-if="quiz && !attemptStarted" class="confirm-card q-ma-md">
      <q-card-section>
        <div class="text-h5 q-mb-md">تایید اطلاعات آزمون</div>
        <div class="text-h6 q-mb-sm">{{ quiz.name }}</div>
        <p v-if="quiz.description" class="text-body1 text-grey-8">{{ quiz.description }}</p>

        <q-list bordered class="rounded-borders q-mt-md">
          <q-item>
            <q-item-section>
              <q-item-label caption>زمان آزمون</q-item-label>
              <q-item-label>{{ formatDuration(quiz.time_limit) }} دقیقه</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>تعداد سؤال</q-item-label>
              <q-item-label>{{ questionCount }} سؤال</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>شروع</q-item-label>
              <q-item-label>{{ formatDateTime(quiz.start_time || quiz.starts_at) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>پایان</q-item-label>
              <q-item-label>{{ formatDateTime(quiz.end_time || quiz.ends_at) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-banner rounded class="bg-orange-1 text-orange-10 q-mb-md">
          بعد از شروع آزمون، خروج از صفحه، تغییر تب، کپی/پیست و کلیک راست به عنوان رویداد ضدتقلب ثبت می‌شود.
        </q-banner>
        <q-checkbox v-model="confirmedInfo" label="اطلاعات آزمون را بررسی کردم و آماده شروع هستم." />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="انصراف" @click="goBack" />
        <q-btn
          color="primary"
          label="تایید"
          icon="play_arrow"
          :disable="!confirmedInfo"
          :loading="starting"
          @click="startSession"
        />
      </q-card-actions>
    </q-card>

    <!-- During / after attempt -->
    <q-layout v-else-if="quiz && attemptStarted" view="lHh Lpr lFf" container class="quiz-layout-container">
      <q-header elevated class="bg-white text-dark">
        <q-toolbar>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawerOpen = !drawerOpen" />
          <q-toolbar-title class="text-subtitle1">{{ quiz.name }}</q-toolbar-title>
          <q-chip v-if="!isFinalized" color="primary" text-color="white" icon="timer">
            {{ formatTime(remainingTime) }}
          </q-chip>
        </q-toolbar>
        <q-linear-progress
          v-if="!isFinalized"
          :value="totalTime > 0 ? remainingTime / totalTime : 0"
          color="info"
          size="12px"
          class="timer-progress"
        />
      </q-header>

      <q-drawer
        v-model="drawerOpen"
        show-if-above
        bordered
        :width="340"
        class="sidebar-drawer"
      >
        <div class="sidebar-content q-pa-sm">
          <div v-if="isFinalized && canShowSolutionToggle" class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <q-btn
                flat
                dense
                color="primary"
                class="full-width"
                label="مشاهده سؤالات"
                @click="showSolution = false"
              />
            </div>
            <div class="col-6">
              <q-btn
                flat
                dense
                color="primary"
                class="full-width"
                label="مشاهده پاسخنامه"
                @click="showSolution = true"
              />
            </div>
          </div>

          <QuizBubbleSheet
            :question-count="questionCount"
            :choices="choices"
            :save-status="saveStatusMap"
            :user-answers="answers"
            :correct-answers="correctAnswersMap"
            :readonly="isFinalized || submitDialogOpen"
            :disabled="isFinalized || submitDialogOpen"
            :show-comparison="isFinalized && canShowCorrectAnswers"
            @select="selectOption"
          />

          <div class="row q-mt-sm color-palette-set">
            <div class="col text-center"><q-badge color="yellow-8" label="در حال ارسال" /></div>
            <div class="col text-center"><q-badge color="positive" label="ارسال شده" /></div>
            <div class="col text-center"><q-badge color="negative" label="اشکال در ارسال" /></div>
          </div>

          <div v-if="isFinalized" class="result-report q-mt-md">
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label>درصد داوطلب</q-item-label>
                  <q-item-label caption class="text-left" dir="ltr">{{ submittedPercent }}%</q-item-label>
                </q-item-section>
              </q-item>

              <template v-if="session?.booklet_scores?.length">
                <q-item-label header class="q-px-none">درصد دفترچه‌ها</q-item-label>
                <q-item v-for="bs in session.booklet_scores" :key="bs.id">
                  <q-item-section>
                    <q-item-label>{{ bs.title }}</q-item-label>
                    <q-item-label caption class="text-left" dir="ltr">
                      سؤالات {{ bs.from_question }} تا {{ bs.to_question }} - {{ bs.percent }}%
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <q-item>
                <q-item-section>
                  <q-item-label>تاریخ و زمان شرکت در آزمون</q-item-label>
                  <q-item-label caption class="text-left" dir="ltr">{{ formatDateTime(session?.session_started_at) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>تاریخ و زمان ارسال پاسخنامه</q-item-label>
                  <q-item-label caption class="text-left" dir="ltr">{{ formatDateTime(session?.submitted_at) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="resultReport?.field_rank">
                <q-item-section>
                  <q-item-label>رتبه داوطلب در پایه</q-item-label>
                  <q-item-label caption>{{ resultReport.field_rank }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="resultReport?.field_count">
                <q-item-section>
                  <q-item-label>تعداد شرکت‌کنندگان در پایه</q-item-label>
                  <q-item-label caption>{{ resultReport.field_count }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              v-if="canShowSolutionToggle"
              color="primary"
              class="full-width q-mt-sm"
              flat
              :label="showSolution ? 'مشاهده سؤالات' : 'مشاهده پاسخنامه تشریحی'"
              @click="toggleSolution"
            />
            <q-btn
              color="primary"
              class="full-width q-mt-sm"
              label="مشاهده گزارش آزمون"
              @click="resultReportDialog = true"
            />
          </div>

          <div v-else class="q-mt-md">
            <q-btn
              color="primary"
              class="full-width"
              icon="send"
              label="ارسال پاسخنامه"
              :disable="hasPendingSaves"
              @click="openSubmitDialog"
            />
          </div>

          <div class="scroll-controls q-mt-sm">
            <q-btn flat dense round icon="keyboard_arrow_up" color="info" @click="scrollAnswerSheet(-120)" />
            <q-btn flat dense round icon="keyboard_arrow_down" color="info" @click="scrollAnswerSheet(120)" />
          </div>

          <q-btn
            flat
            color="primary"
            class="full-width q-mt-sm"
            label="بازگشت به صفحه اصلی"
            @click="goBack"
          />
        </div>
      </q-drawer>

      <q-page-container>
        <q-page class="content-page">
          <div v-if="!showSolution" class="content-viewer">
            <template v-for="(item, index) in quizContentItems" :key="index">
              <div class="question-item q-mb-lg">
                <div class="text-subtitle1 q-mb-sm">سؤال {{ index + 1 }}</div>
                <q-img
                  v-if="item.type === 'image' && item.path"
                  :src="getStorageUrl(item.path)"
                  class="rounded-borders"
                  fit="contain"
                  style="max-width: 100%; max-height: calc(100vh - 145px)"
                />
                <embed
                  v-else-if="item.type === 'pdf' && item.path"
                  :src="getStorageUrl(item.path) + '#view=Fit'"
                  type="application/pdf"
                  class="pdf-viewer"
                />
                <div v-else-if="item.type === 'text'" class="text-content q-pa-md bg-white">
                  {{ item.body }}
                </div>
              </div>
            </template>
          </div>

          <div v-else-if="canShowSolutionContent" class="content-viewer">
            <template v-for="(item, index) in quizSolutionItems" :key="'sol-' + index">
              <div class="solution-item q-mb-lg">
                <div class="text-subtitle1 q-mb-sm">راه‌حل {{ index + 1 }}</div>
                <q-img
                  v-if="item.type === 'image' && item.path"
                  :src="getStorageUrl(item.path)"
                  class="rounded-borders"
                  fit="contain"
                  style="max-width: 100%; max-height: calc(100vh - 145px)"
                />
                <embed
                  v-else-if="item.type === 'pdf' && item.path"
                  :src="getStorageUrl(item.path) + '#view=Fit'"
                  type="application/pdf"
                  class="pdf-viewer"
                />
                <div v-else-if="item.type === 'text'" class="text-content q-pa-md bg-white">
                  {{ item.body }}
                </div>
              </div>
            </template>
          </div>

          <div v-else class="q-pa-lg text-grey-7 text-center">
            در حال حاضر امکان مشاهده پاسخنامه وجود ندارد.
          </div>
        </q-page>
      </q-page-container>
    </q-layout>

    <!-- Submit confirmation dialog -->
    <q-dialog v-model="submitDialogOpen" persistent>
      <q-card style="min-width: 320px; max-width: 720px; width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">توجه</div>
          <q-space />
          <q-btn v-if="!submitting && !submitCompleted" flat round dense icon="close" @click="cancelSubmitDialog" />
        </q-card-section>

        <q-card-section>
          <p v-if="!submitCompleted" class="text-body1">
            شما در حال ارسال پاسخنامه آزمون هستید. آیا اطمینان دارید؟
          </p>
          <p v-else class="text-body1 text-positive">پاسخنامه با موفقیت ارسال شد</p>

          <div v-if="submitDialogLoading" class="text-center q-pa-md">کمی صبر کنید...</div>

          <QuizBubbleSheet
            v-else-if="!submitCompleted"
            :question-count="questionCount"
            :choices="choices"
            readonly
            disabled
            class="q-mt-md confirmation-sheet"
          />

          <div v-if="submitCompleted" class="q-mt-md text-center">
            <div>درصد شما در این آزمون:</div>
            <div class="text-h5 text-primary" dir="ltr">{{ submittedPercent }}%</div>
          </div>

          <q-banner v-if="submitDialogError" class="bg-red-1 text-red-10 q-mt-md" rounded>
            {{ submitDialogError }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <template v-if="submitCompleted">
            <q-btn color="primary" label="بازگشت به پنل کاربری" @click="goBack" />
            <q-btn flat color="primary" label="مشاهده نتیجه" :to="{ name: 'Student.Quiz.Result', params: { id: quizId } }" />
          </template>
          <template v-else-if="!submitting">
            <q-btn flat color="negative" label="خیر" style="min-width: 80px" @click="cancelSubmitDialog" />
            <q-btn color="positive" label="بله" style="min-width: 80px" @click="confirmSubmit" />
          </template>
          <q-spinner v-else color="primary" size="32px" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Time expired dialog -->
    <q-dialog v-model="timeExpiredDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="timer_off" color="negative" size="md" class="q-mr-sm" />
          <span>زمان شما به اتمام رسید.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="پایان آزمون" :loading="submitting" @click="submitQuiz(true)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Result report dialog -->
    <q-dialog v-model="resultReportDialog">
      <q-card style="min-width: 320px">
        <q-card-section class="text-h6">گزارش آزمون</q-card-section>
        <q-card-section class="q-pt-none">
          <q-list dense bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label>درصد داوطلب</q-item-label>
                <q-item-label caption dir="ltr">{{ submittedPercent }}%</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>تاریخ و زمان شرکت در آزمون</q-item-label>
                <q-item-label caption dir="ltr">{{ formatDateTime(session?.session_started_at) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>تاریخ و زمان ارسال پاسخنامه</q-item-label>
                <q-item-label caption dir="ltr">{{ formatDateTime(session?.submitted_at) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="resultReport?.field_rank">
              <q-item-section>
                <q-item-label>رتبه داوطلب در پایه</q-item-label>
                <q-item-label caption>{{ resultReport.field_rank }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="resultReport?.field_count">
              <q-item-section>
                <q-item-label>تعداد شرکت‌کنندگان در پایه</q-item-label>
                <q-item-label caption>{{ resultReport.field_count }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="بستن" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { quizRepository } from 'src/repositories/quiz'
import { quizSession } from 'src/repositories/quizSession'
import QuizBubbleSheet from 'src/components/quiz/QuizBubbleSheet.vue'

type QuizContentItem = {
  type: 'text' | 'image' | 'pdf'
  body?: string
  path?: string
}

type SaveStatus = 'pending' | 'saved' | 'error'

const NO_ANSWER_VALUE = 'none'

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
const showSolution = ref(false)
const drawerOpen = ref(true)
const submitDialogOpen = ref(false)
const submitDialogLoading = ref(false)
const submitDialogError = ref('')
const submitCompleted = ref(false)
const submittedPercent = ref<number | string>('-')
const timeExpiredDialog = ref(false)
const resultReportDialog = ref(false)
const resultReport = ref<any>(null)

const answers = reactive<Record<number, string>>({})
const choices = reactive<Record<number, string>>({})
const saveStatus = reactive<Record<number, SaveStatus>>({})
const saveErrors = reactive<Record<number, string>>({})

const savingQuestionNumbers = ref<Set<number>>(new Set())

let timerInterval: ReturnType<typeof setInterval> | null = null
let antiCheatEventsAttached = false

const quizContentItems = computed<QuizContentItem[]>(() => quiz.value?.content || [])
const quizSolutionItems = computed<QuizContentItem[]>(() => quiz.value?.solution || [])

const questionCount = computed(() => {
  if (quiz.value?.answer_keys?.length) return quiz.value.answer_keys.length
  return quizContentItems.value.length
})

const hasPendingSaves = computed(() => savingQuestionNumbers.value.size > 0)

const saveStatusMap = computed(() => ({ ...saveStatus }))

const correctAnswersMap = computed<Record<number, string>>(() => {
  const map: Record<number, string> = {}
  if (quiz.value?.answer_keys?.length) {
    quiz.value.answer_keys.forEach((key: any) => {
      map[key.question_number] = key.correct_option
    })
    return map
  }
  ;(session.value?.responses || []).forEach((response: any) => {
    if (response.correct_option) {
      map[response.question_number] = response.correct_option
    }
  })
  return map
})

const canShowCorrectAnswers = computed(() => {
  if (!quiz.value?.show_answer_date) return isFinalized.value
  return isFinalized.value && new Date() >= new Date(quiz.value.show_answer_date)
})

const canShowSolutionToggle = computed(() =>
  isFinalized.value && (quizSolutionItems.value.length > 0 || canShowCorrectAnswers.value)
)

const canShowSolutionContent = computed(() =>
  canShowCorrectAnswers.value && quizSolutionItems.value.length > 0
)

const normalizeResponseData = (response: any) => response?.data?.data || response?.data || response

const initializeChoices = () => {
  for (let index = 1; index <= questionCount.value; index += 1) {
    if (!choices[index]) {
      choices[index] = answers[index] || NO_ANSWER_VALUE
    }
  }
}

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

const formatDuration = (value: number | null | undefined): string => {
  if (!value) return '-'
  return `${value}`
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

const getStorageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const api = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${api.replace('/api', '')}/storage/${path}`
}

const isAnswerComplete = (): boolean => {
  for (let index = 1; index <= questionCount.value; index += 1) {
    if (!choices[index]) return false
  }
  return questionCount.value > 0
}

const mapChoiceToApiOption = (value: string): string | null => {
  if (value === NO_ANSWER_VALUE) return null
  return value
}

const loadQuizInfo = async () => {
  loading.value = true
  loadError.value = ''
  try {
    quiz.value = normalizeResponseData(await quizRepository.get(quizId))
    await restoreExistingSession()
  } catch (error: any) {
    loadError.value = error.response?.data?.message || 'خطا در بارگذاری اطلاعات آزمون'
  } finally {
    loading.value = false
  }
}

const restoreExistingSession = async () => {
  try {
    const sessionsRes = normalizeResponseData(await quizSession.getMyAttempts())
    const existing = (sessionsRes || []).find(
      (item: any) => item.quiz_id === quizId && ['in_progress', 'submitted', 'graded'].includes(item.status)
    )
    if (!existing) return

    if (['submitted', 'graded'].includes(existing.status)) {
      router.replace({ name: 'Student.Quiz.Result', params: { id: quizId } })
      return
    }

    const sessionPayload = normalizeResponseData(await quizSession.getSession(existing.id))
    session.value = sessionPayload.session || existing
    sessionId.value = session.value.id
    totalTime.value = session.value.duration_seconds || 0
    remainingTime.value = sessionPayload.remaining_time ?? session.value.duration_seconds ?? 0
    attemptStarted.value = true

    ;(session.value.responses || []).forEach((response: any) => {
      if (response.submitted_option) {
        answers[response.question_number] = response.submitted_option
        choices[response.question_number] = response.submitted_option
        saveStatus[response.question_number] = 'saved'
      }
    })
    initializeChoices()
    attachAntiCheatEvents()
    startTimer()
  } catch {
    // No active session to restore.
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
    initializeChoices()
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
    if (remainingTime.value === 0 && !isFinalized.value) {
      reportEvent('time_finished')
      timeExpiredDialog.value = true
    }
  }, 1000)
}

const selectOption = (questionNumber: number, optionValue: string) => {
  if (isFinalized.value || !sessionId.value || submitDialogOpen.value) return

  choices[questionNumber] = optionValue
  if (optionValue === NO_ANSWER_VALUE) {
    delete answers[questionNumber]
    saveStatus[questionNumber] = 'saved'
    return
  }

  answers[questionNumber] = optionValue
  saveAnswer(questionNumber, optionValue)
}

const saveAnswer = async (questionNumber: number, optionValue: string) => {
  if (!sessionId.value || isFinalized.value) return

  const savingSet = new Set(savingQuestionNumbers.value)
  savingSet.add(questionNumber)
  savingQuestionNumbers.value = savingSet
  saveStatus[questionNumber] = 'pending'
  delete saveErrors[questionNumber]

  try {
    await quizSession.submitAnswer(sessionId.value, {
      question_number: questionNumber,
      submitted_option: mapChoiceToApiOption(optionValue)
    })
    saveStatus[questionNumber] = 'saved'
  } catch (error: any) {
    saveStatus[questionNumber] = 'error'
    saveErrors[questionNumber] = error.response?.data?.message || 'ذخیره پاسخ ناموفق بود. دوباره انتخاب کنید.'
  } finally {
    const nextSavingSet = new Set(savingQuestionNumbers.value)
    nextSavingSet.delete(questionNumber)
    savingQuestionNumbers.value = nextSavingSet
  }
}

const openSubmitDialog = () => {
  submitDialogError.value = ''
  submitCompleted.value = false

  if (!isAnswerComplete()) {
    submitDialogOpen.value = true
    submitDialogError.value = 'لطفاً مجدداً گزینه‌های خود را انتخاب نمایید و مجدد روی دکمه ارسال پاسخ کلیک کنید.'
    return
  }

  submitDialogOpen.value = true
  submitDialogLoading.value = false
}

const cancelSubmitDialog = () => {
  if (submitting.value) return
  submitDialogOpen.value = false
  submitDialogError.value = ''
  submitCompleted.value = false
}

const confirmSubmit = async () => {
  await submitQuiz(false)
}

const submitQuiz = async (fromTimeout = false) => {
  if (!sessionId.value || submitting.value || isFinalized.value) return

  submitting.value = true
  submitDialogLoading.value = true
  submitDialogError.value = ''

  try {
    const response = normalizeResponseData(await quizSession.submitQuiz(sessionId.value))
    session.value = response.session || session.value
    isFinalized.value = true
    submitCompleted.value = true
    submittedPercent.value = session.value?.percent ?? '-'
    timeExpiredDialog.value = false
    detachAntiCheatEvents()
    if (timerInterval) clearInterval(timerInterval)

    if (!fromTimeout) {
      submitDialogOpen.value = true
    }

    await loadResultReport()
  } catch (error: any) {
    submitDialogError.value = error.response?.data?.message || 'مشکلی در ارسال پاسخنامه رخ داده است. لطفا مجدد تلاش کنید.'
    if (fromTimeout) {
      $q.notify({ type: 'negative', message: submitDialogError.value })
    }
  } finally {
    submitting.value = false
    submitDialogLoading.value = false
  }
}

const loadResultReport = async () => {
  try {
    const attemptsRes = normalizeResponseData(await quizSession.getMyAttempts())
    const current = (attemptsRes || []).find((item: any) => item.id === sessionId.value)
    if (current) {
      resultReport.value = {
        field_rank: current.field_rank,
        field_count: current.field_count,
        field_avg_percent: current.field_avg_percent,
        class_rank: current.class_rank,
        class_count: current.class_count
      }
    }
  } catch {
    resultReport.value = null
  }
}

const toggleSolution = () => {
  if (!canShowSolutionContent.value && showSolution.value === false) {
    $q.notify({ type: 'warning', message: 'در حال حاضر امکان مشاهده پاسخنامه وجود ندارد.' })
    return
  }
  showSolution.value = !showSolution.value
}

const scrollAnswerSheet = (offset: number) => {
  const scrollArea = document.querySelector('.bubble-sheet-scroll .scroll')
  if (scrollArea) {
    scrollArea.scrollTop += offset
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

const attachAntiCheatEvents = () => {
  if (antiCheatEventsAttached) return
  antiCheatEventsAttached = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('blur', onWindowBlur)
  document.addEventListener('copy', onCopyEvent)
  document.addEventListener('paste', onPasteEvent)
  document.addEventListener('cut', onCutEvent)
  document.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('beforeunload', onBeforeUnload)
}

const detachAntiCheatEvents = () => {
  if (!antiCheatEventsAttached) return
  antiCheatEventsAttached = false
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('blur', onWindowBlur)
  document.removeEventListener('copy', onCopyEvent)
  document.removeEventListener('paste', onPasteEvent)
  document.removeEventListener('cut', onCutEvent)
  document.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('beforeunload', onBeforeUnload)
}

const onVisibilityChange = () => {
  if (document.hidden) reportEvent('tab_hidden')
}

const onWindowBlur = () => reportEvent('window_blur')
const onCopyEvent = (e: Event) => reportEvent(e.type)
const onPasteEvent = (e: Event) => reportEvent(e.type)
const onCutEvent = (e: Event) => reportEvent(e.type)

const onContextMenu = (e: Event) => {
  e.preventDefault()
  reportEvent('context_menu')
}

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (!attemptStarted.value || isFinalized.value) return
  reportEvent('page_unload_attempt')
  e.preventDefault()
  e.returnValue = ''
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
  min-height: calc(100vh - 50px);
}

.confirm-card {
  max-width: 720px;
  margin: 0 auto;
}

.quiz-layout-container {
  min-height: calc(100vh - 50px);
}

.sidebar-drawer {
  background: #fafafa;
}

.sidebar-content {
  min-height: 100%;
}

.content-page {
  padding: 8px;
}

.content-viewer {
  direction: rtl;
  overflow: auto;
  width: 100%;
}

.pdf-viewer {
  width: 100%;
  height: calc(100vh - 145px);
  border: none;
}

.text-content {
  white-space: pre-wrap;
  line-height: 1.8;
  color: #4e4e4e;
}

.color-palette-set {
  gap: 4px;
}

.scroll-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.confirmation-sheet :deep(.bubble-sheet-scroll) {
  height: auto;
  max-height: 320px;
}

.timer-progress {
  position: sticky;
  top: 50px;
  z-index: 1;
}
</style>
