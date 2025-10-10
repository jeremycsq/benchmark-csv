<template>
  <div class="mb-12">
    <div class="flex flex-col md:flex-row mt-4">
      <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#ECEDEF]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Overall Conversion</div>
        </div>
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#626B76]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Desktop Conversion</div>
        </div>
        <div class="flex flex-row items-center justify-start gap-4">
          <div class="h-2 w-8 rounded bg-[#32373A]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Mobile Conversion</div>
        </div>
      </div>
      <div
        class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#ECEDEF] flex flex-col justify-between"
      >
        <div class="flex-1 flex w-full">
          <div class="flex-1 flex flex-col items-center justify-between">
            <LineChart
              :data="conversionChartData"
              labelColor="#ECEDEF"
              gridColor="#EEEFF1"
              :yMin="chartYMin"
              :yMax="chartYMax"
              :yTickSuffix="'%'"
              :yStep="chartYStep"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useSupabaseData } from '@/composables/useSupabaseData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

const globalFilters = useGlobalFiltersStore()
const { fetchTableData, getFilteredDataFor } = useSupabaseData()

const isLoading = ref(true)
const labels = ref<string[]>([])
const overallSeries = ref<number[]>([])
const desktopSeries = ref<number[]>([])
const mobileSeries = ref<number[]>([])
const chartYMin = ref(0)
const chartYMax = ref(8)
const chartYStep = ref(1)

const getNum = (row: Record<string, unknown>, keys: string[]): number => {
  for (const k of keys) {
    const v = row[k as keyof typeof row]
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      const n = parseFloat(String(v).replace('%', ''))
      if (!isNaN(n)) return n
    }
  }
  return 0
}

// mapDevice inutile ici

async function loadSeries() {
  isLoading.value = true
  // Charger la table au besoin
  await fetchTableData('conversion')

  const isAll = (v: unknown) =>
    v === undefined || v === null
      ? true
      : String(v).toLowerCase().includes('all') || String(v).toLowerCase().includes('tous')

  const filtersBase = {
    country: isAll(globalFilters.selectedCountry) ? undefined : globalFilters.selectedCountry,
    industry: isAll(globalFilters.selectedIndustry) ? undefined : globalFilters.selectedIndustry,
    analysis_month: undefined as string | undefined, // on prend toute la série temporelle
    device: undefined as string | undefined,
  }

  const allRows = getFilteredDataFor('conversion', filtersBase).value as unknown as Record<
    string,
    unknown
  >[]

  // Trier par mois croissant
  const sorted = [...allRows].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
    const am = String((a['ANALYSIS_MONTH'] as string) || (a['analysis_month'] as string))
    const bm = String((b['ANALYSIS_MONTH'] as string) || (b['analysis_month'] as string))
    return new Date(am).getTime() - new Date(bm).getTime()
  })

  // Construire des labels uniques (mois) triés
  const months = Array.from(
    new Set(
      sorted.map((r: Record<string, unknown>) =>
        String((r['ANALYSIS_MONTH'] as string) || (r['analysis_month'] as string) || ''),
      ),
    ),
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  labels.value = months

  const pickMom = (r: Record<string, unknown>) =>
    getNum(r, [
      'CVR_mom_change',
      'CVR_MOM_CHANGE',
      'CONVERSION_RATE_MOM_CHANGE',
      'conversion_rate_mom_change',
    ])

  // Maps mois->valeur par type de device
  const overallMap = new Map<string, number>()
  const desktopMap = new Map<string, number>()
  const mobileMap = new Map<string, number>()

  sorted.forEach((r: Record<string, unknown>) => {
    const m = String((r['ANALYSIS_MONTH'] as string) || (r['analysis_month'] as string) || '')
    const d = String((r['DEVICE_ID'] as string) || (r['device_id'] as string) || '')
    const v = pickMom(r)
    const dl = d.toLowerCase()
    if (dl === 'all_devices' || dl === 'all_device') overallMap.set(m, v)
    else if (d === '1') desktopMap.set(m, v)
    else if (d === '2') mobileMap.set(m, v)
  })

  overallSeries.value = months.map((m) => overallMap.get(m) ?? 0)
  desktopSeries.value = months.map((m) => desktopMap.get(m) ?? 0)
  mobileSeries.value = months.map((m) => mobileMap.get(m) ?? 0)

  // Définir yMin/yMax dynamiquement pour inclure négatifs
  const allVals = [...overallSeries.value, ...desktopSeries.value, ...mobileSeries.value]
  const minV = Math.min(...allVals, 0)
  const maxV = Math.max(...allVals, 0)
  const pad = 0.5
  let ymin = Math.floor((minV - pad) * 10) / 10
  let ymax = Math.ceil((maxV + pad) * 10) / 10
  if (ymin === ymax) {
    ymin -= 1
    ymax += 1
  }
  chartYMin.value = ymin
  chartYMax.value = ymax
  const range = ymax - ymin
  chartYStep.value = range > 0 ? Math.max(0.5, Math.round((range / 8) * 10) / 10) : 1

  isLoading.value = false
}

onMounted(loadSeries)
watch(
  () => [
    globalFilters.selectedCountry,
    globalFilters.selectedIndustry,
    globalFilters.selectedDevice, // on ignore pour la ligne, on force le scope all
    globalFilters.selectedMonth,
  ],
  () => loadSeries(),
)

const conversionChartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Overall Conversion',
      data: overallSeries.value,
      borderColor: '#ECEDEF',
      backgroundColor: '#ECEDEF',
      tension: 0.4,
    },
    {
      label: 'Desktop Conversion',
      data: desktopSeries.value,
      borderColor: '#626B76',
      backgroundColor: '#626B76',
      tension: 0.4,
    },
    {
      label: 'Mobile Conversion',
      data: mobileSeries.value,
      borderColor: '#32373A',
      backgroundColor: '#32373A',
      tension: 0.4,
    },
  ],
}))

// Expose maintenu pour compat
function randomizeCurves() {
  /* noop: remplacé par data réelle */
}

defineExpose({
  randomizeCurves,
})
</script>
