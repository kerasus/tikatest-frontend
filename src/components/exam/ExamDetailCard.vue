<template>
  <q-card
    flat
    bordered
    class="rounded-borders q-mb-md">
    <!-- ۱. هدر کارت با اکشن‌ها -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between q-col-gutter-sm">
        <!-- عنوان و وضعیت آزمون -->
        <div class="row items-center">
          <q-avatar
            size="34px"
            color="primary"
            text-color="white"
            icon="assignment"
            class="q-mr-sm shadow-1" />
          <div>
            <div class="row items-center q-gutter-x-sm">
              <span class="text-subtitle1 text-weight-bold text-blue-grey-10">
                {{ editable ? (exam?.id ? 'ویرایش مشخصات آزمون' : 'تعریف آزمون جدید') : 'اطلاعات کلی آزمون' }}
              </span>
              <q-badge
                v-if="exam?.delivery_mode"
                :color="exam.delivery_mode === 'online' ? 'deep-purple' : 'teal'"
                class="text-weight-bold q-px-sm">
                <q-icon
                  :name="exam.delivery_mode === 'online' ? 'devices' : 'record_voice_over'"
                  size="14px"
                  class="q-mr-xs" />
                {{ exam.delivery_mode === 'online' ? 'آزمون آنلاین' : 'آزمون حضوری' }}
              </q-badge>
            </div>
            <div class="text-caption text-grey-7">
              تنظیمات ساختاری، سطوح مخاطبین، نصاب قبولی و بارم‌بندی
            </div>
          </div>
        </div>

        <!-- دکمه‌های کنترلی هدر -->
        <div class="row items-center q-gutter-sm">
          <!-- دکمه‌های حالت مشاهده -->
          <template v-if="!editable">
            <q-btn
              flat
              dense
              color="grey-8"
              icon="arrow_forward"
              label="بازگشت"
              :to="{ name: examListRouteName }" />

            <q-btn
              v-if="exam?.delivery_mode === 'online'"
              outline
              color="secondary"
              icon="monitor"
              :to="{ name: 'Panel.Exam.Online.Sessions', params: { id: exam?.id } }">
              جلسات آزمون
            </q-btn>

            <q-btn
              unelevated
              color="primary"
              icon="edit"
              label="ویرایش آزمون"
              :to="{ name: editExamRouteName, params: { id: exam?.id } }" />
          </template>

          <!-- دکمه‌های حالت ویرایش -->
          <template v-else>
            <q-btn
              flat
              color="grey-8"
              icon="close"
              label="انصراف"
              :to="exam?.id ? { name: showExamRouteName, params: { id: exam?.id } } : { name: examListRouteName }" />
          </template>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- ۲. محتوای فرم و اطلاعات -->
    <q-card-section class="q-pa-md">
      <div class="row q-col-gutter-md">

        <!-- نام آزمون -->
        <div class="col-12">
          <q-input
            v-if="editable"
            v-model="exam.name"
            label="نام و عنوان آزمون *"
            placeholder="مثال: آزمون جامع ماهانه، مستمر نوبت اول"
            outlined
            dense
            clearable>
            <template #prepend>
              <q-icon
                name="edit_note"
                color="primary" />
            </template>
          </q-input>

          <div
            v-else
            class="bg-grey-1 q-pa-md rounded-borders border row items-center justify-between">
            <div>
              <div class="text-caption text-grey-7">نام و عنوان آزمون:</div>
              <div class="text-h6 text-weight-bold text-primary q-mt-xs">
                {{ exam.name || 'بدون نام' }}
              </div>
            </div>
            <div
              v-if="exam.created_by"
              class="text-left">
              <div class="text-caption text-grey-6">ایجاد کننده:</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <span class="text-caption text-weight-bold text-grey-8">
                  {{ `${exam.created_by?.first_name || ''} ${exam.created_by?.last_name || ''}` }}
                </span>
                <q-chip
                  v-if="exam.created_by?.username"
                  dense
                  color="blue-grey-1"
                  text-color="blue-grey-8"
                  class="text-caption">
                  @{{ exam.created_by?.username }}
                </q-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- باکس گروه‌بندی ۱: مخاطبان و ساختار آموزشی (پایه‌ها، کلاس‌ها، درس، ترم) -->
        <div class="col-12">
          <q-card
            flat
            bordered
            class="rounded-borders bg-grey-1">
            <q-card-section class="q-py-xs bg-grey-2 text-weight-bold text-grey-8 text-caption row items-center">
              <q-icon
                name="groups"
                color="primary"
                size="18px"
                class="q-mr-xs" />
              مخاطبان و مشخصات آموزشی
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-md">
              <div class="row q-col-gutter-md">
                <!-- پایه‌ها -->
                <div class="col-12 col-md-3">
                  <form-builder-select-academic-level
                    v-if="editable"
                    v-model:value="levelIds"
                    label="پایه‌های تحصیلی"
                    :school-id="schoolId"
                    outlined
                    dense
                    clearable
                    multiple
                    use-chips />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border full-height">
                    <div class="text-caption text-grey-6 flex items-center q-mb-xs">
                      <q-icon
                        name="school"
                        size="14px"
                        class="q-mr-xs text-primary" />
                      پایه‌های تحصیلی:
                    </div>
                    <div class="row q-gutter-xs">
                      <q-chip
                        v-for="level in exam.academic_levels"
                        :key="level.id"
                        color="primary"
                        text-color="white"
                        dense
                        size="sm">
                        {{ level.name || '-' }}
                      </q-chip>
                      <span
                        v-if="!exam.academic_levels?.length"
                        class="text-caption text-grey-5">
                        انتخاب نشده
                      </span>
                    </div>
                  </div>
                </div>

                <!-- کلاس‌ها -->
                <div class="col-12 col-md-3">
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
                    class="bg-white q-pa-sm rounded-borders border full-height">
                    <div class="text-caption text-grey-6 flex items-center q-mb-xs">
                      <q-icon
                        name="meeting_room"
                        size="14px"
                        class="q-mr-xs text-secondary" />
                      کلاس‌های مشمول:
                    </div>
                    <div class="row q-gutter-xs">
                      <q-chip
                        v-for="cls in exam.classes"
                        :key="cls.id"
                        color="secondary"
                        text-color="white"
                        dense
                        size="sm">
                        {{ cls.name || '-' }}
                      </q-chip>
                      <span
                        v-if="!exam.classes?.length"
                        class="text-caption text-grey-5">
                        انتخاب نشده
                      </span>
                    </div>
                  </div>
                </div>

                <!-- درس -->
                <div class="col-12 col-md-3">
                  <form-builder-select-lesson
                    v-if="editable"
                    v-model:value="exam.lesson_id"
                    :school-id="schoolId"
                    :level-id="levelIds"
                    :class-id="classIds"
                    :disable="!!hasAnyBookletLesson"
                    :placeholder="hasAnyBookletLesson ? 'قفل به دلیل دفترچه‌ها' : 'انتخاب درس...'"
                    label="درس آزمون"
                    outlined
                    dense
                    clearable
                    multiple
                    use-chips />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border full-height">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="menu_book"
                        size="14px"
                        class="q-mr-xs text-teal" />
                      درس آزمون:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ exam.lesson?.name || 'عمومی / جامع (بدون درس تکی)' }}
                    </div>
                  </div>
                </div>

                <!-- ترم -->
                <div class="col-12 col-md-3">
                  <form-builder-select-term
                    v-if="editable"
                    v-model:value="exam.term_id"
                    :school-id="schoolId"
                    active-only
                    label="دوره / ترم تحصیلی"
                    outlined
                    dense
                    clearable />
                  <div
                    v-else
                    class="bg-white q-pa-sm rounded-borders border full-height">
                    <div class="text-caption text-grey-6 flex items-center">
                      <q-icon
                        name="date_range"
                        size="14px"
                        class="q-mr-xs text-brown" />
                      دوره / ترم:
                    </div>
                    <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
                      {{ exam.term?.name || '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- دسته‌بندی و مقادیر نمرات -->
        <div class="col-12 col-md-4">
          <form-builder-select-exam-category
            v-if="editable"
            v-model:value="exam.exam_category_id"
            :school-id="schoolId"
            label="دسته‌بندی آزمون"
            outlined
            dense
            clearable />
          <div
            v-else
            class="bg-white q-pa-sm rounded-borders border full-height">
            <div class="text-caption text-grey-6 flex items-center">
              <q-icon
                name="category"
                size="14px"
                class="q-mr-xs text-accent" />
              دسته‌بندی:
            </div>
            <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
              {{ exam.category?.title || '-' }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <q-input
            v-if="editable"
            v-model.number="exam.min_passing_score"
            label="حداقل نمره قبولی"
            outlined
            dense
            type="number"
            step="0.01">
            <template #prepend>
              <q-icon
                name="check_circle_outline"
                color="positive" />
            </template>
          </q-input>
          <div
            v-else
            class="bg-white q-pa-sm rounded-borders border full-height">
            <div class="text-caption text-grey-6 flex items-center">
              <q-icon
                name="check_circle_outline"
                size="14px"
                class="q-mr-xs text-positive" />
              حداقل نمره قبولی:
            </div>
            <div class="text-body2 text-weight-bold text-positive q-mt-xs">
              {{ exam.min_passing_score ?? '-' }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <q-input
            v-if="editable"
            v-model.number="exam.max_score"
            label="سقف / حداکثر نمره"
            outlined
            dense
            type="number"
            step="0.01">
            <template #prepend>
              <q-icon
                name="military_tech"
                color="warning" />
            </template>
          </q-input>
          <div
            v-else
            class="bg-white q-pa-sm rounded-borders border full-height">
            <div class="text-caption text-grey-6 flex items-center">
              <q-icon
                name="military_tech"
                size="14px"
                class="q-mr-xs text-warning" />
              سقف نمره:
            </div>
            <div class="text-body2 text-weight-bold text-blue-grey-9 q-mt-xs">
              {{ exam.max_score ?? '-' }}
            </div>
          </div>
        </div>

        <!-- توضیحات آزمون -->
        <div
          v-if="editable || exam.description"
          class="col-12">
          <q-input
            v-if="editable"
            v-model="exam.description"
            label="توضیحات و راهنمای شرکت در آزمون"
            placeholder="هرگونه نکته، پیش‌نیاز یا توصیه برای شرکت‌کنندگان..."
            outlined
            dense
            type="textarea"
            rows="3" />
          <div
            v-else
            class="bg-grey-1 q-pa-md rounded-borders border">
            <div class="text-caption text-grey-7 flex items-center q-mb-xs">
              <q-icon
                name="info"
                size="16px"
                class="q-mr-xs text-primary" />
              توضیحات و نکات آزمون:
            </div>
            <div
              class="text-body2 text-grey-9"
              style="white-space: pre-wrap;">
              {{ exam.description }}
            </div>
          </div>
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExamType } from 'src/repositories/exam'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectExamCategory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'
import FormBuilderSelectTerm from 'components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectSchoolClass from 'components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel
  from 'components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

defineProps<{
  editable?: boolean;
  schoolId?: number;
}>()
const exam = defineModel<ExamType>('exam')
const examListRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.List'
  }

  return 'Panel.Exam.InPerson.List'
})

const editExamRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.Edit'
  }

  return 'Panel.Exam.InPerson.Edit'
})

const showExamRouteName = computed(() => {
  if (exam.value?.delivery_mode === 'online') {
    return 'Panel.Exam.Online.Show'
  }

  return 'Panel.Exam.InPerson.Show'
})

const levelIds = computed({
  get: () => exam.value.academic_levels?.map((l: any) => l.id) || [],
  set: (val: any[]) => {
    exam.value.academic_level_ids = val || []
    exam.value.academic_levels = (val || []).map((id) => ({ id })) as any[]
  }
})

const classIds = computed({
  get: () => exam.value.classes?.map((c: any) => c.id) || [],
  set: (val: any[]) => {
    exam.value.class_ids = val || []
    exam.value.classes = (val || []).map((id) => ({ id })) as any[]
  }
})

const hasAnyBookletLesson = computed(() =>
  (exam.value.online_exam_detail?.booklets || []).some((b) => !!b?.lesson_id)
)
</script>

<style scoped></style>
