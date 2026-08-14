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
      <q-card class="q-mb-md">
        <q-card-section>
          <div
            v-if="examContent"
            class="exam-content-body">
            <template v-if="examContent.type === 'text'">
              <div v-html="examContent.body || ''" />
            </template>
            <template v-else-if="examContent.type === 'image'">
              <q-img
                :src="examContent.path ? `storage/${examContent.path}` : ''"
                alt="تصویر آزمون"
                style="max-width: 100%; display: block" />
            </template>
          </div>
          <div
            v-else
            class="text-grey">محتوای سوال بارگذاری نشد.</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import { useOnlineExamSession } from 'src/stores/onlineExamSession'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const onlineExamStore = useOnlineExamSession()
const startAPI = new OnlineExamSessionAPI()

const timerInterval: { value: any } = { value: null }
const optionLabels = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰']

const loading = computed({
  get: () => onlineExamStore.loading,
  set: (val) => onlineExamStore.setLoading(val)
})
const error = computed({
  get: () => onlineExamStore.error,
  set: (val) => {
    onlineExamStore.error = val
  }
})
const session = computed(() => onlineExamStore.session?.session ?? null)
const answerKeys = computed(() => onlineExamStore.answerKeys ?? null)
const examContent = computed(() => {
  return onlineExamStore.onlineDetail?.content || null
})
const effectiveChoiceCount = computed(() => {
  if (!answerKeys.value) return 4
  const maxFromKeys = answerKeys.value.reduce((max, key) => {
    const n = Number(key.number_of_choices) || 0
    return n > max ? n : max
  }, 0)
  return Math.max(maxFromKeys, 2)
})
const answerColumns = computed(() => {
  const cols = [
    {
      name: 'question_number',
      label: 'شماره سوال',
      field: 'question_number',
      align: 'center' as const
    }
  ]
  for (let i = 0; i < effectiveChoiceCount.value; i++) {
    cols.push({
      name: String(i + 1),
      label: optionLabels[i],
      field: String(i + 1),
      align: 'center' as const
    })
  }
  return cols
})

const isChoiceEnabled = (row: any, choiceIndex: number) => {
  const maxChoices = Number(row.number_of_choices) || effectiveChoiceCount.value
  return choiceIndex >= 1 && choiceIndex <= maxChoices
}

const startSession = async () => {
  loading.value = true
  try {
    const response = await startAPI.start(Number(route.params.id))
    onlineExamStore.setSession(response)
    error.value = response.error ?? null

    if (response.error) {
      return
    }

    loadExistingAnswers()
    startTimer()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'خطا در شروع آزمون'
  } finally {
    loading.value = false
  }
}

const loadExistingAnswers = () => {
  const responses = session.value?.responses || []
  if (responses.length > 0) {
    responses.forEach((response: any) => {
      const key = answerKeys.value.find((k) => k.question_number === response.question_number)
      if (key) {
        // @ts-ignore
        key.submitted_option = response.submitted_option || null
      }
    })
  }
}

const selectOption = (row: any, option: string) => {
  const previous = row.submitted_option
  row.submitted_option = previous === option ? null : option

  submitAnswer(row.question_number, row.submitted_option)
}

const submitAnswer = async (questionNumber: number, submittedOption: string | null) => {
  try {
    await startAPI.submitAnswer(session.value.id, questionNumber, submittedOption || undefined)
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ذخیره پاسخ' })
  }
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

const startTimer = () => {
  timerInterval.value = setInterval(async () => {
    if (!onlineExamStore.isActive) {
      clearInterval(timerInterval.value)
      return
    }

    const remaining = onlineExamStore.remainingTime
    if (remaining != null) {
      const next = Math.max(0, remaining - 1)
      onlineExamStore.updateRemainingTime(next)
      if (next <= 0) {
        await submitSession()
      }
    } else if (onlineExamStore.durationLimit) {
      const current = session.value?.time_used_seconds || 0
      const next = current + 1
      if (session.value) {
        session.value.time_used_seconds = next
      }
      if (next >= onlineExamStore.durationLimit) {
        await submitSession()
      }
    }
  }, 1000)
}

const submitSession = async () => {
  try {
    const currentSession = session.value
    await startAPI.submitSession(currentSession.id)
    $q.notify({ type: 'positive', message: 'آزمون با موفقیت ثبت شد' })
    onlineExamStore.clearSession()
    router.push({
      name: 'Student.Exam.Result',
      params: { id: currentSession.exam?.id ?? route.params.id }
    })
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت آزمون' })
  }
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
