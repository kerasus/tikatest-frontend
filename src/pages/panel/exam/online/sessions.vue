<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-gutter-sm q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">جلسات آزمون آنلاین</div>
        <div
          v-if="examSessions?.exam_title"
          class="text-grey-7 q-mt-xs">
          {{ examSessions.exam_title }}
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          flat
          color="grey-8"
          icon="arrow_forward"
          label="بازگشت"
          :to="{ name: 'Panel.Exam.Online.Show', params: { id: examId } }" />
        <q-btn
          outline
          color="primary"
          icon="refresh"
          label="به‌روزرسانی"
          :loading="loading"
          @click="loadSessions" />
      </div>
    </div>

    <q-banner
      v-if="error"
      rounded
      class="bg-red-1 text-negative q-mb-md">
      {{ error }}
      <template #action>
        <q-btn
          flat
          color="negative"
          label="تلاش دوباره"
          @click="loadSessions" />
      </template>
    </q-banner>

    <div
      v-if="loading && !examSessions"
      class="flex flex-center q-pa-xl">
      <q-spinner
        color="primary"
        size="40px" />
    </div>

    <template v-if="examSessions">
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-3">
          <q-card
            flat
            bordered
            class="summary-card">
            <q-card-section>
              <div class="text-grey-7">پایه‌ها</div>
              <div class="text-h5 text-weight-bold">{{ examSessions.levels.length }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-3">
          <q-card
            flat
            bordered
            class="summary-card">
            <q-card-section>
              <div class="text-grey-7">کلاس‌ها</div>
              <div class="text-h5 text-weight-bold">{{ totalClasses }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-3">
          <q-card
            flat
            bordered
            class="summary-card">
            <q-card-section>
              <div class="text-grey-7">دانش‌آموزان</div>
              <div class="text-h5 text-weight-bold">{{ totalStudents }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-3">
          <q-card
            flat
            bordered
            class="summary-card">
            <q-card-section>
              <div class="text-grey-7">شرکت‌کنندگان</div>
              <div class="text-h5 text-weight-bold text-positive">{{ totalParticipated }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-input
        v-model="search"
        outlined
        dense
        clearable
        class="q-mb-md"
        label="جستجوی پایه، کلاس یا دانش‌آموز"
        placeholder="نام پایه، کلاس، دانش‌آموز یا کد ملی"
        style="max-width: 420px">
        <template #prepend><q-icon name="search" /></template>
      </q-input>

      <q-banner
        v-if="!examSessions.levels.length"
        rounded
        class="bg-grey-2 text-grey-8">
        پایه یا کلاسی برای این آزمون یافت نشد.
      </q-banner>
      <q-banner
        v-else-if="!visibleLevels.length"
        rounded
        class="bg-grey-2 text-grey-8">
        نتیجه‌ای برای جستجوی شما یافت نشد.
      </q-banner>

      <div
        v-else
        class="column q-gutter-lg">
        <q-card
          v-for="level in visibleLevels"
          :key="level.academic_level_id"
          flat
          bordered
          class="level-card">
          <q-card-section class="row items-center justify-between q-gutter-sm">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="layers"
                color="primary"
                size="md" />
              <div>
                <div class="text-subtitle1 text-weight-bold">{{ level.academic_level_name }}</div>
                <div class="text-caption text-grey-7">{{ level.classes.length }} کلاس</div>
              </div>
            </div>
            <q-chip
              dense
              outline
              color="primary">
              {{ levelParticipated(level) }} از {{ levelStudents(level) }} شرکت‌کننده
            </q-chip>
          </q-card-section>
          <q-linear-progress
            :value="levelStudents(level) ? levelParticipated(level) / levelStudents(level) : 0"
            color="primary"
            track-color="grey-3" />
          <q-card-section class="column q-gutter-md">
            <q-expansion-item
              v-for="schoolClass in level.classes"
              :key="schoolClass.class_id"
              expand-separator
              default-opened
              class="class-card">
              <template #header>
                <q-item-section avatar>
                  <q-icon
                    name="school"
                    color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ schoolClass.class_name }}</q-item-label>
                  <q-item-label caption>
                    همه دانش‌آموزان کلاس
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    color="primary"
                    text-color="white"
                    dense>
                    {{ schoolClass.participated_count }} از {{ schoolClass.total_students }} شرکت‌کننده
                  </q-chip>
                </q-item-section>
              </template>
              <q-separator style="padding: 0" />
              <q-card
                flat
                style="padding: 0">
                <q-table
                  flat
                  :rows="schoolClass.students"
                  :columns="columns"
                  row-key="enrollment_id"
                  :pagination="{ rowsPerPage: 0 }"
                  :rows-per-page-options="[0]"
                  no-data-label="دانش‌آموزی در این کلاس یافت نشد.">
                  <template #body-cell-student="props">
                    <q-td :props="props">
                      <div class="text-weight-medium">{{ props.row.student.name }}</div>
                      <div
                        v-if="props.row.student.national_code"
                        class="text-caption text-grey-7">
                        {{ props.row.student.national_code }}
                      </div>
                    </q-td>
                  </template>
                  <template #body-cell-status="props">
                    <q-td :props="props">
                      <q-chip
                        dense
                        :color="props.row.has_participated ? getStatusColor(props.row.session?.status) : 'grey'"
                        text-color="white">
                        {{ props.row.has_participated ? getStatusLabel(props.row.session?.status) : 'شرکت نکرده' }}
                      </q-chip>
                    </q-td>
                  </template>
                  <template #body-cell-started_at="props">
                    <q-td :props="props">{{ formatDate(props.row.session?.started_at) }}</q-td>
                  </template>
                  <template #body-cell-submitted_at="props">
                    <q-td :props="props">{{ formatDate(props.row.session?.submitted_at) }}</q-td>
                  </template>
                  <template #body-cell-time_used_seconds="props">
                    <q-td :props="props">{{ formatDuration(props.row.session?.time_used_seconds) }}</q-td>
                  </template>
                  <template #body-cell-percent="props">
                    <q-td :props="props">{{ props.row.session?.percent == null ? '-' : `${props.row.session.percent}%` }}</q-td>
                  </template>
                  <template #body-cell-actions="props">
                    <q-td :props="props">
                      <template v-if="props.row.session">
                        <q-btn
                          flat
                          round
                          dense
                          color="primary"
                          icon="visibility"
                          :disable="!canViewReport(props.row.session.status)"
                          :to="{ name: 'Panel.Exam.Online.Sessions.Show', params: { id: examId, sessionId: props.row.session.id } }">
                          <q-tooltip>{{ canViewReport(props.row.session.status) ? 'مشاهده کارنامه و پاسخ‌برگ' : 'جلسه هنوز تکمیل نشده است' }}</q-tooltip>
                        </q-btn>
                        <delete-btn
                          :row="props.row.session"
                          :api="onlineExamSessionApi"
                          :use-flag="false"
                          @change="afterRemove" />
                      </template>
                      <span v-else>-</span>
                    </q-td>
                  </template>
                </q-table>
              </q-card>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import { useRoute } from 'vue-router'
import { useDate } from 'src/composables/Date'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import OnlineExamSessionAPI, {
  type ExamClassSessionsType,
  type ExamLevelSessionsType,
  type GroupedExamSessionsResponseType,
  type ParticipationStatus
} from 'src/repositories/onlineExamSession'

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()
const onlineExamSessionApi = new OnlineExamSessionAPI()
const examId = computed(() => Number(route.params.id))
const examSessions = ref<GroupedExamSessionsResponseType | null>(null)
const loading = ref(false)
const error = ref('')
const search = ref<string | null>('')

const columns: QTableColumn[] = [
  { name: 'student', label: 'دانش‌آموز', field: (row) => row.student.name, align: 'left' },
  { name: 'status', label: 'وضعیت', field: (row) => row.session?.status ?? 'not_started', align: 'center' },
  { name: 'attempt_number', label: 'شماره تلاش', field: (row) => row.session?.attempt_number ?? '-', align: 'center' },
  { name: 'started_at', label: 'زمان شروع', field: (row) => row.session?.started_at ?? '', align: 'center' },
  { name: 'submitted_at', label: 'زمان ارسال', field: (row) => row.session?.submitted_at ?? '', align: 'center' },
  { name: 'time_used_seconds', label: 'مدت پاسخگویی', field: (row) => row.session?.time_used_seconds ?? '-', align: 'center' },
  { name: 'percent', label: 'درصد', field: (row) => row.session?.percent ?? '-', align: 'center' },
  { name: 'actions', label: 'عملیات', field: () => '', align: 'center' }
]

function levelStudents (level: ExamLevelSessionsType): number {
  return level.classes.reduce((total, schoolClass) => total + schoolClass.total_students, 0)
}

function levelParticipated (level: ExamLevelSessionsType): number {
  return level.classes.reduce((total, schoolClass) => total + schoolClass.participated_count, 0)
}

const totalClasses = computed(() => examSessions.value?.levels.reduce((total, level) => total + level.classes.length, 0) ?? 0)
const totalStudents = computed(() => examSessions.value?.levels.reduce((total, level) => total + levelStudents(level), 0) ?? 0)
const totalParticipated = computed(() => examSessions.value?.levels.reduce((total, level) => total + levelParticipated(level), 0) ?? 0)
const visibleLevels = computed<ExamLevelSessionsType[]>(() => {
  const query = search.value?.trim().toLocaleLowerCase() ?? ''
  if (!query) return examSessions.value?.levels ?? []

  return (examSessions.value?.levels ?? []).reduce<ExamLevelSessionsType[]>((matches, level) => {
    if (level.academic_level_name.toLocaleLowerCase().includes(query)) {
      matches.push(level)
      return matches
    }

    const classes = level.classes.reduce<ExamClassSessionsType[]>((classMatches, schoolClass) => {
      if (schoolClass.class_name.toLocaleLowerCase().includes(query)) {
        classMatches.push(schoolClass)
        return classMatches
      }
      const hasMatchingStudent = schoolClass.students.some(({ student }) =>
        `${student.name} ${student.national_code ?? ''}`.toLocaleLowerCase().includes(query)
      )
      if (hasMatchingStudent) classMatches.push(schoolClass)
      return classMatches
    }, [])
    if (classes.length) matches.push({ ...level, classes })
    return matches
  }, [])
})

const statusLabels: Record<ParticipationStatus, string> = {
  not_started: 'شروع نشده', in_progress: 'در حال انجام', submitted: 'ثبت شده',
  graded: 'نمره‌گذاری شده', expired: 'منقضی شده'
}
const statusColors: Record<ParticipationStatus, string> = {
  not_started: 'grey', in_progress: 'primary', submitted: 'warning',
  graded: 'positive', expired: 'negative'
}

function getStatusLabel (status?: ParticipationStatus | null): string {
  return statusLabels[status ?? 'not_started'] ?? status ?? 'شروع نشده'
}

function getStatusColor (status?: ParticipationStatus | null): string {
  return statusColors[status ?? 'not_started'] ?? 'grey'
}

function canViewReport (status: ParticipationStatus): boolean {
  return status === 'graded' || status === 'submitted'
}

function formatDate (date?: string | null): string {
  return date ? dateManager.isoToLocalShamsi(date) : '-'
}

function formatDuration (seconds?: number | null): string {
  if (seconds == null) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')} ساعت`
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')} دقیقه`
}

async function loadSessions () {
  loading.value = true
  error.value = ''
  try {
    examSessions.value = await onlineExamSessionApi.getExamSessionsGroupedByClass(examId.value)
  } catch {
    error.value = 'دریافت اطلاعات کلاس‌ها و جلسات آزمون ناموفق بود.'
  } finally {
    loading.value = false
  }
}

function afterRemove () {
  void loadSessions()
  $q.notify({ message: 'جلسه با موفقیت حذف شد.', type: 'positive' })
}

watch(examId, () => {
  examSessions.value = null
  void loadSessions()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.summary-card {
  height: 100%;
  border-radius: 12px;
}

.class-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.level-card {
  border-radius: 14px;
  overflow: hidden;
}
</style>
