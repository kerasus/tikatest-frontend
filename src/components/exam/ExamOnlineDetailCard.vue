<template>
  <exam-detail-card
    :exam="exam"
    :editable="editable"
    :lesson-options="lessonOptions"
    :category-options="categoryOptions" />

  <q-card
    v-if="exam.online_exam_detail"
    class="q-mb-md">
    <q-card-section>
      <div class="text-h6">جزئیات آزمون آنلاین</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <form-builder-date-time
            v-if="editable"
            v-model:value="exam.online_exam_detail.starts_at"
            label="زمان شروع" />
          <div v-else>
            <div class="text-subtitle2">زمان شروع:</div>
            <div class="text-body1">{{ startsAtFormatted }}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-date-time
            v-if="editable"
            v-model:value="exam.online_exam_detail.ends_at"
            label="زمان پایان" />
          <div v-else>
            <div class="text-subtitle2">زمان پایان:</div>
            <div class="text-body1">{{ endsAtFormatted }}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-if="editable"
            v-model.number="exam.online_exam_detail.time_limit_minutes"
            label="زمان محدودیت (دقیقه)"
            outlined
            dense
            type="number"
            min="1" />
          <div v-else>
            <div class="text-subtitle2">زمان محدودیت (دقیقه):</div>
            <div class="text-body1">
              {{ exam.online_exam_detail.time_limit_minutes ?? '-' }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-date-time
            v-if="editable"
            v-model:value="exam.online_exam_detail.visible_at"
            label="قابل مشاهده از"
            outlined
            dense />
          <div v-else>
            <div class="text-subtitle2">قابل مشاهده از:</div>
            <div class="text-body1">{{ visibleAtFormatted }}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-date-time
            v-if="editable"
            v-model:value="exam.online_exam_detail.answers_visible_at"
            label="پاسخ‌ها قابل مشاهده از" />
          <div v-else>
            <div class="text-subtitle2">پاسخ‌ها قابل مشاهده از:</div>
            <div class="text-body1">{{ answersVisibleAtFormatted }}</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card
    v-if="exam.online_exam_detail"
    class="q-mb-md">
    <q-card-section>
      <div class="text-h6">اطلاعات بیشتر آزمون</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-level
                v-if="editable"
                v-model:value="levelIds"
                label="پایه‌ها"
                outlined
                clearable
                multiple
                use-chips />
              <div v-else>
                <div class="text-subtitle2">پایه های انتخابی:</div>
                <q-chip
                  v-for="level in exam.academic_levels"
                  :key="level.id"
                  color="primary"
                  text-color="white"
                  dense>
                  {{ level.name || '-' }}
                </q-chip>
                <span
                  v-if="!exam.academic_levels?.length"
                  class="text-grey">هیچ سطح آموزشی انتخاب نشده است.</span>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <form-builder-select-school-class
                v-if="editable"
                v-model:value="classIds"
                label="کلاس‌ها"
                outlined
                clearable
                multiple
                use-chips />
              <div v-else>
                <div class="text-subtitle2">کلاس های انتخابی:</div>
                <q-chip
                  v-for="cls in exam.classes"
                  :key="cls.id"
                  color="secondary"
                  text-color="white"
                  dense>
                  {{ cls.name || '-' }}
                </q-chip>
                <span
                  v-if="!exam.classes?.length"
                  class="text-grey">هیچ کلاسی انتخاب نشده است.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-md-6 col-12">
              <q-card class="inside">
                <q-card-section>
                  <div class="text-subtitle2">تصویر آزمون</div>
                </q-card-section>
                <q-card-section>
                  <content-editor
                    v-if="exam.online_exam_detail"
                    v-model:value="exam.online_exam_detail.content"
                    :editable="editable" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6 col-12">
              <q-card class="inside">
                <q-card-section>
                  <div class="text-subtitle2">تصویر پاسخنامه</div>
                </q-card-section>
                <q-card-section>
                  <content-editor
                    v-if="exam.online_exam_detail"
                    v-model:value="exam.online_exam_detail.solution"
                    :editable="editable" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-12">
          <q-card class="inside">
            <q-card-section>
              <div class="text-subtitle2">پاسخنامه کلیدی آزمون</div>
            </q-card-section>
            <exam-answer-key-editor
              v-model:value="exam.answer_keys"
              :readonly="!editable" />
          </q-card>
        </div>

        <div class="col-12">
          <q-card class="inside">
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <div class="col">
                  <div class="text-subtitle2">دفترچه‌ها</div>
                </div>
                <div
                  v-if="editable && exam.online_exam_detail"
                  class="col-auto">
                  <q-btn
                    color="primary"
                    label="افزودن دفترچه"
                    @click="addBooklet" />
                </div>
              </div>
            </q-card-section>
            <q-list
              v-if="exam.online_exam_detail?.booklets?.length"
              bordered
              separator>
              <q-item
                v-for="(booklet, index) in exam.online_exam_detail.booklets"
                :key="index"
                class="q-py-sm">
                <q-item-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-6">
                      <form-builder-select-lesson
                        v-if="editable"
                        v-model:value="booklet.lesson_id"
                        label="درس"
                        outlined
                        clearable />
                      <span
                        v-else
                        class="text-body1">
                        درس:
                        {{ booklet.lesson?.name || booklet.lesson_id || '-' }}
                      </span>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input
                        v-if="editable"
                        v-model="booklet.title"
                        label="عنوان *"
                        outlined
                        dense
                        :rules="[(val) => !!val || 'عنوان الزامی است']" />
                      <span
                        v-else
                        class="text-body1">
                        عنوان دفترچه:
                        {{ booklet.title || '-' }}
                      </span>
                    </div>
                    <div class="col-6">
                      <q-input
                        v-if="editable"
                        v-model.number="booklet.from_question"
                        label="از سوال"
                        outlined
                        dense
                        type="number"
                        min="1" />
                      <div v-else>
                        <div class="text-subtitle2">از سوال:</div>
                        <div class="text-body1">{{ booklet.from_question ?? '-' }}</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <q-input
                        v-if="editable"
                        v-model.number="booklet.to_question"
                        label="تا سوال"
                        outlined
                        dense
                        type="number"
                        min="1" />
                      <div v-else>
                        <div class="text-subtitle2">تا سوال:</div>
                        <div class="text-body1">{{ booklet.to_question ?? '-' }}</div>
                      </div>
                    </div>
                  </div>
                </q-item-section>
                <q-item-section
                  v-if="editable"
                  side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="removeBooklet(index)" />
                </q-item-section>
              </q-item>
            </q-list>
            <q-card-section v-else>
              <div class="text-center q-pa-md text-grey">دفترچه‌ای ثبت نشده است.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import { ExamType } from 'src/repositories/exam'
import ExamDetailCard from 'src/components/exam/ExamDetailCard.vue'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import ExamAnswerKeyEditor from 'src/components/exam/ExamAnswerKeyEditor.vue'
import ContentEditor from 'src/components/ContentEditor.vue'
import { ExamCategoryType } from 'src/repositories/examCategory'
import { LessonType } from 'src/repositories/lesson'

const exam = defineModel<ExamType>('exam')
const props = defineProps<{
  editable?: boolean;
  lessonOptions?: LessonType[];
  categoryOptions?: ExamCategoryType[];
}>()

const dateManager = useDate()

const startsAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.starts_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const endsAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.ends_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const visibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const answersVisibleAtFormatted = computed(() => {
  const raw = exam.value.online_exam_detail?.answers_visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const classIds = computed({
  get: () => exam.value.classes?.map((c: any) => c.id) || [],
  set: (val: any[]) => {
    exam.value.class_ids = val || []
    exam.value.classes = (val || []).map((id) => ({ id })) as any[]
  }
})

const levelIds = computed({
  get: () => exam.value.academic_levels?.map((l: any) => l.id) || [],
  set: (val: any[]) => {
    exam.value.academic_level_ids = val || []
    exam.value.academic_levels = (val || []).map((id) => ({ id })) as any[]
  }
})

function addBooklet () {
  if (!exam.value.online_exam_detail) return
  exam.value.online_exam_detail.booklets = exam.value.online_exam_detail.booklets || []
  exam.value.online_exam_detail.booklets.push({
    id: null,
    online_exam_id: null,
    lesson_id: null,
    title: '',
    from_question: null,
    to_question: null,
    booklet_scores: null,
    created_by: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    lesson: null
  })
}

function removeBooklet (index: number) {
  if (!exam.value.online_exam_detail?.booklets) return
  exam.value.online_exam_detail.booklets.splice(index, 1)
}
</script>

<style scoped></style>
