<template>
  <div
    v-if="loading"
    class="text-center q-pa-lg">
    <q-spinner
      color="primary"
      size="100px" />
  </div>

  <div v-else-if="homeworkData">

    <!-- کارت اطلاعات و جزئیات تکلیف -->
    <q-card>
      <!-- هدر کارت: عنوان + برچسب وضعیت مهلت تحویل -->
      <q-card-section class="bg-grey-1 q-py-md">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="col-12 col-sm-auto row items-center no-wrap">
            <q-avatar
              icon="assignment"
              color="primary"
              text-color="white"
              size="42px"
              class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold text-primary">
                {{ homeworkData.title }}
              </div>
              <div
                v-if="homeworkData.lesson"
                class="text-caption text-grey-7 row items-center q-gutter-x-xs q-mt-xs">
                <q-icon
                  name="menu_book"
                  size="16px" />
                <span>درس: {{ homeworkData.lesson?.name || 'عمومی' }}</span>
              </div>
            </div>
          </div>

          <!-- وضعیت مهلت ارسال -->
          <div class="col-12 col-sm-auto">
            <!-- موعد تحویل -->
            <div class="col-12 col-md-6 row items-center justify-start justify-md-end">
              <q-icon
                name="event"
                color="orange-9"
                size="20px"
                class="q-mr-xs" />
              <span class="text-weight-bold text-grey-8 q-mr-xs">موعد تحویل:</span>
              <span class="text-weight-bolder text-orange-10">
                {{ formatDate(homeworkData.due_date || '') }}
              </span>
            </div>
            <q-chip
              :color="canSubmit ? 'positive' : 'negative'"
              text-color="white"
              :icon="canSubmit ? 'schedule' : 'event_busy'"
              size="md"
              class="text-weight-medium">
              {{ canSubmit ? 'مهلت ارسال باقی‌مانده' : 'مهلت تحویل به پایان رسیده' }}
            </q-chip>
          </div>
        </div>
      </q-card-section>

      <!-- بخش توضیحات تکلیف -->
      <q-card-section
        v-if="homeworkData.description"
        class="q-pt-none">
        <q-banner
          dense
          rounded
          class="bg-blue-1 text-blue-10 q-pa-md">
          <template #avatar>
            <q-icon
              name="info"
              color="primary" />
          </template>
          <div class="text-subtitle2 text-weight-bold q-mb-xs">توضیحات و راهنما:</div>
          <div
            class="text-body2"
            style="white-space: pre-line;">
            {{ homeworkData.description }}
          </div>
        </q-banner>
      </q-card-section>

      <!-- بخش ضمیمه‌ها (فایل‌ها و پیوست‌های معلم) -->
      <template v-if="homeworkData.attachments?.length">
        <q-separator inset />
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-icon
              name="attach_file"
              color="primary"
              size="22px"
              class="q-mr-xs" />
            <div class="text-subtitle1 text-weight-bold text-grey-9">
              پیوست‌ها و فایل‌های راهنما ({{ homeworkData.attachments.length }})
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div
              v-for="(att, index) in homeworkData.attachments"
              :key="att.id || index"
              class="col-md-3 col-12">
              <q-card class="inside">
                <q-card-section class="q-py-xs bg-grey-4 row items-center justify-between">
                  <div class="text-caption text-weight-bold text-grey-8">
                    ضمیمه شماره {{ index + 1 }}
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="flex justify-center align-center">
                  <content-editor
                    :value="att.content"
                    :editable="false" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </template>
    </q-card>

    <!-- کارت فرم ثبت و ارسال پاسخ تکلیف -->
    <q-card
      flat
      bordered
      class="q-mt-md rounded-borders">
      <!-- هدر کارت: عنوان همراه با آیکون و نشانگر وضعیت مجاز بودن ارسال -->
      <q-card-section class="bg-grey-1 q-py-sm">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="col-12 col-sm-auto row items-center no-wrap">
            <q-avatar
              :icon="canSubmit ? 'edit_note' : 'lock'"
              :color="canSubmit ? 'primary' : 'grey-6'"
              text-color="white"
              size="38px"
              class="q-mr-md" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9">
                {{ submission ? 'ویرایش و ارسال مجدد پاسخ' : 'ارسال پاسخ تکلیف' }}
              </div>
              <div class="text-caption text-grey-7">
                {{ canSubmit ? 'پاسخ و فایل‌های خود را از طریق ویرایشگر زیر وارد کنید' : 'امکان ثبت یا تغییر پاسخ به پایان رسیده است' }}
              </div>
            </div>
          </div>

          <!-- بج وضعیت ادیتور -->
          <div class="col-12 col-sm-auto">
            <q-badge
              :color="canSubmit ? 'positive' : 'negative'"
              class="q-py-xs q-px-sm text-caption">
              <q-icon
                :name="canSubmit ? 'check_circle' : 'block'"
                class="q-mr-xs"
                size="14px" />
              {{ canSubmit ? 'آماده دریافت پاسخ' : 'فرم غیرفعال' }}
            </q-badge>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- بنر اخطار در صورتی که مهلت تمام شده باشد -->
      <q-banner
        v-if="!canSubmit"
        dense
        class="bg-amber-1 text-amber-10 q-px-md q-py-sm">
        <template #avatar>
          <q-icon
            name="warning"
            color="warning"
            size="22px" />
        </template>
        <span class="text-caption text-weight-medium">
          مهلت ارسال این تکلیف پایان یافته است؛ ویرایشگر به حالت فقط‌خواندنی تغییر یافته و امکان ثبت وجود ندارد.
        </span>
      </q-banner>

      <!-- بخش بدنه و فرم ارسال -->
      <q-card-section class="q-py-md">
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="row items-center justify-between q-mb-xs">
                <label class="text-subtitle2 text-weight-bold text-grey-8 row items-center">
                  <q-icon
                    name="drive_file_rename_outline"
                    color="primary"
                    size="18px"
                    class="q-mr-xs" />
                  محتوای پاسخ شما:
                </label>
                <span
                  v-if="canSubmit"
                  class="text-caption text-grey-6">
                  (متن، لینک یا تصویر مورد نظر را درج کنید)
                </span>
              </div>

              <!-- ادیتور محتوا داخل کادر مرتب -->
              <div :class="{ 'opacity-70 cursor-not-allowed': !canSubmit }">
                <content-editor
                  v-model:value="submissionContent"
                  :editable="canSubmit" />
              </div>
            </div>
          </div>

          <!-- نوار دکمه‌های اقدام (Actions) -->
          <div class="row items-center justify-end q-gutter-sm q-mt-lg">
            <q-btn
              flat
              rounded
              color="grey-8"
              icon="arrow_forward"
              label="انصراف و بازگشت"
              :to="{ name: 'Student.Homework.List' }"
              class="text-weight-medium" />

            <q-btn
              unelevated
              rounded
              type="submit"
              color="primary"
              icon="cloud_upload"
              :label="submission ? 'بروزرسانی پاسخ' : 'ثبت نهایی تکلیف'"
              :loading="submitting"
              :disable="!canSubmit"
              class="text-weight-bold q-px-md">
              <template #loading>
                <q-spinner-dots class="on-left" />
                در حال ارسال...
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- کارت وضعیت و جزئیات پاسخ ارسال‌شده دانش‌آموز -->
    <q-card
      v-if="submission"
      flat
      bordered
      class="q-mt-md rounded-borders">
      <!-- هدر کارت: تایتل، وضعیت تحویل، زمان و دکمه دیالوگ -->
      <q-card-section class="bg-grey-1 q-py-sm">
        <div class="row items-center justify-between q-col-gutter-sm">
          <div class="col-12 col-sm-auto row items-center no-wrap">
            <q-avatar
              :icon="submission.submitted_at ? 'task_alt' : 'history_toggle_off'"
              :color="submission.submitted_at ? 'positive' : 'warning'"
              text-color="white"
              size="38px"
              class="q-mr-md" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9">
                {{ submission.submitted_at ? 'پاسخ ارسال‌شده شما' : 'پیش‌نویس یا پاسخ قبلی' }}
              </div>
              <div
                v-if="submission.submitted_at"
                class="text-caption text-grey-7 row items-center q-gutter-x-xs q-mt-xs">
                <q-icon
                  name="schedule"
                  size="14px" />
                <span>زمان ثبت نهایی: {{ formatDate(submission.submitted_at) }}</span>
              </div>
            </div>
          </div>

          <!-- وضعیت تصحیح / بازخورد + دکمه دیالوگ جزئیات -->
          <div class="col-12 col-sm-auto row items-center q-gutter-x-sm justify-end">
            <q-badge
              v-if="submission.feedback"
              color="secondary"
              class="q-py-xs q-px-sm text-caption">
              <q-icon
                name="rate_review"
                class="q-mr-xs"
                size="14px" />
              دارای بازخورد معلم
            </q-badge>
            <q-badge
              v-else-if="submission.submitted_at"
              color="grey-6"
              class="q-py-xs q-px-sm text-caption">
              در انتظار بررسی معلم
            </q-badge>

            <q-btn
              flat
              round
              dense
              color="primary"
              icon="open_in_new"
              @click="openSubmissionDetailDialog(submission)">
              <q-tooltip>نمایش در پنجره بازشو و گفت‌وگو</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- بدنه محتوا: پاسخ ارسالی و جعبه بازخورد معلم -->
      <q-card-section class="q-py-md">
        <div class="row q-col-gutter-md">
          <!-- پیش‌نمایش پاسخ ارسال‌شده -->
          <div class="col-12">
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center">
              <q-icon
                name="description"
                color="primary"
                size="18px"
                class="q-mr-xs" />
              محتوای پاسخ:
            </div>
            <q-card
              flat
              bordered
              class="bg-grey-1">
              <q-card-section class="q-pa-sm">
                <content-editor
                  :value="submissionContentDisplay"
                  :editable="false" />
              </q-card-section>
            </q-card>
          </div>

          <!-- باکس ویژه بازخورد و نظر معلم -->
          <div
            v-if="submission.feedback"
            class="col-12">
            <q-banner
              rounded
              class="bg-teal-1 text-teal-10 q-pa-md">
              <template #avatar>
                <q-avatar
                  icon="forum"
                  color="teal"
                  text-color="white"
                  size="36px" />
              </template>
              <div class="text-subtitle2 text-weight-bold q-mb-xs">
                نظر و بازخورد معلم:
              </div>
              <div
                class="text-body2"
                style="white-space: pre-line;">
                {{ submission.feedback }}
              </div>
            </q-banner>
          </div>
        </div>
      </q-card-section>
    </q-card>


    <!-- پنجره پاپ‌آپ مشاهده جزئیات و بازخورد ارسال تکلیف (فقط‌خواندنی) -->
    <q-dialog
      v-model="submissionDetailDialog"
      transition-show="scale"
      transition-hide="scale">
      <q-card style="width: 680px; max-width: 95vw;">
        <!-- هدر دیالوگ -->
        <q-card-section class="bg-grey-1 q-py-sm row items-center justify-between">
          <div class="row items-center no-wrap">
            <q-avatar
              icon="assignment_turned_in"
              color="primary"
              text-color="white"
              size="34px"
              class="q-mr-sm" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-grey-9">جزئیات ارسال تکلیف</div>
              <div class="text-caption text-grey-6">مشاهده سوابق و نظر ثبت‌شده کادر آموزشی</div>
            </div>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            color="grey-7">
            <q-tooltip>بستن</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <!-- بدنه اصلی دیالوگ -->
        <q-card-section
          v-if="selectedSubmission"
          class="q-pa-md scroll"
          style="max-height: 72vh;">
          <div class="column q-gutter-y-md">

            <!-- باکس اطلاعات خلاصه: تاریخ ثبت و وضعیت ارزیابی -->
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      name="event_available"
                      color="primary"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">زمان ارسال تکلیف</q-item-label>
                    <q-item-label class="text-weight-medium text-grey-9">
                      {{ selectedSubmission.submitted_at ? formatDate(selectedSubmission.submitted_at) : 'هنوز ارسال نشده' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12 col-sm-6">
                <q-item
                  dense
                  class="bg-grey-1 rounded-borders q-pa-sm">
                  <q-item-section avatar>
                    <q-icon
                      :name="selectedSubmission.feedback ? 'verified' : 'hourglass_top'"
                      :color="selectedSubmission.feedback ? 'secondary' : 'orange-8'"
                      size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      caption
                      class="text-weight-bold text-grey-7">وضعیت ارزیابی</q-item-label>
                    <q-item-label class="text-weight-medium">
                      <span
                        v-if="selectedSubmission.feedback"
                        class="text-secondary text-weight-bold">تصحیح شده (دارای بازخورد)</span>
                      <span
                        v-else
                        class="text-orange-9">در انتظار بررسی کادر آموزشی</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <!-- بخش نمایش بازخورد معلم یا پیام انتظار -->
            <div>
              <q-banner
                v-if="selectedSubmission.feedback"
                rounded
                class="bg-teal-1 text-teal-10 q-pa-md">
                <template #avatar>
                  <q-avatar
                    icon="rate_review"
                    color="teal"
                    text-color="white"
                    size="34px" />
                </template>
                <div class="text-subtitle2 text-weight-bold q-mb-xs">نظر و ارزیابی کادر مدرسه:</div>
                <div
                  class="text-body2"
                  style="white-space: pre-line;">
                  {{ selectedSubmission.feedback }}
                </div>
              </q-banner>

              <q-banner
                v-else
                rounded
                dense
                class="bg-grey-2 text-grey-8 q-pa-sm">
                <template #avatar>
                  <q-icon
                    name="info"
                    color="grey-7"
                    size="20px" />
                </template>
                <span class="text-caption">
                  هنوز بازخوردی برای این تکلیف ثبت نشده است. پس از بررسی توسط کادر آموزشی در این بخش نمایش داده خواهد شد.
                </span>
              </q-banner>
            </div>

            <!-- بخش پیش‌نمایش پاسخ ارسال‌شده -->
            <div>
              <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-xs row items-center">
                <q-icon
                  name="description"
                  color="primary"
                  size="18px"
                  class="q-mr-xs" />
                پاسخ ارسال‌شده توسط شما:
              </div>
              <q-card
                flat
                bordered
                class="bg-grey-1">
                <q-card-section class="q-pa-sm">
                  <content-editor
                    :value="submissionContentDisplay"
                    :editable="false" />
                </q-card-section>
              </q-card>
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <!-- فوتر دیالوگ (تنها یک دکمه خروج تمیز) -->
        <q-card-actions
          align="right"
          class="bg-grey-1 q-py-xs q-px-sm">
          <q-btn
            v-close-popup
            flat
            rounded
            label="بستن"
            color="primary"
            class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import HomeworkAPI from 'src/repositories/homework'
import ContentEditor from 'src/components/ContentEditor.vue'
import type { HomeworkType, HomeworkSubmissionType } from 'src/repositories/homework'

const $q = useQuasar()
const route = useRoute()
const homeworkApi = new HomeworkAPI()

const homeworkData = ref<Partial<HomeworkType>>({})
const submission = ref<Partial<HomeworkSubmissionType> | null>(null)
const loading = ref(true)
const submitting = ref(false)
const submissionContent = ref<{ type: 'text' | 'image' | 'pdf'; body?: string; path?: string; file?: File } | null>(null)

const schoolClassName = computed(() => {
  const hw = homeworkData.value
  if (hw.classes?.length) {
    return hw.classes.map((c) => c.name).join('، ')
  }
  return (hw as any).schoolClass?.name || '-'
})
const canSubmit = computed(() => {
  const due = (homeworkData.value as any).due_date
  if (!due) return true
  const dueDate = new Date(due)
  const today = new Date()
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return todayOnly <= dueDateOnly
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
