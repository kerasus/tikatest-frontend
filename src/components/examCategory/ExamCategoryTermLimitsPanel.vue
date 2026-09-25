<template>
  <entity-index
    :key="examId ?? 'all'"
    ref="entityIndexRef"
    :value="inputs"
    title="محدودیت دفعات آزمون در ترم"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="false"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="true"
    :show-search-button="false"
    :show-export-table-button="false"
    :row-key="itemIdentifyKey">
    <template #before-index-table>
      <div class="q-pa-md">
        <div class="text-caption text-grey-7 q-mb-md">
          مقدار خالی یعنی نامحدود و مقدار صفر یعنی برگزاری آزمون در آن ترم ممنوع است.
        </div>

        <div
          v-if="!readonly"
          class="row q-col-gutter-md items-start">
          <div class="col-12 col-md-7">
            <q-select
              v-model="newLimit.term_id"
              :options="termOptions"
              :loading="termsLoading"
              option-value="id"
              :option-label="termLabel"
              label="ترم *"
              outlined
              emit-value
              map-options
              use-input
              clearable
              @filter="filterTerms" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model.number="newLimit.max_occurrences"
              type="number"
              min="0"
              label="حداکثر دفعات"
              hint="خالی = نامحدود"
              outlined />
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              class="full-width"
              color="primary"
              icon="add"
              label="افزودن"
              :loading="creating"
              :disable="!examId || !newLimit.term_id"
              @click="createLimit" />
          </div>
        </div>
      </div>
    </template>

    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'category'">
        {{ inputData.props.row.exam_category?.title || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'school'">
        {{ inputData.props.row.term?.school?.name || inputData.props.row.exam_category?.school?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'term'">
        {{ inputData.props.row.term?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'max_occurrences'">
        <q-chip
          v-if="readonly"
          dense
          :color="limitColor(inputData.props.row.max_occurrences)"
          text-color="white">
          {{ limitLabel(inputData.props.row.max_occurrences) }}
        </q-chip>
        <q-input
          v-else
          v-model.number="inputData.props.row.max_occurrences"
          type="number"
          min="0"
          dense
          outlined
          placeholder="نامحدود"
          :disable="isSaving(inputData.props.row.id)"
          @update:model-value="markAsChanged(inputData.props.row.id)" />
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="save"
            :loading="isSaving(inputData.props.row.id)"
            :disable="!changedIds.has(inputData.props.row.id)"
            @click="updateLimit(inputData.props.row)" />
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            :loading="isDeleting(inputData.props.row.id)"
            @click="deleteLimit(inputData.props.row)" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import AcademicTermAPI, { type AcademicTermType } from 'src/repositories/academicTerm'
import {
  examCategoryTermLimit,
  type ExamCategoryTermLimitPayload,
  type ExamCategoryTermLimitType
} from 'src/repositories/examCategoryTermLimit'

const props = withDefaults(defineProps<{
  examId: number
  schoolId?: number | null
  readonly?: boolean
}>(), {
  schoolId: null,
  readonly: false
})

const $q = useQuasar()
const entityIndexRef = ref()
const termOptions = ref<AcademicTermType[]>([])
const existingTermIds = ref(new Set<number | null>())
const termsLoading = ref(false)
const creating = ref(false)
const savingIds = ref(new Set<number | null>())
const deletingIds = ref(new Set<number | null>())
const changedIds = ref(new Set<number | null>())
const api = ref(examCategoryTermLimit.endpoints.base)
const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})
const newLimit = ref<ExamCategoryTermLimitPayload>({
  exam_category_id: props.examId,
  term_id: null,
  max_occurrences: null
})

const inputs = computed(() => {
  return [
    { type: 'hidden', name: 'sortation_field', value: 'created_at' },
    { type: 'hidden', name: 'sortation_order', value: 'desc' },
    { type: 'hidden', name: 'length', value: 10 },
    { type: 'hidden', name: 'exam_category_id', value: props.examId }
  ]
})

const table = computed(() => {
  const columns: Array<Record<string, unknown>> = []
  columns.push({ name: 'term', label: 'ترم', field: 'term', align: 'right' })
  columns.push({
    name: 'max_occurrences',
    label: 'حداکثر دفعات',
    field: 'max_occurrences',
    align: 'center',
    sortable: true
  })
  if (!props.readonly) {
    columns.push({ name: 'actions', label: 'عملیات', field: () => '', align: 'center' })
  }
  return { columns }
})

function normalizeMaxOccurrences (value: number | string | null): number | null {
  if (value === null || value === '') return null
  return Math.max(0, Number(value))
}

function limitLabel (value: number | null): string {
  if (value === null) return 'نامحدود'
  if (value === 0) return 'ممنوع'
  return `${value} بار`
}

function limitColor (value: number | null): string {
  if (value === null) return 'positive'
  if (value === 0) return 'negative'
  return 'primary'
}

function termLabel (term: AcademicTermType): string {
  if (!term) return ''
  return term.school?.name ? `${term.name} - ${term.school.name}` : term.name || '-'
}

async function loadExistingTermIds () {
  if (!props.examId || props.readonly) return
  try {
    const limits = await examCategoryTermLimit.all({ exam_category_id: props.examId })
    existingTermIds.value = new Set(limits.map((limit) => limit.term_id))
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در دریافت محدودیت‌های آزمون' })
  }
}

async function loadTerms (name = '') {
  if (props.readonly) return
  termsLoading.value = true
  try {
    await loadExistingTermIds()
    const filters: Record<string, number | string> = { length: 100 }
    if (props.schoolId) filters.school_id = props.schoolId
    if (name) filters.name = name
    const academicTermAPI = new AcademicTermAPI(props.schoolId)
    const response = await academicTermAPI.index(filters)
    termOptions.value = response.data.filter((term) => !existingTermIds.value.has(term.id))
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در دریافت فهرست ترم‌ها' })
  } finally {
    termsLoading.value = false
  }
}

function filterTerms (value: string, update: (callback: () => Promise<void>) => void) {
  update(() => loadTerms(value))
}

async function reloadList () {
  changedIds.value = new Set()
  entityIndexRef.value?.reload()
  await loadTerms()
}

async function createLimit () {
  if (!props.examId || !newLimit.value.term_id) return
  creating.value = true
  try {
    await examCategoryTermLimit.create({
      exam_category_id: props.examId,
      term_id: newLimit.value.term_id,
      max_occurrences: normalizeMaxOccurrences(newLimit.value.max_occurrences)
    } as ExamCategoryTermLimitType)
    newLimit.value.term_id = null
    newLimit.value.max_occurrences = null
    await reloadList()
    $q.notify({ type: 'positive', message: 'محدودیت با موفقیت ثبت شد.' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در ثبت محدودیت' })
  } finally {
    creating.value = false
  }
}

function markAsChanged (id: number | null) {
  changedIds.value = new Set(changedIds.value).add(id)
}

function isSaving (id: number | null): boolean {
  return savingIds.value.has(id)
}

function isDeleting (id: number | null): boolean {
  return deletingIds.value.has(id)
}

async function updateLimit (limit: ExamCategoryTermLimitType) {
  if (!limit.id) return
  savingIds.value = new Set(savingIds.value).add(limit.id)
  try {
    const result = await examCategoryTermLimit.update(limit.id, {
      exam_category_id: limit.exam_category_id,
      term_id: limit.term_id,
      max_occurrences: normalizeMaxOccurrences(limit.max_occurrences)
    } as ExamCategoryTermLimitType)
    if (result instanceof Error) throw result
    changedIds.value.delete(limit.id)
    changedIds.value = new Set(changedIds.value)
    $q.notify({ type: 'positive', message: 'محدودیت بروزرسانی شد.' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در بروزرسانی محدودیت' })
  } finally {
    savingIds.value.delete(limit.id)
    savingIds.value = new Set(savingIds.value)
  }
}

function deleteLimit (limit: ExamCategoryTermLimitType) {
  if (!limit.id) return
  $q.dialog({
    title: 'حذف محدودیت',
    message: `محدودیت ترم «${limit.term?.name || ''}» حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    deletingIds.value = new Set(deletingIds.value).add(limit.id)
    try {
      await examCategoryTermLimit.delete(limit.id as number)
      await reloadList()
      $q.notify({ type: 'positive', message: 'محدودیت حذف شد.' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'خطا در حذف محدودیت' })
    } finally {
      deletingIds.value.delete(limit.id)
      deletingIds.value = new Set(deletingIds.value)
    }
  })
}

watch(() => props.examId, async (id) => {
  newLimit.value.exam_category_id = id
  await loadTerms()
})

watch(() => props.schoolId, () => loadTerms())

onMounted(() => loadTerms())
</script>

<style scoped>
.action-column {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
