<template>
  <div class="admin-view">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-center">Administration - Import CSV</h1>

      <!-- Sélection de table -->
      <div class="mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-7xl mx-auto">
          <h2 class="text-xl font-semibold mb-4">Sélection de la table</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="table in availableTables"
              :key="table.name"
              @click="selectedTable = table.name"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              :class="{
                'border-blue-500 bg-blue-50 text-blue-700': selectedTable === table.name,
                'border-gray-200 bg-white text-gray-700 hover:border-gray-300':
                  selectedTable !== table.name,
              }"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">{{ table.icon }}</div>
                <div class="font-medium">{{ table.label }}</div>
                <div class="text-sm text-gray-500">{{ table.description }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Section Upload CSV -->
      <div class="mb-8 max-w-7xl mx-auto">
        <CsvUploader :table-name="selectedTable" />
      </div>

      <!-- Statistiques -->
      <div class="stats-section">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="stat-card">
            <div class="stat-value">
              {{ data?.length || 0 }}
            </div>
            <div class="stat-label">Enregistrements</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ filterOptions.countries.length }}</div>
            <div class="stat-label">Pays</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ filterOptions.industries.length }}</div>
            <div class="stat-label">Industries</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ filterOptions.devices.length }}</div>
            <div class="stat-label">Types d'appareils</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseData } from '../composables/useSupabaseData'
import CsvUploader from '../components/CsvUploader.vue'

// Tables disponibles
const availableTables = [
  {
    name: 'traffic',
    label: 'Traffic',
    icon: '🚦',
    description: 'Données de trafic web',
  },
  {
    name: 'engagement',
    label: 'Engagement',
    icon: '💬',
    description: "Métriques d'engagement",
  },
  {
    name: 'frustration',
    label: 'Frustration',
    icon: '😤',
    description: 'Indicateurs de frustration',
  },
  {
    name: 'conversion',
    label: 'Conversion',
    icon: '💰',
    description: 'Données de conversion',
  },
]

// Table sélectionnée
const selectedTable = ref('traffic')

const { data, filterOptions, fetchAllData } = useSupabaseData()

// Initialisation
onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
.admin-view {
  @apply min-h-screen bg-gray-50;
}

.stats-section {
  @apply w-full max-w-7xl mx-auto;
}

.stat-card {
  @apply bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:scale-105;
}

.stat-value {
  @apply text-4xl font-bold text-gray-900 mb-3;
}

.stat-label {
  @apply text-sm text-gray-600 uppercase tracking-wider font-medium;
}
</style>
