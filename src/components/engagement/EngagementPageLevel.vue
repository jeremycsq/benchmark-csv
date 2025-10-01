<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
      >
        <div class="text-[#000] font-newedge pt-1 font-medium">Page Type</div>
      </div>
    </div>
    <div
      class="w-full bg-white rounded-xl shadow-sm p-4 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col gap-8 justify-center"
    >
      <div>
        <table class="min-w-full text-center">
          <thead>
            <tr class="text-[#222] text-base">
              <th class="py-2 px-2 text-left text-[#6D9A7A] text-xs">Page Type</th>
              <th class="py-2 px-2 text-[#6D9A7A] text-xs">Landing Rate</th>
              <th class="py-2 px-2 text-[#6D9A7A] text-xs">Bounce Rate</th>
              <th class="py-2 px-2 text-[#6D9A7A] text-xs">Exit Rate</th>
              <th class="py-2 px-2 text-[#6D9A7A] text-xs">Activity Rate</th>
              <th class="py-2 px-2 text-[#6D9A7A] text-xs">PV Share</th>
            </tr>
          </thead>
          <tbody class="text-[#2E614F] text-lg">
            <tr>
              <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                <span class="mr-2">🏠</span>Homepage
              </td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.landingRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.bounceRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.exitRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.activityRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.pvShare }}%</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                <span class="mr-2">📁</span>Category Page
              </td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.landingRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.bounceRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.exitRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.activityRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.pvShare }}%</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                <span class="mr-2">📦</span>Product Page
              </td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.landingRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.bounceRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.exitRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.activityRate }}%</td>
              <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.pvShare }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Valeurs dynamiques pour le tableau Page Level Benchmark
const benchmarkTableData = ref({
  homepage: {
    landingRate: 19.2,
    bounceRate: 22.7,
    exitRate: 5.5,
    activityRate: 10.3,
    pvShare: 7.4,
  },
  category: {
    landingRate: 2.6,
    bounceRate: 61.7,
    exitRate: 2.0,
    activityRate: 7.6,
    pvShare: 7.6,
  },
  product: {
    landingRate: 9.9,
    bounceRate: 62.7,
    exitRate: 8.7,
    activityRate: 13.4,
    pvShare: 1.9,
  },
})

function randomizeBenchmarkTable() {
  function rand(min: number, max: number, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals)
  }
  benchmarkTableData.value = {
    homepage: {
      landingRate: rand(15, 25),
      bounceRate: rand(15, 30),
      exitRate: rand(3, 8),
      activityRate: rand(8, 15),
      pvShare: rand(5, 10),
    },
    category: {
      landingRate: rand(1, 5),
      bounceRate: rand(55, 70),
      exitRate: rand(1, 4),
      activityRate: rand(5, 10),
      pvShare: rand(5, 10),
    },
    product: {
      landingRate: rand(7, 13),
      bounceRate: rand(55, 70),
      exitRate: rand(7, 12),
      activityRate: rand(10, 16),
      pvShare: rand(1, 4),
    },
  }
}

// Expose la fonction pour que le parent puisse l'appeler
defineExpose({
  randomizeBenchmarkTable,
})
</script>
