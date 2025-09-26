<template>
  <div class="min-h-screen">
    <transition name="fade-scale" mode="out-in">
      <DataOverview
        pageType="frustration"
        :frustrationStore="frustrationStore"
        class="reveal-up reveal-fade"
        :key="$route.path"
      />
    </transition>

    <!-- Frustration Section avec fond orange très clair -->
    <section class="bg-[#FFF9E3] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#EB6909]">Frustration</h3>
            <span class="text-gray-600 font-normal pt-1"
              >Your site shows signs of user frustration</span
            >
          </div>
          <div class="flex items-center gap-4">
            <span class="bg-[#EB6909] text-white px-3 py-1 rounded-full text-sm font-semibold"
              >{{ headerText }}
            </span>
            <span class="text-3xl font-newedge text-[#000]">{{ headerValue }}%</span>
          </div>
        </div>
        <span
          class="bg-[#FED7AA] text-[#EB6909] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Overview</span
        >
        <div class="mb-12 reveal-up">
          <div class="flex flex-col md:flex-row mt-4">
            <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#FEF3E2] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#FED7AA]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">
                  Session with Frustration
                </div>
              </div>
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#FEF3E2] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#EB6909]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">
                  Load Time Frustration
                </div>
              </div>
              <div class="flex flex-row items-center justify-start gap-4">
                <div class="h-2 w-8 rounded bg-[#FF8A00]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">JS Error Rate</div>
              </div>
            </div>
            <div
              class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#FEF3E2] flex flex-col justify-between"
            >
              <div class="flex-1 flex w-full">
                <div class="flex-1 flex flex-col items-center justify-between">
                  <LineChart
                    :data="frustrationChartData"
                    labelColor="#FED7AA"
                    gridColor="#FFF7ED"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Benchmark Bloc -->
        <span
          class="bg-[#FED7AA] text-[#EB6909] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
          >Benchmark</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#FEF3E2] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Frustration</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#FEF3E2] flex flex-col gap-10 justify-center pt-16 pb-12"
          >
            <div class="flex flex-row gap-8">
              <MiniBarChart
                v-for="(item, idx) in barData"
                :key="'frustration-bar-' + String(idx)"
                :values="item.values"
                :colors="config.labelColors"
                :label="item.label"
                :display="item.display"
                labelColor="#FED7AA"
              />
            </div>
          </div>
        </div>
        <!-- Core Web Vital Bloc -->
        <span
          class="bg-[#FED7AA] text-[#EB6909] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
          >Core Web Vital</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#FEF3E2] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Core</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#F6EFD5] flex flex-col gap-10 justify-center pt-16 pb-12"
          >
            <div class="flex flex-row gap-8">
              <MiniBarChart
                variant="coreWebVitals"
                :variantValues="coreWebVitalsValues"
                :colors="['#FFD180', '#FFB74D', '#FF8A00']"
                labelColor="#FED7AA"
              />
            </div>
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
import { LineChart } from '@/components/charts'
import { useFrustrationDataStore } from '@/stores/frustrationData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { getBarChartConfig } from '@/config/charts/barChartData'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const frustrationStore = useFrustrationDataStore()
const globalFilters = useGlobalFiltersStore()

const config = getBarChartConfig('frustration')
const barData = config.data

// Animation générale
useScrollReveal('.reveal-up', {
  origin: 'top',
  distance: '20px',
  delay: 150,
  interval: 100,
})

// Animation fade custom pour DataOverview
useScrollReveal('.reveal-fade', {
  distance: '20px',
  opacity: 0,
  duration: 700,
  delay: 50,
  scale: 1,
  easing: 'ease-in-out',
})

// Données dynamiques pour le graphique Frustration
const baseCurves = {
  byDevice: [180, 60, 120, 80, 200],
  newReturning: [200, 100, 120, 40, 120],
  paidUnpaid: [120, 220, 80, 110, 120, 160],
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
const frustrationChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Session with Frustration',
      data: curves.value.byDevice.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#FED7AA',
      backgroundColor: '#FED7AA',
      tension: 0.4,
    },
    {
      label: 'Load Time Frustration',
      data: curves.value.newReturning.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#EB6909',
      backgroundColor: '#EB6909',
      tension: 0.4,
    },
    {
      label: 'JS Error Rate',
      data: curves.value.paidUnpaid.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#FF8A00',
      backgroundColor: '#FF8A00',
      tension: 0.4,
    },
  ],
}))
watch([], randomizeCurves, { immediate: true })

