<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          {{ isAdmin ? 'Accès Admin' : 'Accès Protégé' }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{
            isAdmin
              ? 'Veuillez saisir le mot de passe administrateur'
              : 'Veuillez saisir le mot de passe pour accéder à cette section'
          }}
        </p>

        <div class="mb-6">
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8D0A38] focus:border-transparent outline-none"
            :placeholder="isAdmin ? 'Mot de passe admin' : 'Mot de passe'"
            @keyup.enter="handleLogin"
            ref="passwordInput"
          />
        </div>

        <div v-if="error" class="mb-4 text-red-600 text-sm">Mot de passe incorrect</div>

        <div class="flex gap-3">
          <button
            @click="handleLogin"
            class="flex-1 bg-[#8D0A38] text-white py-3 px-6 rounded-lg hover:bg-[#6B0826] transition-colors font-medium"
          >
            Connexion
          </button>
          <button
            v-if="!isAdmin"
            @click="handleCancel"
            class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'

interface Props {
  showModal: boolean
  isAdmin?: boolean
}

interface Emits {
  (e: 'login-success'): void
  (e: 'login-cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
})

const emit = defineEmits<Emits>()

const { checkRootPassword, checkAdminPassword } = useAuth()

const password = ref('')
const error = ref(false)
const passwordInput = ref<HTMLInputElement>()

const handleLogin = () => {
  error.value = false

  let isValid = false

  if (props.isAdmin) {
    isValid = checkAdminPassword(password.value)
  } else {
    isValid = checkRootPassword(password.value)
  }

  if (isValid) {
    emit('login-success')
    password.value = ''
  } else {
    error.value = true
    password.value = ''
  }
}

const handleCancel = () => {
  emit('login-cancel')
  password.value = ''
  error.value = false
}

// Focus automatique sur l'input au montage
onMounted(async () => {
  await nextTick()
  if (passwordInput.value) {
    passwordInput.value.focus()
  }
})
</script>
