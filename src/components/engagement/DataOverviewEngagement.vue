<template>
  <section class="bg-white relative z-50">
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
          <div class="flex items-center h-[100px]">
            <span class="font-newedge text-3xl text-[#000000] rotate-[-90deg]">YoY</span>
          </div>
          <div class="flex items-center h-[100px]">
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
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#2E614F]/40 hover:shadow-sm transition cursor-pointer"
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
              <!-- Tooltip -->
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
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
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#2E614F]/40 hover:shadow-sm transition cursor-pointer"
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
              <!-- Tooltip -->
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
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
import { useEngagementMetrics } from '@/composables/useEngagementMetrics'

interface Props {
  engagementStore?: any // TODO: Typer correctement le store
}

const props = defineProps<Props>()

const globalFilters = useGlobalFiltersStore()

// Connexion aux données Supabase pour l'engagement
const { engagementMetrics, yoyChanges, momChanges } = useEngagementMetrics()

// Debug: afficher les données reçues
console.log('DataOverviewEngagement - engagementMetrics:', engagementMetrics.value)
console.log('DataOverviewEngagement - yoyChanges:', yoyChanges.value)
console.log('DataOverviewEngagement - momChanges:', momChanges.value)

const pageConfig = computed<PageMetrics>(() => {
  return pageConfigs.engagement
})

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value

  // Mapping des titres pour engagement
  const titles = {
    all: 'How have trends changed since last year?',
    month: (m: string) => `How has Engagement evolved in ${m} ?`,
  }

  if (!month || month === 'All Months') {
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
