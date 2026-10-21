<template>
  <q-card
    flat
    class="homework-card shadow-3 rounded-borders-xl q-mb-lg bg-white">

    <!-- هدر مدرن و گرادیانی (کاملاً اصلاح‌شده و تمیز) -->
    <div class="header-gradient q-px-lg q-py-lg text-white">
      <div class="row items-center justify-between no-wrap">

        <!-- بخش راست: آیکون + عنوان + توضیحات -->
        <div class="row items-center no-wrap col-grow overflow-hidden">
          <!-- آیکون -->
          <div class="header-icon-box flex flex-center shadow-2 flex-shrink-0">
            <q-icon
              name="auto_stories"
              size="24px" />
          </div>

          <!-- متون هدر -->
          <div class="column q-px-md overflow-hidden">
            <div class="row items-center q-gutter-x-sm no-wrap">
              <span class="text-subtitle1 text-weight-bolder ellipsis">
                جزئیات و مشخصات تکلیف
              </span>
              <span class="badge-fancy text-caption text-weight-bold flex-shrink-0">
                {{ editable ? 'در حال ویرایش' : 'نمایش اطلاعات' }}
              </span>
            </div>

            <div class="text-caption text-white-8 q-mt-xs ellipsis">
              پیکربندی هوشمند زمان تحویل، کلاس‌های هدف و فایل‌های آموزشی
            </div>
          </div>
        </div>

        <!-- بخش چپ: شناسه (ID) -->
        <div
          v-if="homework.id"
          class="id-pill shadow-1 flex items-center flex-shrink-0">
          <span class="text-weight-bold">#{{ homework.id }}</span>
        </div>

      </div>
    </div>


    <!-- بدنه کارت -->
    <q-card-section class="q-pa-md q-pa-sm-lg q-gutter-y-lg bg-surface">
      <!-- ۱. باکس مشخصات اصلی و زمان‌بندی -->
      <div class="fancy-section-card">
        <div class="section-title text-indigo-9 q-mb-md">
          <div class="title-badge bg-indigo-1 text-indigo-8">
            <q-icon
              name="event_note"
              size="18px" />
          </div>
          <span>مشخصات عمومی و زمان‌بندی تحویل</span>
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
              class="custom-input"
              maxlength="255"
              :rules="[(val) => !!val || 'عنوان تکلیف الزامی است']">
              <template #prepend>
                <q-icon
                  name="edit_note"
                  color="indigo-5" />
              </template>
            </q-input>
            <div
              v-else
              class="data-display-box">
              <span class="data-label">عنوان تکلیف</span>
              <div class="text-subtitle1 text-weight-bolder text-grey-9 q-mt-xs">
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
              class="custom-input" />
            <div
              v-else
              class="data-display-box">
              <span class="data-label">ترم تحصیلی</span>
              <div class="text-body2 text-weight-bold text-indigo-9 q-mt-xs flex items-center">
                <q-icon
                  name="calendar_today"
                  size="16px"
                  class="q-mr-xs text-indigo-4" />
                {{ homework.term?.name || '-' }}
              </div>
            </div>
          </div>

          <!-- موعد تحویل -->
          <div class="col-12 col-md-3">
            <form-builder-date-time
              v-if="editable"
              v-model:value="homework.due_date"
              label="موعد تحویل *"
              outlined
              dense
              class="custom-input" />
            <div
              v-else
              class="data-display-box due-date-highlight">
              <span class="data-label text-deep-orange-7">موعد پایان تحویل</span>
              <div class="text-body2 text-weight-bolder text-deep-orange-9 q-mt-xs flex items-center">
                <q-icon
                  name="alarm"
                  size="18px"
                  class="q-mr-xs text-deep-orange-6 pulse-anim" />
                {{ dueDateFormatted }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ۲. انتساب و ساختار آموزشی -->
      <div class="fancy-section-card">
        <div class="section-title text-teal-9 q-mb-md">
          <div class="title-badge bg-teal-1 text-teal-8">
            <q-icon
              name="hub"
              size="18px" />
          </div>
          <span>مخاطبان و ساختار آموزشی (پایه، کلاس و درس)</span>
        </div>

        <div class="row q-col-gutter-md">
          <!-- پایه‌ها -->
          <div class="col-12 col-md-4">
            <form-builder-select-academic-level
              v-if="editable"
              v-model:value="levelIds"
              label="پایه‌های تحصیلی"
              :school-id="schoolId"
              clearable
              multiple
              use-chips />
            <div
              v-else
              class="data-display-box full-height">
              <span class="data-label">پایه‌های تحصیلی مجاز:</span>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-chip
                  v-for="level in homework.academic_levels"
                  :key="level.id"
                  dense
                  class="chip-level"
                  icon="school">
                  {{ level.name || '-' }}
                </q-chip>
                <div
                  v-if="!homework.academic_levels?.length"
                  class="text-caption text-grey-5 flex items-center q-mt-xs">
                  <q-icon
                    name="info"
                    size="14px"
                    class="q-mr-xs" />
                  هیچ پایه‌ای تعیین نشده
                </div>
              </div>
            </div>
          </div>

          <!-- کلاس‌ها -->
          <div class="col-12 col-md-4">
            <form-builder-select-school-class
              v-if="editable"
              v-model:value="classIds"
              label="کلاس‌های مشمول"
              :school-id="schoolId"
              :level-id="levelIds"
              outlined
              dense
              clearable
              multiple
              use-chips />
            <div
              v-else
              class="data-display-box full-height">
              <span class="data-label">کلاس‌های مشمول:</span>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-chip
                  v-for="cls in homework.classes"
                  :key="cls.id"
                  dense
                  class="chip-class"
                  icon="meeting_room">
                  {{ cls.name || '-' }}
                </q-chip>
                <div
                  v-if="!homework.classes?.length"
                  class="text-caption text-grey-5 flex items-center q-mt-xs">
                  <q-icon
                    name="info"
                    size="14px"
                    class="q-mr-xs" />
                  همه کلاس‌های پایه‌های انتخابی
                </div>
              </div>
            </div>
          </div>

          <!-- درس مربوطه -->
          <div class="col-12 col-md-4">
            <form-builder-select-lesson
              v-if="editable"
              v-model:value="homework.lesson_id"
              :school-id="schoolId"
              :level-id="levelIds"
              :class-id="classIds"
              label="درس مربوطه *"
              outlined
              dense />
            <div
              v-else
              class="data-display-box full-height lesson-box">
              <span class="data-label">درس هدف</span>
              <div class="text-subtitle2 text-weight-bolder text-primary q-mt-xs flex items-center">
                <q-icon
                  name="menu_book"
                  size="18px"
                  class="q-mr-xs text-primary" />
                {{ homework.lesson?.name || '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ۳. شرح و دستورالعمل -->
      <div
        v-if="editable || homework.description"
        class="fancy-section-card">
        <div class="section-title text-purple-9 q-mb-md">
          <div class="title-badge bg-purple-1 text-purple-8">
            <q-icon
              name="speaker_notes"
              size="18px" />
          </div>
          <span>توضیحات و راهنمای تکلیف</span>
        </div>

        <q-input
          v-if="editable"
          v-model="homework.description"
          label="راهنما، توضیحات یا یادداشت برای دانش‌آموزان"
          type="textarea"
          outlined
          dense
          rows="3" />
        <div
          v-else
          class="description-container text-body2 text-grey-9 text-justify">
          <q-icon
            name="format_quote"
            size="24px"
            class="quote-icon" />
          <div style="white-space: pre-wrap">
            {{ homework.description }}
          </div>
        </div>
      </div>

      <!-- ۴. پیوست‌ها و ضمیمه‌ها -->
      <div class="fancy-section-card">
        <div class="row items-center justify-between q-mb-md">
          <div class="section-title text-blue-9">
            <div class="title-badge bg-blue-1 text-blue-8">
              <q-icon
                name="cloud_download"
                size="18px" />
            </div>
            <span>ضمائم و فایل‌های تمرین ({{ attachmentsList.length }} فایل)</span>
          </div>

          <q-btn
            v-if="editable"
            unelevated
            class="add-attachment-btn"
            icon="add"
            label="افزودن ضمیمه جدید"
            size="sm"
            @click="addAttachment" />
        </div>

        <!-- لیست پیوست‌ها -->
        <div
          v-if="attachmentsList.length"
          class="q-gutter-y-sm">
          <div
            v-for="(att, index) in attachmentsList"
            :key="att.id || `new-${index}`"
            class="attachment-row row items-center no-wrap q-pa-sm rounded-borders">
            <!-- نشانگر شماره فایل -->
            <div class="attachment-num shadow-1 q-mr-md">
              {{ index + 1 }}
            </div>

            <!-- ادیتور / نمایشگر کانتنت -->
            <div class="col overflow-hidden">
              <content-editor
                v-model:value="att.content"
                :editable="editable" />
            </div>

            <!-- دکمه حذف -->
            <div
              v-if="editable"
              class="q-ml-sm">
              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                color="red-7"
                class="delete-btn"
                size="sm"
                @click="removeAttachment(index)">
                <q-tooltip class="bg-red-8">حذف این فایل</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- وضعیت خالی (Empty State) شاداب‌تر -->
        <div
          v-else
          class="empty-attachment-box column items-center justify-center q-pa-xl text-center">
          <div class="empty-icon-circle q-mb-sm">
            <q-icon
              name="folder_open"
              size="32px"
              color="grey-5" />
          </div>
          <div class="text-subtitle2 text-weight-bold text-grey-7">
            هیچ پیوست یا فایلی آپلود نشده است
          </div>
          <div
            v-if="editable"
            class="text-caption text-grey-5 q-mt-xs">
            برای درک بهتر دانش‌آموزان می‌توانید نمونه تمرین یا PDF بارگذاری کنید.
          </div>
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
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

defineProps<{
  editable?: boolean;
  schoolId?: number;
}>()

const homework = defineModel<Partial<HomeworkType>>('homework', {
  default: () => ({})
})

const dateManager = useDate()

const dueDateFormatted = computed(() => {
  const raw = homework.value?.due_date
  if (!raw) return '-'
  return dateManager.isoToLocalShamsiDateTime(raw) || raw
})

const levelIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value?.academic_level_ids)) {
      return homework.value.academic_level_ids
    }

    return (
      homework.value?.academic_levels
        ?.map((level) => level.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    if (homework.value) {
      homework.value.academic_level_ids = value || []
    }
  }
})

const classIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value?.class_ids)) {
      return homework.value.class_ids
    }

    return (
      homework.value?.classes
        ?.map((schoolClass) => schoolClass.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    if (homework.value) {
      homework.value.class_ids = value || []
    }
  }
})

const attachmentsList = computed<HomeworkAttachmentType[]>({
  get: () => homework.value?.attachments || [],
  set: (val) => {
    if (homework.value) {
      homework.value.attachments = val
    }
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
  if (!homework.value?.attachments) return
  homework.value.attachments.splice(index, 1)
}
</script>

<style scoped lang="scss">
.homework-card {
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden; /* گوشه‌های گرد هدر رو با خود کارت ست می‌کنه */
}

.header-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #9333ea 100%);
  position: relative;
  /* پدینگ داخلی رو دادیم تا متون به هیچ وجه کات نشن */
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    top: -40px;
    left: -40px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

.header-icon-box {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.badge-fancy {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(4px);
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.72rem;
  line-height: 1.5;
}

.id-pill {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.text-white-8 {
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.5;
}






.bg-white-2 {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(4px);
}

.header-desc {
  opacity: 0.85;
  line-height: 1.4;
}

.bg-surface {
  background: #f8fafc;
}

.fancy-section-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #eef2f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05);
    border-color: #e0e7ff;
  }
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 0.88rem;
  font-weight: 800;

  .title-badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }
}

.data-display-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .data-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
  }

  &.due-date-highlight {
    background: #fff7ed;
    border-color: #fed7aa;
  }

  &.lesson-box {
    background: #eef2ff;
    border-color: #c7d2fe;
  }
}

.chip-level {
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  font-weight: 600;
  border: 1px solid #dbeafe;
}

.chip-class {
  background: #ecfdf5 !important;
  color: #047857 !important;
  font-weight: 600;
  border: 1px solid #a7f3d0;
}

.description-container {
  position: relative;
  background: #faf5ff;
  border: 1px dashed #d8b4fe;
  border-radius: 12px;
  padding: 16px 20px;
  line-height: 1.7;

  .quote-icon {
    position: absolute;
    top: 8px;
    left: 12px;
    color: #e9d5ff;
  }
}

.add-attachment-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
}

.attachment-row {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #818cf8;
    background: #fafafa;
  }

  .attachment-num {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: #e0e7ff;
    color: #4338ca;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8rem;
  }

  .delete-btn {
    transition: transform 0.15s ease;
    &:hover {
      transform: scale(1.15);
    }
  }
}

.empty-attachment-box {
  background: #fdfefe;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;

  .empty-icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.pulse-anim {
  animation: gentle-pulse 2s infinite ease-in-out;
}

@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.8;
  }
}
</style>
