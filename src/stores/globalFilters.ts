import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalFiltersStore = defineStore('globalFilters', () => {
  const selectedMonth = ref('All Months')
  const selectedCountry = ref('All Countries')
  const selectedIndustry = ref('All Industries')
  const selectedDevice = ref('All Devices')

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

  return {
    selectedMonth,
    setMonth,
    selectedCountry,
    setCountry,
    selectedIndustry,
    setIndustry,
    selectedDevice,
    setDevice,
  }
})
