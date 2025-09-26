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
import { computed, ref, watch } from 'vue'
import { useTrafficDataStore } from '@/stores/trafficData'
import { useEngagementDataStore } from '@/stores/engagementData'
import { useConversionDataStore } from '@/stores/conversionData'
import { useFrustrationDataStore } from '@/stores/frustrationData'
import { pageConfigs, type PageMetrics } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

interface Props {
  pageType: 'traffic' | 'engagement' | 'frustration' | 'conversion'
  trafficStore?: ReturnType<typeof useTrafficDataStore>
  engagementStore?: ReturnType<typeof useEngagementDataStore>
  conversionStore?: ReturnType<typeof useConversionDataStore>
  frustrationStore?: ReturnType<typeof useFrustrationDataStore>
}

const props = withDefaults(defineProps<Props>(), {
  trafficStore: undefined,
  engagementStore: undefined,
  conversionStore: undefined,
  frustrationStore: undefined,
})

const defaultTrafficStore = useTrafficDataStore()
const globalFilters = useGlobalFiltersStore()

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
      all: 'How has Traffic evolved across sectors this year?',
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

// Valeurs randomisées pour YoY et MoM
const randomizedValues = ref({
  yoy: [0, 0, 0, 0],
  mom: [0, 0, 0, 0],
})

// Fonction pour randomiser les valeurs selon le type de métrique
const randomizeValues = () => {
  const pageType = props.pageType

  // Randomiser les valeurs YoY selon le type de page
  randomizedValues.value.yoy = Array.from({ length: 4 }, (_, index) => {
    switch (pageType) {
      case 'traffic':
        // Pourcentages pour le traffic (-20 à +20)
        return Math.floor(Math.random() * 41) - 20
      case 'engagement':
        // Pourcentages pour l'engagement (-15 à +25)
        return Math.floor(Math.random() * 41) - 15
      case 'frustration':
        // Scores et pourcentages pour la frustration
        if (index === 0) {
          // Frustration Score (30-70)
          return Math.floor(Math.random() * 41) + 30
        } else if (index === 1) {
          // Load Time (temps en secondes, 30-120)
          return Math.floor(Math.random() * 91) + 30
        } else {
          // Pourcentages pour les autres métriques (-15 à +15)
          return Math.floor(Math.random() * 31) - 15
        }
      case 'conversion':
        // Pourcentages pour la conversion (-10 à +20)
        return Math.floor(Math.random() * 31) - 10
      default:
        return Math.floor(Math.random() * 41) - 20
    }
  })

  // Randomiser les valeurs MoM selon le type de page
  randomizedValues.value.mom = Array.from({ length: 4 }, (_, index) => {
    switch (pageType) {
      case 'traffic':
        // Pourcentages pour le traffic (-10 à +30)
        return Math.floor(Math.random() * 41) - 10
      case 'engagement':
        // Pourcentages pour l'engagement (-5 à +25)
        return Math.floor(Math.random() * 31) - 5
      case 'frustration':
        // Scores et pourcentages pour la frustration
        if (index === 0) {
          // Frustration Score (25-65)
          return Math.floor(Math.random() * 41) + 25
        } else if (index === 1) {
          // Load Time (temps en secondes, 25-100)
          return Math.floor(Math.random() * 76) + 25
        } else {
          // Pourcentages pour les autres métriques (-20 à +10)
          return Math.floor(Math.random() * 31) - 20
        }
      case 'conversion':
        // Pourcentages pour la conversion (-5 à +15)
        return Math.floor(Math.random() * 21) - 5
      default:
        return Math.floor(Math.random() * 41) - 10
    }
  })
}

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

// Détection automatique de filtres actifs
const hasActiveFilters = computed(() => {
  // Utiliser le store approprié selon le type de page
  let store
  switch (props.pageType) {
    case 'engagement':
      store = props.engagementStore || useEngagementDataStore()
      break
    case 'conversion':
      store = props.conversionStore || useConversionDataStore()
      break
    case 'frustration':
      store = props.frustrationStore || useFrustrationDataStore()
      break
    default:
      store = props.trafficStore || defaultTrafficStore
  }

  return (
    !!store.selectedCountry ||
    !!store.selectedIndustry ||
    !!store.selectedMonth ||
    !!store.selectedDevice
  )
})

// Fonction pour obtenir la valeur à afficher
const getMetricValue = (
  metric: { value: string },
  period: 'yoy' | 'mom',
  index: number,
): string => {
  // Désormais, la randomisation est prioritaire dès qu'un filtre est actif
  if (hasActiveFilters.value) {
    const randomValue = randomizedValues.value[period][index]
    return formatValue(randomValue, metric, props.pageType, index)
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
  if (hasActiveFilters.value) {
    return randomizedValues.value[period][index]
  }
  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}

// Surveiller les changements de filtres pour randomiser les valeurs
watch(
  () => {
    // Utiliser le store approprié selon le type de page
    let store
    switch (props.pageType) {
      case 'engagement':
        store = props.engagementStore || useEngagementDataStore()
        break
      case 'conversion':
        store = props.conversionStore || useConversionDataStore()
        break
      case 'frustration':
        store = props.frustrationStore || useFrustrationDataStore()
        break
      default:
        store = props.trafficStore || defaultTrafficStore
    }

    return [
      store.selectedCountry,
      store.selectedIndustry,
      store.selectedMonth,
      store.selectedDevice,
    ]
  },
  () => {
    randomizeValues()
  },
  { immediate: true },
)
</script>
