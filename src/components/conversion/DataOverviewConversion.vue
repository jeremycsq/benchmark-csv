<template>
  <section class="bg-white relative z-50">
    <div class="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" :style="{ color: pageConfig.titleColor }">
        {{ dynamicTitle }}
      </h2>
      <p class="text-center text-gray-800 mb-8">
        Conversion benchmarks across markets, industries, devices, and audiences.
      </p>
      <div class="flex justify-center items-start gap-8 mb-8">
        <!-- Labels verticaux -->
        <div class="flex flex-col gap-8 items-center justify-center">
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-3xl text-[#000000] rotate-[-90deg]">YoY</span>
          </div>
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-3xl text-[#000000] rotate-[-90deg]">MoM</span>
          </div>
        </div>

        <!-- Blocs metrics -->
        <div class="flex flex-col gap-8">
          <!-- Ligne YoY -->
          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="(metric, index) in pageConfig.yoyMetrics"
              :key="`yoy-${index}`"
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#41474D]/40 hover:shadow-sm transition cursor-pointer"
              :class="{ 'rounded-2xl': metric.isRounded }"
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
              <!-- Tooltip au hover -->
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
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
                    d="M7 17l9.2-9.2M17 17V7H7"
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
                    d="M17 7l-9.2 9.2M7 7v10h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Ligne MoM -->
          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="(metric, index) in pageConfig.momMetrics"
              :key="`mom-${index}`"
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#41474D]/40 hover:shadow-sm transition cursor-pointer"
              :class="{ 'rounded-2xl': metric.isRounded }"
            >
              <div
                v-if="!isLoading"
                class="text-2xl font-newedge mb-2"
                :class="getColorClass(getNumericValue('mom', index))"
              >
                {{ getMetricValue('mom', index) }}
              </div>
              <div v-else class="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <!-- Tooltip au hover -->
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
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
                    d="M7 17l9.2-9.2M17 17V7H7"
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
                    d="M17 7l-9.2 9.2M7 7v10h10"
                  />
                </svg>
              </div>
            </div>
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

const globalFilters = useGlobalFiltersStore()
const { fetchTableData, getFilteredDataFor } = useSupabaseData()

type Row = Record<string, unknown>

const pageConfig = computed(() => pageConfigs.conversion)

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value
  if (!month || month === 'All Months') {
    return 'How is your conversion rate looking this month?'
  } else {
    return `How has Conversion evolved in ${month}?`
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
  const cached = (useSupabaseData().getTableData('conversion').value as unknown as Row[]) || []
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
    rows = (useSupabaseData().getTableData('conversion').value as unknown as Row[]) || []
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
