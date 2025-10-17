<template>
  <div class="mb-8 reveal-up">
    <div class="flex flex-col md:flex-row mt-4">
      <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
        <div
          class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
          :style="{ borderBottom: `1px solid ${theme.accent}` }"
        >
          <div class="h-2 w-8 rounded" :style="{ backgroundColor: chartColors.primary }"></div>
          <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
            Pageviews Per Session
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
          :style="{ borderBottom: `1px solid ${theme.accent}` }"
        >
          <div class="h-2 w-8 rounded" :style="{ backgroundColor: chartColors.secondary }"></div>
          <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
            Time Per Session
          </div>
        </div>
        <div class="flex flex-row items-center justify-start gap-4">
          <div class="h-2 w-8 rounded" :style="{ backgroundColor: chartColors.tertiary }"></div>
          <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
            Scroll Rate
          </div>
        </div>
      </div>
      <div
        class="w-full bg-white rounded-xl p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border flex flex-col justify-between"
        :style="{ border: `1px solid ${theme.accent}` }"
      >
        <div class="flex-1 flex w-full">
          <div class="flex-1 flex flex-col items-center justify-between">
            <LineChart
              :data="engagementChartData"
              :yMin="yScale.min"
              :yMax="yScale.max"
              :yStep="yScale.step"
              :labelColor="'#000'"
              :gridColor="chartColors.background"
              :xTickFormatter="formatDate"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { LineChart } from '@/components/charts'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'
import { getPageTheme, getChartColors } from '@/config/theme'

const globalFilters = useGlobalFiltersStore()
const theme = computed(() => getPageTheme('engagement'))
const chartColors = computed(() => getChartColors('engagement'))

const rows = ref<
  Array<{
    ANALYSIS_MONTH: string
    PAGEVIEWS_MOM_CHANGE: number | null
    TIME_SPENT_MOM_CHANGE: number | null
    SCROLL_RATE_MOM_CHANGE: number | null
  }>
>([])

const norm = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim())
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

async function fetchTimeseries() {
  const isAllCountries = norm(globalFilters.selectedCountry).toLowerCase().startsWith('all ')
  const country = isAllCountries ? 'Global' : mapCountryToCode(globalFilters.selectedCountry)
  const isAllIndustries = norm(globalFilters.selectedIndustry).toLowerCase().startsWith('all ')
  const industry = isAllIndustries ? '' : globalFilters.selectedIndustry
  const isAllDevices = norm(globalFilters.selectedDevice).toLowerCase().startsWith('all ')
  const device = isAllDevices ? 'all_devices' : mapDevice(globalFilters.selectedDevice)
  const isAllMonths = norm(globalFilters.selectedMonth).toLowerCase().startsWith('all ')
  const selectedMonth = isAllMonths ? '' : globalFilters.selectedMonth

  try {
    let q = supabase
      .from('engagement')
      .select('ANALYSIS_MONTH,PAGEVIEWS_MOM_CHANGE,TIME_SPENT_MOM_CHANGE,SCROLL_RATE_MOM_CHANGE')
      .order('ANALYSIS_MONTH', { ascending: true })

    if (country) q = q.eq('COUNTRY_CODE', country)
    if (device) q = q.eq('DEVICE_ID', device)
    if (industry) q = q.eq('INDUSTRY', industry)
    if (selectedMonth) q = q.eq('ANALYSIS_MONTH', selectedMonth)

    const { data, error } = await q
    if (error) throw error
    console.log('📊 Engagement timeseries data:', data)
    rows.value = data || []
  } catch (e) {
    console.error('fetchTimeseries engagement error:', e)
    rows.value = []
  }
}

onMounted(fetchTimeseries)
watch(
  () => [
    globalFilters.selectedCountry,
    globalFilters.selectedIndustry,
    globalFilters.selectedDevice,
    globalFilters.selectedMonth, // non filtré ici (on trace l\'overtime)
  ],
  fetchTimeseries,
)

