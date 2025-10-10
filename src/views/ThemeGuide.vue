<template>
  <section class="min-h-screen bg-[#F7F7F8] py-10">
    <div class="max-w-7xl mx-auto px-8">
      <h1 class="text-4xl font-newedge mb-6 text-[#32373A]">Design System – Themes</h1>
      <p class="text-[#626B76] mb-10">Colors used per page (UI and charts).</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          v-for="card in cards"
          :key="card.title"
          class="bg-white rounded-xl border border-[#ECEDEF] shadow-sm"
        >
          <div class="px-6 py-4 border-b border-[#ECEDEF]">
            <h2 class="text-2xl font-newedge text-[#32373A]">{{ card.title }}</h2>
          </div>
          <div class="p-6">
            <div>
              <h3 class="text-sm font-semibold mb-3 text-[#626B76]">UI</h3>
              <ul class="space-y-2">
                <li v-for="(it, i) in card.ui" :key="'ui-' + i" class="flex items-center gap-3">
                  <span
                    class="inline-block w-8 h-8 rounded-sm border border-[#DADDE1]"
                    :style="{ backgroundColor: it.color }"
                  ></span>
                  <span class="text-sm text-[#32373A] font-medium w-32">{{ it.label }}</span>
                  <code class="text-xs text-[#626B76]">{{ it.color }}</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pageThemes as themes, chartColors as charts } from '@/config/theme'

const build = (title: string, t: any, c: any) => ({
  title,
  ui: [
    { label: 'primary', color: t.primary },
    { label: 'secondary', color: t.secondary },
    { label: 'accent', color: t.accent },
    { label: 'background', color: t.background },
    { label: 'text', color: t.text },
  ],
  grad: [
    { label: 'gradient.from', color: t.gradient.from },
    { label: 'gradient.to', color: t.gradient.to },
    { label: 'hover.from', color: t.gradient.hoverFrom },
    { label: 'hover.to', color: t.gradient.hoverTo },
  ],
  chart: [
    { label: 'chart.primary', color: c.primary },
    { label: 'chart.secondary', color: c.secondary },
    { label: 'chart.tertiary', color: c.tertiary },
    { label: 'chart.background', color: c.background },
  ],
})

const cards = [
  build('Traffic', themes.traffic, charts.traffic),
  build('Engagement', themes.engagement, charts.engagement),
  build('Frustration', themes.frustration, charts.frustration),
  build('Conversion', themes.conversion, charts.conversion),
]
</script>

<style scoped>
.font-newedge {
  font-family:
    'NewEdge666-RegularRounded',
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
}
</style>
