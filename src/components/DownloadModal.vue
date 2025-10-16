<template>
  <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
    <div class="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ title || 'Download sections' }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 text-xl">×</button>
      </div>
      <div class="mb-4">
        <div v-for="section in sections" :key="section.value" class="flex items-center mb-2">
          <input
            type="checkbox"
            :id="section.value"
            v-model="selectedSections"
            :value="section.value"
            :class="checkboxClass"
            :style="checkboxStyle"
          />
          <label :for="section.value" class="text-gray-700">{{ section.label }}</label>
        </div>
      </div>
      <slot />
      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" :class="cancelBtnClass" :style="cancelBtnStyle">
          Cancel
        </button>
        <button
          @click="confirm"
          :class="confirmBtnClass"
          :style="confirmBtnStyle"
          :disabled="selectedSections.length === 0"
        >
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits, defineProps } from 'vue'
import { getPageTheme } from '@/config/theme'

const props = defineProps<{
  open: boolean
  sections: { label: string; value: string }[]
  title?: string
  theme?: 'traffic' | 'engagement' | 'frustration' | 'conversion'
}>()

const emit = defineEmits(['close', 'confirm'])

const selectedSections = ref<string[]>([])

watch(
  () => props.open,
  (val) => {
    if (val) selectedSections.value = []
  },
)

// Styles dynamiques basés sur le thème de la page

const confirmBtnClass = computed(() => {
  return [
    'font-newedge px-4 pt-2.5 rounded transition-colors duration-200 tracking-wider flex items-center justify-center py-2 text-white hover:opacity-90',
    'disabled:opacity-50',
  ].join(' ')
})

const confirmBtnStyle = computed(() => {
  const theme = getPageTheme(props.theme || 'traffic')
  return {
    backgroundColor: theme.primary,
  }
})

const checkboxClass = computed(() => {
  return ['mr-2 rounded focus:ring-2 focus:ring-offset-2'].join(' ')
})

const checkboxStyle = computed(() => {
  const theme = getPageTheme(props.theme || 'traffic')
  return {
    accentColor: theme.primary,
  }
})

const cancelBtnClass = computed(() => {
  return [
    'px-4 pt-2.5 flex items-center justify-center py-2 rounded font-newedge transition-colors border hover:opacity-90',
  ].join(' ')
})

const cancelBtnStyle = computed(() => {
  const theme = getPageTheme(props.theme || 'traffic')
  return {
    backgroundColor: 'transparent',
    color: theme.primary,
    borderColor: theme.primary,
  }
})

function confirm() {
  emit('confirm', selectedSections.value)
  emit('close')
}
</script>
