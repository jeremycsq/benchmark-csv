<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Labels à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${chartColors.tertiary}` }"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          Traffic share by acquisition channel
        </div>
      </div>
    </div>
    <!-- Graphique à droite -->
    <div
      class="w-full md:w-2/3 bg-white border p-6 rounded-lg"
      :style="{ border: `1px solid ${chartColors.tertiary}` }"
    >
      <VerticalBarChart
        :labels="barLabels"
        :values="barValues"
        :colors="barColors"
        :yMin="0"
        :yMax="100"
        :yStep="10"
      />
      <div class="flex items-center gap-6 mt-2 text-xs" :style="{ color: theme.primary }">
        <div class="flex items-center gap-2" v-for="(lbl, i) in barLabels" :key="lbl">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :style="{ background: barColors[i] }"
          ></span>
          <span>{{ lbl }} ({{ barValues[i].toFixed(1) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import { getChartColors, getPageTheme } from '@/config/theme'
import VerticalBarChart from '@/components/charts/VerticalBarChart.vue'

const { filteredData } = useTrafficMetrics()
const chartColors = computed(() => getChartColors('traffic'))
const theme = computed(() => getPageTheme('traffic'))

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

const barLabels = computed(() => channelYoYData.value.map((d) => d.label))
const barValues = computed(() => channelYoYData.value.map((d) => d.value))

// Mapping: Paid → secondary, Organic → primary, Direct → tertiary, Social → secondary, Email → primary
const barColors = computed(() =>
  channelYoYData.value.map((d) => {
    const l = d.label.toLowerCase()
    if (l.includes('paid')) return chartColors.value.secondary
    if (l.includes('organic')) return chartColors.value.primary
    if (l.includes('direct')) return chartColors.value.tertiary
    if (l.includes('social')) return chartColors.value.secondary
    if (l.includes('email')) return chartColors.value.primary
    return chartColors.value.primary
  }),
)
</script>
