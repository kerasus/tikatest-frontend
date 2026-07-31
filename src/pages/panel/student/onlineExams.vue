<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">آزمون‌های آنلاین</h4>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div
          v-if="loading"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="100px" />
        </div>

        <div
          v-else-if="!availableExams || availableExams.length === 0"
          class="text-center q-pa-lg">
          <q-icon
            name="assignment"
            size="100px"
            color="primary" />
          <p class="text-subtitle1 q-mt-md">هیچ آزمون آنلاینی در دسترس نیست</p>
        </div>

        <q-list v-else>
          <q-item
            v-for="exam in availableExams"
            :key="exam.id"
            dense
            class="q-pa-sm"
            @click="viewExam(exam)">
            <q-item-section avatar>
              <q-avatar
                icon="assignment"
                color="primary"
                text-color="white" />
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle1">
                {{ exam.name }}
              </div>
              <div class="text-caption text-grey-6">
                {{ exam.lesson?.name }} — {{ exam.category?.title }}
              </div>
              <div
                v-if="exam.onlineDetail"
                class="text-caption text-grey-6 mt-xs-baseline">
                شروع: {{ formatDateTime(exam.onlineDetail.starts_at) }}
                <template v-if="exam.onlineDetail.ends_at">
                  | پایان: {{ formatDateTime(exam.onlineDetail.ends_at) }}
                </template>
                <template v-if="exam.onlineDetail.time_limit_minutes">
                  | مدت: {{ exam.onlineDetail.time_limit_minutes }} دقیقه
                </template>
              </div>
            </q-item-section>
            <q-item-section
              side
              top>
              <q-chip
                :color="canStart(exam) ? 'primary' : 'grey'"
                text-color="white"
                dense>
                {{ getStatusLabel(exam) }}
              </q-chip>
              <q-btn
                v-if="canStart(exam)"
                flat
                dense
                color="positive"
                icon="play_arrow"
                label="شرکت"
                @click.stop="startExam(exam)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'

const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const availableExams = ref<any[]>([])

const loadExams = async () => {
  loading.value = true
  try {
    const response = await exam.index({ length: 100, delivery_mode: 'online' })
    availableExams.value = response.data || []
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری آزمون‌ها' })
  } finally {
    loading.value = false
  }
}

const canStart = (examItem: any) => {
  if (!examItem.onlineDetail) return false
  if (examItem.onlineDetail.visible_at && new Date(examItem.onlineDetail.visible_at) > new Date()) return false
  if (examItem.onlineDetail.starts_at && new Date(examItem.onlineDetail.starts_at) > new Date()) return false
  if (examItem.onlineDetail.ends_at && new Date(examItem.onlineDetail.ends_at) < new Date()) return false
  return true
}

const getStatusLabel = (examItem: any) => {
  if (!examItem.onlineDetail) return 'بدون جزئیات'
  if (!canStart(examItem)) return 'غیرفعال'
  return 'فعال'
}

const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fa-IR')
}

const startExam = (examItem: any) => {
  router.push({ name: 'Student.Exam.Attempt', params: { id: examItem.id } })
}

const viewExam = (examItem: any) => {
  router.push({ name: 'Student.Exam.Show', params: { id: examItem.id } })
}

onMounted(() => {
  loadExams()
})
</script>
