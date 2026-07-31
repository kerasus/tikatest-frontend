<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">نتیجه آزمون</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          icon="arrow_back"
          label="بازگشت"
          @click="goBack" />
      </div>
    </div>

    <q-card
      v-if="loading"
      class="q-pa-lg text-center">
      <q-spinner
        color="primary"
        size="100px" />
    </q-card>

    <q-card
      v-else
      class="q-pa-md">
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-h6">{{ examName }}</div>
            <div class="text-subtitle2 text-grey-6">
              {{ lessonName }}
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <div class="text-h6">
              نمره: <span class="text-primary">{{ session?.score || session?.percent || 0 }}</span>
            </div>
            <div class="text-subtitle2 text-grey-6">
              درصد: {{ session?.percent || 0 }}%
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="session?.status === 'graded'">
        <div class="text-positive">
          <q-icon name="check_circle" /> وضعیت: اتمام یافته
        </div>
      </q-card-section>

      <q-card-section v-if="examData?.onlineDetail?.solution">
        <div class="text-subtitle1">پاسخنامه</div>
        <div v-html="examData.onlineDetail.solution" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'
import OnlineExamSessionAPI from 'src/repositories/onlineExamSession'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const examData = ref<any>(null)
const session = ref<any>(null)

const examName = computed(() => examData.value?.name || 'بدون نام')
const lessonName = computed(() => examData.value?.lesson?.name || '')

const sessionAPI = new OnlineExamSessionAPI()

const loadResult = async () => {
  try {
    const examRes = await exam.get(Number(route.params.id))
    examData.value = examRes

    const sessionsRes = await sessionAPI.mySessions()
    const latestSession = sessionsRes.find(
      (s: any) => s.exam_id === Number(route.params.id)
    )
    if (latestSession) {
      session.value = latestSession
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری نتایج' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

onMounted(() => {
  loadResult()
})
</script>
