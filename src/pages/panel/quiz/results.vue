<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">نتایج آزمون: {{ quiz?.name }}</h4>
      </div>
      <div class="col-auto">
        <q-btn flat label="بازگشت" :to="{ name: 'Panel.Quiz.List' }" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="results">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">تعداد شرکت‌کنندگان:</div>
              <div class="text-h5 text-primary">{{ results.results?.length || 0 }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">میانگین درصد:</div>
              <div class="text-h5 text-primary">{{ averagePercent }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">بیشترین درصد:</div>
              <div class="text-h5 text-positive">{{ highestPercent }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">کمترین درصد:</div>
              <div class="text-h5 text-negative">{{ lowestPercent }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">رتبه‌بندی دانش آموزان</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            v-if="results.results && results.results.length > 0"
            :rows="results.results"
            :columns="columns"
            row-key="student_id"
            :pagination="{ rowsPerPage: 20 }"
          >
            <template #body-cell-rank="{ props }">
              <q-td :props="props">
                <q-chip :color="getRankColor(props.row.rank)" text-color="white" :label="props.row.rank" />
              </q-td>
            </template>
            <template #body-cell-percent="{ props }">
              <q-td :props="props">
                {{ props.row.percent?.toFixed(2) }} %
              </q-td>
            </template>
          </q-table>
          <div v-else class="text-center q-pa-lg">
            <p>هنوز نتیجه‌ای ثبت نشده است</p>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { quiz } from 'src/repositories/quiz'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const results = ref<any>(null)

const columns = [
  { name: 'rank', label: 'رتبه', field: 'rank', align: 'center' as const },
  { name: 'student_name', label: 'نام دانش آموز', field: 'student_name', align: 'center' as const },
  { name: 'percent', label: 'درصد', field: 'percent', align: 'center' as const },
  { name: 'started_at', label: 'زمان شروع', field: 'started_at', align: 'center' as const },
  { name: 'ended_at', label: 'زمان پایان', field: 'ended_at', align: 'center' as const },
]

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'amber-5'
  if (rank === 2) return 'grey-4'
  if (rank === 3) return 'brown-5'
  return 'primary'
}

const averagePercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const sum = results.value.results.reduce((acc: number, r: any) => acc + (r.percent || 0), 0)
  return (sum / results.value.results.length).toFixed(2) + ' %'
})

const highestPercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const max = Math.max(...results.value.results.map((r: any) => r.percent || 0))
  return max.toFixed(2) + ' %'
})

const lowestPercent = computed(() => {
  if (!results.value?.results?.length) return '-'
  const min = Math.min(...results.value.results.map((r: any) => r.percent || 0))
  return min.toFixed(2) + ' %'
})

onMounted(async () => {
  loading.value = true
  try {
    const quizId = parseInt(route.params.id as string)
    const response = await (quiz as any).resultsWithRank(quizId)
    results.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری نتایج آزمون' })
  } finally {
    loading.value = false
  }
})
</script>
