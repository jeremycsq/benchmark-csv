<template>
  <div class="min-h-screen">
    <transition name="fade-scale" mode="out-in">
      <DataOverview
        pageType="engagement"
        :engagementStore="engagementStore"
        class="reveal-up reveal-fade"
        :key="$route.path"
      />
    </transition>

    <!-- Engagement Section avec fond violet très clair -->
    <section class="bg-[#FAF7FB] reveal-up">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#A259D9]">Engagement</h3>
            <span class="text-gray-600 font-normal pt-1"
              >Compare your metrics to specific peers in the engagement category</span
            >
          </div>
          <div class="flex items-center gap-4">
            <span class="bg-[#A259D9] text-white px-3 py-1 rounded-full text-sm font-semibold"
              >{{ headerText }}
            </span>
            <span class="text-3xl font-newedge text-[#000]">{{ headerValue }}%</span>
          </div>
        </div>
        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Overview</span
        >
        <div class="mb-8 reveal-up">
          <div class="flex flex-col md:flex-row mt-4">
            <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#E5D0F6]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">
                  Pageviews Per Session
                </div>
              </div>
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#A259D9]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">Time Per Session</div>
              </div>
              <div class="flex flex-row items-center justify-start gap-4">
                <div class="h-2 w-8 rounded bg-[#7C3AED]"></div>
                <div class="text-[#000000] font-newedge pt-1 font-medium">Scroll Rate</div>
              </div>
            </div>
            <div
              class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#F9EDFA] flex flex-col justify-between"
            >
              <div class="flex-1 flex w-full">
                <div class="flex-1 flex flex-col items-center justify-between">
                  <LineChart
                    :data="engagementChartData"
                    labelColor="#B9A7C7"
                    gridColor="#FBF6FC"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Benchmark Bloc -->
        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
          >Benchmark</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up mb-4">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Engagement</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-10 md:mt-0 border border-[#F9EDFA] flex flex-col gap-10 justify-center pt-16 pb-12"
          >
            <div class="flex flex-row gap-8">
              <MiniBarChart
                v-for="(item, idx) in barData"
                :key="'engagement-bar-' + String(idx)"
                :values="item.values"
                :colors="config.labelColors"
                :label="item.label"
                :display="item.display"
              />
            </div>
          </div>
        </div>

        <!-- Radial Benchmark Chart Section -->
        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Time spent per Session</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Time spent per Session</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm h-auto md:w-2/3 md:mt-0 border border-[#F9EDFA] flex flex-row justify-center pt-8 pb-8"
          >
            <div v-if="radialData && radialData.overall" class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000]">Overall</span>
              <RadialChart
                :values="radialData.overall.values"
                :colors="radialData.overall.colors"
                height="120px"
              />
              <div class="flex flex-col justify-center gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.overall.colors[0] }"
                  />
                  <span class="text-xs text-[#000]"
                    >25th : {{ formatTime(radialData.overall.values[0]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.overall.colors[1] }"
                  />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ formatTime(radialData.overall.values[1]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.overall.colors[2] }"
                  />
                  <span class="text-xs text-[#000]"
                    >75th : {{ formatTime(radialData.overall.values[2]) }}</span
                  >
                </div>
              </div>
            </div>
            <div
              v-if="radialData && radialData.newVisitors"
              class="flex-1 flex flex-col items-center"
            >
              <span class="text-xs text-[#000]">New Visitors</span>
              <RadialChart
                :values="radialData.newVisitors.values"
                :colors="radialData.newVisitors.colors"
                height="120px"
              />
              <div class="flex flex-col gap-2 justify-center">
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.newVisitors.colors[0] }"
                  />
                  <span class="text-xs text-[#000]"
                    >25th : {{ formatTime(radialData.newVisitors.values[0]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.newVisitors.colors[1] }"
                  />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ formatTime(radialData.newVisitors.values[1]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.newVisitors.colors[2] }"
                  />
                  <span class="text-xs text-[#000]"
                    >75th : {{ formatTime(radialData.newVisitors.values[2]) }}</span
                  >
                </div>
              </div>
            </div>
            <div
              v-if="radialData && radialData.returningVisitors"
              class="flex-1 flex flex-col items-center"
            >
              <span class="text-xs text-[#000]">Returning Visitors</span>
              <RadialChart
                :values="radialData.returningVisitors.values"
                :colors="radialData.returningVisitors.colors"
                height="120px"
              />
              <div class="flex flex-col gap-2 justify-center">
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.returningVisitors.colors[0] }"
                  />
                  <span class="text-xs text-[#000]"
                    >25th : {{ formatTime(radialData.returningVisitors.values[0]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.returningVisitors.colors[1] }"
                  />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ formatTime(radialData.returningVisitors.values[1]) }}</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded-full"
                    :style="{ background: radialData.returningVisitors.colors[2] }"
                  />
                  <span class="text-xs text-[#000]"
                    >75th : {{ formatTime(radialData.returningVisitors.values[2]) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stacked Bar Benchmark Chart Section -->
        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Scroll Rate Benchmark</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Scroll Rate</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm h-auto md:w-2/3 md:mt-0 border border-[#F9EDFA] flex flex-row justify-center pt-8 pb-8"
          >
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000]">Overall</span>
              <StackedBarChart
                :values="stackedBarData.overall"
                :colors="['#E5D0F6', '#A259D9', '#7C3AED']"
                :labels="['25th', 'Benchmark', '75th']"
                units="%"
              />
              <div class="flex flex-col justify-center gap-2 mt-2">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#E5D0F6' }" />
                  <span class="text-xs text-[#000]">25th : {{ stackedBarData.overall[0] }}%</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#A259D9' }" />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ stackedBarData.overall[1] }}%</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#7C3AED' }" />
                  <span class="text-xs text-[#000]">75th : {{ stackedBarData.overall[2] }}%</span>
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000]">New Visitors</span>
              <StackedBarChart
                :values="stackedBarData.newVisitors"
                :colors="['#E5D0F6', '#A259D9', '#7C3AED']"
                :labels="['25th', 'Benchmark', '75th']"
                units="%"
              />
              <div class="flex flex-col justify-center gap-2 mt-2">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#E5D0F6' }" />
                  <span class="text-xs text-[#000]"
                    >25th : {{ stackedBarData.newVisitors[0] }}%</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#A259D9' }" />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ stackedBarData.newVisitors[1] }}%</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#7C3AED' }" />
                  <span class="text-xs text-[#000]"
                    >75th : {{ stackedBarData.newVisitors[2] }}%</span
                  >
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000]">Returning Visitors</span>
              <StackedBarChart
                :values="stackedBarData.returningVisitors"
                :colors="['#E5D0F6', '#A259D9', '#7C3AED']"
                :labels="['25th', 'Benchmark', '75th']"
                units="%"
              />
              <div class="flex flex-col justify-center gap-2 mt-2">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#E5D0F6' }" />
                  <span class="text-xs text-[#000]"
                    >25th : {{ stackedBarData.returningVisitors[0] }}%</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#A259D9' }" />
                  <span class="text-xs text-[#000]"
                    >Benchmark : {{ stackedBarData.returningVisitors[1] }}%</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full" :style="{ background: '#7C3AED' }" />
                  <span class="text-xs text-[#000]"
                    >75th : {{ stackedBarData.returningVisitors[2] }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4 mb-2"
          >Activity Rate Benchmark</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Activity Rate</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm h-auto md:w-2/3 md:mt-0 border border-[#F9EDFA] flex flex-row justify-center pt-8 pb-8"
          >
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000] mb-4">Overall</span>
              <PieChart :values="pieData.overall" :labels="pieLabels" />
            </div>
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000] mb-4">New Visitors</span>
              <PieChart :values="pieData.newVisitors" :labels="pieLabels" />
            </div>
            <div class="flex-1 flex flex-col items-center">
              <span class="text-xs text-[#000] mb-4">Returning Visitors</span>
              <PieChart :values="pieData.returningVisitors" :labels="pieLabels" />
            </div>
          </div>
        </div>

        <!-- Page Level Benchmark Section -->
        <span
          class="bg-[#E5D0F6] text-[#A259D9] px-2 py-1 rounded-xl text-sm font-semibold inline-block mt-4"
          >Page Level Benchmark</span
        >
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#F9EDFA] pb-4 w-full"
            >
              <div class="text-[#000] font-newedge pt-1 font-medium">Page Type</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-4 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#F9EDFA] flex flex-col gap-8 justify-center"
          >
            <div>
              <table class="min-w-full text-center">
                <thead>
                  <tr class="text-[#222] text-base">
                    <th class="py-2 px-2 text-left text-[#B9A7C7] text-xs">Page Type</th>
                    <th class="py-2 px-2 text-[#B9A7C7] text-xs">Landing Rate</th>
                    <th class="py-2 px-2 text-[#B9A7C7] text-xs">Bounce Rate</th>
                    <th class="py-2 px-2 text-[#B9A7C7] text-xs">Exit Rate</th>
                    <th class="py-2 px-2 text-[#B9A7C7] text-xs">Activity Rate</th>
                    <th class="py-2 px-2 text-[#B9A7C7] text-xs">PV Share</th>
                  </tr>
                </thead>
                <tbody class="text-[#222] text-lg">
                  <tr>
                    <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                      <span class="mr-2">🏠</span>Homepage
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {{ benchmarkTableData.homepage.landingRate }}%
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.bounceRate }}%</td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.exitRate }}%</td>
                    <td class="py-3 px-4 text-sm">
                      {{ benchmarkTableData.homepage.activityRate }}%
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.homepage.pvShare }}%</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                      <span class="mr-2">📁</span>Category Page
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {{ benchmarkTableData.category.landingRate }}%
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.bounceRate }}%</td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.exitRate }}%</td>
                    <td class="py-3 px-4 text-sm">
                      {{ benchmarkTableData.category.activityRate }}%
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.category.pvShare }}%</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4 text-left text-sm rounded-l-2xl">
                      <span class="mr-2">📦</span>Product Page
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.landingRate }}%</td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.bounceRate }}%</td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.exitRate }}%</td>
                    <td class="py-3 px-4 text-sm">
                      {{ benchmarkTableData.product.activityRate }}%
                    </td>
                    <td class="py-3 px-4 text-sm">{{ benchmarkTableData.product.pvShare }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DataOverview from '@/components/DataOverview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { ref, computed, watch, reactive } from 'vue'
import { LineChart } from '@/components/charts'
import { useEngagementDataStore } from '@/stores/engagementData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { getBarChartConfig } from '@/config/charts/barChartData'
import MiniBarChart from '@/components/charts/MiniBarChart.vue'
import { StackedBarChart, RadialChart } from '@/components/charts'
import { randomizeRadialBenchmarkChartData } from '@/config/charts/RadialBenchmarkChartData'
import PieChart from '@/components/charts/PieChart.vue'
import { randomizePieChartData } from '@/config/charts/PieChartData'

const engagementStore = useEngagementDataStore()
const globalFilters = useGlobalFiltersStore()

const config = getBarChartConfig('engagement')
const barData = config.data

// Animation générale
useScrollReveal('.reveal-up', {
  origin: 'top',
  distance: '20px',
  delay: 150,
  interval: 100,
})

// Animation fade custom pour DataOverview
useScrollReveal('.reveal-fade', {
  distance: '20px',
  opacity: 0,
  duration: 700,
  delay: 50,
  scale: 1,
  easing: 'ease-in-out',
})

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
      borderColor: '#E5D0F6',
      backgroundColor: '#E5D0F6',
      tension: 0.4,
    },
    {
      label: 'Time Per Session',
      data: curves.value.newReturning.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#A259D9',
      backgroundColor: '#A259D9',
      tension: 0.4,
    },
    {
      label: 'Scroll Rate',
      data: curves.value.paidUnpaid.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#7C3AED',
      backgroundColor: '#7C3AED',
      tension: 0.4,
    },
  ],
}))
watch([], randomizeCurves, { immediate: true })

