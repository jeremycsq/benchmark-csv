<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottomColor: theme.accent }"
      >
        <div class="font-newedge pt-1 font-medium">Time spent per Session</div>
      </div>
    </div>
    <div
      class="w-full rounded-xl h-auto md:w-2/3 md:mt-0 border flex flex-row justify-center pt-8 pb-8"
      :style="{ borderColor: theme.accent }"
    >
      <div v-if="radialData && radialData.overall" class="flex-1 flex flex-col items-center">
        <span class="text-xs" :style="{ color: theme.text }">Overall</span>
        <RadialChart
          :values="radialData.overall.values"
          :colors="radialData.overall.colors"
          height="120px"
          :labelColor="theme.text"
          :valueColor="theme.text"
          :metricLabelColor="theme.text"
        />
        <div class="flex flex-col justify-center gap-2">
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.overall.colors[0] }"
            />
            <span class="text-xs">25th : {{ formatTime(radialData.overall.values[0]) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.overall.colors[1] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >Benchmark : {{ formatTime(radialData.overall.values[1]) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.overall.colors[2] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >75th : {{ formatTime(radialData.overall.values[2]) }}</span
            >
          </div>
        </div>
      </div>
      <div v-if="radialData && radialData.newVisitors" class="flex-1 flex flex-col items-center">
        <span class="text-xs" :style="{ color: theme.text }">New Visitors</span>
        <RadialChart
          :values="radialData.newVisitors.values"
          :colors="radialData.newVisitors.colors"
          height="120px"
          :labelColor="theme.text"
          :valueColor="theme.text"
          :metricLabelColor="theme.text"
        />
        <div class="flex flex-col gap-2 justify-center">
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.newVisitors.colors[0] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >25th : {{ formatTime(radialData.newVisitors.values[0]) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.newVisitors.colors[1] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >Benchmark : {{ formatTime(radialData.newVisitors.values[1]) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.newVisitors.colors[2] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >75th : {{ formatTime(radialData.newVisitors.values[2]) }}</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="radialData && radialData.returningVisitors"
        class="flex-1 flex flex-col items-center"
      >
        <span class="text-xs" :style="{ color: theme.text }">Returning Visitors</span>
        <RadialChart
          :values="radialData.returningVisitors.values"
          :colors="radialData.returningVisitors.colors"
          height="120px"
          :labelColor="theme.text"
          :valueColor="theme.text"
          :metricLabelColor="theme.text"
        />
        <div class="flex flex-col gap-2 justify-center">
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.returningVisitors.colors[0] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >25th : {{ formatTime(radialData.returningVisitors.values[0]) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.returningVisitors.colors[1] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >Benchmark : {{ formatTime(radialData.returningVisitors.values[1]) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ background: radialData.returningVisitors.colors[2] }"
            />
            <span class="text-xs" :style="{ color: theme.text }"
              >75th : {{ formatTime(radialData.returningVisitors.values[2]) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { RadialChart } from '@/components/charts'
import { randomizeRadialBenchmarkChartData } from '@/config/charts/RadialBenchmarkChartData'
import { getPageTheme } from '@/config/theme'

// Thème de la page engagement
const theme = computed(() => getPageTheme('engagement'))

// Données réactives pour les RadialBenchmarkChart
const radialData = reactive(randomizeRadialBenchmarkChartData())

function formatTime(val: number): string {
  const min = Math.floor(val / 60)
  const sec = val % 60
  return `${min}min${sec.toString().padStart(2, '0')}`
}

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  updateRadialData: () => {
    const newData = randomizeRadialBenchmarkChartData()
    Object.assign(radialData, newData)
  },
})
</script>
