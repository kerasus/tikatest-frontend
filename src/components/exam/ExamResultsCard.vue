<template>
  <q-card
    flat
    bordered
    class="rounded-borders q-mb-md">
    <!-- هدر سکشن با آمار -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <q-avatar
            size="32px"
            :color="exam.delivery_mode === 'in_person' ? 'teal' : 'deep-purple'"
            text-color="white"
            :icon="exam.delivery_mode === 'in_person' ? 'fact_check' : 'cast_for_education'"
            class="q-mr-sm shadow-1" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
              {{ exam.delivery_mode === 'in_person' ? 'ثبت و مدیریت نمرات حضوری' : 'جلسات و نتایج آزمون آنلاین' }}
            </div>
            <div class="text-caption text-grey-7">
              {{ exam.delivery_mode === 'in_person'
                ? 'ثبت، بازبینی و ویرایش نمرات آزمون تشریحی یا کتبی دانش‌آموزان'
                : 'مشاهده لاگ‌های شرکت در آزمون، نشست‌ها و پاسخنامه‌های ثبت‌شده' }}
            </div>
          </div>
        </div>

        <!-- خلاصه آمار دانش‌آموزان برای آزمون حضوری -->
        <div
          v-if="exam.delivery_mode === 'in_person' && students.length"
          class="row items-center q-gutter-x-xs">
          <q-chip
            dense
            color="white"
            text-color="teal-9"
            class="shadow-1 text-weight-bold text-caption">
            <q-icon
              name="people"
              size="14px"
              class="q-mr-xs" />
            کل دانش‌آموزان: {{ students.length }}
          </q-chip>
          <q-chip
            dense
            color="teal-6"
            text-color="white"
            class="text-weight-bold text-caption">
            <q-icon
              name="done_all"
              size="14px"
              class="q-mr-xs" />
            نمرات ثبت‌شده: {{ exam.in_person_exam_results?.length || 0 }}
          </q-chip>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- بدنه کارت -->
    <q-card-section class="q-pa-none">
      <!-- الف) در صورتی که آزمون حضوری باشد -->
      <template v-if="exam.delivery_mode === 'in_person'">
        <!-- حالت در حال بارگذاری -->
        <div
          v-if="loadingStudents"
          class="column items-center justify-center q-pa-xl text-grey-7">
          <q-spinner-dots
            color="teal"
            size="48px" />
          <div class="text-caption q-mt-md">در حال فراخوانی لیست دانش‌آموزان آزمون...</div>
        </div>

        <!-- لیست دانش‌آموزان و نمرات -->
        <q-list
          v-else-if="rows.length"
          separator
          class="rounded-borders">
          <q-item
            v-for="row in rows"
            :key="row.student.id"
            class="q-py-md items-center transition-all hover-bg-grey-1"
            :class="{ 'bg-teal-0': editingId === row.result?.id }">

            <!-- ستون مشخصات دانش‌آموز -->
            <q-item-section avatar>
              <q-avatar
                size="40px"
                :color="row.result ? 'teal-1' : 'grey-2'"
                :text-color="row.result ? 'teal-9' : 'grey-7'">
                <q-icon
                  :name="row.result ? 'how_to_reg' : 'person_outline'"
                  size="22px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="row items-center q-gutter-x-sm">
                <span class="text-subtitle2 text-weight-bold text-blue-grey-10">
                  {{ fullName(row.student) }}
                </span>
                <span
                  v-if="row.student.national_code"
                  class="text-caption text-grey-6 font-monospace">
                  ({{ row.student.national_code }})
                </span>
              </div>

              <!-- حالت نمره ثبت شده (مشاهده / ادیت) -->
              <template v-if="row.result">
                <!-- حالت ویرایش -->
                <div
                  v-if="editingId === row.result.id"
                  class="row items-center q-col-gutter-sm q-mt-xs">
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="editRawScore"
                      type="number"
                      step="0.01"
                      outlined
                      dense
                      autofocus
                      label="نمره خام جدید"
                      bg-color="white"
                      @update:model-value="onRawScoreInput">
                      <template #prepend>
                        <q-icon
                          name="edit"
                          size="16px"
                          color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4 text-caption text-grey-8">
                    نمره تبدیل‌شده (مبنای ۲۰):
                    <span class="text-weight-bold text-teal-9 text-body2 q-ml-xs">
                      {{ editScore ?? computeScaled(editRawScore) ?? '-' }}
                    </span>
                  </div>
                </div>

                <!-- حالت برچسب‌های نمره -->
                <div
                  v-else
                  class="row items-center q-gutter-xs q-mt-xs">
                  <q-chip
                    dense
                    color="blue-grey-1"
                    text-color="blue-grey-9"
                    class="text-caption">
                    <span class="text-grey-7 q-mr-xs">نمره خام:</span>
                    <strong>{{ row.result.raw_score ?? '-' }}</strong>
                  </q-chip>

                  <q-chip
                    dense
                    color="teal-1"
                    text-color="teal-9"
                    class="text-caption text-weight-bold">
                    <span class="text-teal-7 q-mr-xs">نمره مقیاس:</span>
                    {{ row.result.scaled_score ?? '-' }}
                  </q-chip>

                  <q-chip
                    v-if="row.result.t_score"
                    dense
                    color="purple-1"
                    text-color="purple-9"
                    class="text-caption">
                    <span class="text-purple-7 q-mr-xs">تراز:</span>
                    {{ row.result.t_score }}
                  </q-chip>
                </div>
              </template>

              <!-- حالت نمره ثبت‌نشده (ورود جدید) -->
              <div
                v-else
                class="row items-center q-col-gutter-sm q-mt-xs">
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model.number="newScores[row.student.id]"
                    type="number"
                    step="0.01"
                    outlined
                    dense
                    placeholder="نمره خام دانش‌آموز"
                    bg-color="white">
                    <template #prepend>
                      <q-icon
                        name="add_circle_outline"
                        size="16px"
                        color="grey-6" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-item-section>

            <!-- ستون اکشن‌ها -->
            <q-item-section side>
              <div class="row items-center q-gutter-xs">
                <!-- اگر نمره وجود دارد -->
                <template v-if="row.result">
                  <template v-if="editingId !== row.result.id">
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      color="teal-8"
                      size="sm"
                      @click="startEdit(row.result)">
                      <q-tooltip>ویرایش نمره</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="delete_outline"
                      color="negative"
                      size="sm"
                      @click="removeResult(row.result)">
                      <q-tooltip>حذف نمره</q-tooltip>
                    </q-btn>
                  </template>

                  <template v-else>
                    <q-btn
                      unelevated
                      dense
                      icon="check"
                      color="positive"
                      size="sm"
                      label="ثبت"
                      class="q-px-sm"
                      @click="saveEdit(row.result)" />
                    <q-btn
                      flat
                      dense
                      icon="close"
                      color="grey-7"
                      size="sm"
                      label="لغو"
                      class="q-px-sm"
                      @click="cancelEdit" />
                  </template>
                </template>

                <!-- اگر هنوز نمره‌ای ثبت نشده -->
                <template v-else>
                  <q-btn
                    unelevated
                    dense
                    icon="add"
                    color="teal"
                    size="sm"
                    label="ثبت نمره"
                    class="q-px-sm"
                    @click="addResult(row.student)" />
                </template>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- حالت لیست خالی -->
        <div
          v-else
          class="column items-center justify-center q-pa-xl text-grey-6">
          <q-icon
            name="group_off"
            size="56px"
            color="grey-4" />
          <div class="text-body2 q-mt-md">هیچ دانش‌آموزی برای این آزمون یافت نشد.</div>
          <div class="text-caption text-grey-5">لطفاً کلاس‌ها و پایه‌های تحصیلی منتسب به آزمون را بررسی فرمایید.</div>
        </div>
      </template>

      <!-- ب) در صورتی که آزمون آنلاین باشد -->
      <div
        v-else
        class="q-pa-lg text-center">
        <q-banner
          rounded
          class="bg-deep-purple-1 text-deep-purple-9 q-pa-md text-right">
          <template #avatar>
            <q-icon
              name="hub"
              color="deep-purple"
              size="36px" />
          </template>
          <div class="text-subtitle1 text-weight-bold">
            مدیریت جلسات و مانیتورینگ آزمون آنلاین
          </div>
          <div class="text-caption text-grey-8 q-mt-xs">
            برای آزمون‌های آنلاین، نمرات، زمان‌های ورود/خروج و پاسخنامه‌ها از طریق صفحه اختصاصی «جلسات آزمون» کنترل و مشاهده می‌شوند.
          </div>
          <template #action>
            <q-btn
              unelevated
              color="deep-purple"
              icon="open_in_new"
              label="مشاهده جلسات آزمون آنلاین"
              :to="{ name: 'Panel.Exam.Online.Sessions', params: { id: exam.id } }" />
          </template>
        </q-banner>
      </div>
    </q-card-section>
  </q-card>
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { ExamType } from 'src/repositories/exam'
import { exam as examApi } from 'src/repositories/exam'
import { inPersonExamResult } from 'src/repositories/inPersonExamResult'
import { useQuasar } from 'quasar'

