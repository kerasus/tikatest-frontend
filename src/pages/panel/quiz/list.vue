<template>
  <div class="quiz-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.quiz_type"
              :options="quizTypeOptions"
              label="نوع آزمون"
              outlined
              dense
              clearable
              @update:model-value="loadQuizzes" />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام آزمون"
              outlined
              dense
              clearable
              @update:model-value="loadQuizzes" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="ایجاد آزمون جدید"
              :to="{ name: 'Panel.Quiz.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="quizzes"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="visibility"
                color="primary"
                :to="{ name: 'Panel.Quiz.Show', params: { id: props.row.id } }" />
              <q-btn
                flat
                dense
                icon="assignment"
                color="secondary"
                :to="{ name: 'Panel.Quiz.Results', params: { id: props.row.id } }" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import QuizAPI from 'src/repositories/quiz'
import type { ListType, QuizType } from 'src/repositories/quiz'

const quizApi = new QuizAPI()

const $q = useQuasar()

const quizzes = ref<QuizType[]>([])
const loading = ref(false)

const quizTypeOptions = [
  { label: 'آزمون متنی', value: 'text' },
  { label: 'آزمون تصویری', value: 'image' },
  { label: 'آزمون آنلاین', value: 'online' }
]

const filters = reactive({
  search: '',
  quiz_type: null,
  is_visible: null,
  length: 10,
  page: 1
})

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'name', label: 'نام آزمون', align: 'right' as const, field: 'name', sortable: true },
  { name: 'quiz_type', label: 'نوع', align: 'center' as const, field: 'quiz_type' },
  { name: 'start_time', label: 'شروع', align: 'center' as const, field: 'start_time' },
  { name: 'end_time', label: 'پایان', align: 'center' as const, field: 'end_time' },
  { name: 'timer', label: 'زمان (ثانیه)', align: 'center' as const, field: 'timer' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadQuizzes () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.quiz_type) params.quiz_type = filters.quiz_type
    if (filters.search) params.name = filters.search
    if (filters.is_visible !== null) params.is_visible = filters.is_visible

    const result = await quizApi.index(params)
    quizzes.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست آزمون‌ها.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadQuizzes()
}

onMounted(() => {
  loadQuizzes()
})
</script>

<style lang="scss" scoped>
</style>
