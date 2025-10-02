<template>
  <div class="bg-white rounded-xl shadow-sm border border-[#FEF3E2] p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ metric.icon }}</span>
        <div>
          <h3 class="font-medium text-gray-900 text-sm">{{ metric.title }}</h3>
          <p class="text-xs text-gray-500">{{ metric.unit }}</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold" :class="valueColor">{{ formattedValue }}</span>
        <span class="text-sm text-gray-500">{{ metric.unit }}</span>
      </div>
    </div>

    <!-- Changements YoY et MoM -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">YoY:</span>
        <span :class="yoyChangeColor" class="font-medium flex items-center gap-1">
          <span class="text-xs">{{ yoyChangeIcon }}</span>
          {{ formatChange(metric.yoyChange) }}
        </span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">MoM:</span>
        <span :class="momChangeColor" class="font-medium flex items-center gap-1">
          <span class="text-xs">{{ momChangeIcon }}</span>
          {{ formatChange(metric.momChange) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MetricValue {
  key: string
  title: string
  value: number
  yoyChange: number
  momChange: number
  icon: string
  format: 'percentage' | 'score' | 'rate'
  unit: string
}

const props = defineProps<{
  metric: MetricValue
}>()

const formattedValue = computed(() => {
  if (props.metric.format === 'percentage') {
    return `${Math.round(props.metric.value * 10) / 10}` // Arrondir à 1 décimale
  } else {
    return Math.round(props.metric.value).toString()
  }
})

const valueColor = computed(() => {
  // Couleur basée sur la valeur (vert si bas, rouge si haut)
  if (props.metric.value < 20) return 'text-green-600'
  if (props.metric.value < 40) return 'text-yellow-600'
  return 'text-red-600'
})

const yoyChangeColor = computed(() => {
  return props.metric.yoyChange >= 0 ? 'text-red-600' : 'text-green-600'
})

const momChangeColor = computed(() => {
  return props.metric.momChange >= 0 ? 'text-red-600' : 'text-green-600'
})

const yoyChangeIcon = computed(() => {
  return props.metric.yoyChange >= 0 ? '↗' : '↘'
})

const momChangeIcon = computed(() => {
  return props.metric.momChange >= 0 ? '↗' : '↘'
})

const formatChange = (change: number) => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${Math.round(change * 10) / 10}%`
}
</script>
</template>

<style scoped>
.metric-card {
  @apply bg-white rounded-xl shadow-sm border border-[#FEF3E2] p-6;
}
</style>
