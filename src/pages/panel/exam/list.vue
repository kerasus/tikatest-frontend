<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">مدیریت آزمون‌ها</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="ثبت آزمون جدید"
          :to="{ name: 'Panel.Exam.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.name"
              label="نام آزمون"
              outlined
              clearable
              @update:model-value="loadExams" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.lesson_id"
              :options="lessonOptions"
              option-value="id"
              option-label="name"
              label="درس"
              outlined
              clearable
              emit-value
              map-options
              @update:model-value="loadExams" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.delivery_mode"
              :options="deliveryModeOptions"
              label="نوع تحویل"
              outlined
              clearable
              emit-value
              map-options
              @update:model-value="loadExams" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div
          v-if="loading"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="100px" />
        </div>

        <div
          v-else-if="exams.data.length === 0"
          class="text-center q-pa-lg">
          <q-icon
            name="assignment"
            size="100px"
            color="primary" />
          <p class="text-subtitle1 q-mt-md">هیچ آزمونی ثبت نشده است</p>
        </div>

        <q-table
          v-else
          :rows="exams.data"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-lesson="props">
            <q-td :props="props">
              {{ props.row.lesson?.name || '-' }}
            </q-td>
          </template>
          <template #body-cell-category="props">
            <q-td :props="props">
              {{ props.row.category?.title || '-' }}
            </q-td>
          </template>
          <template #body-cell-delivery_mode="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.delivery_mode === 'online' ? 'primary' : 'secondary'"
                text-color="white"
                dense>
                {{ props.row.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
              </q-chip>
            </q-td>
          </template>
          <template #body-cell-created_at="props">
            <q-td :props="props">
              {{ props.row.created_at || '-' }}
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="info"
                size="sm"
                @click="viewExam(props.row.id)" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="deleteExam(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { exam } from 'src/repositories/exam'
import { lesson } from 'src/repositories/lesson'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const exams = ref<any>({ data: [], current_page: 1, per_page: 10, total: 0 })
const lessons = ref<any[]>([])

const filters = reactive({
  name: null as string | null,
  lesson_id: null as number | null,
  delivery_mode: null as string | null
})

const lessonOptions = ref<any[]>([])

const deliveryModeOptions = [
  { label: 'آنلاین', value: 'online' },
  { label: 'حضوری', value: 'in_person' }
]

const columns = [
  { name: 'name', label: 'نام آزمون', field: 'name', align: 'center' as const },
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'category', label: 'دسته‌بندی', field: 'category', align: 'center' as const },
  { name: 'delivery_mode', label: 'نوع تحویل', field: 'delivery_mode', align: 'center' as const },
  { name: 'created_at', label: 'تاریخ ثبت', field: 'created_at', align: 'center' as const },
  { name: 'actions', label: 'عملیات', field: 'actions', align: 'center' as const }
]

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const loadExams = async () => {
  loading.value = true
  try {
    const params: any = { length: pagination.value.rowsPerPage, page: pagination.value.page }
    if (filters.name) params.name = filters.name
    if (filters.lesson_id) params.lesson_id = filters.lesson_id
    if (filters.delivery_mode) params.delivery_mode = filters.delivery_mode

    const response = await exam.index(params)
    exams.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری آزمون‌ها' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = (props: any) => {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  pagination.value.sortBy = props.pagination.sortBy
  pagination.value.descending = props.pagination.descending
  loadExams()
}

const loadLessons = async () => {
  try {
    const response = await lesson.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

const viewExam = (id: number) => {
  router.push({ name: 'Panel.Exam.Show', params: { id } })
}

const deleteExam = async (item: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: `آزمون ${item.name} حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await exam.delete(item.id)
      $q.notify({ type: 'positive', message: 'آزمون با موفقیت حذف شد' })
      loadExams()
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف آزمون' })
    }
  })
}

onMounted(() => {
  loadExams()
  loadLessons()
})
</script>