// Génération des données randomisées
function randomFloat(min: number, max: number, decimals = 2) {
  return +(Math.random() * (max - min) + min).toFixed(decimals)
}
function randomizeBarData() {
  barData.splice(
    0,
    barData.length,
    {
      label: 'Pageviews per Session',
      values: [randomFloat(1.8, 2.4), randomFloat(2.8, 3.8), randomFloat(4.2, 5.2)],
      display: (val: number) => val.toFixed(2),
    },
    {
      label: 'Time per Session',
      values: [randomFloat(90, 110), randomFloat(120, 140), randomFloat(160, 180)],
      display: (val: number) => {
        const total = Math.round(val)
        const minPart = Math.floor(total / 60)
        const secPart = total % 60
        return `${minPart}:${secPart.toString().padStart(2, '0')}`
      },
    },
    {
      label: 'Scroll Rate',
      values: [randomFloat(55, 60), randomFloat(65, 70), randomFloat(75, 80)],
      display: (val: number) => val.toFixed(1) + '%',
    },
  )
}

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
watch(
  [
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedDevice,
    () => globalFilters.selectedIndustry,
  ],
  () => {
    randomizeBarData()
    randomizeBenchmarkTable()
    randomizeCurves()
  },
  { immediate: true },
)

// Valeur dynamique pour le header
const headerValue = ref(43.1)
function randomizeHeaderValue() {
  headerValue.value = Math.round((Math.random() * 50 + 20) * 10) / 10
}

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'This year',
  UpFromLastMonth = '⬆ Up from last month',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All Months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    randomizeHeaderValue()
  },
  { immediate: true },
)

