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
import { computed, ref, watch, onMounted } from 'vue'
import { pageConfigs, type PageMetrics } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'

interface Props {
  pageType: 'traffic' | 'engagement' | 'frustration' | 'conversion'
}

const props = defineProps<Props>()

const globalFilters = useGlobalFiltersStore()

const pageConfig = computed<PageMetrics>(() => {
  return pageConfigs[props.pageType]
})

const selectedMonth = computed(() => globalFilters.selectedMonth)

const dynamicTitle = computed(() => {
  const month = selectedMonth.value

  // Mapping des titres par page
  const titles = {
    traffic: {
      all: 'How is your traffic looking this year?',
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
    return titles[props.pageType].all
  } else {
    return titles[props.pageType].month(month)
  }
})

// Données réelles pour traffic и frustration
const trafficData = ref<any[]>([])
const frustrationData = ref<any[]>([])
const realValues = computed(() => {
  if (props.pageType === 'traffic' && trafficData.value.length > 0) {
    const latestData = trafficData.value[0]
    return {
      yoy: [
        Number(latestData.yoy_change || 0),
        Number(latestData.new_visitor_yoy_change || 0),
        Number(latestData.mobile_yoy_change || 0),
        Number(latestData.paid_traffic_yoy_change || 0),
      ],
      mom: [
        parseFloat(String(latestData.mom_change || 0)),
        parseFloat(String(latestData.new_visitor_mom_change || 0)),
        parseFloat(String(latestData.mobile_mom_change || 0)),
        parseFloat(String(latestData.paid_traffic_mom_change || 0)),
      ],
    }
  }

  if (props.pageType === 'frustration' && frustrationData.value.length > 0) {
    const latestData = frustrationData.value[0]
    return {
      yoy: [
        latestData.frustration_score,
        latestData.load_time_frustration_yoy_change,
        latestData.js_error_rate_yoy_change,
        latestData.bounce_rate_yoy_change,
      ],
      mom: [
        latestData.frustration_score,
        latestData.load_time_frustration_mom_change,
        latestData.js_error_rate_mom_change,
        latestData.bounce_rate_mom_change,
      ],
    }
  }

  // Valeurs par défaut pour les autres types de pages
  return {
    yoy: [0, 0, 0, 0],
    mom: [0, 0, 0, 0],
  }
})

// Fonction pour récupérer les données traffic
const fetchTrafficData = async () => {
  if (props.pageType !== 'traffic') return

  try {
    console.log('📊 Récupération des données traffic pour DataOverview...')

    let query = supabase
      .from('traffic')
      .select('*')
      .order('analysis_month', { ascending: false })
      .limit(1)

    // Appliquer les filtres globaux
    if (globalFilters.selectedCountry !== 'All countries') {
      query = query.eq('country', globalFilters.selectedCountry)
    }
    if (globalFilters.selectedIndustry !== 'All industries') {
      query = query.eq('industry', globalFilters.selectedIndustry)
    }
    if (globalFilters.selectedDevice !== 'All devices') {
      query = query.eq('device', globalFilters.selectedDevice)
    }
    if (globalFilters.selectedMonth !== 'All months') {
      query = query.eq('analysis_month', globalFilters.selectedMonth)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des données traffic:', error)
      return
    }

    trafficData.value = data || []
    console.log('✅ Données traffic récupérées:', data?.length || 0, 'enregistrements')
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données traffic:', error)
  }
}

// Fonction pour récupérer les données frustration
const fetchFrustrationData = async () => {
  if (props.pageType !== 'frustration') return

  try {
    console.log('📊 Récupération des données frustration pour DataOverview...')

    let query = supabase
      .from('frustration')
      .select(
        'frustration_score, load_time_frustration_rate, js_error_rate, bounce_rate, frustration_score_yoy_change, load_time_frustration_yoy_change, js_error_rate_yoy_change, bounce_rate_yoy_change, frustration_score_mom_change, load_time_frustration_mom_change, js_error_rate_mom_change, bounce_rate_mom_change',
      )
      .order('analysis_month', { ascending: false })
      .limit(1)

    // Appliquer les filtres globaux
    if (globalFilters.selectedCountry !== 'All Countries') {
      query = query.eq('country', globalFilters.selectedCountry)
    }
    if (globalFilters.selectedIndustry !== 'All Industries') {
      query = query.eq('industry', globalFilters.selectedIndustry)
    }
    if (globalFilters.selectedDevice !== 'All Devices') {
      query = query.eq('device', globalFilters.selectedDevice)
    }
    if (globalFilters.selectedMonth !== 'All months') {
      query = query.eq('analysis_month', globalFilters.selectedMonth)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des données frustration:', error)
      return
    }

    frustrationData.value = data || []
    console.log('✅ Données frustration récupérées:', data?.length || 0, 'enregistrements')
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données frustration:', error)
  }
}

// Survol de supervise les changements de filtres
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    if (props.pageType === 'traffic') {
      fetchTrafficData()
    } else if (props.pageType === 'frustration') {
      fetchFrustrationData()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.pageType === 'traffic') {
    fetchTrafficData()
  } else if (props.pageType === 'frustration') {
    fetchFrustrationData()
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

// Fonction pour obtenir la valeur à afficher
const getMetricValue = (
  metric: { value: string },
  period: 'yoy' | 'mom',
  index: number,
): string => {
  // Utiliser les vraies valeurs si disponibles
  if (realValues.value) {
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
  // Utiliser les vraies valeurs si disponibles
  if (realValues.value) {
    return realValues.value[period][index]
  }

  // Pour les valeurs statiques, extraire le nombre de la chaîne
  const numericValue = parseFloat(metric.value.replace(/[%,min]/g, ''))
  return isNaN(numericValue) ? 0 : numericValue
}
</script>
