<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Table Selection -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Select Table</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="table in availableTables"
            :key="table.name"
            @click="selectedTable = table.name"
            class="p-4 rounded-lg border transition-all duration-200 hover:shadow-sm"
            :class="getTableButtonClass(table.name)"
          >
            <div class="text-center">
              <div class="text-xl mb-2">{{ table.icon }}</div>
              <div class="font-medium text-sm">{{ table.label }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- CSV Upload -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <CsvUploader :table-name="selectedTable" />
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-gray-900">{{ totalRecords }}</div>
          <div class="text-sm text-gray-600">Records</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-gray-900">{{ filterOptions.countries.length }}</div>
          <div class="text-sm text-gray-600">Countries</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-gray-900">{{ filterOptions.industries.length }}</div>
          <div class="text-sm text-gray-600">Industries</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-gray-900">{{ filterOptions.devices.length }}</div>
          <div class="text-sm text-gray-600">Devices</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseData } from '../composables/useSupabaseData'
import CsvUploader from '../components/CsvUploader.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

// Tables disponibles
const availableTables = [
  {
    name: 'traffic',
    label: 'Traffic',
    icon: '🚦',
  },
  {
    name: 'engagement',
    label: 'Engagement',
    icon: '💬',
  },
  {
    name: 'frustration',
    label: 'Frustration',
    icon: '😤',
  },
  {
    name: 'conversion',
    label: 'Conversion',
    icon: '💰',
  },
]

// Table sélectionnée
const selectedTable = ref('traffic')

// Debug: surveiller les changements de selectedTable
watch(
  selectedTable,
  (newTable) => {

  },
  { immediate: true },
)

const { data, filterOptions, totalRecords, fetchAllData } = useSupabaseData()
const { logoutAdmin } = useAuth()

// Initialisation
onMounted(() => {
  fetchAllData()
})

function handleLogoutAdmin() {
  logoutAdmin()
  window.location.href = '/'
}

function goToMainApp() {
  router.push('/traffic')
}

// Couleur du logo
const logoColor = computed(() => '#8D0A38')

// Fonction pour obtenir les classes CSS des boutons de table selon le thème
function getTableButtonClass(tableName: string) {
  if (selectedTable.value === tableName) {
    switch (tableName) {
      case 'traffic':
        return 'border-[#8D0A38] bg-[#8D0A38]/10 text-[#8D0A38]'
      case 'engagement':
        return 'border-purple-500 bg-purple-50 text-purple-700'
      case 'frustration':
        return 'border-[#EB6909] bg-[#EB6909]/10 text-[#EB6909]'
      case 'conversion':
        return 'border-[#41474D] bg-[#41474D]/10 text-[#41474D]'
      default:
        return 'border-blue-500 bg-blue-50 text-blue-700'
    }
  } else {
    return 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
  }
}
</script>
