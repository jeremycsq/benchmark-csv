import { computed } from 'vue'
import { useSupabaseData, type TrafficData } from './useSupabaseData'
import { useGlobalFiltersStore } from '../stores/globalFilters'

export function useTrafficMetrics() {
  const { data, getFilteredData } = useSupabaseData()
  const globalFilters = useGlobalFiltersStore()

  // Données filtrées selon les filtres globaux
  const filteredData = computed(() => {
    // Construire les filtres - "All" signifie pas de filtre (undefined)
    const filters: {
      country?: string
      industry?: string
      device?: string
      analysis_month?: string
    } = {}

    // Ajouter seulement les filtres actifs (pas "All")
    if (globalFilters.selectedCountry !== 'All Countries') {
      filters.country = globalFilters.selectedCountry
    }
    if (globalFilters.selectedIndustry !== 'All Industries') {
      filters.industry = globalFilters.selectedIndustry
    }
    if (globalFilters.selectedDevice !== 'All Devices') {
      filters.device = globalFilters.selectedDevice
    }
    if (globalFilters.selectedMonth !== 'All Months') {
      filters.analysis_month = globalFilters.selectedMonth
    }

    console.log('useTrafficMetrics - Filtres globaux:', {
      selectedCountry: globalFilters.selectedCountry,
      selectedIndustry: globalFilters.selectedIndustry,
      selectedDevice: globalFilters.selectedDevice,
      selectedMonth: globalFilters.selectedMonth,
    })
    console.log('useTrafficMetrics - Filtres actifs appliqués:', filters)

    const filtered = getFilteredData(filters)
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

    // Calcul des moyennes
    const avgMobileShare =
      filteredData.value.reduce((sum, item) => sum + item.mobile_share, 0) /
      filteredData.value.length
    const avgNewVisitorRate =
      filteredData.value.reduce((sum, item) => sum + item.new_visitor_rate, 0) /
      filteredData.value.length
    const avgPaidTrafficShare =
      filteredData.value.reduce((sum, item) => sum + item.paid_traffic_share, 0) /
      filteredData.value.length

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

    // Moyenne des changements YoY
    const avgYoyChange =
      filteredData.value.reduce((sum, item) => sum + item.yoy_change, 0) / filteredData.value.length
    const avgMobileYoyChange =
      filteredData.value.reduce((sum, item) => sum + item.mobile_yoy_change, 0) /
      filteredData.value.length
    const avgNewVisitorYoyChange =
      filteredData.value.reduce((sum, item) => sum + item.new_visitor_yoy_change, 0) /
      filteredData.value.length
    const avgPaidTrafficYoyChange =
      filteredData.value.reduce((sum, item) => sum + item.paid_traffic_yoy_change, 0) /
      filteredData.value.length

    return {
      overall: Math.round(avgYoyChange),
      desktop: Math.round(avgYoyChange - avgMobileYoyChange), // Approximation
      mobile: Math.round(avgMobileYoyChange),
      unpaid: Math.round(avgYoyChange - avgPaidTrafficYoyChange), // Approximation
      new: Math.round(avgNewVisitorYoyChange),
      returning: Math.round(avgYoyChange - avgNewVisitorYoyChange), // Approximation
    }
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
      .map((item) => item.traffic_share_by_channel)
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
        .map((data) => data[channel])
        .filter((value) => typeof value === 'number')

      if (values.length > 0) {
        result[channel] = Math.round(
          (values.reduce((sum, val) => sum + val, 0) / values.length) * 100,
        )
      } else {
        result[channel] = 0
      }
    })

    return result
  })

  // Calcul des variations YoY par canal
  const channelYoyChanges = computed(() => {
    if (!filteredData.value.length) {
      return []
    }

    const channelData = filteredData.value.map((item) => item.channel_yoy_changes).filter(Boolean)

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
        .map((data) => data[channel.key])
        .filter((value) => typeof value === 'number')

      const avgChange =
        values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0

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

    const total = filteredData.value.reduce((sum, item) => sum + item.avg_daily_traffic, 0)
    return Math.round(total / filteredData.value.length)
  })

  // Calcul du rang percentile moyen
  const avgPercentileRank = computed(() => {
    if (!filteredData.value.length) return 0

    const total = filteredData.value.reduce((sum, item) => sum + item.percentile_rank, 0)
    return Math.round(total / filteredData.value.length)
  })

  // Données pour le graphique linéaire
  const chartData = computed(() => {
    if (!filteredData.value.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [],
      }
    }

    // Grouper par mois d'analyse et calculer les moyennes
    const monthlyData = filteredData.value.reduce(
      (acc, item) => {
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
      const avg = items.reduce((sum, item) => sum + item.mobile_share, 0) / items.length
      return Math.round(avg * 100)
    })

    const newVisitorData = labels.map((month) => {
      const items = monthlyData[month]
      const avg = items.reduce((sum, item) => sum + item.new_visitor_rate, 0) / items.length
      return Math.round(avg * 100)
    })

    const paidTrafficData = labels.map((month) => {
      const items = monthlyData[month]
      const avg = items.reduce((sum, item) => sum + item.paid_traffic_share, 0) / items.length
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

  // Debug: afficher les données
  console.log('useTrafficMetrics - data.value:', data.value)
  console.log('useTrafficMetrics - filteredData.value:', filteredData.value)
  console.log('useTrafficMetrics - yoyChanges.value:', yoyChanges.value)

  return {
    filteredData,
    benchmarkMetrics,
    yoyChanges,
    trafficShareByChannel,
    channelYoyChanges,
    avgDailyTraffic,
    avgPercentileRank,
    chartData,
    isLoading,
    error,
  }
}
