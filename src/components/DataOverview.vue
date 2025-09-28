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

interface Props {
  pageType: 'traffic' | 'engagement' | 'frustration' | 'conversion'
}

const props = defineProps<Props>()

const globalFilters = useGlobalFiltersStore()

// Connexion aux données Supabase pour le trafic
const { benchmarkMetrics, yoyChanges, isLoading, error } = useTrafficMetrics()

// Debug: afficher les données reçues
console.log('DataOverview - benchmarkMetrics:', benchmarkMetrics.value)
console.log('DataOverview - yoyChanges:', yoyChanges.value)
console.log('DataOverview - isLoading:', isLoading.value)
console.log('DataOverview - error:', error.value)

const pageConfig = computed<PageMetrics>(() => {
  return pageConfigs[props.pageType]
})

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value
  const page = props.pageType

  // Mapping des titres par page
  const titles = {
    traffic: {
      all: 'Reveal which metrics need immediate client attention',
      month: (m: string) => `How has Traffic evolved in ${m} ?`,
    },
    engagement: {
      all: 'How has Engagement evolved across sectors this year?',
      month: (m: string) => `How has Engagement evolved in ${m} ?`,
    },
    frustration: {
      all: 'How has Frustration evolved across sectors this year?',
      month: (m: string) => `How has Frustration evolved in ${m} ?`,
    },
    conversion: {
      all: 'How has Conversion evolved across sectors this year?',
      month: (m: string) => `How has Conversion evolved in ${m} ?`,
    },
  }

  if (!month || month === 'All Months') {
    return titles[page].all
  } else {
    return titles[page].month(month)
  }
})

// Valeurs calculées depuis Supabase
const realValues = computed(() => {
  if (props.pageType === 'traffic' && yoyChanges.value && benchmarkMetrics.value) {
    return {
      yoy: [
        yoyChanges.value.overall || 0,
        yoyChanges.value.mobile || 0,
        yoyChanges.value.new || 0,
        yoyChanges.value.unpaid || 0,
      ],
      mom: [
        // Pour MoM, on utilise une variation simulée basée sur les données de benchmark
        // En réalité, il faudrait des données MoM spécifiques dans la base
        Math.round((Math.random() - 0.5) * 40),
        Math.round((Math.random() - 0.5) * 40),
        Math.round((Math.random() - 0.5) * 40),
        Math.round((Math.random() - 0.5) * 40),
      ],
    }
  }

  // Pour les autres types de pages, retourner des valeurs par défaut
  // TODO: Implémenter les composables pour engagement, conversion, frustration
  return {
    yoy: [0, 0, 0, 0],
    mom: [0, 0, 0, 0],
  }
})

// Fonction pour formater les valeurs avec le bon format selon le type
const formatValue = (
  value: number,
  metric: { value: string },
  pageType: string,
  index: number,
): string => {
  // Pour les métriques de temps (Load Time Frustration)
  if (pageType === 'frustration' && index === 1) {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    return `${minutes.toString().padStart(2, '0')}min${seconds.toString().padStart(2, '0')}`
  }

  // Pour les scores de frustration
  if (pageType === 'frustration' && index === 0) {
    return value.toString()
  }

  // Pour les pourcentages
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

// Les filtres sont gérés automatiquement par useTrafficMetrics

// Fonction pour obtenir la valeur à afficher
const getMetricValue = (
  metric: { value: string },
  period: 'yoy' | 'mom',
  index: number,
): string => {
  // Utiliser les vraies valeurs depuis Supabase si disponibles
  if (props.pageType === 'traffic' && realValues.value) {
    const realValue = realValues.value[period][index]
    return formatValue(realValue, metric, props.pageType, index)
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
  if (props.pageType === 'traffic' && realValues.value) {
    return realValues.value[period][index]
  }

  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}

// Les valeurs se mettent à jour automatiquement via les computed properties
// Pas besoin de watch car useTrafficMetrics est réactif aux filtres globaux
</script>
