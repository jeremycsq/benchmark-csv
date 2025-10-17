<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="px-2 py-1 rounded text-sm font-medium" style="border-radius: 4px">
          Overall YoY/MoM change of traffic
        </div>
      </div>
    </div>
    <div
      class="w-full md:w-2/3 bg-white p-6 rounded-lg"
      :style="{ border: `1px solid ${chartColors.tertiary}` }"
    >
      <div class="space-y-6">
        <!-- Desktop -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#000]">Desktop</span>
            <span class="text-xs text-[#000]">{{ deviceDistribution.desktop }}%</span>
          </div>
          <div class="w-full rounded-l h-6" :style="{ backgroundColor: chartColors.background }">
            <div
              class="h-6 rounded-l transition-all duration-500"
              :style="{
                width: deviceDistribution.desktop + '%',
                backgroundColor: chartColors.secondary,
              }"
            ></div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#000]">Mobile</span>
            <span class="text-xs text-[#000]">{{ deviceDistribution.mobile }}%</span>
          </div>
          <div class="w-full rounded-l h-6" :style="{ backgroundColor: chartColors.background }">
            <div
              class="h-6 rounded-l transition-all duration-500"
              :style="{
                width: deviceDistribution.mobile + '%',
                backgroundColor: chartColors.primary,
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
import { getChartColors } from '@/config/theme'

const { filteredData } = useTrafficMetrics()

const chartColors = computed(() => getChartColors('traffic'))

// Calculer la distribution des devices en pourcentages
const deviceDistribution = computed(() => {




  if (!filteredData.value.length) {

    return { desktop: 0, mobile: 0 }
  }

  // Cas 1: données agrégées 'all_devices' → utiliser mobile_share pour répartir
  const hasAllDevices = filteredData.value.some(
    (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
  )

  if (hasAllDevices) {
    const values = filteredData.value
      .filter(
        (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
      )
      .map((item: Record<string, unknown>) => Number(item.mobile_share))
      .filter((v: number) => !isNaN(v))

    const avgMobile =
      values.length > 0 ? values.reduce((s: number, v: number) => s + v, 0) / values.length : 0

    const result = {
      desktop: Math.round((1 - avgMobile) * 100),
      mobile: Math.round(avgMobile * 100),
    }

    return result
  }

  // Debug: voir les valeurs de device disponibles
  const deviceValues = [
    ...new Set(filteredData.value.map((item: Record<string, unknown>) => item.device)),
  ]



  // Compter le nombre total d'entrées par device
  const deviceCounts = filteredData.value.reduce(
    (acc: Record<string, number>, item: Record<string, unknown>) => {
      const device = String(item.device).toLowerCase()
      if (device === '1' || device === 'desktop') {
        acc.desktop = (acc.desktop || 0) + 1
      } else if (device === '2' || device === 'mobile') {
        acc.mobile = (acc.mobile || 0) + 1
      }
      return acc
    },
    {},
  )



  const total = (deviceCounts.desktop || 0) + (deviceCounts.mobile || 0)


  if (total === 0) {
    return { desktop: 0, mobile: 0 }
  }

  const result = {
    desktop: Math.round(((deviceCounts.desktop || 0) / total) * 100),
    mobile: Math.round(((deviceCounts.mobile || 0) / total) * 100),
  }


  return result
})
</script>
