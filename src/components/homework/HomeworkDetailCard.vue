<template>
  <q-card
    flat
    bordered
    class="rounded-borders q-mb-md">
    <!-- هدر کارت -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <q-avatar
            size="32px"
            color="primary"
            text-color="white"
            icon="assignment"
            class="q-mr-sm shadow-1" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
              جزئیات و مشخصات تکلیف
            </div>
            <div class="text-caption text-grey-7">
              تنظیمات زمان‌بندی تحویل، مخاطبان، درس و پیوست‌های آموزشی
            </div>
          </div>
        </div>

        <q-chip
          v-if="homework.id"
          dense
          color="blue-grey-2"
          text-color="blue-grey-9"
          class="text-weight-bold q-px-sm font-monospace">
          شناسه: #{{ homework.id }}
        </q-chip>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md q-gutter-y-md">
      <!-- ۱. مشخصات عمومی و زمان‌بندی -->
      <div class="bg-grey-1 q-pa-md rounded-borders border">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-md flex items-center">
          <q-icon
            name="info"
            color="primary"
            size="16px"
            class="q-mr-xs" />
          مشخصات اصلی و زمان‌بندی:
        </div>

        <div class="row q-col-gutter-md">
          <!-- عنوان تکلیف -->
          <div class="col-12 col-md-6">
            <q-input
              v-if="editable"
              v-model="homework.title"
              label="عنوان تکلیف *"
              outlined
              dense
              bg-color="white"
              maxlength="255"
              :rules="[(val) => !!val || 'عنوان تکلیف الزامی است']" />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border">
              <div class="text-caption text-grey-6">عنوان تکلیف</div>
              <div class="text-subtitle2 text-weight-bold text-blue-grey-10">
                {{ homework.title || '-' }}
              </div>
            </div>
          </div>

          <!-- انتخاب ترم -->
          <div class="col-12 col-md-3">
            <form-builder-select-term
              v-if="editable"
              v-model:value="homework.term_id"
              :school-id="schoolId"
              label="ترم تحصیلی *"
              outlined
              dense
              bg-color="white" />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border">
              <div class="text-caption text-grey-6">ترم تحصیلی</div>
              <div class="text-body2 text-weight-bold text-blue-grey-9">
                {{ homework.term?.name || '-' }}
              </div>
            </div>
          </div>

          <!-- موعد تحویل -->
          <div class="col-12 col-md-3">
            <form-builder-date
              v-if="editable"
              v-model:value="homework.due_date"
              label="موعد تحویل *"
              outlined
              dense
              bg-color="white" />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border">
              <div class="text-caption text-grey-6">موعد تحویل</div>
              <div class="text-body2 text-weight-bold text-primary flex items-center q-mt-xs">
                <q-icon
                  name="event"
                  size="16px"
                  class="q-mr-xs" />
                {{ dueDateFormatted }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ۲. انتساب و اطلاعات آموزشی (پایه‌ها، کلاس‌ها، درس مربوطه) -->
      <div class="bg-grey-1 q-pa-md rounded-borders border">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-md flex items-center">
          <q-icon
            name="school"
            color="primary"
            size="16px"
            class="q-mr-xs" />
          انتساب و ساختار آموزشی (پایه‌ها، کلاس‌ها و درس):
        </div>

        <div class="row q-col-gutter-md">
          <!-- انتخاب پایه‌ها -->
          <div class="col-12 col-md-4">
            <form-builder-select-academic-level
              v-if="editable"
              v-model:value="levelIds"
              label="پایه‌های تحصیلی"
              :school-id="schoolId"
              bg-color="white"
              clearable
              multiple
              use-chips />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6 q-mb-xs">پایه‌های تحصیلی:</div>
              <div class="row items-center q-gutter-xs">
                <q-chip
                  v-for="level in homework.academic_levels"
                  :key="level.id"
                  dense
                  color="blue-1"
                  text-color="blue-9"
                  size="sm">
                  {{ level.name || '-' }}
                </q-chip>
                <span
                  v-if="!homework.academic_levels?.length"
                  class="text-caption text-grey-6">هیچ پایه‌ای انتخاب نشده است.</span>
              </div>
            </div>
          </div>

          <!-- انتخاب کلاس‌ها (فیلتر شده براساس پایه‌ها) -->
          <div class="col-12 col-md-4">
            <form-builder-select-school-class
              v-if="editable"
              v-model:value="classIds"
              label="کلاس‌های مشمول"
              :school-id="schoolId"
              :level-id="levelIds"
              outlined
              dense
              bg-color="white"
              clearable
              multiple
              use-chips />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6 q-mb-xs">کلاس‌های مشمول:</div>
              <div class="row items-center q-gutter-xs">
                <q-chip
                  v-for="cls in homework.classes"
                  :key="cls.id"
                  dense
                  color="teal-1"
                  text-color="teal-9"
                  size="sm">
                  {{ cls.name || '-' }}
                </q-chip>
                <span
                  v-if="!homework.classes?.length"
                  class="text-caption text-grey-6">هیچ کلاسی انتخاب نشده است.</span>
              </div>
            </div>
          </div>

          <!-- انتخاب درس (فیلتر شده براساس پایه‌ها و کلاس‌ها) -->
          <div class="col-12 col-md-4">
            <form-builder-select-lesson
              v-if="editable"
              v-model:value="homework.lesson_id"
              :school-id="schoolId"
              :level-id="levelIds"
              :class-id="classIds"
              label="درس مربوطه *"
              outlined
              dense
              bg-color="white" />
            <div
              v-else
              class="bg-white q-pa-sm rounded-borders border full-height">
              <div class="text-caption text-grey-6">درس مربوطه:</div>
              <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                {{ homework.lesson?.name || '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ۳. شرح و دستورالعمل تکلیف -->
      <div
        v-if="editable || homework.description"
        class="bg-grey-1 q-pa-md rounded-borders border">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-md flex items-center">
          <q-icon
            name="description"
            color="primary"
            size="16px"
            class="q-mr-xs" />
          توضیحات و دستورالعمل تکلیف:
        </div>

        <q-input
          v-if="editable"
          v-model="homework.description"
          label="توضیحات و دستورالعمل برای دانش‌آموزان"
          type="textarea"
          outlined
          dense
          bg-color="white"
          rows="3" />
        <div
          v-else
          class="bg-white q-pa-md rounded-borders border text-body2 text-grey-9 text-justify"
          style="white-space: pre-wrap">
          {{ homework.description }}
        </div>
      </div>

      <!-- ۴. پیوست‌ها و ضمیمه‌ها -->
      <div class="bg-grey-1 q-pa-md rounded-borders border">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-caption text-weight-bold text-grey-8 flex items-center">
            <q-icon
              name="attach_file"
              color="primary"
              size="16px"
              class="q-mr-xs" />
            پیوست‌ها و فایل‌های ضمیمه ({{ attachmentsList.length }} مورد):
          </div>

          <q-btn
            v-if="editable"
            dense
            unelevated
            color="primary"
            icon="add"
            label="افزودن پیوست جدید"
            size="sm"
            class="q-px-sm"
            @click="addAttachment" />
        </div>

        <!-- لیست پیوست‌ها -->
        <q-list
          v-if="attachmentsList.length"
          bordered
          separator
          class="bg-white rounded-borders">
          <q-item
            v-for="(att, index) in attachmentsList"
            :key="att.id || `new-${index}`"
            class="q-py-md">
            <q-item-section
              avatar
              top>
              <q-avatar
                size="28px"
                color="blue-1"
                text-color="primary"
                class="text-weight-bold text-caption">
                {{ index + 1 }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <content-editor
                v-model:value="att.content"
                :editable="editable" />
            </q-item-section>

            <q-item-section
              v-if="editable"
              side
              top>
              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                color="negative"
                size="sm"
                @click="removeAttachment(index)">
                <q-tooltip>حذف این پیوست</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- وضعیت عدم وجود پیوست -->
        <div
          v-else
          class="column items-center justify-center q-pa-lg text-grey-6 bg-white rounded-borders border">
          <q-icon
            name="attachment"
            size="36px"
            color="grey-4" />
          <div class="text-caption q-mt-xs">پیوستی برای این تکلیف ثبت نشده است.</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import ContentEditor from 'src/components/ContentEditor.vue'
import type { HomeworkType, HomeworkAttachmentType } from 'src/repositories/homework'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'

defineProps<{
  editable?: boolean;
  schoolId?: number;
}>()
const homework = defineModel<Partial<HomeworkType>>('homework')
const dateManager = useDate()

const dueDateFormatted = computed(() => {
  const raw = homework.value.due_date
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || raw
})

const levelIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value.academic_level_ids)) {
      return homework.value.academic_level_ids
    }

    return (
      homework.value.academic_levels
        ?.map((level) => level.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    homework.value.academic_level_ids = value || []
  }
})

const classIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value.class_ids)) {
      return homework.value.class_ids
    }

    return (
      homework.value.classes
        ?.map((schoolClass) => schoolClass.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    homework.value.class_ids = value || []
  }
})

const attachmentsList = computed<HomeworkAttachmentType[]>({
  get: () => homework.value.attachments || [],
  set: (val) => {
    homework.value.attachments = val
  }
})

function addAttachment () {
  if (!homework.value.attachments) {
    homework.value.attachments = []
  }
  homework.value.attachments.push({
    id: null,
    homework_id: null,
    content: null,
    sort_order: homework.value.attachments.length,
    created_at: null,
    updated_at: null
  })
}

function removeAttachment (index: number) {
  if (!homework.value.attachments) return
  homework.value.attachments.splice(index, 1)
}
</script>

<style scoped></style>
