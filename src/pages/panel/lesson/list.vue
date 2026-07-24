<template>
  <div class="lesson-list-page">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              label="جستجو در نام درس"
              outlined
              dense
              clearable
              @update:model-value="loadLessons" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.school_id"
              :options="schoolOptions"
              option-value="id"
              option-label="name"
              label="مدرسه"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadLessons" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن درس"
              :to="{ name: 'Panel.Lesson.Create' }"
              class="full-width" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="lessons"
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
                :to="{ name: 'Panel.Lesson.Show', params: { id: props.row.id } }" />
              <q-btn
                flat
                dense
                icon="edit"
                color="primary"
                :to="{ name: 'Panel.Lesson.Edit', params: { id: props.row.id } }" />
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
import LessonAPI from 'src/repositories/lesson'
import SchoolAPI from 'src/repositories/school'
import type { ListType } from 'src/repositories/BaseAPI'
import type { LessonType } from 'src/repositories/lesson'
import type { SchoolType } from 'src/repositories/school'

const lessonApi = new LessonAPI()
const schoolApi = new SchoolAPI()

const $q = useQuasar()

const lessons = ref<LessonType[]>([])
const schoolOptions = ref<SchoolType[]>([])
const loading = ref(false)

const filters = reactive({
  search: '' as string | null,
  school_id: null as number | null,
  length: 10,
  page: 1
})

const pagination = ref({
  sortBy: 'order',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'name', required: true, label: 'نام درس', align: 'right' as const, field: 'name', sortable: true },
  { name: 'school', label: 'مدرسه', align: 'right' as const, field: 'school' },
  { name: 'schoolClass', label: 'کلاس', align: 'right' as const, field: 'schoolClass' },
  { name: 'order', label: 'ترتیب', align: 'right' as const, field: 'order', sortable: true },
  { name: 'coefficient', label: 'ضریب', align: 'right' as const, field: 'coefficient' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

async function loadLessons () {
  loading.value = true
  try {
    const params: any = {
      length: pagination.value.rowsPerPage,
      page: pagination.value.page - 1
    }
    if (filters.search) params.name = filters.search
    if (filters.school_id) params.school_id = filters.school_id

    const result = await lessonApi.index(params)
    lessons.value = result.data
    pagination.value.rowsNumber = result.total
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری لیست دروس.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function onRequest (props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadLessons()
}

onMounted(async () => {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
  loadLessons()
})
</script>

<style lang="scss" scoped>
.lesson-list-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
