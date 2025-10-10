<template>
  <div class="relative w-full h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// Enregistrer tous les composants Chart.js
Chart.register(...registerables)

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
  yMin?: number
  yMax?: number
  yTickSuffix?: string
  yStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
  labelColor: '#B9C7B3',
  gridColor: '#E9F5E4',
  yMin: 0,
  yMax: 100,
  yTickSuffix: '%',
  yStep: 20,
})

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const createChart = () => {
  if (!chartRef.value) return

  // Détruire le chart existant si il y en a un
  if (chart) {
    chart.destroy()
    chart = null
  }

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'line',
    data: props.data,
    options: {
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
              const label = context.dataset.label
              const value = context.parsed.y
              const suffix = props.yTickSuffix ?? ''
              const formatted = Number(value).toFixed(2)
              return `${label}: ${formatted}${suffix}`
            },
          },
        },
        datalabels: {
          display: false,
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
            maxRotation: 0,
            minRotation: 0,
            callback: function (value: any, index: number) {
              const label = this.getLabelForValue(value)
              if (label && label.includes('\n')) {
                return label.split('\n')
              }
              return label
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
            callback: (value) => `${value}${props.yTickSuffix}`,
            padding: 8,
            stepSize: props.yStep,
          },
          min: props.yMin,
          max: props.yMax,
          axis: 'y',
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
          hoverBorderWidth: 2,
          hoverBorderColor: 'white',
        },
        line: {
          borderWidth: 2,
          tension: 0.4,
        },
      },
      layout: {
        padding: 0,
      },
      clip: false,
    },
    plugins: [
      {
        id: 'multiLineLabels',
        beforeDraw: function (chart: any) {
          const ctx = chart.ctx
          const xAxis = chart.scales.x

          if (xAxis && xAxis.ticks) {
            xAxis.ticks.forEach((tick: any, index: number) => {
              if (tick.label && Array.isArray(tick.label)) {
                const x = tick.x
                const y = tick.y + 15

                ctx.save()
                ctx.textAlign = 'center'
                ctx.textBaseline = 'top'
                ctx.fillStyle = xAxis.options.ticks.color
                ctx.font = `${xAxis.options.ticks.font.weight} ${xAxis.options.ticks.font.size}px sans-serif`

                tick.label.forEach((line: string, lineIndex: number) => {
                  ctx.fillText(line, x, y + lineIndex * 12)
                })

                ctx.restore()

                // Masquer le label original
                tick.label = ''
              }
            })
          }
        },
      },
    ],
  })
}

const updateChart = () => {
  if (chart) {
    chart.data = props.data

    // Pour x.ticks
    const xTicks =
      chart.options.scales && chart.options.scales.x ? chart.options.scales.x.ticks : undefined
    if (xTicks !== undefined) {
      ;(xTicks as { color?: string }).color = props.labelColor
    }

    // Pour y.ticks
    const yTicks =
      chart.options.scales && chart.options.scales.y ? chart.options.scales.y.ticks : undefined
    if (yTicks !== undefined) {
      ;(yTicks as { color?: string }).color = props.labelColor
    }

    // Pour y.grid
    const yGrid =
      chart.options.scales && chart.options.scales.y ? chart.options.scales.y.grid : undefined
    if (yGrid !== undefined) {
      ;(yGrid as { color?: string }).color = props.gridColor
    }

    chart.update('none')
  }
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.labelColor, updateChart)
watch(() => props.gridColor, updateChart)
watch(
  () => props.yMin,
  () => createChart(),
)
watch(
  () => props.yMax,
  () => createChart(),
)
watch(
  () => props.yStep,
  () => createChart(),
)
</script>
