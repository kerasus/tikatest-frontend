<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات آزمون</h4>
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
      v-else-if="examData"
      class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ examData.name }}</div>
        <div class="text-subtitle2 text-grey-6">
          {{ examData.lesson?.name }} — {{ examData.category?.title }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="examData.onlineDetail">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-6">زمان شروع</div>
            <div>{{ formatDateTime(examData.onlineDetail.starts_at) }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-6">زمان پایان</div>
            <div>{{ formatDateTime(examData.onlineDetail.ends_at) }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-6">مدت زمان</div>
            <div>{{ examData.onlineDetail.time_limit_minutes }} دقیقه</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-6">حداکثر نمره</div>
            <div>{{ examData.max_score ?? 'ندارد' }}</div>
          </div>
          <div
            v-if="examData.description"
            class="col-12">
            <div class="text-caption text-grey-6">توضیحات</div>
            <div v-html="examData.description" />
          </div>
        </div>

        <div
          v-if="canStart"
          class="q-mt-md">
          <q-btn
            color="primary"
            label="شرکت در آزمون"
            icon="play_arrow"
            @click="startExam" />
        </div>
        <div
          v-else
          class="text-warning q-mt-md">
          <q-icon name="warning" /> این آزمون در دسترس نیست
        </div>
      </q-card-section>

      <q-card-section v-else>
        <p class="text-grey-6">این آزمون جزئیات آنلاین ندارد.</p>
      </q-card-section>
    </q-card>

    <q-card v-else>
      <q-card-section>
        <p class="text-negative">آزمون یافت نشد.</p>
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
const sessionAPI = new OnlineExamSessionAPI()

const canStart = computed(() => {
  if (!examData.value?.onlineDetail) return false
  const detail = examData.value.onlineDetail
  if (detail.visible_at && new Date(detail.visible_at) > new Date()) return false
  if (detail.starts_at && new Date(detail.starts_at) > new Date()) return false
  if (detail.ends_at && new Date(detail.ends_at) < new Date()) return false
  return true
})

const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fa-IR')
}

const loadExam = async () => {
  loading.value = true
  try {
    const response = await exam.get(Number(route.params.id))
    examData.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری آزمون' })
  } finally {
    loading.value = false
  }
}

const startExam = () => {
  router.push({ name: 'Student.Exam.Attempt', params: { id: route.params.id } })
}

const goBack = () => {
  router.push({ name: 'Student.Exam.List' })
}

onMounted(() => {
  loadExam()
})
</script>
