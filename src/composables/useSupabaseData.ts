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

// Store pour les différentes tables
const tableDataStore = {
  traffic: null as any,
  engagement: null as any,
  frustration: null as any,
  conversion: null as any,
}

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
  const totalRecords = ref(0)
  const filterOptions = ref<FilterOptions>({
    countries: [],
    industries: [],
    devices: [],
    analysis_months: [],
  })

  // Récupérer le nombre total d'enregistrements de toutes les tables
  const fetchTotalRecords = async () => {
    try {
      const tables = ['traffic', 'engagement', 'frustration', 'conversion']
      let total = 0

      for (const table of tables) {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.warn(`Erreur lors du comptage de la table ${table}:`, countError)
        } else {
          total += count || 0
          console.log(`Table ${table}: ${count || 0} enregistrements`)
        }
      }

      totalRecords.value = total
      console.log(`Total de tous les enregistrements: ${total}`)
      return total
    } catch (err) {
      console.error('Erreur lors du calcul du total:', err)
      return 0
    }
  }

  // Récupérer toutes les données
  const fetchAllData = async () => {
    try {
      loading.value = true
      error.value = null

      console.log('useSupabaseData - Tentative de récupération des données...')
      console.log('useSupabaseData - Client Supabase:', supabase)

      // Récupérer les données de traffic
      const { data: result, error: fetchError } = await supabase
        .from('traffic')
        .select('*')
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

      // Récupérer le total de tous les enregistrements
      await fetchTotalRecords()

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

  // Fonction pour récupérer les données spécifiques à une table
  const fetchTableData = async (tableName: string) => {
    console.log(`fetchTableData - Récupération des données pour la table: ${tableName}`)

    loading.value = true
    error.value = null

    try {
      const query = supabase.from(tableName).select('*').limit(1000) // Limit pour éviter les gros datasets

      const { data: result, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Stocker les données spécifiques à cette table
      if (tableDataStore[tableName as keyof typeof tableDataStore] !== null) {
        tableDataStore[tableName as keyof typeof tableDataStore] = {
          data: result || [],
          filterOptions: extractFilterOptions(result || []),
          lastFetch: new Date(),
        }
      }

      // Mettre à jour les données globales si c'est la table traffic (pour compatibilité avec useTrafficMetrics)
      if (tableName === 'traffic') {
        data.value = result || []
        updateFilterOptions() // Utiliser l'ancienne méthode pour mise à jour
      }

      // Mettre à jour les filterOptions globaux avec cette table
      if (result && result.length > 0) {
        updateFilterOptionsFromTable(result)
      }

      console.log(`✅ Données ${tableName} récupérées:`, result?.length || 0, 'enregistrements')
    } catch (err) {
      console.error(`❌ Erreur lors de la récupération des données ${tableName}:`, err)
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  // Fonction pour extraire les options de filtre d'une table spécifique
  const extractFilterOptions = (tableData: any[]) => {
    const countries = new Set<string>()
    const industries = new Set<string>()
    const devices = new Set<string>()
    const analysisMonths = new Set<string>()

    tableData.forEach((item) => {
      if (item.country && item.country.trim()) {
        const country = item.country.trim()
        countries.add(country)
      }
      if (item.industry && item.industry.trim()) {
        industries.add(item.industry.trim())
      }
      if (item.device && item.device.trim()) {
        devices.add(item.device.trim())
      }
      if (item.analysis_month && item.analysis_month.trim()) {
        analysisMonths.add(item.analysis_month.trim())
      }
    })

    return {
      countries: Array.from(countries).sort(),
      industries: Array.from(industries).sort(),
      devices: Array.from(devices).sort(),
      analysis_months: Array.from(analysisMonths).sort(),
    }
  }

  // Fonction pour mettre à jour les filterOptions globaux à partir d'une table
  const updateFilterOptionsFromTable = (tableData: any[]) => {
    console.log('updateFilterOptionsFromTable - Mise à jour des options de filtre')

    const newOptions = extractFilterOptions(tableData)

    filterOptions.value = {
      countries: newOptions.countries,
      industries: newOptions.industries,
      devices: newOptions.devices,
      analysis_months: newOptions.analysis_months,
    }

    console.log('Nouvelles options de filtre:', newOptions)
    console.log('🇺🇸 Pays disponibles:', newOptions.countries)
    console.log('🏭 Industries disponibles:', newOptions.industries)
    console.log('📱 Devices disponibles:', newOptions.devices)
  }

  const instance = {
    // État
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    filterOptions: computed(() => filterOptions.value),
    totalRecords: computed(() => totalRecords.value),

    // Méthodes
    fetchAllData,
    fetchTableData,
    fetchTotalRecords,
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
