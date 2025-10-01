<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Scroll Rate</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm h-auto md:w-2/3 md:mt-0 border border-[#E9F5E4] flex flex-row justify-center pt-8 pb-8"
    >
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#2E614F]">Overall</span>
        <StackedBarChart
          :values="stackedBarData.overall"
          :colors="['#C1E3B1', '#2E614F', '#6D9A7A']"
          :labels="['25th', 'Benchmark', '75th']"
          units="%"
        />
        <div class="flex flex-col justify-center gap-2 mt-2">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#C1E3B1' }" />
            <span class="text-xs text-[#2E614F]">25th : {{ stackedBarData.overall[0] }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]">Benchmark : {{ stackedBarData.overall[1] }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]">75th : {{ stackedBarData.overall[2] }}%</span>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#2E614F]">New Visitors</span>
        <StackedBarChart
          :values="stackedBarData.newVisitors"
          :colors="['#C1E3B1', '#2E614F', '#6D9A7A']"
          :labels="['25th', 'Benchmark', '75th']"
          units="%"
        />
        <div class="flex flex-col justify-center gap-2 mt-2">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#C1E3B1' }" />
            <span class="text-xs text-[#2E614F]">25th : {{ stackedBarData.newVisitors[0] }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]"
              >Benchmark : {{ stackedBarData.newVisitors[1] }}%</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]">75th : {{ stackedBarData.newVisitors[2] }}%</span>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-[#2E614F]">Returning Visitors</span>
        <StackedBarChart
          :values="stackedBarData.returningVisitors"
          :colors="['#C1E3B1', '#2E614F', '#6D9A7A']"
          :labels="['25th', 'Benchmark', '75th']"
          units="%"
        />
        <div class="flex flex-col justify-center gap-2 mt-2">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#C1E3B1' }" />
            <span class="text-xs text-[#2E614F]"
              >25th : {{ stackedBarData.returningVisitors[0] }}%</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]"
              >Benchmark : {{ stackedBarData.returningVisitors[1] }}%</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full" :style="{ background: '#6D9A7A' }" />
            <span class="text-xs text-[#2E614F]"
              >75th : {{ stackedBarData.returningVisitors[2] }}%</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { StackedBarChart } from '@/components/charts'

// Ajoute une fonction pour générer des valeurs random pour le StackedBarBenchmarkChart
function randomStackedBarValues() {
  // Pourcentage entre 50 et 85
  const arr = [
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
  ]
  // Tri décroissant pour l'effet visuel
  return arr.sort((a, b) => b - a)
}

const stackedBarData = reactive({
  overall: randomStackedBarValues(),
  newVisitors: randomStackedBarValues(),
  returningVisitors: randomStackedBarValues(),
})

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  updateStackedBarData: () => {
    stackedBarData.overall = randomStackedBarValues()
    stackedBarData.newVisitors = randomStackedBarValues()
    stackedBarData.returningVisitors = randomStackedBarValues()
  },
})
</script>
