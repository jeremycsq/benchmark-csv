<template>
  <div class="min-h-screen">
    <transition name="fade-scale" mode="out-in">
      <DataOverviewEngagement
        :engagementStore="engagementStore"
        class="reveal-up reveal-fade"
        :key="$route.path"
      />
    </transition>

    <!-- Engagement Section avec fond violet très clair -->
    <section class="bg-[#F9FFF6] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#2E614F]">Engagement</h3>
            <span class="text-gray-600 font-normal pt-1"
              >You’re enjoying a noticeable advantage over your competition.</span
            >
          </div>
        </div>
        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Overview</span
        >
        <EngagementOverview ref="engagementOverviewRef" />
        <!-- Benchmark Bloc -->
        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
          >Benchmark</span
        >
        <EngagementBenchmark ref="engagementBenchmarkRef" />

        <!-- Radial Benchmark Chart Section -->
        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Time spent per Session</span
        >
        <EngagementTimeSpent ref="engagementTimeSpentRef" />

        <!-- Stacked Bar Benchmark Chart Section -->
        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Scroll Rate Benchmark</span
        >
        <EngagementScrollRate ref="engagementScrollRateRef" />

        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Activity Rate Benchmark</span
        >
        <EngagementActivityRate ref="engagementActivityRateRef" />

        <!-- Page Level Benchmark Section -->
        <span
          class="bg-[#C1E3B1] text-[#2E614F] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Page Level Benchmark</span
        >
        <EngagementPageLevel ref="engagementPageLevelRef" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  DataOverviewEngagement,
  EngagementOverview,
  EngagementBenchmark,
  EngagementTimeSpent,
  EngagementScrollRate,
  EngagementActivityRate,
  EngagementPageLevel,
} from '@/components/engagement'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ref, computed, watch } from 'vue'
import { useEngagementDataStore } from '@/stores/engagementData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

const engagementStore = useEngagementDataStore()
const globalFilters = useGlobalFiltersStore()

// Refs pour les composants
const engagementOverviewRef = ref()
const engagementBenchmarkRef = ref()
const engagementTimeSpentRef = ref()
const engagementScrollRateRef = ref()
const engagementActivityRateRef = ref()
const engagementPageLevelRef = ref()

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
const headerValue = ref(43.1)
function randomizeHeaderValue() {
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

// Watcher pour mettre à jour tous les composants quand les filtres changent
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    randomizeHeaderValue()
    // Mettre à jour tous les composants
    engagementOverviewRef.value?.randomizeCurves()
    engagementBenchmarkRef.value?.randomizeBarData()
    engagementTimeSpentRef.value?.updateRadialData()
    engagementScrollRateRef.value?.updateStackedBarData()
    engagementActivityRateRef.value?.updatePieData()
    engagementPageLevelRef.value?.randomizeBenchmarkTable()
  },
  { immediate: true },
)
</script>