// Données réactives pour les RadialBenchmarkChart
const radialData = reactive(randomizeRadialBenchmarkChartData())

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    const newData = randomizeRadialBenchmarkChartData()
    Object.assign(radialData, newData)
  },
  { immediate: true },
)

function formatTime(val: number): string {
  const min = Math.floor(val / 60)
  const sec = val % 60
  return `${min}min${sec.toString().padStart(2, '0')}`
}

// Ajoute une fonction pour générer des valeurs random pour le StackedBarBenchmarkChart
function randomStackedBarValues() {
  // Pourcentage entre 50 et 85
  const arr = [
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
    +(Math.random() * 35 + 50).toFixed(1),
  ]
  // Tri décroissant pour l'effet visuel
  return arr.sort((a, b) => b - a)
}

const stackedBarData = reactive({
  overall: randomStackedBarValues(),
  newVisitors: randomStackedBarValues(),
  returningVisitors: randomStackedBarValues(),
})

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    stackedBarData.overall = randomStackedBarValues()
    stackedBarData.newVisitors = randomStackedBarValues()
    stackedBarData.returningVisitors = randomStackedBarValues()
  },
  { immediate: true },
)

const pieLabels = ['25th', 'Benchmark', '75th']
const pieData = reactive(randomizePieChartData())

watch(
  [
    () => globalFilters.selectedCountry,
    () => globalFilters.selectedIndustry,
    () => globalFilters.selectedMonth,
    () => globalFilters.selectedDevice,
  ],
  () => {
    const newData = randomizePieChartData()
    Object.assign(pieData, newData)
  },
  { immediate: true },
)
</script>
