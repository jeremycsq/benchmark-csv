<template>
  <div class="min-h-screen">
    <!-- Metrics Section avec fond blanc -->
    <DataOverview
      pageType="conversion"
      :conversionStore="conversionStore"
      class="reveal-up reveal-fade"
      :key="$route.path"
    />

    <!-- Section Conversion avec fond bleu très clair -->
    <section class="bg-[#E5F1F6] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12 reveal-up">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#119DBC]">Conversion</h3>
            <span class="text-gray-600 font-normal pt-1"
              >Conversion is not just a click, it's the result of everything that precedes it.</span
            >
          </div>
          <div class="flex items-center gap-4">
            <span class="bg-[#119DBC] text-white px-3 py-1 rounded-full text-sm font-semibold">{{
              headerText
            }}</span>
            <span class="text-3xl font-newedge text-[#000]">{{ headerValue }}%</span>
          </div>
        </div>
        <span
          class="bg-[#D0E7EF] text-[#119DBC] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Overview</span
        >
        <div class="mb-12">
          <div class="flex flex-col md:flex-row mt-4">
            <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#DAE8EE]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">Overall Conversion</div>
              </div>
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#119DBC]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">Desktop Conversion</div>
              </div>
              <div class="flex flex-row items-center justify-start gap-4">
                <div class="h-2 w-8 rounded bg-[#0B7A9C]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">Mobile Conversion</div>
              </div>
            </div>
            <div
              class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#DAE8EE] flex flex-col justify-between"
            >
              <div class="flex-1 flex w-full">
                <div class="flex-1 flex flex-col items-center justify-between">
                  <LineChart
                    :data="conversionChartData"
                    labelColor="#DAE8EE"
                    gridColor="#E5F1F6"
                    :yMin="0"
                    :yMax="8"
                    :yTickSuffix="'%'"
                    :yStep="1"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <span
          class="bg-[#D0E7EF] text-[#119DBC] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-Commerce Conversion Metrics</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">E-Commerce Conversion</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#DAE8EE] flex flex-col gap-10 justify-center pt-16 pb-12"
          >
            <div class="flex flex-row gap-8">
              <MiniBarChart
                :values="conversionMiniBarData[0] as [number, number, number]"
                :colors="['#B2E6FA', '#119DBC', '#0B7A9C']"
                label="Overall Conversion Rate"
                :display="(v) => v.toFixed(1) + '%'"
                labelColor="#119DBC"
              />
              <MiniBarChart
                :values="conversionMiniBarData[1] as [number, number, number]"
                :colors="['#B2E6FA', '#119DBC', '#0B7A9C']"
                label="New Visitor Conversion Rate"
                :display="(v) => v.toFixed(1) + '%'"
                labelColor="#119DBC"
              />
              <MiniBarChart
                :values="conversionMiniBarData[2] as [number, number, number]"
                :colors="['#B2E6FA', '#119DBC', '#0B7A9C']"
                label="Returning Visitor Conversion Rate"
                :display="(v) => v.toFixed(1) + '%'"
                labelColor="#119DBC"
              />
            </div>
          </div>
        </div>
        <!-- Benchmark Bloc -->
        <span
          class="bg-[#D0E7EF] text-[#119DBC] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce change by acquisition</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#DAE8EE] flex flex-col gap-8 justify-center"
          >
            <!-- PieChart Paid/Unpaid Conversion -->
            <div class="flex flex-col items-center w-full mt-12">
              <PieChart
                :values="paidUnpaidPie"
                :labels="['Paid Conversion', 'Unpaid Conversion']"
                :colors="['#119DBC', '#B2E6FA']"
              />
            </div>
          </div>
        </div>
        <!-- Benchmark Bloc -->
        <span
          class="bg-[#D0E7EF] text-[#119DBC] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce conversion rate by acquisition channel</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#DAE8EE] flex flex-col gap-8 justify-center"
          >
            <HorizontalBarChart :data="horizontalBarChartData" />
          </div>
        </div>
        <span
          class="bg-[#D0E7EF] text-[#119DBC] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce conversion rate by acquisition channel</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#DAE8EE] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl pt-16 pb-12 shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#DAE8EE] flex flex-row gap-8 justify-center"
          >
            <MiniBarChart
              variant="conversionMetrics"
              :variantValues="conversionMetricsVariantValues"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DataOverview from '@/components/DataOverview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ref, computed, watch, reactive } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useConversionDataStore } from '@/stores/conversionData'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import HorizontalBarChart from '@/components/charts/HorizontalBarChart.vue'

