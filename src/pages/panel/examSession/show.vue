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
          :to="{ name: 'Panel.ExamSession.List' }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="session">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">درس:</div>
              <div class="text-body1">{{ session.lesson?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کلاس:</div>
              <div class="text-body1">{{ session.schoolClass?.name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ:</div>
              <div class="text-body1">{{ session.gregorian_date || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نوع نمره:</div>
              <div class="text-body1">{{ getGradeTypeLabel(session.grade_type) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">حداقل نمره قبولی:</div>
              <div class="text-body1">{{ session.min_grade ?? '-' }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">نمرات ثبت شده ({{ grades.length }})</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            :rows="grades"
            :columns="gradeColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }">
            <template #body-cell-student="props">
              <q-td :props="props">
                {{ props.row.student?.full_name || '-' }}
              </q-td>
            </template>
            <template #body-cell-raw_grade="props">
              <q-td :props="props">
                <span :class="getGradeColor(props.row)">
                  {{ props.row.raw_grade ?? '-' }}
                </span>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { examSession } from 'src/repositories/examSession'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const session = ref<any>(null)
const grades = ref<any[]>([])

const gradeTypeMap: Record<string, string> = {
  class_quiz: 'آزمون کلاسی',
  monthly_quiz: 'آزمون ماهانه',
  mid_term_1: 'میان ترم اول',
  continuous_1: 'مستمر اول',
  final_1: 'پایان ترم اول',
  mid_term_2: 'میان ترم دوم',
  continuous_2: 'مستمر دوم',
  final_2: 'پایان ترم دوم',
  other: 'سایر'
}

const gradeColumns = [
  { name: 'student', label: 'دانش آموز', field: 'student', align: 'center' as const },
  { name: 'raw_grade', label: 'نمره', field: 'raw_grade', align: 'center' as const },
  { name: 'calculated_grade', label: 'نمره محاسبه شده', field: 'calculated_grade', align: 'center' as const },
  { name: 'z_score', label: 'Z نمره', field: 'z_score', align: 'center' as const }
]

const getGradeTypeLabel = (value: string | null): string => {
  return gradeTypeMap[value || ''] || value || '-'
}

const getGradeColor = (grade: any): string => {
  if (!grade.min_grade) return ''
  return grade.raw_grade >= grade.min_grade ? 'text-positive' : 'text-negative'
}

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await examSession.get(id)
    session.value = response
    grades.value = response.grades || []
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات آزمون' })
  } finally {
    loading.value = false
  }
})
</script>
