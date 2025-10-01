<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up mb-4">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="h-2 w-8 rounded bg-[#C1E3B1]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">Pageviews Per Session</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">Time Per Session</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="h-2 w-8 rounded bg-[#6D9A7A]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">Scroll Rate</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#E9F5E4] flex flex-col gap-10 justify-center pt-16 pb-12"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          v-for="(item, idx) in barData"
          :key="'engagement-bar-' + String(idx)"
          :values="item.values"
          :colors="config.labelColors"
          :label="item.label"
          :display="item.display"
          labelColor="#2E614F"
          valueColor="#2E614F"
          metricLabelColor="#ADD2A5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getBarChartConfig } from '@/config/charts/barChartData'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const config = getBarChartConfig('engagement')
const barData = ref(config.data)

// Génération des données randomisées
function randomFloat(min: number, max: number, decimals = 2) {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}

function randomizeBarData() {
  barData.value.splice(
    0,
    barData.value.length,
    {
      label: 'Pageviews per Session',
      values: [randomFloat(1.8, 2.4), randomFloat(2.8, 3.8), randomFloat(4.2, 5.2)],
      display: (val: number) => val.toFixed(2),
    },
    {
      label: 'Time per Session',
      values: [randomFloat(90, 110), randomFloat(120, 140), randomFloat(160, 180)],
      display: (val: number) => {
        const total = Math.round(val)
        const minPart = Math.floor(total / 60)
        const secPart = total % 60
        return `${minPart}:${secPart.toString().padStart(2, '0')}`
      },
    },
    {
      label: 'Scroll Rate',
      values: [randomFloat(55, 60), randomFloat(65, 70), randomFloat(75, 80)],
      display: (val: number) => val.toFixed(1) + '%',
    },
  )
}

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  randomizeBarData,
})
</script>
