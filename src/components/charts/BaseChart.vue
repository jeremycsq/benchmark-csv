<template>
  <div class="chart-container" :style="{ height: height }">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import type { ChartConfiguration, ChartType } from 'chart.js/auto'

interface Props {
  data: ChartConfiguration['data']
  options?: ChartConfiguration['options']
  type?: ChartType
  height?: string
  responsive?: boolean
  maintainAspectRatio?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  height: '300px',
  responsive: true,
  maintainAspectRatio: false,
})

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

// Configuration par défaut
const defaultOptions = {
  responsive: props.responsive,
  maintainAspectRatio: props.maintainAspectRatio,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 8,
      displayColors: true,
      bodySpacing: 6,
    },
    datalabels: {
      display: false,
    },
  },
}

const createChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  // Détruire le chart existant s'il y en a un
  if (chart) {
    chart.destroy()
  }

  // Créer le nouveau chart
  chart = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      ...defaultOptions,
      ...props.options,
    },
  })
}

const updateChart = () => {
  if (!chart) return

  // Mettre à jour les données
  chart.data = props.data

  // Mettre à jour les options
  if (props.options) {
    chart.options = {
      ...defaultOptions,
      ...props.options,
    }
  }

  chart.update()
}

// Surveiller les changements de données
watch(
  () => props.data,
  () => {
    nextTick(() => {
      updateChart()
    })
  },
  { deep: true },
)

// Surveiller les changements d'options
watch(
  () => props.options,
  () => {
    nextTick(() => {
      updateChart()
    })
  },
  { deep: true },
)

onMounted(() => {
  nextTick(() => {
    createChart()
  })
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>
