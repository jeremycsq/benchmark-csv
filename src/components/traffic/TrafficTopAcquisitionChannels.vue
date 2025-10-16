<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b pb-4 w-full"
        :style="{ borderBottom: `1px solid ${chartColors.tertiary}` }"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          By major acquisition source
        </div>
      </div>
    </div>

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
        externalLabels
        xTickClass="text-xs font-semibold font-sans"
        yTickClass="text-xs font-semibold font-sans"
        dataLabelClass="text-sm font-bold font-sans"
        dataLabelColor="#FFF"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import { getChartColors } from '@/config/theme'
import VerticalBarChart from '@/components/charts/VerticalBarChart.vue'

const { acquisitionMetrics } = useTrafficMetrics()
const chartColors = computed(() => getChartColors('traffic'))

const acquisitionData = computed(() => {
  if (!acquisitionMetrics.value || acquisitionMetrics.value.length === 0) {
    return [
      { label: 'Unpaid', value: 40 },
      { label: 'Direct', value: 30 },
      { label: 'Social', value: 15 },
      { label: 'Email', value: 5 },
      { label: 'Paid', value: 10 },
    ]
  }
  const vals = acquisitionMetrics.value.map((d) => Math.max(0, Number(d.value)))
  const total = vals.reduce((a, b) => a + b, 0) || 1
  return acquisitionMetrics.value.map((d, i) => ({
    label: String(d.label).toLowerCase().includes('organic') ? 'Unpaid' : d.label,
    value: +((vals[i] / total) * 100).toFixed(1),
  }))
})

// Labels et valeurs pour le bar chart vertical
const barLabels = computed(() => acquisitionData.value.map((d) => d.label))
const barValues = computed(() => acquisitionData.value.map((d) => d.value))

// Couleurs issues du thème traffic (toutes primaires)
const barColors = computed(() => barLabels.value.map(() => chartColors.value.primary))
</script>
