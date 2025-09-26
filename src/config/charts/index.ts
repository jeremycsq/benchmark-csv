// Export centralisé de toutes les configurations de graphiques
export * from './barChartData'
export * from './lineChartData'
export * from './miniBarChartData'

// Import des fonctions pour la fonction utilitaire
import { getBarChartConfig, randomizeBarChartData } from './barChartData'
import { getLineChartConfig, randomizeLineChartData } from './lineChartData'
import { getMiniBarChartConfig, randomizeMiniBarChartData } from './miniBarChartData'

// Fonction utilitaire pour obtenir la configuration appropriée selon le type de graphique
export const getChartConfig = (chartType: 'bar' | 'line' | 'miniBar', pageName: string) => {
  switch (chartType) {
    case 'bar':
      return {
        config: getBarChartConfig(pageName),
        randomize: randomizeBarChartData,
      }
    case 'line':
      return {
        config: getLineChartConfig(pageName),
        randomize: randomizeLineChartData,
      }
    case 'miniBar':
      return {
        config: getMiniBarChartConfig(pageName),
        randomize: randomizeMiniBarChartData,
      }
    default:
      throw new Error(`Type de graphique non supporté: ${chartType}`)
  }
}