const globalFilters = useGlobalFiltersStore()
const conversionStore = useConversionDataStore()

// Valeur dynamique pour le header
const headerValue = ref(39)
function randomizeHeaderValue() {
  console.log('🎲 Randomizing header value')
  headerValue.value = Math.round((Math.random() * 50 + 20) * 10) / 10
}

// Valeurs randomisées pour les métriques de conversion
const conversionMetrics = ref({
  checkoutCompletion: 8.5,
  direct: 7.2,
  cartAbandonment: -4.5,
  addToCart: -3.8,
  guestCheckout: 58,
  accountCheckout: 42,
  newCustomerAOV: 55,
  returningCustomerAOV: 45,
  mobileAbandonment: 39,
  desktopAbandonment: 61,
})

function randomizeConversionMetrics() {
  console.log('🎲 Randomizing conversion metrics')
  function randomFloat(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }

  function randomPercent(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }

  conversionMetrics.value = {
    checkoutCompletion: randomFloat(5, 12),
    direct: randomFloat(4, 10),
    cartAbandonment: randomFloat(-8, -2),
    addToCart: randomFloat(-6, -1),
    guestCheckout: randomPercent(45, 70),
    accountCheckout: randomPercent(30, 55),
    newCustomerAOV: randomPercent(40, 65),
    returningCustomerAOV: randomPercent(35, 60),
    mobileAbandonment: randomPercent(30, 50),
    desktopAbandonment: randomPercent(50, 70),
  }
}

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'This year',
  UpFromLastMonth = '⬆ Up from last month',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All Months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

// Données randomisées pour le HorizontalBarChart (acquisition channel)
const horizontalBarChartData = ref([
  { label: 'Email', value: 4.24, type: 'ORGANIC' as const },
  { label: 'Paid Search', value: 3.89, type: 'PAID' as const },
  { label: 'Direct', value: 3.15, type: 'ORGANIC' as const },
  { label: 'Paid Social', value: 2.78, type: 'PAID' as const },
  { label: 'Organic Search', value: 2.45, type: 'ORGANIC' as const },
  { label: 'Display', value: 1.92, type: 'PAID' as const },
  { label: 'Retargeting', value: 1.67, type: 'PAID' as const },
  { label: 'Referral', value: 1.23, type: 'ORGANIC' as const },
] as { label: string; value: number; type: 'PAID' | 'ORGANIC' }[])

function randomizeHorizontalBarChartData() {
  function randomFloat(min: number, max: number, decimals = 2) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  horizontalBarChartData.value = [
    { label: 'Email', value: randomFloat(20, 85), type: 'ORGANIC' as const },
    { label: 'Paid Search', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Direct', value: randomFloat(20, 85), type: 'ORGANIC' as const },
    { label: 'Paid Social', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Organic Search', value: randomFloat(20, 85), type: 'ORGANIC' as const },
    { label: 'Display', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Retargeting', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Referral', value: randomFloat(20, 85), type: 'ORGANIC' as const },
  ]
}

// Données randomisées pour le graphique Conversion
const baseCurves = {
  byDevice: [180, 60, 120, 80, 200, 140, 100],
  newReturning: [200, 100, 120, 40, 120, 80, 160],
  paidUnpaid: [120, 220, 80, 110, 120, 160, 90],
}
const curves = ref({
  byDevice: [...baseCurves.byDevice],
  newReturning: [...baseCurves.newReturning],
  paidUnpaid: [...baseCurves.paidUnpaid],
})

function randomizeCurves() {
  curves.value.byDevice = baseCurves.byDevice.map((y) => y + Math.floor(Math.random() * 21) - 10)
  curves.value.newReturning = baseCurves.newReturning.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
  curves.value.paidUnpaid = baseCurves.paidUnpaid.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
}

const conversionChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Overall Conversion',
      data: curves.value.byDevice.map((y) => Math.max(1, Math.min(8, 4.5 - y / 50))),
      borderColor: '#B2E6FA',
      backgroundColor: '#B2E6FA',
      tension: 0.4,
    },
    {
      label: 'Desktop Conversion',
      data: curves.value.newReturning.map((y) => Math.max(1, Math.min(8, 5.2 - y / 50))),
      borderColor: '#119DBC',
      backgroundColor: '#119DBC',
      tension: 0.4,
    },
    {
      label: 'Mobile Conversion',
      data: curves.value.paidUnpaid.map((y) => Math.max(1, Math.min(8, 3.8 - y / 50))),
      borderColor: '#0B7A9C',
      backgroundColor: '#0B7A9C',
      tension: 0.4,
    },
  ],
}))

