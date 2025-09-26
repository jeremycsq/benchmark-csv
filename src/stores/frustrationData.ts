import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

export const useFrustrationDataStore = defineStore('frustrationData', () => {
  const globalFilters = useGlobalFiltersStore()

  // Filtres synchronisés avec les filtres globaux
  const selectedMonth = computed(() => globalFilters.selectedMonth)
  const selectedCountry = computed(() => globalFilters.selectedCountry)
  const selectedIndustry = computed(() => globalFilters.selectedIndustry)
  const selectedDevice = computed(() => globalFilters.selectedDevice)

  // Données de frustration randomisées
  const frustrationScore = ref(45)
  const loadTime = ref(1.5)
  const jsErrorRate = ref(2.1)
  const bounceRate = ref(35.2)

  // Fonction pour randomiser les données
  function randomizeFrustrationData() {
    function randomFloat(min: number, max: number, decimals = 1) {
      return +(Math.random() * (max - min) + min).toFixed(decimals)
    }

    frustrationScore.value = randomFloat(30, 70, 0)
    loadTime.value = randomFloat(0.8, 2.5, 1)
    jsErrorRate.value = randomFloat(0.5, 4.0, 1)
    bounceRate.value = randomFloat(25, 50, 1)
  }

  // Fonction pour récupérer les données (simulation d'API)
  async function fetchFrustrationData() {
    // Simuler un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100))
    randomizeFrustrationData()
    return {
      frustrationScore: frustrationScore.value,
      loadTime: loadTime.value,
      jsErrorRate: jsErrorRate.value,
      bounceRate: bounceRate.value,
    }
  }

  return {
    // Filtres (synchronisés avec les filtres globaux)
    selectedMonth,
    selectedCountry,
    selectedIndustry,
    selectedDevice,

    // Données
    frustrationScore,
    loadTime,
    jsErrorRate,
    bounceRate,

    // Actions
    randomizeFrustrationData,
    fetchFrustrationData,
  }
})
