<template>
  <div class="min-h-screen">
    <transition name="fade-scale" mode="out-in">
      <DataOverviewEngagement
        :engagementStore="engagementStore"
        class="reveal-up reveal-fade"
        :key="$route.path"
      />
    </transition>

    <!-- Engagement Section avec fond du thème -->
    <section class="reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge" :style="{ color: theme.primary }">Engagement</h3>
            <span class="text-gray-600 font-normal pt-1"
              >Compare performance with benchmarks from all industries
              <strong>{{ globalFilters.selectedIndustry?.toLowerCase() }}</strong>
            </span>
          </div>
        </div>
        <span
          class="px-2 py-1 rounded text-sm font-semibold inline-block mt-4"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
          >Overview</span
        >
        <EngagementOverview ref="engagementOverviewRef" />
        <!-- Benchmark Bloc -->
        <span
          class="px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
          >Benchmark</span
        >
        <EngagementBenchmark ref="engagementBenchmarkRef" />

        <!-- Radial Benchmark Chart Section -->
        <span
          class="px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
          >Time spent per Session</span
        >
        <EngagementTimeSpent ref="engagementTimeSpentRef" />

        <!-- Stacked Bar Benchmark Chart Section -->
        <span
          class="px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
          >Scroll Rate Benchmark</span
        >
        <EngagementScrollRate ref="engagementScrollRateRef" />

        <span
          class="px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
          >Activity Rate Benchmark</span
        >
        <EngagementActivityRate ref="engagementActivityRateRef" />

        <!-- Page Level Benchmark Section -->
        <span
          class="px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          :style="{ backgroundColor: theme.background, color: theme.primary }"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useEngagementDataStore } from '@/stores/engagementData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useRoute } from 'vue-router'
import { getPageTheme } from '@/config/theme'

const engagementStore = useEngagementDataStore()
const globalFilters = useGlobalFiltersStore()
const route = useRoute()

const theme = computed(() => getPageTheme('engagement'))

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

// Initialiser les données Supabase pour la table engagement
onMounted(() => {
  console.log('🔧 EngagementView - Chargement des données de la table engagement')
  globalFilters.initializeData('engagement')
})

// Recharger si navigation directe vers /engagement
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/engagement') {
      console.log(
        '📄 EngagementView - Navigation détectée vers /engagement, rechargement des données',
      )
      globalFilters.initializeData('engagement')
    }
  },
)
</script>
