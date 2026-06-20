<template>
  <div class="homework-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در عنوان تکلیف"
              outlined
              dense
              clearable
              @update:model-value="loadHomework" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.lesson_id"
              :options="lessonOptions"
              option-value="id"
              option-label="name"
              label="درس"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadHomework" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="ایجاد تکلیف"
              :to="{ name: 'Panel.Homework.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="homework"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest">
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat dense icon="visibility" color="primary" :to="{ name: 'Panel.Homework.Show', params: { id: props.row.id } }" />
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
import HomeworkAPI from 'src/repositories/homework'
import LessonAPI from 'src/repositories/lesson'
import type { ListType, HomeworkType } from 'src/repositories/homework'

const $q = useQuasar()

const homework = ref<HomeworkType[]>([])
const lessonOptions = ref<any[]>([])
const loading = ref(false)

const filters = reactive({
  search: '',
  lesson_id: null,
  class_id: null,
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
  { name: 'title', label: 'عنوان', align: 'right' as const, field: 'title', sortable: true },
  { name: 'lesson', label: 'درس', align: 'right' as const, field: 'lesson.name' },
  { name: 'schoolClass', label: 'کلاس', align: 'right' as const, field: 'schoolClass.name' },
  { name: 'due_date', label: 'موعد تحویل', align: 'center' as const, field: 'due_date' },
  { name: 'actions', label: 'عملیات', align: 'center' as const }
]

async function loadHomework () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.lesson_id) params.lesson_id = filters.lesson_id
    if (filters.class_id) params.class_id = filters.class_id
    if (filters.search) params.title = filters.search

    const result = await HomeworkAPI.prototype.index(params)
    homework.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست تکالیف.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function loadLessons () {
  const result = await LessonAPI.prototype.index({ length: 100 })
  lessonOptions.value = result.data
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadHomework()
}

onMounted(() => {
  loadLessons()
  loadHomework()
})
</script>

<style lang="scss" scoped>
</style>
