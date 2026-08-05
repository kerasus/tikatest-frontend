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
        <q-list
          v-if="exam.in_person_exam_results?.length"
          bordered
          separator>
          <q-item
            v-for="result in exam.in_person_exam_results"
            :key="result.id"
            class="q-py-sm">
            <q-item-section>
              <q-item-label>{{
                `${result.student.first_name} ${result.student.last_name}`
              }}</q-item-label>
              <q-item-label caption>
                نمره خام: {{ result.raw_score ?? '-' }} | نمره محاسبه شده:
                {{ result.scaled_score ?? '-' }} | Z نمره: {{ result.z_score ?? '-' }}
              </q-item-label>
              <q-item-label
                v-if="editingId === result.id"
                caption
                class="q-mt-xs">
                <q-input
                  v-model.number="editRawScore"
                  type="number"
                  step="0.01"
                  outlined
                  dense
                  label="نمره خام"
                  @input="onRawScoreInput" />
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                v-if="editingId !== result.id"
                flat
                round
                dense
                icon="edit"
                color="warning"
                size="sm"
                @click="startEdit(result)" />
              <q-btn
                v-else
                flat
                round
                dense
                icon="save"
                color="positive"
                size="sm"
                @click="saveEdit(result)" />
              <q-btn
                v-if="editingId === result.id"
                flat
                round
                dense
                icon="close"
                color="negative"
                size="sm"
                class="q-ml-xs"
                @click="cancelEdit" />
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-else
          class="text-center q-pa-md text-grey">نمره‌ای ثبت نشده است.</div>
      </template>

      <!--      <template v-else-if="exam.delivery_mode === 'online'">-->
      <!--        <q-list-->
      <!--          v-if="exam.online_exam_sessions?.length"-->
      <!--          bordered-->
      <!--          separator>-->
      <!--          <q-expansion-item-->
      <!--            v-for="session in exam.online_exam_sessions"-->
      <!--            :key="session.id"-->
      <!--            dense-toggle-->
      <!--            expand-icon="expand_more"-->
      <!--            header-class="q-pa-sm">-->
      <!--            <template #header>-->
      <!--              <q-item-section>-->
      <!--                <q-item-label>{{ session.student?.full_name || '-' }}</q-item-label>-->
      <!--                <q-item-label caption>-->
      <!--                  وضعیت: {{ session.status || '-' }} | نمره: {{ session.score ?? '-' }} | درصد:-->
      <!--                  {{ session.percent ?? '-' }}% | تلاش: {{ session.attempt_number ?? '-' }}-->
      <!--                </q-item-label>-->
      <!--              </q-item-section>-->
      <!--              <q-item-section side>-->
      <!--                <q-chip-->
      <!--                  :color="getStatusColor(session.status)"-->
      <!--                  text-color="white"-->
      <!--                  dense>-->
      <!--                  {{ getStatusLabel(session.status) }}-->
      <!--                </q-chip>-->
      <!--              </q-item-section>-->
      <!--            </template>-->
      <!--            <q-separator />-->
      <!--            <q-card-section>-->
      <!--              <div class="row q-col-gutter-md">-->
      <!--                <div class="col-6">-->
      <!--                  <div class="text-subtitle2">شروع:</div>-->
      <!--                  <div class="text-body1">{{ session.started_at || '-' }}</div>-->
      <!--                </div>-->
      <!--                <div class="col-6">-->
      <!--                  <div class="text-subtitle2">ثبت:</div>-->
      <!--                  <div class="text-body1">{{ session.submitted_at || '-' }}</div>-->
      <!--                </div>-->
      <!--                <div class="col-6">-->
      <!--                  <div class="text-subtitle2">زمان محدود:</div>-->
      <!--                  <div class="text-body1">{{ session.duration_limit_seconds ?? '-' }} ثانیه</div>-->
      <!--                </div>-->
      <!--                <div class="col-6">-->
      <!--                  <div class="text-subtitle2">زمان استفاده:</div>-->
      <!--                  <div class="text-body1">{{ session.time_used_seconds ?? '-' }} ثانیه</div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </q-card-section>-->
      <!--            <q-separator />-->
      <!--            <q-card-section>-->
      <!--              <div class="text-subtitle2 q-mb-sm">پاسخ‌ها:</div>-->
      <!--              <q-list-->
      <!--                v-if="session.responses?.length"-->
      <!--                bordered-->
      <!--                separator>-->
      <!--                <q-item-->
      <!--                  v-for="response in session.responses"-->
      <!--                  :key="response.id"-->
      <!--                  dense>-->
      <!--                  <q-item-section>-->
      <!--                    <q-item-label>سوال {{ response.question_number }}</q-item-label>-->
      <!--                    <q-item-label caption>-->
      <!--                      پاسخ: {{ response.submitted_option || response.answer_text || '-' }} | درست:-->
      <!--                      {{ response.is_correct ? 'بله' : 'خیر' }} | نمره:-->
      <!--                      {{ response.marks_obtained ?? '-' }}-->
      <!--                    </q-item-label>-->
      <!--                  </q-item-section>-->
      <!--                </q-item>-->
      <!--              </q-list>-->
      <!--              <div-->
      <!--                v-else-->
      <!--                class="text-center q-pa-md text-grey">پاسخی ثبت نشده است.</div>-->
      <!--            </q-card-section>-->
      <!--          </q-expansion-item>-->
      <!--        </q-list>-->
      <!--        <div-->
      <!--          v-else-->
      <!--          class="text-center q-pa-md text-grey">جلسه آزمونی ثبت نشده است.</div>-->
      <!--      </template>-->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExamType } from 'src/repositories/exam'
import { inPersonExamResult } from 'src/repositories/inPersonExamResult'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps<{
  exam: ExamType;
}>()

const editingId = ref<number | null>(null)
const editScore = ref<number | null>(null)
const editRawScore = ref<number | null>(null)

function startEdit (result: any) {
  editingId.value = result.id
  editRawScore.value = result.raw_score
}

function onRawScoreInput () {
  if (editRawScore.value != null && !isNaN(editRawScore.value) && props.exam.max_score) {
    editScore.value = Math.round((editRawScore.value / props.exam.max_score) * 20)
  } else {
    editScore.value = null
  }
}

function cancelEdit () {
  editingId.value = null
  editRawScore.value = null
}

async function saveEdit (result: any) {
  try {
    await inPersonExamResult.update(result.id, { raw_score: editRawScore.value, scaled_score: editScore.value } as any)
    result.scaled_score = editScore.value
    result.raw_score = editRawScore.value
    $q.notify({ type: 'positive', message: 'نمره با موفقیت به‌روز شد' })
    window.location.reload()
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در به‌روزرسانی نمره' })
  } finally {
    editingId.value = null
    editRawScore.value = null
    editScore.value = null
  }
}

function getStatusColor (status: string | null) {
  if (!status) return 'grey'
  switch (status) {
    case 'completed':
      return 'positive'
    case 'in_progress':
      return 'primary'
    case 'pending':
      return 'warning'
    case 'locked':
      return 'negative'
    default:
      return 'grey'
  }
}

function getStatusLabel (status: string | null) {
  if (!status) return '-'
  const labels: Record<string, string> = {
    completed: 'تکمیل شده',
    in_progress: 'در حال انجام',
    pending: 'در انتظار',
    locked: 'قفل شده'
  }
  return labels[status] || status
}
</script>
