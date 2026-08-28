<template>
  <div
    v-if="loading"
    class="text-center q-pa-lg">
    <q-spinner
      color="primary"
      size="100px" />
  </div>

  <template v-else-if="examItem">
    <exam-in-person-detail-card
      :exam="examItem"
      :editable="false" />

    <exam-results-card
      :exam="examItem"
      @result-updated="loadExam" />
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam, ExamType } from 'src/repositories/exam'
import ExamInPersonDetailCard from 'src/components/exam/ExamInPersonDetailCard.vue'
import ExamResultsCard from 'src/components/exam/ExamResultsCard.vue'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const examItem = ref<ExamType | null>(null)

const answerKeyColumns = [
  {
    name: 'question_number',
    label: 'شماره سوال',
    field: 'question_number',
    align: 'center' as const
  },
  {
    name: 'number_of_choices',
    label: 'تعداد گزینه',
    field: 'number_of_choices',
    align: 'center' as const
  },
  {
    name: 'correct_option',
    label: 'گزینه صحیح',
    field: 'correct_option',
    align: 'center' as const
  },
  { name: 'weight', label: 'وزن', field: 'weight', align: 'center' as const },
  {
    name: 'has_negative_mark',
    label: 'نمره منفی',
    field: 'has_negative_mark',
    align: 'center' as const
  },
  { name: 'is_active', label: 'وضعیت', field: 'is_active', align: 'center' as const }
]

onMounted(loadExam)

async function loadExam () {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    examItem.value = await exam.get(id)
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات آزمون' })
  } finally {
    loading.value = false
  }
}
</script>
