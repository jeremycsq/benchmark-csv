<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up mb-4">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="h-2 w-8 rounded bg-[#C1E3B1]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">Overall</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">New Visitors</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="h-2 w-8 rounded bg-[#6D9A7A]"></div>
        <div class="text-[#000000] font-newedge pt-1 font-medium">Returning Visitors</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#E9F5E4] flex flex-col gap-10 justify-center pt-16 pb-12"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          v-for="(item, idx) in barData"
          :key="'scroll-rate-bar-' + String(idx)"
          :values="item.values"
          :colors="labelColors"
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
import { ref } from 'vue'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

type Triple = [number, number, number]
type BarItem = { label: string; values: Triple; display: (v: number) => string }

const labelColors: [string, string, string] = ['#C1E3B1', '#2E614F', '#6D9A7A']

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
