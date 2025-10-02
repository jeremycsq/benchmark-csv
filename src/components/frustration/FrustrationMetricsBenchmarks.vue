<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Colonne texte à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDFE] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Frustration Metrics Benchmarks</div>
      </div>
      <p class="text-sm leading-6 pr-2" :style="{ color: descriptionColor }"></p>
    </div>

    <!-- Carte graphique à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#ECEDFE] px-6 py-16 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MiniBarChart
          :values="sessionsValues"
          :colors="barColors"
          label="Sessions with Frustration"
          :display="formatPercent"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
        <MiniBarChart
          :values="loadTimeValues"
          :colors="barColors"
          label="Load Time Frustration"
          :display="formatPercent"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
        <MiniBarChart
          :values="jsErrorValues"
          :colors="barColors"
          label="JS Error Rate"
          :display="formatPercent"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'
import { getChartColors, getPageTheme } from '@/config/theme'

type Triple = [number, number, number]

const globalFilters = useGlobalFiltersStore()

// Couleurs thème frustration
const theme = getPageTheme('frustration')
const chartTheme = getChartColors('frustration')

// Ordre: [p25, Benchmark, p75]
const barColors: [string, string, string] = [
  chartTheme.tertiary,
  chartTheme.secondary,
  theme.primary,
]
const labelColor = '#97A6BA'
const valueColor = '#000'
const metricLabelColor = '#000'
const descriptionColor = '#6B7280'

const sessionsValues = ref<Triple>([0, 0, 0])
const loadTimeValues = ref<Triple>([0, 0, 0])
const jsErrorValues = ref<Triple>([0, 0, 0])

function formatPercent(v: number): string {
  return `${Number(v).toFixed(1)}%`
}

function mapDevice(label: string): string {
  const l = label.toLowerCase()
  if (l === 'desktop') return 'desktop'
  if (l === 'mobile') return 'mobile'
  if (l === 'tablet') return 'tablet'
  return label
}

async function fetchBenchmarks() {
  console.log('📊 FrustrationMetricsBenchmarks - Récupération des benchmarks...', {
    country: globalFilters.selectedCountry,
    industry: globalFilters.selectedIndustry,
    device: globalFilters.selectedDevice,
    month: globalFilters.selectedMonth,
  })

  // Base query
  let query = supabase
    .from('frustration')
    .select(
      [
        'analysis_month',
        'country',
        'industry',
        'device',
        'frustration_score',
        'frustration_score_p25',
        'frustration_score_p75',
        'load_time_frustration_rate',
        'load_time_frustration_p25',
        'load_time_frustration_p75',
        'js_error_rate',
        'js_error_rate_p25',
        'js_error_rate_p75',
      ].join(', '),
    )

  // Filtres globaux
  if (globalFilters.selectedCountry !== 'All countries') {
    query = query.eq('country', globalFilters.selectedCountry)
  }
  if (globalFilters.selectedIndustry !== 'All industries') {
    query = query.eq('industry', globalFilters.selectedIndustry)
  }
  if (globalFilters.selectedDevice !== 'All devices') {
    query = query.eq('device', mapDevice(globalFilters.selectedDevice))
  } else {
    query = query.eq('device', 'all_device')
  }

  if (globalFilters.selectedMonth !== 'All months') {
    query = query.eq('analysis_month', globalFilters.selectedMonth)
  } else {
    query = query.order('analysis_month', { ascending: false }).limit(1)
  }

  const { data, error } = await query
  if (error) {
    console.error('FrustrationMetricsBenchmarks - Erreur récupération:', error)
    return
  }

  if (!data || data.length === 0) {
    // Valeurs par défaut pour affichage neutre
    sessionsValues.value = [0, 0, 0]
    loadTimeValues.value = [0, 0, 0]
    jsErrorValues.value = [0, 0, 0]
    return
  }

  const row = data[0] as {
    frustration_score?: number
    frustration_score_p25?: number
    frustration_score_p75?: number
    load_time_frustration_rate?: number
    load_time_frustration_p25?: number
    load_time_frustration_p75?: number
    js_error_rate?: number
    js_error_rate_p25?: number
    js_error_rate_p75?: number
  }
  sessionsValues.value = [
    Number(row.frustration_score_p25 || 0),
    Number(row.frustration_score || 0),
    Number(row.frustration_score_p75 || 0),
  ]
  loadTimeValues.value = [
    Number(row.load_time_frustration_p25 || 0),
    Number(row.load_time_frustration_rate || 0),
    Number(row.load_time_frustration_p75 || 0),
  ]
  jsErrorValues.value = [
    Number(row.js_error_rate_p25 || 0),
    Number(row.js_error_rate || 0),
    Number(row.js_error_rate_p75 || 0),
  ]
}

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedMonth,
  ],
  (newValues, oldValues) => {
    console.log('🔄 FrustrationMetricsBenchmarks - Filtres changés:', {
      old: oldValues,
      new: newValues,
    })
    fetchBenchmarks()
  },
  { immediate: true },
)

onMounted(() => fetchBenchmarks())
</script>

<style scoped></style>
