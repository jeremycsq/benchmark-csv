<template>
  <section class="bg-white relative z-50">
    <div class="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" :style="{ color: theme.primary }">
        {{ dynamicTitle }}
      </h2>
      <p class="text-center text-gray-800 mb-8">
        Select filters to view traffic benchmarks for specific markets, industries, devices, and
        audiences.
      </p>
      <div class="flex justify-start items-start gap-8 mb-8 w-full">
        <!-- Labels verticaux -->
        <div class="flex flex-col gap-8 items-center justify-center">
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-xs text-[#000000] text-center"
              >year <br />on <br />year</span
            >
          </div>
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-xs text-[#000000] text-center"
              >month on <br />month</span
            >
          </div>
        </div>

        <!-- Blocs metrics -->
        <div class="flex flex-col gap-8 w-full" :style="{ '--border-color': theme.accent }">
          <!-- Ligne YoY -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.yoyMetrics" :key="`yoy-${index}`">
              <div
                class="group border p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.yoyMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
                :style="{ borderColor: theme.accent }"
              >
                <div
                  v-if="!isLoading"
                  class="text-2xl font-newedge mb-2"
                  :class="getColorClass(getNumericValue('yoy', index))"
                >
                  {{ getMetricValue('yoy', index) }}
                </div>
                <div v-else class="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
                <!-- Icône de flèche -->
                <div v-if="!isLoading" class="absolute top-6 right-6">
                  <svg
                    v-if="getNumericValue('yoy', index) > 0"
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                    />
                  </svg>
                  <svg
                    v-else-if="getNumericValue('yoy', index) < 0"
                    class="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v14m0 0l-7-7m7 7l7-7"
                    />
                  </svg>
                </div>
                <!-- Tooltip au hover -->
                <div
                  class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
                >
                  {{ metric.description }}
                </div>
              </div>
              <!-- Shape après chaque bloc (sauf le dernier) -->
              <div
                v-if="index < pageConfig.yoyMetrics.length - 1"
                class="relative w-4 h-full flex flex-col justify-center z-20 ml-[-1px] mr-[-1px]"
              >
                <!-- Shape du haut (U inversé) -->
                <div
                  class="w-4 h-8 border-l border-r border-b rounded-b-full bg-white z-20"
                  :style="{ borderColor: theme.accent }"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t rounded-t-full bg-white z-20"
                  :style="{ borderColor: theme.accent }"
                ></div>
              </div>
            </template>
          </div>

          <!-- Ligne MoM -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.momMetrics" :key="`mom-${index}`">
              <div
                class="group border p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.momMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
                :style="{ borderColor: theme.accent }"
              >
                <div
                  v-if="!isLoading"
                  class="text-2xl font-newedge mb-2"
                  :class="getColorClass(getNumericValue('mom', index))"
                >
                  {{ getMetricValue('mom', index) }}
                </div>
                <div v-else class="h-6 w-16 bg-gray-200 animate-pulse mb-2"></div>
                <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
                <!-- Icône de flèche -->
                <div v-if="!isLoading" class="absolute top-6 right-6">
                  <svg
                    v-if="getNumericValue('mom', index) > 0"
                    class="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                    />
                  </svg>
                  <svg
                    v-else-if="getNumericValue('mom', index) < 0"
                    class="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v14m0 0l-7-7m7 7l7-7"
                    />
                  </svg>
                </div>
                <!-- Tooltip au hover -->
                <div
                  class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
                >
                  {{ metric.description }}
                </div>
              </div>
              <!-- Shape après chaque bloc (sauf le dernier) -->
              <div
                v-if="index < pageConfig.momMetrics.length - 1"
                class="relative w-4 h-full flex flex-col justify-center z-20 ml-[-1px] mr-[-1px]"
              >
                <!-- Shape du haut (U inversé) -->
                <div
                  class="w-4 h-8 border-l border-r border-b rounded-b-full bg-white z-20"
                  :style="{ borderColor: theme.accent }"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t rounded-t-full bg-white z-20"
                  :style="{ borderColor: theme.accent }"
                ></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { pageConfigs } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useSupabaseData } from '@/composables/useSupabaseData'
import { getPageTheme } from '@/config/theme'

const globalFilters = useGlobalFiltersStore()
const { fetchTableData, getFilteredDataFor } = useSupabaseData()

type Row = Record<string, unknown>

const pageConfig = computed(() => pageConfigs.conversion)
const theme = computed(() => getPageTheme('conversion'))

const selectedMonth = computed(() => globalFilters.selectedMonth)

const formatMonthLabel = (value: string): string => {
  if (!value) return ''
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (isoMatch) {
    const d = new Date(value)
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    }
  }
  return value
}

const dynamicTitle = computed(() => {
  const month = selectedMonth.value
  if (!month || month.toLowerCase() === 'all months') {
    return 'Conversion performance overview'
  } else {
    return `Conversion performance overview in ${formatMonthLabel(month)}`
  }
})

// Valeurs réelles à afficher (yoy/mom) dans l'ordre:
// [Conversion rate, Cart Abandonment rate, Average Order Value, Revenue Per Session]
const realValues = ref<{ yoy: number[]; mom: number[] }>({ yoy: [0, 0, 0, 0], mom: [0, 0, 0, 0] })
const isLoading = ref(true)

