<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">جزئیات آزمون</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">دسته‌بندی:</div>
          <q-select
            v-if="editable"
            v-model="exam.exam_category_id"
            :options="categoryOptions"
            option-value="id"
            option-label="title"
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
          <div class="text-subtitle2">نام آزمون:</div>
          <q-input
            v-if="editable"
            v-model="exam.name"
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
          <div class="text-subtitle2">درس:</div>
          <q-select
            v-if="editable"
            v-model="exam.lesson_id"
            :options="lessonOptions"
            option-value="id"
            option-label="name"
            outlined
            dense
            emit-value
            map-options
            clearable />
          <div
            v-else
            class="text-body1">{{ exam.lesson?.name || '-' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">حداقل نمره قبولی:</div>
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
          <div class="text-subtitle2">حداکثر نمره:</div>
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
  <q-card class="q-mb-md">
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
          <div class="text-subtitle2 q-mb-sm">تصویر آزمون</div>
          <template v-if="exam.online_exam_detail?.content">
            <img
              v-if="
                exam.online_exam_detail.content.type === 'image' &&
                  exam.online_exam_detail.content.path
              "
              :src="`storage/${exam.online_exam_detail.content.path}`"
              alt="تصویر آزمون"
              style="max-width: 100%; display: block">
            <div
              v-else-if="exam.online_exam_detail.content.type === 'text'"
              class="text-body1">
              {{ exam.online_exam_detail.content.body || '-' }}
            </div>
          </template>
          <div
            v-else
            class="text-center q-pa-md text-grey">تصویری ثبت نشده است.</div>
        </div>

        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">تصویر پاسخنامه</div>
          <template v-if="exam.online_exam_detail?.solution">
            <img
              v-if="
                exam.online_exam_detail.solution.type === 'image' &&
                  exam.online_exam_detail.solution.path
              "
              :src="`storage/${exam.online_exam_detail.solution.path}`"
              alt="تصویر پاسخنامه"
              style="max-width: 100%; display: block">
            <div
              v-else-if="exam.online_exam_detail.solution.type === 'text'"
              class="text-body1">
              {{ exam.online_exam_detail.solution.body || '-' }}
            </div>
          </template>
          <div
            v-else
            class="text-center q-pa-md text-grey">تصویری ثبت نشده است.</div>
        </div>

        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">پاسخنامه کلیدی آزمون (بابل شیت)</div>
          <exam-answer-key-editor
            v-model:value="exam.answer_keys"
            :readonly="!editable" />
        </div>

        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">دفترچه های آزمون</div>
          <q-list
            v-if="exam.online_exam_detail?.booklets?.length"
            bordered
            separator>
            <q-item
              v-for="(booklet, index) in exam.online_exam_detail.booklets"
              :key="index"
              class="q-py-sm">
              <q-item-section>
                <q-item-label>{{ booklet.title || '-' }}</q-item-label>
                <q-item-label caption>
                  {{
                    booklet.lesson?.name || booklet.lesson_id
                      ? `درس: ${booklet.lesson?.name || booklet.lesson_id}`
                      : ''
                  }}
                  | از سوال {{ booklet.from_question ?? '-' }} تا سوال
                  {{ booklet.to_question ?? '-' }}
                </q-item-label>
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
import ExamAnswerKeyEditor from 'src/components/exam/ExamAnswerKeyEditor.vue'

const exam = defineModel<ExamType>('exam')
const props = defineProps<{
  editable?: boolean;
  lessonOptions?: any[];
  categoryOptions?: any[];
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
</script>

<style scoped></style>
