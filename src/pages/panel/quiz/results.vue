<template>
  <q-page class="quiz-results-page">
    <q-layout view="lHh Lpr lFf" container class="results-layout">
      <q-header elevated class="bg-white text-dark">
        <q-toolbar>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawerOpen = !drawerOpen" />
          <q-toolbar-title class="text-subtitle1">
            نتایج آزمون: {{ quiz?.name || '...' }}
          </q-toolbar-title>
          <q-btn flat label="بازگشت" :to="{ name: 'Panel.Quiz.List' }" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawerOpen" show-if-above bordered :width="320" class="results-drawer">
        <div class="q-pa-md">
          <div class="text-subtitle1 q-mb-md">گزارش آزمون</div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label>تعداد شرکت‌کنندگان</q-item-label>
                <q-item-label caption>{{ results?.results?.length || 0 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>میانگین پاسخ‌گویی</q-item-label>
                <q-item-label caption dir="ltr">{{ averagePercent }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>بیشترین درصد</q-item-label>
                <q-item-label caption dir="ltr" class="text-positive">{{ highestPercent }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>کمترین درصد</q-item-label>
                <q-item-label caption dir="ltr" class="text-negative">{{ lowestPercent }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <div class="legend-block q-mb-md">
            <div class="row items-center q-mb-xs">
              <div class="col">پاسخ داوطلب:</div>
              <div class="col-auto"><q-icon name="check_circle_outline" color="primary" size="18px" /></div>
            </div>
            <div class="row items-center q-mb-xs">
              <div class="col">پاسخ صحیح:</div>
              <div class="col-auto legend-correct" />
            </div>
          </div>

          <q-btn
            color="primary"
            class="full-width"
            flat
            label="بازگشت به لیست آزمون‌ها"
            :to="{ name: 'Panel.Quiz.List' }"
          />
        </div>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-md">
          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner color="primary" size="100px" />
            <div class="q-mt-md">در حال بارگذاری نتایج...</div>
          </div>

          <template v-else-if="results">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">رتبه‌بندی دانش‌آموزان</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  v-if="results.results && results.results.length > 0"
                  :rows="results.results"
                  :columns="columns"
                  row-key="student_id"
                  flat
                  bordered
                  :pagination="{ rowsPerPage: 20 }"
                >
                  <template #body-cell-rank="{ props }">
                    <q-td :props="props">
                      <q-chip :color="getRankColor(props.row.rank)" text-color="white" :label="String(props.row.rank)" />
                    </q-td>
                  </template>
                  <template #body-cell-percent="{ props }">
                    <q-td :props="props">
                      <span dir="ltr">{{ formatPercent(props.row.percent) }}</span>
                    </q-td>
                  </template>
                  <template #body-cell-started_at="{ props }">
                    <q-td :props="props">
                      <span dir="ltr">{{ formatDateTime(props.row.started_at) }}</span>
                    </q-td>
                  </template>
                  <template #body-cell-ended_at="{ props }">
                    <q-td :props="props">
                      <span dir="ltr">{{ formatDateTime(props.row.ended_at) }}</span>
                    </q-td>
                  </template>
                  <template #body-cell-booklet_scores="{ props }">
                    <q-td :props="props">
                      <div v-if="props.row.booklet_scores?.length">
                        <div
                          v-for="bs in props.row.booklet_scores"
                          :key="bs.id"
                          dir="ltr"
                          class="text-caption q-mb-xs">
                          {{ bs.title }}: {{ bs.percent }}%
                        </div>
                      </div>
                      <span v-else class="text-grey-6">-</span>
                    </q-td>
                  </template>
                </q-table>
                <div v-else class="text-center q-pa-lg text-grey-7">
                  هنوز نتیجه‌ای ثبت نشده است
                </div>
              </q-card-section>
            </q-card>
          </template>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { quiz, quizRepository } from 'src/repositories/quiz'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const results = ref<any>(null)
const quizData = ref<any>(null)
const drawerOpen = ref(true)

const columns = [
  { name: 'rank', label: 'رتبه', field: 'rank', align: 'center' as const },
  { name: 'student_name', label: 'نام دانش‌آموز', field: 'student_name', align: 'center' as const },
  { name: 'percent', label: 'درصد', field: 'percent', align: 'center' as const },
  { name: 'started_at', label: 'زمان شروع', field: 'started_at', align: 'center' as const },
  { name: 'ended_at', label: 'زمان ارسال پاسخنامه', field: 'ended_at', align: 'center' as const },
  { name: 'booklet_scores', label: 'درصد دفترچه‌ها', field: 'booklet_scores', align: 'center' as const }
]

const quiz = computed(() => quizData.value)

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'amber-5'
  if (rank === 2) return 'grey-4'
  if (rank === 3) return 'brown-5'
  return 'primary'
}

const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return `${Number(value).toFixed(2)} %`
}

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const averagePercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const sum = results.value.results.reduce((acc: number, row: any) => acc + (row.percent || 0), 0)
  return formatPercent(sum / results.value.results.length)
})

const highestPercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const max = Math.max(...results.value.results.map((row: any) => row.percent || 0))
  return formatPercent(max)
})

const lowestPercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const min = Math.min(...results.value.results.map((row: any) => row.percent || 0))
  return formatPercent(min)
})

onMounted(async () => {
  loading.value = true
  try {
    const quizId = parseInt(route.params.id as string)
    quizData.value = await quizRepository.get(quizId)
    const response = await (quiz as any).resultsWithRank(quizId)
    results.value = response.data?.data || response.data
  } catch {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری نتایج آزمون' })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.quiz-results-page {
  min-height: calc(100vh - 50px);
}

.results-layout {
  min-height: calc(100vh - 50px);
}

.results-drawer {
  background: #fafafa;
}

.legend-correct {
  width: 20px;
  height: 20px;
  background: #adff2f;
  border-radius: 2px;
}
</style>
