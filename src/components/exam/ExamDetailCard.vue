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
          <div class="text-body1">{{ exam.category?.title || '-' }}</div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">نام آزمون:</div>
          <div class="text-body1">
            {{ exam.name || '-' }}
            <q-chip
              color="info"
              text-color="white">
              {{ exam.delivery_mode === 'online' ? 'آنلاین' : 'حضوری' }}
            </q-chip>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">درس:</div>
          <div class="text-body1">{{ exam.lesson?.name || '-' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">حداقل نمره قبولی:</div>
          <div class="text-body1">{{ exam.min_passing_score ?? '-' }}</div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-subtitle2">حداکثر نمره:</div>
          <div class="text-body1">{{ exam.max_score ?? '-' }}</div>
        </div>
        <div
          v-if="exam.description"
          class="col-12">
          <div class="text-subtitle2">توضیحات:</div>
          <div class="text-body1">{{ exam.description }}</div>
        </div>
      </div>
    </q-card-section>

    <template v-if="exam.delivery_mode === 'in_person' && exam.in_person_exam_detail">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">تاریخ برگزاری:</div>
            <div class="text-body1">{{ heldAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">توصیفی:</div>
            <div class="text-body1">
              <q-chip
                :color="exam.in_person_exam_detail.is_descriptive ? 'primary' : 'grey'"
                text-color="white"
                dense>
                {{ exam.in_person_exam_detail.is_descriptive ? 'بله' : 'خیر' }}
              </q-chip>
            </div>
          </div>
        </div>
      </q-card-section>
    </template>

    <template v-else-if="exam.delivery_mode === 'online' && exam.online_exam_detail">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان شروع:</div>
            <div class="text-body1">{{ startsAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان پایان:</div>
            <div class="text-body1">{{ endsAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">زمان محدودیت (دقیقه):</div>
            <div class="text-body1">{{ exam.online_exam_detail.time_limit_minutes ?? '-' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">قابل مشاهده از:</div>
            <div class="text-body1">{{ visibleAtFormatted }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2">پاسخ‌ها قابل مشاهده از:</div>
            <div class="text-body1">{{ answersVisibleAtFormatted }}</div>
          </div>
        </div>
      </q-card-section>
    </template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import { ExamType } from 'src/repositories/exam'

const props = defineProps<{
  exam: ExamType;
}>()

const dateManager = useDate()

const heldAtFormatted = computed(() => {
  const raw = props.exam.in_person_exam_detail?.held_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const startsAtFormatted = computed(() => {
  const raw = props.exam.online_exam_detail?.starts_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const endsAtFormatted = computed(() => {
  const raw = props.exam.online_exam_detail?.ends_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const visibleAtFormatted = computed(() => {
  const raw = props.exam.online_exam_detail?.visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})

const answersVisibleAtFormatted = computed(() => {
  const raw = props.exam.online_exam_detail?.answers_visible_at
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') || raw
})
</script>
