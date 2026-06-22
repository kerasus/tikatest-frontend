<template>
  <div class="quiz-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ایجاد آزمون آنلاین</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.name" label="نام آزمون *" outlined required />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.timer" label="زمان (HH:MM:SS)" outlined mask="##:##:##" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.start_time" label="تاریخ شروع" outlined type="date" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.end_time" label="تاریخ پایان" outlined type="date" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.quiz_type"
                :options="quizTypeOptions"
                label="نوع آزمون"
                outlined
                emit-value
                map-options
                clearable />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.is_visible"
                :options="[{label: 'فعال', value: true}, {label: 'غیرفعال', value: false}]"
                label="وضعیت نمایش"
                outlined
                emit-value
                map-options
                default-value="true" />
            </div>
            <div class="col-12">
              <q-input v-model="form.correct_answers" label="پاسخنامه صحیح (مثال: abcd)" outlined dir="ltr" />
            </div>
            <div class="col-12">
              <q-input v-model="form.questions_text" label="متن سوالات" outlined type="textarea" />
            </div>
            <div class="col-12">
              <q-input v-model="form.answers_text" label="متن گزینه‌ها" outlined type="textarea" />
            </div>
            <div class="col-12">
              <q-input v-model="form.explanation" label="توضیحات" outlined type="textarea" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn type="submit" color="primary" label="ایجاد آزمون" :loading="saving" />
            <q-btn flat label="انصراف" :to="{ name: 'Panel.Quiz.List' }" class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { quiz } from 'src/repositories/quiz'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  name: null,
  correct_answers: null,
  timer: null,
  start_time: null,
  end_time: null,
  explanation: null,
  is_visible: true,
  quiz_type: null,
  questions_text: null,
  answers_text: null,
  picture_id: null,
  no_score_questions: null
})

const quizTypeOptions = [
  { label: 'متنی', value: 'text' },
  { label: 'تصویری', value: 'image' },
  { label: 'آنلاین', value: 'online' }
]

const saving = ref(false)

async function onSubmit () {
  saving.value = true
  try {
    await quiz.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ایجاد شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Quiz.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ایجاد آزمون.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.quiz-form-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
