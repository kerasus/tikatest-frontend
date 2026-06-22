<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="quiz">
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h4 class="q-ma-none">{{ quiz.name }}</h4>
        </div>
        <div class="col-auto">
          <q-btn color="primary" label="مشاهده نتایج" :to="{ name: 'Panel.Quiz.Results', params: { id: quiz.id } }" class="q-ml-sm" />
          <q-btn flat label="بازگشت" :to="{ name: 'Panel.Quiz.List' }" />
        </div>
      </div>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <div class="text-subtitle2">زمان:</div>
              <div class="text-body1">{{ formatTime(quiz.timer) }}</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2">تاریخ شروع:</div>
              <div class="text-body1">{{ quiz.start_time || '-' }}</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2">تاریخ پایان:</div>
              <div class="text-body1">{{ quiz.end_time || '-' }}</div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2">توضیحات:</div>
              <div class="text-body1">{{ quiz.explanation || '-' }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">سوالات</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-if="!quiz.questions || quiz.questions.length === 0" class="text-center q-pa-lg">
            <p>هنوز سوالی اضافه نشده است</p>
          </div>
          <div v-for="(question, index) in quiz.questions" :key="question.id" class="q-mb-lg">
            <q-card bordered>
              <q-card-section>
                <div class="text-subtitle1 q-mb-md">
                  سوال {{ index + 1 }} ( نمره: {{ question.points }} )
                  <span v-if="question.has_negative_marking" class="text-negative q-ml-md">
                    (نمره منفی: {{ question.negative_marks }})
                  </span>
                </div>
                <div class="text-body1 q-mb-md">{{ question.question_text }}</div>
                <img v-if="question.question_image_url" :src="question.question_image_url" style="max-width: 200px; max-height: 150px" class="q-mb-md" />
                <div v-if="question.options && question.options.length > 0">
                  <div v-for="opt in question.options" :key="opt.id" class="q-pa-sm">
                    <q-chip :color="opt.is_correct_answer ? 'positive' : 'grey'" text-color="white" :label="opt.option_text" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { quiz } from 'src/repositories/quiz'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const quizData = ref<any>(null)

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '-'
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  if (hours > 0) {
    return `${hours} ساعت ${minutes} دقیقه`
  }
  return `${minutes} دقیقه`
}

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await quiz.get(id)
    quizData.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات آزمون' })
  } finally {
    loading.value = false
  }
})
</script>
