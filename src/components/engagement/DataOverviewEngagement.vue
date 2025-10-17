<template>
  <section class="bg-white relative z-50">
    <div class="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" :style="{ color: theme.primary }">
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
            <span class="font-newedge text-xs text-[#000000] text-center"
              >year <br />on <br />year</span
            >
          </div>
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-xs text-[#000000] text-center"
              >month on <br />month</span
            >
          </div>
        </div>
        <!-- Blocs metrics -->
        <div class="flex flex-col gap-8 w-full" :style="{ '--border-color': theme.primary }">
          <!-- Ligne YoY -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.yoyMetrics" :key="`yoy-${index}`">
              <div
                class="group border p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.yoyMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
                :style="{ borderColor: theme.primary }"
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
                  class="w-4 h-8 border-l border-r border-b rounded-b-full bg-white z-20"
                  :style="{ borderColor: theme.primary }"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t rounded-t-full bg-white z-20"
                  :style="{ borderColor: theme.primary }"
                ></div>
              </div>
            </template>
          </div>

          <!-- Ligne MoM -->
          <div class="flex items-center w-full">
            <template v-for="(metric, index) in pageConfig.momMetrics" :key="`mom-${index}`">
              <div
                class="group border p-4 flex flex-col justify-center flex-1 min-h-[100px] bg-white relative hover:shadow-sm transition cursor-pointer"
                :title="metric.description"
                :class="{
                  'rounded-1xl': metric.isRounded,
                  'border-r-gradient': index < pageConfig.momMetrics.length - 1,
                  'border-l-gradient': index > 0,
                }"
                :style="{ borderColor: theme.primary }"
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
                  class="w-4 h-8 border-l border-r border-b rounded-b-full bg-white z-20"
                  :style="{ borderColor: theme.primary }"
                ></div>
                <!-- Barre de connexion horizontale -->
                <div class="w-4 h-2 bg-white z-20"></div>
                <!-- Shape du bas (U normal) -->
                <div
                  class="w-4 h-8 border-l border-r border-t rounded-t-full bg-white z-20"
                  :style="{ borderColor: theme.primary }"
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
import { getPageTheme } from '@/config/theme'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useEngagementMetrics } from '@/composables/useEngagementMetrics'

interface Props {
  engagementStore?: any // TODO: Typer correctement le store
}

const props = defineProps<Props>()

const globalFilters = useGlobalFiltersStore()

// Connexion aux données Supabase pour l'engagement
const { engagementMetrics, yoyChanges, momChanges } = useEngagementMetrics()
const isLoading = computed(() => !engagementMetrics.value || !yoyChanges.value || !momChanges.value)

// Debug: afficher les données reçues
console.log('DataOverviewEngagement - engagementMetrics:', engagementMetrics.value)
console.log('DataOverviewEngagement - yoyChanges:', yoyChanges.value)
console.log('DataOverviewEngagement - momChanges:', momChanges.value)

const pageConfig = computed<PageMetrics>(() => {
  return pageConfigs.engagement
})

const theme = computed(() => getPageTheme('engagement'))

const selectedMonth = computed(() => globalFilters.selectedMonth)

const formatMonthLabel = (value: string): string => {
  if (!value) return ''
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (isoMatch) {
    const d = new Date(value)
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    }
  }
  return value
}

const dynamicTitle = computed(() => {
  const month = selectedMonth.value

  const titles = {
    all: 'Engagement performance overview',
    month: (m: string) => `Engagement performance overview in ${formatMonthLabel(m)}`,
  }

  if (!month || month.toLowerCase() === 'all months') {
    return titles.all
  } else {
    return titles.month(month)
  }
})

// Valeurs calculées depuis Supabase pour engagement
const realValues = computed(() => {
  if (yoyChanges.value && momChanges.value) {
    return {
      yoy: [
        yoyChanges.value.pageviewsPerSession,
        yoyChanges.value.newVisitorPageviews,
        yoyChanges.value.timePerSession,
        yoyChanges.value.scrollRate,
      ],
      mom: [
        momChanges.value.pageviewsPerSession,
        momChanges.value.newVisitorPageviews,
        momChanges.value.timePerSession,
        momChanges.value.scrollRate,
      ],
    }
  }

  // Valeurs par défaut si pas de données
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
  // Utiliser les vraies valeurs si disponibles
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
  // Utiliser les vraies valeurs si disponibles
  if (realValues.value) {
    return realValues.value[period][index]
  }

  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}
</script>

<style scoped>
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
    var(--border-color) 0%,
    var(--border-color) 20%,
    white 21%,
    white 79%,
    var(--border-color) 80%,
    var(--border-color) 100%
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
    var(--border-color) 0%,
    var(--border-color) 20%,
    white 21%,
    white 79%,
    var(--border-color) 80%,
    var(--border-color) 100%
  );
}
</style>
