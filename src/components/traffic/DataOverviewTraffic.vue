<template>
  <section class="bg-white">
    <div class="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" :style="{ color: pageConfig.titleColor }">
        {{ dynamicTitle }}
      </h2>
      <p class="text-center text-gray-800 mb-8">
        Data covers same-site activity from Q4 2023 to Q4 2024. Scroll down to the methodology
        section to see how we gathered this data.
      </p>
      <div class="flex justify-center items-start gap-8 mb-8">
        <!-- Labels verticaux -->
        <div class="flex flex-col gap-8 items-center justify-center">
          <div class="flex items-center h-[140px]">
            <span class="font-newedge text-3xl text-[#000000] rotate-[-90deg]">YoY</span>
          </div>
          <div class="flex items-center h-[140px]">
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
              class="border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative"
              :class="{ 'rounded-2xl': metric.isRounded }"
            >
              <div
                class="text-2xl font-newedge mb-2"
                :class="
                  getNumericValue(metric, 'yoy', index) > 0
                    ? 'text-green-600'
                    : getNumericValue(metric, 'yoy', index) < 0
                      ? 'text-red-600'
                      : ''
                "
              >
                {{ getMetricValue(metric, 'yoy', index) }}
              </div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div class="text-gray-600 font-normal">
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div class="absolute top-6 right-6">
                <svg
                  v-if="getNumericValue(metric, 'yoy', index) > 0"
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
                  v-else-if="getNumericValue(metric, 'yoy', index) < 0"
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
              class="border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative"
              :class="{ 'rounded-2xl': metric.isRounded }"
            >
              <div
                class="text-2xl font-newedge mb-2"
                :class="
                  getNumericValue(metric, 'mom', index) > 0
                    ? 'text-green-600'
                    : getNumericValue(metric, 'mom', index) < 0
                      ? 'text-red-600'
                      : ''
                "
              >
                {{ getMetricValue(metric, 'mom', index) }}
              </div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div class="text-gray-600 font-normal">
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div class="absolute top-6 right-6">
                <svg
                  v-if="getNumericValue(metric, 'mom', index) > 0"
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
                  v-else-if="getNumericValue(metric, 'mom', index) < 0"
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
import { computed } from 'vue'
import { pageConfigs, type PageMetrics } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'

const globalFilters = useGlobalFiltersStore()

// Connexion aux données Supabase pour le trafic
const { benchmarkMetrics, yoyChanges, filteredData, isLoading, error } = useTrafficMetrics()

// Debug: afficher les données reçues
console.log('DataOverviewTraffic - benchmarkMetrics:', benchmarkMetrics.value)
console.log('DataOverviewTraffic - yoyChanges:', yoyChanges.value)
console.log('DataOverviewTraffic - filteredData:', filteredData.value)
console.log('DataOverviewTraffic - isLoading:', isLoading.value)
console.log('DataOverviewTraffic - error:', error.value)

const pageConfig = computed<PageMetrics>(() => {
  return pageConfigs.traffic
})

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value

  // Mapping des titres pour traffic
  const titles = {
    all: 'Reveal which metrics need immediate client attention',
    month: (m: string) => `How has Traffic evolved in ${m} ?`,
  }

  if (!month || month === 'All months') {
    return titles.all
  } else {
    return titles.month(month)
  }
})

// Valeurs calculées depuis Supabase
const realValues = computed(() => {
  if (yoyChanges.value && filteredData.value && filteredData.value.length > 0) {
    // Utiliser les vraies données depuis filteredData pour MoM
    const latestData = filteredData.value[0] || filteredData.value[filteredData.value.length - 1]

    return {
      yoy: [
        yoyChanges.value.overall || 0,
        yoyChanges.value.mobile || 0,
        yoyChanges.value.new || 0,
        yoyChanges.value.unpaid || 0,
      ],
      mom: [
        parseFloat(String(latestData.mom_change || 0).replace('%', '')),
        parseFloat(String(latestData.mobile_mom_change || 0).replace('%', '')),
        parseFloat(String(latestData.new_visitor_mom_change || 0).replace('%', '')),
        parseFloat(String(latestData.paid_traffic_mom_change || 0).replace('%', '')),
      ],
    }
  }

  // Valeurs par défaut
  return {
    yoy: [0, 0, 0, 0],
    mom: [0, 0, 0, 0],
  }
})

// Fonction pour formater les valeurs avec le bon format selon le type
const formatValue = (value: number, metric: { value: string }, index: number): string => {
  // Pour les pourcentages
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

// Fonction pour obtenir la valeur à afficher
const getMetricValue = (
  metric: { value: string },
  period: 'yoy' | 'mom',
  index: number,
): string => {
  // Utiliser les vraies valeurs depuis Supabase si disponibles
  if (realValues.value) {
    const realValue = realValues.value[period][index]
    return formatValue(realValue, metric, index)
  }

  // Sinon, valeur statique du config
  return metric.value
}

// Fonction pour obtenir la valeur numérique pour déterminer la direction de la flèche
const getNumericValue = (
  metric: { value: string },
  period: 'yoy' | 'mom',
  index: number,
): number => {
  // Utiliser les vraies valeurs depuis Supabase si disponibles
  if (realValues.value) {
    return realValues.value[period][index]
  }

  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}

// Les valeurs se mettent à jour automatiquement via les computed properties
// Pas besoin de watch car useTrafficMetrics est réactif aux filtres globaux
</script>
