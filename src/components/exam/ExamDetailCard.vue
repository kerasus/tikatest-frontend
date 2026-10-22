<template>
  <div class="exam-master-card q-mb-md">
    <!-- ۱. هدر شیشه‌ای گرادیانتی همراه با اکشن‌ها -->
    <div class="exam-master-header q-pa-md">
      <div class="exam-master-header__glow" />
      <div class="row items-center justify-between q-col-gutter-sm relative-position">
        <!-- عنوان و وضعیت آزمون -->
        <div class="row items-center no-wrap">
          <div class="exam-header-icon-bubble">
            <q-icon
              name="assignment"
              size="22px"
              class="text-white" />
          </div>
          <div class="q-ml-sm">
            <div class="row items-center q-gutter-x-sm">
              <span class="exam-master-header__title">
                {{ editable ? (exam?.id ? 'ویرایش مشخصات آزمون' : 'تعریف آزمون جدید') : 'اطلاعات کلی آزمون' }}
              </span>
              <span
                v-if="exam?.delivery_mode"
                class="delivery-mode-pill"
                :class="exam.delivery_mode === 'online' ? 'delivery-mode-pill--online' : 'delivery-mode-pill--in-person'">
                <q-icon
                  :name="exam.delivery_mode === 'online' ? 'devices' : 'record_voice_over'"
                  size="13px"
                  class="q-mr-xs" />
                {{ exam.delivery_mode === 'online' ? 'آزمون آنلاین' : 'آزمون حضوری' }}
              </span>
            </div>
            <div class="exam-master-header__subtitle">
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
              class="action-btn-back q-px-sm"
              :to="{ name: examListRouteName }" />

            <q-btn
              v-if="exam?.delivery_mode === 'online'"
              outline
              color="secondary"
              icon="monitor"
              class="action-btn-sessions"
              :to="{ name: 'Panel.Exam.Online.Sessions', params: { id: exam?.id } }">
              جلسات آزمون
            </q-btn>

            <q-btn
              unelevated
              color="primary"
              icon="edit"
              label="ویرایش آزمون"
              class="action-btn-edit"
              :to="{ name: editExamRouteName, params: { id: exam?.id } }" />
          </template>

          <!-- دکمه‌های حالت ویرایش -->
          <template v-else>
            <q-btn
              flat
              color="negative"
              icon="close"
              label="انصراف"
              class="action-btn-cancel"
              :to="exam?.id ? { name: showExamRouteName, params: { id: exam?.id } } : { name: examListRouteName }" />
          </template>
        </div>
      </div>
    </div>

    <!-- ۲. محتوای فرم و اطلاعات -->
    <div class="exam-master-body q-pa-md">
      <div class="row q-col-gutter-md">

        <!-- نام آزمون و اطلاعات سازنده -->
        <div class="col-12">
          <div
            v-if="editable"
            class="crystal-input-wrap">
            <q-input
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
          </div>

          <div
            v-else
            class="exam-hero-showcase">
            <div class="exam-hero-showcase__content">
              <div class="text-caption text-grey-6 font-weight-bold">نام و عنوان آزمون:</div>
              <div class="exam-hero-showcase__title">
                {{ exam.name || 'بدون نام' }}
              </div>
            </div>
            <div
              v-if="exam.created_by"
              class="creator-pill-box">
              <div class="text-caption text-grey-6">ایجاد کننده:</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <span class="creator-name">
                  {{ `${exam.created_by?.first_name || ''} ${exam.created_by?.last_name || ''}` }}
                </span>
                <span
                  v-if="exam.created_by?.username"
                  class="creator-username ltr">
                  @{{ exam.created_by?.username }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- باکس گروه‌بندی ۱: مخاطبان و ساختار آموزشی (پایه‌ها، کلاس‌ها، درس، ترم) -->
        <div class="col-12">
          <div class="structure-panel">
            <div class="structure-panel__header">
              <div class="row items-center">
                <span class="structure-panel__indicator" />
                <q-icon
                  name="groups"
                  color="indigo-7"
                  size="18px"
                  class="q-mr-xs" />
                <span class="structure-panel__title">مخاطبان و مشخصات آموزشی</span>
              </div>
              <span class="structure-panel__badge">تخصیص ساختار</span>
            </div>

            <div class="structure-panel__body">
              <div class="row q-col-gutter-md">
                <!-- پایه‌ها -->
                <div class="col-12 col-md-3">
                  <div class="crystal-box-field">
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
                      class="field-display-card">
                      <div class="field-display-card__head">
                        <q-icon
                          name="school"
                          size="14px"
                          class="text-primary" />
                        <span>پایه‌های تحصیلی:</span>
                      </div>
                      <div class="row q-gutter-xs q-mt-xs">
                        <q-chip
                          v-for="level in exam.academic_levels"
                          :key="level.id"
                          color="primary"
                          text-color="white"
                          dense
                          size="sm"
                          class="fancy-chip">
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
                </div>

                <!-- کلاس‌ها -->
                <div class="col-12 col-md-3">
                  <div class="crystal-box-field">
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
                      class="field-display-card">
                      <div class="field-display-card__head">
                        <q-icon
                          name="meeting_room"
                          size="14px"
                          class="text-secondary" />
                        <span>کلاس‌های مشمول:</span>
                      </div>
                      <div class="row q-gutter-xs q-mt-xs">
                        <q-chip
                          v-for="cls in exam.classes"
                          :key="cls.id"
                          color="secondary"
                          text-color="white"
                          dense
                          size="sm"
                          class="fancy-chip">
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
                </div>

                <!-- درس -->
                <div class="col-12 col-md-3">
                  <div class="crystal-box-field">
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
                      class="field-display-card">
                      <div class="field-display-card__head">
                        <q-icon
                          name="menu_book"
                          size="14px"
                          class="text-teal" />
                        <span>درس آزمون:</span>
                      </div>
                      <div class="field-display-card__val text-teal-9">
                        {{ exam.lesson?.name || 'عمومی / جامع (بدون درس تکی)' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ترم -->
                <div class="col-12 col-md-3">
                  <div class="crystal-box-field">
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
                      class="field-display-card">
                      <div class="field-display-card__head">
                        <q-icon
                          name="date_range"
                          size="14px"
                          class="text-brown-7" />
                        <span>دوره / ترم:</span>
                      </div>
                      <div class="field-display-card__val text-grey-9">
                        {{ exam.term?.name || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- دسته‌بندی و مقادیر نمرات (متریک‌های کلیدی در ۳ کارت مجزا) -->
        <div class="col-12 col-md-4">
          <div class="metric-card metric-card--purple">
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
              class="metric-stat">
              <div class="metric-stat__head">
                <q-icon
                  name="category"
                  size="16px"
                  class="text-purple-7" />
                <span>دسته‌بندی آزمون:</span>
              </div>
              <div class="metric-stat__val text-purple-10">
                {{ exam.category?.title || '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="metric-card metric-card--emerald">
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
              class="metric-stat">
              <div class="metric-stat__head">
                <q-icon
                  name="verified"
                  size="16px"
                  class="text-positive" />
                <span>حداقل نمره قبولی:</span>
              </div>
              <div class="metric-stat__val text-positive">
                {{ exam.min_passing_score ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="metric-card metric-card--amber">
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
              class="metric-stat">
              <div class="metric-stat__head">
                <q-icon
                  name="military_tech"
                  size="16px"
                  class="text-amber-8" />
                <span>سقف / بارم کل:</span>
              </div>
              <div class="metric-stat__val text-amber-9">
                {{ exam.max_score ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- توضیحات آزمون -->
        <div
          v-if="editable || exam.description"
          class="col-12">
          <div
            v-if="editable"
            class="crystal-input-wrap">
            <q-input
              v-model="exam.description"
              label="توضیحات و راهنمای شرکت در آزمون"
              placeholder="هرگونه نکته، پیش‌نیاز یا توصیه برای شرکت‌کنندگان..."
              outlined
              dense
              type="textarea"
              rows="3" />
          </div>
          <div
            v-else
            class="exam-description-panel">
            <div class="exam-description-panel__head">
              <q-icon
                name="lightbulb"
                size="17px"
                class="text-amber-8" />
              <span>توضیحات و نکات آزمون</span>
            </div>
            <div class="exam-description-panel__body">
              {{ exam.description }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
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

<style scoped lang="scss">
/* محفظه اصلی کارت اطلاعات آزمون */
.exam-master-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 12px 32px -10px rgba(99, 102, 241, 0.08), 0 4px 12px rgba(0, 0, 0, 0.02);
}

/* هدر شیشه‌ای و گرادیانتی خوش‌رنگ */
.exam-master-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #ffffff 100%);
  border-bottom: 1px solid #e0e7ff;

  &__glow {
    position: absolute;
    top: -50px;
    right: -40px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  &__title {
    font-size: 15.5px;
    font-weight: 900;
    color: #1e1b4b;
    letter-spacing: -0.3px;
  }

  &__subtitle {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 600;
    margin-top: 3px;
  }
}

.exam-header-icon-bubble {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35);
}

/* بج حالت آزمون (آنلاین / حضوری) */
.delivery-mode-pill {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;

  &--online {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(109, 40, 217, 0.25);
  }

  &--in-person {
    background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
  }
}

/* دکمه‌های اکشن هدر */
.action-btn-back {
  border-radius: 9px;
  font-weight: 700;
}

.action-btn-sessions {
  border-radius: 10px;
  font-weight: 800;
  border-width: 1.5px;
}

.action-btn-edit {
  border-radius: 10px;
  font-weight: 800;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.action-btn-cancel {
  border-radius: 9px;
  font-weight: 700;
}

/* ویترین عنوان آزمون در حالت نمایش (Hero Showcase) */
.exam-hero-showcase {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1.5px solid #e9d5ff;
  box-shadow: 0 6px 18px -6px rgba(147, 51, 234, 0.12);

  &__title {
    font-size: 18px;
    font-weight: 900;
    color: #581c87;
    margin-top: 4px;
    letter-spacing: -0.4px;
  }
}

.creator-pill-box {
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid #e9d5ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.creator-name {
  font-size: 12px;
  font-weight: 800;
  color: #374151;
}

.creator-username {
  font-size: 11px;
  font-weight: 700;
  background: #f3f4f6;
  color: #4b5563;
  padding: 2px 6px;
  border-radius: 6px;
}

/* پنل ساختار و مخاطبان آموزشی */
.structure-panel {
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.7) 0%, rgba(245, 243, 255, 0.5) 100%);
  border: 1.5px solid #c7d2fe;
  overflow: hidden;
  box-shadow: 0 6px 20px -8px rgba(99, 102, 241, 0.12);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(224, 231, 255, 0.7);
    border-bottom: 1px solid rgba(199, 210, 254, 0.8);
  }

  &__indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4f46e5;
    margin-left: 6px;
  }

  &__title {
    font-size: 12.5px;
    font-weight: 800;
    color: #1e1b4b;
  }

  &__badge {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(79, 70, 229, 0.15);
    color: #4338ca;
  }

  &__body {
    padding: 14px;
  }
}

/* کارت‌های فیلد نمایشی داخل پنل ساختار */
.field-display-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px -3px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__head {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  }

  &__val {
    font-size: 13px;
    font-weight: 800;
    margin-top: 5px;
  }
}

.fancy-chip {
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* کارت‌های متریک سه‌گانه (دسته‌بندی، حداقل قبولی، سقف نمره) */
.metric-card {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  padding: 12px;
  box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.05);

  &--purple {
    background: linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(243, 232, 255, 0.6) 100%);
    border: 1.5px solid #d8b4fe;
  }

  &--emerald {
    background: linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.6) 100%);
    border: 1.5px solid #86efac;
  }

  &--amber {
    background: linear-gradient(135deg, rgba(254, 252, 232, 0.95) 0%, rgba(254, 243, 199, 0.6) 100%);
    border: 1.5px solid #fde68a;
  }
}

.metric-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px;

  &__head {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 700;
    color: #475569;
  }

  &__val {
    font-size: 17px;
    font-weight: 900;
    margin-top: 4px;
    letter-spacing: -0.5px;
  }
}

/* پنل توضیحات و نکات */
.exam-description-panel {
  border-radius: 14px;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  padding: 12px 16px;

  &__head {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 800;
    color: #475569;
    margin-bottom: 6px;
  }

  &__body {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.7;
    white-space: pre-wrap;
    font-weight: 500;
  }
}

.crystal-input-wrap {
  background: #ffffff;
  border-radius: 12px;
}
</style>
