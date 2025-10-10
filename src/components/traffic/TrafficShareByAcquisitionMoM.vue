<template>
  <div class="flex flex-col md:flex-row mt-8 reveal-up">
    <!-- Libellé à gauche -->
    <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
      <div
        class="flex flex-row items-center justify-start gap-4 border-b border-[#FFEAE3] pb-4 w-full"
      >
        <div class="font-newedge pt-1 font-medium">
          {{ chartTitle }}
        </div>
      </div>
    </div>
    <!-- Graphique à droite -->
    <div class="w-full md:w-2/3 bg-white border border-[#FFEAEA] p-6 rounded-lg">
      <div class="w-full h-60">
        <LineChart
          :data="lineData"
          :yMin="-6"
          :yMax="6"
          :yStep="1"
          yTickSuffix="%"
          labelColor="#000"
          gridColor="#FFF6F6"
        />
      </div>
      <div class="flex items-center gap-6 mt-2 text-xs text-[#000]">
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background: #8d0a38"></span>
          <span>Paid Traffic ({{ Math.round(currentPaidShare * 100) }}%)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" style="background: #ffb6b5"></span>
          <span>Unpaid Traffic ({{ Math.round((1 - currentPaidShare) * 100) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useTrafficMetrics } from '@/composables/useTrafficMetrics'
import type { TrafficData } from '@/composables/useSupabaseData'

const { filteredData } = useTrafficMetrics()

// Titre dynamique selon le contexte
const chartTitle = computed(() => {
  if (!filteredData.value.length) return 'Traffic share by acquisition type MoM change'

  const grouped: Record<string, TrafficData[]> = {}
  filteredData.value.forEach((row: TrafficData) => {
    if (!grouped[row.analysis_month]) grouped[row.analysis_month] = []
    grouped[row.analysis_month].push(row)
  })

  const months = Object.keys(grouped).sort()

  if (months.length === 1) {
    return 'Traffic share by acquisition type - monthly progression'
  }

  return 'Traffic share by acquisition type MoM change'
})

// Labels (mois ou jours) selon le nombre de mois disponibles
const labels = computed(() => {
  if (!filteredData.value.length) return [] as string[]

  const grouped: Record<string, TrafficData[]> = {}
  filteredData.value.forEach((row: TrafficData) => {
    if (!grouped[row.analysis_month]) grouped[row.analysis_month] = []
    grouped[row.analysis_month].push(row)
  })

  const months = Object.keys(grouped).sort()

  // Si on a un seul mois, créer des labels pour tous les jours du mois
  if (months.length === 1) {
    const month = months[0]
    const year = parseInt(month.split('-')[0])
    const monthNum = parseInt(month.split('-')[1])
    const daysInMonth = new Date(year, monthNum, 0).getDate()

    const dayLabels = []
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const monthName = monthNames[monthNum - 1]

    for (let day = 1; day <= daysInMonth; day++) {
      if (day === 1) {
        dayLabels.push(`01\n${monthName}`)
      } else if (day === daysInMonth) {
        dayLabels.push(`${String(daysInMonth).padStart(2, '0')}\n${monthName}`)
      } else {
        dayLabels.push(String(day).padStart(2, '0'))
      }
    }

    return dayLabels
  }

  // Sinon, utiliser les mois (limité aux 12 derniers)
  return months.slice(-12)
})

// Série Paid et Unpaid (MoM change)
const paidMoM = computed(() => {
  if (!filteredData.value.length) return [] as number[]

  const byMonth: Record<string, TrafficData[]> = {}
  filteredData.value.forEach((row: TrafficData) => {
    if (!byMonth[row.analysis_month]) byMonth[row.analysis_month] = []
    byMonth[row.analysis_month].push(row)
  })

  const months = Object.keys(byMonth).sort()

  // Si on a un seul mois, créer une progression interpolée sur tous les jours du mois
  if (months.length === 1) {
    const month = months[0]
    const items = byMonth[month] || []
    if (!items.length) return []

    const avgMoMChange =
      items.reduce(
        (sum: number, r: TrafficData) => sum + (Number(r.paid_traffic_mom_change) || 0),
        0,
      ) / items.length

    // Générer des données pour tous les jours du mois avec interpolation linéaire
    const year = parseInt(month.split('-')[0])
    const monthNum = parseInt(month.split('-')[1])
    const daysInMonth = new Date(year, monthNum, 0).getDate()

    const interpolatedData = []
    for (let day = 1; day <= daysInMonth; day++) {
      // Interpolation linéaire de 0 au début à avgMoMChange à la fin
      const progress = (day - 1) / (daysInMonth - 1)
      const value = progress * avgMoMChange
      interpolatedData.push(Math.round(value * 10) / 10)
    }

    return interpolatedData
  }

  // Sinon, utiliser la logique par mois
  return labels.value.map((month) => {
    const items = byMonth[month] || []
    if (!items.length) return 0
    const avg =
      items.reduce(
        (sum: number, r: TrafficData) => sum + (Number(r.paid_traffic_mom_change) || 0),
        0,
      ) / items.length
    return Math.round(avg * 10) / 10
  })
})

const unpaidMoM = computed(() => paidMoM.value.map((v) => Math.round(-v * 10) / 10))

// Part actuelle Paid (dernier mois ou dernier point de données)
const currentPaidShare = computed(() => {
  if (!filteredData.value.length) return 0

  const byMonth: Record<string, TrafficData[]> = {}
  filteredData.value.forEach((row: TrafficData) => {
    if (!byMonth[row.analysis_month]) byMonth[row.analysis_month] = []
    byMonth[row.analysis_month].push(row)
  })

  const months = Object.keys(byMonth).sort()
  const lastMonth = months[months.length - 1]

  const items = byMonth[lastMonth] || []
  if (!items.length) return 0

  const avg =
    items.reduce((sum: number, r: TrafficData) => sum + (Number(r.paid_traffic_share) || 0), 0) /
    items.length
  return avg
})

const lineData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Paid Traffic',
      data: paidMoM.value,
      borderColor: '#8D0A38',
      backgroundColor: '#8D0A38',
      tension: 0.4,
    },
    {
      label: 'Unpaid Traffic',
      data: unpaidMoM.value,
      borderColor: '#FFB6B5',
      backgroundColor: '#FFB6B5',
      tension: 0.4,
    },
  ],
}))
</script>
