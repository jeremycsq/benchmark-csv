<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up mb-12">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FEF3E2] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Frustration</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#FEF3E2] flex flex-col gap-10 justify-center pt-16 pb-12"
    >
      <div class="flex flex-row gap-8">
        <MiniBarChart
          v-for="(item, idx) in barData"
          :key="'frustration-bar-' + String(idx)"
          :values="item.values"
          :colors="config.labelColors"
          :label="item.label"
          :display="item.display"
          labelColor="#FED7AA"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'

const globalFilters = useGlobalFiltersStore()
const config = {
  labelColors: ['#FED7AA', '#EB6909', '#FF8A00'] as [string, string, string],
}

// Génération des données randomisées pour les benchmarks
function randomFloat(min: number, max: number, decimals = 2) {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}

const barData = ref([
  {
    label: 'Frustration Score',
    values: [randomFloat(35, 45), randomFloat(45, 55), randomFloat(55, 65)] as [
      number,
      number,
      number,
    ],
    display: (val: number) => Math.round(val).toString(),
  },
  {
    label: 'Load Time Frustration',
    values: [randomFloat(0.8, 1.2), randomFloat(1.2, 1.8), randomFloat(1.8, 2.5)] as [
      number,
      number,
      number,
    ],
    display: (val: number) => val.toFixed(1) + 's',
  },
  {
    label: 'JS Error Rate',
    values: [randomFloat(0.5, 1.5), randomFloat(1.5, 2.5), randomFloat(2.5, 4.0)] as [
      number,
      number,
      number,
    ],
    display: (val: number) => val.toFixed(1) + '%',
  },
])

function randomizeBarData() {
  barData.value = [
    {
      label: 'Frustration Score',
      values: [randomFloat(35, 45), randomFloat(45, 55), randomFloat(55, 65)] as [
        number,
        number,
        number,
      ],
      display: (val: number) => Math.round(val).toString(),
    },
    {
      label: 'Load Time Frustration',
      values: [randomFloat(0.8, 1.2), randomFloat(1.2, 1.8), randomFloat(1.8, 2.5)] as [
        number,
        number,
        number,
      ],
      display: (val: number) => val.toFixed(1) + 's',
    },
    {
      label: 'JS Error Rate',
      values: [randomFloat(0.5, 1.5), randomFloat(1.5, 2.5), randomFloat(2.5, 4.0)] as [
        number,
        number,
        number,
      ],
      display: (val: number) => val.toFixed(1) + '%',
    },
  ]
}

// Surveiller les changements de filtres
watch(
  [
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedIndustry,
  ],
  () => {
    randomizeBarData()
  },
  { immediate: true },
)

// Exposer la fonction pour refresh manuel
defineExpose({
  updateBarData: randomizeBarData,
})
</script>
