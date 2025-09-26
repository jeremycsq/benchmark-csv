<template>
  <div class="radial-benchmark-chart" :style="{ height }">
    <div class="relative w-full h-full flex items-center justify-center">
      <canvas ref="chartRef"></canvas>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <slot name="center-icon">
          <span v-if="icon" v-html="icon" class="text-3xl"></span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface Props {
  values: number[] // [25th, Benchmark, 75th] en secondes
  colors?: string[] // couleurs des 3 anneaux
  height?: string
  icon?: string // HTML ou SVG optionnel
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#E5E7EB', '#3B82F6', '#6B7280'],
  height: '220px',
  icon: '',
})

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

function formatTime(val: number): string {
  const min = Math.floor(val / 60)
  const sec = val % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const getData = (): { datasets: any[] } => {
  // Chaque anneau = 1 dataset, chaque dataset = [val, 100-val] pour l'effet radial
  return {
    datasets: [
      {
        label: '25th',
        data: [props.values[0], Math.max(1, Math.max(...props.values) * 1.2 - props.values[0])],
        backgroundColor: [props.colors[0], '#F3F4F6'],
        cutout: '50%',
        borderWidth: 4,
        datalabels: {
          display: false,
          align: 'end',
          anchor: 'end',
          color: '#000',
          font: { weight: 'bold', size: 12 },
          textStrokeColor: '#fff',
          textStrokeWidth: 4,
          offset: 1,
          formatter: (v: number, ctx: { dataIndex: number }) =>
            ctx.dataIndex === 0 ? formatTime(props.values[0]) : '',
        },
      },
      {
        label: 'Benchmark',
        data: [props.values[1], Math.max(1, Math.max(...props.values) * 1.2 - props.values[1])],
        backgroundColor: [props.colors[1], '#F3F4F6'],
        cutout: '50%',
        borderWidth: 4,
        datalabels: {
          display: false,
          align: 'end',
          anchor: 'end',
          color: '#000',
          font: { weight: 'bold', size: 12 },
          textStrokeColor: '#fff',
          textStrokeWidth: 4,
          offset: 1,
          formatter: (v: number, ctx: { dataIndex: number }) =>
            ctx.dataIndex === 0 ? formatTime(props.values[1]) : '',
        },
      },
      {
        label: '75th',
        data: [props.values[2], Math.max(1, Math.max(...props.values) * 1.2 - props.values[2])],
        backgroundColor: [props.colors[2], '#F3F4F6'],
        cutout: '50%',
        borderWidth: 4,
        datalabels: {
          display: false,
          align: 'end',
          anchor: 'end',
          color: '#000',
          font: { weight: 'bold', size: 12 },
          textStrokeColor: '#fff',
          textStrokeWidth: 4,
          offset: 1,
          formatter: (v: number, ctx: { dataIndex: number }) =>
            ctx.dataIndex === 0 ? formatTime(props.values[2]) : '',
        },
      },
    ],
  }
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  layout: {
    padding: 32,
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      display: false,
    },
  },
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chart) chart.destroy()
  chart = new Chart(chartRef.value, {
    type: 'doughnut',
    data: getData(),
    options,
    plugins: [ChartDataLabels],
  })
}

watch(
  () => props.values,
  () => nextTick(renderChart),
  { deep: true },
)
watch(
  () => props.colors,
  () => nextTick(renderChart),
  { deep: true },
)

onMounted(() => nextTick(renderChart))
onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>

<style scoped>
.radial-benchmark-chart {
  width: 100%;
  position: relative;
  min-height: 180px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
