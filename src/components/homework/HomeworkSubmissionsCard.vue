<template>
  <div class="q-mt-lg">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">لیست ارسال‌ها</div>
      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="به‌روزرسانی"
        :loading="loading"
        @click="loadSubmissions" />
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
          @click="loadSubmissions" />
      </template>
    </q-banner>

    <div
      v-if="loading && !groupedSubmissions"
      class="flex flex-center q-pa-xl">
      <q-spinner
        color="primary"
        size="40px" />
    </div>

    <template v-if="groupedSubmissions">
      <div class="row q-col-gutter-md q-mb-lg">
        <div
          v-for="item in summary"
          :key="item.label"
          class="col-12 col-sm-3">
          <q-card
            flat
            bordered>
            <q-card-section>
              <div class="text-grey-7">{{ item.label }}</div>
              <div class="text-h5 text-weight-bold">{{ item.value }}</div>
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
        style="max-width: 420px">
        <template #prepend><q-icon name="search" /></template>
      </q-input>

      <q-banner
        v-if="!groupedSubmissions.levels.length"
        rounded
        class="bg-grey-2 text-grey-8">
        پایه یا کلاسی برای این تکلیف یافت نشد.
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
          bordered>
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
              {{ levelSubmitted(level) }} از {{ levelStudents(level) }} ارسال‌کننده
            </q-chip>
          </q-card-section>
          <q-linear-progress
            :value="levelStudents(level) ? levelSubmitted(level) / levelStudents(level) : 0"
            color="primary"
            track-color="grey-3" />
          <q-card-section class="column q-gutter-md">
            <q-expansion-item
              v-for="schoolClass in level.classes"
              :key="schoolClass.class_id"
              expand-separator
              default-opened>
              <template #header>
                <q-item-section avatar>
                  <q-icon
                    name="school"
                    color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ schoolClass.class_name }}</q-item-label>
                  <q-item-label caption>همه دانش‌آموزان کلاس</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    dense
                    color="primary"
                    text-color="white">
                    {{ schoolClass.submitted_count + schoolClass.reviewed_count }} از {{ schoolClass.total_students }} ارسال‌کننده
                  </q-chip>
                </q-item-section>
              </template>
              <q-separator />
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
                      :color="statusColors[props.row.state]"
                      text-color="white">
                      {{ statusLabels[props.row.state] }}
                    </q-chip>
                  </q-td>
                </template>
                <template #body-cell-student_seen_at="props">
                  <q-td :props="props">{{ formatDate(props.row.submission?.student_seen_at) }}</q-td>
                </template>
                <template #body-cell-submitted_at="props">
                  <q-td :props="props">{{ formatDate(props.row.submission?.submitted_at) }}</q-td>
                </template>
                <template #body-cell-operator_seen_at="props">
                  <q-td :props="props">{{ formatDate(props.row.submission?.operator_seen_at) }}</q-td>
                </template>
                <template #body-cell-feedback="props">
                  <q-td :props="props">{{ props.row.submission?.feedback || '-' }}</q-td>
                </template>
                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      v-if="props.row.submission?.id"
                      flat
                      dense
                      color="primary"
                      icon="visibility"
                      @click.stop="emit('select', props.row.submission, props.row.student.name)" />
                  </q-td>
                </template>
              </q-table>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { QTableColumn } from 'quasar'
import { useDate } from 'src/composables/Date'
import HomeworkSubmissionAPI from 'src/repositories/homeworkSubmission'
import type { GroupedHomeworkSubmissionsType, HomeworkClassSubmissionsType, HomeworkLevelSubmissionsType } from 'src/repositories/homeworkSubmission'
import type { HomeworkSubmissionType } from 'src/repositories/homework'

const props = defineProps<{ homeworkId: number }>()
const emit = defineEmits<{ select: [submission: HomeworkSubmissionType, studentName: string] }>()
const api = new HomeworkSubmissionAPI()
const dateManager = useDate()
const groupedSubmissions = ref<GroupedHomeworkSubmissionsType | null>(null)
const loading = ref(false)
const error = ref('')
const search = ref<string | null>('')

const columns: QTableColumn[] = [
  { name: 'student', label: 'دانش‌آموز', field: (row) => row.student.name, align: 'left' },
  { name: 'status', label: 'وضعیت', field: (row) => row.state, align: 'center' },
  { name: 'student_seen_at', label: 'مشاهده دانش‌آموز', field: (row) => row.submission?.student_seen_at, align: 'center' },
  { name: 'submitted_at', label: 'زمان ارسال', field: (row) => row.submission?.submitted_at, align: 'center' },
  { name: 'operator_seen_at', label: 'مشاهده معلم', field: (row) => row.submission?.operator_seen_at, align: 'center' },
  { name: 'feedback', label: 'بازخورد', field: (row) => row.submission?.feedback, align: 'center' },
  { name: 'actions', label: 'عملیات', field: () => '', align: 'center' }
]

const statusLabels = { reviewed: 'بررسی‌شده', submitted: 'ارسال‌شده', seen: 'مشاهده‌شده', not_seen: 'مشاهده‌نشده' }
const statusColors = { reviewed: 'positive', submitted: 'primary', seen: 'info', not_seen: 'grey' }

function levelStudents (level: HomeworkLevelSubmissionsType): number {
  return level.classes.reduce((total, schoolClass) => total + schoolClass.total_students, 0)
}

function levelSubmitted (level: HomeworkLevelSubmissionsType): number {
  return level.classes.reduce((total, schoolClass) => total + schoolClass.submitted_count + schoolClass.reviewed_count, 0)
}

const summary = computed(() => {
  const levels = groupedSubmissions.value?.levels ?? []
  return [
    { label: 'پایه‌ها', value: levels.length },
    { label: 'کلاس‌ها', value: levels.reduce((total, level) => total + level.classes.length, 0) },
    { label: 'دانش‌آموزان', value: levels.reduce((total, level) => total + levelStudents(level), 0) },
    { label: 'ارسال‌کنندگان', value: levels.reduce((total, level) => total + levelSubmitted(level), 0) }
  ]
})

const visibleLevels = computed<HomeworkLevelSubmissionsType[]>(() => {
  const query = search.value?.trim().toLocaleLowerCase() ?? ''
  if (!query) return groupedSubmissions.value?.levels ?? []

  return (groupedSubmissions.value?.levels ?? []).reduce<HomeworkLevelSubmissionsType[]>((matches, level) => {
    if (level.academic_level_name.toLocaleLowerCase().includes(query)) {
      matches.push(level)
      return matches
    }
    const classes = level.classes.reduce<HomeworkClassSubmissionsType[]>((classMatches, schoolClass) => {
      if (schoolClass.class_name.toLocaleLowerCase().includes(query) || schoolClass.students.some(({ student }) =>
        `${student.name} ${student.national_code ?? ''}`.toLocaleLowerCase().includes(query)
      )) classMatches.push(schoolClass)
      return classMatches
    }, [])
    if (classes.length) matches.push({ ...level, classes })
    return matches
  }, [])
})

function formatDate (value?: string | null): string {
  return value ? dateManager.isoToLocalShamsi(value) || value : '-'
}

async function loadSubmissions () {
  loading.value = true
  error.value = ''
  try {
    groupedSubmissions.value = await api.getGroupedByClass(props.homeworkId)
  } catch {
    error.value = 'دریافت لیست ارسال‌های تکلیف ناموفق بود.'
  } finally {
    loading.value = false
  }
}

watch(() => props.homeworkId, () => {
  groupedSubmissions.value = null
  void loadSubmissions()
}, { immediate: true })

defineExpose({ reload: loadSubmissions })
</script>
