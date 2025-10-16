import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSupabaseData } from '../composables/useSupabaseData'
import { useRoute } from 'vue-router'

export const useGlobalFiltersStore = defineStore('globalFilters', () => {
  const selectedMonth = ref('All months')
  const selectedCountry = ref('All countries')

  const selectedIndustry = ref('All industries')
  const selectedDevice = ref('All devices')
  const selectedVisitorType = ref('All visitors')

  // Route actuelle pour déterminer la table
  const route = useRoute()

  // Déterminer la table active selon la route
  const activeTable = computed(() => {
    const table = (() => {
      switch (route.path) {
        case '/traffic':
          return 'traffic'
        case '/engagement':
          return 'engagement'
        case '/frustration':
          return 'frustration'
        case '/conversion':
          return 'conversion'
        default:
          return 'traffic'
      }
    })()
    console.log(`🎯 globalFilters - Table active détectée: ${table} (route: ${route.path})`)
    return table
  })

  // Récupérer les données Supabase avec support multi-table
  const { filterOptions, fetchTableData } = useSupabaseData()

  // Options pour les selects - spécifiques à la table active
  const formatMonthLabel = (v: string): string => {
    if (!v) return ''
    if (/^\d{4}-\d{2}(-\d{2})?$/.test(v)) {
      const iso = v.length === 7 ? `${v}-01` : v
      const d = new Date(iso)
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      }
    }
    return v
  }

  const monthOptions = computed(() => {
    const months = filterOptions.value.analysis_months || []
    return [
      { label: 'All months', value: 'All months' },
      ...months.map((month: string) => ({ label: formatMonthLabel(month), value: month })),
    ]
  })

  const countryOptions = computed(() => {
    const countries = filterOptions.value.countries || []
    console.log('🌍 globalFilters - Pays dans filterOptions:', countries)

    // Filtrer pour exclure "Global" des options affichées (car "All Countries" = "Global")
    const filteredCountries = countries.filter((country: string) => country !== 'Global')

    const options = [
      { label: 'All countries', value: 'All countries' },
      ...filteredCountries.map((country: string) => ({ label: country, value: country })),
    ]
    console.log('🌍 globalFilters - Options de pays générées (sans Global):', options)
    return options
  })

  const industryOptions = computed(() => {
    const industries = filterOptions.value.industries || []
    return [
      { label: 'All Industries', value: 'All Industries' },
      ...industries.map((industry: string) => ({
        label: industry,
        value: industry,
      })),
    ]
  })

  const deviceOptions = computed(() => {
    const devices = filterOptions.value.devices || []
    let mapped = []

    const mapCommon = (d: string) => {
      const val = String(d).toLowerCase()
      if (val === '1') return { label: 'Desktop', value: 'Desktop' }
      if (val === '2') return { label: 'Mobile', value: 'Mobile' }
      if (val === 'tablet') return { label: 'Tablet', value: 'Tablet' }
      return { label: d, value: d }
    }

    if (activeTable.value === 'traffic') {
      // Pour traffic : mapper les codes numériques
      mapped = devices
        .filter((d: string) => String(d).toLowerCase() !== 'all_devices')
        .map((d: string) => mapCommon(d))
    } else {
      // Pour frustration, engagement, conversion : mapper aussi 1/2 → Desktop/Mobile et filtrer all_device(s)
      mapped = devices
        .filter((d: string) => !['all_device', 'all_devices'].includes(String(d).toLowerCase()))
        .map((d: string) => mapCommon(d))
    }

    return [{ label: 'All devices', value: 'All devices' }, ...mapped]
  })

  const visitorTypeOptions = computed(() => [
    { label: 'All visitors', value: 'All visitors' },
    { label: 'New', value: 'New' },
    { label: 'Returning', value: 'Returning' },
  ])

  function setMonth(month: string) {
    selectedMonth.value = month
  }
  const selectedMonthLabel = computed(() => {
    const v = selectedMonth.value
    if (!v || String(v).toLowerCase() === 'all months') return 'All months'
    return formatMonthLabel(String(v))
  })
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

  // Initialiser les données selon la table active
  function initializeData(table?: string) {
    const tableToUse = table || activeTable.value
    console.log(`globalFilters - Initialisation des données pour la table: ${tableToUse}`)

    // Récupérer les options spécifiques à la table active
    fetchTableData(tableToUse)
  }

  // Réinitialiser les sélecteurs quand on change de page (table active)
  watch(
    activeTable,
    (newTable, oldTable) => {
      console.log('🔁 globalFilters - Changement de page, reset des filtres:', {
        from: oldTable,
        to: newTable,
      })
      selectedMonth.value = 'All months'
      selectedCountry.value = 'All countries'
      selectedIndustry.value = 'All industries'
      selectedDevice.value = 'All devices'
      selectedVisitorType.value = 'All visitors'

      // Rafraîchir les options pour la nouvelle table
      fetchTableData(newTable)
    },
    { immediate: false },
  )

  return {
    selectedMonth,
    selectedMonthLabel,
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
