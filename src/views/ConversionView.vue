<template>
  <div class="min-h-screen">
    <DataOverview
      pageType="conversion"
      :conversionStore="conversionStore"
      class="reveal-up reveal-fade"
      :key="$route.path"
    />
    <section class="bg-[#EEEFF1] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#32373A]">Conversion</h3>
            <span class="text-gray-600 font-normal pt-1"
              >Conversion is not just a click, it's the result of everything that precedes it.</span
            >
          </div>
          <div class="flex items-center gap-4">
            <span class="bg-[#32373A] text-white px-3 py-1 rounded-full text-sm font-semibold">{{
              headerText
            }}</span>
            <span class="text-3xl font-newedge text-[#000]">{{ headerValue }}%</span>
          </div>
        </div>
        <span
          class="bg-[#ECEDEF] text-[#32373A] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Overview</span
        >

        <ConversionOverview ref="overviewRef" />

        <span
          class="bg-[#ECEDEF] text-[#32373A] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-Commerce Conversion Metrics</span
        >
        <ConversionEcommerceMetrics ref="ecommerceMetricsRef" />

        <span
          class="bg-[#ECEDEF] text-[#32373A] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce change by acquisition</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <ConversionPaidUnpaid ref="paidUnpaidRef" />
        </div>

        <span
          class="bg-[#ECEDEF] text-[#32373A] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce conversion rate by acquisition channel</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <ConversionByAcquisition ref="byAcquisitionRef" />
        </div>

        <span
          class="bg-[#ECEDEF] text-[#32373A] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >E-commerce conversion metrics</span
        >
        <div class="flex flex-col md:flex-row mt-8 mb-12">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Acquisition Channel</div>
            </div>
          </div>
          <ConversionMetricsVariant ref="metricsVariantRef" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DataOverview from '@/components/DataOverview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ref, computed, watch } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useConversionDataStore } from '@/stores/conversionData'
import {
  ConversionOverview,
  ConversionEcommerceMetrics,
  ConversionPaidUnpaid,
  ConversionByAcquisition,
  ConversionMetricsVariant,
} from '@/components/conversion'

const globalFilters = useGlobalFiltersStore()
const conversionStore = useConversionDataStore()

// Valeur dynamique pour le header
const headerValue = ref(39)
function randomizeHeaderValue() {
  console.log('🎲 Randomizing header value')
  headerValue.value = Math.round((Math.random() * 50 + 20) * 10) / 10
}

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'This year',
  UpFromLastMonth = '⬆ Up from last month',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

// Refs vers composants conversion
const overviewRef = ref()
const ecommerceMetricsRef = ref()
const paidUnpaidRef = ref()
const byAcquisitionRef = ref()
const metricsVariantRef = ref()

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
    overviewRef.value?.randomizeCurves()
    ecommerceMetricsRef.value?.randomizeConversionMiniBarData()
    paidUnpaidRef.value?.randomizePaidUnpaidPie()
    byAcquisitionRef.value?.randomizeHorizontalBarChartData()
    metricsVariantRef.value?.randomizeConversionMetricsVariantValues()
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
