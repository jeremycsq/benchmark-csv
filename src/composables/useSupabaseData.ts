import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export interface TrafficData {
  id: number
  analysis_month: string
  country: string
  industry: string
  device: string
  avg_daily_traffic: number
  yoy_change: number
  mom_change: string
  new_visitor_rate: number
  returning_visitor_rate: number
  new_visitor_yoy_change: number
  new_visitor_mom_change: string
  mobile_share: number
  mobile_yoy_change: number
  mobile_mom_change: string
  paid_traffic_share: number
  paid_traffic_yoy_change: number
  paid_traffic_mom_change: string
  traffic_share_by_channel: Record<string, unknown>
  bounce_rate_by_channel: Record<string, unknown>
  channel_yoy_changes: Record<string, unknown>
  device_distribution: Record<string, unknown>
  percentile_rank: number
  project_count: number
  calculation_timestamp: string
}

export interface FilterOptions {
  countries: string[]
  industries: string[]
  devices: string[]
  analysis_months: string[]
}

// Instance globale partagée pour éviter les duplications
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalData: any = null

export function useSupabaseData() {
  // Si une instance existe déjà, la retourner
  if (globalData) {
    console.log("useSupabaseData - Utilisation de l'instance existante")
    return globalData
  }

  console.log("useSupabaseData - Création d'une nouvelle instance")
  const data = ref<TrafficData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterOptions = ref<FilterOptions>({
    countries: [],
    industries: [],
    devices: [],
    analysis_months: [],
  })

  // Récupérer toutes les données
  const fetchAllData = async () => {
    try {
      loading.value = true
      error.value = null

      console.log('useSupabaseData - Tentative de récupération des données...')
      console.log('useSupabaseData - Client Supabase:', supabase)

      const { data: result, error: fetchError } = await supabase
        .from('traffic')
        .select(
          'analysis_month, country, industry, device, avg_daily_traffic, yoy_change, mobile_yoy_change, new_visitor_yoy_change, paid_traffic_yoy_change, mobile_share, new_visitor_rate, returning_visitor_rate, paid_traffic_share',
        )
        .order('analysis_month', { ascending: true })

      if (fetchError) {
        console.error('useSupabaseData - Erreur Supabase:', fetchError)
        console.error("useSupabaseData - Détails de l'erreur:", {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code,
        })
        throw fetchError
      }

      console.log('useSupabaseData - Données récupérées:', result)
      console.log("useSupabaseData - Nombre d'éléments:", result?.length || 0)
      console.log('useSupabaseData - Première ligne de données:', result?.[0])
      data.value = result || []
      console.log('useSupabaseData - data.value après assignation:', data.value.length)
      updateFilterOptions()

      return result
    } catch (err) {
      console.error('useSupabaseData - Erreur:', err)
      error.value =
        err instanceof Error ? err.message : 'Erreur lors de la récupération des données'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les options de filtre
  const updateFilterOptions = () => {
    console.log('updateFilterOptions - data.value.length:', data.value.length)
    if (!data.value.length) {
      console.log('updateFilterOptions - Pas de données, arrêt de la mise à jour')
      return
    }

    const countries = new Set<string>()
    const industries = new Set<string>()
    const devices = new Set<string>()
    const analysisMonths = new Set<string>()

    data.value.forEach((item) => {
      if (item.country && item.country.trim()) {
        const country = item.country.trim()
        // Normaliser les pays pour éviter les doublons tout en gardant les codes pour les drapeaux
        if (country.toLowerCase() === 'france') {
          countries.add('FR') // Garder le code pour le drapeau
        } else if (country.toLowerCase() === 'fr') {
          countries.add('FR')
        } else {
          countries.add(country)
        }
      }
      if (item.industry && item.industry.trim()) industries.add(item.industry.trim())
      if (item.device && item.device.trim() && item.device.trim().toLowerCase() !== 'all') {
        devices.add(item.device.trim())
      }
      if (item.analysis_month && item.analysis_month.trim())
        analysisMonths.add(item.analysis_month.trim())
    })

    // Debug: afficher les pays uniques pour identifier les doublons
    console.log('Pays uniques:', Array.from(countries))
    console.log('Devices uniques:', Array.from(devices))

    filterOptions.value = {
      countries: Array.from(countries).sort(),
      industries: Array.from(industries).sort(),
      devices: Array.from(devices).sort(),
      analysis_months: Array.from(analysisMonths).sort(),
    }
  }

  // Filtrer les données
  const getFilteredData = (
    filters: Partial<{
      country: string
      industry: string
      device: string
      analysis_month: string
    }>,
  ) => {
    return computed(() => {
      let filtered = data.value

      console.log('getFilteredData - Filtres reçus:', filters)
      console.log(
        'getFilteredData - Nombre de filtres actifs:',
        Object.keys(filters).filter((key) => filters[key as keyof typeof filters] !== undefined)
          .length,
      )
      console.log('getFilteredData - Données avant filtrage:', data.value.length, 'éléments')

      if (filters.country) {
        filtered = filtered.filter((item) => item.country === filters.country)
        console.log('getFilteredData - Après filtrage pays:', filtered.length, 'éléments')
      }
      if (filters.industry) {
        filtered = filtered.filter((item) => item.industry === filters.industry)
        console.log('getFilteredData - Après filtrage industrie:', filtered.length, 'éléments')
      }
      if (filters.device) {
        filtered = filtered.filter((item) => item.device === filters.device)
        console.log('getFilteredData - Après filtrage device:', filtered.length, 'éléments')
      }
      if (filters.analysis_month) {
        filtered = filtered.filter((item) => item.analysis_month === filters.analysis_month)
        console.log('getFilteredData - Après filtrage mois:', filtered.length, 'éléments')
      }

      console.log('getFilteredData - Résultat final:', filtered.length, 'éléments')
      return filtered
    })
  }

  // Insérer de nouvelles données
  const insertData = async (newData: Omit<TrafficData, 'id' | 'calculation_timestamp'>[]) => {
    try {
      loading.value = true
      error.value = null

      const { data: result, error: insertError } = await supabase
        .from('traffic')
        .insert(newData)
        .select()

      if (insertError) throw insertError

      // Rafraîchir les données
      await fetchAllData()

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de l'insertion des données"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour des données existantes
  const updateData = async (id: number, updates: Partial<TrafficData>) => {
    try {
      loading.value = true
      error.value = null

      const { data: result, error: updateError } = await supabase
        .from('traffic')
        .update(updates)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      // Rafraîchir les données
      await fetchAllData()

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour des données'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer des données
  const deleteData = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const { error: deleteError } = await supabase.from('traffic').delete().eq('id', id)

      if (deleteError) throw deleteError

      // Rafraîchir les données
      await fetchAllData()

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression des données'
      throw err
    } finally {
      loading.value = false
    }
  }

  const instance = {
    // État
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    filterOptions: computed(() => filterOptions.value),

    // Méthodes
    fetchAllData,
    getFilteredData,
    insertData,
    updateData,
    deleteData,
    updateFilterOptions,
  }

  // Stocker l'instance globale
  globalData = instance

  return instance
}
