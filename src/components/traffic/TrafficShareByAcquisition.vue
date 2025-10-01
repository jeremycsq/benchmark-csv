<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          Traffic share by major acquisition source
        </div>
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

const { acquisitionMetrics } = useTrafficMetrics()

// Utiliser directement les métriques d'acquisition calculées selon le type de visiteur
const acquisitionData = computed(() => {
  if (!acquisitionMetrics.value || acquisitionMetrics.value.length === 0) {
    // Données de test avec valeurs négatives et positives
    return [
      { label: 'Organic Search', value: -1371 },
      { label: 'Direct', value: -823 },
      { label: 'Social', value: -274 },
      { label: 'Email', value: -137 },
      { label: 'Paid Search', value: 2843 },
    ]
  }

  return acquisitionMetrics.value
})

const getBarColor = (index: number, isPositive: boolean = true) => {
  if (isPositive) {
    return 'bg-[#8D0A38]'
  } else {
    return 'bg-[#FFB6B5]'
  }
}
</script>
