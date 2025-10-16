<template>
  <div class="flex items-end gap-8">
    <div class="flex flex-col items-center">
      <span class="text-sm mb-2" :style="{ color: labelColor }">{{ values[0].toFixed(1) }}%</span>
      <div class="w-14 rounded-t-lg" :style="{ height: h(values[0]), background: colors[0] }"></div>
      <span class="mt-3 text-base" :style="{ color: labelColor }">25th</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-sm mb-2" :style="{ color: labelColor }">{{ values[1].toFixed(1) }}%</span>
      <div class="w-14 rounded-t-lg" :style="{ height: h(values[1]), background: colors[1] }"></div>
      <span class="mt-3 text-base" :style="{ color: labelColor }">Benchmark</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-sm mb-2" :style="{ color: labelColor }">{{ values[2].toFixed(1) }}%</span>
      <div class="w-14 rounded-t-lg" :style="{ height: h(values[2]), background: colors[2] }"></div>
      <span class="mt-3 text-base" :style="{ color: labelColor }">75th</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    values: [number, number, number]
    colors: [string, string, string]
    max?: number
    labelColor?: string
  }>(),
  { max: 100, labelColor: '#2E2E2E' },
)

function h(v: number) {
  const clamped = Math.max(0, Math.min(props.max, v))
  const pct = (clamped / props.max) * 160 + 40 // hauteur minimale visible
  return `${pct}px`
}
</script>
