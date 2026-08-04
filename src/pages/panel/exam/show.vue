<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات آزمون</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="بازگشت"
          :to="{ name: 'Panel.Exam.List' }" />
        <q-btn
          color="primary"
          label="ویرایش آزمون"
          :to="{ name: 'Panel.Exam.Edit', params: { id: examItem?.id } }"
          class="q-ml-sm" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="examItem">
      <exam-detail-card :exam="examItem" />

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">کلیدهای پاسخ آنلاین</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            v-if="examItem.answer_keys?.length"
            :rows="examItem.answer_keys"
            :columns="answerKeyColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-is_active="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.is_active ? 'positive' : 'grey'"
                  text-color="white"
                  dense>
                  {{ props.row.is_active ? 'فعال' : 'غیرفعال' }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
          <div
            v-else
            class="text-center q-pa-md text-grey">کلید پاسخی ثبت نشده است.</div>
        </q-card-section>
      </q-card>

      <exam-results-card
        :delivery_mode="examItem.delivery_mode"
        :exam-id="examItem.id"
        :in_person_results="examItem.in_person_results"
        :online_exam_sessions="examItem.online_exam_detail?.sessions" />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam, ExamType } from 'src/repositories/exam'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
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

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await exam.get(id)
    examItem.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات آزمون' })
  } finally {
    loading.value = false
  }
})
</script>
