<template>
  <div class="pie-chart-container">
    <div class="pie-canvas-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
    <div class="flex flex-row flex-nowrap justify-between items-center gap-6 mt-4 w-full">
      <div
        v-for="(label, i) in labels"
        :key="label"
        class="flex items-center justify-center gap-2 flex-1 min-w-0"
      >
        <span class="w-4 h-4 rounded-full block" :style="{ background: colors[i] }"></span>
        <span class="text-xs text-center" :style="{ color: labelColor || '#000' }"
          >{{ label }} : {{ values[i].toFixed(1) }}%</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels)

const props = defineProps<{
  values: number[]
  labels: string[]
  colors?: string[]
  labelColor?: string
}>()

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const defaultColors = ['#E5D0F6', '#A259D9', '#7C3AED']
const colors = props.colors || defaultColors

const getData = () => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: colors,
      borderWidth: 0,
      datalabels: {
        display: false,
      },
    },
  ],
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    datalabels: {
      display: false,
    },
  },
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chart) chart.destroy()
  chart = new Chart(chartRef.value, {
    type: 'pie',
    data: getData(),
    options,
    plugins: [ChartDataLabels],
  })
}

watch(() => [props.values, props.labels, props.colors], renderChart, { deep: true })

onMounted(renderChart)
onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 200px;
  min-height: 260px;
  background: #fff;
}
.pie-canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
canvas {
  width: 200px !important;
  height: 200px !important;
  display: block;
}
</style>
