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
    colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
  },
  newVisitors: {
    label: 'New Visitors',
    values: [155, 115, 95],
    colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
  },
  returningVisitors: {
    label: 'Returning Visitors',
    values: [178, 135, 105],
    colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
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
      colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
    },
    newVisitors: {
      label: 'New Visitors',
      values: randomValues(80, 180),
      colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
    },
    returningVisitors: {
      label: 'Returning Visitors',
      values: randomValues(80, 180),
      colors: ['#E5D0F6', '#A259D9', '#7C3AED'],
    },
  }
}
