<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge rounded font-medium">Traffic share by device</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium">Traffic share by visitor type</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="font-newedge pt-1 font-medium">Traffic share by acquisition source</div>
      </div>
    </div>
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-8">
        <!-- Device Distribution - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">Mobile</span>
            <span class="text-xs text-[#FFB6B5]">Desktop</span>
          </div>
          <div class="relative w-full h-8 bg-[#FFF6F6] rounded">
            <!-- Mobile (vert clair) -->
            <div
              class="absolute left-0 top-0 h-full bg-[#FFDCDB] rounded-l flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: deviceDistribution.mobile + '%' }"
            >
              <span v-if="deviceDistribution.mobile > 10">{{ deviceDistribution.mobile }}%</span>
            </div>
            <!-- Desktop (vert foncé) -->
            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: deviceDistribution.desktop + '%' }"
            >
              <span v-if="deviceDistribution.desktop > 10">{{ deviceDistribution.desktop }}%</span>
            </div>
          </div>
        </div>

        <!-- Visitor Type - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">New</span>
            <span class="text-xs text-[#FFB6B5]">Returning</span>
          </div>
          <div class="relative w-full h-8 bg-[#FFF6F6] rounded">
            <!-- New (vert clair) -->
            <div
              class="absolute left-0 top-0 h-full bg-[#FFDCDB] rounded-l flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: visitorType.new + '%' }"
            >
              <span v-if="visitorType.new > 10">{{ visitorType.new }}%</span>
            </div>
            <!-- Returning (vert foncé) -->
            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: visitorType.returning + '%' }"
            >
              <span v-if="visitorType.returning > 10">{{ visitorType.returning }}%</span>
            </div>
          </div>
        </div>

        <!-- Acquisition Source - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#FFB6B5]">Paid</span>
            <span class="text-xs text-[#FFB6B5]">Unpaid</span>
          </div>
          <div class="relative w-full h-8 bg-[#FFF6F6] rounded">
            <!-- Paid (vert clair) -->
            <div
              class="absolute left-0 top-0 h-full bg-[#FFDCDB] rounded-l flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: acquisitionSource.paid + '%' }"
            >
              <span v-if="acquisitionSource.paid > 10">{{ acquisitionSource.paid }}%</span>
            </div>
            <!-- Unpaid (vert foncé) -->
            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-center text-white font-medium text-sm"
              :style="{ width: acquisitionSource.organic + '%' }"
            >
              <span v-if="acquisitionSource.organic > 10">{{ acquisitionSource.organic }}%</span>
            </div>
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

// Calculer les distributions depuis les données Supabase selon les spécifications
const deviceDistribution = computed(() => {
  if (!filteredData.value.length) {
    return { desktop: 0, mobile: 0 }
  }

  // Bar 1: Traffic Share by Device
  // Mobile: Direct from DB (mobile_share)
  // Desktop: Calculated (100 - mobile_share)
  const avgMobileShare =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.mobile_share) || 0),
      0,
    ) / filteredData.value.length

  return {
    mobile: Math.round(avgMobileShare),
    desktop: Math.round(100 - avgMobileShare),
  }
})

const visitorType = computed(() => {
  if (!filteredData.value.length) {
    return { new: 0, returning: 0 }
  }

  // Bar 2: New vs. Returning Visitors
  // New: Direct from DB (new_visitor_rate)
  // Returning: Direct from DB (returning_visitor_rate)
  const avgNewVisitorRate =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.new_visitor_rate) || 0),
      0,
    ) / filteredData.value.length

  const avgReturningVisitorRate =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.returning_visitor_rate) || 0),
      0,
    ) / filteredData.value.length

  return {
    new: Math.round(avgNewVisitorRate),
    returning: Math.round(avgReturningVisitorRate),
  }
})

const acquisitionSource = computed(() => {
  if (!filteredData.value.length) {
    return { paid: 0, organic: 0 }
  }

  // Bar 3: Paid vs. Unpaid Traffic
  // Paid: Direct from DB (paid_traffic_share)
  // Unpaid: Calculated (100 - paid_traffic_share)
  const avgPaidTrafficShare =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.paid_traffic_share) || 0),
      0,
    ) / filteredData.value.length

  return {
    paid: Math.round(avgPaidTrafficShare),
    organic: Math.round(100 - avgPaidTrafficShare),
  }
})
</script>
