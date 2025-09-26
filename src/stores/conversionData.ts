import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

export const useConversionDataStore = defineStore('conversionData', () => {
  const globalFilters = useGlobalFiltersStore()

  // Filtres synchronisés avec les filtres globaux
  const selectedMonth = computed(() => globalFilters.selectedMonth)
  const selectedCountry = computed(() => globalFilters.selectedCountry)
  const selectedIndustry = computed(() => globalFilters.selectedIndustry)
  const selectedDevice = computed(() => globalFilters.selectedDevice)

  // Setters pour chaque filtre
  function setMonth(month: string) {
    globalFilters.setMonth(month)
  }
  function setCountry(country: string) {
    globalFilters.setCountry(country)
  }
  function setDevice(device: string) {
    globalFilters.setDevice(device)
  }
  function setIndustry(industry: string) {
    globalFilters.setIndustry(industry)
  }

  // Données de conversion randomisées
  const conversionRate = ref(2.8)
  const revenuePerVisit = ref(28.5)
  const checkoutCompletion = ref(78.2)
  const addToCartRate = ref(12.5)
  const cartAbandonmentRate = ref(65.3)

  // Fonction pour randomiser les données
  function randomizeConversionData() {
    function randomFloat(min: number, max: number, decimals = 1) {
      return +(Math.random() * (max - min) + min).toFixed(decimals)
    }

    conversionRate.value = randomFloat(1.5, 4.0, 1)
    revenuePerVisit.value = randomFloat(15, 45, 1)
    checkoutCompletion.value = randomFloat(65, 90, 1)
    addToCartRate.value = randomFloat(8, 18, 1)
    cartAbandonmentRate.value = randomFloat(55, 75, 1)
  }

  // Fonction pour récupérer les données (simulation d'API)
  async function fetchConversionData() {
    // Simuler un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100))
    randomizeConversionData()
    return {
      conversionRate: conversionRate.value,
      revenuePerVisit: revenuePerVisit.value,
      checkoutCompletion: checkoutCompletion.value,
      addToCartRate: addToCartRate.value,
      cartAbandonmentRate: cartAbandonmentRate.value,
    }
  }

  return {
    // Filtres (synchronisés avec les filtres globaux)
    selectedMonth,
    selectedCountry,
    selectedIndustry,
    selectedDevice,
    setMonth,
    setCountry,
    setDevice,
    setIndustry,

    // Données
    conversionRate,
    revenuePerVisit,
    checkoutCompletion,
    addToCartRate,
    cartAbandonmentRate,

    // Actions
    randomizeConversionData,
    fetchConversionData,
  }
})
