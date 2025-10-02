<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDFE] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Frustration Change Over Time</div>
      </div>
    </div>
    <div class="w-full md:w-2/3 bg-white border border-[#ECEDFE] p-6 rounded-lg">
      <div class="w-full h-60">
        <LineChart
          :data="chartData"
          :yMin="chartYBounds.yMin"
          :yMax="chartYBounds.yMax"
          :yStep="chartYBounds.yStep"
          yTickSuffix="%"
          :labelColor="'#C3C4F8'"
          :gridColor="'#F5F5FF'"
        />
      </div>
      <!-- Légende comme dans Traffic YoY Change -->
      <div class="flex items-center gap-6 mt-2 text-xs" style="color: #3737a2">
        <div class="flex items-center gap-2">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :style="{ background: frustrationColors[0] }"
          ></span>
          <span>Sessions with Frustration</span>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :style="{ background: frustrationColors[1] }"
          ></span>
          <span>Load Time Frustration</span>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :style="{ background: frustrationColors[2] }"
          ></span>
          <span>JS Error Rate</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'
import { getChartColors } from '@/config/theme'

const globalFilters = useGlobalFiltersStore()

// Couleurs du thème frustration
const frustrationColors = [
  getChartColors('frustration').primary, // Orange principal
  getChartColors('frustration').secondary, // Orange secondaire
  getChartColors('frustration').tertiary, // Orange tertiaire
]

// Titre du graphique (utilisé pour référence future si nécessaire)
// const chartTitle = 'Frustration Metrics MoM Change Trends'

// Données du graphique
interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension?: number
    fill?: boolean
  }[]
}

const chartData = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Sessions with Frustration',
      data: [],
      borderColor: frustrationColors[0],
      backgroundColor: frustrationColors[0] + '20',
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Load Time Frustration',
      data: [],
      borderColor: frustrationColors[1],
      backgroundColor: frustrationColors[1] + '20',
      tension: 0.4,
      fill: false,
    },
    {
      label: 'JS Error Rate',
      data: [],
      borderColor: frustrationColors[2],
      backgroundColor: frustrationColors[2] + '20',
      tension: 0.4,
      fill: false,
    },
  ],
})

// Interface et données pour LineChart temporel
interface YBounds {
  yMin: number
  yMax: number
  yStep: number
}

const chartYBounds = ref<YBounds>({
  yMin: 0,
  yMax: 100,
  yStep: 20,
})

// Fonction pour récupérer les données depuis Supabase
const fetchFrustrationData = async () => {
  try {
    console.log('📊 Récupération des données Frustration Change Over Time...')

    let query = supabase
      .from('frustration')
      .select(
        'analysis_month, frustration_score_mom_change, load_time_frustration_mom_change, js_error_rate_mom_change, country, industry, device',
      )
      .order('analysis_month', { ascending: true })

    // Appliquer les filtres globaux
    if (globalFilters.selectedCountry !== 'All countries') {
      console.log(
        '🌍 FrustrationChangeOverTime - Appliquer filtre country:',
        globalFilters.selectedCountry,
      )
      query = query.eq('country', globalFilters.selectedCountry)
    }
    if (globalFilters.selectedIndustry !== 'All industries') {
      query = query.eq('industry', globalFilters.selectedIndustry)
    }
    if (globalFilters.selectedDevice !== 'All devices') {
      // Mapper le label UI vers la valeur DB pour la table frustration
      const mapDevice = (label: string): string => {
        const l = label.toLowerCase()
        if (l === 'desktop') return 'desktop'
        if (l === 'mobile') return 'mobile'
        if (l === 'tablet') return 'tablet'
        return label
      }
      query = query.eq('device', mapDevice(globalFilters.selectedDevice))
    } else {
      // All Devices sélectionné → cibler explicitement les lignes 'all_device'
      query = query.eq('device', 'all_device')
    }

    // Appliquer le filtre month si sélectionné
    if (globalFilters.selectedMonth !== 'All months') {
      console.log(
        '🗓️ FrustrationChangeOverTime - Appliquer filtre month:',
        globalFilters.selectedMonth,
      )
      query = query.eq('analysis_month', globalFilters.selectedMonth)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des données frustration:', error)
      return
    }

    console.log(
      '📊 FrustrationChangeOverTime - Données récupérées:',
      data?.length || 0,
      'enregistrements',
    )

    console.log('🔍 Filtres appliqués:', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      device: globalFilters.selectedDevice,
      month: globalFilters.selectedMonth,
    })

    if (data && data.length > 0) {
      console.log('📊 FrustrationChangeOverTime - Premier enregistrement:', {
        country: data[0].country,
        industry: data[0].industry,
        device: data[0].device,
        analysis_month: data[0].analysis_month,
      })

      // Transformer les données pour le graphique
      const labels = data.map((item) => {
        // Transformer analysis_month en format "Dec-01", "Jan-01", etc.
        const date = new Date(item.analysis_month)
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      })

      const sessionsData = data.map((item) => item.frustration_score_mom_change || 0)
      const loadTimeData = data.map((item) => item.load_time_frustration_mom_change || 0)
      const jsErrorData = data.map((item) => item.js_error_rate_mom_change || 0)

      // Données pour LineChart temporel avec dates sur X
      chartData.value = {
        labels,
        datasets: [
          {
            label: 'Sessions with Frustration',
            data: sessionsData,
            borderColor: frustrationColors[0],
            backgroundColor: frustrationColors[0] + '20',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Load Time Frustration',
            data: loadTimeData,
            borderColor: frustrationColors[1],
            backgroundColor: frustrationColors[1] + '20',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'JS Error Rate',
            data: jsErrorData,
            borderColor: frustrationColors[2],
            backgroundColor: frustrationColors[2] + '20',
            tension: 0.4,
            fill: false,
          },
        ],
      }

      // Calculer les bornes Y dynamiques pour un meilleur affichage
      const allData = [...sessionsData, ...loadTimeData, ...jsErrorData]
      const minValue = Math.min(...allData)
      const maxValue = Math.max(...allData)

      // Ajouter une marge de 20% de chaque côté pour la lisibilité
      const margin = Math.max(1, Math.abs(maxValue - minValue) * 0.2)
      const yMin = Math.min(0, minValue - margin) // Permettre valeurs négatives
      const yMax = Math.max(5, maxValue + margin) // Minimum 5% pour éviter échelle trop petite

      // Calculer des étapes Y appropriées
      const yRange = yMax - yMin
      const suggestedStep = yRange / 6 // 6 intervalles = 7 ticks pour une bonne lisibilité
      const yStep = Math.ceil(suggestedStep)

      chartYBounds.value = {
        yMin,
        yMax,
        yStep,
      }

      console.log('✅ FrustrationChangeOverTime - Données chargées:', {
        labels: chartData.value.labels.length,
        sessions: sessionsData.length,
        loadTime: loadTimeData.length,
        jsError: jsErrorData.length,
        yBounds: chartYBounds.value,
        sampleSessions: sessionsData.slice(0, 5),
        sampleLoadTime: loadTimeData.slice(0, 5),
        sampleJsError: jsErrorData.slice(0, 5),
      })

      console.log('📊 Graphique LineChart temporel configuré avec dates:', chartData.value.labels)
    } else {
      console.log('⚠️ Aucune donnée trouvée pour Frustration Change Over Time')
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données frustration:', error)
  }
}

// Surveiller les changements de filtres globaux
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedMonth,
  ],
  () => {
    console.log('🔄 Filtres Frustration Change Over Time changés:', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      device: globalFilters.selectedDevice,
      month: globalFilters.selectedMonth,
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
