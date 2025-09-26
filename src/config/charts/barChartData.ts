// Types pour les données de graphiques en barres
export interface BarChartItem {
  label: string
  values: [number, number, number]
  display: (val: number) => string
}

export interface BarChartConfig {
  title: string
  data: BarChartItem[]
  badgeColor: string
  badgeTextColor: string
  labels: [string, string, string]
  labelColors: [string, string, string]
}

// Fonction utilitaire pour générer des valeurs randomisées
function randomFloat(min: number, max: number, decimals = 2): number {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}

function randomMMSS(min: number, max: number): string {
  const total = Math.floor(Math.random() * (max - min + 1)) + min
  const minPart = Math.floor(total / 60)
  const secPart = total % 60
  return `${minPart}:${secPart.toString().padStart(2, '0')}`
}

// Configuration des données pour chaque page
export const barChartConfigs: Record<string, BarChartConfig> = {
  engagement: {
    title: 'Engagement',
    badgeColor: '#E5D0F6',
    badgeTextColor: '#A259D9',
    labels: ['25th', 'Benchmark', '75th'],
    labelColors: ['#A259D9', '#7C3AED', '#C084FC'],
    data: [
      {
        label: 'Pageviews per Session',
        values: [randomFloat(1.8, 2.4), randomFloat(2.8, 3.8), randomFloat(4.2, 5.2)],
        display: (val: number) => val.toFixed(2),
      },
      {
        label: 'Time per Session',
        values: [95, randomFloat(120, 140), 168],
        display: () => randomMMSS(90, 180),
      },
      {
        label: 'Scroll Rate',
        values: [randomFloat(55, 60), randomFloat(65, 70), randomFloat(75, 80)],
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
  frustration: {
    title: 'Frustration',
    badgeColor: '#FED7AA',
    badgeTextColor: '#EB6909',
    labels: ['25th', 'Benchmark', '75th'],
    labelColors: ['#FFD180', '#FFB74D', '#FF8A00'],
    data: [
      {
        label: 'Frustration Score',
        values: [randomFloat(35, 45), randomFloat(45, 55), randomFloat(55, 65)],
        display: (val: number) => Math.round(val).toString(),
      },
      {
        label: 'Load Time Frustration',
        values: [randomFloat(0.8, 1.2), randomFloat(1.2, 1.8), randomFloat(1.8, 2.5)],
        display: (val: number) => val.toFixed(1) + 's',
      },
      {
        label: 'JS Error Rate',
        values: [randomFloat(0.5, 1.5), randomFloat(1.5, 2.5), randomFloat(2.5, 4.0)],
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
  traffic: {
    title: 'Traffic',
    badgeColor: '#C1E3B1',
    badgeTextColor: '#307A57',
    labels: ['25th', 'Benchmark', '75th'],
    labelColors: ['#307A57', '#3A9469', '#6D9A7A'],
    data: [
      {
        label: 'Daily Visitors',
        values: [randomFloat(800, 1200), randomFloat(1200, 1800), randomFloat(1800, 2500)],
        display: (val: number) => Math.round(val).toString(),
      },
      {
        label: 'Bounce Rate',
        values: [randomFloat(25, 35), randomFloat(35, 45), randomFloat(45, 55)],
        display: (val: number) => val.toFixed(1) + '%',
      },
      {
        label: 'Session Duration',
        values: [randomFloat(60, 90), randomFloat(90, 120), randomFloat(120, 180)],
        display: () => randomMMSS(60, 180),
      },
    ],
  },
  conversion: {
    title: 'Conversion',
    badgeColor: '#BAE6FD',
    badgeTextColor: '#0A95B3',
    labels: ['25th', 'Benchmark', '75th'],
    labelColors: ['#0A95B3', '#0EA9CC', '#38BDF8'],
    data: [
      {
        label: 'Conversion Rate',
        values: [randomFloat(1.5, 2.5), randomFloat(2.5, 3.5), randomFloat(3.5, 5.0)],
        display: (val: number) => val.toFixed(2) + '%',
      },
      {
        label: 'Revenue per Visit',
        values: [randomFloat(15, 25), randomFloat(25, 35), randomFloat(35, 50)],
        display: (val: number) => '€' + val.toFixed(2),
      },
      {
        label: 'Checkout Completion',
        values: [randomFloat(65, 75), randomFloat(75, 85), randomFloat(85, 95)],
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
}

// Fonction pour obtenir la configuration d'une page
export const getBarChartConfig = (pageName: string): BarChartConfig => {
  return barChartConfigs[pageName] || barChartConfigs.engagement
}

// Fonction pour randomiser les données d'une page
export const randomizeBarChartData = (pageName: string): BarChartItem[] => {
  const config = getBarChartConfig(pageName)

  return config.data.map((item) => ({
    ...item,
    values: [
      randomFloat(item.values[0] * 0.8, item.values[0] * 1.2),
      randomFloat(item.values[1] * 0.8, item.values[1] * 1.2),
      randomFloat(item.values[2] * 0.8, item.values[2] * 1.2),
    ] as [number, number, number],
  }))
}
