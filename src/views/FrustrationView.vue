<template>
  <div class="min-h-screen">
    <!-- Section DataOverview Frustration -->
    <DataOverviewFrustration
      ref="dataOverviewRef"
      pageType="frustration"
      :frustrationStore="frustrationStore"
      class="reveal-up reveal-fade"
      :key="$route.path"
    />

    <!-- Section Overview avec métriques principales -->
    <section class="bg-[#F7F8FF] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#3737A2]">Frustration</h3>
            <span class="text-gray-600 font-normal pt-1"
              >What are the biggest sources of frustration across digital journeys?
            </span>
          </div>
        </div>

        <span
          class="bg-[#D5D6FB] text-[#3737A2] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >Frustration Change Over Time</span
        >

        <!-- Graphique de tendance frustration -->
        <FrustrationChangeOverTime ref="changeOverTimeRef" />

        <span
          class="bg-[#D5D6FB] text-[#3737A2] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >Frustration Metrics Benchmarks</span
        >

        <FrustrationMetricsBenchmarks ref="metricsBenchmarksRef" />

        <span
          class="bg-[#D5D6FB] text-[#3737A2] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
          >Core Web Vitals</span
        >

        <!-- Métriques Core Web Vitals -->
        <FrustrationCoreWebVitals ref="coreWebVitalsRef" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DataOverviewFrustration } from '@/components/frustration'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useFrustrationDataStore } from '@/stores/frustrationData'
import {
  FrustrationChangeOverTime,
  FrustrationMetricsBenchmarks,
  FrustrationCoreWebVitals,
} from '@/components/frustration'

const route = useRoute()
const frustrationStore = useFrustrationDataStore()
const globalFilters = useGlobalFiltersStore()

// Refs pour les composants enfants
const dataOverviewRef = ref()
const benchmarkRef = ref()
const coreWebVitalsRef = ref()
const changeOverTimeRef = ref()
const metricsBenchmarksRef = ref()

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

// Valeur dynamique pour le header
const headerValue = ref(42.3)
function randomizeHeaderValue() {
  headerValue.value = Math.round((Math.random() * 30 + 35) * 10) / 10
}

// Texte dynamique selon le mois sélectionné (désactivé temporairement)

// Surveiller les changements de filtres pour déclencher les agitations
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    console.log('🔄 Filtres Frustration changés:', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      month: globalFilters.selectedMonth,
      device: globalFilters.selectedDevice,
    })

    // Trigger les fonctions de randomisation des composants enfants
    dataOverviewRef.value?.fetchFrustrationData?.()
    benchmarkRef.value?.updateBarData?.()
    coreWebVitalsRef.value?.updateCoreWebVitals?.()
    changeOverTimeRef.value?.fetchFrustrationData?.()
    randomizeHeaderValue()
  },
  { immediate: true },
)

// Charger les données spécifiques à la table frustration au montage
onMounted(() => {
  console.log('🔧 FrustrationView - Chargement des données de la table frustration')
  globalFilters.initializeData('frustration')
})

// Surveiller les changements de route pour recharger les données si nécessaire
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/frustration') {
      console.log(
        '📄 FrustrationView - Navigation détectée vers /frustration, rechargement des données',
      )
      globalFilters.initializeData('frustration')
    }
  },
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
