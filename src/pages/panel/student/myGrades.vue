<template>
  <div>
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
          <template v-if="getScoreObject(inputData.props.row).scaled_score || getScoreObject(inputData.props.row).raw_score">
            <q-chip
              :color="
                getScoreColor(
                  getScoreObject(inputData.props.row).raw_score,
                  getScoreObject(inputData.props.row).max_score,
                  getScoreObject(inputData.props.row).min_passing_score,
                )
              "
              text-color="white"
              dense>
              {{ formatScore(getScoreObject(inputData.props.row).raw_score, inputData.props.row.max_score) }}
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


    <!-- پنجره پاپ‌آپ گزارش و جزئیات نمره آزمون -->
    <q-dialog
      v-model="examDetailDialog"
      transition-show="scale"
      transition-hide="scale">
      <q-card
        style="width: 600px; max-width: 95vw;"
        class="rounded-borders shadow-10">

        <!-- هدر دیالوگ با تم رنگی بر اساس نمره -->
        <q-card-section
          :class="`bg-${getScoreColor(getScoreObject(selectedExam).raw_score, selectedExam.max_score, selectedExam.min_passing_score)}`"
          class="text-white q-py-md row items-center justify-between">
          <div class="row items-center no-wrap">
            <q-icon
              name="auto_stories"
              size="32px"
              class="q-mr-sm" />
            <div>
              <div class="text-subtitle1 text-weight-bolder">کارنامه و جزئیات آزمون</div>
              <div class="text-caption opacity-80">{{ selectedExam?.name || '-' }}</div>
            </div>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            color="white" />
        </q-card-section>

        <!-- بدنه اصلی -->
        <q-card-section
          v-if="selectedExam"
          class="q-pa-lg scroll"
          style="max-height: 75vh;">

          <div class="column q-gutter-y-lg">

            <!-- بخش نمایش نمره (بزرگ و متمرکز) -->
            <div class="column items-center justify-center q-py-md bg-grey-1 rounded-borders border-dashed">
              <div class="text-grey-7 text-weight-medium q-mb-xs">
                {{ Number(selectedExam.max_score) === 20 ? 'نمره نهایی شما' : 'وضعیت عملکرد' }}
              </div>

              <div class="row items-baseline q-gutter-x-xs">
                <span
                  class="text-h2 text-weight-bolder"
                  :class="`text-${getScoreColor(getScoreObject(selectedExam).raw_score, selectedExam.max_score, selectedExam.min_passing_score)}`">
                  {{ getScoreObject(selectedExam).raw_score ?? '-' }}
                </span>
                <span class="text-h6 text-grey-5">/</span>
                <span class="text-h6 text-grey-6">{{ selectedExam.max_score }}</span>
              </div>

              <!-- نمایش معادل نمره از ۲۰ (فقط اگر سقف نمره ۲۰ نباشد) -->
              <div
                v-if="selectedExam.in_person_exam_result && Number(selectedExam.max_score) !== 20"
                class="q-mt-sm">
                <q-badge
                  color="blue-grey-7"
                  class="q-pa-sm text-subtitle2 shadow-2">
                  <q-icon
                    name="calculate"
                    class="q-mr-xs" />
                  معادل نمره از ۲۰:
                  <span class="text-weight-bolder q-ml-xs">
                    {{ ((getScoreObject(selectedExam).raw_score * 20) / selectedExam.max_score).toFixed(2) }}
                  </span>
                </q-badge>
              </div>
            </div>

            <!-- مشخصات آزمون در قالب گرید -->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="info-box">
                  <div class="label">درس</div>
                  <div class="value text-primary">{{ selectedExam.lesson?.name || '-' }}</div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="info-box">
                  <div class="label">دسته‌بندی</div>
                  <div class="value">{{ selectedExam.category?.title || '-' }}</div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="info-box">
                  <div class="label">شیوه برگزاری</div>
                  <div class="value">
                    <q-icon
                      :name="selectedExam.delivery_mode === 'online' ? 'devices' : 'location_on'"
                      :color="selectedExam.delivery_mode === 'online' ? 'primary' : 'secondary'"
                      size="18px"
                      class="q-mr-xs" />
                    {{ selectedExam.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="info-box">
                  <div class="label">تاریخ</div>
                  <div class="value">
                    <template v-if="selectedExam.in_person_exam_detail?.held_at">
                      {{ formatDate(selectedExam.in_person_exam_detail.held_at) }}
                    </template>
                    <template v-else-if="selectedExam.online_exam_detail?.starts_at">
                      {{ formatDate(selectedExam.online_exam_detail.starts_at) }}
                    </template>
                    <span v-else>-</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- فوتر جزئیات (حداقل قبولی) -->
            <div class="row justify-center q-pt-md">
              <div class="text-caption text-grey-6 row items-center">
                <q-icon
                  name="info_outline"
                  class="q-mr-xs" />
                حداقل نمره برای قبولی در این آزمون
                <span class="text-weight-bold text-grey-9 q-mx-xs">{{ selectedExam.min_passing_score }}</span>
                تعیین شده بود.
              </div>
            </div>

          </div>
        </q-card-section>

        <q-card-actions
          align="center"
          class="q-pb-md">
          <q-btn
            v-close-popup
            outline
            label="فهمیدم، ممنون"
            color="grey-8"
            class="rounded-borders q-px-xl" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import ExamAPI, { type ExamType } from 'src/repositories/exam'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectExamCategory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'

const dateManager = useDate()
const examAPI = new ExamAPI()
const currentSchoolManager = useCurrentSchool()

const FormBuilderInputComponent = shallowRef(FormBuilderInput)
const FormBuilderSelectLessonComponent = shallowRef(FormBuilderSelectLesson)
const FormBuilderSelectExamCategoryComponent = shallowRef(FormBuilderSelectExamCategory)

type ScoreObjectType = {
  max_score: number
  min_passing_score: number
  raw_score: number
  scaled_score: number
}

const api = ref(examAPI.endpoints.myGrades)
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
  { type: 'hidden', name: 'length', value: 10 },
  { type: 'hidden', name: 'inSchool', value: currentSchoolManager.currentSchool.value?.id },
  {
    type: FormBuilderInputComponent,
    name: 'name',
    label: 'نام آزمون',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectLessonComponent,
    name: 'lesson_id',
    label: 'درس',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectExamCategoryComponent,
    name: 'exam_category_id',
    col: 'col-md-4 col-12'
  }
])

