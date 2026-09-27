<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="true"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #toolbar>
      <q-btn
        flat
        color="grey-8"
        icon="arrow_forward"
        label="بازگشت"
        :to="{ name: 'Panel.Exam.Online.Show', params: { id: examId } }" />
      <q-btn
        flat
        round
        icon="search"
        @click="search">
        <q-tooltip>
          جستجو
        </q-tooltip>
      </q-btn>
    </template>
    <template #entity-index-table-cell="{ inputData }">
      <!-- ستون دانش‌آموز -->
      <template v-if="inputData.col.name === 'student'">
        {{
          inputData.props.row.student?.full_name ||
            inputData.props.row.student?.first_name ||
            inputData.props.row.student?.last_name ||
            '-'
        }}
      </template>

      <!-- ستون وضعیت -->
      <template v-else-if="inputData.col.name === 'status'">
        <q-chip
          :color="getStatusColor(inputData.props.row.status)"
          text-color="white"
          dense
          size="sm">
          {{ getStatusLabel(inputData.props.row.status) }}
        </q-chip>
      </template>

      <!-- ستون زمان صرف شده -->
      <template v-else-if="inputData.col.name === 'time_used_seconds'">
        {{ formatDuration(inputData.props.row.time_used_seconds) }}
      </template>

      <!-- ستون محدودیت زمان -->
      <template v-else-if="inputData.col.name === 'duration_limit_seconds'">
        {{ formatDuration(inputData.props.row.duration_limit_seconds) }}
      </template>

      <!-- ستون نمره -->
      <template v-else-if="inputData.col.name === 'score'">
        <span class="text-weight-bold">{{ inputData.props.row.score ?? '-' }}</span>
      </template>

      <!-- ستون درصد -->
      <template v-else-if="inputData.col.name === 'percent'">
        <span
          v-if="inputData.props.row.percent !== null && inputData.props.row.percent !== undefined"
          class="text-weight-bold">
          {{ inputData.props.row.percent }}%
        </span>
        <span v-else>-</span>
      </template>

      <!-- ستون عملیات -->
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn
            :row="inputData.props.row"
            :api="onlineExamSessionApi"
            :use-flag="false"
            @change="afterRemove" />
        </div>
      </template>

      <!-- پیش‌فرض بقیه ستون‌ها -->
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { EntityIndex } from 'quasar-crud'
import { exam } from 'src/repositories/exam'
import { ref, computed, onMounted } from 'vue'
import { useDate } from 'src/composables/Date'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import OnlineExamSessionAPI, { type OnlineExamSessionType } from 'src/repositories/onlineExamSession'

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()
const onlineExamSessionApi = new OnlineExamSessionAPI()

const examId = computed(() => parseInt(route.params.id as string))

const examName = ref<string | null>(null)
const entityIndexRef = ref()

const api = ref(onlineExamSessionApi.endpoints.base)
const label = ref('جلسات آزمون آنلاین')
const itemIdentifyKey = ref('id')

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    {
      name: 'student',
      label: 'دانش‌آموز',
      align: 'left' as const,
      field: 'student'
    },
    {
      name: 'status',
      label: 'وضعیت',
      align: 'center' as const,
      field: 'status'
    },
    {
      name: 'attempt_number',
      label: 'شماره تلاش',
      align: 'center' as const,
      field: 'attempt_number'
    },
    {
      name: 'started_at',
      label: 'شروع شده در',
      align: 'center' as const,
      field: (row: OnlineExamSessionType) =>
        row.started_at
          ? dateManager.miladiToShamsi(
            row.started_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
    },
    {
      name: 'submitted_at',
      label: 'ثبت شده در',
      align: 'center' as const,
      field: (row: OnlineExamSessionType) =>
        row.submitted_at
          ? dateManager.miladiToShamsi(
            row.submitted_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
    },
    {
      name: 'time_used_seconds',
      label: 'زمان صرف شده',
      align: 'center' as const,
      field: 'time_used_seconds'
    },
    {
      name: 'duration_limit_seconds',
      label: 'محدودیت زمان',
      align: 'center' as const,
      field: 'duration_limit_seconds'
    },
    {
      name: 'score',
      label: 'نمره',
      align: 'center' as const,
      field: 'score'
    },
    {
      name: 'percent',
      label: 'درصد',
      align: 'center' as const,
      field: 'percent'
    },
    {
      name: 'actions',
      label: 'عملیات',
      align: 'center' as const,
      field: () => ''
    }
  ]
})

// فیلترهای ارسالی به API اندپوینت index (از جمله خود exam_id آزمون فعلی)
const inputs = ref([
  {
    type: 'hidden',
    name: 'exam_id',
    value: examId.value
  },
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'started_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
  },
  {
    type: 'select',
    name: 'status',
    label: 'وضعیت جلسه',
    col: 'col-md-3 col-12',
    options: [
      { label: 'شروع نشده', value: 'not_started' },
      { label: 'در حال انجام', value: 'in_progress' },
      { label: 'ثبت شده', value: 'submitted' },
      { label: 'نمره‌گذاری شده', value: 'graded' },
      { label: 'منقضی شده', value: 'expired' }
    ]
  }
])

const statusLabels: Record<string, string> = {
  not_started: 'شروع نشده',
  in_progress: 'در حال انجام',
  submitted: 'ثبت شده',
  graded: 'نمره‌گذاری شده',
  expired: 'منقضی شده'
}

const statusColors: Record<string, string> = {
  not_started: 'grey',
  in_progress: 'primary',
  submitted: 'warning',
  graded: 'positive',
  expired: 'negative'
}

function getStatusColor (status: string | null): string {
  if (!status) return 'grey'
  return statusColors[status] ?? 'grey'
}

function getStatusLabel (status: string | null): string {
  if (!status) return '-'
  return statusLabels[status] ?? status
}

function formatDuration (seconds: number | null): string {
  if (seconds == null) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ساعت`
  }
  return `${m}:${String(s).padStart(2, '0')} دقیقه`
}

const afterRemove = () => {
  entityIndexRef.value?.reload()
  $q.notify({
    message: 'جلسه با موفقیت حذف شد.',
    type: 'positive'
  })
}

async function loadExamTitle () {
  try {
    const res = await exam.get(examId.value)
    examName.value = res.name || null
  } catch {
    // نادیده گرفتن خطا یا لاگ ساده
  }
}

function search () {
  entityIndexRef.value?.changePage()
}

onMounted(() => {
  loadExamTitle()
})
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
