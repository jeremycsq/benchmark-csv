<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Colonne texte à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDFE] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Core Web Vitals</div>
      </div>
      <p class="text-sm leading-6 pr-2" :style="{ color: descriptionColor }"></p>
    </div>

    <!-- Carte graphique à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#ECEDFE] px-6 py-16 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MiniBarChart
          :values="lcpValues"
          :colors="barColors"
          label="Largest Contentful Paint"
          :display="formatLCP"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
        <MiniBarChart
          :values="clsValues"
          :colors="barColors"
          label="Cumulative Layout Shift"
          :display="formatCLS"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
        <MiniBarChart
          :values="inpValues"
          :colors="barColors"
          label="Interaction to Next Paint"
          :display="formatINP"
          :labelColor="labelColor"
          :valueColor="valueColor"
          :metricLabelColor="metricLabelColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { supabase } from '@/lib/supabase'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const globalFilters = useGlobalFiltersStore()

// Couleurs et styles matching FrustrationMetricsBenchmarks (valeurs exactes du thème)
const barColors: [string, string, string] = [
  '#D5D6FB', // Tertiaire - Bleu/violet clair pour P25
  '#AFAFF5', // Secondaire - Bleu/violet moyen pour Benchmark
  '#3737A2', // Primaire - Bleu/violet foncé pour P75
]

const labelColor = '#97A6BA'
const valueColor = '#000'
const metricLabelColor = '#000'
const descriptionColor = '#6B7280'

// Données séparées pour chaque métrique
const lcpValues = ref<[number, number, number]>([1.8, 2.4, 3.7])
const clsValues = ref<[number, number, number]>([0.05, 0.12, 0.18])
const inpValues = ref<[number, number, number]>([145, 220, 340])

// Debug: vérifier que les valeurs par défaut s'affichent
console.log('🔍 INP Valeurs par défaut:', inpValues.value)

// Fonctions de formatting
const formatLCP = (value: number) => `${value.toFixed(1)}s`
const formatCLS = (value: number) => value.toFixed(2)
const formatINP = (value: number) => `${Math.round(value)}ms`

// Fonction pour récupérer les données Core Web Vitals depuis Supabase
const fetchCoreWebVitalsData = async () => {
  try {
    console.log('📊 Récupération des données Core Web Vitals...', {
      country: globalFilters.selectedCountry,
      industry: globalFilters.selectedIndustry,
      device: globalFilters.selectedDevice,
      month: globalFilters.selectedMonth,
    })

    let query = supabase
      .from('frustration')
      .select(
        'analysis_month, country, industry, device, avg_lcp, avg_cls, avg_inp, lcp_p25, lcp_p75, cls_p25, cls_p75, inp_p25, inp_p75',
      )
      .order('analysis_month', { ascending: false })

    // Appliquer les filtres globaux avec la nouvelle casse
    if (globalFilters.selectedCountry !== 'All countries') {
      console.log(
        '🌍 FrustrationCoreWebVitals - Appliquer filtre country:',
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
        '🗓️ FrustrationCoreWebVitals - Appliquer filtre month:',
        globalFilters.selectedMonth,
      )
      query = query.eq('analysis_month', globalFilters.selectedMonth)
    } else {
      // Si "All months", prendre le mois le plus récent
      query = query.limit(1)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des données Core Web Vitals:', error)
      return
    }

    console.log('🔍 FrustrationCoreWebVitals - Données brutes de la DB:', data)

    if (!data || data.length === 0) {
      console.log('⚠️ Aucune donnée trouvée pour Core Web Vitals')
      return
    }

    const row = data[0] as {
      lcp_p25?: number
      avg_lcp?: number
      lcp_p75?: number
      cls_p25?: number
      avg_cls?: number
      cls_p75?: number
      inp_p25?: number
      avg_inp?: number
      inp_p75?: number
    }

    // Mettre à jour les données séparées
    lcpValues.value = [Number(row.lcp_p25 || 0), Number(row.avg_lcp || 0), Number(row.lcp_p75 || 0)]
    clsValues.value = [Number(row.cls_p25 || 0), Number(row.avg_cls || 0), Number(row.cls_p75 || 0)]
    inpValues.value = [
      Number(row.inp_p25 || 0) * 1000,
      Number(row.avg_inp || 0) * 1000,
      Number(row.inp_p75 || 0) * 1000,
    ]

    console.log('✅ Core Web Vitals data loaded:', {
      lcp: lcpValues.value,
      cls: clsValues.value,
      inp: inpValues.value,
    })

    // Debug spécifique pour INP
    console.log('🔍 INP Debug - Valeurs brutes de la DB:', {
      inp_p25: row.inp_p25,
      avg_inp: row.avg_inp,
      inp_p75: row.inp_p75,
      converted: inpValues.value,
    })
  } catch (err) {
    console.error('❌ Erreur lors du chargement des données Core Web Vitals:', err)
  }
}

// Fonction de fallback avec données simulées
function randomizeCoreWebVitals() {
  function randomFloat(min: number, max: number, decimals = 2) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }

  function randomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }

  lcpValues.value = [randomFloat(1.5, 2.2), randomFloat(2.2, 2.8), randomFloat(3.2, 4.2)]
  clsValues.value = [randomFloat(0.03, 0.08), randomFloat(0.1, 0.15), randomFloat(0.15, 0.22)]
  inpValues.value = [randomInt(120, 180), randomInt(200, 250), randomInt(300, 380)]
}

// Watcher pour les changements de filtres
watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  (newValues, oldValues) => {
    console.log('🔄 FrustrationCoreWebVitals - Filtres changés:', {
      old: oldValues,
      new: newValues,
    })
    fetchCoreWebVitalsData()
  },
  { immediate: true },
)

// Charger les données au montage
onMounted(() => {
  fetchCoreWebVitalsData()
})

// Exposer les fonctions pour refresh manuel
defineExpose({
  updateCoreWebVitals: fetchCoreWebVitalsData,
  randomizeCoreWebVitals, // Garder la fonction de fallback si nécessaire
})
</script>
