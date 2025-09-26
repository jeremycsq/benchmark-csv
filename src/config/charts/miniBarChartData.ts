// Types pour les données de mini graphiques en barres
export interface MiniBarChartItem {
  label: string
  value: number
  color: string
  display: (val: number) => string
}

export interface MiniBarChartConfig {
  title: string
  data: MiniBarChartItem[]
  maxValue: number
  height: number
  showValues: boolean
}

// Fonction utilitaire pour générer des valeurs randomisées
function randomFloat(min: number, max: number, decimals = 2): number {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Configuration des données pour chaque page
export const miniBarChartConfigs: Record<string, MiniBarChartConfig> = {
  engagement: {
    title: "Métriques d'Engagement",
    maxValue: 100,
    height: 120,
    showValues: true,
    data: [
      {
        label: 'Temps de Session',
        value: randomInt(60, 180),
        color: '#7C3AED',
        display: (val: number) =>
          `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}`,
      },
      {
        label: 'Pages Vues',
        value: randomFloat(2.5, 5.0),
        color: '#C084FC',
        display: (val: number) => val.toFixed(1),
      },
      {
        label: 'Taux de Scroll',
        value: randomFloat(65, 85),
        color: '#A259D9',
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
  frustration: {
    title: 'Indicateurs de Frustration',
    maxValue: 100,
    height: 120,
    showValues: true,
    data: [
      {
        label: 'Score de Frustration',
        value: randomInt(30, 70),
        color: '#EB6909',
        display: (val: number) => val.toString(),
      },
      {
        label: 'Temps de Chargement',
        value: randomFloat(0.8, 2.5),
        color: '#FF8A65',
        display: (val: number) => val.toFixed(1) + 's',
      },
      {
        label: "Taux d'Erreur",
        value: randomFloat(0.5, 4.0),
        color: '#FF5722',
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
  traffic: {
    title: 'Métriques de Traffic',
    maxValue: 3000,
    height: 120,
    showValues: true,
    data: [
      {
        label: 'Visiteurs Quotidiens',
        value: randomInt(800, 2500),
        color: '#307A57',
        display: (val: number) => val.toString(),
      },
      {
        label: 'Taux de Rebond',
        value: randomFloat(25, 55),
        color: '#3A9469',
        display: (val: number) => val.toFixed(1) + '%',
      },
      {
        label: 'Durée de Session',
        value: randomInt(60, 180),
        color: '#6D9A7A',
        display: (val: number) =>
          `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}`,
      },
    ],
  },
  conversion: {
    title: 'Métriques de Conversion',
    maxValue: 100,
    height: 120,
    showValues: true,
    data: [
      {
        label: 'Taux de Conversion',
        value: randomFloat(1.5, 5.0),
        color: '#0A95B3',
        display: (val: number) => val.toFixed(2) + '%',
      },
      {
        label: 'Revenu par Visite',
        value: randomFloat(15, 50),
        color: '#0EA9CC',
        display: (val: number) => '€' + val.toFixed(2),
      },
      {
        label: 'Taux de Checkout',
        value: randomFloat(65, 95),
        color: '#38BDF8',
        display: (val: number) => val.toFixed(1) + '%',
      },
    ],
  },
}

// Fonction pour obtenir la configuration d'une page
export const getMiniBarChartConfig = (pageName: string): MiniBarChartConfig => {
  return miniBarChartConfigs[pageName] || miniBarChartConfigs.engagement
}

// Fonction pour randomiser les données d'une page
export const randomizeMiniBarChartData = (pageName: string): MiniBarChartItem[] => {
  const config = getMiniBarChartConfig(pageName)

  return config.data.map((item) => ({
    ...item,
    value:
      item.label.includes('Temps') || item.label.includes('Durée') || item.label.includes('Session')
        ? randomInt(60, 180)
        : item.label.includes('Taux') || item.label.includes('Score')
          ? randomFloat(item.value * 0.7, item.value * 1.3)
          : randomFloat(item.value * 0.8, item.value * 1.2),
  }))
}
