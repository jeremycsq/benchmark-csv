<template>
  <div class="mb-8 reveal-up">
    <div class="flex flex-col md:flex-row mt-4">
      <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#C1E3B1]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Pageviews Per Session</div>
        </div>
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Time Per Session</div>
        </div>
        <div class="flex flex-row items-center justify-start gap-4">
          <div class="h-2 w-8 rounded bg-[#2E614F]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Scroll Rate</div>
        </div>
      </div>
      <div
        class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-between"
      >
        <div class="flex-1 flex w-full">
          <div class="flex-1 flex flex-col items-center justify-between">
            <LineChart
              :data="engagementChartData"
              labelColor="#ADD2A5"
              gridColor="#E9F5E4"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { LineChart } from '@/components/charts'

// Données dynamiques pour le graphique Engagement
const baseCurves = {
  byDevice: [180, 60, 120, 80, 200],
  newReturning: [200, 100, 120, 40, 120],
  paidUnpaid: [120, 220, 80, 110, 120, 160],
}

const curves = ref({
  byDevice: [...baseCurves.byDevice],
  newReturning: [...baseCurves.newReturning],
  paidUnpaid: [...baseCurves.paidUnpaid],
})

function randomizeCurves() {
  curves.value.byDevice = baseCurves.byDevice.map((y) => y + Math.floor(Math.random() * 21) - 10)
  curves.value.newReturning = baseCurves.newReturning.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
  curves.value.paidUnpaid = baseCurves.paidUnpaid.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
}

const engagementChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Pageviews Per Visit',
      data: curves.value.byDevice.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#C1E3B1',
      backgroundColor: '#C1E3B1',
      tension: 0.4,
    },
    {
      label: 'Time Per Session',
      data: curves.value.newReturning.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#2E614F',
      backgroundColor: '#2E614F',
      tension: 0.4,
    },
    {
      label: 'Scroll Rate',
      data: curves.value.paidUnpaid.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#6D9A7A',
      backgroundColor: '#6D9A7A',
      tension: 0.4,
    },
  ],
}))

watch([], randomizeCurves, { immediate: true })

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  randomizeCurves,
})
</script>
