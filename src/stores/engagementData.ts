import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

export const useEngagementDataStore = defineStore('engagementData', () => {
  const globalFilters = useGlobalFiltersStore()

  // Filtres synchronisés avec les filtres globaux
  const selectedMonth = computed(() => globalFilters.selectedMonth)
  const selectedCountry = computed(() => globalFilters.selectedCountry)
  const selectedDevice = computed(() => globalFilters.selectedDevice)
  const selectedIndustry = computed(() => globalFilters.selectedIndustry)

  // Computed pour les filtres actifs
  const activeFilters = computed(() => ({
    month: selectedMonth.value,
    country: selectedCountry.value,
    device: selectedDevice.value,
    industry: selectedIndustry.value,
  }))

  // Setters (maintenant synchronisés avec les filtres globaux)
  function setMonth(month: string) {
    globalFilters.selectedMonth = month
  }
  function setCountry(country: string) {
    globalFilters.selectedCountry = country
  }
  function setDevice(device: string) {
    globalFilters.selectedDevice = device
  }
  function setIndustry(industry: string) {
    globalFilters.selectedIndustry = industry
  }

  return {
    selectedMonth,
    selectedCountry,
    selectedDevice,
    selectedIndustry,
    activeFilters,
    setMonth,
    setCountry,
    setDevice,
    setIndustry,
  }
})
