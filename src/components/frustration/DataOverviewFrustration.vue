<template>
  <section class="bg-white relative z-50">
    <div class="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <h2 class="font-newedge text-4xl text-center mb-2" style="color: #3737a2 !important">
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
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#3737A2]/40 hover:shadow-sm transition cursor-pointer"
              :class="{ 'rounded-3xl': metric.isRounded }"
            >
              <div
                v-if="!isLoading"
                class="text-2xl font-newedge mb-2"
                :class="getColorClass(getNumericValue('yoy', index))"
              >
                {{ getMetricValue('yoy', index) }}
              </div>
              <div v-else class="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div v-if="!isLoading" class="absolute top-6 right-6">
                <svg
                  v-if="getNumericValue('yoy', index) > 0"
                  class="w-4 h-4 text-red-600"
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
                  v-else-if="getNumericValue('yoy', index) < 0"
                  class="w-4 h-4 text-green-600"
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
              class="group border border-[#000000] p-4 flex flex-col justify-center min-w-[200px] min-h-[100px] bg-white relative hover:border-[#3737A2]/40 hover:shadow-sm transition cursor-pointer"
              :class="{ 'rounded-2xl': metric.isRounded }"
            >
              <div
                v-if="!isLoading"
                class="text-2xl font-newedge mb-2"
                :class="getColorClass(getNumericValue('mom', index))"
              >
                {{ getMetricValue('mom', index) }}
              </div>
              <div v-else class="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div v-if="!isLoading" class="absolute top-6 right-6">
                <svg
                  v-if="getNumericValue('mom', index) > 0"
                  class="w-4 h-4 text-red-600"
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
                  v-else-if="getNumericValue('mom', index) < 0"
                  class="w-4 h-4 text-green-600"
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
import { ref, computed, onMounted, watch } from 'vue'
import { pageConfigs } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useFrustrationMetrics } from '@/composables/useFrustrationMetrics'

interface Props {
  pageType: string
  frustrationStore?: unknown
}

defineProps<Props>()

const globalFilters = useGlobalFiltersStore()
const { yoyChanges, momChanges, getMetrics } = useFrustrationMetrics()
const isLoading = ref(true)

const pageConfig = computed(() => pageConfigs.frustration)

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value
  if (!month || month === 'All Months') {
    return 'How has Frustration evolved across sectors this year?'
  } else {
    return `How has Frustration evolved in ${month}?`
  }
})

// Construction des valeurs réelles depuis la base (synchrones pour le rendu)
const realValues = ref<{ yoy: number[]; mom: number[] }>({ yoy: [0, 0, 0, 0], mom: [0, 0, 0, 0] })

async function loadFrustrationMetrics() {
  const m = await getMetrics()
  realValues.value = {
    yoy: [m.frustrationScore.yoy, m.loadTimeFrustration.yoy, m.jsErrorRate.yoy, m.bounceRate.yoy],
    mom: [m.frustrationScore.mom, m.loadTimeFrustration.mom, m.jsErrorRate.mom, m.bounceRate.mom],
  }
  isLoading.value = false
}

onMounted(loadFrustrationMetrics)
watch(
  () => [
    globalFilters.selectedCountry,
    globalFilters.selectedIndustry,
    globalFilters.selectedDevice,
    globalFilters.selectedMonth,
  ],
  () => loadFrustrationMetrics(),
)

// Fonction pour formater les valeurs selon les spécifications du data analyste
const formatValue = (value: number, index: number): string => {
  // Pour Load Time Frustration (index 1) selon formule:
  // load_time_frustration_rate = sum(NB_SESSIONS_WITH_LOADING_TIME) / sum(nb_sessions) * 100
  // Format: changement en minutes sans décimales (ex: "0min6" ou "1min6")
  if (index === 1) {
    const sign = value >= 0 ? '+' : ''
    const absValue = Math.abs(value)
    const minutes = Math.floor(absValue / 60)
    const seconds = Math.floor(absValue % 60)
    return `${sign}${minutes}min${seconds}`
  }

  // For Frustration Score (index 0) selon specs: format percentage
  // frustration_score_yoy_change et mom_change sont des pourcentages de changement
  if (index === 0) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  // Pour JS Error Rate et Bounce Rate - pourcentages avec signe
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

// Fonction pour obtenir la valeur à afficher
const getMetricValue = (period: 'yoy' | 'mom', index: number): string => {
  // Utiliser les vraies valeurs si disponibles
  if (realValues.value) {
    const realValue = period === 'yoy' ? realValues.value.yoy[index] : realValues.value.mom[index]
    return formatValue(realValue, index)
  }

  // Sinon, valeur statique du config selon les spécifications
  const metric =
    period === 'yoy' ? pageConfig.value.yoyMetrics[index] : pageConfig.value.momMetrics[index]
  return metric.value
}

// Fonction pour obtenir la valeur numérique pour déterminer la direction de la flèche
const getNumericValue = (period: 'yoy' | 'mom', index: number): number => {
  // Utiliser les vraies valeurs si disponibles
  if (realValues.value) {
    return period === 'yoy' ? realValues.value.yoy[index] : realValues.value.mom[index]
  }

  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const metric =
    period === 'yoy' ? pageConfig.value.yoyMetrics[index] : pageConfig.value.momMetrics[index]
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}

// Fonction pour déterminer la couleur selon les spécifications
const getColorClass = (value: number): string => {
  // Pour les changements YoY et MoM
  if (value > 0) return 'text-red-600' // Augmentation = rouge (mauvais pour frustration)
  if (value < 0) return 'text-green-600' // Diminution = vert (bon pour frustration)
  return 'text-gray-600' // Neutre
}

// Plus besoin de watchers manuels: le composable écoute les filtres via useSupabaseData
</script>
