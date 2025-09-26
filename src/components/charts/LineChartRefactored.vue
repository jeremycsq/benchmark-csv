<template>
  <BaseChart :data="chartData" :options="chartOptions" type="line" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { ChartConfiguration } from 'chart.js/auto'

interface Props {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension?: number
    }[]
  }
  height?: string
  labelColor?: string
  gridColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
  labelColor: '#B9C7B3',
  gridColor: '#E9F5E4',
})

// Configuration des données pour Chart.js
const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: props.data.datasets.map((dataset) => ({
    ...dataset,
    tension: dataset.tension || 0.4,
    borderWidth: 3,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBorderWidth: 2,
    pointHoverBorderColor: 'white',
  })),
}))

// Configuration des options pour Chart.js
const chartOptions = computed((): ChartConfiguration['options'] => ({
  responsive: true,
  maintainAspectRatio: false,
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
      callbacks: {
        title: (context) => {
          return `${context[0].label}`
        },
        label: (context) => {
          return `${context.dataset.label}: ${context.parsed.y}%`
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: props.labelColor,
        font: {
          size: 12,
          weight: 400,
        },
      },
    },
    y: {
      display: true,
      border: {
        display: false,
      },
      position: 'left',
      grid: {
        color: props.gridColor,
      },
      ticks: {
        color: props.labelColor,
        font: {
          size: 12,
          weight: 400,
        },
        callback: (value) => {
          return [0, 20, 40, 60, 80, 100].includes(Number(value)) ? `${value}%` : ''
        },
        padding: 8,
        stepSize: 20,
      },
      min: 0,
      max: 100,
      axis: 'y',
    },
  },
  layout: {
    padding: 0,
  },
  clip: false,
}))
</script>
