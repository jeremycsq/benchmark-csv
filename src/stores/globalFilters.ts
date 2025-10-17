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
  const { filterOptions, fetchTableData, getTableData } = useSupabaseData()

  // Fonction pour récupérer les options spécifiques à la table active
  function getTableSpecificOptions() {
    const tableData = getTableData(activeTable.value).value
    if (tableData && tableData.filterOptions) {
      // Vérifier si les options spécifiques ont des données
      const hasData =
        tableData.filterOptions.countries.length > 0 ||
        tableData.filterOptions.industries.length > 0 ||
        tableData.filterOptions.devices.length > 0 ||
        tableData.filterOptions.analysis_months.length > 0

      if (hasData) {
        console.log(
          `🎯 globalFilters - Options spécifiques pour ${activeTable.value}:`,
          tableData.filterOptions,
        )
        return tableData.filterOptions
      }
    }

    // Fallback vers les options globales si pas de données spécifiques ou données vides
    console.log(
      `⚠️ globalFilters - Pas d'options spécifiques valides pour ${activeTable.value}, utilisation des options globales`,
    )
    return filterOptions.value
  }

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
    // Temporairement utiliser les options globales pour éviter les filtres vides
    const months = filterOptions.value.analysis_months || []
    console.log('📅 globalFilters - Mois dans filterOptions (global):', months)

    return [
      { label: 'All months', value: 'All months' },
      ...months.map((month: string) => ({ label: formatMonthLabel(month), value: month })),
    ]
  })

  const countryOptions = computed(() => {
    // Temporairement utiliser les options globales pour éviter les filtres vides
    const countries = filterOptions.value.countries || []
    console.log('🌍 globalFilters - Pays dans filterOptions (global):', countries)

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
    // Temporairement utiliser les options globales pour éviter les filtres vides
    const industries = filterOptions.value.industries || []
    console.log('🏭 globalFilters - Industries dans filterOptions (global):', industries)

    return [
      { label: 'All Industries', value: 'All Industries' },
      ...industries.map((industry: string) => ({
        label: industry,
        value: industry,
      })),
    ]
  })

  const deviceOptions = computed(() => {
    // Temporairement utiliser les options globales pour éviter les filtres vides
    const devices = filterOptions.value.devices || []
    console.log('📱 globalFilters - Devices dans filterOptions (global):', devices)

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
  async function initializeData(table?: string) {
    const tableToUse = table || activeTable.value
    console.log(`globalFilters - Initialisation des données pour la table: ${tableToUse}`)

    // Récupérer les options spécifiques à la table active
    await fetchTableData(tableToUse)

    // Ajouter un délai pour voir les options après chargement
    setTimeout(() => {
      console.log(`🔄 globalFilters - Après chargement de ${tableToUse}:`)
      console.log('🔄 filterOptions.value:', filterOptions.value)

      // Vérifier les options spécifiques
      const tableData = getTableData(tableToUse).value
      console.log(`🔄 Options spécifiques pour ${tableToUse}:`, tableData?.filterOptions)
    }, 1000)
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
