<template>
  <header ref="headerRef" class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div
      v-if="$route.path === '/settings'"
      class="max-w-12xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
    >
      <!-- Logo à gauche -->
      <div class="flex items-center">
        <img
          alt="Vue logo"
          class="h-10 w-10 cursor-pointer"
          src="@/assets/logo.svg"
          @click="$router.push('/traffic')"
        />
      </div>
      <!-- Texte centré -->
      <div class="flex-1 flex justify-center">
        <span class="text-sm font-newedge">Your Workspace Settings</span>
      </div>
      <!-- Avatar à droite -->
      <div class="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar"
          class="w-6 h-6 rounded-full object-cover cursor-pointer"
          @click="$router.push('/settings')"
        />
      </div>
    </div>
    <div v-else class="max-w-12xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
      <!-- Logo à gauche -->
      <div class="flex items-center">
        <img alt="Vue logo" class="h-10 w-10" src="@/assets/logo.svg" />
      </div>
      <!-- Selects custom centrés -->
      <div class="flex flex-wrap items-center gap-2 justify-center">
        <CustomSelect
          label="All Countries"
          icon="globe"
          :options="countryOptions"
          :loading="loadingCountries"
          @change="handleCountryChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          label="All Industries"
          icon="tag"
          :options="industryOptions"
          :loading="loadingIndustries"
          @change="handleIndustryChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          label="All Months"
          icon="calendar"
          :options="monthOptions"
          :loading="loadingMonths"
          @change="handleMonthChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          label="All Devices"
          icon="devices"
          :options="deviceOptions"
          :loading="loadingDevices"
          @change="handleDeviceChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          label="All visitors"
          icon="users"
          :options="['All visitors', 'New', 'Returning']"
        />

        <button
          class="font-semibold px-4 py-2 rounded-3xl transition-all duration-300"
          :class="{
            'bg-gradient-to-r from-[#307A57] to-[#3A9469] text-white hover:from-[#2D6A4E] hover:to-[#35855A]':
              $route.path === '/traffic',
            'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white hover:from-[#7C3AED] hover:to-[#9333EA]':
              $route.path === '/engagement',
            'bg-gradient-to-r from-[#EB6909] to-[#F76F09] text-white hover:from-[#C15607] hover:to-[#DC6309]':
              $route.path === '/frustration',
            'bg-gradient-to-r from-[#0A95B3] to-[#0EA9CC] text-white hover:from-[#086C82] hover:to-[#068DAB]':
              $route.path === '/conversion',
          }"
          @click="showDownloadModal = true"
        >
          {{
            $route.path === '/traffic'
              ? 'Download Traffic'
              : $route.path === '/engagement'
                ? 'Download Engagement'
                : $route.path === '/frustration'
                  ? 'Download Frustration'
                  : 'Download Conversion'
          }}
        </button>
      </div>
      <!-- Bouton et avatar à droite -->
      <div class="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar"
          class="w-6 h-6 rounded-full object-cover cursor-pointer"
          @click="$router.push('/settings')"
        />
      </div>
    </div>
  </header>
  <nav
    v-if="$route.path !== '/settings'"
    class="sticky z-30 mx-auto px-4 p-2 flex space-x-8 text-gray-500 text-sm justify-center backdrop-blur-md bg-white/70 bg-gradient-to-b from-white/80 to-white/40"
    ref="navRef"
    :style="{ top: `${navTop}px` }"
  >
    <RouterLink
      to="/traffic"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-green-700': $route.path === '/traffic',
        'text-gray-400 hover:text-green-700': $route.path !== '/traffic',
      }"
    >
      Traffic
    </RouterLink>
    <RouterLink
      to="/engagement"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-purple-700': $route.path === '/engagement',
        'text-gray-400 hover:text-purple-700': $route.path !== '/engagement',
      }"
    >
      Engagement
    </RouterLink>
    <RouterLink
      to="/frustration"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#EB6909]': $route.path === '/frustration',
        'text-gray-400 hover:text-[#EB6909]': $route.path !== '/frustration',
      }"
    >
      Frustration
    </RouterLink>
    <RouterLink
      to="/conversion"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#119DBC]': $route.path === '/conversion',
        'text-gray-400 hover:text-[#119DBC]': $route.path !== '/conversion',
      }"
    >
      Conversion
    </RouterLink>
  </nav>
  <DownloadModal
    :open="showDownloadModal"
    :sections="downloadSections"
    :title="downloadModalTitle"
    :theme="downloadModalTheme"
    @close="showDownloadModal = false"
    @confirm="handleDownloadConfirm"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import CustomSelect from './CustomSelect.vue'
