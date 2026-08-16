<template>
  <div class="homework-detail-page">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات تکلیف</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="بازگشت"
          :to="{ name: 'Panel.Homework.List' }" />
        <q-btn
          color="primary"
          label="ویرایش"
          size="sm"
          :to="{ name: 'Panel.Homework.Edit', params: { id: route.params.id } }"
          class="q-ml-sm" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="homeworkData">
      <homework-detail-card
        v-model:homework="homeworkData"
        :editable="false" />

      <entity-index
        ref="submissionsIndexRef"
        :value="inputs"
        title="لیست ارسال‌ها"
        :api="submissionsApi"
        :table="submissionsTable"
        :table-keys="tableKeys"
        :show-close-button="false"
        :show-expand-button="false"
        :show-reload-button="true"
        :show-search-button="false"
        :row-key="itemIdentifyKey">
        <template #entity-index-table-cell="{ inputData }">
          <template v-if="inputData.col.name === 'student_name'">
            {{ inputData.props.row.student?.full_name || inputData.props.row.student_id || '-' }}
          </template>
          <template v-else-if="inputData.col.name === 'submitted_at'">
            {{ formatDateTime(inputData.props.row.submitted_at) }}
          </template>
          <template v-else-if="inputData.col.name === 'student_seen_at'">
            {{ formatDateTime(inputData.props.row.student_seen_at) }}
          </template>
          <template v-else-if="inputData.col.name === 'operator_seen_at'">
            {{ formatDateTime(inputData.props.row.operator_seen_at) }}
          </template>
          <template v-else-if="inputData.col.name === 'content'">
            <div
              v-if="inputData.props.row.content?.type === 'text'"
              class="text-body2">
              {{ inputData.props.row.content.body?.substring(0, 80) || '-' }}
            </div>
            <img
              v-else-if="inputData.props.row.content?.type === 'image' && inputData.props.row.content?.path"
              :src="`storage/${inputData.props.row.content.path}`"
              alt="پیش‌نمایش"
              style="max-width: 80px; max-height: 60px; display: block">
            <q-btn
              v-else-if="inputData.props.row.content?.type === 'pdf' && inputData.props.row.content?.path"
              flat
              dense
              color="primary"
              icon="picture_as_pdf"
              label="مشاهده"
              @click.stop="openPdfPreview(inputData.props.row.content.path)" />
            <span v-else>-</span>
          </template>
          <template v-else-if="inputData.col.name === 'feedback'">
            {{ inputData.props.row.feedback || '-' }}
          </template>
          <template v-else-if="inputData.col.name === 'actions'">
            <q-btn
              flat
              dense
              color="primary"
              icon="edit"
              @click.stop="openFeedbackDialog(inputData.props.row)" />
          </template>
          <template v-else>
            {{ inputData.col.value }}
          </template>
        </template>
      </entity-index>
    </template>

    <q-dialog v-model="feedbackDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">بازخورد</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              v-model="feedbackForm.feedback"
              label="بازخورد"
              outlined
              type="textarea"
              rows="3" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="انصراف"
            @click="feedbackDialog = false" />
          <q-btn
            color="primary"
            label="ذخیره"
            :loading="saving"
            @click="saveFeedback" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="pdfDialog">
      <q-card style="width: 90vw; height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-subtitle2">پیش‌نمایش PDF</div>
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
        <q-card-section class="col q-pa-none overflow-hidden">
          <iframe
            :src="pdfPreviewSrc"
            style="width: 100%; height: 100%; border: none;" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()
const dateManager = useDate()

const homeworkData = ref<Partial<HomeworkType>>({})
const loading = ref(false)
const saving = ref(false)
const feedbackDialog = ref(false)
const pdfDialog = ref(false)
const pdfPreviewSrc = ref('')

const submissionsApi = ref('/homework-submissions')
const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const submissionsTable = ref({
  columns: [
    { name: 'student_name', label: 'دانش‌آموز', align: 'right' as const, field: 'student_name' },
    { name: 'submitted_at', label: 'زمان ارسال', align: 'center' as const, field: 'submitted_at', sortable: true },
    { name: 'student_seen_at', label: 'مشاهده توسط دانش‌آموز', align: 'center' as const, field: 'student_seen_at' },
    { name: 'operator_seen_at', label: 'مشاهده توسط معلم', align: 'center' as const, field: 'operator_seen_at' },
    { name: 'content', label: 'محتوای ارسالی', align: 'center' as const, field: 'content' },
    { name: 'feedback', label: 'بازخورد', align: 'center' as const, field: 'feedback' },
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
  { type: 'hidden', name: 'homework_id', value: Number(route.params.id) },
  { type: 'hidden', name: 'sortation_field', value: 'submitted_at' },
  { type: 'hidden', name: 'sortation_order', value: 'desc' },
  { type: 'hidden', name: 'length', value: 10 }
])

const submissionsIndexRef = ref()

const feedbackForm = ref({
  feedback: null as string | null
})
const currentFeedbackSubmissionId = ref<number | null>(null)

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.miladiToShamsi(value, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || value
}

function openPdfPreview (path: string) {
  pdfPreviewSrc.value = `storage/${path}`
  pdfDialog.value = true
}

function openFeedbackDialog (submission: HomeworkSubmissionType) {
  currentFeedbackSubmissionId.value = submission.id
  feedbackForm.value.feedback = submission.feedback
  feedbackDialog.value = true
}

async function saveFeedback () {
  if (!currentFeedbackSubmissionId.value) return
  saving.value = true
  try {
    await homeworkApi.getAxiosInstanceWithToken().put(`/homework-submissions/${currentFeedbackSubmissionId.value}`, {
      feedback: feedbackForm.value.feedback,
      operator_seen_at: new Date().toISOString()
    })
    $q.notify({ type: 'positive', message: 'بازخورد ثبت شد' })
    feedbackDialog.value = false
    currentFeedbackSubmissionId.value = null
    submissionsIndexRef.value?.reload()
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت بازخورد' })
  } finally {
    saving.value = false
  }
}

async function loadHomework () {
  loading.value = true
  try {
    homeworkData.value = await homeworkApi.get(Number(route.params.id))
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات تکلیف.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHomework()
})
</script>

<style lang="scss" scoped>
</style>
