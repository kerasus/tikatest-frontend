<template>
  <div class="homework-detail-page">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ homeworkData.title }}</div>
        <div class="text-grey-7 q-mt-sm">
          درس: {{ homeworkData.lesson?.name || '-' }} |
          کلاس: {{ homeworkData.schoolClass?.name || '-' }}
        </div>

        <div class="q-mt-sm">
          <q-btn
            color="primary"
            label="ویرایش"
            size="sm"
            :to="{ name: 'Panel.Homework.Edit', params: { id: route.params.id } }" />
        </div>
        <div
          v-if="homeworkData.description"
          class="q-mt-sm">
          <div class="text-subtitle2">توضیحات:</div>
          <p>{{ homeworkData.description }}</p>
        </div>
        <div
          v-if="homeworkData.due_date"
          class="q-mt-sm">
          <div class="text-subtitle2">موعد تحویل:</div>
          <p>{{ formatDate(homeworkData.due_date) }}</p>
        </div>

        <div
          v-if="homeworkData.academic_levels?.length"
          class="q-mt-sm">
          <div class="text-subtitle2">پایه‌های انتخابی:</div>
          <div class="q-gutter-xs">
            <q-chip
              v-for="level in homeworkData.academic_levels"
              :key="level.id"
              color="primary"
              text-color="white"
              dense>
              {{ level.name || '-' }}
            </q-chip>
          </div>
        </div>

        <div
          v-if="homeworkData.classes?.length"
          class="q-mt-sm">
          <div class="text-subtitle2">کلاس‌های انتخابی:</div>
          <div class="q-gutter-xs">
            <q-chip
              v-for="cls in homeworkData.classes"
              :key="cls.id"
              color="secondary"
              text-color="white"
              dense>
              {{ cls.name || '-' }}
            </q-chip>
          </div>
        </div>

        <div
          v-if="homeworkData.attachments?.length"
          class="q-mt-sm">
          <div class="text-subtitle2">پیوست‌ها:</div>
          <div
            v-for="att in homeworkData.attachments"
            :key="att.id"
            class="q-mt-sm">
            <template v-if="att.content?.type === 'text'">
              <div class="text-body2">
                {{ att.content.body || '-' }}
              </div>
            </template>
            <template v-else-if="att.content?.type === 'image' && att.content?.path">
              <img
                :src="`storage/${att.content.path}`"
                alt="تصویر پیوست"
                style="max-width: 100%; max-height: 200px; display: block">
            </template>
            <template v-else-if="att.content?.type === 'pdf' && att.content?.path">
              <q-btn
                flat
                dense
                color="primary"
                icon="picture_as_pdf"
                label="پیش‌نمایش PDF"
                @click="openPdfPreview(att.content.path)" />
            </template>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">لیست ارسال‌ها</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="submissions"
          :columns="submissionColumns"
          row-key="id"
          :loading="loading"
          flat
          bordered>
          <template #body-cell-student_name="props">
            <q-td :props="props">
              {{ props.row.student?.full_name || props.row.student_id || '-' }}
            </q-td>
          </template>
          <template #body-cell-submitted_at="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          <template #body-cell-student_seen_at="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          <template #body-cell-operator_seen_at="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
          <template #body-cell-content="props">
            <q-td :props="props">
              <template v-if="props.value?.type === 'text'">
                <div class="text-body2">
                  {{ props.value.body?.substring(0, 80) || '-' }}
                </div>
              </template>
              <template v-else-if="props.value?.type === 'image' && props.value?.path">
                <img
                  :src="`storage/${props.value.path}`"
                  alt="پیش‌نمایش"
                  style="max-width: 80px; max-height: 60px; display: block" />
              </template>
              <template v-else-if="props.value?.type === 'pdf' && props.value?.path">
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="picture_as_pdf"
                  label="مشاهده"
                  @click="openPdfPreview(props.value.path)" />
              </template>
              <span v-else>-</span>
            </q-td>
          </template>
          <template #body-cell-grade="props">
            <q-td :props="props">
              {{ props.value != null ? props.value : '-' }}
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                dense
                color="primary"
                icon="edit"
                @click="openGradeDialog(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="gradeDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">ثبت نمره</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-md">
            <q-input
              v-model.number="gradeForm.grade"
              label="نمره"
              outlined
              type="number"
              step="0.01" />
            <q-input
              v-model="gradeForm.feedback"
              label="بازخورد"
              outlined
              type="textarea" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="انصراف"
            @click="gradeDialog = false" />
          <q-btn
            color="primary"
            label="ذخیره"
            :loading="saving"
            @click="saveGrade" />
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
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()

const homeworkData = ref<Partial<HomeworkType>>({})
const submissions = ref<HomeworkSubmissionType[]>([])
const loading = ref(false)
const saving = ref(false)
const gradeDialog = ref(false)
const pdfDialog = ref(false)
const pdfPreviewSrc = ref('')

const gradeForm = ref({
  grade: null as number | null,
  feedback: null as string | null
})
const currentGradeSubmissionId = ref<number | null>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const submissionColumns = [
  { name: 'student_name', label: 'دانش‌آموز', align: 'right' as const, field: 'student.full_name' },
  { name: 'submitted_at', label: 'زمان ارسال', align: 'center' as const, field: 'submitted_at' },
  { name: 'student_seen_at', label: 'مشاهده توسط دانش‌آموز', align: 'center' as const, field: 'student_seen_at' },
  { name: 'operator_seen_at', label: 'مشاهده توسط معلم', align: 'center' as const, field: 'operator_seen_at' },
  { name: 'content', label: 'محتوای ارسالی', align: 'center' as const, field: 'content' },
  { name: 'grade', label: 'نمره', align: 'center' as const, field: 'grade' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

function openPdfPreview (path: string) {
  pdfPreviewSrc.value = `storage/${path}`
  pdfDialog.value = true
}

function openGradeDialog (submission: HomeworkSubmissionType) {
  currentGradeSubmissionId.value = submission.id
  gradeForm.value.grade = submission.grade
  gradeForm.value.feedback = submission.feedback
  gradeDialog.value = true
}

async function saveGrade () {
  if (!currentGradeSubmissionId.value) return
  saving.value = true
  try {
    await homeworkApi.getAxiosInstanceWithToken().put(`/homework-submissions/${currentGradeSubmissionId.value}`, {
      grade: gradeForm.value.grade,
      feedback: gradeForm.value.feedback,
      operator_seen_at: new Date().toISOString()
    })
    $q.notify({ type: 'positive', message: 'نمره ثبت شد' })
    gradeDialog.value = false
    currentGradeSubmissionId.value = null
    await loadHomework()
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت نمره' })
  } finally {
    saving.value = false
  }
}

async function loadHomework () {
  loading.value = true
  try {
    homeworkData.value = await homeworkApi.get(Number(route.params.id))
    const submissionsRes = await homeworkApi.getSubmissions(Number(route.params.id))
    submissions.value = submissionsRes.submissions || submissionsRes.data || []
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
