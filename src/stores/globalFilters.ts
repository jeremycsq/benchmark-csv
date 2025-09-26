import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabaseData } from '../composables/useSupabaseData'

export const useGlobalFiltersStore = defineStore('globalFilters', () => {
  const selectedMonth = ref('All Months')
  const selectedCountry = ref('All Countries')
  const selectedIndustry = ref('All Industries')
  const selectedDevice = ref('All Devices')

  // Récupérer les données Supabase
  const { filterOptions, fetchAllData } = useSupabaseData()

  // Options pour les selects
  const monthOptions = computed(() => [
    { label: 'All Months', value: 'All Months' },
    ...filterOptions.value.analysis_months.map((month: string) => ({ label: month, value: month })),
  ])

  const countryOptions = computed(() => [
    { label: 'All Countries', value: 'All Countries' },
    ...filterOptions.value.countries.map((country: string) => ({ label: country, value: country })),
  ])

  const industryOptions = computed(() => [
    { label: 'All Industries', value: 'All Industries' },
    ...filterOptions.value.industries.map((industry: string) => ({
      label: industry,
      value: industry,
    })),
  ])

  const deviceOptions = computed(() => [
    { label: 'All Devices', value: 'All Devices' },
    ...filterOptions.value.devices.map((device: string) => ({ label: device, value: device })),
  ])

  function setMonth(month: string) {
    selectedMonth.value = month
  }
  function setCountry(country: string) {
    selectedCountry.value = country
  }
  function setIndustry(industry: string) {
    selectedIndustry.value = industry
  }
  function setDevice(device: string) {
    selectedDevice.value = device
  }

  // Initialiser les données
  function initializeData() {
    console.log('globalFilters - Initialisation des données...')
    fetchAllData()
  }

  return {
    selectedMonth,
    setMonth,
    selectedCountry,
    setCountry,
    selectedIndustry,
    setIndustry,
    selectedDevice,
    setDevice,
    monthOptions,
    countryOptions,
    industryOptions,
    deviceOptions,
    initializeData,
  }
})
