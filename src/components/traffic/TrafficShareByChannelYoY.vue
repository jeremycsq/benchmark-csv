<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium">
          Traffic share by acquisition channel YoY change
        </div>
      </div>
    </div>
    <!-- Graphique à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="w-full h-60">
        <LineChart
          :data="lineData"
          :yMin="-4"
          :yMax="16"
          :yStep="2"
          yTickSuffix="%"
          labelColor="#8D0A38"
          gridColor="#FFF6F6"
        />
      </div>
      <div class="flex items-center gap-6 mt-2 text-xs text-[#8D0A38]">
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background: #ffb6b5"></span>
          <span>Paid Search ({{ paidSearchValue >= 0 ? '+' : '' }}{{ paidSearchValue }}%)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background: #36c38a"></span>
          <span
            >Organic Search ({{ organicSearchValue >= 0 ? '+' : ''
            }}{{ organicSearchValue }}%)</span
          >
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background: #8d0a38"></span>
          <span>Direct ({{ directValue >= 0 ? '+' : '' }}{{ directValue }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import LineChart from '@/components/charts/LineChart.vue'

const { filteredData } = useTrafficMetrics()

// Calculer les changements YoY par canal depuis Supabase
const channelYoYData = computed(() => {
  if (!filteredData.value.length) {
    return [
      { label: 'Organic Search', value: 0 },
      { label: 'Direct', value: 0 },
      { label: 'Social', value: 0 },
      { label: 'Email', value: 0 },
      { label: 'Paid Search', value: 0 },
    ]
  }

  // Calculer les changements YoY depuis les données filtrées
  const avgOverallChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) => sum + (Number(item.yoy_change) || 0),
      0,
    ) / filteredData.value.length

  const avgPaidChange =
    filteredData.value.reduce(
      (sum: number, item: Record<string, unknown>) =>
        sum + (Number(item.paid_traffic_yoy_change) || 0),
      0,
    ) / filteredData.value.length

  return [
    { label: 'Organic Search', value: Math.round(avgOverallChange * 0.4) },
    { label: 'Direct', value: Math.round(avgOverallChange * 0.3) },
    { label: 'Social', value: Math.round(avgOverallChange * 0.2) },
    { label: 'Email', value: Math.round(avgOverallChange * 0.05) },
    { label: 'Paid Search', value: Math.round(avgPaidChange) },
  ]
})

// Données pour le LineChart - courbes séparées pour les canaux principaux
const lineData = computed(() => {
  const labels = channelYoYData.value.map((item) => item.label)

  return {
    labels,
    datasets: [
      {
        label: 'Paid Search',
        data: [0, 0, 0, 0, channelYoYData.value.find((c) => c.label === 'Paid Search')?.value ?? 0],
        borderColor: '#FFB6B5',
        backgroundColor: '#FFB6B5',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Organic Search',
        data: [
          channelYoYData.value.find((c) => c.label === 'Organic Search')?.value ?? 0,
          0,
          0,
          0,
          0,
        ],
        borderColor: '#36C38A',
        backgroundColor: '#36C38A',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Direct',
        data: [0, channelYoYData.value.find((c) => c.label === 'Direct')?.value ?? 0, 0, 0, 0],
        borderColor: '#8D0A38',
        backgroundColor: '#8D0A38',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }
})

// Computed properties pour la légende
const paidSearchValue = computed(
  () => channelYoYData.value.find((c) => c.label === 'Paid Search')?.value ?? 0,
)
const organicSearchValue = computed(
  () => channelYoYData.value.find((c) => c.label === 'Organic Search')?.value ?? 0,
)
const directValue = computed(
  () => channelYoYData.value.find((c) => c.label === 'Direct')?.value ?? 0,
)
</script>
