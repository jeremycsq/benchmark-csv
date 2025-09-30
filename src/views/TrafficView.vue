<template>
  <div class="min-h-screen">
    <!-- Metrics Section avec fond blanc -->
    <transition name="fade-scale" mode="out-in">
      <DataOverview pageType="traffic" class="reveal-up reveal-fade" :key="$route.path" />
    </transition>

    <!-- Tout le reste de la page avec fond #FFF6F6 -->
    <section class="bg-[#FFF6F6] reveal-up">
      <!-- Traffic Section -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#8D0A38]">Traffic</h3>
            <span class="text-gray-600 font-normal pt-1">
              Compare your metrics to specific peers in the traffic category
            </span>
          </div>
          <div class="flex items-center gap-4"></div>
        </div>
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
        >
          Overview
        </span>

        <TrafficOverview />

        <!-- Nouveau bloc benchmark graphique -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by types
        </span>
        <TrafficShareByTypes />
        <!-- Nouveau bloc "Change" -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic change by type
        </span>
        <TrafficChangeByType />
        <!-- Nouveau bloc "Change - Traffic Share" -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by major acquisition source
        </span>
        <TrafficShareByAcquisition />
        <!-- Section: Traffic share by acquisition type MoM change -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by acquisition type MoM change
        </span>
        <TrafficShareByAcquisitionMoM />

        <!-- Section: Traffic share by acquisition channel YoY change -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by acquisition channel YoY change
        </span>
        <TrafficShareByChannelYoY />
        <!-- Nouveau bloc "Change - Bounce rates" -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import DataOverview from '@/components/DataOverview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import { logTrafficAudit } from '@/utils/trafficAudit'
import {
  TrafficOverview,
  TrafficShareByTypes,
  TrafficChangeByType,
  TrafficShareByAcquisition,
  TrafficShareByAcquisitionMoM,
  TrafficShareByChannelYoY,
} from '@/components/traffic'

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

const globalFilters = useGlobalFiltersStore()
const { avgDailyTraffic, filteredData } = useTrafficMetrics()

// Calculer la valeur d'en-tête depuis les données Supabase
const headerValue = computed(() => Math.round(avgDailyTraffic.value))

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'This year',
  UpFromLastMonth = '⬆ Up from last month',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All Months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

// Initialiser les données Supabase
onMounted(() => {
  globalFilters.initializeData()
  // Audit des données quand disponibles (léger et en console)
  setTimeout(() => {
    try {
      logTrafficAudit('TrafficView mount', filteredData.value as unknown as [])
    } catch (e) {
      console.warn('Audit error:', e)
    }
  }, 500)
})
</script>
