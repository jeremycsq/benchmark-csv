<template>
  <div
    class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#ECEDEF] flex flex-col gap-8 justify-center"
  >
    <div class="flex flex-col items-center w-full mt-12">
      <PieChart
        :values="paidUnpaidPie"
        :labels="['Paid Conversion', 'Unpaid Conversion']"
        :colors="['#626B76', '#ECEDEF']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'

const paidUnpaidPie = ref([32.3, 67.7])

function randomizePaidUnpaidPie() {
  const paid = +(Math.random() * 40 + 20).toFixed(1)
  const unpaid = +(100 - paid).toFixed(1)
  paidUnpaidPie.value = [paid, unpaid]
}

defineExpose({ randomizePaidUnpaidPie })
</script>
