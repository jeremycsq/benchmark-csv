<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import HeaderGlobal from './components/HeaderGlobal.vue'
import { useAuth } from './composables/useAuth'

const { checkStoredAuth } = useAuth()
const route = useRoute()

// Pages qui ne doivent pas afficher le header
const hideHeaderPages = ['/auth', '/auth/admin']

const shouldShowHeader = computed(() => {
  return !hideHeaderPages.includes(route.path)
})

// Initialiser l'authentification au démarrage
onMounted(() => {
  checkStoredAuth()
})
</script>

<template>
  <div class="min-h-screen">
    <HeaderGlobal v-if="shouldShowHeader" />
    <main class="mx-auto" :class="{ 'pt-0': !shouldShowHeader }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
