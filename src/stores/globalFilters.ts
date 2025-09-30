import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabaseData } from '../composables/useSupabaseData'

export const useGlobalFiltersStore = defineStore('globalFilters', () => {
  const selectedMonth = ref('All Months')
  const selectedCountry = ref('All Countries')
  const selectedIndustry = ref('All Industries')
  const selectedDevice = ref('All Devices')
  const selectedVisitorType = ref('All visitors')

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

  const deviceOptions = computed(() => {
    const mapped = filterOptions.value.devices
      // masquer all_devices provenant de la DB
      .filter((d: string) => String(d).toLowerCase() !== 'all_devices')
      .map((d: string) => {
        const val = String(d).toLowerCase()
        if (val === '1') return { label: 'Desktop', value: 'Desktop' }
        if (val === '2') return { label: 'Mobile', value: 'Mobile' }
        return { label: d, value: d }
      })

    return [{ label: 'All Devices', value: 'All Devices' }, ...mapped]
  })

  const visitorTypeOptions = computed(() => [
    { label: 'All visitors', value: 'All visitors' },
    { label: 'New', value: 'New' },
    { label: 'Returning', value: 'Returning' },
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
  function setVisitorType(visitorType: string) {
    selectedVisitorType.value = visitorType
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
    selectedVisitorType,
    setVisitorType,
    monthOptions,
    countryOptions,
    industryOptions,
    deviceOptions,
    visitorTypeOptions,
    initializeData,
  }
})
