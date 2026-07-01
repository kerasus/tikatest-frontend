<template>
  <q-page class="quiz-result-page">
    <div class="q-mb-lg">
      <q-btn flat icon="arrow_back" color="primary" @click="$router.back()" label="بازگشت" />
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <div v-else-if="result">
      <!-- Quiz info header -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <h4 class="q-ma-none q-mb-md">{{ result.quiz_name }}</h4>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <div class="q-mb-md">
                <strong>درصد پاسخ‌گویی:</strong>
                <span class="text-h5 text-positive q-ml-sm">{{ result.percent }}%</span>
              </div>
              <div class="q-mb-md" v-if="result.total_marks !== undefined">
                <strong>نمره کسب شده:</strong>
                <span class="q-ml-sm">{{ result.obtained_marks }}/{{ result.total_marks }}</span>
              </div>
              <div class="q-mb-md">
                <strong>زمان شروع:</strong>
                <span class="q-ml-sm">{{ formatDateTime(result.started_at) }}</span>
              </div>
              <div class="q-mb-md">
                <strong>زمان ارسال:</strong>
                <span class="q-ml-sm">{{ formatDateTime(result.ended_at) }}</span>
              </div>
            </div>

            <div class="col-12 col-md-4" v-if="result.class_rank">
              <div class="q-mb-md">
                <strong>رتبه در کلاس:</strong>
                <q-chip :color="getRankColor(result.class_rank)" text-color="white" :label="result.class_rank" />
              </div>
              <div class="q-mb-md" v-if="result.class_count">
                <strong>تعداد شرکت‌کنندگان کلاس:</strong>
                <span class="q-ml-sm">{{ result.class_count }}</span>
              </div>
              <div class="q-mb-md" v-if="result.class_avg_percent">
                <strong>میانگین کلاس:</strong>
                <span class="q-ml-sm">{{ result.class_avg_percent }}%</span>
              </div>
            </div>

            <div class="col-12 col-md-4" v-if="result.field_rank">
              <div class="q-mb-md">
                <strong>رتبه در پایه:</strong>
                <q-chip :color="getRankColor(result.field_rank)" text-color="white" :label="result.field_rank" />
              </div>
              <div class="q-mb-md" v-if="result.field_count">
                <strong>تعداد شرکت‌کنندگان پایه:</strong>
                <span class="q-ml-sm">{{ result.field_count }}</span>
              </div>
              <div class="q-mb-md" v-if="result.field_avg_percent">
                <strong>میانگین پایه:</strong>
                <span class="q-ml-sm">{{ result.field_avg_percent }}%</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Questions and Answers -->
      <div class="quiz-layout">
        <!-- Sidebar - Answer selection (readonly) -->
        <q-card class="sidebar-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1">پاسخنامه شما</div>
              <div v-if="quiz?.solution?.length">
                <q-btn flat dense :label="showSolution ? 'نمایش سؤالات' : 'نمایش پاسخنامه'" @click="toggleSolution" />
              </div>
            </div>

            <q-table
              v-if="answerRows.length > 0"
              :rows="answerRows"
              flat
              dense
              hide-header
              hide-bottom
              class="answer-table"
            >
              <template #body-cell-question_number="props">
                <q-td :props="props">
                  <q-btn
                    :color="getAnswerStatusColor(props.row.question_number)"
                    :icon="getAnswerStatusIcon(props.row.question_number)"
                    size="sm"
                    round
                  />
                </q-td>
              </template>
              <template #body-cell-user_answer="props">
                <q-td :props="props">
                  <q-chip
                    :color="getUserAnswerColor(props.row.question_number, props.row.user_answer)"
                    :label="props.row.user_answer || '-'"
                    size="sm"
                  />
                </q-td>
              </template>
              <template #body-cell-correct_answer="props">
                <q-td :props="props">
                  <q-chip
                    v-if="props.row.correct_answer"
                    color="positive"
                    :label="props.row.correct_answer"
                    size="sm"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <!-- Main content - Questions or Solution -->
        <q-card class="content-card">
          <q-card-section>
            <div class="text-h5 q-mb-md">{{ result.quiz_name }}</div>
          </q-card-section>

          <q-card-section class="content-section">
            <!-- Question content -->
            <div v-if="!showSolution" class="content-viewer">
              <template v-for="(item, index) in quizContentItems" :key="'result-q-' + index">
                <div class="question-item q-mb-lg">
                  <div class="text-subtitle1 q-mb-sm">سؤال {{ index + 1 }}</div>
                  <q-img
                    v-if="item.type === 'image' && item.path"
                    :src="getStorageUrl(item.path)"
                    class="q-mb-md rounded-borders"
                    fit="contain"
                    style="max-width: 100%; max-height: 400px"
                  />
                  <embed
                    v-else-if="item.type === 'pdf' && item.path"
                    :src="getStorageUrl(item.path) + '#view=Fit'"
                    type="application/pdf"
                    style="width: 100%; height: calc(100vh - 200px)"
                  />
                  <div v-else-if="item.type === 'text'" class="text-content q-pa-md bg-white">
                    {{ item.body }}
                  </div>
                </div>
              </template>
            </div>

            <!-- Solution content -->
            <div v-else class="solution-viewer">
              <template v-for="(item, index) in quizSolutionItems" :key="'result-s-' + index">
                <div class="solution-item q-mb-lg">
                  <div class="text-subtitle1 q-mb-sm">راه‌حل {{ index + 1 }}</div>
                  <q-img
                    v-if="item.type === 'image' && item.path"
                    :src="getStorageUrl(item.path)"
                    class="q-mb-md rounded-borders"
                    fit="contain"
                    style="max-width: 100%; max-height: 400px"
                  />
                  <embed
                    v-else-if="item.type === 'pdf' && item.path"
                    :src="getStorageUrl(item.path) + '#view=Fit'"
                    type="application/pdf"
                    style="width: 100%; height: calc(100vh - 200px)"
                  />
                  <div v-else-if="item.type === 'text'" class="text-content q-pa-md bg-white">
                    {{ item.body }}
                  </div>
                </div>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="text-center q-pa-lg">
      <p>نتیجه‌ای برای این آزمون یافت نشد</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { quizSession } from 'src/repositories/quizSession'
