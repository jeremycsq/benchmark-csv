<template>
  <div class="mb-8 reveal-up">
    <div class="flex flex-col md:flex-row mt-4">
      <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#C1E3B1]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Pageviews Per Session</div>
        </div>
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Time Per Session</div>
        </div>
        <div class="flex flex-row items-center justify-start gap-4">
          <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Scroll Rate</div>
        </div>
      </div>
      <div
        class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-between"
      >
        <div class="flex-1 flex w-full">
          <div class="flex-1 flex flex-col items-center justify-between">
            <LineChart
              :data="engagementChartData"
              :yMin="yScale.min"
              :yMax="yScale.max"
              :yStep="yScale.step"
              labelColor="#ADD2A5"
              gridColor="#E9F5E4"
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

const globalFilters = useGlobalFiltersStore()

const rows = ref<any[]>([])

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

  try {
    let q = supabase
      .from('engagement')
      .select('ANALYSIS_MONTH,PAGEVIEWS_MOM_CHANGE,TIME_SPENT_MOM_CHANGE,SCROLL_RATE_MOM_CHANGE')
      .order('ANALYSIS_MONTH', { ascending: true })

    if (country) q = q.eq('COUNTRY_CODE', country)
    if (device) q = q.eq('DEVICE_ID', device)
    if (industry) q = q.eq('INDUSTRY', industry)

    const { data, error } = await q
    if (error) throw error
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

const engagementChartData = computed(() => {
  const labels = rows.value.map((r) => r.ANALYSIS_MONTH)
  const series1 = rows.value.map((r) => Number(r.PAGEVIEWS_MOM_CHANGE ?? 0))
  const series2 = rows.value.map((r) => Number(r.TIME_SPENT_MOM_CHANGE ?? 0))
  const series3 = rows.value.map((r) => Number(r.SCROLL_RATE_MOM_CHANGE ?? 0))

  const allValues = [...series1, ...series2, ...series3]
  const maxVal = allValues.length ? Math.max(...allValues) : 0
  const minVal = allValues.length ? Math.min(...allValues) : 0

  return {
    labels,
    datasets: [
      {
        label: 'Pageviews per Session',
        data: series1,
        borderColor: '#C1E3B1',
        backgroundColor: '#C1E3B1',
        tension: 0.4,
      },
      {
        label: 'Time per Session',
        data: series2,
        borderColor: '#2E614F',
        backgroundColor: '#2E614F',
        tension: 0.4,
      },
      {
        label: 'Scroll Rate',
        data: series3,
        borderColor: '#6D9A7A',
        backgroundColor: '#6D9A7A',
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
