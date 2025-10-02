<template>
  <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div class="flex items-center gap-3">
      <span class="text-lg">{{ metric.icon }}</span>
      <div>
        <span class="font-medium text-gray-900 text-sm">{{ metric.title }}</span>
      </div>
    </div>

    <div class="text-right">
      <div :class="changeColor" class="font-semibold text-lg flex items-center gap-1">
        <span class="text-sm">{{ changeIcon }}</span>
        {{ formatChange(metric.currentChange) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MetricValueWithChange {
  key: string
  title: string
  value: number
  yoyChange: number
  momChange: number
  icon: string
  format: 'percentage' | 'score' | 'rate'
  unit: string
  currentChange: number
  changeType: 'YoY' | 'MoM'
}

const props = defineProps<{
  metric: MetricValueWithChange
}>()

const changeColor = computed(() => {
  return props.metric.currentChange >= 0 ? 'text-red-600' : 'text-green-600'
})

const changeIcon = computed(() => {
  return props.metric.currentChange >= 0 ? '↗' : '↘'
})

const formatChange = (change: number) => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${Math.round(change * 10) / 10}%`
}
</script>
</template>

<style scoped>
.metric-row {
  @apply flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0;
}
</style>