import { useSupabase } from '../composables/useSupabase'
import { useTrafficDataStore } from '../stores/trafficData'
import { useEngagementDataStore } from '../stores/engagementData'
import DownloadModal from '@/components/DownloadModal.vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useConversionDataStore } from '../stores/conversionData'

const isSticky = ref(false)
const navRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const navTop = ref(0)

// État de connexion Supabase
const isConnected = ref(false)
const isChecking = ref(true)

// Store des données de trafic
const trafficStore = useTrafficDataStore()
const engagementStore = useEngagementDataStore()
const conversionStore = useConversionDataStore()

// État pour les pays
const countries = ref<string[]>([])
const loadingCountries = ref(false)

// État pour les industries
const industries = ref<string[]>([])
const loadingIndustries = ref(false)

// État pour les mois
const months = ref<string[]>([])
const loadingMonths = ref(false)

// État pour les devices
const devices = ref<string[]>([])
const loadingDevices = ref(false)

// Options pour le select des pays
const countryOptions = computed(() => {
  if (loadingCountries.value) {
    return ['Chargement...']
  }
  return ['All Countries', ...countries.value]
})

// Options pour le select des industries
const industryOptions = computed(() => {
  if (loadingIndustries.value) {
    return ['Chargement...']
  }
  return ['All Industries', ...industries.value]
})

// Options pour le select des mois
const monthOptions = computed(() => {
  if (loadingMonths.value) {
    return ['Chargement...']
  }
  return ['All Months', ...months.value]
})

// Options pour le select des devices
const deviceOptions = computed(() => {
  if (loadingDevices.value) {
    return ['Chargement...']
  }
  return ['All Devices', ...devices.value]
})

// Charger les pays depuis la base de données
const loadCountries = async () => {
  try {
    loadingCountries.value = true
    const { supabase } = useSupabase()

    const { data, error } = await supabase.from('data').select('country').not('country', 'is', null)

    if (error) {
      console.error('Erreur lors du chargement des pays:', error)
      return
    }

    // Extraire les pays uniques, mettre la première lettre en majuscule et les trier
    const uniqueCountries = [...new Set(data?.map((row) => row.country).filter(Boolean))]
    countries.value = uniqueCountries
      .map((country) => country.charAt(0).toUpperCase() + country.slice(1).toLowerCase())
      .sort()

    console.log(`✅ ${countries.value.length} pays chargés`)
  } catch (err) {
    console.error('Erreur lors du chargement des pays:', err)
  } finally {
    loadingCountries.value = false
  }
}

// Charger les industries depuis la base de données
const loadIndustries = async () => {
  try {
    loadingIndustries.value = true
    const { supabase } = useSupabase()

    const { data, error } = await supabase
      .from('data')
      .select('industry')
      .not('industry', 'is', null)

    if (error) {
      console.error('Erreur lors du chargement des industries:', error)
      return
    }

    // Extraire les industries uniques, mettre la première lettre en majuscule et les trier
    const uniqueIndustries = [...new Set(data?.map((row) => row.industry).filter(Boolean))]
    industries.value = uniqueIndustries
      .map((industry) => industry.charAt(0).toUpperCase() + industry.slice(1).toLowerCase())
      .sort()

    console.log(`✅ ${industries.value.length} industries chargées`)
  } catch (err) {
    console.error('Erreur lors du chargement des industries:', err)
  } finally {
    loadingIndustries.value = false
  }
}

// Charger les mois depuis la base de données
const loadMonths = async () => {
  try {
    loadingMonths.value = true

    // Tous les mois de l'année en anglais
    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    months.value = allMonths

    console.log(`✅ ${months.value.length} mois chargés`)
  } catch (err) {
    console.error('Erreur lors du chargement des mois:', err)
  } finally {
    loadingMonths.value = false
  }
}

