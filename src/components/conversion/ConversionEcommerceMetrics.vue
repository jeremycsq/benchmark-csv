<template>
  <div class="flex flex-col md:flex-row mt-8 mb-12">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
      >
        <div class="text-gray-600 font-newedge pt-1 font-medium">E-Commerce Conversion</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#ECEDEF] flex flex-col gap-10 justify-center pt-16 pb-12"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          :values="conversionMiniBarData[0] as [number, number, number]"
          :colors="['#ECEDEF', '#626B76', '#32373A']"
          label="Overall Conversion Rate"
          :display="(v) => v.toFixed(1) + '%'"
          labelColor="#32373A"
        />
        <MiniBarChart
          :values="conversionMiniBarData[1] as [number, number, number]"
          :colors="['#ECEDEF', '#626B76', '#32373A']"
          label="New Visitor Conversion Rate"
          :display="(v) => v.toFixed(1) + '%'"
          labelColor="#32373A"
        />
        <MiniBarChart
          :values="conversionMiniBarData[2] as [number, number, number]"
          :colors="['#ECEDEF', '#626B76', '#32373A']"
          label="Returning Visitor Conversion Rate"
          :display="(v) => v.toFixed(1) + '%'"
          labelColor="#32373A"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const conversionMiniBarData = ref([
  [2.1, 3.4, 4.8],
  [1.8, 2.9, 4.2],
  [3.2, 4.7, 6.8],
])

function randomizeConversionMiniBarData() {
  function randomFloat(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  conversionMiniBarData.value = [
    [randomFloat(1.5, 3.0), randomFloat(2.5, 4.0), randomFloat(4.0, 5.5)],
    [randomFloat(1.2, 2.5), randomFloat(2.2, 3.5), randomFloat(3.5, 4.8)],
    [randomFloat(2.5, 4.0), randomFloat(4.0, 5.5), randomFloat(5.5, 7.0)],
  ]
}

defineExpose({ randomizeConversionMiniBarData })
</script>