const entityIndexRef = ref()
const examDetailDialog = ref(false)
const selectedExam = ref<ExamType | null>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return dateManager.miladiToShamsi(dateString, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || dateString
}

function getScoreObject (row: ExamType): ScoreObjectType {
  const inPersonResult = row?.in_person_exam_result
  return {
    max_score: row?.max_score,
    min_passing_score: row?.min_passing_score,
    raw_score: inPersonResult ? inPersonResult.raw_score : null,
    scaled_score: inPersonResult ? inPersonResult.scaled_score : null
  }
}

function formatScore (rawScore: number, maxScore: number): string {
  return `${rawScore}/${maxScore}`
}

function getScoreColor (
  rawScore: number | null | undefined,
  maxScore: number,
  minPassingScore: number
): 'grey' | 'positive' | 'info' | 'warning' | 'negative' {
  // تبدیل امن به عدد
  const rScore = Number(rawScore)
  const mScore = Number(maxScore)
  const minScore = Number(minPassingScore)

  if (!rawScore || mScore <= 0) return 'grey'

  // حالا با مقادیر عددی مقایسه کن
  if (rScore >= mScore * 0.9) return 'positive'
  if (rScore >= mScore * 0.75) return 'info'
  if (rScore >= minScore) return 'warning'

  return 'negative'
}

function openExamDetail (exam: ExamType) {
  selectedExam.value = exam
  examDetailDialog.value = true
}

onMounted(() => {
  inputs.value.forEach((item) => {
    if (item.name === 'exam_category_id') {
      // @ts-ignore
      item.schoolId = currentSchoolManager.currentSchool.value?.id
    }
    if (item.name === 'inSchool') {
      item.value = currentSchoolManager.currentSchool.value?.id
    }
  })
})
</script>

<style scoped></style>
