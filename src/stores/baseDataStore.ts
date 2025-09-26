import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interface de base pour les filtres
export interface BaseFilters {
  country: string
  industry: string
  month: string
  device: string
}

// Interface de base pour l'état des données
export interface BaseDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Store de base réutilisable
export function createBaseDataStore<T>(storeName: string) {
  return defineStore(storeName, () => {
    // État des filtres
    const selectedCountry = ref<string>('')
    const selectedIndustry = ref<string>('')
    const selectedMonth = ref<string>('')
    const selectedDevice = ref<string>('')

    // État des données
    const data = ref<T | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed pour les filtres actifs
    const activeFilters = computed<BaseFilters>(() => ({
      country: selectedCountry.value,
      industry: selectedIndustry.value,
      month: selectedMonth.value,
      device: selectedDevice.value,
    }))

    // Fonction générique pour mettre à jour les filtres
    const updateFilters = (filters: Partial<BaseFilters>) => {
      if (filters.country !== undefined) selectedCountry.value = filters.country
      if (filters.industry !== undefined) selectedIndustry.value = filters.industry
      if (filters.month !== undefined) selectedMonth.value = filters.month
      if (filters.device !== undefined) selectedDevice.value = filters.device
    }

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
      selectedCountry.value = ''
      selectedIndustry.value = ''
      selectedMonth.value = ''
      selectedDevice.value = ''
    }

    // Fonction pour vérifier si des filtres sont actifs
    const hasActiveFilters = computed(() => {
      return !!(
        selectedCountry.value ||
        selectedIndustry.value ||
        selectedMonth.value ||
        selectedDevice.value
      )
    })

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
      hasActiveFilters,

      // Actions
      updateFilters,
      resetFilters,
    }
  })
}
