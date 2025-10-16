<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${chartColors.tertiary}` }"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 2px">Change by type</div>
      </div>
    </div>
    <!-- Graphiques à droite -->
    <div
      class="w-full md:w-2/3 bg-white border p-6 rounded-lg"
      :style="{ border: `1px solid ${chartColors.tertiary}` }"
    >
      <div class="space-y-8">
        <!-- Device Changes -->
        <div class="space-y-4">
          <div v-for="(item, index) in deviceChanges" :key="`device-${index}`" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-xs text-[#000]">{{ item.label }}</span>
              <span class="text-xs text-[#000]">
                {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
              </span>
            </div>
            <div
              class="relative h-6 rounded overflow-hidden"
              :style="{ backgroundColor: chartColors.background }"
            >
              <div
                v-if="item.value < 0"
                :class="[
                  'h-6 flex items-center justify-center text-white text-xs px-4',
                  Math.abs(item.value) * 5 >= 50 ? '' : 'rounded',
                ]"
                :style="{
                  width: Math.abs(item.value) * 5 + '%',
                  backgroundColor: chartColors.primary,
                }"
              >
                {{ item.value }}%
              </div>
              <div
                v-if="item.value > 0"
                class="rounded-r-full h-6 flex items-center justify-center text-white text-xs px-4"
                :style="{
                  width: item.value * 5 + '%',
                  backgroundColor: chartColors.secondary,
                  color: chartColors.tertiary,
                }"
              >
                +{{ item.value }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Visitor Type Changes -->
        <div class="space-y-4">
          <div
            v-for="(item, index) in visitorTypeChanges"
            :key="`visitor-${index}`"
            class="space-y-2"
          >
            <div class="flex justify-between text-sm">
              <span class="text-xs text-[#000]">{{ item.label }}</span>
              <span class="text-xs text-[#000]">
                {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
              </span>
            </div>
            <div
              class="relative h-6 overflow-hidden rounded"
              :style="{ backgroundColor: chartColors.background }"
            >
              <div
                v-if="item.value < 0"
                :class="[
                  'h-6 flex items-center justify-center text-white text-xs px-4',
                  Math.abs(item.value) * 5 >= 50 ? 'rounded' : 'rounded',
                ]"
                :style="{
                  width: Math.abs(item.value) * 5 + '%',
                  backgroundColor: chartColors.primary,
                }"
              >
                {{ item.value }}%
              </div>
              <div
                v-if="item.value > 0"
                class="rounded-l h-6 flex items-center justify-center text-xs px-4"
                :style="{
                  width: item.value * 5 + '%',
                  backgroundColor: chartColors.secondary,
                  color: '#FFF',
                }"
              >
                +{{ item.value }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Acquisition Source Changes -->
        <!-- Pas de barres supplémentaires selon les spécifications -->
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

// Calculer les changements depuis les données Supabase selon les spécifications
const deviceChanges = computed(() => {
  if (!filteredData.value.length) {
    return [
      { label: 'Desktop', value: 0 },
      { label: 'Mobile', value: 0 },
    ]
  }

  // Desktop Traffic Change - yoy_change WHERE device = 'desktop'
  const desktopData = filteredData.value.filter(
    (item: Record<string, unknown>) => item.device === 'desktop',
  )
  const desktopChange =
    desktopData.length > 0
      ? Math.round(
          desktopData.reduce(
            (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
            0,
          ) / desktopData.length,
        )
      : 0

  // Mobile Traffic Change - yoy_change WHERE device = 'mobile'
  const mobileData = filteredData.value.filter(
    (item: Record<string, unknown>) => item.device === 'mobile',
  )
  const mobileChange =
    mobileData.length > 0
      ? Math.round(
          mobileData.reduce(
            (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
            0,
          ) / mobileData.length,
        )
      : 0

  return [
    { label: 'Desktop', value: desktopChange },
    { label: 'Mobile', value: mobileChange },
  ]
})

const visitorTypeChanges = computed(() => {
  if (!filteredData.value.length) {
    return [
      { label: 'Unpaid', value: 0 },
      { label: 'New', value: 0 },
      { label: 'Returning', value: 0 },
    ]
  }

  // Unpaid Traffic Change - Calculé comme (100 - paid_traffic_yoy_change)
  const avgPaidTrafficYoyChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.paid_traffic_yoy_change) || 0),
      0,
    ) / filteredData.value.length
  const unpaidChange = Math.round(-avgPaidTrafficYoyChange)

  // New Visitor Change - new_visitor_yoy_change
  const avgNewVisitorYoyChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.new_visitor_yoy_change) || 0),
      0,
    ) / filteredData.value.length

  // Returning Visitor Change - Calculé comme (overall - new)
  const avgOverallChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
      0,
    ) / filteredData.value.length
  const returningChange = Math.round(avgOverallChange - avgNewVisitorYoyChange)

  return [
    { label: 'Unpaid', value: unpaidChange },
    { label: 'New Visitors', value: Math.round(avgNewVisitorYoyChange) },
    { label: 'Returning', value: returningChange },
  ]
})
</script>
