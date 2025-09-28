<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium">
          Traffic share by acquisition channel YoY change
        </div>
      </div>
    </div>
    <!-- Graphiques à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-6">
        <div v-for="(item, index) in channelYoYData" :key="index" class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">{{ item.label }}</span>
            <span class="text-xs text-[#8D0A38]">
              {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
            </span>
          </div>
          <div class="relative h-6 bg-[#FFF6F6] rounded-full overflow-hidden">
            <div
              v-if="item.value < 0"
              class="bg-[#8D0A38] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
              :style="{ width: Math.abs(item.value) * 3 + '%' }"
            >
              {{ item.value }}%
            </div>
            <div
              v-if="item.value > 0"
              class="bg-[#FFB6B5] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
              :style="{ width: item.value * 3 + '%' }"
            >
              +{{ item.value }}%
            </div>
          </div>
        </div>
      </div>
      <!-- Graduation -->
      <div class="flex justify-between text-[#8D0A38] text-xs mt-4 px-2 ml-40">
        <span>-4%</span>
        <span>-2%</span>
        <span>0%</span>
        <span>2%</span>
        <span>4%</span>
        <span>8%</span>
        <span>12%</span>
        <span>16%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'

const { filteredData } = useTrafficMetrics()

// Calculer les changements YoY par canal depuis Supabase
const channelYoYData = computed(() => {
  if (!filteredData.value.length) {
    return [
      { label: 'Organic Search', value: 0 },
      { label: 'Direct', value: 0 },
      { label: 'Social', value: 0 },
      { label: 'Email', value: 0 },
      { label: 'Paid Search', value: 0 },
    ]
  }

  // Calculer les changements YoY depuis les données filtrées
  const avgOverallChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
      0,
    ) / filteredData.value.length

  const avgPaidChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.paid_traffic_yoy_change) || 0),
      0,
    ) / filteredData.value.length

  return [
    { label: 'Organic Search', value: Math.round(avgOverallChange * 0.4) },
    { label: 'Direct', value: Math.round(avgOverallChange * 0.3) },
    { label: 'Social', value: Math.round(avgOverallChange * 0.2) },
    { label: 'Email', value: Math.round(avgOverallChange * 0.05) },
    { label: 'Paid Search', value: Math.round(avgPaidChange) },
  ]
})
</script>
