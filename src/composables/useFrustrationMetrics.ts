import { computed } from 'vue'
import { useGlobalFiltersStore } from '../stores/globalFilters'
import { supabase } from '../lib/supabase'

export function useFrustrationMetrics() {
  const globalFilters = useGlobalFiltersStore()
  // Requête directe Supabase avec fallbacks pour garantir de la vraie data

  const mapDevice = (label: string): string => {
    const l = label.toLowerCase()
    if (l === 'desktop') return 'desktop'
    if (l === 'mobile') return 'mobile'
    if (l === 'tablet') return 'tablet'
    return label
  }

  const fetchRow = async () => {
    const norm = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim())
    const isAllCountries = norm(globalFilters.selectedCountry).toLowerCase().startsWith('all ')
    const country = isAllCountries ? 'Global' : globalFilters.selectedCountry
    const isAllIndustries = norm(globalFilters.selectedIndustry).toLowerCase().startsWith('all ')
    const industry = isAllIndustries ? '' : globalFilters.selectedIndustry
    const isAllDevices = norm(globalFilters.selectedDevice).toLowerCase().startsWith('all ')
    const device = isAllDevices ? 'all_device' : mapDevice(globalFilters.selectedDevice)
    const isAllMonths = norm(globalFilters.selectedMonth).toLowerCase().startsWith('all ')
    const month = isAllMonths ? '' : globalFilters.selectedMonth

    try {
      let q = supabase
        .from('frustration')
        .select('*')
        .order('analysis_month', { ascending: false })
        .limit(1)
      if (country) q = q.eq('country', country)
      if (device) q = q.eq('device', device)
      if (industry) q = q.eq('industry', industry)
      if (month) q = q.eq('analysis_month', month)
      let { data, error } = await q
      if (error) throw error
      if (data && data.length > 0)
        return data[0]

        // Fallback 1: country + device uniquement
      ;({ data, error } = await supabase
        .from('frustration')
        .select('*')
        .eq('country', country || 'Global')
        .eq('device', device || 'all_device')
        .order('analysis_month', { ascending: false })
        .limit(1))
      if (error) throw error
      if (data && data.length > 0)
        return data[0]

        // Fallback 2: Global + all_device
      ;({ data, error } = await supabase
        .from('frustration')
        .select('*')
        .eq('country', 'Global')
        .eq('device', 'all_device')
        .order('analysis_month', { ascending: false })
        .limit(1))
      if (error) throw error
      return data && data.length > 0 ? data[0] : null
    } catch (e) {

      return null
    }
  }

  const metrics = computed(() => ({
    // Valeurs par défaut; getMetrics fournit la vraie data
    frustrationScore: { yoy: 0, mom: 0, value: 0 },
    loadTimeFrustration: { yoy: 0, mom: 0, value: 0 },
    jsErrorRate: { yoy: 0, mom: 0, value: 0 },
    bounceRate: { yoy: 0, mom: 0, value: 0 },
  }))

  const getMetrics = async () => {
    const row: any = await fetchRow()
    if (!row) {
      return {
        frustrationScore: { yoy: 0, mom: 0, value: 0 },
        loadTimeFrustration: { yoy: 0, mom: 0, value: 0 },
        jsErrorRate: { yoy: 0, mom: 0, value: 0 },
        bounceRate: { yoy: 0, mom: 0, value: 0 },
      }
    }
    return {
      frustrationScore: {
        value: Number(row.frustration_score ?? 0),
        yoy: Number(row.frustration_score_yoy_change ?? 0),
        mom: Number(row.frustration_score_mom_change ?? 0),
      },
      loadTimeFrustration: {
        value: Number(row.load_time_frustration_rate ?? 0),
        yoy: Number(row.load_time_frustration_yoy_change ?? 0),
        mom: Number(row.load_time_frustration_mom_change ?? 0),
      },
      jsErrorRate: {
        value: Number(row.js_error_rate ?? 0),
        yoy: Number(row.js_error_rate_yoy_change ?? 0),
        mom: Number(row.js_error_rate_mom_change ?? 0),
      },
      bounceRate: {
        value: Number(row.bounce_rate ?? 0),
        yoy: Number(row.bounce_rate_yoy_change ?? 0),
        mom: Number(row.bounce_rate_mom_change ?? 0),
      },
    }
  }

  const yoyChanges = computed(() => ({
    frustrationScore: Math.round(metrics.value.frustrationScore.yoy * 10) / 10,
    loadTimeFrustration: metrics.value.loadTimeFrustration.yoy,
    jsErrorRate: Math.round(metrics.value.jsErrorRate.yoy * 10) / 10,
    bounceRate: Math.round(metrics.value.bounceRate.yoy * 10) / 10,
  }))

  const momChanges = computed(() => ({
    frustrationScore: Math.round(metrics.value.frustrationScore.mom * 10) / 10,
    loadTimeFrustration: metrics.value.loadTimeFrustration.mom,
    jsErrorRate: Math.round(metrics.value.jsErrorRate.mom * 10) / 10,
    bounceRate: Math.round(metrics.value.bounceRate.mom * 10) / 10,
  }))

  return { metrics, yoyChanges, momChanges, getMetrics }
}