const props = defineProps<{
  exam: ExamType;
}>()

const emit = defineEmits(['result-updated'])

const $q = useQuasar()

const editingId = ref<number | null>(null)
const editScore = ref<number | null>(null)
const editRawScore = ref<number | null>(null)
const newScores = reactive<Record<number, number | null>>({})

const students = ref<any[]>([])
const loadingStudents = ref(false)

const rows = computed(() => {
  const results = props.exam.in_person_exam_results || []
  return students.value.map((student) => {
    const result = results.find((r: any) => (r.student?.id ?? r.user_id) === student.id)
    return { student, result: result || null }
  })
})

function fullName (student: any) {
  return `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'بدون نام'
}

function computeScaled (raw: number | null) {
  if (raw != null && !isNaN(raw) && props.exam.max_score) {
    return Math.round((raw / props.exam.max_score) * 20)
  }
  return raw
}

async function loadStudents () {
  if (props.exam.delivery_mode !== 'in_person' || !props.exam.id) return
  loadingStudents.value = true
  try {
    const response = await examApi.examStudents(props.exam.id as number, { length: 1000 })
    students.value = response.data || []
  } catch (error) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری دانش‌آموزان آزمون' })
  } finally {
    loadingStudents.value = false
  }
}

onMounted(loadStudents)

function startEdit (result: any) {
  editingId.value = result.id
  editRawScore.value = result.raw_score
}

function onRawScoreInput () {
  editScore.value = computeScaled(editRawScore.value)
}

function cancelEdit () {
  editingId.value = null
  editRawScore.value = null
}

async function saveEdit (result: any) {
  try {
    await inPersonExamResult.update(result.id, {
      raw_score: editRawScore.value,
      scaled_score: editScore.value
    } as any)
    result.scaled_score = editScore.value
    result.raw_score = editRawScore.value
    $q.notify({ type: 'positive', message: 'نمره با موفقیت به‌روز شد' })
    emit('result-updated')
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی نمره' })
  } finally {
    editingId.value = null
    editRawScore.value = null
    editScore.value = null
  }
}

async function removeResult (result: any) {
  $q.dialog({
    title: 'حذف نمره',
    message: 'آیا از حذف نمره این دانش‌آموز اطمینان دارید؟',
    cancel: 'انصراف',
    persistent: true
  }).onOk(async () => {
    try {
      await inPersonExamResult.delete(result.id as number)
      $q.notify({ type: 'positive', message: 'نمره با موفقیت حذف شد' })
      emit('result-updated')
    } catch (error: any) {
      $q.notify({ type: 'negative', message: 'خطا در حذف نمره' })
    }
  })
}

async function addResult (student: any) {
  const raw = newScores[student.id]
  if (raw == null || isNaN(raw)) {
    $q.notify({ type: 'negative', message: 'نمره خام الزامی است.' })
    return
  }

  if (!props.exam.in_person_exam_detail?.id) {
    $q.notify({ type: 'negative', message: 'جزئیات آزمون حضوری یافت نشد.' })
    return
  }

  try {
    await inPersonExamResult.create({
      in_person_exam_id: props.exam.in_person_exam_detail.id,
      user_id: student.id,
      raw_score: raw,
      scaled_score: computeScaled(raw)
    } as any)
    $q.notify({ type: 'positive', message: 'نمره با موفقیت ثبت شد' })
    newScores[student.id] = null
    emit('result-updated')
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در ثبت نمره' })
  }
}
</script>
