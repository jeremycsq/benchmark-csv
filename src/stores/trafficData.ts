import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

export interface TrafficMetrics {
  avg_daily_traffic: number
  yoy_change: number
  mom_change: number
  new_visitor_rate: number
  returning_visitor_rate: number
}

export interface TrafficData {
  metrics: TrafficMetrics
  mobile_metrics: {
    mobile_share: number
    mobile_yoy_change: number
    mobile_mom_change: number
  }
  paid_traffic_metrics: {
    paid_traffic_share: number
    paid_traffic_yoy_change: number
    paid_traffic_mom_change: number
  }
}

export interface TrafficHeaderData {
  yoy_change: number | null
  mobile_yoy_change: number | null
  paid_traffic_share: number | null
  mom_change: number | null
  mobile_mom_change: number | null
  paid_traffic_mom_change: number | null
  new_visitor: number | null // valeur temporaire
}

export const useTrafficDataStore = defineStore('trafficData', () => {
  const globalFilters = useGlobalFiltersStore()

  // Filtres synchronisés avec les filtres globaux
  const selectedCountry = computed(() => globalFilters.selectedCountry)
  const selectedIndustry = computed(() => globalFilters.selectedIndustry)
  const selectedMonth = computed(() => globalFilters.selectedMonth)
  const selectedDevice = computed(() => globalFilters.selectedDevice)

  // État des données (même structure que l'API externe)
  const data = ref<TrafficHeaderData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed pour les filtres actifs
  const activeFilters = computed(() => ({
    country: selectedCountry.value,
    industry: selectedIndustry.value,
    month: selectedMonth.value,
    device: selectedDevice.value,
  }))

  // Fonction pour mettre à jour les filtres (maintenant synchronisés avec les filtres globaux)
  const updateFilters = (
    filters: Partial<{ country: string; industry: string; month: string; device: string }>,
  ) => {
    if (filters.country !== undefined) globalFilters.selectedCountry = filters.country
    if (filters.industry !== undefined) globalFilters.selectedIndustry = filters.industry
    if (filters.month !== undefined) globalFilters.selectedMonth = filters.month
    if (filters.device !== undefined) globalFilters.selectedDevice = filters.device

    // Recharger les données quand les filtres changent
    fetchTrafficData()
  }

  // Fonction pour récupérer les données de trafic
  const fetchTrafficData = async () => {
    loading.value = true
    error.value = null
    // Génère des valeurs randomisées pour simuler la data
    function rand(min: number, max: number, decimals = 1) {
      return +(Math.random() * (max - min) + min).toFixed(decimals)
    }
    data.value = {
      yoy_change: rand(-20, 20),
      mobile_yoy_change: rand(-20, 20),
      paid_traffic_share: rand(0, 100),
      mom_change: rand(-15, 25),
      mobile_mom_change: rand(-15, 25),
      paid_traffic_mom_change: rand(0, 100),
      new_visitor: rand(0, 100),
    }
    loading.value = false
  }

  return {
    // État
    selectedCountry,
    selectedIndustry,
    selectedMonth,
    selectedDevice,
    data,
    loading,
    error,

    // Computed
    activeFilters,

    // Actions
    updateFilters,
    fetchTrafficData,
  }
})
