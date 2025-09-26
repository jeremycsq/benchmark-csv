// Types pour les données de graphiques linéaires
export interface LineChartPoint {
  x: string
  y: number
}

export interface LineChartDataset {
  label: string
  data: LineChartPoint[]
  borderColor: string
  backgroundColor: string
  tension: number
}

export interface LineChartConfig {
  title: string
  datasets: LineChartDataset[]
  xAxisLabel: string
  yAxisLabel: string
  yAxisMin?: number
  yAxisMax?: number
  stepSize?: number
}

// Fonction utilitaire pour générer des données temporelles
function generateTimeSeriesData(
  days: number,
  baseValue: number,
  variance: number,
  trend: number = 0,
): LineChartPoint[] {
  const data: LineChartPoint[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const trendEffect = (days - i) * trend
    const randomVariance = (Math.random() - 0.5) * variance
    const value = Math.max(0, baseValue + trendEffect + randomVariance)

    data.push({
      x: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      y: +value.toFixed(2),
    })
  }

  return data
}

// Configuration des données pour chaque page
export const lineChartConfigs: Record<string, LineChartConfig> = {
  engagement: {
    title: "Évolution de l'Engagement",
    xAxisLabel: 'Date',
    yAxisLabel: 'Score',
    yAxisMin: 0,
    yAxisMax: 100,
    stepSize: 20,
    datasets: [
      {
        label: 'Temps de Session',
        data: generateTimeSeriesData(30, 65, 15, 0.5),
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Taux de Scroll',
        data: generateTimeSeriesData(30, 70, 10, 0.3),
        borderColor: '#C084FC',
        backgroundColor: 'rgba(192, 132, 252, 0.1)',
        tension: 0.4,
      },
    ],
  },
  frustration: {
    title: 'Évolution de la Frustration',
    xAxisLabel: 'Date',
    yAxisLabel: 'Score',
    yAxisMin: 0,
    yAxisMax: 100,
    stepSize: 20,
    datasets: [
      {
        label: 'Score de Frustration',
        data: generateTimeSeriesData(30, 50, 12, -0.2),
        borderColor: '#EB6909',
        backgroundColor: 'rgba(235, 105, 9, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Temps de Chargement',
        data: generateTimeSeriesData(30, 1.5, 0.5, -0.01),
        borderColor: '#FF8A65',
        backgroundColor: 'rgba(255, 138, 101, 0.1)',
        tension: 0.4,
      },
    ],
  },
  traffic: {
    title: 'Évolution du Traffic',
    xAxisLabel: 'Date',
    yAxisLabel: 'Visiteurs',
    yAxisMin: 0,
    stepSize: 500,
    datasets: [
      {
        label: 'Visiteurs Quotidiens',
        data: generateTimeSeriesData(30, 1500, 300, 10),
        borderColor: '#307A57',
        backgroundColor: 'rgba(48, 122, 87, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Sessions Uniques',
        data: generateTimeSeriesData(30, 1200, 250, 8),
        borderColor: '#3A9469',
        backgroundColor: 'rgba(58, 148, 105, 0.1)',
        tension: 0.4,
      },
    ],
  },
  conversion: {
    title: 'Évolution des Conversions',
    xAxisLabel: 'Date',
    yAxisLabel: 'Taux (%)',
    yAxisMin: 0,
    yAxisMax: 10,
    stepSize: 2,
    datasets: [
      {
        label: 'Taux de Conversion',
        data: generateTimeSeriesData(30, 3.0, 0.8, 0.02),
        borderColor: '#0A95B3',
        backgroundColor: 'rgba(10, 149, 179, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Taux de Checkout',
        data: generateTimeSeriesData(30, 80, 5, 0.1),
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.4,
      },
    ],
  },
}

// Fonction pour obtenir la configuration d'une page
export const getLineChartConfig = (pageName: string): LineChartConfig => {
  return lineChartConfigs[pageName] || lineChartConfigs.engagement
}

// Fonction pour randomiser les données d'une page
export const randomizeLineChartData = (pageName: string): LineChartDataset[] => {
  const config = getLineChartConfig(pageName)

  return config.datasets.map((dataset) => ({
    ...dataset,
    data: generateTimeSeriesData(
      30,
      Math.random() * 50 + 25, // Valeur de base aléatoire
      Math.random() * 20 + 10, // Variance aléatoire
      (Math.random() - 0.5) * 2, // Tendance aléatoire
    ),
  }))
}
