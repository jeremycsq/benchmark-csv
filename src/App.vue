<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderGlobal from './components/HeaderGlobal.vue'
</script>

<template>
  <div class="min-h-screen">
    <HeaderGlobal />
    <main class="mx-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