// Génération des données randomisées
function randomFloat(min: number, max: number, decimals = 2) {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}
function randomizeBarData() {
  barData.splice(
    0,
    barData.length,
    {
      label: 'Frustration Score',
      values: [randomFloat(35, 45), randomFloat(45, 55), randomFloat(55, 65)],
      display: (val: number) => Math.round(val).toString(),
    },
    {
      label: 'Load Time Frustration',
      values: [randomFloat(0.8, 1.2), randomFloat(1.2, 1.8), randomFloat(1.8, 2.5)],
      display: (val: number) => val.toFixed(1) + 's',
    },
    {
      label: 'JS Error Rate',
      values: [randomFloat(0.5, 1.5), randomFloat(1.5, 2.5), randomFloat(2.5, 4.0)],
      display: (val: number) => val.toFixed(1) + '%',
    },
  )
}

// Valeurs dynamiques pour le tableau Page Level Benchmark
const benchmarkTableData = ref({
  homepage: {
    loadTime: 1.8,
    errorRate: 2.3,
    frustrationScore: 42,
    bounceRate: 28.5,
    pvShare: 8.2,
  },
  category: {
    loadTime: 2.1,
    errorRate: 3.1,
    frustrationScore: 51,
    bounceRate: 45.2,
    pvShare: 12.4,
  },
  product: {
    loadTime: 1.9,
    errorRate: 2.8,
    frustrationScore: 47,
    bounceRate: 38.7,
    pvShare: 15.6,
  },
})
function randomizeBenchmarkTable() {
  function rand(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  benchmarkTableData.value = {
    homepage: {
      loadTime: rand(1.5, 2.2),
      errorRate: rand(1.8, 3.0),
      frustrationScore: Math.round(rand(35, 50)),
      bounceRate: rand(25, 35),
      pvShare: rand(7, 10),
    },
    category: {
      loadTime: rand(1.8, 2.5),
      errorRate: rand(2.5, 4.0),
      frustrationScore: Math.round(rand(45, 60)),
      bounceRate: rand(40, 55),
      pvShare: rand(10, 15),
    },
    product: {
      loadTime: rand(1.6, 2.3),
      errorRate: rand(2.2, 3.5),
      frustrationScore: Math.round(rand(40, 55)),
      bounceRate: rand(35, 45),
      pvShare: rand(12, 18),
    },
  }
}
watch(
  [
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedIndustry,
  ],
  () => {
    randomizeBarData()
    randomizeBenchmarkTable()
    randomizeCurves()
  },
  { immediate: true },
)

// Valeur dynamique pour le header
const headerValue = ref(42.3)
function randomizeHeaderValue() {
  headerValue.value = Math.round((Math.random() * 30 + 35) * 10) / 10
}

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'Cette année',
  UpFromLastMonth = '⬆ En hausse ce mois',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All Months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    randomizeHeaderValue()
  },
  { immediate: true },
)

// Données dynamiques pour le variant coreWebVitals
const coreWebVitalsValues = ref<[number, number, number][]>([
  [1.8, 2.4, 3.7], // LCP
  [0.05, 0.12, 0.18], // CLS
  [145, 220, 340], // INP
])

function randomizeCoreWebVitals() {
  function randomFloat(min: number, max: number, decimals = 2) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }

  function randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }

  coreWebVitalsValues.value = [
    [randomFloat(1.5, 2.2), randomFloat(2.2, 2.8), randomFloat(3.2, 4.2)], // LCP
    [randomFloat(0.03, 0.08), randomFloat(0.1, 0.15), randomFloat(0.15, 0.22)], // CLS
    [randomInt(120, 180), randomInt(200, 250), randomInt(300, 380)], // INP
  ]
}

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    randomizeBarData()
    randomizeBenchmarkTable()
    randomizeCurves()
    randomizeCoreWebVitals()
  },
  { immediate: true },
)

// Ajoute une fonction pour générer des valeurs random pour le StackedBarBenchmarkChart
function randomStackedBarValues() {
  // Pourcentage entre 0.5 et 4.0 pour les taux d'erreur
  const arr = [
    +(Math.random() * 1.5 + 0.5).toFixed(1),
    +(Math.random() * 1.5 + 1.5).toFixed(1),
    +(Math.random() * 1.5 + 2.5).toFixed(1),
  ]
  // Tri décroissant pour l'effet visuel
  return arr.sort((a, b) => b - a)
}

const stackedBarData = reactive({
  overall: randomStackedBarValues(),
  newVisitors: randomStackedBarValues(),
  returningVisitors: randomStackedBarValues(),
})

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    stackedBarData.overall = randomStackedBarValues()
    stackedBarData.newVisitors = randomStackedBarValues()
    stackedBarData.returningVisitors = randomStackedBarValues()
  },
  { immediate: true },
)
</script>

<style scoped>
.frustration-view {
  @apply min-h-screen bg-gray-50;
}

.chart-section {
  @apply w-full;
}
</style>
