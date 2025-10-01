// Types pour les données du RadialBenchmarkChart
export interface RadialBenchmarkChartData {
  label: string
  values: number[] // [25th, Benchmark, 75th] en secondes
  colors: string[]
}

export const radialBenchmarkChartData: Record<string, RadialBenchmarkChartData> = {
  overall: {
    label: 'Overall',
    values: [168, 125, 85],
    colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
  },
  newVisitors: {
    label: 'New Visitors',
    values: [155, 115, 95],
    colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
  },
  returningVisitors: {
    label: 'Returning Visitors',
    values: [178, 135, 105],
    colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
  },
}

export function getRadialBenchmarkChartData(key: string): RadialBenchmarkChartData {
  return radialBenchmarkChartData[key] || radialBenchmarkChartData.overall
}

// Fonction utilitaire pour randomiser les valeurs (simple random)
function randomValues(min: number, max: number): number[] {
  return [
    Math.floor(Math.random() * (max - min + 1)) + min,
    Math.floor(Math.random() * (max - min + 1)) + min,
    Math.floor(Math.random() * (max - min + 1)) + min,
  ]
}

export function randomizeRadialBenchmarkChartData(/* filters: { country, industry, month, device } */) {
  return {
    overall: {
      label: 'Overall',
      values: randomValues(80, 180),
      colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
    },
    newVisitors: {
      label: 'New Visitors',
      values: randomValues(80, 180),
      colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
    },
    returningVisitors: {
      label: 'Returning Visitors',
      values: randomValues(80, 180),
      colors: ['#C1E3B1', '#2E614F', '#6D9A7A'],
    },
  }
}
