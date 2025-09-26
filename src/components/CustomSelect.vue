<template>
  <div class="relative inline-block text-left">
    <button
      type="button"
      class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:rounded-l focus:outline-none min-w-[140px]"
      @click="toggleDropdown"
      :aria-expanded="open ? 'true' : 'false'"
      :disabled="loading"
    >
      <!-- Icône à gauche -->
      <span class="text-sm">
        <svg
          v-if="loading"
          class="animate-spin w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else-if="icon === 'globe'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" stroke-width="1" />
          <path stroke-width="1" d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
        </svg>
        <svg
          v-else-if="icon === 'tag'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
        <svg
          v-else-if="icon === 'calendar'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" stroke-width="1" />
          <path stroke-width="1" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <svg
          v-else-if="icon === 'devices'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
          />
        </svg>
        <svg
          v-else-if="icon === 'users'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      </span>
      <!-- Label avec drapeau si c'est un pays -->
      <span class="text-sm font-newedge text-gray-800 flex-1 text-left pt-1">
        <span
          v-if="selectedLabel !== 'All Countries' && selectedLabel.length === 2"
          class="country-label"
        >
          {{ getFlagEmoji(selectedLabel) }} {{ getCountryLabel(selectedLabel) }}
        </span>
        <span v-else>
          {{ selectedLabel }}
        </span>
      </span>
      <!-- Chevron -->
      <svg
        v-if="!loading"
        :class="['w-4 h-4 text-gray-400 transition-transform', open ? 'rotate-180' : '']"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <!-- Dropdown -->
    <div
      v-if="open && !loading"
      class="absolute left-0 z-20 mt-2 w-full min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="option in options"
          :key="getOptionValue(option)"
          @click="selectOption(getOptionValue(option))"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 text-base"
          :class="{
            [`font-bold ${getCurrentPageColor()}`]: getOptionValue(option) === selectedLabel,
          }"
        >
          <span
            v-if="getOptionValue(option) !== 'All Countries' && getOptionValue(option).length === 2"
            class="country-label"
          >
            {{ getFlagEmoji(getOptionValue(option)) }} {{ getCountryLabel(getOptionValue(option)) }}
          </span>
          <span v-else>
            {{ getOptionLabel(option) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

type IconName = 'globe' | 'tag' | 'calendar' | 'devices' | 'users'

const props = defineProps<{
  label: string
  icon?: IconName
  options?: string[] | { label: string; value: string }[]
  loading?: boolean
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

const route = useRoute()
const open = ref(false)
const selectedLabel = ref(props.label)

function getCurrentPageColor(): string {
  switch (route.path) {
    case '/traffic':
      return 'text-green-700'
    case '/engagement':
      return 'text-purple-700'
    case '/frustration':
      return 'text-[#EB6909]'
    case '/conversion':
      return 'text-[#119DBC]'
    default:
      return 'text-green-700'
  }
}

function toggleDropdown() {
  if (!props.loading) {
    open.value = !open.value
  }
}

function selectOption(option: string) {
  selectedLabel.value = option
  open.value = false
  emit('change', option)
}

// Fonctions utilitaires pour gérer les options (string ou objet)
function getOptionValue(option: string | { label: string; value: string }): string {
  return typeof option === 'string' ? option : option.value
}

function getOptionLabel(option: string | { label: string; value: string }): string {
  return typeof option === 'string' ? option : option.label
}

// Fermer le dropdown au clic extérieur
function handleClickOutside(event: MouseEvent) {
  const el = (event.target as HTMLElement).closest('.relative')
  if (!el || !el.contains(document.activeElement)) {
    open.value = false
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}

// Fonction utilitaire pour obtenir l'emoji drapeau à partir du code pays
function getFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return ''
  const cc = code.toUpperCase()
  return cc.replace(/./g, (char: string) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Fonction utilitaire pour obtenir le nom anglais du pays à partir du code
function getCountryLabel(code: string): string {
  const labels: Record<string, string> = {
    FR: 'France',
    GB: 'United Kingdom',
    US: 'United States',
    DE: 'Germany',
    IT: 'Italy',
    ES: 'Spain',
    CA: 'Canada',
    CN: 'China',
    JP: 'Japan',
    IN: 'India',
    // Ajoute d'autres pays si besoin
  }
  return labels[code.toUpperCase()] || code
}
</script>

<style scoped>
.dropdown-menu {
  min-width: max-content;
  /* Pour éviter le retour à la ligne des labels longs */
  white-space: nowrap;
}

.select-button {
  min-width: max-content;
}

.country-label {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  vertical-align: middle;
}
</style>
