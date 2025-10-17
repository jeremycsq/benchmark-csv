<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${theme.accent}` }"
      >
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
          Activity Rate
        </div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl h-auto md:w-2/3 md:mt-0 border flex flex-row justify-center pt-8 pb-8"
      :style="{ border: `1px solid ${theme.accent}` }"
    >
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs mb-4" :style="{ color: theme.text }">Overall</span>
        <PieChart
          :values="pieData.overall"
          :labels="pieLabels"
          :colors="engagementColors"
          :show-labels="true"
        />
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs mb-4" :style="{ color: theme.text }">New Visitors</span>
        <PieChart
          :values="pieData.newVisitors"
          :labels="pieLabels"
          :colors="engagementColors"
          :show-labels="true"
        />
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs mb-4" :style="{ color: theme.text }">Returning Visitors</span>
        <PieChart
          :values="pieData.returningVisitors"
          :labels="pieLabels"
          :colors="engagementColors"
          :show-labels="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import { randomizePieChartData } from '@/config/charts/PieChartData'
import { getChartColors, getPageTheme } from '@/config/theme'

const pieLabels = ['25th', 'Benchmark', '75th']
const pieData = reactive(randomizePieChartData())

// Thème et couleurs d'engagement
const theme = computed(() => getPageTheme('engagement'))
const chartColors = computed(() => getChartColors('engagement'))
const engagementColors = computed(() => [
  chartColors.value.primary,
  chartColors.value.tertiary,
  chartColors.value.secondary,
])

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  updatePieData: () => {
    const newData = randomizePieChartData()
    Object.assign(pieData, newData)
  },
})
</script>
