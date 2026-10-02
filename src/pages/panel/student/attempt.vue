<template>
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
          <template v-else-if="examContent.type === 'pdf'">
            <iframe
              v-if="examContent.path"
              :src="`storage/${examContent.path}`"
              style="width: 100%; height: 600px; border: none" />
          </template>
        </div>
        <div
          v-else
          class="text-grey">محتوای سوال بارگذاری نشد.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useOnlineExamSession } from 'src/stores/onlineExamSession'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const startAPI = new OnlineExamSessionAPI()
const onlineExamStore = useOnlineExamSession()

let endEpochTime: number | null = null
let isSubmitting = false
const timerInterval: { value: any } = { value: null }

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
  if (!answerKeys.value) return

  // اول پاکسازی submitted_option ها تا اگر کاربر جواب رو پاک کرده بود هم درست رندر بشه
  answerKeys.value.forEach((k: any) => {
    k.submitted_option = null
  })

  responses.forEach((response: any) => {
    const key = answerKeys.value.find((k) => k.question_number === response.question_number)
    if (key) {
      // @ts-ignore
      key.submitted_option = response.submitted_option || null
    }
  })
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

const syncTime = () => {
  if (!onlineExamStore.isActive) {
    stopTimer()
    return
  }

  if (endEpochTime != null) {
    const now = Date.now()
    const remainingSeconds = Math.max(0, Math.round((endEpochTime - now) / 1000))
    onlineExamStore.updateRemainingTime(remainingSeconds)
  }
}

const onVisibilityOrFocusChange = () => {
  if (document.visibilityState === 'visible') {
    syncTime()
  }
}

const startTimer = () => {
  stopTimer()

  const initialRemaining = onlineExamStore.remainingTime
  if (initialRemaining != null) {
    endEpochTime = Date.now() + initialRemaining * 1000
  }

  // ۱. شروع تیک هر ثانیه
  timerInterval.value = setInterval(syncTime, 1000)

  // ۲. هندل کردن بازگشت کاربر به تب
  window.addEventListener('visibilitychange', onVisibilityOrFocusChange)
  window.addEventListener('focus', onVisibilityOrFocusChange)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  window.removeEventListener('visibilitychange', onVisibilityOrFocusChange)
  window.removeEventListener('focus', onVisibilityOrFocusChange)
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

// واچ روی زمان باقی‌مانده: به محض صفر شدن، سابمیت را انجام می‌دهد
watch(
  () => onlineExamStore.remainingTime,
  async (newVal) => {
    if (newVal !== null && newVal <= 0 && onlineExamStore.isActive && !isSubmitting) {
      isSubmitting = true
      stopTimer()
      $q.notify({
        type: 'warning',
        message: 'مهلت زمان آزمون به پایان رسید و پاسخ‌ها در حال ثبت نهایی هستند.'
      })
      await submitSession()
    }
  }
)

onUnmounted(() => {
  stopTimer()
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
