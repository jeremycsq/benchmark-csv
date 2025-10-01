import { computed } from 'vue'
import { useSupabaseData, type TrafficData } from './useSupabaseData'
import { useGlobalFiltersStore } from '../stores/globalFilters'

export function useEngagementMetrics() {
  const { data, getFilteredData } = useSupabaseData()
  const globalFilters = useGlobalFiltersStore()

  console.log(
    'useEngagementMetrics - Table engagement pas encore disponible, utilisation de données simulées',
  )

  // Données filtrées selon les filtres globaux
  const filteredData = computed(() => {
    console.log(
      'useEngagementMetrics - data.value (avant filtrage):',
      data.value.length,
      'éléments',
    )
    console.log('useEngagementMetrics - Première ligne de data.value:', data.value[0])

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
    if (globalFilters.selectedMonth !== 'All Months') {
      filters.analysis_month = globalFilters.selectedMonth
    }

    console.log('useEngagementMetrics - Filtres globaux:', {
      selectedCountry: globalFilters.selectedCountry,
      selectedIndustry: globalFilters.selectedIndustry,
      selectedDevice: globalFilters.selectedDevice,
      selectedMonth: globalFilters.selectedMonth,
    })
    console.log('useEngagementMetrics - Filtres appliqués:', filters)

    const filtered = getFilteredData(filters)
    console.log('useEngagementMetrics - Données filtrées:', filtered.length, 'éléments')
    if (filtered.length > 0) {
      console.log('useEngagementMetrics - Première ligne filtrée:', filtered[0])
    }

    return filtered
  })

  // Métriques d'engagement calculées depuis les données filtrées
  const engagementMetrics = computed(() => {
    console.log('useEngagementMetrics - engagementMetrics recalculé')
    console.log('useEngagementMetrics - filteredData.value.length:', filteredData.value.length)

    if (!filteredData.value.length) {
      console.log('useEngagementMetrics - Pas de données filtrées')
      return {
        pageviewsPerSession: { yoy: 0, mom: 0, value: 0 },
        newVisitorPageviews: { yoy: 0, mom: 0, value: 0 },
        timePerSession: { yoy: 0, mom: 0, value: 0 },
        scrollRate: { yoy: 0, mom: 0, value: 0 },
      }
    }

    // Données simulées pour engagement (en attendant la table engagement)
    // Basées sur les données traffic existantes et des valeurs réalistes

    // Calculer des valeurs de base basées sur les filtres
    const baseValue =
      filteredData.value.length > 0
        ? filteredData.value.reduce(
            (sum: number, item: TrafficData) => sum + (Number(item.yoy_change) || 0),
            0,
          ) / filteredData.value.length
        : 0

    const pageviewsPerSession = {
      yoy: Math.round((baseValue * 0.3 + Math.random() * 10 - 5) * 10) / 10, // -10.5% to +13.5%
      mom: Math.round((Math.random() * 20 - 10) * 10) / 10, // -10% to +10%
      value: Math.round((2.5 + Math.random() * 1.5) * 10) / 10, // 2.5-4.0 pages/session
    }

    const newVisitorPageviews = {
      yoy: Math.round((baseValue * 0.8 + Math.random() * 15 - 7.5) * 10) / 10, // Basé sur les données existantes
      mom: Math.round((Math.random() * 25 - 12.5) * 10) / 10, // -12.5% to +12.5%
      value: Math.round((3.2 + Math.random() * 1.0) * 10) / 10, // 3.2-4.2 pages/session
    }

    const timePerSession = {
      yoy: Math.round((Math.random() * 16 - 8) * 10) / 10, // -8% to +8%
      mom: Math.round((Math.random() * 8 - 4) * 10) / 10, // -4% to +4%
      value: Math.round(120 + Math.random() * 60), // 120-180 secondes (2-3 minutes)
    }

    const scrollRate = {
      yoy: Math.round((Math.random() * 20 - 10) * 10) / 10, // -10% to +10%
      mom: Math.round((Math.random() * 12 - 6) * 10) / 10, // -6% to +6%
      value: Math.round((65 + Math.random() * 15) * 10) / 10, // 65-80%
    }

    const result = {
      pageviewsPerSession,
      newVisitorPageviews,
      timePerSession,
      scrollRate,
    }

    console.log('✅ useEngagementMetrics - Métriques calculées:', result)
    return result
  })

  // Valeurs pour YoY et MoM (formatées pour l'affichage)
  const yoyChanges = computed(() => {
    const metrics = engagementMetrics.value
    return {
      pageviewsPerSession: Math.round(metrics.pageviewsPerSession.yoy * 10) / 10,
      newVisitorPageviews: Math.round(metrics.newVisitorPageviews.yoy * 10) / 10,
      timePerSession: Math.round(metrics.timePerSession.yoy * 10) / 10,
      scrollRate: Math.round(metrics.scrollRate.yoy * 10) / 10,
    }
  })

  const momChanges = computed(() => {
    const metrics = engagementMetrics.value
    return {
      pageviewsPerSession: Math.round(metrics.pageviewsPerSession.mom * 10) / 10,
      newVisitorPageviews: Math.round(metrics.newVisitorPageviews.mom * 10) / 10,
      timePerSession: Math.round(metrics.timePerSession.mom * 10) / 10,
      scrollRate: Math.round(metrics.scrollRate.mom * 10) / 10,
    }
  })

  // États de chargement et d'erreur
  const isLoading = computed(() => !data.value || data.value.length === 0)
  const error = computed(() => null) // TODO: Implémenter la gestion d'erreur si nécessaire

  return {
    filteredData,
    engagementMetrics,
    yoyChanges,
    momChanges,
    isLoading,
    error,
  }
}
