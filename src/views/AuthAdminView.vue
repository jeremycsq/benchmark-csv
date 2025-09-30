<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm mx-4">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Access</h1>

        <div class="mb-6">
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
            placeholder="Enter admin password"
            @keyup.enter="handleLogin"
            ref="passwordInput"
          />
        </div>

        <div v-if="error" class="mb-4 text-red-600 text-sm">Incorrect admin password</div>

        <button
          @click="handleLogin"
          :disabled="!password.trim()"
          class="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Access Admin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { checkAdminPassword } = useAuth()

const password = ref('')
const error = ref(false)
const passwordInput = ref<HTMLInputElement>()

const handleLogin = async () => {
  if (!password.value.trim()) return

  error.value = false

  const isValid = checkAdminPassword(password.value)

  if (isValid) {
    // Rediriger vers la page admin demandée ou vers la page admin par défaut
    const redirectPath = sessionStorage.getItem('redirectAfterAuth')
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterAuth')
      await router.push(redirectPath)
    } else {
      await router.push('/admin')
    }
  } else {
    error.value = true
    password.value = ''
  }
}

// Focus automatique sur l'input au montage
onMounted(async () => {
  await nextTick()
  if (passwordInput.value) {
    passwordInput.value.focus()
  }
})
</script>
