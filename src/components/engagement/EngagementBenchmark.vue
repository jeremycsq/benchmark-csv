<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up mb-4">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${theme.accent}` }"
      >
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.primary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
          Pageviews Per Session
        </div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${theme.accent}` }"
      >
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.secondary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">
          Time Per Session
        </div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="h-2 w-8 rounded" :style="{ backgroundColor: theme.tertiary }"></div>
        <div class="font-newedge pt-1 font-medium" :style="{ color: theme.text }">Scroll Rate</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border flex flex-col gap-10 justify-center pt-16 pb-12"
      :style="{ border: `1px solid ${theme.accent}` }"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          v-for="(item, idx) in barData"
          :key="'engagement-bar-' + String(idx)"
          :values="item.values"
          :colors="labelColors"
          :label="item.label"
          :display="item.display"
          :labelColor="theme.text"
          :valueColor="theme.text"
          :metricLabelColor="theme.text"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'
import { getPageTheme, getChartColors } from '@/config/theme'

const globalFilters = useGlobalFiltersStore()
const theme = computed(() => getPageTheme('engagement'))
const chartColors = computed(() => getChartColors('engagement'))

type Triple = [number, number, number]
type BarItem = { label: string; values: Triple; display: (v: number) => string }

const labelColors = computed<[string, string, string]>(() => [
  chartColors.value.primary,
  chartColors.value.secondary,
  chartColors.value.tertiary,
])
const barData = ref<BarItem[]>([
  {
    label: 'Pageviews per Session',
    values: [0, 0, 0] as Triple,
    display: (v: number) => v.toFixed(2),
  },
  {
    label: 'Time per Session',
    values: [0, 0, 0] as Triple,
    display: (val: number) => {
      const total = Math.round(val)
      const minPart = Math.floor(total / 60)
      const secPart = total % 60
      return `${minPart}:${secPart.toString().padStart(2, '0')}`
    },
  },
  { label: 'Scroll Rate', values: [0, 0, 0] as Triple, display: (v: number) => v.toFixed(1) + '%' },
])

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

async function fetchBenchmark() {
  const isAllCountries = norm(globalFilters.selectedCountry).toLowerCase().startsWith('all ')
  const country = isAllCountries ? 'Global' : mapCountryToCode(globalFilters.selectedCountry)
  const isAllIndustries = norm(globalFilters.selectedIndustry).toLowerCase().startsWith('all ')
  const industry = isAllIndustries ? '' : globalFilters.selectedIndustry
  const isAllDevices = norm(globalFilters.selectedDevice).toLowerCase().startsWith('all ')
  const device = isAllDevices ? 'all_devices' : mapDevice(globalFilters.selectedDevice)

  try {
    let q = supabase
      .from('engagement')
      .select(
        'AVG_PAGEVIEWS_PER_SESSION,PAGEVIEWS_P25,PAGEVIEWS_P75,AVG_TIME_SPENT_PER_SESSION,TIME_SPENT_P25,TIME_SPENT_P75,AVG_SCROLL_RATE,SCROLL_RATE_P25,SCROLL_RATE_P75',
      )
      .order('ANALYSIS_MONTH', { ascending: false })
      .limit(1)

    if (country) q = q.eq('COUNTRY_CODE', country)
    if (device) q = q.eq('DEVICE_ID', device)
    if (industry) q = q.eq('INDUSTRY', industry)

    const { data, error } = await q
    if (error) throw error

    const row = data && data.length > 0 ? data[0] : null
    if (!row) return

    // Chart 1: Pageviews
    barData.value[0] = {
      label: 'Pageviews per Session',
      values: [
        Number(row.PAGEVIEWS_P25 ?? 0),
        Number(row.AVG_PAGEVIEWS_PER_SESSION ?? 0),
        Number(row.PAGEVIEWS_P75 ?? 0),
      ] as Triple,
      display: (v: number) => v.toFixed(2),
    }

    // Chart 2: Time per Session (secondes)
    barData.value[1] = {
      label: 'Time per Session',
      values: [
        Number(row.TIME_SPENT_P25 ?? 0),
        Number(row.AVG_TIME_SPENT_PER_SESSION ?? 0),
        Number(row.TIME_SPENT_P75 ?? 0),
      ] as Triple,
      display: (val: number) => {
        const total = Math.round(val)
        const minPart = Math.floor(total / 60)
        const secPart = total % 60
        return `${minPart}:${secPart.toString().padStart(2, '0')}`
      },
    }

    // Chart 3: Scroll rate
    barData.value[2] = {
      label: 'Scroll Rate',
      values: [
        Number(row.SCROLL_RATE_P25 ?? 0),
        Number(row.AVG_SCROLL_RATE ?? 0),
        Number(row.SCROLL_RATE_P75 ?? 0),
      ] as Triple,
      display: (v: number) => v.toFixed(1) + '%',
    }
  } catch (e) {
    console.error('fetchBenchmark engagement error:', e)
  }
}

onMounted(fetchBenchmark)
watch(
  () => [
    globalFilters.selectedCountry,
    globalFilters.selectedIndustry,
    globalFilters.selectedDevice,
    globalFilters.selectedMonth, // on prend la plus récente
  ],
  fetchBenchmark,
)

// Expose pour MAJ manuelle si besoin
defineExpose({
  updateBarData: fetchBenchmark,
  randomizeBarData: fetchBenchmark,
})
</script>
