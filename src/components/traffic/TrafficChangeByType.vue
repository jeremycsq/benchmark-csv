<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 2px">Change by type</div>
      </div>
    </div>
    <!-- Graphiques à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-8">
        <!-- Device Changes -->
        <div class="space-y-4">
          <div v-for="(item, index) in deviceChanges" :key="`device-${index}`" class="space-y-2">
            <div class="flex justify-between text-sm text-[#FFF6F6]">
              <span class="text-xs text-[#FFB6B5]">{{ item.label }}</span>
              <span class="text-xs text-[#8D0A38]">
                {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
              </span>
            </div>
            <div class="relative h-6 bg-[#FFF6F6] rounded-full overflow-hidden">
              <div
                v-if="item.value < 0"
                :class="[
                  'bg-[#8D0A38] h-6 flex items-center justify-center text-white text-xs px-4',
                  Math.abs(item.value) * 5 >= 50 ? 'rounded-full' : 'rounded-l-full',
                ]"
                :style="{ width: Math.abs(item.value) * 5 + '%' }"
              >
                {{ item.value }}%
              </div>
              <div
                v-if="item.value > 0"
                class="bg-[#FFB6B5] rounded-r-full h-6 flex items-center justify-center text-white text-xs px-4"
                :style="{ width: item.value * 5 + '%' }"
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
            <div class="flex justify-between text-sm text-[#FFF6F6]">
              <span class="text-xs text-[#FFB6B5]">{{ item.label }}</span>
              <span class="text-xs text-[#8D0A38]">
                {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
              </span>
            </div>
            <div class="relative h-6 bg-[#FFF6F6] rounded-full overflow-hidden">
              <div
                v-if="item.value < 0"
                :class="[
                  'bg-[#8D0A38] h-6 flex items-center justify-center text-white text-xs px-4',
                  Math.abs(item.value) * 5 >= 50 ? 'rounded-full' : 'rounded-l-full',
                ]"
                :style="{ width: Math.abs(item.value) * 5 + '%' }"
              >
                {{ item.value }}%
              </div>
              <div
                v-if="item.value > 0"
                class="bg-[#FFB6B5] rounded-r-full h-6 flex items-center justify-center text-white text-xs px-4"
                :style="{ width: item.value * 5 + '%' }"
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

const { filteredData } = useTrafficMetrics()

// Calculer les changements depuis les données Supabase selon les spécifications
const deviceChanges = computed(() => {
  if (!filteredData.value.length) {
    return [
      { label: 'Overall', value: 0 },
      { label: 'Desktop', value: 0 },
      { label: 'Mobile', value: 0 },
    ]
  }

  // Bar 1: Overall Traffic Change - yoy_change WHERE device = 'all_devices'
  const overallData = filteredData.value.filter(
    (item: Record<string, unknown>) => item.device === 'all_devices' || item.device === 'all',
  )
  const overallChange =
    overallData.length > 0
      ? Math.round(
          overallData.reduce(
            (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
            0,
          ) / overallData.length,
        )
      : 0

  // Bar 2: Desktop Traffic Change - yoy_change WHERE device = 'desktop'
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

  // Bar 3: Mobile Traffic Change - yoy_change WHERE device = 'mobile'
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
    { label: 'Overall', value: overallChange },
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

  // Bar 4: Unpaid Traffic Change - Calculé comme (100 - paid_traffic_yoy_change)
  const avgPaidTrafficYoyChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.paid_traffic_yoy_change) || 0),
      0,
    ) / filteredData.value.length
  const unpaidChange = Math.round(-avgPaidTrafficYoyChange) // Inverse du paid

  // Bar 5: New Visitor Change - new_visitor_yoy_change
  const avgNewVisitorYoyChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.new_visitor_yoy_change) || 0),
      0,
    ) / filteredData.value.length

  // Bar 6: Returning Visitor Change - Calculé comme (overall - new)
  const avgOverallChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
      0,
    ) / filteredData.value.length
  const returningChange = Math.round(avgOverallChange - avgNewVisitorYoyChange)

  return [
    { label: 'Unpaid', value: unpaidChange },
    { label: 'New', value: Math.round(avgNewVisitorYoyChange) },
    { label: 'Returning', value: returningChange },
  ]
})
</script>
