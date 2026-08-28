<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">
        {{ exam.delivery_mode === 'in_person' ? 'نمرات ثبت شده' : 'جلسات آزمون آنلاین' }}
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <template v-if="exam.delivery_mode === 'in_person'">
        <div
          v-if="loadingStudents"
          class="text-center q-pa-md">
          <q-spinner
            color="primary"
            size="40px" />
        </div>
        <q-list
          v-else-if="rows.length"
          bordered
          separator>
          <q-item
            v-for="row in rows"
            :key="row.student.id"
            class="q-py-sm">
            <q-item-section>
              <q-item-label>{{ fullName(row.student) }}</q-item-label>
              <template v-if="row.result">
                <q-item-label caption>
                  نمره خام: {{ row.result.raw_score ?? '-' }} | نمره محاسبه شده:
                  {{ row.result.scaled_score ?? '-' }} | Z نمره: {{ row.result.z_score ?? '-' }}
                </q-item-label>
                <q-item-label
                  v-if="editingId === row.result.id"
                  caption
                  class="q-mt-xs">
                  <q-input
                    v-model.number="editRawScore"
                    type="number"
                    step="0.01"
                    outlined
                    dense
                    label="نمره خام"
                    @update:modelValue="onRawScoreInput" />
                </q-item-label>
              </template>
              <q-item-label
                v-else
                caption
                class="q-mt-xs">
                <q-input
                  v-model.number="newScores[row.student.id]"
                  type="number"
                  step="0.01"
                  outlined
                  dense
                  label="ثبت نمره خام" />
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <template v-if="row.result">
                <q-btn
                  v-if="editingId !== row.result.id"
                  flat
                  round
                  dense
                  icon="edit"
                  color="warning"
                  size="sm"
                  @click="startEdit(row.result)" />
                <q-btn
                  v-else
                  flat
                  round
                  dense
                  icon="save"
                  color="positive"
                  size="sm"
                  @click="saveEdit(row.result)" />
                <q-btn
                  v-if="editingId === row.result.id"
                  flat
                  round
                  dense
                  icon="close"
                  color="negative"
                  size="sm"
                  class="q-ml-xs"
                  @click="cancelEdit" />
                <q-btn
                  v-if="editingId !== row.result.id"
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  size="sm"
                  class="q-ml-xs"
                  @click="removeResult(row.result)" />
              </template>
              <q-btn
                v-else
                flat
                round
                dense
                icon="add"
                color="positive"
                size="sm"
                @click="addResult(row.student)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else
          class="text-center q-pa-md text-grey">دانش‌آموزی برای این آزمون یافت نشد.</div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ExamType } from 'src/repositories/exam'
import { exam as examApi } from 'src/repositories/exam'
import { inPersonExamResult } from 'src/repositories/inPersonExamResult'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps<{
  exam: ExamType;
}>()

const emit = defineEmits(['result-updated'])

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