const toNum = (v: unknown): number => {
  if (v === null || v === undefined) return 0
  const s = String(v).replace('%', '').replace(',', '.').trim()
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

const loadConversionMetrics = async () => {
  // Charger la table conversion en tirant parti du cache si déjà présent
  isLoading.value = true
  const tableData = useSupabaseData().getTableData('conversion').value
  const cached = (tableData?.data as unknown as Row[]) || []
  if (!cached || cached.length === 0) {
    await fetchTableData('conversion')
    await nextTick()
  }

  const isAll = (v: unknown) =>
    v === undefined || v === null
      ? true
      : String(v).toLowerCase().includes('all') || String(v).toLowerCase().includes('tous')

  const monthFilter = isAll(globalFilters.selectedMonth) ? undefined : globalFilters.selectedMonth
  const countryFilter = isAll(globalFilters.selectedCountry)
    ? undefined
    : globalFilters.selectedCountry
  const industryFilter = isAll(globalFilters.selectedIndustry)
    ? undefined
    : globalFilters.selectedIndustry
  const deviceFilter = isAll(globalFilters.selectedDevice)
    ? undefined
    : globalFilters.selectedDevice

  const filters = {
    country: countryFilter,
    industry: industryFilter,
    device: deviceFilter,
    analysis_month: monthFilter,
  }

  let rows = getFilteredDataFor('conversion', filters).value as unknown as Row[]
  // Fallback: si filtre vide à ce moment précis, prendre toutes les lignes puis trier
  if (!rows || rows.length === 0) {
    const tableData = useSupabaseData().getTableData('conversion').value
    rows = (tableData?.data as unknown as Row[]) || []
  }
  if (!rows || rows.length === 0) {
    realValues.value = { yoy: [0, 0, 0, 0], mom: [0, 0, 0, 0] }
    isLoading.value = false
    return
  }

  // Choisir la ligne la plus récente par ANALYSIS_MONTH
  const normDate = (d: unknown) => new Date(String(d))
  const latest = [...rows]
    .sort((a: Row, b: Row) => {
      const am = (a['ANALYSIS_MONTH'] ?? a['analysis_month']) as unknown
      const bm = (b['ANALYSIS_MONTH'] ?? b['analysis_month']) as unknown
      return normDate(am).getTime() - normDate(bm).getTime()
    })
    .pop() as Row

  const get = (k: string) => latest[k]
  const yoy = [
    toNum(
      get('CVR_yoy_change') ??
        get('CVR_YOY_CHANGE') ??
        get('CONVERSION_RATE_YOY_CHANGE') ??
        get('conversion_rate_yoy_change'),
    ),
    toNum(
      get('Cart_Abandonment_rate_yoy_change') ??
        get('CART_ABANDONMENT_RATE_YOY_CHANGE') ??
        get('cart_abandonment_rate_yoy_change') ??
        0,
    ),
    toNum(
      get('AOV_yoy_change') ??
        get('AOV_YOY_CHANGE') ??
        get('AVERAGE_ORDER_VALUE_YOY_CHANGE') ??
        get('average_order_value_yoy_change'),
    ),
    toNum(get('RPV_yoy_change') ?? get('RPV_YOY_CHANGE') ?? get('rpv_yoy_change') ?? 0),
  ]

  const mom = [
    toNum(
      get('CVR_mom_change') ??
        get('CVR_MOM_CHANGE') ??
        get('CONVERSION_RATE_MOM_CHANGE') ??
        get('conversion_rate_mom_change'),
    ),
    toNum(
      get('Cart_Abandonment_rate_mom_change') ??
        get('CART_ABANDONMENT_RATE_MOM_CHANGE') ??
        get('cart_abandonment_rate_mom_change') ??
        0,
    ),
    toNum(
      get('AOV_mom_change') ??
        get('AOV_MOM_CHANGE') ??
        get('AVERAGE_ORDER_VALUE_MOM_CHANGE') ??
        get('average_order_value_mom_change'),
    ),
    toNum(get('RPV_mom_change') ?? get('RPV_MOM_CHANGE') ?? get('rpv_mom_change') ?? 0),
  ]

  realValues.value = { yoy, mom }
  isLoading.value = false
}

onMounted(loadConversionMetrics)
watch(
  () => [
    globalFilters.selectedCountry,
    globalFilters.selectedIndustry,
    globalFilters.selectedDevice,
    globalFilters.selectedMonth,
  ],
  () => loadConversionMetrics(),
)

const formatValue = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

const getMetricValue = (period: 'yoy' | 'mom', index: number): string => {
  const v = period === 'yoy' ? realValues.value.yoy[index] : realValues.value.mom[index]
  return formatValue(v)
}

const getNumericValue = (period: 'yoy' | 'mom', index: number): number => {
  return period === 'yoy' ? realValues.value.yoy[index] : realValues.value.mom[index]
}

const getColorClass = (value: number): string => {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-600'
}
</script>

<style scoped>
.border-r-gradient {
  position: relative;
  border-right: none;
}

.border-r-gradient::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    var(--border-color) 0%,
    var(--border-color) 20%,
    white 21%,
    white 79%,
    var(--border-color) 80%,
    var(--border-color) 100%
  );
}

.border-l-gradient {
  position: relative;
  border-left: none;
}

.border-l-gradient::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    var(--border-color) 0%,
    var(--border-color) 20%,
    white 21%,
    white 79%,
    var(--border-color) 80%,
    var(--border-color) 100%
  );
}
</style>
