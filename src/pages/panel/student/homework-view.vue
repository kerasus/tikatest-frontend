<template>
  <q-page class="q-pa-md">
    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <div v-else-if="homeworkData">
      <q-card>
        <q-card-section>
          <div class="text-h4">{{ homeworkData.title }}</div>
          <div class="text-grey-7 q-mt-sm">
            کلاس: {{ schoolClassName }}
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
            v-if="homeworkData.attachments?.length"
            class="q-mt-sm">
            <div class="text-subtitle2">ضمیمه‌ها:</div>
            <div
              v-for="(att, index) in homeworkData.attachments"
              :key="att.id || index"
              class="q-mt-sm">
              <div class="text-subtitle2">ضمیمه {{ index + 1 }}:</div>
              <content-editor
                :value="att.content"
                :editable="false" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">ارسال / ویرایش تکلیف</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-subtitle2 q-mb-sm">پاسخ تکلیف</div>
                <content-editor
                  v-model:value="submissionContent"
                  :editable="canSubmit" />
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="ثبت تکلیف"
                :loading="submitting"
                :disable="!canSubmit" />
              <q-btn
                flat
                label="انصراف"
                :to="{ name: 'Student.Homework.List' }"
                class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-card
        v-if="submission"
        class="q-mt-md">
        <q-card-section>
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">پاسخ قبلی</div>
            </div>
            <div class="col-auto">
              <q-btn
                flat
                dense
                color="primary"
                icon="visibility"
                @click="openSubmissionDetailDialog(submission)" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2">پاسخ ارسال شده:</div>
              <content-editor
                :value="submissionContentDisplay"
                :editable="false" />
            </div>
            <div
              v-if="submission.submitted_at"
              class="col-12">
              <div class="text-subtitle2">زمان ارسال:</div>
              <p>{{ formatDate(submission.submitted_at) }}</p>
            </div>
            <div
              v-if="submission.feedback"
              class="col-12">
              <div class="text-subtitle2">بازخورد معلم:</div>
              <q-card
                class="q-mt-sm"
                flat
                bordered>
                <q-card-section class="q-py-sm">
                  <p class="q-ma-none">{{ submission.feedback }}</p>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-dialog v-model="submissionDetailDialog">
        <q-card style="min-width: 500px; max-width: 700px">
          <q-card-section class="row items-center">
            <div class="col">
              <div class="text-h6">جزئیات ارسال</div>
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
          <q-card-section v-if="selectedSubmission">
            <div class="q-gutter-md">
              <div class="row">
                <div class="col-5 text-subtitle2">زمان ارسال:</div>
                <div class="col-7">{{ formatDate(selectedSubmission.submitted_at || '') }}</div>
              </div>
              <div class="row">
                <div class="col-5 text-subtitle2">بازخورد معلم:</div>
                <div class="col-7">{{ selectedSubmission.feedback || '-' }}</div>
              </div>
              <div class="row">
                <div class="col-12 text-subtitle2">محتوای ارسالی:</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <content-editor
                    :value="submissionContentDisplay"
                    :editable="false" />
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model="feedbackForm.feedback"
                    label="ثبت سؤال یا نظر"
                    outlined
                    type="textarea"
                    rows="3" />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="انصراف"
              @click="submissionDetailDialog = false" />
            <q-btn
              color="primary"
              label="ارسال"
              :loading="submitting"
              @click="sendFeedback" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'
import ContentEditor from 'src/components/ContentEditor.vue'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()

const homeworkData = ref<Partial<HomeworkType>>({})
const submission = ref<Partial<HomeworkSubmissionType> | null>(null)
const loading = ref(true)
const submitting = ref(false)
const submissionContent = ref<{ type: 'text' | 'image' | 'pdf'; body?: string; path?: string; file?: File } | null>(null)

const schoolClassName = computed(() => (homeworkData.value as any).schoolClass?.name || '-')
const canSubmit = computed(() => {
  const due = (homeworkData.value as any).due_date
  if (!due) return true
  const dueDate = new Date(due)
  const today = new Date()
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return todayOnly <= dueDateOnly
})
const submissionFile = computed(() => {
  const sub = submission.value as any
  if (!sub?.content) return null
  const content = Array.isArray(sub.content) ? sub.content : [sub.content].filter(Boolean)
  const fileItem = content.find((item: any) => item.type === 'pdf' || item.type === 'image')
  return fileItem?.path || null
})
const submissionContentDisplay = computed(() => {
  const sub = submission.value as any
  if (!sub?.content) return null
  const content = Array.isArray(sub.content) ? sub.content : [sub.content].filter(Boolean)
  return content[0] || null
})

const submissionDetailDialog = ref(false)
const selectedSubmission = ref<HomeworkSubmissionType | null>(null)
const feedbackForm = ref({ feedback: null as string | null })

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const onSubmit = async () => {
  submitting.value = true
  try {
    const formData = new FormData()

    if (submissionContent.value?.file) {
      formData.append('submission_file', submissionContent.value.file)
    }

    const contentPayload = { ...submissionContent.value }
    delete (contentPayload as any).file
    formData.append('content', JSON.stringify(contentPayload))

    await homeworkApi.submitHomework(Number(route.params.id), formData)

    $q.notify({
      type: 'positive',
      message: 'تکلیف با موفقیت ارسال شد.'
    })

    await loadHomework()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'خطا در ارسال تکلیف.'
    })
  } finally {
    submitting.value = false
  }
}

function openSubmissionDetailDialog (sub: Partial<HomeworkSubmissionType>) {
  selectedSubmission.value = sub as HomeworkSubmissionType
  feedbackForm.value.feedback = sub.feedback || null
  submissionDetailDialog.value = true
}

async function sendFeedback () {
  if (!selectedSubmission.value?.id) return
  submitting.value = true
  try {
    await homeworkApi.sendFeedback(selectedSubmission.value.id, feedbackForm.value.feedback)
    $q.notify({ type: 'positive', message: 'پیام شما ارسال شد.' })
    submissionDetailDialog.value = false
    feedbackForm.value.feedback = null
    await loadHomework()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'خطا در ارسال پیام.'
    })
  } finally {
    submitting.value = false
  }
}

const loadHomework = async () => {
  loading.value = true
  try {
    const data = await homeworkApi.viewHomework(Number(route.params.id))
    homeworkData.value = data.homework
    submission.value = data.submission

    if (data.submission?.content) {
      const content = Array.isArray(data.submission.content)
        ? data.submission.content
        : [data.submission.content].filter(Boolean)
      const first = content[0] || null
      submissionContent.value = first ? { ...first, file: null } : null
    } else {
      submissionContent.value = null
    }
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
