<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
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
          />
          <label :for="section.value" class="text-gray-700">{{ section.label }}</label>
        </div>
      </div>
      <slot />
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="$emit('close')"
          class="px-4 pt-2.5 flex items-center justify-center py-2 rounded-3xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-newedge"
        >
          Cancel
        </button>
        <button @click="confirm" :class="confirmBtnClass" :disabled="selectedSections.length === 0">
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits, defineProps } from 'vue'

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

const themeGradients = {
  traffic:
    'bg-gradient-to-r from-[#307A57] to-[#3A9469] text-white hover:from-[#2D6A4E] hover:to-[#35855A]',
  engagement:
    'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white hover:from-[#7C3AED] hover:to-[#9333EA]',
  frustration:
    'bg-gradient-to-r from-[#EB6909] to-[#F76F09] text-white hover:from-[#C15607] hover:to-[#DC6309]',
  conversion:
    'bg-gradient-to-r from-[#0A95B3] to-[#0EA9CC] text-white hover:from-[#086C82] hover:to-[#068DAB]',
}
const themeCheckboxAccent = {
  traffic: 'accent-[#307A57]',
  engagement: 'accent-[#A259D9]',
  frustration: 'accent-[#EB6909]',
  conversion: 'accent-[#0A95B3]',
}

const confirmBtnClass = computed(() => {
  const t = props.theme || 'traffic'
  return [
    'font-newedge px-4 pt-2.5 rounded-3xl transition-all duration-300 tracking-wider flex items-center justify-center py-2',
    themeGradients[t],
    'disabled:opacity-50',
  ].join(' ')
})

const checkboxClass = computed(() => {
  const t = props.theme || 'traffic'
  return ['mr-2 rounded focus:ring-2 focus:ring-offset-2', themeCheckboxAccent[t]].join(' ')
})

function confirm() {
  emit('confirm', selectedSections.value)
  emit('close')
}
</script>
