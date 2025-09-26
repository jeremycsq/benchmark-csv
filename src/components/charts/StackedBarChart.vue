<template>
  <div class="stacked-bar-benchmark-chart" :style="{ width: '100px', height: '320px' }">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

const props = defineProps<{
  values: number[]
  colors: string[]
  labels: string[]
  units?: string
}>()

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const getData = (): ChartData<'bar'> => ({
  labels: [''],
  datasets: props.values.map((val, i) => ({
    label: props.labels[i],
    data: [val],
    backgroundColor: props.colors[i],
    borderRadius: 20,
    stack: 'stack1',
    datalabels: {
      display: false,
      color: '#000',
      font: { weight: 'bold', size: 16 },
      align: 'center',
      anchor: 'center',
      formatter: (v: number) => `${v}${props.units || ''}`,
    },
  })),
})

const options: ChartOptions<'bar'> = {
  indexAxis: 'x',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      display: true,
    },
  },
  scales: {
    x: {
      stacked: true,
      min: 0,
      max: 100,
      display: false,
    },
    y: {
      stacked: true,
      display: false,
    },
  },
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chart) chart.destroy()
  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: getData(),
    options,
    plugins: [ChartDataLabels],
  })
}

watch(() => [props.values, props.colors, props.labels], renderChart, { deep: true })

onMounted(renderChart)
onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>

<style scoped>
.stacked-bar-benchmark-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  min-height: 320px;
}
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
