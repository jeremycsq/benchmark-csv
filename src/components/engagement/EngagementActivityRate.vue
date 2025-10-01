<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#C1E3B1] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Activity Rate</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm h-auto md:w-2/3 md:mt-0 border border-[#C1E3B1] flex flex-row justify-center pt-8 pb-8"
    >
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#000] mb-4">Overall</span>
        <PieChart :values="pieData.overall" :labels="pieLabels" :colors="engagementColors" />
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#000] mb-4">New Visitors</span>
        <PieChart :values="pieData.newVisitors" :labels="pieLabels" :colors="engagementColors" />
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#000] mb-4">Returning Visitors</span>
        <PieChart
          :values="pieData.returningVisitors"
          :labels="pieLabels"
          :colors="engagementColors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import { randomizePieChartData } from '@/config/charts/PieChartData'
import { getChartColors } from '@/config/theme'

const pieLabels = ['25th', 'Benchmark', '75th']
const pieData = reactive(randomizePieChartData())

// Couleurs du thème engagement
const engagementColors = [
  getChartColors('engagement').primary, // #C1E3B1 - vert clair
  getChartColors('engagement').tertiary, // #2E614F - vert foncé
  getChartColors('engagement').secondary, // #6D9A7A - vert moyen
]

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  updatePieData: () => {
    const newData = randomizePieChartData()
    Object.assign(pieData, newData)
  },
})
</script>
