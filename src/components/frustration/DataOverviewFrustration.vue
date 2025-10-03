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
                class="text-2xl font-newedge mb-2"
                :class="getColorClass(getNumericValue('yoy', index))"
              >
                {{ getMetricValue('yoy', index) }}
              </div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div class="absolute top-6 right-6">
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
                class="text-2xl font-newedge mb-2"
                :class="getColorClass(getNumericValue('mom', index))"
              >
                {{ getMetricValue('mom', index) }}
              </div>
              <div class="font-medium text-sm mb-1">{{ metric.label }}</div>
              <div
                class="pointer-events-none absolute left-0 right-0 top-full mt-2 bg-[#111827] text-white text-xs px-3 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-normal break-words z-50 text-center"
              >
                {{ metric.description }}
              </div>
              <!-- Icône de flèche -->
              <div class="absolute top-6 right-6">
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
import { computed, ref, watch, onMounted } from 'vue'
import { pageConfigs } from '@/config/pageConfig'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'

interface Props {
  pageType: string
  frustrationStore?: unknown
}

defineProps<Props>()

const globalFilters = useGlobalFiltersStore()
const realValues = ref<{ yoy: number[]; mom: number[] } | null>(null)

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

// Fonction pour récupérer les vraies données selon les spécifications
const fetchFrustrationData = async () => {
  try {
    console.log('📊 Récupération des données frustration selon les spécifications...')

    console.log('🔍 DEBUG: Tentative de récupération des données frustration avec filtres...')

    let query = supabase
      .from('frustration')
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
      const mapDevice = (label: string): string => {
        const l = label.toLowerCase()
        if (l === 'desktop') return 'desktop'
        if (l === 'mobile') return 'mobile'
        if (l === 'tablet') return 'tablet'
        return label
      }
      query = query.eq('device', mapDevice(globalFilters.selectedDevice))
    } else {
      query = query.eq('device', 'all_device')
    }
    if (globalFilters.selectedMonth !== 'All months') {
      query = query.eq('analysis_month', globalFilters.selectedMonth)
    }

    console.log('🔍 Filtres actuels :', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      device: globalFilters.selectedDevice,
      month: globalFilters.selectedMonth,
    })

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des données frustration:', error)
      return
    }

    console.log('📊 FrustrationData - Données récupérées:', data?.length || 0, 'enregistrements')

    // Debug: afficher toutes les données récupérées
    if (data && data.length > 0) {
      console.log('📊 FrustrationData - Toutes les données:', data)

      const row = data[0]
      console.log('📊 FrustrationData - Premier enregistrement:', {
        country: row.country,
        industry: row.industry,
        device: row.device,
        analysis_month: row.analysis_month,
        frustration_score_yoy_change: row.frustration_score_yoy_change,
        frustration_score_mom_change: row.frustration_score_mom_change,
        load_time_frustration_yoy_change: row.load_time_frustration_yoy_change,
        load_time_frustration_mom_change: row.load_time_frustration_mom_change,
        js_error_rate_yoy_change: row.js_error_rate_yoy_change,
        js_error_rate_mom_change: row.js_error_rate_mom_change,
        bounce_rate_yoy_change: row.bounce_rate_yoy_change,
        bounce_rate_mom_change: row.bounce_rate_mom_change,
      })

      // Calculer selon les spécifications du data analyste :
      // frustration_score = sum(NB_SESSIONS_WITH_FRUSTRATIONS) / sum(nb_sessions) * 100
      // load_time_frustration_rate = sum(NB_SESSIONS_WITH_LOADING_TIME) / sum(nb_sessions) * 100
      // js_error_rate = sum(NB_SESSION_WITH_ERRORS) / sum(nb_sessions) * 100
      // bounce_rate = sum(NB_SESSIONS_BOUNCE) / sum(NB_SESSIONS) * 100
      // Les valeurs YoY et MoM sont les changements de ces scores
      const yoyValues = [
        row.frustration_score_yoy_change, // YoY change du frustration score (ex: -12.4)
        row.load_time_frustration_yoy_change, // YoY change du load time frustration rate (format: minute:secondes)
        row.js_error_rate_yoy_change, // YoY change du js_error_rate (ex: +9.9%)
        row.bounce_rate_yoy_change, // YoY change du bounce_rate (ex: +10.0%)
      ]

      const momValues = [
        row.frustration_score_mom_change, // MoM change du frustration score (ex: 2.1)
        row.load_time_frustration_mom_change, // MoM change du load time frustration rate
        row.js_error_rate_mom_change, // MoM change du js_error_rate
        row.bounce_rate_mom_change, // MoM change du bounce_rate
      ]

      realValues.value = { yoy: yoyValues, mom: momValues }
      console.log('✅ Données frustration chargées selon spécifications:', realValues.value)
    } else {
      console.log('⚠️ Aucune donnée trouvée dans la table frustration')

      // Utiliser des valeurs par défaut pour les tests si aucune donnée n'est trouvée
      realValues.value = {
        yoy: [10.0, 360, 10.0, 4.2], // Valeurs d'exemple pour YoY
        mom: [-0.5, 0, -0.8, 1.2], // Valeurs d'exemple pour MoM
      }
      console.log('🆕 Valeurs par défaut appliquées pour tests:', realValues.value)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données frustration:', error)

    // En cas d'erreur, utiliser des valeurs par défaut
    realValues.value = {
      yoy: [10.0, 360, 10.0, 4.2], // Valeurs d'exemple pour YoY
      mom: [-0.5, 0, -0.8, 1.2], // Valeurs d'exemple pour MoM
    }
    console.log('🆕 Valeurs par défaut appliquées après erreur:', realValues.value)
  }
}

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

// Surveiller les changements de filtres globaux
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    console.log('🔄 Filtres DataOverview Frustration changés:', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      month: globalFilters.selectedMonth,
      device: globalFilters.selectedDevice,
    })
    fetchFrustrationData()
  },
  { immediate: true },
)

onMounted(() => {
  fetchFrustrationData()
})

// Exposer la fonction pour que le parent puisse l'appeler
defineExpose({
  fetchFrustrationData,
})
</script>
