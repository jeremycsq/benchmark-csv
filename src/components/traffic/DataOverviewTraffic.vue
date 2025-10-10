<template>
  <section class="bg-white relative z-50">
    <div class="flex-1 w-full max-w-7xl mx-auto px-8 py-12 px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" :style="{ color: pageConfig.titleColor }">
        {{ dynamicTitle }}
      </h2>
      <p class="text-center text-gray-800 mb-8">
        Select filters to view traffic benchmarks for specific markets, industries, devices, and
        audiences.
      </p>
      <div class="flex justify-start items-start gap-8 mb-8 w-full">
        <!-- Labels verticaux -->
        <div class="flex flex-col gap-8 items-center justify-center">
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-xs text-[#000000] rotate-[-90deg] text-center"
              >year <br />on <br />
              year</span
            >
          </div>
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-xs text-[#000000] rotate-[-90deg] text-center"
              >month on <br />
              month</span
            >
          </div>
        </div>
        <!-- Blocs metrics -->
        <div class="flex flex-col gap-8 w-full">
          <!-- Ligne YoY -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.yoyMetrics" :key="`yoy-${index}`">
              <div
                class="group border border-[#2E614F] p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.yoyMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
              >
                <div
                  v-if="!isLoading"
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
                <div v-else class="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
                <!-- Icône de flèche -->
                <div v-if="!isLoading" class="absolute top-6 right-6">
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
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
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
                      d="M12 5v14m0 0l-7-7m7 7l7-7"
                    />
                  </svg>
                </div>
                <!-- Tooltip -->
                <div
                  class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
                >
                  {{ metric.description }}
                </div>
              </div>
              <!-- Shape après chaque bloc (sauf le dernier) -->
              <div
                v-if="index < pageConfig.yoyMetrics.length - 1"
                class="relative w-4 h-full flex flex-col justify-center z-20 ml-[-1px] mr-[-1px]"
              >
                <!-- Shape du haut (U inversé) -->
                <div
                  class="w-4 h-8 border-l border-r border-b border-[#2E614F] rounded-b-full bg-white z-20"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t border-[#2E614F] rounded-t-full bg-white z-20"
                ></div>
              </div>
            </template>
          </div>

          <!-- Ligne MoM -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.momMetrics" :key="`mom-${index}`">
              <div
                class="group border border-[#2E614F] p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.momMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
              >
                <div
                  v-if="!isLoading"
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
                <div v-else class="h-6 w-16 bg-gray-200 animate-pulse mb-2"></div>
                <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
                <!-- Icône de flèche -->
                <div v-if="!isLoading" class="absolute top-6 right-6">
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
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
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
                      d="M12 5v14m0 0l-7-7m7 7l7-7"
                    />
                  </svg>
                </div>
                <!-- Tooltip -->
                <div
                  class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
                >
                  {{ metric.description }}
                </div>
              </div>
              <!-- Shape après chaque bloc (sauf le dernier) -->
              <div
                v-if="index < pageConfig.momMetrics.length - 1"
                class="relative w-4 h-full flex flex-col justify-center z-20 ml-[-1px] mr-[-1px]"
              >
                <!-- Shape du haut (U inversé) -->
                <div
                  class="w-4 h-8 border-l border-r border-b border-[#2E614F] rounded-b-full bg-white z-20"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t border-[#2E614F] rounded-t-full bg-white z-20"
                ></div>
              </div>
            </template>
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
    all: 'Traffic performance overview',
    month: (m: string) => `Traffic Performance overview in ${m}`,
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

<style scoped>
/* Gradient sur les bordures droite et gauche */
.border-r-gradient {
  position: relative;
  border-right: none;
}

.border-r-gradient::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    #2e614f 0%,
    #2e614f 20%,
    white 21%,
    white 79%,
    #2e614f 80%,
    #2e614f 100%
  );
}

.border-l-gradient {
  position: relative;
  border-left: none;
}

.border-l-gradient::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    #2e614f 0%,
    #2e614f 20%,
    white 21%,
    white 79%,
    #2e614f 80%,
    #2e614f 100%
  );
}
</style>
