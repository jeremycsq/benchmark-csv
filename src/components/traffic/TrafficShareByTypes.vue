<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${chartColors.tertiary}` }"
      >
        <div class="font-newedge rounded font-medium" style="border-radius: 4px">Device</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${chartColors.tertiary}` }"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">Visitor</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          Acquisition channel
        </div>
      </div>
    </div>
    <div
      class="w-full md:w-2/3 bg-white border p-6 rounded-lg"
      :style="{ border: `1px solid ${chartColors.tertiary}` }"
    >
      <div class="space-y-8">
        <!-- Device Distribution - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-xs text-[#000]">Mobile</span>
            <span class="text-xs text-[#000]">Desktop</span>
          </div>
          <div
            class="relative w-full h-7 rounded"
            :style="{ backgroundColor: chartColors.background }"
          >
            <!-- Mobile (tertiary foncé) -->
            <div
              class="absolute left-0 top-0 h-full rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{
                width: deviceDistribution.mobile + '%',
                backgroundColor: chartColors.primary,
              }"
            >
              <span v-if="deviceDistribution.mobile > 10">{{ deviceDistribution.mobile }}%</span>
            </div>

            <div
              class="absolute right-0 top-0 h-full rounded-r flex items-center justify-end pr-6 font-semibold text-xs tracking-wide"
              :style="{
                width: deviceDistribution.desktop + '%',
                backgroundColor: chartColors.secondary,
                color: chartColors.tertiary,
              }"
            >
              <span v-if="deviceDistribution.desktop > 10">{{ deviceDistribution.desktop }}%</span>
            </div>
          </div>
        </div>

        <!-- Visitor Type - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-xs text-[#000]">New</span>
            <span class="text-xs text-[#000]">Returning</span>
          </div>
          <div
            class="relative w-full h-7 rounded"
            :style="{ backgroundColor: chartColors.background }"
          >
            <div
              class="absolute left-0 top-0 h-full rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{ width: visitorType.new + '%', backgroundColor: chartColors.primary }"
            >
              <span v-if="visitorType.new > 10">{{ visitorType.new }}%</span>
            </div>
            <!-- Returning (clair) -->
            <div
              class="absolute right-0 top-0 h-full rounded-r flex items-center justify-end pr-6 font-semibold text-xs tracking-wide"
              :style="{
                width: visitorType.returning + '%',
                backgroundColor: chartColors.secondary,
                color: chartColors.tertiary,
              }"
            >
              <span v-if="visitorType.returning > 10">{{ visitorType.returning }}%</span>
            </div>
          </div>
        </div>

        <!-- Acquisition Source - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-xs text-[#000]">Paid</span>
            <span class="text-xs text-[#000]">Unpaid</span>
          </div>
          <div
            class="relative w-full h-7 rounded"
            :style="{ backgroundColor: chartColors.background }"
          >
            <!-- Paid (foncé) -->
            <div
              class="absolute left-0 top-0 h-full rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{
                width: acquisitionSource.paid + '%',
                backgroundColor: chartColors.primary,
              }"
            >
              <span v-if="acquisitionSource.paid > 10">{{ acquisitionSource.paid }}%</span>
            </div>
            <!-- Unpaid (clair) -->
            <div
              class="absolute right-0 top-0 h-full rounded-r flex items-center justify-end pr-6 font-semibold text-xs tracking-wide"
              :style="{
                width: acquisitionSource.organic + '%',
                backgroundColor: chartColors.secondary,
                color: chartColors.tertiary,
              }"
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
import { getChartColors } from '@/config/theme'

const { filteredData } = useTrafficMetrics()
const chartColors = computed(() => getChartColors('traffic'))

// Calculer les distributions depuis les données Supabase selon les spécifications
const deviceDistribution = computed(() => {



  if (!filteredData.value.length) {

    return { desktop: 0, mobile: 0 }
  }

  // Utiliser les données all_devices si disponibles, sinon compter par device
  const hasAllDevices = filteredData.value.some(
    (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
  )

  if (hasAllDevices) {
    // Utiliser mobile_share des lignes all_devices
    const values = filteredData.value
      .filter(
        (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
      )
      .map((item: Record<string, unknown>) => Number(item.mobile_share))
      .filter((v: number) => !isNaN(v))

    const avgMobileShare =
      values.length > 0 ? values.reduce((s: number, v: number) => s + v, 0) / values.length : 0

    const result = {
      mobile: Math.round(avgMobileShare * 100), // Convertir ratio en %
      desktop: Math.round((1 - avgMobileShare) * 100),
    }

    return result
  }

  // Fallback: compter par device (codes 1/2)
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

const visitorType = computed(() => {


  if (!filteredData.value.length) {

    return { new: 0, returning: 0 }
  }

  // Utiliser les données all_devices si disponibles
  const hasAllDevices = filteredData.value.some(
    (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
  )

  if (hasAllDevices) {
    // Utiliser new_visitor_rate et returning_visitor_rate des lignes all_devices
    const newVisitorValues = filteredData.value
      .filter(
        (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
      )
      .map((item: Record<string, unknown>) => Number(item.new_visitor_rate))
      .filter((v: number) => !isNaN(v))

    const returningVisitorValues = filteredData.value
      .filter(
        (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
      )
      .map((item: Record<string, unknown>) => Number(item.returning_visitor_rate))
      .filter((v: number) => !isNaN(v))

    const avgNew =
      newVisitorValues.length > 0
        ? newVisitorValues.reduce((s: number, v: number) => s + v, 0) / newVisitorValues.length
        : 0
    const avgReturning =
      returningVisitorValues.length > 0
        ? returningVisitorValues.reduce((s: number, v: number) => s + v, 0) /
          returningVisitorValues.length
        : 0

    const result = {
      new: Math.round(avgNew * 100), // Convertir ratio en %
      returning: Math.round(avgReturning * 100),
    }

    return result
  }

  // Fallback: moyenne sur toutes les données
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

  const result = {
    new: Math.round(avgNewVisitorRate * 100), // Convertir ratio en %
    returning: Math.round(avgReturningVisitorRate * 100),
  }

  return result
})

const acquisitionSource = computed(() => {


  if (!filteredData.value.length) {

    return { paid: 0, organic: 0 }
  }

  // Utiliser les données all_devices si disponibles
  const hasAllDevices = filteredData.value.some(
    (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
  )

  if (hasAllDevices) {
    // Utiliser paid_traffic_share des lignes all_devices
    const paidValues = filteredData.value
      .filter(
        (item: Record<string, unknown>) => String(item.device).toLowerCase() === 'all_devices',
      )
      .map((item: Record<string, unknown>) => Number(item.paid_traffic_share))
      .filter((v: number) => !isNaN(v))

    const avgPaid =
      paidValues.length > 0
        ? paidValues.reduce((s: number, v: number) => s + v, 0) / paidValues.length
        : 0

    const result = {
      paid: Math.round(avgPaid * 100), // Convertir ratio en %
      organic: Math.round((1 - avgPaid) * 100),
    }

    return result
  }

  // Fallback: moyenne sur toutes les données
  const avgPaidTrafficShare =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.paid_traffic_share) || 0),
      0,
    ) / filteredData.value.length

  const result = {
    paid: Math.round(avgPaidTrafficShare * 100), // Convertir ratio en %
    organic: Math.round((1 - avgPaidTrafficShare) * 100),
  }

  return result
})
</script>
