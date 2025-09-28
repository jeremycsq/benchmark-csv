<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium">Traffic share by major acquisition source</div>
      </div>
    </div>
    <!-- Graphiques à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-6">
        <div v-for="(item, index) in acquisitionData" :key="index" class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">{{ item.label }}</span>
            <span class="text-xs text-[#8D0A38]">
              {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
            </span>
          </div>
          <!-- Container pour la barre avec ligne centrale -->
          <div class="relative w-full h-6 flex items-center">
            <!-- Ligne centrale de référence -->
            <div
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-[#FFF6F6] z-0"
            ></div>

            <!-- Barre positive (droite) -->
            <div
              v-if="item.value >= 0"
              class="absolute left-1/2 h-3 rounded-r-full transition-all duration-500 z-10"
              :class="getBarColor(index, true)"
              :style="{
                width: Math.min(Math.abs(item.value), 100) / 2 + '%',
                transform: 'translateX(0)',
              }"
            ></div>

            <!-- Barre négative (gauche) -->
            <div
              v-if="item.value < 0"
              class="absolute right-1/2 h-3 rounded-l-full transition-all duration-500 z-10"
              :class="getBarColor(index, false)"
              :style="{
                width: Math.min(Math.abs(item.value), 100) / 2 + '%',
                transform: 'translateX(0)',
              }"
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

// Calculer les données d'acquisition depuis Supabase
const acquisitionData = computed(() => {
  if (!filteredData.value.length) {
    // Données de test avec valeurs négatives et positives
    return [
      { label: 'Organic Search', value: -1371 },
      { label: 'Direct', value: -823 },
      { label: 'Social', value: -274 },
      { label: 'Email', value: -137 },
      { label: 'Paid Search', value: 2843 },
    ]
  }

  // Calculer la moyenne des parts de trafic payant
  const avgPaidTrafficShare =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.paid_traffic_share) || 0),
      0,
    ) / filteredData.value.length

  // Simuler une répartition des canaux d'acquisition avec variations YoY
  // En réalité, il faudrait des champs spécifiques dans la base de données
  const organicShare = Math.round((1 - avgPaidTrafficShare) * 0.5 * 100)
  const directShare = Math.round((1 - avgPaidTrafficShare) * 0.3 * 100)
  const socialShare = Math.round((1 - avgPaidTrafficShare) * 0.1 * 100)
  const emailShare = Math.round((1 - avgPaidTrafficShare) * 0.05 * 100)
  const paidShare = Math.round(avgPaidTrafficShare * 100)

  // Appliquer des variations pour simuler des changements YoY
  const variations = [-15, -25, -10, -5, 30] // Variations en pourcentage

  return [
    { label: 'Organic Search', value: Math.round(organicShare * (1 + variations[0] / 100)) },
    { label: 'Direct', value: Math.round(directShare * (1 + variations[1] / 100)) },
    { label: 'Social', value: Math.round(socialShare * (1 + variations[2] / 100)) },
    { label: 'Email', value: Math.round(emailShare * (1 + variations[3] / 100)) },
    { label: 'Paid Search', value: Math.round(paidShare * (1 + variations[4] / 100)) },
  ]
})

const getBarColor = (index: number, isPositive: boolean = true) => {
  const positiveColors = [
    'bg-[#8D0A38]',
    'bg-[#A31242]',
    'bg-[#FFB6B5]',
    'bg-[#FFDCDB]',
    'bg-[#FFF6F6]',
  ]

  const negativeColors = [
    'bg-[#DC2626]',
    'bg-[#EF4444]',
    'bg-[#F87171]',
    'bg-[#FCA5A5]',
    'bg-[#FECACA]',
  ]

  if (isPositive) {
    return positiveColors[index % positiveColors.length]
  } else {
    return negativeColors[index % negativeColors.length]
  }
}
</script>
