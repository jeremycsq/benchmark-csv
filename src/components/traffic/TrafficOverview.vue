<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="px-2 py-1 rounded text-sm font-medium">Traffic Overview</div>
      </div>
    </div>
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-6">
        <!-- Desktop -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">Desktop</span>
            <span class="text-xs text-[#8D0A38]">{{ deviceDistribution.desktop }}%</span>
          </div>
          <div class="w-full bg-[#FFF6F6] rounded-full h-2">
            <div
              class="bg-[#8D0A38] h-2 rounded-full transition-all duration-500"
              :style="{ width: deviceDistribution.desktop + '%' }"
            ></div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">Mobile</span>
            <span class="text-xs text-[#8D0A38]">{{ deviceDistribution.mobile }}%</span>
          </div>
          <div class="w-full bg-[#FFF6F6] rounded-full h-2">
            <div
              class="bg-[#FFB6B5] h-2 rounded-full transition-all duration-500"
              :style="{ width: deviceDistribution.mobile + '%' }"
            ></div>
          </div>
        </div>

        <!-- Tablet -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">Tablet</span>
            <span class="text-xs text-[#8D0A38]">{{ deviceDistribution.tablet }}%</span>
          </div>
          <div class="w-full bg-[#FFF6F6] rounded-full h-2">
            <div
              class="bg-[#FFDCDB] h-2 rounded-full transition-all duration-500"
              :style="{ width: deviceDistribution.tablet + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'

const { filteredData } = useTrafficMetrics()

// Calculer la distribution des devices en pourcentages
const deviceDistribution = computed(() => {
  console.log('🔄 TrafficOverview - deviceDistribution recalculé')
  console.log('TrafficOverview - filteredData.value.length:', filteredData.value.length)

  if (!filteredData.value.length) {
    console.log('TrafficOverview - Pas de données filtrées')
    return { desktop: 0, mobile: 0, tablet: 0 }
  }

  // Debug: voir les valeurs de device disponibles
  const deviceValues = [
    ...new Set(filteredData.value.map((item: Record<string, unknown>) => item.device)),
  ]
  console.log('TrafficOverview - Valeurs de device trouvées:', deviceValues)
  console.log('TrafficOverview - Première ligne de données:', filteredData.value[0])

  // Compter le nombre total d'entrées par device
  const deviceCounts = filteredData.value.reduce(
    (acc: Record<string, number>, item: Record<string, unknown>) => {
      if (item.device === 'desktop') {
        acc.desktop = (acc.desktop || 0) + 1
      } else if (item.device === 'mobile') {
        acc.mobile = (acc.mobile || 0) + 1
      } else if (item.device === 'tablet') {
        acc.tablet = (acc.tablet || 0) + 1
      }
      return acc
    },
    {},
  )

  console.log('TrafficOverview - Comptes par device:', deviceCounts)

  const total = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet
  console.log('TrafficOverview - Total:', total)

  if (total === 0) {
    return { desktop: 0, mobile: 0, tablet: 0 }
  }

  const result = {
    desktop: Math.round((deviceCounts.desktop / total) * 100),
    mobile: Math.round((deviceCounts.mobile / total) * 100),
    tablet: Math.round((deviceCounts.tablet / total) * 100),
  }

  console.log('✅ TrafficOverview - Résultat final:', result)
  return result
})
</script>
