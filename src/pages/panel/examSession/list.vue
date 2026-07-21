<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">مدیریت آزمون‌های کلاسی</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="ثبت آزمون جدید"
          :to="{ name: 'Panel.ExamSession.Create' }" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
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
              @update:model-value="loadSessions" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.class_id"
              :options="classOptions"
              option-value="id"
              option-label="name"
              label="کلاس"
              outlined
              clearable
              emit-value
              map-options
              @update:model-value="loadSessions" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.grade_type"
              :options="gradeTypeOptions"
              label="نوع نمره"
              outlined
              clearable
              emit-value
              map-options
              @update:model-value="loadSessions" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.date"
              label="تاریخ"
              outlined
              type="date"
              @update:model-value="loadSessions" />
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
          v-else-if="sessions.data.length === 0"
          class="text-center q-pa-lg">
          <q-icon
            name="assignment"
            size="100px"
            color="primary" />
          <p class="text-subtitle1 q-mt-md">هیچ آزمونی ثبت نشده است</p>
        </div>

        <q-table
          v-else
          :rows="sessions.data"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          @request="onTableRequest">
          <template #body-cell-lesson="props">
            <q-td :props="props">
              {{ props.row.lesson?.name || '-' }}
            </q-td>
          </template>
          <template #body-cell-class="props">
            <q-td :props="props">
              {{ props.row.schoolClass?.name || '-' }}
            </q-td>
          </template>
          <template #body-cell-grade_type="props">
            <q-td :props="props">
              {{ getGradeTypeLabel(props.row.grade_type) }}
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
                @click="viewParticipants(props.row.id)" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="deleteSession(props.row)" />
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
import { examSession } from 'src/repositories/examSession'
import { lesson } from 'src/repositories/lesson'
import { schoolClass } from 'src/repositories/schoolClass'

const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const sessions = ref<any>({ data: [], current_page: 1, per_page: 10, total: 0 })
const lessons = ref<any[]>([])
const classes = ref<any[]>([])

const filters = reactive({
  lesson_id: null as number | null,
  class_id: null as number | null,
  grade_type: null as string | null,
  date: null as string | null
})

const lessonOptions = ref<any[]>([])
const classOptions = ref<any[]>([])

const gradeTypeOptions = [
  { label: 'آزمون کلاسی', value: 'class_quiz' },
  { label: 'آزمون ماهانه', value: 'monthly_quiz' },
  { label: 'میان ترم اول', value: 'mid_term_1' },
  { label: 'مستمر اول', value: 'continuous_1' },
  { label: 'پایان ترم اول', value: 'final_1' },
  { label: 'میان ترم دوم', value: 'mid_term_2' },
  { label: 'مستمر دوم', value: 'continuous_2' },
  { label: 'پایان ترم دوم', value: 'final_2' },
  { label: 'سایر', value: 'other' }
]

const columns = [
  { name: 'lesson', label: 'درس', field: 'lesson', align: 'center' as const },
  { name: 'class', label: 'کلاس', field: 'class', align: 'center' as const },
  { name: 'gregorian_date', label: 'تاریخ', field: 'gregorian_date', align: 'center' as const },
  { name: 'grade_type', label: 'نوع نمره', field: 'grade_type', align: 'center' as const },
  { name: 'is_report_card', label: 'کارنامه', field: 'is_report_card', align: 'center' as const },
  { name: 'actions', label: 'عملیات', field: 'actions', align: 'center' as const }
]

const pagination = ref({
  sortBy: 'gregorian_date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const getGradeTypeLabel = (value: string | null): string => {
  const option = gradeTypeOptions.find((o) => o.value === value)
  return option ? option.label : '-'
}

const loadSessions = async () => {
  loading.value = true
  try {
    const params: any = { length: pagination.value.rowsPerPage, page: pagination.value.page }
    if (filters.lesson_id) params.lesson_id = filters.lesson_id
    if (filters.class_id) params.class_ids = [filters.class_id]
    if (filters.grade_type) params.grade_type = filters.grade_type
    if (filters.date) params.gregorian_date_since_date = filters.date
    if (filters.date) params.gregorian_date_till_date = filters.date

    const response = await examSession.index(params)
    sessions.value = response.data
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
  loadSessions()
}

const loadLessons = async () => {
  try {
    const response = await lesson.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

const loadClasses = async () => {
  try {
    const response = await schoolClass.index({ length: 100 })
    classOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading classes:', error)
  }
}

const viewParticipants = (sessionId: number) => {
  router.push({ name: 'Panel.ExamSession.Show', params: { id: sessionId } })
}

const deleteSession = async (session: any) => {
  $q.dialog({
    title: 'تایید حذف',
    message: `آزمون ${session.lesson?.name} برای کلاس ${session.schoolClass?.name} حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await examSession.delete(session.id)
      $q.notify({ type: 'positive', message: 'آزمون با موفقیت حذف شد' })
      loadSessions()
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف آزمون' })
    }
  })
}

onMounted(() => {
  loadSessions()
  loadLessons()
  loadClasses()
})
</script>
