import { ref, computed, onMounted, watch } from 'vue'
import { useGlobalFiltersStore } from '../stores/globalFilters'
import { supabase } from '../lib/supabase'

export function useEngagementMetrics() {
  const globalFilters = useGlobalFiltersStore()
  const rowRef = ref<any | null>(null)

  const mapDevice = (label: string): string => {
    const l = label.toLowerCase()
    if (l === 'desktop') return '1'
    if (l === 'mobile') return '2'
    return label
  }

  const mapCountryToCode = (label: string): string => {
    const m: Record<string, string> = {
      Australia: 'AU',
      AU: 'AU',
      Canada: 'CA',
      CA: 'CA',
      Germany: 'DE',
      DE: 'DE',
      France: 'FR',
      FR: 'FR',
      'United Kingdom': 'GB',
      UK: 'GB',
      GB: 'GB',
      Italy: 'IT',
      IT: 'IT',
      Japan: 'JP',
      JP: 'JP',
      'United States': 'US',
      USA: 'US',
      US: 'US',
      Global: 'Global',
    }
    return m[label] || label
  }

  const norm = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim())

  const loadRow = async () => {
    const isAllCountries = norm(globalFilters.selectedCountry).toLowerCase().startsWith('all ')
    const targetCountry = isAllCountries
      ? 'Global'
      : mapCountryToCode(globalFilters.selectedCountry)
    const isAllIndustries = norm(globalFilters.selectedIndustry).toLowerCase().startsWith('all ')
    const targetIndustry = isAllIndustries ? '' : globalFilters.selectedIndustry
    const isAllDevices = norm(globalFilters.selectedDevice).toLowerCase().startsWith('all ')
    const targetDevice = isAllDevices ? 'all_devices' : mapDevice(globalFilters.selectedDevice)
    const isAllMonths = norm(globalFilters.selectedMonth).toLowerCase().startsWith('all ')
    const targetMonth = isAllMonths ? '' : globalFilters.selectedMonth

    try {
      // Requête primaire
      let q = supabase
        .from('engagement')
        .select('*')
        .order('ANALYSIS_MONTH', { ascending: false })
        .limit(1)
      if (targetCountry) q = q.eq('COUNTRY_CODE', targetCountry)
      if (targetDevice) q = q.eq('DEVICE_ID', targetDevice)
      if (targetIndustry) q = q.eq('INDUSTRY', targetIndustry)
      if (targetMonth) q = q.eq('ANALYSIS_MONTH', targetMonth)
      let { data, error } = await q
      if (error) throw error
      if (data && data.length > 0) {
        rowRef.value = data[0]
        return
      }

      // Fallback 1: pays+device uniquement
      ;({ data, error } = await supabase
        .from('engagement')
        .select('*')
        .eq('COUNTRY_CODE', targetCountry || 'Global')
        .eq('DEVICE_ID', targetDevice || 'all_devices')
        .order('ANALYSIS_MONTH', { ascending: false })
        .limit(1))
      if (error) throw error
      if (data && data.length > 0) {
        rowRef.value = data[0]
        return
      }

      // Fallback 2: Global + all_devices
      ;({ data, error } = await supabase
        .from('engagement')
        .select('*')
        .eq('COUNTRY_CODE', 'Global')
        .eq('DEVICE_ID', 'all_devices')
        .order('ANALYSIS_MONTH', { ascending: false })
        .limit(1))
      if (error) throw error
      rowRef.value = data && data.length > 0 ? data[0] : null
    } catch (e) {
      console.error('loadRow engagement error:', e)
      rowRef.value = null
    }
  }

  onMounted(loadRow)
  watch(
    () => [
      globalFilters.selectedCountry,
      globalFilters.selectedIndustry,
      globalFilters.selectedDevice,
      globalFilters.selectedMonth,
    ],
    () => loadRow(),
    { immediate: true },
  )

  // Métriques d'engagement calculées depuis la ligne sélectionnée
  const engagementMetrics = computed(() => {
    if (!rowRef.value) {
      console.log('useEngagementMetrics - Pas de données filtrées', {
        selectedCountry: globalFilters.selectedCountry,
        mappedCountry: mapCountryToCode(globalFilters.selectedCountry),
        selectedDevice: globalFilters.selectedDevice,
        mappedDevice: mapDevice(globalFilters.selectedDevice),
        selectedIndustry: globalFilters.selectedIndustry,
        selectedMonth: globalFilters.selectedMonth,
      })
      return {
        pageviewsPerSession: { yoy: 0, mom: 0, value: 0 },
        newVisitorPageviews: { yoy: 0, mom: 0, value: 0 },
        timePerSession: { yoy: 0, mom: 0, value: 0 },
        scrollRate: { yoy: 0, mom: 0, value: 0 },
      }
    }
    const row = rowRef.value
    console.log('useEngagementMetrics - Ligne sélectionnée:', row)

    const pageviewsPerSession = {
      value: Number(row['AVG_PAGEVIEWS_PER_SESSION'] ?? 0),
      yoy: Number(row['PAGEVIEWS_YOY_CHANGE'] ?? 0),
      mom: Number(row['PAGEVIEWS_MOM_CHANGE'] ?? 0),
    }

    const newVisitorPageviews = {
      value: Number(row['AVG_NEW_VISITOR_PAGEVIEWS'] ?? 0),
      yoy: Number(row['NEW_VISITOR_PAGEVIEWS_YOY_CHANGE'] ?? 0),
      mom: Number(row['NEW_VISITOR_PAGEVIEWS_MOM_CHANGE'] ?? 0),
    }

    const timePerSession = {
      value: Number(row['AVG_TIME_SPENT_PER_SESSION'] ?? 0),
      yoy: Number(row['TIME_SPENT_YOY_CHANGE'] ?? 0),
      mom: Number(row['TIME_SPENT_MOM_CHANGE'] ?? 0),
    }

    const scrollRate = {
      value: Number(row['AVG_SCROLL_RATE'] ?? 0),
      yoy: Number(row['SCROLL_RATE_YOY_CHANGE'] ?? 0),
      mom: Number(row['SCROLL_RATE_MOM_CHANGE'] ?? 0),
    }

    return { pageviewsPerSession, newVisitorPageviews, timePerSession, scrollRate }
  })

  // Valeurs pour YoY et MoM (formatées pour l'affichage)
  const yoyChanges = computed(() => {
    const metrics = engagementMetrics.value
    return {
      pageviewsPerSession: Math.round(metrics.pageviewsPerSession.yoy * 10) / 10,
      newVisitorPageviews: Math.round(metrics.newVisitorPageviews.yoy * 10) / 10,
      timePerSession: Math.round(metrics.timePerSession.yoy * 10) / 10,
      scrollRate: Math.round(metrics.scrollRate.yoy * 10) / 10,
    }
  })

  const momChanges = computed(() => {
    const metrics = engagementMetrics.value
    return {
      pageviewsPerSession: Math.round(metrics.pageviewsPerSession.mom * 10) / 10,
      newVisitorPageviews: Math.round(metrics.newVisitorPageviews.mom * 10) / 10,
      timePerSession: Math.round(metrics.timePerSession.mom * 10) / 10,
      scrollRate: Math.round(metrics.scrollRate.mom * 10) / 10,
    }
  })

  // États de chargement et d'erreur

  return {
    filteredData: computed(() => (rowRef.value ? [rowRef.value] : [])),
    engagementMetrics,
    yoyChanges,
    momChanges,
  }
}
