<template>
  <div class="quiz-detail-page">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ quiz.name }}</div>
        <div class="text-grey-7 q-mt-sm">
          نوع: {{ quiz.quiz_type || '-' }} | زمان: {{ quiz.timer || '-' }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="quiz.quizClassAssignments && quiz.quizClassAssignments.length">
        <div class="text-h6 q-mb-md">کلاس‌های این آزمون</div>
        <q-table
          :rows="quiz.quizClassAssignments"
          :columns="assignColumns"
          row-key="id"
          flat
          bordered>
          <template #body-cell-class="props">
            <q-td :props="props">
              {{ props.row.schoolClass?.name }} ({{ props.row.academicLevel?.name }})
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              color="secondary"
              icon="assignment"
              label="مشاهده نتایج"
              :to="{ name: 'Panel.Quiz.Results', params: { id: quiz.id } }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import QuizAPI from 'src/repositories/quiz'

const route = useRoute()
const $q = useQuasar()

const quiz = ref<any>({})

const assignColumns = [
  { name: 'class', label: 'کلاس', align: 'right' as const },
  { name: 'level', label: 'پایه', align: 'right' as const }
]

onMounted(async () => {
  try {
    quiz.value = await QuizAPI.prototype.get(Number(route.params.id))
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات آزمون.',
      color: 'negative'
    })
  }
})
</script>

<style lang="scss" scoped>
</style>
