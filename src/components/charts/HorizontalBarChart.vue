<template>
  <div class="flex flex-col gap-6 w-full">
    <div v-for="item in props.data" :key="item.label" class="flex flex-col gap-1 w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#000]">{{ item.label }}</span>
          <span
            v-if="item.type"
            class="px-2 rounded-full text-xs font-medium"
            :class="badgeClass(item.type)"
          >
            {{ item.type }}
          </span>
        </div>
        <span class="text-xs text-[#000]">{{ item.value.toFixed(2) }}%</span>
      </div>
      <div class="relative w-full mt-2 h-4 rounded-full bg-[#E5F1F6] overflow-hidden">
        <div
          class="absolute left-0 top-0 h-4 rounded-full flex items-center"
          :style="barStyle(item)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: { label: string; value: number; type: 'PAID' | 'ORGANIC' | null }[]
}>()

function badgeClass(type: 'PAID' | 'ORGANIC') {
  if (type === 'PAID') {
    return 'bg-[#E5F1F6] text-[#119DBC] border border-[#119DBC]'
  } else {
    return 'bg-[#E5F1F6] text-[#119DBC] border border-[#B2E6FA]'
  }
}

function barStyle(item: { value: number; type: 'PAID' | 'ORGANIC' | null }) {
  const color = item.type === 'PAID' ? '#119DBC' : '#B2E6FA'
  return {
    width: `${item.value}%`,
    background: color,
    transition: 'width 0.5s',
  }
}
</script>

<style scoped></style>
