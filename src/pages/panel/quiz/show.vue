<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <q-btn flat icon="arrow_back" color="primary" @click="$router.back()" label="بازگشت" />
      </div>
      <div class="col-auto">
        <q-btn flat icon="edit" color="secondary" :to="{ name: 'Panel.Quiz.Create', params: { id: quizId } }" label="ویرایش" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <div v-else-if="quiz">
      <q-card class="q-mb-lg">
        <q-card-section>
          <h4 class="q-ma-none q-mb-md">{{ quiz.name }}</h4>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="q-mb-md">
                <strong>مدت زمان:</strong> {{ quiz.time_limit ? quiz.time_limit + ' دقیقه' : '-' }}
              </div>
              <div class="q-mb-md">
                <strong>شروع:</strong> {{ formatDateTime(quiz.start_time || quiz.starts_at) }}
              </div>
              <div class="q-mb-md">
                <strong>پایان:</strong> {{ formatDateTime(quiz.end_time || quiz.ends_at) }}
              </div>
              <div class="q-mb-md">
                <strong>نمایش پاسخ‌ها:</strong> {{ formatDateTime(quiz.show_answer_date) }}
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="q-mb-md">
                <q-chip
                  :color="quiz.is_visible ? 'positive' : 'grey-5'"
                  text-color="white"
                  :label="quiz.is_visible ? 'فعال' : 'غیرفعال'"
                />
              </div>
              <div v-if="quiz.quiz_class_assignments?.length">
                <strong>کلاس‌ها:</strong>
                <q-chip
                  v-for="assignment in quiz.quiz_class_assignments"
                  :key="assignment.id"
                  dense
                  class="q-ml-xs"
                >
                  {{ assignment.school_class?.name || assignment.academic_level?.title }}
                </q-chip>
              </div>
            </div>
          </div>

          <div v-if="quiz.description" class="q-mt-lg">
            <strong>توضیحات:</strong>
            <p>{{ quiz.description }}</p>
          </div>
        </q-card-section>
      </q-card>

      <q-card v-if="quiz.questions?.length" class="q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">سؤالات ({{ quiz.questions.length }})</div>
          </div>

          <q-list separator>
            <q-item v-for="(question, index) in quiz.questions" :key="question.id">
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  سؤال {{ index + 1 }}: {{ question.question_text }}
                </q-item-label>
                <q-item-label caption class="q-mt-xs">
                  نوع: {{ getQuestionTypeLabel(question.question_type) }} | امتیاز: {{ question.points }}
                </q-item-label>
                <div v-if="question.options?.length" class="q-mt-sm">
                  <div class="text-caption">گزینه‌ها:</div>
                  <q-list dense>
                    <q-item
                      v-for="option in question.options"
                      :key="option.id"
                      :class="option.is_correct_answer ? 'bg-green-1' : ''"
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ option.option_text }}
                          <q-icon
                            v-if="option.is_correct_answer"
                            name="check_circle"
                            color="positive"
                            size="xs"
                            class="q-ml-xs"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">تلاش‌های دانش آموزان</div>
            <q-btn
              flat
              icon="refresh"
              label="بروزرسانی"
              @click="loadAttempts"
              :loading="attemptsLoading"
            />
          </div>

          <q-spinner v-if="attemptsLoading" color="primary" />

          <q-table
            v-else
            :rows="attempts"
            :columns="attemptColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 20 }"
          >
            <template #body-cell-student_name="{ props }">
              <q-td :props="props">
                {{ getStudentName(props.row) }}
              </q-td>
            </template>
            <template #body-cell-percent="{ props }">
              <q-td :props="props">
                {{ props.row.percent ? props.row.percent + '%' : '-' }}
              </q-td>
            </template>
            <template #body-cell-answer_status="{ props }">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.answer_status)"
                  text-color="white"
                  :label="getStatusLabel(props.row.answer_status)"
                  dense
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="text-center q-pa-lg">
      <p>آزمون یافت نشد</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { quizRepository } from 'src/repositories/quiz'
import { quizSession } from 'src/repositories/quizSession'

const route = useRoute()
const $q = useQuasar()

const quizId = parseInt(route.params.id as string)
const quiz = ref<any>(null)
const loading = ref(true)
const attemptsLoading = ref(false)
const attempts = ref<any[]>([])

const attemptColumns = [
  { name: 'student_name', label: 'نام دانش آموز', field: 'student_name', align: 'right' as const },
  { name: 'percent', label: 'درصد', field: 'percent', align: 'center' as const },
  { name: 'answer_status', label: 'وضعیت', field: 'answer_status', align: 'center' as const },
  { name: 'started_at', label: 'زمان شروع', field: 'started_at', align: 'center' as const },
  { name: 'ended_at', label: 'زمان پایان', field: 'ended_at', align: 'center' as const }
]

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getQuestionTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    multiple_choice: 'چند گزینه ای',
    single_choice: 'تک گزینه ای',
    true_false: 'درست/غلط',
    fill_blank: 'جای خالی',
    essay: 'تشریحی'
  }
  return types[type] || type
}

const getStatusLabel = (status: string): string => {
  const statuses: Record<string, string> = {
    not_sent: 'ثبت نشده',
    sent: 'ثبت شده',
    graded: 'نمره دهی شده'
  }
  return statuses[status] || status
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    not_sent: 'grey-5',
    sent: 'warning',
    graded: 'positive'
  }
  return colors[status] || 'grey'
}

const getStudentName = (attempt: any): string => {
  return attempt.student?.full_name || attempt.student?.name || '-'
}

const loadQuiz = async () => {
  loading.value = true
  try {
    const response = await quizRepository.get(quizId)
    quiz.value = response
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری اطلاعات آزمون'
    })
  } finally {
    loading.value = false
  }
}

const loadAttempts = async () => {
  attemptsLoading.value = true
  try {
    const response = await quizSession.getQuizAttempts(quizId)
    attempts.value = response.data
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در بارگذاری تلاش‌ها'
    })
  } finally {
    attemptsLoading.value = false
  }
}

onMounted(() => {
  loadQuiz()
  loadAttempts()
})
</script>

<style scoped>
</style>