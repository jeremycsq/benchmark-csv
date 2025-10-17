// Utilitaires de debug pour identifier les sources de NaN dans les métriques de trafic
import type { TrafficData } from '@/composables/useSupabaseData'

export interface DebugResult {
  hasData: boolean
  dataCount: number
  issues: string[]
  sampleData: Partial<TrafficData>[]
  calculations: {
    mobileShare: {
      values: number[]
      average: number
      percentage: number
      hasNaN: boolean
    }
    newVisitorRate: {
      values: number[]
      average: number
      percentage: number
      hasNaN: boolean
    }
    paidTrafficShare: {
      values: number[]
      average: number
      percentage: number
      hasNaN: boolean
    }
    deviceDistribution: {
      desktop: number
      mobile: number
      tablet: number
      total: number
      hasNaN: boolean
    }
  }
}

export function debugTrafficData(data: TrafficData[]): DebugResult {
  const issues: string[] = []
  const sampleData = data.slice(0, 3).map((item) => ({
    analysis_month: item.analysis_month,
    country: item.country,
    industry: item.industry,
    device: item.device,
    mobile_share: item.mobile_share,
    new_visitor_rate: item.new_visitor_rate,
    paid_traffic_share: item.paid_traffic_share,
    avg_daily_traffic: item.avg_daily_traffic,
  }))

  // Vérification des données de base
  if (!data || data.length === 0) {
    issues.push('Aucune donnée disponible')
    return {
      hasData: false,
      dataCount: 0,
      issues,
      sampleData: [],
      calculations: {
        mobileShare: { values: [], average: 0, percentage: 0, hasNaN: false },
        newVisitorRate: { values: [], average: 0, percentage: 0, hasNaN: false },
        paidTrafficShare: { values: [], average: 0, percentage: 0, hasNaN: false },
        deviceDistribution: { desktop: 0, mobile: 0, tablet: 0, total: 0, hasNaN: false },
      },
    }
  }

  // Extraction des valeurs pour mobile_share
  const mobileShareValues = data
    .map((item) => {
      const value = Number(item.mobile_share)
      if (isNaN(value)) {
        issues.push(
          `mobile_share invalide dans ${item.analysis_month} (${item.device}): ${item.mobile_share}`,
        )
      }
      return value
    })
    .filter((val) => !isNaN(val))

  const mobileShareAverage =
    mobileShareValues.length > 0
      ? mobileShareValues.reduce((sum, val) => sum + val, 0) / mobileShareValues.length
      : 0

  // Extraction des valeurs pour new_visitor_rate
  const newVisitorRateValues = data
    .map((item) => {
      const value = Number(item.new_visitor_rate)
      if (isNaN(value)) {
        issues.push(
          `new_visitor_rate invalide dans ${item.analysis_month} (${item.device}): ${item.new_visitor_rate}`,
        )
      }
      return value
    })
    .filter((val) => !isNaN(val))

  const newVisitorRateAverage =
    newVisitorRateValues.length > 0
      ? newVisitorRateValues.reduce((sum, val) => sum + val, 0) / newVisitorRateValues.length
      : 0

  // Extraction des valeurs pour paid_traffic_share
  const paidTrafficShareValues = data
    .map((item) => {
      const value = Number(item.paid_traffic_share)
      if (isNaN(value)) {
        issues.push(
          `paid_traffic_share invalide dans ${item.analysis_month} (${item.device}): ${item.paid_traffic_share}`,
        )
      }
      return value
    })
    .filter((val) => !isNaN(val))

  const paidTrafficShareAverage =
    paidTrafficShareValues.length > 0
      ? paidTrafficShareValues.reduce((sum, val) => sum + val, 0) / paidTrafficShareValues.length
      : 0

  // Distribution des devices
  const deviceCounts = data.reduce(
    (acc, item) => {
      const device = String(item.device).toLowerCase()
      if (device === 'desktop') acc.desktop++
      else if (device === 'mobile') acc.mobile++
      else if (device === 'tablet') acc.tablet++
      else {
        issues.push(`Device inconnu: ${item.device} dans ${item.analysis_month}`)
      }
      return acc
    },
    { desktop: 0, mobile: 0, tablet: 0 },
  )

  const totalDevices = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet

  // Vérifications supplémentaires
  if (mobileShareValues.length === 0) {
    issues.push('Aucune valeur mobile_share valide trouvée')
  }
  if (newVisitorRateValues.length === 0) {
    issues.push('Aucune valeur new_visitor_rate valide trouvée')
  }
  if (paidTrafficShareValues.length === 0) {
    issues.push('Aucune valeur paid_traffic_share valide trouvée')
  }
  if (totalDevices === 0) {
    issues.push('Aucun device valide trouvé')
  }

  // Vérification des valeurs aberrantes
  if (mobileShareAverage > 1) {
    issues.push(
      `mobile_share moyenne > 1 (${mobileShareAverage}), possiblement en pourcentage au lieu de ratio`,
    )
  }
  if (newVisitorRateAverage > 1) {
    issues.push(
      `new_visitor_rate moyenne > 1 (${newVisitorRateAverage}), possiblement en pourcentage au lieu de ratio`,
    )
  }
  if (paidTrafficShareAverage > 1) {
    issues.push(
      `paid_traffic_share moyenne > 1 (${paidTrafficShareAverage}), possiblement en pourcentage au lieu de ratio`,
    )
  }

  return {
    hasData: true,
    dataCount: data.length,
    issues,
    sampleData,
    calculations: {
      mobileShare: {
        values: mobileShareValues,
        average: mobileShareAverage,
        percentage: Math.round(mobileShareAverage * 100),
        hasNaN: mobileShareValues.length !== data.length,
      },
      newVisitorRate: {
        values: newVisitorRateValues,
        average: newVisitorRateAverage,
        percentage: Math.round(newVisitorRateAverage * 100),
        hasNaN: newVisitorRateValues.length !== data.length,
      },
      paidTrafficShare: {
        values: paidTrafficShareValues,
        average: paidTrafficShareAverage,
        percentage: Math.round(paidTrafficShareAverage * 100),
        hasNaN: paidTrafficShareValues.length !== data.length,
      },
      deviceDistribution: {
        desktop: totalDevices > 0 ? Math.round((deviceCounts.desktop / totalDevices) * 100) : 0,
        mobile: totalDevices > 0 ? Math.round((deviceCounts.mobile / totalDevices) * 100) : 0,
        tablet: totalDevices > 0 ? Math.round((deviceCounts.tablet / totalDevices) * 100) : 0,
        total: totalDevices,
        hasNaN: totalDevices === 0,
      },
    },
  }
}

