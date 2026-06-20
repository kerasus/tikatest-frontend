<template>
  <div class="quiz-results-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">نتایج آزمون: {{ quiz.name }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="attempts"
          :columns="columns"
          row-key="id"
          :loading="loading">
          <template #body-cell-student="props">
            <q-td :props="props">
              {{ props.row.student?.name }} {{ props.row.student?.lastname }}
            </q-td>
          </template>
          <template #body-cell-percent="props">
            <q-td :props="props">
              <q-badge :color="getPercentColor(props.row.percent)" :label="props.row.percent ? `${props.row.percent}%` : '-'" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import QuizAPI from 'src/repositories/quiz'
import QuizAttemptAPI from 'src/repositories/quizAttempt'
import type { QuizType, QuizAttemptType } from 'src/repositories/quiz'

const route = useRoute()
const $q = useQuasar()

const quiz = ref<Partial<QuizType>>({})
const attempts = ref<QuizAttemptType[]>([])
const loading = ref(false)

const columns = [
  { name: 'student', label: 'دانش آموز', align: 'right' as const },
  { name: 'started_at', label: 'زمان شروع', align: 'center' as const, field: 'started_at' },
  { name: 'ended_at', label: 'زمان پایان', align: 'center' as const, field: 'ended_at' },
  { name: 'answer_status', label: 'وضعیت پاسخ', align: 'center' as const, field: 'answer_status' },
  { name: 'percent', label: 'درصد', align: 'center' as const, field: 'percent' },
  { name: 'is_locked', label: 'قفل', align: 'center' as const, field: 'is_locked' }
]

function getPercentColor (percent: number | null) {
  if (percent == null) return 'grey'
  if (percent >= 70) return 'positive'
  if (percent >= 50) return 'warning'
  return 'negative'
}

onMounted(async () => {
  loading.value = true
  try {
    const quizId = Number(route.params.id)
    quiz.value = await QuizAPI.prototype.get(quizId)
    const result = await QuizAttemptAPI.prototype.index({ quiz_ids: [quizId], length: 100 })
    attempts.value = result.data
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری نتایج آزمون.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
</style>
