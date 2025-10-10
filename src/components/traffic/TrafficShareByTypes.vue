<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge rounded font-medium" style="border-radius: 4px">Device split</div>
      </div>
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">Visitor split</div>
      </div>
      <div class="flex flex-row items-center justify-start gap-4">
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          Acquisition channel split
        </div>
      </div>
    </div>
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="space-y-8">
        <!-- Device Distribution - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#000]">Mobile</span>
            <span class="text-xs text-[#000]">Desktop</span>
          </div>
          <div class="relative w-full h-7 bg-[#FFF6F6] rounded">
            <!-- Mobile (vert clair) -->
            <div
              class="absolute left-0 top-0 h-full bg-[#8D0A38] rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{ width: deviceDistribution.mobile + '%' }"
            >
              <span v-if="deviceDistribution.mobile > 10">{{ deviceDistribution.mobile }}%</span>
            </div>

            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-end pr-6 text-[#8D0A38] font-semibold text-xs tracking-wide"
              :style="{ width: deviceDistribution.desktop + '%' }"
            >
              <span v-if="deviceDistribution.desktop > 10">{{ deviceDistribution.desktop }}%</span>
            </div>
          </div>
        </div>

        <!-- Visitor Type - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#000]">New</span>
            <span class="text-xs text-[#000]">Returning</span>
          </div>
          <div class="relative w-full h-7 bg-[#FFF6F6] rounded">
            <div
              class="absolute left-0 top-0 h-full bg-[#8D0A38] rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{ width: visitorType.new + '%' }"
            >
              <span v-if="visitorType.new > 10">{{ visitorType.new }}%</span>
            </div>
            <!-- Returning (vert foncé) -->
            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-end pr-6 text-[#8D0A38] font-semibold text-xs tracking-wide"
              :style="{ width: visitorType.returning + '%' }"
            >
              <span v-if="visitorType.returning > 10">{{ visitorType.returning }}%</span>
            </div>
          </div>
        </div>

        <!-- Acquisition Source - Barre empilée -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm text-[#FFF6F6]">
            <span class="text-xs text-[#000]">Paid</span>
            <span class="text-xs text-[#000]">Unpaid</span>
          </div>
          <div class="relative w-full h-7 bg-[#FFF6F6] rounded">
            <!-- Paid (vert clair) -->
            <div
              class="absolute left-0 top-0 h-full bg-[#8D0A38] rounded-l flex items-center justify-start pl-6 text-white font-semibold text-xs tracking-wide"
              :style="{ width: acquisitionSource.paid + '%' }"
            >
              <span v-if="acquisitionSource.paid > 10">{{ acquisitionSource.paid }}%</span>
            </div>
            <!-- Unpaid (vert foncé) -->
            <div
              class="absolute right-0 top-0 h-full bg-[#FFB6B5] rounded-r flex items-center justify-end pr-6 text-[#8D0A38] font-semibold text-xs tracking-wide"
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
  console.log('🔄 TrafficShareByTypes - deviceDistribution recalculé')
  console.log('TrafficShareByTypes - filteredData.value.length:', filteredData.value.length)

  if (!filteredData.value.length) {
    console.log('TrafficShareByTypes - Pas de données filtrées')
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
    console.log('✅ TrafficShareByTypes - deviceDistribution (all_devices):', result)
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
  console.log('✅ TrafficShareByTypes - deviceDistribution (comptage):', result)
  return result
})

const visitorType = computed(() => {
  console.log('🔄 TrafficShareByTypes - visitorType recalculé')

  if (!filteredData.value.length) {
    console.log('TrafficShareByTypes - Pas de données pour visitorType')
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
    console.log('✅ TrafficShareByTypes - visitorType (all_devices):', result)
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
  console.log('✅ TrafficShareByTypes - visitorType (moyenne):', result)
  return result
})

const acquisitionSource = computed(() => {
  console.log('🔄 TrafficShareByTypes - acquisitionSource recalculé')

  if (!filteredData.value.length) {
    console.log('TrafficShareByTypes - Pas de données pour acquisitionSource')
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
    console.log('✅ TrafficShareByTypes - acquisitionSource (all_devices):', result)
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
  console.log('✅ TrafficShareByTypes - acquisitionSource (moyenne):', result)
  return result
})
</script>
