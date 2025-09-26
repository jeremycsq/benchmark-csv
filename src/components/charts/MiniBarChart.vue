<template>
  <div v-if="isVariant" class="flex flex-row gap-8 w-full justify-center">
    <div v-for="item in variantData" :key="item.label" class="flex flex-col items-center w-full">
      <div class="flex flex-row items-end justify-center gap-3 w-full h-20">
        <div class="flex flex-col items-center w-1/4">
          <span class="text-xs mb-1">{{ item.display(item.values[0]) }}</span>
          <div :style="barStyle(0, colors || item.colors, item.values)" class="rounded-t-md"></div>
        </div>
        <div class="flex flex-col items-center w-1/4">
          <span class="text-xs mb-1">{{ item.display(item.values[1]) }}</span>
          <div :style="barStyle(1, colors || item.colors, item.values)" class="rounded-t-md"></div>
        </div>
        <div class="flex flex-col items-center w-1/4">
          <span class="text-xs mb-1">{{ item.display(item.values[2]) }}</span>
          <div :style="barStyle(2, colors || item.colors, item.values)" class="rounded-t-md"></div>
        </div>
      </div>
      <div class="flex flex-row justify-center gap-3 w-full mt-1">
        <span
          class="text-xs w-1/4 text-center"
          :style="{ color: labelColor || item.labelColor || '#B9A7C7' }"
          >25th</span
        >
        <span
          class="text-xs w-1/4 text-center"
          :style="{ color: labelColor || item.labelColor || '#B9A7C7' }"
          >Benchmark</span
        >
        <span
          class="text-xs w-1/4 text-center"
          :style="{ color: labelColor || item.labelColor || '#B9A7C7' }"
          >75th</span
        >
      </div>
      <div class="text-xs text-[#000] mt-4">{{ item.label }}</div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center w-full">
    <div class="flex flex-row items-end justify-center gap-3 w-full h-20">
      <div class="flex flex-col items-center w-1/4">
        <span class="text-xs mb-1">{{
          display ? display((values || defaultValues)[0]) : (values || defaultValues)[0].toFixed(2)
        }}</span>
        <div
          :style="barStyle(0, colors || defaultColors, values || defaultValues)"
          class="rounded-t-md"
        ></div>
      </div>
      <div class="flex flex-col items-center w-1/4">
        <span class="text-xs mb-1">{{
          display ? display((values || defaultValues)[1]) : (values || defaultValues)[1].toFixed(2)
        }}</span>
        <div
          :style="barStyle(1, colors || defaultColors, values || defaultValues)"
          class="rounded-t-md"
        ></div>
      </div>
      <div class="flex flex-col items-center w-1/4">
        <span class="text-xs mb-1">{{
          display ? display((values || defaultValues)[2]) : (values || defaultValues)[2].toFixed(2)
        }}</span>
        <div
          :style="barStyle(2, colors || defaultColors, values || defaultValues)"
          class="rounded-t-md"
        ></div>
      </div>
    </div>
    <div class="flex flex-row justify-center gap-3 w-full mt-1">
      <span class="text-xs w-1/4 text-center" :style="{ color: labelColor || '#B9A7C7' }"
        >25th</span
      >
      <span class="text-xs w-1/4 text-center" :style="{ color: labelColor || '#B9A7C7' }"
        >Benchmark</span
      >
      <span class="text-xs w-1/4 text-center" :style="{ color: labelColor || '#B9A7C7' }"
        >75th</span
      >
    </div>
    <div class="text-xs text-[#000] mt-4">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  values?: [number, number, number]
  colors?: [string, string, string]
  label?: string
  display?: (val: number) => string
  labelColor?: string
  variant?: string
  variantValues?: [number, number, number][]
}>()

type MiniBarChartVariant = {
  label: string
  values: [number, number, number]
  colors: [string, string, string]
  display: (v: number) => string
  labelColor: string
}

const variants: Record<string, MiniBarChartVariant[]> = {
  coreWebVitals: [
    {
      label: 'LCP',
      values: [1.8, 2.4, 3.7],
      colors: ['#97A6BA', '#5286F8', '#232B36'],
      display: (v: number) => v + 's',
      labelColor: '#97A6BA',
    },
    {
      label: 'CLS',
      values: [0.05, 0.12, 0.18],
      colors: ['#97A6BA', '#5286F8', '#232B36'],
      display: (v: number) => v.toFixed(2),
      labelColor: '#97A6BA',
    },
    {
      label: 'INP',
      values: [145, 220, 340],
      colors: ['#97A6BA', '#5286F8', '#232B36'],
      display: (v: number) => v + 'ms',
      labelColor: '#97A6BA',
    },
  ],
  conversionMetrics: [
    {
      label: 'Average Order Value',
      values: [48, 68, 96],
      colors: ['#B2E6FA', '#119DBC', '#0B7A9C'],
      display: (v: number) => '$' + v,
      labelColor: '#119DBC',
    },
    {
      label: 'Transaction per Session',
      values: [0.018, 0.029, 0.042],
      colors: ['#B2E6FA', '#119DBC', '#0B7A9C'],
      display: (v: number) => v.toFixed(3),
      labelColor: '#119DBC',
    },
    {
      label: 'Revenue per Session',
      values: [2, 4, 6],
      colors: ['#B2E6FA', '#119DBC', '#0B7A9C'],
      display: (v: number) => '$' + v,
      labelColor: '#119DBC',
    },
  ],
  // Ajoute d'autres variants ici si besoin
}

const isVariant = computed<boolean>(() => !!props.variant && !!variants[props.variant!])
const variantData = computed<MiniBarChartVariant[] | null>(() => {
  if (!isVariant.value) return null

  const baseVariant = variants[props.variant!]
  if (!baseVariant) return null

  // Si des valeurs dynamiques sont fournies, les utiliser
  if (props.variantValues && props.variantValues.length === baseVariant.length) {
    return baseVariant.map((item, index) => ({
      ...item,
      values: props.variantValues![index],
    }))
  }

  return baseVariant
})

function barStyle(idx: number, colors: [string, string, string], values: [number, number, number]) {
  const max = Math.max(...values)
  const height = 20 + 60 * (values[idx] / max)
  return {
    width: '32px',
    height: height + 'px',
    background: colors[idx],
    transition: 'height 0.3s',
  }
}

const defaultValues: [number, number, number] = [0, 0, 0]
const defaultColors: [string, string, string] = ['#B9A7C7', '#B9A7C7', '#B9A7C7']
</script>
