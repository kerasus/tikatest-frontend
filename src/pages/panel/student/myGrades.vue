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
    <!-- پنجره پاپ‌آپ گزارش و جزئیات نمره آزمون -->
    <q-dialog
      v-model="examDetailDialog"
      transition-show="scale"
      transition-hide="scale">
      <q-card
        style="width: 640px; max-width: 95vw;"
        class="rounded-borders">

        <!-- هدر دیالوگ -->
        <q-card-section class="bg-grey-1 q-py-sm row items-center justify-between">
          <div class="row items-center no-wrap">
            <q-avatar
              icon="fact_check"
              color="primary"
              text-color="white"
              size="36px"
              class="q-mr-sm" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9">جزئیات و کارنامه آزمون</div>
              <div class="text-caption text-grey-6">{{ selectedExam?.name || '-' }}</div>
            </div>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            color="grey-7">
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <!-- بدنه اصلی -->
        <q-card-section
          v-if="selectedExam"
          class="q-pa-md scroll"
          style="max-height: 72vh;">
          <div class="column q-gutter-y-md">

            <!-- کارت نمره و نتیجه دانش‌آموز (Highlight) -->
            <q-card
              flat
              bordered
              class="bg-grey-1">
              <q-card-section class="q-py-md">
                <div class="row items-center justify-between q-col-gutter-sm">
                  <!-- امتیاز کسب‌شده -->
                  <div class="col-12 col-sm-auto row items-center">
                    <q-avatar
                      :color="getScoreColor(selectedExam.score, selectedExam.max_score, selectedExam.min_passing_score)"
                      text-color="white"
                      size="52px"
                      icon="military_tech"
                      class="q-mr-md" />
                    <div>
                      <div class="text-caption text-grey-7 text-weight-medium">نمره کسب‌شده شما:</div>
                      <div
                        v-if="selectedExam.score"
                        class="text-h5 text-weight-bolder"
                        :class="`text-${getScoreColor(selectedExam.score, selectedExam.max_score, selectedExam.min_passing_score)}`">
                        {{ formatScore(selectedExam.score, selectedExam.max_score) }}
                      </div>
                      <span
                        v-else
                        class="text-grey-6 text-weight-bold">نمره‌ای ثبت نشده</span>
                    </div>
                  </div>

                  <!-- حداقل قبولی و سقف نمره -->
                  <div class="col-12 col-sm-auto row q-gutter-x-sm">
                    <q-badge
                      outline
                      color="grey-8"
                      class="q-pa-sm text-caption">
                      حداقل قبولی:
                      <strong class="q-ml-xs text-orange-9">{{ selectedExam.min_passing_score || '-' }}</strong>
                    </q-badge>
                    <q-badge
                      outline
                      color="grey-8"
                      class="q-pa-sm text-caption">
                      سقف نمره:
                      <strong class="q-ml-xs text-primary">{{ selectedExam.max_score || '-' }}</strong>
                    </q-badge>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- مشخصات و اطلاعات پایه آزمون (دو ستونه ریسپانسیو) -->
            <div class="row q-col-gutter-sm">
              <!-- درس -->
              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      name="menu_book"
                      color="primary"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">عنوان درس</q-item-label>
                    <q-item-label class="text-weight-medium text-grey-9">
                      {{ selectedExam.lesson?.name || '-' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <!-- دسته‌بندی -->
              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      name="category"
                      color="primary"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">دسته‌بندی</q-item-label>
                    <q-item-label class="text-weight-medium text-grey-9">
                      {{ selectedExam.category?.title || '-' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <!-- شیوه برگزاری -->
              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      :name="selectedExam.delivery_mode === 'online' ? 'devices' : 'location_city'"
                      :color="selectedExam.delivery_mode === 'online' ? 'primary' : 'secondary'"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">نوع برگزاری</q-item-label>
                    <q-item-label>
                      <q-chip
                        :color="selectedExam.delivery_mode === 'online' ? 'primary' : 'secondary'"
                        text-color="white"
                        dense
                        size="sm"
                        class="q-ma-none text-weight-medium">
                        {{ selectedExam.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <!-- زمان برگزاری یا شروع -->
              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      name="event"
                      color="primary"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">
                      {{ selectedExam.delivery_mode === 'online' ? 'زمان شروع' : 'تاریخ برگزاری' }}
                    </q-item-label>
                    <q-item-label class="text-weight-medium text-grey-9">
                      <template v-if="selectedExam.in_person_exam_detail?.held_at">
                        {{ formatDate(selectedExam.in_person_exam_detail.held_at) }}
                      </template>
                      <template v-else-if="selectedExam.online_exam_detail?.starts_at">
                        {{ formatDate(selectedExam.online_exam_detail.starts_at) }}
                      </template>
                      <span
                        v-else
                        class="text-grey-6">-</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <!-- اطلاعات تکمیلی آزمون‌دهنده (در صورت وجود نتیجه خام یا جلسه) -->
            <template v-if="selectedExam.my_result || selectedExam.my_session">
              <q-separator inset />

              <div class="row q-col-gutter-sm">
                <!-- نمره خام -->
                <div
                  v-if="selectedExam.my_result"
                  class="col-12 col-sm-6">
                  <div class="row items-center justify-between bg-grey-2 rounded-borders q-pa-sm">
                    <span class="text-caption text-grey-8 text-weight-bold">نمره خام آزمون:</span>
                    <q-badge
                      color="grey-7"
                      text-color="white"
                      class="text-weight-bold">
                      {{ selectedExam.my_result.raw_score ?? '-' }}
                    </q-badge>
                  </div>
                </div>

                <!-- وضعیت جلسه -->
                <div
                  v-if="selectedExam.my_session"
                  class="col-12 col-sm-6">
                  <div class="row items-center justify-between bg-grey-2 rounded-borders q-pa-sm">
                    <span class="text-caption text-grey-8 text-weight-bold">وضعیت جلسه:</span>
                    <q-badge
                      color="info"
                      text-color="white">
                      {{ selectedExam.my_session.status || '-' }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </template>

          </div>
        </q-card-section>

        <q-separator />

        <!-- دکمه بستن -->
        <q-card-actions
          align="right"
          class="bg-grey-1 q-py-xs q-px-sm">
          <q-btn
            v-close-popup
            flat
            rounded
            label="بستن"
            color="primary"
            class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import { exam, type ExamScoreType, type ExamType } from 'src/repositories/exam'

const examApi = exam
const dateManager = useDate()

const api = ref(examApi.endpoints.myOnlineExams)
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
