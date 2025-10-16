<template>
  <div
    class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#ECEDEF] flex flex-col gap-8 justify-center"
  >
    <HorizontalBarChart
      :data="horizontalBarChartData"
      paidColor="#119DBC"
      unpaidColor="#B2E6FA"
      bgColor="#E5F1F6"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HorizontalBarChart from '@/components/charts/HorizontalBarChart.vue'

const horizontalBarChartData = ref([
  { label: 'Email', value: 4.24, type: 'UNPAID' as const },
  { label: 'Paid Search', value: 3.89, type: 'PAID' as const },
  { label: 'Direct', value: 3.15, type: 'UNPAID' as const },
  { label: 'Paid Social', value: 2.78, type: 'PAID' as const },
  { label: 'Organic Search', value: 2.45, type: 'UNPAID' as const },
  { label: 'Display', value: 1.92, type: 'PAID' as const },
  { label: 'Retargeting', value: 1.67, type: 'PAID' as const },
  { label: 'Referral', value: 1.23, type: 'UNPAID' as const },
] as { label: string; value: number; type: 'PAID' | 'UNPAID' }[])

function randomizeHorizontalBarChartData() {
  function randomFloat(min: number, max: number, decimals = 2) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  horizontalBarChartData.value = [
    { label: 'Email', value: randomFloat(20, 85), type: 'UNPAID' as const },
    { label: 'Paid Search', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Direct', value: randomFloat(20, 85), type: 'UNPAID' as const },
    { label: 'Paid Social', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Organic Search', value: randomFloat(20, 85), type: 'UNPAID' as const },
    { label: 'Display', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Retargeting', value: randomFloat(20, 85), type: 'PAID' as const },
    { label: 'Referral', value: randomFloat(20, 85), type: 'UNPAID' as const },
  ]
}

defineExpose({ randomizeHorizontalBarChartData })
</script>
