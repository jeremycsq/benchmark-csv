<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium" style="border-radius: 4px">
          Top acquisition channels (YoY change)
        </div>
      </div>
    </div>

    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <PieChart :values="pieValues" :labels="pieLabels" :colors="pieColors" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import PieChart from '@/components/charts/PieChart.vue'

const { acquisitionMetrics } = useTrafficMetrics()

const acquisitionData = computed(() => {
  if (!acquisitionMetrics.value || acquisitionMetrics.value.length === 0) {
    return [
      { label: 'Organic', value: 40 },
      { label: 'Direct', value: 30 },
      { label: 'Social', value: 15 },
      { label: 'Email', value: 5 },
      { label: 'Paid', value: 10 },
    ]
  }
  const vals = acquisitionMetrics.value.map((d) => Math.max(0, Number(d.value)))
  const total = vals.reduce((a, b) => a + b, 0) || 1
  return acquisitionMetrics.value.map((d, i) => ({
    label: d.label,
    value: +((vals[i] / total) * 100).toFixed(1),
  }))
})

const pieLabels = computed(() =>
  acquisitionData.value.map((d) => {
    const l = String(d.label).toLowerCase()
    if (l.includes('organic')) return 'Organic'
    if (l.includes('paid')) return 'Paid'
    return d.label
  }),
)
const pieValues = computed(() => acquisitionData.value.map((d) => d.value))
const pieColors = ['#E3404E', '#540127', '#71002F', '#8D0A38', '#AA1B40']
</script>