// Fonction pour formater les dates
const formatDate = (dateString: string, index: number, allLabels: string[]): string => {
  if (!dateString || typeof dateString !== 'string') return ''

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    // Vérifier si toutes les dates sont identiques
    const uniqueDates = new Set(allLabels)
    if (uniqueDates.size === 1) {
      // Si une seule date unique, afficher avec le jour : "01 juil. 2025"
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } else {
      // Si plusieurs dates différentes, afficher format court : "juil. 2025"
      return date.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      })
    }
  } catch {
    return dateString
  }
}

const engagementChartData = computed(() => {
  const labels = rows.value.map((r) => r.ANALYSIS_MONTH)
  const series1 = rows.value.map((r) => Number(r.PAGEVIEWS_MOM_CHANGE ?? 0))
  const series2 = rows.value.map((r) => Number(r.TIME_SPENT_MOM_CHANGE ?? 0))
  const series3 = rows.value.map((r) => Number(r.SCROLL_RATE_MOM_CHANGE ?? 0))

  console.log('📅 Labels pour le graphique:', labels)
  console.log('🔍 Dates uniques:', [...new Set(labels)])
  console.log('📊 Nombre de lignes:', rows.value.length)

  // Si toutes les dates sont identiques, ne garder qu'une seule entrée
  const uniqueDates = new Set(labels)
  let finalLabels = labels
  let finalSeries1 = series1
  let finalSeries2 = series2
  let finalSeries3 = series3

  if (uniqueDates.size === 1 && rows.value.length > 1) {
    // Calculer la moyenne des valeurs pour cette date unique
    const avgSeries1 = series1.reduce((sum, val) => sum + val, 0) / series1.length
    const avgSeries2 = series2.reduce((sum, val) => sum + val, 0) / series2.length
    const avgSeries3 = series3.reduce((sum, val) => sum + val, 0) / series3.length

    finalLabels = [labels[0]]
    finalSeries1 = [avgSeries1]
    finalSeries2 = [avgSeries2]
    finalSeries3 = [avgSeries3]

    console.log('🔄 Données groupées par date unique:', {
      date: finalLabels[0],
      pageviews: avgSeries1,
      timeSpent: avgSeries2,
      scrollRate: avgSeries3,
    })
  }

  return {
    labels: finalLabels,
    datasets: [
      {
        label: 'Pageviews per Session',
        data: finalSeries1,
        borderColor: chartColors.value.primary,
        backgroundColor: chartColors.value.primary,
        tension: 0.4,
      },
      {
        label: 'Time per Session',
        data: finalSeries2,
        borderColor: chartColors.value.secondary,
        backgroundColor: chartColors.value.secondary,
        tension: 0.4,
      },
      {
        label: 'Scroll Rate',
        data: finalSeries3,
        borderColor: chartColors.value.tertiary,
        backgroundColor: chartColors.value.tertiary,
        tension: 0.4,
      },
    ],
  }
})

// Calcul des bornes pour LineChart (composant générique)
const yScale = computed(() => {
  const values = rows.value.flatMap((r) => [
    Number(r.PAGEVIEWS_MOM_CHANGE ?? 0),
    Number(r.TIME_SPENT_MOM_CHANGE ?? 0),
    Number(r.SCROLL_RATE_MOM_CHANGE ?? 0),
  ])
  if (values.length === 0) return { min: -1, max: 1, step: 0.5 }

  const maxVal = Math.max(...values)
  const minVal = Math.min(...values)
  const padding = Math.max(0.1, Math.abs(maxVal - minVal) * 0.1)
  const upper = Math.max(maxVal + padding, 0.5)
  const lower = Math.min(minVal - padding, -0.5)
  const max = Math.ceil(upper * 2) / 2
  const min = Math.floor(lower * 2) / 2

  // step: 5 graduations environ
  const range = Math.max(0.5, max - min)
  const roughStep = range / 5
  const step = Math.max(0.1, Math.round(roughStep * 2) / 2)
  return { min, max, step }
})

// Expose (rétro-compat) pour déclencher un refresh depuis le parent si besoin
defineExpose({
  updateRadialData: fetchTimeseries,
  randomizeCurves: fetchTimeseries,
})
</script>
