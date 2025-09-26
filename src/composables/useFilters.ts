import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'

export interface FilterOptions {
  countries: string[]
  industries: string[]
  months: string[]
  devices: string[]
}

export interface FilterState {
  selectedCountry: string
  selectedIndustry: string
  selectedMonth: string
  selectedDevice: string
}

export function useFilters() {
  const { supabase } = useSupabase()

  // État des options de filtres
  const filterOptions = ref<FilterOptions>({
    countries: [],
    industries: [],
    months: [],
    devices: [],
  })

  // État de chargement
  const loading = ref({
    countries: false,
    industries: false,
    months: false,
    devices: false,
  })

  // État des filtres sélectionnés
  const selectedFilters = ref<FilterState>({
    selectedCountry: '',
    selectedIndustry: '',
    selectedMonth: '',
    selectedDevice: '',
  })

  // Computed pour les filtres actifs
  const activeFilters = computed(() => ({
    country: selectedFilters.value.selectedCountry,
    industry: selectedFilters.value.selectedIndustry,
    month: selectedFilters.value.selectedMonth,
    device: selectedFilters.value.selectedDevice,
  }))

  // Fonction pour charger les options de pays
  const loadCountries = async () => {
    try {
      loading.value.countries = true
      const { data, error } = await supabase
        .from('data')
        .select('country')
        .not('country', 'is', null)
        .order('country')

      if (error) throw error

      const uniqueCountries = [...new Set(data?.map((row) => row.country) || [])]
      filterOptions.value.countries = ['All Countries', ...uniqueCountries]
    } catch (err) {
      console.error('Erreur lors du chargement des pays:', err)
    } finally {
      loading.value.countries = false
    }
  }

  // Fonction pour charger les options d'industries
  const loadIndustries = async () => {
    try {
      loading.value.industries = true
      const { data, error } = await supabase
        .from('data')
        .select('industry')
        .not('industry', 'is', null)
        .order('industry')

      if (error) throw error

      const uniqueIndustries = [...new Set(data?.map((row) => row.industry) || [])]
      filterOptions.value.industries = ['All Industries', ...uniqueIndustries]
    } catch (err) {
      console.error('Erreur lors du chargement des industries:', err)
    } finally {
      loading.value.industries = false
    }
  }

  // Fonction pour charger les options de mois
  const loadMonths = async () => {
    try {
      loading.value.months = true
      const { data, error } = await supabase
        .from('data')
        .select('analysis_month')
        .not('analysis_month', 'is', null)
        .order('analysis_month', { ascending: false })

      if (error) throw error

      const uniqueMonths = [...new Set(data?.map((row) => row.analysis_month) || [])]
      filterOptions.value.months = ['All Months', ...uniqueMonths]
    } catch (err) {
      console.error('Erreur lors du chargement des mois:', err)
    } finally {
      loading.value.months = false
    }
  }

  // Fonction pour charger les options de devices
  const loadDevices = async () => {
    try {
      loading.value.devices = true
      const { data, error } = await supabase
        .from('data')
        .select('device')
        .not('device', 'is', null)
        .order('device')

      if (error) throw error

      const uniqueDevices = [...new Set(data?.map((row) => row.device) || [])]
      filterOptions.value.devices = ['All Devices', ...uniqueDevices]
    } catch (err) {
      console.error('Erreur lors du chargement des devices:', err)
    } finally {
      loading.value.devices = false
    }
  }

  // Fonction pour charger tous les filtres
  const loadAllFilters = async () => {
    await Promise.all([loadCountries(), loadIndustries(), loadMonths(), loadDevices()])
  }

  // Fonction pour mettre à jour un filtre
  const updateFilter = (filterType: keyof FilterState, value: string) => {
    selectedFilters.value[filterType] = value
  }

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    selectedFilters.value = {
      selectedCountry: '',
      selectedIndustry: '',
      selectedMonth: '',
      selectedDevice: '',
    }
  }

  // Fonction pour vérifier si des filtres sont actifs
  const hasActiveFilters = computed(() => {
    return !!(
      selectedFilters.value.selectedCountry ||
      selectedFilters.value.selectedIndustry ||
      selectedFilters.value.selectedMonth ||
      selectedFilters.value.selectedDevice
    )
  })

  return {
    // État
    filterOptions,
    loading,
    selectedFilters,

    // Computed
    activeFilters,
    hasActiveFilters,

    // Actions
    loadCountries,
    loadIndustries,
    loadMonths,
    loadDevices,
    loadAllFilters,
    updateFilter,
    resetFilters,
  }
}