// Fonction pour tester les calculs de métriques
export function testTrafficMetrics(data: TrafficData[]) {
  console.group('🔍 DEBUG TRAFFIC METRICS')

  const debug = debugTrafficData(data)

  console.log('🔍 DEBUG TRAFFIC METRICS - Résumé:', {
    hasData: debug.hasData,
    dataCount: debug.dataCount,
    issues: debug.issues,
  })

  console.log('🔍 DEBUG TRAFFIC METRICS - Calculs détaillés:', {
    mobileShare: {
      ...debug.calculations.mobileShare,
      values: debug.calculations.mobileShare.values.slice(0, 5), // Afficher seulement les 5 premières
    },
    newVisitorRate: {
      ...debug.calculations.newVisitorRate,
      values: debug.calculations.newVisitorRate.values.slice(0, 5),
    },
    paidTrafficShare: {
      ...debug.calculations.paidTrafficShare,
      values: debug.calculations.paidTrafficShare.values.slice(0, 5),
    },
    deviceDistribution: debug.calculations.deviceDistribution,
  })

  if (debug.issues.length > 0) {
    console.warn('⚠️ Problèmes détectés:', debug.issues)
  } else {
    console.log('✅ Aucun problème détecté dans les données')
  }

  console.groupEnd()

  return debug
}
