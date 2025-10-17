<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up mb-4">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${theme.accent}` }"
      >
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.primary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">Overall</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${theme.accent}` }"
      >
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.secondary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">New Visitors</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.tertiary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
          Returning Visitors
        </div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border flex flex-col gap-10 justify-center pt-16 pb-12"
      :style="{ border: `1px solid ${theme.accent}` }"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          v-for="(item, idx) in barData"
          :key="'scroll-rate-bar-' + String(idx)"
          :values="item.values"
          :colors="labelColors"
          :label="item.label"
          :display="item.display"
          :labelColor="theme.primary"
          :valueColor="theme.text"
          :metricLabelColor="theme.text"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'
import { getPageTheme, getChartColors } from '@/config/theme'

const theme = computed(() => getPageTheme('engagement'))
const chartColors = computed(() => getChartColors('engagement'))

type Triple = [number, number, number]
type BarItem = { label: string; values: Triple; display: (v: number) => string }

const labelColors = computed<[string, string, string]>(() => [
  chartColors.value.primary,
  chartColors.value.secondary,
  chartColors.value.tertiary,
])

// Ajoute une fonction pour générer des valeurs random pour le MiniBarChart
function randomBarValues(): Triple {
  // Pourcentage entre 50 et 85
  const arr = [
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
  ]
  // Tri décroissant pour l'effet visuel
  return arr.sort((a, b) => b - a) as Triple
}

const barData = ref<BarItem[]>([
  {
    label: 'Overall',
    values: randomBarValues(),
    display: (v: number) => v.toFixed(1) + '%',
  },
  {
    label: 'New Visitors',
    values: randomBarValues(),
    display: (v: number) => v.toFixed(1) + '%',
  },
  {
    label: 'Returning Visitors',
    values: randomBarValues(),
    display: (v: number) => v.toFixed(1) + '%',
  },
])

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  updateStackedBarData: () => {
    barData.value[0].values = randomBarValues()
    barData.value[1].values = randomBarValues()
    barData.value[2].values = randomBarValues()
  },
})
</script>
