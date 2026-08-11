<template>
  <q-page class="q-pa-md">
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <div
      v-else-if="error"
      class="text-center q-pa-lg">
      <q-icon
        name="error"
        size="100px"
        color="negative" />
      <p class="text-subtitle1 q-mt-md">{{ error }}</p>
      <q-btn
        label="بازگشت"
        icon="arrow_back"
        @click="goBack" />
    </div>

    <div
      v-else
      class="exam-attempt-page">
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h4 class="q-ma-none">{{ session?.exam?.name }}</h4>
        </div>
        <div class="col-auto">
          <div class="text-caption text-grey-6">
            زمان باقی‌مانده: {{ formatRemainingTime }}
          </div>
          <q-btn
            flat
            icon="close"
            label="اتمام آزمون"
            color="negative"
            @click="confirmSubmit" />
        </div>
      </div>

      <q-card>
        <q-card-section>
          <div
            class="text-body1"
            v-html="currentQuestionBody" />
        </q-card-section>

        <q-card-section v-if="answer_keys.length > 0">
          <q-list>
            <q-item
              v-for="option in getOptions(currentQuestionNumber)"
              :key="option.value"
              v-ripple
              dense
              clickable
              :color="selectedOption === option.value ? 'primary' : undefined"
              :text-color="selectedOption === option.value ? 'white' : undefined"
              @click="selectOption(option.value)">
              <q-item-section>{{ option.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            icon="navigate_before"
            label="سوال قبلی"
            :disable="currentQuestionNumber <= 1"
            @click="prevQuestion" />
          <q-btn
            flat
            icon="navigate_next"
            label="سوال بعدی"
            :disable="currentQuestionNumber >= totalQuestions"
            @click="nextQuestion" />
          <q-btn
            flat
            icon="send"
            label="اتمام و ثبت"
            color="positive"
            @click="confirmSubmit" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'
import { exam } from 'src/repositories/exam'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const error = ref<string | null>(null)
const session = ref<any>(null)
const answer_keys = ref<any[]>([])
const totalQuestions = ref(0)
const currentQuestionNumber = ref(1)
const selectedOption = ref<string | null>(null)
const timerInterval: { value: any } = { value: null }

const startAPI = new OnlineExamSessionAPI()

const formatRemainingTime = computed(() => {
  if (!session.value?.duration_limit_seconds) return '-'
  const remaining = session.value.duration_limit_seconds - (session.value.time_used_seconds || 0)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const currentQuestionBody = computed(() => {
  if (!session.value?.exam?.online_detail?.content || !Array.isArray(session.value.exam.online_detail.content)) {
    return `سوال شماره ${currentQuestionNumber.value}`
  }
  const content = session.value.exam.online_detail.content[currentQuestionNumber.value - 1]
  if (! content) return `سوال شماره ${currentQuestionNumber.value}`
  if (content.type === 'text') return content.body || content.text || content
  if (content.type === 'image') return `<img src="${content.path}" alt="سوال" style="max-width:100%">`
  return JSON.stringify(content)
})

const optionLabels = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی']

const getOptions = (questionNum: number) => {
  const answerKey = answer_keys.value.find((k) => k.question_number === questionNum)
  const numChoices = Number(answerKey?.number_of_choices) || 4
  return optionLabels.slice(0, numChoices).map((label, i) => ({
    label,
    value: String(i + 1)
  }))
}

const startSession = async () => {
  try {
    loading.value = true
    const response = await startAPI.start(Number(route.params.id))
    session.value = response.session || response
    error.value = response.error || null

    if (response.error) {
      return
    }

    const examDetail = session.value.exam?.online_detail
    if (examDetail?.answer_keys) {
      answer_keys.value = examDetail.answer_keys
    } else if (response.answer_keys) {
      answer_keys.value = response.answer_keys
    }

    totalQuestions.value = answer_keys.value.length || 1

    loadExistingAnswers()

    startTimer()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در شروع آزمون'
  } finally {
    loading.value = false
  }
}

const loadExistingAnswers = () => {
  if (session.value?.responses && session.value.responses.length > 0) {
    const firstResponse = session.value.responses[0]
    selectedOption.value = firstResponse?.submitted_option || null
  }
}

const selectOption = (option: string) => {
  selectedOption.value = option
  submitAnswer(option)
}

const submitAnswer = async (option: string) => {
  try {
    await startAPI.submitAnswer(
      session.value.id,
      currentQuestionNumber.value,
      option
    )
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ذخیره پاسخ' })
  }
}

const nextQuestion = () => {
  if (currentQuestionNumber.value < totalQuestions.value) {
    currentQuestionNumber.value++
    loadCurrentAnswer()
  }
}

const prevQuestion = () => {
  if (currentQuestionNumber.value > 1) {
    currentQuestionNumber.value--
    loadCurrentAnswer()
  }
}

const loadCurrentAnswer = () => {
  const currentResponse = session.value?.responses?.find(
    (r: any) => r.question_number === currentQuestionNumber.value
  )
  selectedOption.value = currentResponse?.submitted_option || null
}

const startTimer = () => {
  timerInterval.value = setInterval(async () => {
    if (session.value && session.value.duration_limit_seconds) {
      session.value.time_used_seconds = (session.value.time_used_seconds || 0) + 1
      if (session.value.time_used_seconds >= session.value.duration_limit_seconds) {
        await submitSession()
      }
    }
  }, 1000)
}

const confirmSubmit = () => {
  $q.dialog({
    title: 'تایید ثبت آزمون',
    message: 'آیا مطمئن هستید که می‌خواهید آزمون را ثبت کنید؟',
    cancel: true,
    persistent: true
  }).onOk(() => {
    submitSession()
  })
}

const submitSession = async () => {
  try {
    await startAPI.submitSession(session.value.id)
    $q.notify({ type: 'positive', message: 'آزمون با موفقیت ثبت شد' })
    router.push({ name: 'Student.Exam.Result', params: { id: session.value.exam?.id } })
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت آزمون' })
  }
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

onMounted(() => {
  startSession()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style lang="scss" scoped>
.exam-attempt-page {
  .q-list {
    .q-item {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 4px;
    }
  }
}
</style>
