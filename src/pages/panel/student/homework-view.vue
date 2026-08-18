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
          <div class="text-h6">پاسخ قبلی</div>
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
          </div>
        </q-card-section>
      </q-card>
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
  return new Date(due + 'T00:00:00') >= new Date(new Date().toLocaleDateString('en-CA'))
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
