<template>
  <div class="mb-12">
    <div class="flex flex-col md:flex-row mt-4">
      <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#ECEDEF]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Overall Conversion</div>
        </div>
        <div
          class="flex flex-row items-center justify-start gap-4 border-b border-[#ECEDEF] pb-4 w-full"
        >
          <div class="h-2 w-8 rounded bg-[#626B76]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Desktop Conversion</div>
        </div>
        <div class="flex flex-row items-center justify-start gap-4">
          <div class="h-2 w-8 rounded bg-[#32373A]"></div>
          <div class="text-[#000000] font-newedge pt-1 font-medium">Mobile Conversion</div>
        </div>
      </div>
      <div
        class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#ECEDEF] flex flex-col justify-between"
      >
        <div class="flex-1 flex w-full">
          <div class="flex-1 flex flex-col items-center justify-between">
            <LineChart
              :data="conversionChartData"
              labelColor="#ECEDEF"
              gridColor="#EEEFF1"
              :yMin="0"
              :yMax="8"
              :yTickSuffix="'%'"
              :yStep="1"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'

const baseCurves = {
  byDevice: [180, 60, 120, 80, 200, 140, 100],
  newReturning: [200, 100, 120, 40, 120, 80, 160],
  paidUnpaid: [120, 220, 80, 110, 120, 160, 90],
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

const conversionChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Overall Conversion',
      data: curves.value.byDevice.map((y) => Math.max(1, Math.min(8, 4.5 - y / 50))),
      borderColor: '#ECEDEF',
      backgroundColor: '#ECEDEF',
      tension: 0.4,
    },
    {
      label: 'Desktop Conversion',
      data: curves.value.newReturning.map((y) => Math.max(1, Math.min(8, 5.2 - y / 50))),
      borderColor: '#626B76',
      backgroundColor: '#626B76',
      tension: 0.4,
    },
    {
      label: 'Mobile Conversion',
      data: curves.value.paidUnpaid.map((y) => Math.max(1, Math.min(8, 3.8 - y / 50))),
      borderColor: '#32373A',
      backgroundColor: '#32373A',
      tension: 0.4,
    },
  ],
}))

defineExpose({
  randomizeCurves,
})
</script>
