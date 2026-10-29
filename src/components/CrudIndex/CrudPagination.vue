<template>
  <div class="crud-pagination row items-center justify-between full-width q-px-md q-py-sm q-gutter-md">
    <div class="row items-center q-gutter-md">
      <div class="text-caption text-grey-7">
        نمایش <b class="text-primary">{{ format(firstRow) }}</b> تا <b class="text-primary">{{ format(lastRow) }}</b>
        از <b class="text-primary">{{ format(pagination.rowsNumber) }}</b>
      </div>
      <div class="row items-center q-gutter-xs text-caption text-grey-7">
        <span>تعداد در صفحه:</span>
        <q-select
          dense
          borderless
          emit-value
          map-options
          :model-value="pagination.rowsPerPage"
          :options="rowsPerPageOptions"
          :disable="loading"
          class="crud-pagination__size"
          @update:model-value="$emit('update:rows-per-page', Number($event))" />
      </div>
    </div>
    <div class="row items-center no-wrap clean-pagination-custom">
      <q-btn
        v-for="(item, index) in displayedPages"
        :key="`${item}-${index}`"
        dense
        unelevated
        :label="typeof item === 'number' ? format(item) : item"
        :disable="loading || item === '…'"
        :class="['pagination-btn', { 'active-page': item === pagination.page, 'dots-btn': item === '…' }]"
        @click="typeof item === 'number' && $emit('change', item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CrudPaginationState } from './CrudIndex.vue'
const props = withDefaults(defineProps<{
  pagination: CrudPaginationState
  loading?: boolean
  rowsPerPageOptions?: number[]
}>(), { loading: false, rowsPerPageOptions: () => [5, 10, 20, 50] })
defineEmits<{ (event: 'change', page: number): void; (event: 'update:rows-per-page', value: number): void }>()
const totalPages = computed(() => Math.max(1, Math.ceil(props.pagination.rowsNumber / props.pagination.rowsPerPage)))
const firstRow = computed(() => props.pagination.rowsNumber === 0 ? 0 : (props.pagination.page - 1) * props.pagination.rowsPerPage + 1)
const lastRow = computed(() => Math.min(props.pagination.page * props.pagination.rowsPerPage, props.pagination.rowsNumber))
const displayedPages = computed<(number | string)[]>(() => {
  const current = props.pagination.page
  const max = totalPages.value
  if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', max]
  if (current >= max - 3) return [1, '…', max - 4, max - 3, max - 2, max - 1, max]
  return [1, '…', current - 1, current, current + 1, '…', max]
})
function format (value: number) { return value.toLocaleString('fa-IR') }
</script>

<style lang="scss" scoped>
.crud-pagination { min-height: 56px; }
.crud-pagination__size { min-width: 58px; }
.clean-pagination-custom { direction: ltr; }
.clean-pagination-custom .pagination-btn {
  width: 32px; height: 32px; min-width: 32px; min-height: 32px; padding: 0; border-radius: 6px;
  margin: 0 2px; border: 1px solid rgba(0, 0, 0, .12); font-size: 13px; font-weight: 600;
  background: #fff; color: #424242;
}
.clean-pagination-custom .pagination-btn.active-page { background: var(--q-primary); color: #fff; border-color: var(--q-primary); }
.clean-pagination-custom .pagination-btn.dots-btn { pointer-events: none; opacity: .85; }
@media (max-width: 700px) {
  .crud-pagination { justify-content: center; }
}
</style>
