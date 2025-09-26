// Export centralisé de tous les composants de graphiques
export { default as MiniBarChart } from './MiniBarChart.vue'
export { default as LineChart } from './LineChart.vue'
export { default as BaseChart } from './BaseChart.vue'
export { default as LineChartRefactored } from './LineChartRefactored.vue'
export { default as StackedBarChart } from './StackedBarChart.vue'
export { default as RadialChart } from './RadialChart.vue'

// Types et interfaces communes pour les graphiques
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    tension?: number
  }[]
}

export interface ChartOptions {
  height?: string
  labelColor?: string
  gridColor?: string
  responsive?: boolean
  maintainAspectRatio?: boolean
}

// Configuration par défaut pour les graphiques
export const defaultChartOptions: ChartOptions = {
  height: '100%',
  labelColor: '#B9C7B3',
  gridColor: '#E9F5E4',
  responsive: true,
  maintainAspectRatio: false,
}
