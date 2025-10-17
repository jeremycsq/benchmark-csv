<template>
  <div class="flex flex-col gap-6 w-full">
    <div v-for="item in props.data" :key="item.label" class="flex flex-col gap-1 w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#000]">{{ item.label }}</span>
          <span
            v-if="item.type"
            class="px-2 rounded text-xs font-medium"
            :style="badgeStyle(item.type)"
          >
            {{ item.type }}
          </span>
        </div>
        <span class="text-xs text-[#000]">{{ item.value.toFixed(2) }}%</span>
      </div>
      <div
        class="relative w-full mt-2 h-5 rounded overflow-hidden"
        :style="{ background: bgColor }"
      >
        <div class="absolute left-0 top-0 h-5 flex items-center" :style="barStyle(item)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: { label: string; value: number; type: 'PAID' | 'UNPAID' | null }[]
  paidColor: string
  unpaidColor: string
  bgColor: string
  badgeTextColor?: string
  badgeBorderColor?: string
}>()

const bgColor = props.bgColor

function badgeStyle(type: 'PAID' | 'UNPAID') {
  const color = type === 'PAID' ? props.paidColor : props.unpaidColor
  return {
    background: `${color}15`,
    color: props.badgeTextColor || color,
    border: `1px solid ${props.badgeBorderColor || color}`,
  }
}

function barStyle(item: { value: number; type: 'PAID' | 'UNPAID' | null }) {
  const color = item.type === 'PAID' ? props.paidColor : props.unpaidColor
  return {
    width: `${item.value}%`,
    background: color,
    transition: 'width 0.5s',
  }
}
</script>

<style scoped></style>