// Charger les devices depuis la base de données
const loadDevices = async () => {
  try {
    loadingDevices.value = true
    const { supabase } = useSupabase()

    const { data, error } = await supabase.from('data').select('device').not('device', 'is', null)

    if (error) {
      console.error('Erreur lors du chargement des devices:', error)
      return
    }

    // Extraire les devices uniques, mettre la première lettre en majuscule et les trier
    const uniqueDevices = [...new Set(data?.map((row) => row.device).filter(Boolean))]
    devices.value = uniqueDevices
      .map((device) => device.charAt(0).toUpperCase() + device.slice(1).toLowerCase())
      .sort()

    console.log(`✅ ${devices.value.length} devices chargés`)
  } catch (err) {
    console.error('Erreur lors du chargement des devices:', err)
  } finally {
    loadingDevices.value = false
  }
}

// Vérifier la connexion Supabase
const checkSupabaseConnection = async () => {
  try {
    isChecking.value = true
    const { supabase } = useSupabase()

    // Test simple de connexion en récupérant la session
    const { error } = await supabase.auth.getSession()

    if (error) {
      console.error('Erreur de connexion Supabase:', error)
      isConnected.value = false
    } else {
      isConnected.value = true
      console.log('✅ Connecté à Supabase')
    }
  } catch (err) {
    console.error('Erreur lors de la vérification Supabase:', err)
    isConnected.value = false
  } finally {
    isChecking.value = false
  }
}

function updateNavTop() {
  if (headerRef.value) {
    navTop.value = headerRef.value.offsetHeight
  }
}

function handleScroll() {
  const header = headerRef.value
  if (!header || !navRef.value) return
  const headerRect = header.getBoundingClientRect()
  isSticky.value = headerRect.bottom <= 0
}

function handleCountryChange(value: string) {
  const country = value === 'All Countries' ? '' : value
  globalFilters.setCountry(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ country })
  } else if (route.path === '/engagement') {
    engagementStore.setCountry(value)
  } else if (route.path === '/conversion') {
    conversionStore.setCountry(value)
  }
}

const globalFilters = useGlobalFiltersStore()

function handleMonthChange(value: string) {
  globalFilters.setMonth(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ month: value })
  } else if (route.path === '/engagement') {
    engagementStore.setMonth(value)
  } else if (route.path === '/conversion') {
    conversionStore.setMonth(value)
  }
}

function handleDeviceChange(value: string) {
  const device = value === 'All Devices' ? '' : value
  globalFilters.setDevice(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ device })
  } else if (route.path === '/engagement') {
    engagementStore.setDevice(value)
  } else if (route.path === '/conversion') {
    conversionStore.setDevice(value)
  }
}

function handleIndustryChange(value: string) {
  const industry = value === 'All Industries' ? '' : value
  globalFilters.setIndustry(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ industry })
  } else if (route.path === '/engagement') {
    engagementStore.setIndustry(value)
  } else if (route.path === '/conversion') {
    conversionStore.setIndustry(value)
  }
}

const showDownloadModal = ref(false)
const route = useRoute()
const downloadSectionsMap = {
  '/traffic': [
    { label: 'Overview', value: 'overview' },
    { label: 'Traffic share by types', value: 'traffic_share' },
    { label: 'Change by type', value: 'change_type' },
    { label: 'Traffic share by acquisition source', value: 'acquisition_share' },
  ],
  '/engagement': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
  '/frustration': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
  '/conversion': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
}
const downloadSections = computed(
  () => downloadSectionsMap[route.path as keyof typeof downloadSectionsMap] || [],
)
const downloadModalTitle = computed(() => {
  if (route.path === '/traffic') return 'Download Traffic Data'
  if (route.path === '/engagement') return 'Download Engagement Data'
  if (route.path === '/frustration') return 'Download Frustration Data'
  if (route.path === '/conversion') return 'Download Conversion Data'
  return 'Download Data'
})
const downloadModalTheme = computed(() => {
  if (route.path === '/traffic') return 'traffic'
  if (route.path === '/engagement') return 'engagement'
  if (route.path === '/frustration') return 'frustration'
  if (route.path === '/conversion') return 'conversion'
  return 'traffic'
})
function handleDownloadConfirm(selected: string[]) {
  // Ici tu fais ce que tu veux avec les sections sélectionnées
  console.log('Sections à télécharger :', selected)
}

onMounted(() => {
  updateNavTop()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateNavTop)
  nextTick(updateNavTop)

  // Vérifier la connexion Supabase au montage
  checkSupabaseConnection()

  // Charger les pays depuis la base de données
  loadCountries()

  // Charger les industries depuis la base de données
  loadIndustries()

  // Charger les mois depuis la base de données
  loadMonths()

  // Charger les devices depuis la base de données
  loadDevices()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateNavTop)
})
</script>
