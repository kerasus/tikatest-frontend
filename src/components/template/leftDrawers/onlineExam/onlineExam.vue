<template>
  <q-card>
    <exam-answer-sheet
      :booklets="booklets"
      :readonly="isReadonly"
      :answer-keys="answerKeys"
      :session-responses="sessionResponses"
      @answer-changed="submitAnswer" />

    <q-separator />

    <template v-if="isReadonly">
      <exam-overall-result
        v-if="session"
        :session="session"
        :answer-keys="answerKeys"
        :session-responses="sessionResponses"
        :status-label="onlineExamStore.statusLabel"
        :used-time-seconds="onlineExamStore.usedTimeSeconds" />

      <exam-booklet-results
        :results="bookletResults"
        :booklets="booklets" />
    </template>

    <q-card-actions
      v-else
      align="right">
      <q-btn
        flat
        icon="send"
        label="اتمام و ثبت"
        color="positive"
        @click="confirmSubmit" />
    </q-card-actions>
  </q-card>
  <!-- انتهای template -->
  <q-dialog
    v-model="isConfirmDialogOpen"
    persistent
    full-width>
    <q-card style="max-width: 900px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary">تایید نهایی پاسخ‌ها</div>
        <q-space />
        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          dense />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div class="text-subtitle2 text-red-8 q-mb-md">
          ⚠️ <strong>توجه:</strong> لطفاً پاسخ‌های خود را در جدول زیر بررسی کنید. این آخرین شانس شما
          برای مرور است. پس از ثبت نهایی، امکان ویرایش یا ادعای جابجایی گزینه‌ها وجود نخواهد داشت.
        </div>

        <!-- نمایش پاسخ‌نامه در حالت فقط خواندنی -->

        <exam-answer-sheet
          :booklets="booklets"
          :readonly="true"
          :answer-keys="answerKeys"
          :session-responses="sessionResponses" />
      </q-card-section>

      <q-card-actions
        align="right"
        class="q-pa-md">
        <q-btn
          v-close-popup
          flat
          label="بازگشت و اصلاح"
          color="grey-8" />
        <q-btn
          label="ثبت نهایی آزمون"
          color="positive"
          icon="check"
          @click="executeFinalSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAppLayout } from 'stores/appLayout'
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ExamAnswerSheet from './components/ExamAnswerSheet.vue'
import { useOnlineExamSession } from 'stores/onlineExamSession'
import ExamOverallResult from './components/ExamOverallResult.vue'
import ExamBookletResults from './components/ExamBookletResults.vue'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'
import type { OnlineExamSessionResultType } from 'src/repositories/onlineExamSession'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const appLayoutStore = useAppLayout()
const onlineExamStore = useOnlineExamSession()
const onlineExamSessionAPI = new OnlineExamSessionAPI()

const isConfirmDialogOpen = ref(false)

const booklets = computed(() => onlineExamStore.booklets)
const session = computed(() => onlineExamStore.sessionData)
const answerKeys = computed(() => onlineExamStore.answerKeys ?? null)
const sessionResponses = computed(() => onlineExamStore.sessionResponses ?? null)
const isReadonly = computed(() => route.name === 'Student.Exam.Result' || !onlineExamStore.isActive)
const bookletResults = computed<OnlineExamSessionResultType[]>(() => {
  return (session.value?.results ?? []).filter((result) => result.online_exam_booklet_id != null)
})

async function submitAnswer (questionNumber: number, submittedOption: string | null) {
  if (session.value?.id == null) return

  try {
    await onlineExamSessionAPI.submitAnswer(
      session.value.id,
      questionNumber,
      submittedOption || undefined
    )
  } catch {
    $q.notify({ type: 'negative', message: 'خطا در ذخیره پاسخ' })
  }
}

async function submitSession () {
  const currentSession = session.value
  if (currentSession?.id == null) return

  try {
    await onlineExamSessionAPI.submitSession(currentSession.id)
    $q.notify({ type: 'positive', message: 'آزمون با موفقیت ثبت شد' })
    onlineExamStore.clearSession()
    await router.push({
      name: 'Student.Exam.Result',
      params: { id: currentSession.exam?.id ?? route.params.id }
    })
  } catch {
    $q.notify({ type: 'negative', message: 'خطا در ثبت آزمون' })
  }
}

function checkLayoutLeftDrawerOverlay () {
  appLayoutStore.layoutLeftDrawerOverlay = !$q.screen.gt.md
}

async function confirmSubmit () {
  const currentSession = session.value
  const examId = Number(route.params.id)

  // اگر سشن نداریم، منطقی نیست دیالوگ ثبت نهایی باز کنیم
  if (!currentSession?.id) return

  onlineExamStore.setLoading(true)
  try {
    // 1) گرفتن آخرین وضعیت از دیتابیس
    const fresh = await onlineExamSessionAPI.start(examId)

    // اگر بک‌اند پیام خطا برگردوند
    if (fresh?.error) {
      $q.notify({ type: 'negative', message: fresh.error || 'خطا در دریافت آخرین پاسخ‌ها' })
      return
    }

    // 2) Sync کردن استور با داده تازه
    // اگر setSession کل ساختار (session/answerKeys/...) رو می‌چیند، این بهترین گزینه است:
    onlineExamStore.setSession(fresh)

    // 3) برای اطمینان: submitted_option های answerKeys را با responses هم‌راستا کن
    syncAnswerKeysFromSession(session.value)

    // 4) حالا دیالوگ را باز کن: این چیزی است که واقعاً در DB ثبت شده
    isConfirmDialogOpen.value = true
  } catch (e) {
    $q.notify({ type: 'negative', message: 'خطا در دریافت آخرین پاسخ‌های ذخیره‌شده' })
  } finally {
    onlineExamStore.setLoading(false)
  }

}

// ۳. متد اجرای ثبت (بعد از تایید کاربر)
async function executeFinalSubmit () {
  isConfirmDialogOpen.value = false // بستن دیالوگ
  await submitSession() // فراخوانی همان متد قدیمی که لاجیک اصلی را داشت
}

const syncAnswerKeysFromSession = (freshSession: any) => {
  const responses = freshSession?.responses || []
  if (!answerKeys.value) return

  // اول پاکسازی submitted_option ها تا اگر کاربر جواب رو پاک کرده بود هم درست رندر بشه
  answerKeys.value.forEach((k: any) => {
    k.submitted_option = null
  })

  responses.forEach((r: any) => {
    const key = answerKeys.value.find((k: any) => k.question_number === r.question_number)
    if (key) {
      // @ts-ignore
      key.submitted_option = r.submitted_option || null
    }
  })
}

watch(
  () => route.name,
  () => {
    if ($q.screen.lt.md) {
      appLayoutStore.layoutLeftDrawerVisible = false
    }
  },
  { immediate: true }
)

watch(
  () => $q.screen.gt.md,
  () => {
    requestAnimationFrame(checkLayoutLeftDrawerOverlay)
  },
  { immediate: true }
)

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(checkLayoutLeftDrawerOverlay)
})
</script>