// Valeurs randomisées pour le bloc MiniBarChart Conversion
const conversionMiniBarData = ref([
  [2.1, 3.4, 4.8], // Overall
  [1.8, 2.9, 4.2], // New Visitor
  [3.2, 4.7, 6.8], // Returning Visitor
])

function randomizeConversionMiniBarData() {
  function randomFloat(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  conversionMiniBarData.value = [
    [randomFloat(1.5, 3.0), randomFloat(2.5, 4.0), randomFloat(4.0, 5.5)], // Overall
    [randomFloat(1.2, 2.5), randomFloat(2.2, 3.5), randomFloat(3.5, 4.8)], // New Visitor
    [randomFloat(2.5, 4.0), randomFloat(4.0, 5.5), randomFloat(5.5, 7.0)], // Returning Visitor
  ]
}

// Valeurs randomisées pour le PieChart Paid/Unpaid Conversion
const paidUnpaidPie = ref([32.3, 67.7])

function randomizePaidUnpaidPie() {
  const paid = +(Math.random() * 40 + 20).toFixed(1) // 20 à 60
  const unpaid = +(100 - paid).toFixed(1)
  paidUnpaidPie.value = [paid, unpaid]
}

// Valeurs randomisées pour les MiniBarChart par variant
const miniBarVariants = reactive({
  averageOrderValue: [2.9, 3.2, 4.4] as [number, number, number],
  transactionPerSession: [2.9, 3.2, 4.4] as [number, number, number],
  revenuePerSession: [2.9, 3.2, 4.4] as [number, number, number],
})

function randomizeMiniBarVariants() {
  function randomFloat(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  miniBarVariants.averageOrderValue = [
    randomFloat(2, 3.5),
    randomFloat(3, 4),
    randomFloat(4, 5),
  ] as [number, number, number]
  miniBarVariants.transactionPerSession = [
    randomFloat(1.5, 2.5),
    randomFloat(2.5, 3.5),
    randomFloat(3.5, 4.5),
  ] as [number, number, number]
  miniBarVariants.revenuePerSession = [randomFloat(2, 3), randomFloat(3, 4), randomFloat(4, 5)] as [
    number,
    number,
    number,
  ]
}

// Valeurs randomisées pour le variant conversionMetrics
const conversionMetricsVariantValues = ref<
  [[number, number, number], [number, number, number], [number, number, number]]
>([
  [48, 68, 96],
  [0.018, 0.029, 0.042],
  [2, 4, 6],
])

function randomizeConversionMetricsVariantValues() {
  function randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }
  function randomFloat(min: number, max: number, decimals = 3) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  conversionMetricsVariantValues.value = [
    [randomInt(40, 60), randomInt(60, 80), randomInt(80, 110)], // Average Order Value
    [randomFloat(0.012, 0.022), randomFloat(0.022, 0.035), randomFloat(0.035, 0.055)], // Transaction per Session
    [randomInt(1, 3), randomInt(3, 5), randomInt(5, 8)], // Revenue per Session
  ]
}

// Surveiller les changements de filtres globaux
watch(
  [
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedIndustry,
  ],
  (newValues) => {
    console.log('🔄 Filtres Conversion changés:', {
      month: newValues[0],
      country: newValues[1],
      device: newValues[2],
      industry: newValues[3],
    })
    randomizeHeaderValue()
    randomizeConversionMetrics()
    randomizeCurves()
    randomizeConversionMiniBarData()
    randomizePaidUnpaidPie()
    randomizeHorizontalBarChartData()
    randomizeMiniBarVariants()
    randomizeConversionMetricsVariantValues()
  },
  { immediate: true },
)

useScrollReveal('.reveal-up', {
  origin: 'top',
  distance: '20px',
  delay: 150,
  interval: 100,
})
useScrollReveal('.reveal-fade', {
  distance: '20px',
  opacity: 0,
  duration: 700,
  delay: 50,
  scale: 1,
  easing: 'ease-in-out',
})
</script>
