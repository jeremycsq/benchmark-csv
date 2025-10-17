import { computed } from 'vue'
import { useSupabaseData, type TrafficData } from './useSupabaseData'
import { useGlobalFiltersStore } from '../stores/globalFilters'
import { testTrafficMetrics } from '../utils/debugTrafficData'

export function useTrafficMetrics() {
  const { data, getFilteredData } = useSupabaseData()
  const globalFilters = useGlobalFiltersStore()

  // Données filtrées selon les filtres globaux
  const filteredData = computed(() => {
    console.log(
      '🚦 useTrafficMetrics - data.value (avant filtrage):',
      data.value.length,
      'éléments',
    )

    // Construire les filtres - "All" signifie pas de filtre (undefined)
    const filters: {
      country?: string
      industry?: string
      device?: string
      analysis_month?: string
    } = {}

    // Ajouter seulement les filtres actifs (pas "All")
    if (globalFilters.selectedCountry !== 'All countries') {
      filters.country = globalFilters.selectedCountry
    }
    if (globalFilters.selectedIndustry !== 'All industries') {
      filters.industry = globalFilters.selectedIndustry
    }
    if (globalFilters.selectedDevice !== 'All devices') {
      // Mapper le label UI vers la valeur DB (codes)
      const mapDevice = (label: string): string => {
        const l = label.toLowerCase()
        if (l === 'desktop') return '1'
        if (l === 'mobile') return '2'
        return label
      }
      filters.device = mapDevice(globalFilters.selectedDevice)
    } else {
      // All Devices sélectionné → cibler explicitement les lignes 'all_devices'
      filters.device = 'all_devices'
    }
    if (globalFilters.selectedMonth !== 'All months') {
      filters.analysis_month = globalFilters.selectedMonth
    }

    console.log('🚦 useTrafficMetrics - Filtres globaux:', {
      selectedCountry: globalFilters.selectedCountry,
      selectedIndustry: globalFilters.selectedIndustry,
      selectedDevice: globalFilters.selectedDevice,
      selectedMonth: globalFilters.selectedMonth,
      selectedVisitorType: globalFilters.selectedVisitorType,
    })

    let filtered = getFilteredData(filters)

    // Fallback: si "All Devices" (all_devices) ne retourne rien pour une industrie/pays donnée,
    // on enlève le filtre device pour garder des données.
    if (
      filters.device === 'all_devices' &&
      (filtered.value === undefined || filtered.value.length === 0)
    ) {
      const { device, ...rest } = filters
      console.log(
        '🚦 useTrafficMetrics - Fallback all_devices → suppression du filtre device (0 résultat avec all_devices)',
      )
      filtered = getFilteredData(rest)
    }

    return filtered.value
  })

  // Calcul des métriques de benchmark
  const benchmarkMetrics = computed(() => {
    if (!filteredData.value.length) {
      return {
        mobile: 0,
        desktop: 0,
        new: 0,
        returning: 0,
        paid: 0,
        unpaid: 0,
      }
    }

    // Calcul des moyennes avec validation des NaN
    const validMobileShares = filteredData.value
      .map((item: any) => Number(item.mobile_share))
      .filter((val: number) => !isNaN(val) && val !== null && val !== undefined)

    const validNewVisitorRates = filteredData.value
      .map((item: any) => Number(item.new_visitor_rate))
      .filter((val: number) => !isNaN(val) && val !== null && val !== undefined)

    const validPaidTrafficShares = filteredData.value
      .map((item: any) => Number(item.paid_traffic_share))
      .filter((val: number) => !isNaN(val) && val !== null && val !== undefined)

    const avgMobileShare =
      validMobileShares.length > 0
        ? validMobileShares.reduce((sum: number, val: number) => sum + val, 0) /
          validMobileShares.length
        : 0

    const avgNewVisitorRate =
      validNewVisitorRates.length > 0
        ? validNewVisitorRates.reduce((sum: number, val: number) => sum + val, 0) /
          validNewVisitorRates.length
        : 0

    const avgPaidTrafficShare =
      validPaidTrafficShares.length > 0
        ? validPaidTrafficShares.reduce((sum: number, val: number) => sum + val, 0) /
          validPaidTrafficShares.length
        : 0

    return {
      mobile: Math.round(avgMobileShare * 100),
      desktop: Math.round((1 - avgMobileShare) * 100),
      new: Math.round(avgNewVisitorRate * 100),
      returning: Math.round((1 - avgNewVisitorRate) * 100),
      paid: Math.round(avgPaidTrafficShare * 100),
      unpaid: Math.round((1 - avgPaidTrafficShare) * 100),
    }
  })

  // Calcul des variations YoY
  const yoyChanges = computed(() => {
    console.log(
      '🚦 useTrafficMetrics - yoyChanges - filteredData.value.length:',
      filteredData.value.length,
    )

    if (!filteredData.value.length) {
      return {
        overall: 0,
        desktop: 0,
        mobile: 0,
        unpaid: 0,
        new: 0,
        returning: 0,
      }
    }

    // Debug: voir les champs disponibles dans la première ligne
    console.log(
      '🚦 useTrafficMetrics - yoyChanges - Première ligne de données:',
      filteredData.value[0],
    )

    console.log('🚦 useTrafficMetrics - yoyChanges - Champs YoY disponibles:', {
      yoy_change: filteredData.value[0]?.yoy_change,
      mobile_yoy_change: filteredData.value[0]?.mobile_yoy_change,
      new_visitor_yoy_change: filteredData.value[0]?.new_visitor_yoy_change,
      paid_traffic_yoy_change: filteredData.value[0]?.paid_traffic_yoy_change,
    })

    // Moyenne des changements YoY
    const avgYoyChange =
      filteredData.value.reduce((sum: number, item: any) => sum + (item.yoy_change || 0), 0) /
      filteredData.value.length
    const avgMobileYoyChange =
      filteredData.value.reduce(
        (sum: number, item: any) => sum + (item.mobile_yoy_change || 0),
        0,
      ) / filteredData.value.length
    const avgNewVisitorYoyChange =
      filteredData.value.reduce(
        (sum: number, item: any) => sum + (item.new_visitor_yoy_change || 0),
        0,
      ) / filteredData.value.length
    const avgPaidTrafficYoyChange =
      filteredData.value.reduce(
        (sum: number, item: any) => sum + (item.paid_traffic_yoy_change || 0),
        0,
      ) / filteredData.value.length

    const result = {
      overall: Math.round(avgYoyChange),
      desktop: Math.round(avgYoyChange - avgMobileYoyChange), // Approximation
      mobile: Math.round(avgMobileYoyChange),
      unpaid: Math.round(avgYoyChange - avgPaidTrafficYoyChange), // Approximation
      new: Math.round(avgNewVisitorYoyChange),
      returning: Math.round(avgYoyChange - avgNewVisitorYoyChange), // Approximation
    }

    return result
  })

  // Calcul des parts de trafic par canal
  const trafficShareByChannel = computed(() => {
    if (!filteredData.value.length) {
      return {
        direct: 0,
        display: 0,
        email: 0,
        organic_search: 0,
        organic_social: 0,
        paid_search: 0,
      }
    }

    // Extraire les données des champs JSON
    const channelData = filteredData.value
      .map((item: any) => item.traffic_share_by_channel)
      .filter(Boolean)

    if (!channelData.length) {
      return {
        direct: 0,
        display: 0,
        email: 0,
        organic_search: 0,
        organic_social: 0,
        paid_search: 0,
      }
    }

    // Calculer les moyennes pour chaque canal
    const channels = [
      'direct',
      'display',
      'email',
      'organic_search',
      'organic_social',
      'paid_search',
    ]
    const result: Record<string, number> = {}

    channels.forEach((channel) => {
      const values = channelData
        .map((data: any) => data[channel])
        .filter((value: any) => typeof value === 'number')

      if (values.length > 0) {
        result[channel] = Math.round(
          (values.reduce((sum: number, val: number) => sum + val, 0) / values.length) * 100,
        )
      } else {
        result[channel] = 0
      }
    })

    return result
  })

  // Calcul des métriques d'acquisition selon le type de visiteur
  const acquisitionMetrics = computed(() => {
    if (!filteredData.value.length) {
      return [
        { label: 'Organic Search', value: 0 },
        { label: 'Direct', value: 0 },
        { label: 'Social', value: 0 },
        { label: 'Email', value: 0 },
        { label: 'Paid Search', value: 0 },
      ]
    }

    const visitorType = globalFilters.selectedVisitorType

    // Calculer les moyennes selon le type de visiteur
    let baseMultiplier = 1

    if (visitorType === 'New') {
      // Pour les nouveaux visiteurs, utiliser new_visitor_rate
      const avgNewVisitorRate =
        filteredData.value.reduce(
          (sum: number, item: any) => sum + (Number(item.new_visitor_rate) || 0),
          0,
        ) / filteredData.value.length
      baseMultiplier = avgNewVisitorRate
    } else if (visitorType === 'Returning') {
      // Pour les visiteurs de retour, utiliser returning_visitor_rate
      const avgReturningVisitorRate =
        filteredData.value.reduce(
          (sum: number, item: any) => sum + (Number(item.returning_visitor_rate) || 0),
          0,
        ) / filteredData.value.length
      baseMultiplier = avgReturningVisitorRate
    }
    // Pour "All visitors", baseMultiplier reste à 1

    // Calculer la moyenne des parts de trafic payant
    const avgPaidTrafficShare =
      filteredData.value.reduce(
        (sum: number, item: any) => sum + (Number(item.paid_traffic_share) || 0),
        0,
      ) / filteredData.value.length

    // Appliquer les variations selon le type de visiteur
    const organicShare = Math.round((1 - avgPaidTrafficShare) * 0.5 * 100 * baseMultiplier)
    const directShare = Math.round((1 - avgPaidTrafficShare) * 0.3 * 100 * baseMultiplier)
    const socialShare = Math.round((1 - avgPaidTrafficShare) * 0.1 * 100 * baseMultiplier)
    const emailShare = Math.round((1 - avgPaidTrafficShare) * 0.05 * 100 * baseMultiplier)
    const paidShare = Math.round(avgPaidTrafficShare * 100 * baseMultiplier)

    // Variations YoY spécifiques selon le type de visiteur
    let variations = [-15, -25, -10, -5, 30] // Valeurs par défaut pour "All visitors"

    if (visitorType === 'New') {
      // Nouveaux visiteurs : plus de croissance sur paid et organic, moins sur direct
      variations = [-10, -35, -5, -2, 40]
    } else if (visitorType === 'Returning') {
      // Visiteurs de retour : plus stable, moins de croissance paid
      variations = [-20, -15, -15, -8, 15]
    }

    return [
      { label: 'Organic Search', value: Math.round(organicShare * (1 + variations[0] / 100)) },
      { label: 'Direct', value: Math.round(directShare * (1 + variations[1] / 100)) },
      { label: 'Social', value: Math.round(socialShare * (1 + variations[2] / 100)) },
      { label: 'Email', value: Math.round(emailShare * (1 + variations[3] / 100)) },
      { label: 'Paid Search', value: Math.round(paidShare * (1 + variations[4] / 100)) },
    ]
  })

  // Calcul des variations YoY par canal
  const channelYoyChanges = computed(() => {
    if (!filteredData.value.length) {
      return []
    }

    const channelData = filteredData.value
      .map((item: any) => item.channel_yoy_changes)
      .filter(Boolean)

    if (!channelData.length) {
      return []
    }

    const channels = [
      { label: 'Direct (30%)', key: 'direct' },
      { label: 'Organic Search (25%)', key: 'organic_search' },
      { label: 'Paid Search (15%)', key: 'paid_search' },
      { label: 'Email (8%)', key: 'email' },
      { label: 'Paid Social (6%)', key: 'paid_social' },
      { label: 'Display & Ads (9%)', key: 'display' },
    ]

    return channels.map((channel) => {
      const values = channelData
        .map((data: any) => data[channel.key])
        .filter((value: any) => typeof value === 'number')

      const avgChange =
        values.length > 0
          ? values.reduce((sum: number, val: number) => sum + val, 0) / values.length
          : 0

      return {
        label: channel.label,
        values: [0, Math.round(avgChange), 0],
        display: (val: number) => `${val > 0 ? '+' : ''}${val}%`,
      }
    })
  })

  // Calcul du trafic quotidien moyen
  const avgDailyTraffic = computed(() => {
    if (!filteredData.value.length) return 0

    const total = filteredData.value.reduce(
      (sum: number, item: any) => sum + item.avg_daily_traffic,
      0,
    )
    return Math.round(total / filteredData.value.length)
  })

  // Calcul du rang percentile moyen
  const avgPercentileRank = computed(() => {
    if (!filteredData.value.length) return 0

    const total = filteredData.value.reduce(
      (sum: number, item: any) => sum + item.percentile_rank,
      0,
    )
    return Math.round(total / filteredData.value.length)
  })

  // Données pour le graphique linéaire
  const chartData = computed(() => {
    console.log(
      '🚦 useTrafficMetrics - chartData - filteredData.value.length:',
      filteredData.value.length,
    )

    if (!filteredData.value.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [],
      }
    }

    // Grouper par mois d'analyse et calculer les moyennes
    const monthlyData = filteredData.value.reduce(
      (acc: any, item: any) => {
        if (!acc[item.analysis_month]) {
          acc[item.analysis_month] = []
        }
        acc[item.analysis_month].push(item)
        return acc
      },
      {} as Record<string, TrafficData[]>,
    )

    const months = Object.keys(monthlyData).sort()
    const labels = months.slice(-7) // Derniers 7 mois

    // Calculer les moyennes pour chaque métrique
    const mobileData = labels.map((month) => {
      const items = monthlyData[month]
      const avg =
        items.reduce((sum: number, item: any) => sum + item.mobile_share, 0) / items.length
      return Math.round(avg * 100)
    })

    const newVisitorData = labels.map((month) => {
      const items = monthlyData[month]
      const avg =
        items.reduce((sum: number, item: any) => sum + item.new_visitor_rate, 0) / items.length
      return Math.round(avg * 100)
    })

    const paidTrafficData = labels.map((month) => {
      const items = monthlyData[month]
      const avg =
        items.reduce((sum: number, item: any) => sum + item.paid_traffic_share, 0) / items.length
      return Math.round(avg * 100)
    })

    return {
      labels,
      datasets: [
        {
          label: 'By Device',
          data: mobileData,
          borderColor: '#C1E3B1',
          backgroundColor: '#C1E3B1',
          tension: 0.4,
        },
        {
          label: 'New v. Returning',
          data: newVisitorData,
          borderColor: '#6D9A7A',
          backgroundColor: '#6D9A7A',
          tension: 0.4,
        },
        {
          label: 'Paid v. Unpaid',
          data: paidTrafficData,
          borderColor: '#2F654B',
          backgroundColor: '#2F654B',
          tension: 0.4,
        },
      ],
    }
  })

  // État de chargement et erreurs
  const isLoading = computed(() => !data.value || data.value.length === 0)
  const error = computed(() => null) // TODO: gérer les erreurs

  // Test unitaire complet pour identifier les NaN
  if (filteredData.value.length > 0) {
    testTrafficMetrics(filteredData.value)
  }

  return {
    filteredData,
    benchmarkMetrics,
    yoyChanges,
    trafficShareByChannel,
    channelYoyChanges,
    acquisitionMetrics,
    avgDailyTraffic,
    avgPercentileRank,
    chartData,
    isLoading,
    error,
  }
}
