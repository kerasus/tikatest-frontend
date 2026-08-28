<template>
  <q-page class="q-pa-md">
    <h4 class="q-ma-none q-mb-lg">نمرات آزمون‌ها</h4>

    <entity-index
      ref="entityIndexRef"
      :value="inputs"
      title="نمرات آزمون‌ها"
      :api="api"
      :table="table"
      :table-keys="tableKeys"
      :show-close-button="false"
      :show-expand-button="false"
      :show-reload-button="true"
      :show-search-button="true"
      :row-key="itemIdentifyKey">
      <template #entity-index-table-cell="{ inputData }">
        <template v-if="inputData.col.name === 'name'">
          {{ inputData.props.row.name || '-' }}
        </template>
        <template v-else-if="inputData.col.name === 'lesson'">
          {{ inputData.props.row.lesson?.name || '-' }}
        </template>
        <template v-else-if="inputData.col.name === 'category'">
          {{ inputData.props.row.category?.title || '-' }}
        </template>
        <template v-else-if="inputData.col.name === 'delivery_mode'">
          <q-chip
            :color="inputData.props.row.delivery_mode === 'online' ? 'primary' : 'secondary'"
            text-color="white"
            dense>
            {{ inputData.props.row.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
          </q-chip>
        </template>
        <template v-else-if="inputData.col.name === 'score'">
          <template v-if="inputData.props.row.score?.scaled_score || inputData.props.row.score?.score">
            <q-chip
              :color="
                getScoreColor(
                  inputData.props.row.score,
                  inputData.props.row.max_score,
                  inputData.props.row.min_passing_score,
                )
              "
              text-color="white"
              dense>
              {{ formatScore(inputData.props.row.score, inputData.props.row.max_score) }}
            </q-chip>
          </template>
          <span
            v-else
            class="text-grey">-</span>
        </template>
        <template v-else-if="inputData.col.name === 'held_at'">
          <template v-if="inputData.props.row.in_person_exam_detail?.held_at">
            {{ formatDate(inputData.props.row.in_person_exam_detail.held_at) }}
          </template>
          <template v-else-if="inputData.props.row.online_exam_detail?.starts_at">
            {{ formatDate(inputData.props.row.online_exam_detail.starts_at) }}
          </template>
          <span
            v-else
            class="text-grey">-</span>
        </template>
        <template v-else-if="inputData.col.name === 'actions'">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            @click="openExamDetail(inputData.props.row)" />
        </template>
        <template v-else>
          {{ inputData.col.value }}
        </template>
      </template>
    </entity-index>

    <q-dialog v-model="examDetailDialog">
      <q-card style="min-width: 500px; max-width: 700px">
        <q-card-section class="row items-center">
          <div class="col">
            <div class="text-h6">جزئیات آزمون</div>
          </div>
          <div class="col-auto">
            <q-btn
              v-close-popup
              flat
              round
              dense
              icon="close"
              color="grey" />
          </div>
        </q-card-section>
        <q-card-section v-if="selectedExam">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col-5 text-subtitle2">نام آزمون:</div>
              <div class="col-7">{{ selectedExam.name || '-' }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">درس:</div>
              <div class="col-7">{{ selectedExam.lesson?.name || '-' }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">دسته‌بندی:</div>
              <div class="col-7">{{ selectedExam.category?.title || '-' }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">نوع:</div>
              <div class="col-7">
                <q-chip
                  :color="selectedExam.delivery_mode === 'online' ? 'primary' : 'secondary'"
                  text-color="white"
                  dense>
                  {{ selectedExam.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
                </q-chip>
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">حداقل نمره قبولی:</div>
              <div class="col-7">{{ selectedExam.min_passing_score || '-' }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">بیشینه نمره:</div>
              <div class="col-7">{{ selectedExam.max_score || '-' }}</div>
            </div>
            <div
              v-if="selectedExam.in_person_exam_detail?.held_at"
              class="row">
              <div class="col-5 text-subtitle2">تاریخ برگزاری:</div>
              <div class="col-7">{{ formatDate(selectedExam.in_person_exam_detail.held_at) }}</div>
            </div>
            <div
              v-else-if="selectedExam.online_exam_detail?.starts_at"
              class="row">
              <div class="col-5 text-subtitle2">زمان شروع:</div>
              <div class="col-7">{{ formatDate(selectedExam.online_exam_detail.starts_at) }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-subtitle2">نمره شما:</div>
              <div class="col-7">
                <q-chip
                  v-if="selectedExam.score"
                  :color="
                    getScoreColor(
                      selectedExam.score,
                      selectedExam.max_score,
                      selectedExam.min_passing_score,
                    )
                  "
                  text-color="white"
                  dense>
                  {{ formatScore(selectedExam.score, selectedExam.max_score) }}
                </q-chip>
                <span
                  v-else
                  class="text-grey">-</span>
              </div>
            </div>
            <div
              v-if="selectedExam.my_result"
              class="row">
              <div class="col-5 text-subtitle2">نمره خام:</div>
              <div class="col-7">{{ selectedExam.my_result.raw_score || '-' }}</div>
            </div>
            <div
              v-if="selectedExam.my_session"
              class="row">
              <div class="col-5 text-subtitle2">وضعیت جلسه:</div>
              <div class="col-7">{{ selectedExam.my_session.status || '-' }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { exam, ExamScoreType, ExamType } from 'src/repositories/exam'
import { useDate } from 'src/composables/Date'

const $q = useQuasar()
const dateManager = useDate()
const examApi = exam

const api = ref(examApi.endpoints.myExams)
const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    { name: 'name', label: 'نام آزمون', align: 'center' as const, field: 'name', sortable: true },
    { name: 'lesson', label: 'درس', align: 'center' as const, field: 'lesson' },
    { name: 'category', label: 'دسته‌بندی', align: 'center' as const, field: 'category' },
    { name: 'delivery_mode', label: 'نوع', align: 'center' as const, field: 'delivery_mode' },
    { name: 'held_at', label: 'تاریخ', align: 'center' as const, field: 'held_at' },
    { name: 'score', label: 'نمره', align: 'center' as const, field: 'score' },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})

const inputs = ref([
  { type: 'hidden', name: 'sortation_field', value: 'created_at' },
  { type: 'hidden', name: 'sortation_order', value: 'desc' },
  { type: 'hidden', name: 'length', value: 10 }
])

const entityIndexRef = ref()
const examDetailDialog = ref(false)
const selectedExam = ref<ExamType | null>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return dateManager.miladiToShamsi(dateString, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || dateString
}

function formatScore (score: ExamScoreType, maxScore: number): string {
  return `${score.raw_score}/${maxScore}`
}

function getScoreColor (
  score: ExamScoreType | null | undefined,
  maxScore: number,
  minPassingScore: number
): 'grey' | 'positive' | 'info' | 'warning' | 'negative' {
  if (!score || maxScore <= 0) return 'grey'

  const rawScore = score.raw_score ?? 0

  if (rawScore <= 0) return 'grey'
  if (rawScore >= maxScore) return 'positive'
  if (rawScore >= maxScore * 0.8) return 'info'
  if (rawScore >= minPassingScore) return 'warning'
  return 'negative'
}

function openExamDetail (exam: ExamType) {
  selectedExam.value = exam
  examDetailDialog.value = true
}
</script>

<style scoped></style>