import { quizRepository } from 'src/repositories/quiz'

type QuizContentItem = {
  type: 'text' | 'image' | 'pdf'
  body?: string
  path?: string
}

type AnswerRow = {
  question_number: number
  user_answer?: string
  correct_answer?: string
}

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const quizId = parseInt(route.params.id as string)
const result = ref<any>(null)
const quiz = ref<any>(null)
const loading = ref(true)
const showSolution = ref(false)

const quizContentItems = computed<QuizContentItem[]>(() => quiz.value?.content || [])
const quizSolutionItems = computed<QuizContentItem[]>(() => quiz.value?.solution || [])

const answerRows = computed<AnswerRow[]>(() => {
  if (!result.value?.responses) return []
  
  const noScoreQuestions = result.value.no_score_questions ? 
    result.value.no_score_questions.split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n)) : []
  
  const responses = result.value.responses as any[]
  const maxQuestion = quizContentItems.value.length || 100
  
  return Array.from({ length: maxQuestion }, (_, i) => {
    const qNum = i + 1
    const response = responses.find((r: any) => r.question_number === qNum)
    return {
      question_number: qNum,
      user_answer: response?.submitted_option,
      correct_answer: !noScoreQuestions.includes(qNum) ? response?.correct_option : undefined
    }
  })
})

const getStorageUrl = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const api = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${api.replace('/api', '')}/storage/${path}`
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

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'amber-5'
  if (rank === 2) return 'grey-4'
  if (rank === 3) return 'brown-5'
  return 'primary'
}

const getAnswerStatusColor = (questionNumber: number): string => {
  const response = answerRows.value.find(r => r.question_number === questionNumber)
  if (!response?.user_answer) return 'grey-5'
  return response.user_answer === response.correct_answer ? 'positive' : 'negative'
}

const getAnswerStatusIcon = (questionNumber: number): string => {
  const response = answerRows.value.find(r => r.question_number === questionNumber)
  if (!response?.user_answer) return 'radio_button_unchecked'
  return response.user_answer === response.correct_answer ? 'check' : 'close'
}

const getUserAnswerColor = (questionNumber: number, answer: string): string => {
  const response = answerRows.value.find(r => r.question_number === questionNumber)
  if (!response?.correct_answer) return 'grey-5'
  return answer === response.correct_answer ? 'positive' : 'negative'
}

const toggleSolution = () => {
  showSolution.value = !showSolution.value
}

const loadResult = async () => {
  loading.value = true
  try {
    const quizData = await quizRepository.get(quizId)
    quiz.value = quizData
    
    const attemptsRes = await quizSession.getMyAttempts()
    const session = attemptsRes.data?.find((a: any) => a.quiz_id === quizId && a.answer_status === 'sent')
    
    if (session) {
      result.value = {
        quiz_id: quizId,
        quiz_name: quizData.name,
        percent: session.percent,
        started_at: session.session_started_at,
        ended_at: session.submitted_at,
        total_marks: session.total_marks,
        obtained_marks: session.obtained_marks,
        responses: session.responses || [],
        no_score_questions: quizData.no_score_questions,
        class_rank: session.class_rank,
        class_count: session.class_count,
        class_avg_percent: session.class_avg_percent,
        field_rank: session.field_rank,
        field_count: session.field_count,
        field_avg_percent: session.field_avg_percent
      }
    } else {
      result.value = null
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری نتایج آزمون'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadResult()
})
</script>

<style scoped>
.quiz-result-page {
  max-width: 100%;
}

.quiz-layout {
  display: flex;
  gap: 16px;
  min-height: calc(100vh - 200px);
}

.sidebar-card {
  width: 320px;
  min-width: 320px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.content-card {
  flex: 1;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.content-section {
  flex: 1;
  overflow-y: auto;
}

.text-content {
  white-space: pre-wrap;
  line-height: 1.8;
}
</style>