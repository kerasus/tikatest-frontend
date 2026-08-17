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
            کلاس: {{ homeworkData.schoolClass?.name || '-' }}
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
              <a
                v-if="att.content?.path"
                :href="`storage/${att.content.path}`"
                target="_blank"
                class="text-primary">دانلود فایل</a>
              <span v-else>-</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card
        v-if="!submission"
        class="q-mt-md">
        <q-card-section>
          <div class="text-h6">ارسال تکلیف</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-file
                  v-model="file"
                  label="فایل تکلیف"
                  outlined
                  accept=".pdf,image/*"
                  @update:model-value="onFileChange" />
              </div>
              <div
                v-if="previewUrl"
                class="col-12">
                <div class="q-mt-md">
                  <img
                    v-if="!isPdf"
                    :src="previewUrl"
                    style="max-width: 100%; max-height: 300px;">
                  <iframe
                    v-else
                    :src="previewUrl"
                    style="width: 100%; height: 400px; border: none;" />
                </div>
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="ثبت تکلیف"
                :loading="submitting" />
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
        v-else
        class="q-mt-md">
        <q-card-section>
          <div class="text-h6">تکلیف ارسال شده</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2">فایل ارسال شده:</div>
              <div v-if="submission.submission_file">
                <a
                  :href="submission.submission_file"
                  target="_blank"
                  class="text-primary">مشاهده فایل</a>
              </div>
              <div v-else>فایلی ارسال نشده است.</div>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const $q = useQuasar()

const homeworkData = ref<Partial<HomeworkType>>({})
const submission = ref<Partial<HomeworkSubmissionType> | null>(null)
const loading = ref(true)
const submitting = ref(false)
const file = ref<File | null>(null)
const previewUrl = ref('')
const isPdf = ref(false)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const onFileChange = (files: File[] | null) => {
  if (files && files.length > 0) {
    const selectedFile = files[0]
    file.value = selectedFile
    previewUrl.value = URL.createObjectURL(selectedFile)
    isPdf.value = selectedFile.type === 'application/pdf'
  } else {
    file.value = null
    previewUrl.value = ''
    isPdf.value = false
  }
}

const onSubmit = async () => {
  if (!file.value) {
    $q.notify({
      type: 'negative',
      message: 'لطفاً فایل را انتخاب کنید.'
    })
    return
  }

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.value)

    // For now, we'll just pass the file name as submission_file
    // In a real implementation, you would upload the file first
    const fileName = `homework_${Date.now()}_${file.value.name}`

    await homeworkApi.submitHomework(Number(route.params.id), {
      submission_file: `/uploads/homework/${fileName}`
    })

    $q.notify({
      type: 'positive',
      message: 'تکلیف با موفقیت ارسال شد.'
    })

    // Reload data
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
