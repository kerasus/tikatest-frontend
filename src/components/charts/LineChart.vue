<template>
  <div class="line-chart">
    <div class="chart-legend">
      <div
        v-for="(item, i) in data"
        :key="i"
        class="legend-item">
        <span
          class="dot"
          :style="{ backgroundColor: colors[i % colors.length] }" />
        <span class="legend-label">{{ item.label }}</span>
        <span class="legend-value">{{ formatNumber(item.value) }}</span>
      </div>
    </div>
    <div class="chart-container">
      <svg
        width="280"
        height="160"
        class="chart-svg">
        <g class="y-axis">
          <line
            x1="20"
            y1="180"
            x2="280"
            y2="180"
            stroke="#ccc"
            stroke-width="1" />
          <line
            x1="20"
            y1="20"
            x2="20"
            y2="180"
            stroke="#ccc"
            stroke-width="1" />
        </g>
        <polyline
          v-if="data.length > 0"
          :points="points"
          stroke="#0d1deb"
          stroke-width="2"
          fill="none" />
        <circle
          v-for="(p, i) in pointsArray"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="4"
          :fill="colors[i % colors.length]" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartItem {
  label: string
  value: number
}

const props = defineProps<{
  data: ChartItem[]
  labels: string[]
  colors?: string[]
}>()

const defaultColors = ['#0d1deb', '#05f706', '#fa0a05']
const colors = computed(() => props.colors || defaultColors)

function formatNumber (val: number): string {
  return Number(val).toLocaleString('fa-IR')
}

const pointsArray = computed(() => {
  if (!props.data || props.data.length === 0) return []

  const values = props.data.map((d) => d.value || 0)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values, 0)
  const range = maxVal - minVal || 1
  const padding = 20
  const width = 280
  const height = 180
  const plotHeight = height - padding * 2
  const plotWidth = width - padding * 2

  return props.data.map((d, i) => {
    const val = d.value || 0
    const y = padding + plotHeight - ((val - minVal) / range) * plotHeight
    const x = padding + (d.value === 0 && props.data.length === 1 ? 0 : i / (props.data.length > 1 ? props.data.length - 1 : 1) * plotWidth)
    return { x, y }
  })
})

const points = computed(() => {
  return pointsArray.value.map((p) => `${p.x},${p.y}`).join(' ')
})
</script>

<style scoped>
.line-chart {
  font-family: Tahoma, sans-serif;
}
.chart-container {
  direction: ltr;
  margin-top: 10px;
}
.chart-svg {
  font-size: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 8px;
}
.legend-label {
  min-width: 60px;
  margin-left: 8px;
}
.legend-value {
  margin-right: auto;
  font-weight: bold;
}
</style>
