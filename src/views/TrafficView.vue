<template>
  <div class="min-h-screen">
    <!-- Metrics Section avec fond blanc -->
    <transition name="fade-scale" mode="out-in">
      <DataOverviewTraffic class="reveal-up reveal-fade" :key="$route.path" />
    </transition>

    <!-- Tout le reste de la page avec fond #FFF6F6 -->
    <section class="bg-[#FFF6F6] reveal-up">
      <!-- Traffic Section -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#8D0A38]">Traffic</h3>
            <span class="text-gray-600 font-normal pt-1">
              Compare performance against <strong>{{ globalFilters.selectedIndustry }}</strong>
            </span>
          </div>
          <div class="flex items-center gap-4"></div>
        </div>
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-md text-sm font-semibold mt-4 inline-block"
        >
          Overview
        </span>

        <TrafficOverview />

        <!-- Nouveau bloc benchmark graphique -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-md text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic splits
        </span>
        <TrafficShareByTypes />
        <!-- Nouveau bloc "Change" -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-md text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic change by type
        </span>
        <TrafficChangeByType />
        <!-- Nouveau bloc "Change - Traffic Share" -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-md text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Top acquisition channels (YoY change)
        </span>
        <TopAcquisitionChannels />
        <!-- Section: Traffic share by acquisition type MoM change -->
        <span
          class="bg-[#FFDCDB] text-[#8D0A38] px-2 py-1 rounded-md text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by acquisition type MoM change
        </span>
        <TrafficShareByAcquisitionMoM />

        <!-- Nouveau bloc "Change - Bounce rates" -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DataOverviewTraffic } from '@/components/traffic'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import { logTrafficAudit } from '@/utils/trafficAudit'
import {
  TrafficOverview,
  TrafficShareByTypes,
  TrafficChangeByType,
  TrafficShareByAcquisitionMoM,
  TrafficShareByChannelYoY,
  TopAcquisitionChannels,
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

const route = useRoute()
const globalFilters = useGlobalFiltersStore()
const { filteredData } = useTrafficMetrics()

// Ces variables sont maintenant gérées par le composant DataOverviewTraffic

// Initialiser les données Supabase pour la table traffic
onMounted(() => {
  console.log('🔧 TrafficView - Chargement des données de la table traffic')
  globalFilters.initializeData('traffic')
  // Audit des données quand disponibles (léger et en console)
  setTimeout(() => {
    try {
      logTrafficAudit('TrafficView mount', filteredData.value as unknown as [])
    } catch (e) {
      console.warn('Audit error:', e)
    }
  }, 500)
})

// Surveiller les changements de route pour recharger les données si nécessaire
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/traffic') {
      console.log('📄 TrafficView - Navigation détectée vers /traffic, rechargement des données')
      globalFilters.initializeData('traffic')
    }
  },
)
</script>
