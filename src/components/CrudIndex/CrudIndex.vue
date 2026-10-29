<template>
  <entity-index-card>
    <template #title><slot name="title">{{ title }}</slot></template>
    <template #subtitle><slot name="subtitle">{{ subtitle }}</slot></template>
    <template #header-actions>
      <slot
        name="header-actions"
        :loading="loading"
        :search="search"
        :reset="reset"
        :refresh="refresh"
        :pagination="pagination">
        <q-btn
          v-if="createButton"
          icon="add"
          :to="createButton.to">
          <q-tooltip>{{ createButton.tooltip }}</q-tooltip>
        </q-btn>
        <q-btn
          icon="search"
          :loading="loading"
          @click="() => search()">
          <q-tooltip>جستجو و اعمال فیلترها</q-tooltip>
        </q-btn>
        <q-btn
          icon="filter_alt_off"
          :loading="loading"
          @click="() => reset()">
          <q-tooltip>حذف فیلترها</q-tooltip>
        </q-btn>
      </slot>
    </template>
    <template #filters><slot
      name="filters"
      :loading="loading"
      :search="search"
      :reset="reset"
      :refresh="refresh"
      :pagination="pagination" /></template>

    <slot
      name="table"
      :rows="rows"
      :loading="loading"
      :pagination="pagination"
      :table-props="tableProps"
      :search="search"
      :reset="reset"
      :on-request="onTableRequest"
      :refresh="refresh">
      <q-table
        v-bind="tableProps"
        v-model:pagination="pagination"
        :rows="rows"
        :loading="loading"
        @request="onTableRequest" />
    </slot>

    <template #footer>
      <slot
        name="pagination"
        :pagination="pagination"
        :loading="loading"
        :change-page="changePage"
        :change-rows-per-page="changeRowsPerPage">
        <crud-pagination
          :pagination="pagination"
          :loading="loading"
          :rows-per-page-options="rowsPerPageOptions"
          @change="changePage"
          @update:rows-per-page="changeRowsPerPage" />
      </slot>
    </template>
  </entity-index-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { QTableProps } from 'quasar'
import EntityIndexCard from './EntityIndexCard.vue'
import CrudPagination from './CrudPagination.vue'

export interface CrudPaginationState {
  page: number
  rowsPerPage: number
  rowsNumber: number
  sortBy: string | null
  descending: boolean
}
export type CrudRequest = (filters: Record<string, unknown>, pagination: CrudPaginationState) => Promise<unknown>

const props = withDefaults(defineProps<{
  request: CrudRequest
  getFilters?: () => Record<string, unknown>
  initialFilters?: Record<string, unknown>
  initialPagination?: Partial<CrudPaginationState>
  rowsPerPageOptions?: number[]
  autoLoad?: boolean
  title?: string
  subtitle?: string
  createButton?: { tooltip?: string; to?: Record<string, unknown> }
}>(), {
  initialFilters: () => ({}),
  initialPagination: () => ({}),
  rowsPerPageOptions: () => [5, 10, 20, 50],
  autoLoad: true,
  title: '',
  subtitle: ''
})
const emit = defineEmits<{
  (event: 'loaded', response: unknown): void
  (event: 'error', error: unknown): void
  (event: 'reset'): void
}>()

const rows = ref<unknown[]>([])
const loading = ref(false)
const pagination = ref<CrudPaginationState>({
  page: props.initialPagination.page ?? 1,
  rowsPerPage: props.initialPagination.rowsPerPage ?? 10,
  rowsNumber: props.initialPagination.rowsNumber ?? 0,
  sortBy: props.initialPagination.sortBy ?? null,
  descending: props.initialPagination.descending ?? false
})
let latestRequest = 0

// Accepts common paginator payloads: {data,total}, {data:{data,total}}, {items,total}.
function normalizeResponse (response: any) {
  const payload = response?.data && !Array.isArray(response.data) && Array.isArray(response.data.data)
    ? response.data
    : response?.data && Array.isArray(response.data) ? response : response
  const resultRows = payload?.data ?? payload?.items ?? payload?.results ?? []
  const total = Number(payload?.total ?? payload?.meta?.total ?? payload?.pagination?.total ?? 0)
  const lastPage = Number(payload?.last_page ?? payload?.meta?.last_page ?? payload?.pagination?.last_page ?? Math.max(1, Math.ceil(total / pagination.value.rowsPerPage)))
  return { rows: Array.isArray(resultRows) ? resultRows : [], total, lastPage }
}

async function load () {
  const requestNumber = ++latestRequest
  loading.value = true
  try {
    const response = await props.request(props.getFilters ? props.getFilters() : {}, { ...pagination.value })
    if (requestNumber !== latestRequest) return
    const result = normalizeResponse(response)
    if (pagination.value.page > result.lastPage && result.total > 0) {
      pagination.value.page = result.lastPage
      await load()
      return
    }
    rows.value = result.rows
    pagination.value.rowsNumber = result.total
    emit('loaded', response)
  } catch (error) {
    if (requestNumber === latestRequest) emit('error', error)
  } finally {
    if (requestNumber === latestRequest) loading.value = false
  }
}

function search (nextFilters?: Record<string, unknown>) {
  pagination.value.page = 1
  void load()
}
function reset () { emit('reset') }
function searchFromFirstPage () { pagination.value.page = 1; void load() }
function refresh () { return load() }
function changePage (page: number) {
  if (page < 1 || page === pagination.value.page) return
  pagination.value.page = page
  void load()
}
function changeRowsPerPage (value: number) {
  if (!value || value === pagination.value.rowsPerPage) return
  pagination.value.rowsPerPage = value
  pagination.value.page = 1
  void load()
}
function onTableRequest (request: { pagination: Partial<CrudPaginationState> }) {
  Object.assign(pagination.value, request.pagination)
  void load()
}
const tableProps = computed(() => ({
  rows: rows.value,
  loading: loading.value,
  pagination: pagination.value,
  rowsPerPageOptions: props.rowsPerPageOptions,
  'onUpdate:pagination': (value: CrudPaginationState) => Object.assign(pagination.value, value),
  onRequest: onTableRequest
} as QTableProps))

onMounted(() => { if (props.autoLoad) void load() })
defineExpose({ search, reset, refresh, load, searchFromFirstPage, rows, pagination })
</script>

<style lang="scss" scoped>
.q-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  .q-icon {
    font-size: 1.25rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-2px) scale(1.06);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);

    .q-icon {
      transform: rotate(6deg) scale(1.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }
}
</style>
