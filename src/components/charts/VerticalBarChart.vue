<template>
  <div class="vertical-bar-chart w-full">
    <div class="flex w-full">
      <div class="flex-1" :style="{ height: canvasHeight }">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
    <div v-if="externalLabels" class="mt-2 flex text-black" :class="xTickClass">
      <div v-for="(lbl, i) in props.labels" :key="`xl-${i}`" class="flex-1 text-center">
        {{ lbl }}
        <span class="text-xs">({{ values[i].toFixed(1) }}%)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import type { ChartData, ChartOptions, FontSpec } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[]
    colors: string[]
    yMin?: number
    yMax?: number
    yStep?: number
    // Axes/labels hors canvas
    externalLabels?: boolean
    // Classes Tailwind utilisées si externalLabels=true pour la typo externe
    xTickClass?: string
    yTickClass?: string
    // Custom via classes Tailwind (prend le pas si fournis) pour le canvas
    xTickClassCanvas?: string
    yTickClassCanvas?: string
    dataLabelClass?: string
    // Fallback via objets Chart.js
    xTickFont?: Partial<FontSpec>
    yTickFont?: Partial<FontSpec>
    dataLabelFont?: Partial<FontSpec>
    dataLabelColor?: string
  }>(),
  {
    yMin: 0,
    yMax: 100,
    yStep: 10,
    dataLabelColor: '#FFF',
    externalLabels: false,
  },
)

function mapTailwindFont(classes?: string): Partial<FontSpec> | undefined {
  if (!classes) return undefined
  const tokens = classes.split(/\s+/).filter(Boolean)
  const font: Partial<FontSpec> = {}
  if (tokens.includes('text-xs')) font.size = 12
  else if (tokens.includes('text-sm')) font.size = 14
  else if (tokens.includes('text-base')) font.size = 16
  else if (tokens.includes('text-lg')) font.size = 18
  else if (tokens.includes('text-xl')) font.size = 20
  if (tokens.includes('font-medium')) font.weight = 500
  else if (tokens.includes('font-semibold')) font.weight = 600
  else if (tokens.includes('font-bold')) font.weight = 700
  if (tokens.includes('font-sans')) font.family = 'Inter, ui-sans-serif, system-ui'
  else if (tokens.includes('font-serif'))
    font.family = 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif'
  else if (tokens.includes('font-mono'))
    font.family = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  return font
}

const xFont = computed<Partial<FontSpec> | undefined>(
  () => props.xTickFont ?? mapTailwindFont(props.xTickClassCanvas ?? props.xTickClass),
)
const yFont = computed<Partial<FontSpec> | undefined>(
  () => props.yTickFont ?? mapTailwindFont(props.yTickClassCanvas ?? props.yTickClass),
)
const dlFont = computed<Partial<FontSpec> | undefined>(
  () => props.dataLabelFont ?? mapTailwindFont(props.dataLabelClass),
)

const yTicks = computed(() => {
  const ticks: number[] = []
  for (let v = props.yMax; v >= props.yMin; v -= props.yStep) ticks.push(v)
  return ticks
})

const canvasHeight = '260px'

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const getData = (): ChartData<'bar'> => ({
  labels: props.labels,
  datasets: [
    {
      label: '',
      data: props.values,
      backgroundColor: props.colors,
      borderRadius: 8,
    },
  ],
})

const options = (): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    datalabels: {
      display: true,
      color: props.dataLabelColor,
      formatter: (v: unknown) => `${v}%`,
      anchor: 'end',
      align: 'end',
      offset: 4,
      clamp: true,
      font: dlFont.value as any,
    },
  },
  scales: {
    x: {
      display: !props.externalLabels,
      grid: { display: false },
      ticks: { color: '#000', font: xFont.value },
    },
    y: {
      display: !props.externalLabels,
      min: props.yMin,
      max: props.yMax,
      ticks: {
        stepSize: props.yStep,
        color: '#000',
        font: yFont.value,
        callback: (v) => `${v}%`,
      },
      grid: { color: '#F7F9F9' },
    },
  },
})

const chartRefreshedDeps = computed(() => [
  props.labels,
  props.values,
  props.colors,
  props.yMin,
  props.yMax,
  props.yStep,
  props.xTickClass,
  props.yTickClass,
  props.dataLabelClass,
  props.xTickFont,
  props.yTickFont,
  props.dataLabelFont,
  props.dataLabelColor,
  props.externalLabels,
])

const renderChart = () => {
  if (!chartRef.value) return
  if (chart) chart.destroy()
  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: getData(),
    options: options(),
    plugins: [ChartDataLabels],
  })
}

watch(() => chartRefreshedDeps.value, renderChart, { deep: true })

onMounted(renderChart)
onBeforeUnmount(() => chart?.destroy())
</script>

<style scoped>
.vertical-bar-chart {
  display: flex;
  flex-direction: column;
}
</style>
