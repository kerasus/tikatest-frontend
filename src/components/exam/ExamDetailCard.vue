<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">جزئیات آزمون</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-select
            v-if="editable"
            v-model="exam.exam_category_id"
            :options="categoryOptions"
            option-value="id"
            option-label="title"
            label="دسته‌بندی"
            outlined
            dense
            emit-value
            map-options
            clearable />
          <div
            v-else
            class="text-body1">{{ exam.category?.title || '-' }}</div>
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-if="editable"
            v-model="exam.name"
            label="نام آزمون"
            outlined
            dense />
          <div
            v-else
            class="text-body1">
            {{ exam.name || '-' }}
            <q-chip
              v-if="!editable"
              color="info"
              text-color="white">
              {{ exam.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
            </q-chip>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <form-builder-select-lesson
            v-if="editable"
            v-model:value="exam.lesson_id"
            label="درس"
            outlined
            clearable />
          <div
            v-else
            class="text-body1">{{ exam.lesson?.name || '-' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-if="editable"
            v-model.number="exam.min_passing_score"
            label="حداقل نمره قبولی"
            outlined
            dense
            type="number"
            step="0.01" />
          <div
            v-else
            class="text-body1">{{ exam.min_passing_score ?? '-' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-if="editable"
            v-model.number="exam.max_score"
            label="حداکثر نمره"
            outlined
            dense
            type="number"
            step="0.01" />
          <div
            v-else
            class="text-body1">{{ exam.max_score ?? '-' }}</div>
        </div>
        <div
          v-if="exam.description"
          class="col-12">
          <div class="text-subtitle2">توضیحات:</div>
          <q-input
            v-if="editable"
            v-model="exam.description"
            label="توضیحات"
            outlined
            dense
            type="textarea"
            rows="3" />
          <div
            v-else
            class="text-body1">{{ exam.description }}</div>
        </div>
      </div>

      <template v-if="exam.delivery_mode === 'in_person' && exam.in_person_exam_detail">
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">تاریخ برگزاری:</div>
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.in_person_exam_detail.held_at"
              label="تاریخ برگزاری"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ heldAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">توصیفی:</div>
            <q-toggle
              v-if="editable"
              v-model="exam.in_person_exam_detail.is_descriptive"
              label="توصیفی"
              dense
              color="primary"
              checked-label="بله"
              unchecked-label="خیر" />
            <q-chip
              v-else
              :color="exam.in_person_exam_detail.is_descriptive ? 'primary' : 'grey'"
              text-color="white"
              dense>
              {{ exam.in_person_exam_detail.is_descriptive ? 'بله' : 'خیر' }}
            </q-chip>
          </div>
        </div>
      </template>

      <template v-else-if="exam.delivery_mode === 'online' && exam.online_exam_detail">
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان شروع:</div>
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.online_exam_detail.starts_at"
              label="زمان شروع"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ startsAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان پایان:</div>
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.online_exam_detail.ends_at"
              label="زمان پایان"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ endsAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان محدودیت (دقیقه):</div>
            <q-input
              v-if="editable"
              v-model.number="exam.online_exam_detail.time_limit_minutes"
              label="زمان محدودیت (دقیقه)"
              outlined
              dense
              type="number"
              min="1" />
            <div
              v-else
              class="text-body1">
              {{ exam.online_exam_detail.time_limit_minutes ?? '-' }}
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">قابل مشاهده از:</div>
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.online_exam_detail.visible_at"
              label="قابل مشاهده از"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ visibleAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">پاسخ‌ها قابل مشاهده از:</div>
            <form-builder-date-time
              v-if="editable"
              v-model:value="exam.online_exam_detail.answers_visible_at"
              label="پاسخ‌ها قابل مشاهده از"
              outlined
              dense />
            <div
              v-else
              class="text-body1">{{ answersVisibleAtFormatted }}</div>
          </div>
        </div>
      </template>
    </q-card-section>
  </q-card>
  <q-card
    v-if="!editable"
    class="q-mb-md">
    <q-card-section>
      <div class="text-h6">اطلاعات ایجاد کننده</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">نام و نام خانوادگی:</div>
          <div class="text-body1">
            {{ `${exam.created_by?.first_name} ${exam.created_by?.last_name}` }}
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">نام کاربری:</div>
          <div class="text-body1">{{ exam.created_by?.username || '-' }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-separator />

  <q-card
    v-if="exam.delivery_mode === 'online'"
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
              <div class="text-subtitle2 q-mb-sm">تصویر آزمون</div>
              <content-editor
                v-if="exam.online_exam_detail"
                v-model:value="exam.online_exam_detail.content"
                :editable="editable" />
            </div>
            <div class="col-md-6 col-12">
              <div class="text-subtitle2 q-mb-sm">تصویر پاسخنامه</div>
              <content-editor
                v-if="exam.online_exam_detail"
                v-model:value="exam.online_exam_detail.solution"
                :editable="editable" />
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">پاسخنامه کلیدی آزمون (بابل شیت)</div>
          <exam-answer-key-editor
            v-model:value="exam.answer_keys"
            :readonly="!editable" />
        </div>

        <div class="col-12">
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
                size="sm"
                @click="addBooklet" />
            </div>
          </div>
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
                    <span
                      v-else
                      class="text-caption">از سوال {{ booklet.from_question ?? '-' }}</span>
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
                    <span
                      v-else
                      class="text-caption">تا سوال {{ booklet.to_question ?? '-' }}</span>
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
          <div
            v-else
            class="text-center q-pa-md text-grey">دفترچه‌ای ثبت نشده است.</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import { ExamType } from 'src/repositories/exam'
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

const heldAtFormatted = computed(() => {
  const raw = exam.value.in_person_exam_detail?.held_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

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
    exam.value.classes = (val || []).map((id) => ({ id })) as any[]
  }
})

const levelIds = computed({
  get: () => exam.value.academic_levels?.map((l: any) => l.id) || [],
  set: (val: any[]) => {
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
