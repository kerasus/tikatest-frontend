<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ارسال تکلیف</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="بازگشت"
          :to="{ name: 'Student.Homework.List' }" />
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
      <q-card>
        <q-card-section>
          <div class="text-h5">{{ homeworkData.title }}</div>
          <div class="text-grey-7 q-mt-sm">
            درس: {{ homeworkData.lesson?.name || '-' }} |
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
            <div class="text-subtitle2">مهلت تحویل:</div>
            <p>{{ formatDate(homeworkData.due_date) }}</p>
          </div>

          <div
            v-if="homeworkData.attachments?.length"
            class="q-mt-sm">
            <div class="text-subtitle2">ضمیمه‌های تکلیف:</div>
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
          <div class="text-h6">ارسال پاسخ</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-subtitle2 q-mb-sm">انتخاب فایل پاسخ</div>
                <content-editor
                  v-model:value="content"
                  :editable="true" />
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="positive"
                label="ثبت ارسال"
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
              <div class="text-subtitle2">زمان ارسال:</div>
              <p>{{ formatDateTime(submission.submitted_at) }}</p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import type { HomeworkType, HomeworkOwnerType } from 'src/repositories/homework'
import ContentEditor from 'src/components/ContentEditor.vue'
import { useDate } from 'src/composables/Date'

const homeworkApi = new HomeworkAPI()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const dateManager = useDate()

const homeworkData = ref<Partial<HomeworkType>>({})
const submission = ref<Partial<HomeworkOwnerType> | null>(null)
const loading = ref(true)
const submitting = ref(false)
const content = ref<{ type: 'text' | 'image' | 'pdf'; body?: string; path?: string } | null>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  return dateManager.miladiToShamsi(dateString, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || dateString
}

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return dateManager.miladiToShamsi(dateString, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || dateString || '-'
}

const loadHomework = async () => {
  loading.value = true
  try {
    const data = await homeworkApi.viewHomework(Number(route.params.id))
    homeworkData.value = data.homework
    submission.value = data.submission || null
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

const onSubmit = async () => {
  submitting.value = true
  try {
    await homeworkApi.submitHomework(Number(route.params.id), {
      content: content.value
    })

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

onMounted(() => {
  loadHomework()
})
</script>

<style lang="scss" scoped>
</style>
