<template>
  <div
    class="w-full bg-white rounded-xl pt-16 pb-12 shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#ECEDEF] flex flex-row gap-8 justify-center"
  >
    <MiniBarChart variant="conversionMetrics" :variantValues="conversionMetricsVariantValues" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const conversionMetricsVariantValues = ref<
  [[number, number, number], [number, number, number], [number, number, number]]
>([
  [48, 68, 96],
  [0.018, 0.029, 0.042],
  [2, 4, 6],
])

function randomizeConversionMetricsVariantValues() {
  function randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }
  function randomFloat(min: number, max: number, decimals = 3) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  conversionMetricsVariantValues.value = [
    [randomInt(40, 60), randomInt(60, 80), randomInt(80, 110)],
    [randomFloat(0.012, 0.022), randomFloat(0.022, 0.035), randomFloat(0.035, 0.055)],
    [randomInt(1, 3), randomInt(3, 5), randomInt(5, 8)],
  ]
}

defineExpose({ randomizeConversionMetricsVariantValues })
</script>
