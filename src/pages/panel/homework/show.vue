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
              v-else-if="
                inputData.props.row.content?.type === 'image' && inputData.props.row.content?.path
              "
              :src="`storage/${inputData.props.row.content.path}`"
              alt="پیش‌نمایش"
              style="max-width: 80px; max-height: 60px; display: block">
            <q-btn
              v-else-if="
                inputData.props.row.content?.type === 'pdf' && inputData.props.row.content?.path
              "
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
              icon="visibility"
              @click.stop="openSubmissionDetailDialog(inputData.props.row)" />
          </template>
          <template v-else>
            {{ inputData.col.value }}
          </template>
        </template>
      </entity-index>
    </template>
    <!-- دیالوگ بررسی و مشاهده جزئیات ارسال دانش‌آموز -->
    <q-dialog
      v-model="submissionDetailDialog"
      persistent
      transition-show="scale"
      transition-hide="scale">
      <q-card
        class="column rounded-borders"
        style="width: 960px; max-width: 95vw; max-height: 90vh">
        <!-- ۱. هدر دیالوگ -->
        <q-card-section class="bg-blue-grey-1 q-py-sm col-auto">
          <div class="row items-center justify-between no-wrap">
            <div class="row items-center">
              <q-avatar
                size="36px"
                color="primary"
                text-color="white"
                icon="assignment_turned_in"
                class="q-mr-sm shadow-1" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                  بررسی پاسخ و ارزیابی تکلیف
                </div>
                <div class="text-caption text-grey-7">
                  مشاهده محتوای ارسالی، زمان‌بندی و ثبت بازخورد آموزشی
                </div>
              </div>
            </div>

            <div class="row items-center q-gutter-x-sm">
              <q-chip
                v-if="selectedSubmission?.id"
                dense
                color="blue-grey-2"
                text-color="blue-grey-9"
                class="text-weight-bold font-monospace">
                ارسال: #{{ selectedSubmission.id }}
              </q-chip>
              <q-btn
                v-close-popup
                flat
                round
                dense
                icon="close"
                color="grey-7" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- ۲. بدنه اسکرول‌پذیر دیالوگ -->
        <q-card-section
          v-if="selectedSubmission"
          class="col scroll q-pa-md q-gutter-y-md">
          <!-- کارت مشخصات دانش‌آموز و تایم‌لاین وضعیت -->
          <div class="bg-grey-1 q-pa-md rounded-borders border">
            <div class="row q-col-gutter-md">
              <!-- نام دانش‌آموز -->
              <div class="col-12 col-md-3">
                <div class="bg-white q-pa-sm rounded-borders border full-height">
                  <div class="text-caption text-grey-6 flex items-center">
                    <q-icon
                      name="person"
                      size="14px"
                      class="q-mr-xs text-primary" />
                    دانش‌آموز
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-blue-grey-10 q-mt-xs ellipsis">
                    {{ (selectedSubmission.student?.first_name ? `${selectedSubmission.student.first_name} ${selectedSubmission.student.last_name || ''}` : null) || selectedSubmission.student_id || '-' }}
                  </div>
                </div>
              </div>

              <!-- زمان ارسال -->
              <div class="col-12 col-md-3">
                <div class="bg-white q-pa-sm rounded-borders border full-height">
                  <div class="text-caption text-grey-6 flex items-center">
                    <q-icon
                      name="send"
                      size="14px"
                      class="q-mr-xs text-teal" />
                    زمان ارسال
                  </div>
                  <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs font-monospace">
                    {{ formatDateTime(selectedSubmission.submitted_at) }}
                  </div>
                </div>
              </div>

              <!-- مشاهده دانش‌آموز -->
              <div class="col-12 col-md-3">
                <div class="bg-white q-pa-sm rounded-borders border full-height">
                  <div class="text-caption text-grey-6 flex items-center">
                    <q-icon
                      name="visibility"
                      size="14px"
                      class="q-mr-xs text-info" />
                    مشاهده دانش‌آموز
                  </div>
                  <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs font-monospace">
                    {{ formatDateTime(selectedSubmission.student_seen_at) }}
                  </div>
                </div>
              </div>

              <!-- مشاهده معلم -->
              <div class="col-12 col-md-3">
                <div class="bg-white q-pa-sm rounded-borders border full-height">
                  <div class="text-caption text-grey-6 flex items-center">
                    <q-icon
                      name="done_all"
                      size="14px"
                      class="q-mr-xs text-positive" />
                    مشاهده معلم
                  </div>
                  <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs font-monospace">
                    {{ formatDateTime(selectedSubmission.operator_seen_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- بخش محتوای ارسالی دانش‌آموز -->
          <div class="bg-grey-1 q-pa-md rounded-borders border">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-caption text-weight-bold text-grey-8 flex items-center">
                <q-icon
                  name="description"
                  color="primary"
                  size="16px"
                  class="q-mr-xs" />
                پاسخ و محتوای ارسالی دانش‌آموز:
              </div>
              <q-badge
                v-if="submissionContentForEditor"
                color="blue-1"
                text-color="primary"
                class="q-px-sm">
                آماده بررسی
              </q-badge>
            </div>

            <div class="bg-white rounded-borders border q-pa-sm min-height-box">
              <content-editor
                v-if="submissionContentForEditor"
                v-model:value="submissionContentForEditor"
                :editable="false" />
              <div
                v-else
                class="column items-center justify-center q-pa-lg text-grey-5">
                <q-icon
                  name="cloud_off"
                  size="36px" />
                <div class="text-caption q-mt-xs">محتوایی برای این پاسخ ثبت نشده است.</div>
              </div>
            </div>
          </div>

          <!-- بخش ثبت بازخورد و نظر دبیر -->
          <div class="bg-grey-1 q-pa-md rounded-borders border">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
              <q-icon
                name="rate_review"
                color="orange-9"
                size="16px"
                class="q-mr-xs" />
              بازخورد و یادداشت ارزیابی برای دانش‌آموز:
            </div>

            <q-input
              v-model="feedbackForm.feedback"
              label="متن بازخورد یا راهنمایی آموزشی را اینجا بنویسید..."
              outlined
              dense
              bg-color="white"
              type="textarea"
              rows="3"
              counter
              maxlength="1000"
              placeholder="مثال: آفرین علی، راه‌حل مسئله دوم عالی بود اما دقت کن که فرمول را کامل بنویسی." />
          </div>
        </q-card-section>

        <q-separator />

        <!-- ۳. فوتر و دکمه‌های عملیات -->
        <q-card-actions
          align="right"
          class="bg-blue-grey-1 q-px-md q-py-sm col-auto">
          <q-btn
            v-close-popup
            flat
            label="انصراف و بستن"
            color="grey-8"
            class="q-px-md" />
          <q-btn
            unelevated
            color="primary"
            icon="check_circle"
            label="ثبت و ارسال بازخورد"
            class="q-px-md shadow-1"
            :loading="saving"
            @click="saveFeedback" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog v-model="pdfDialog">
      <q-card style="width: 90vw; height: 90vh; display: flex; flex-direction: column">
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
            style="width: 100%; height: 100%; border: none" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'
import ContentEditor from 'src/components/ContentEditor.vue'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()
const dateManager = useDate()

const homeworkData = ref<Partial<HomeworkType>>({})
const loading = ref(false)
const saving = ref(false)
const submissionDetailDialog = ref(false)
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
    {
      name: 'submitted_at',
      label: 'زمان ارسال',
      align: 'center' as const,
      field: 'submitted_at',
      sortable: true
    },
    {
      name: 'student_seen_at',
      label: 'مشاهده توسط دانش‌آموز',
      align: 'center' as const,
      field: 'student_seen_at'
    },
    {
      name: 'operator_seen_at',
      label: 'مشاهده توسط معلم',
      align: 'center' as const,
      field: 'operator_seen_at'
    },
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
const selectedSubmission = ref<HomeworkSubmissionType | null>(null)

const submissionContentForEditor = computed(() => {
  if (!selectedSubmission.value?.content) return null
  if (Array.isArray(selectedSubmission.value.content)) {
    return selectedSubmission.value.content[0] || null
  }
  return selectedSubmission.value.content
})

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '-'
  return (
    dateManager.miladiToShamsi(value, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || value
  )
}

function openPdfPreview (path: string) {
  pdfPreviewSrc.value = `storage/${path}`
  pdfDialog.value = true
}

function openSubmissionDetailDialog (submission: HomeworkSubmissionType) {
  selectedSubmission.value = submission
  currentFeedbackSubmissionId.value = submission.id
  feedbackForm.value.feedback = submission.feedback
  submissionDetailDialog.value = true
  homeworkApi.markAsSeen(submission.id).catch(() => {})
}

async function saveFeedback () {
  if (!currentFeedbackSubmissionId.value) return
  saving.value = true
  try {
    await homeworkApi.sendFeedback(currentFeedbackSubmissionId.value, feedbackForm.value.feedback)
    $q.notify({ type: 'positive', message: 'بازخورد ثبت شد' })
    submissionDetailDialog.value = false
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

<style lang="scss" scoped></style>
