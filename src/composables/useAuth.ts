import { ref, computed } from 'vue'

// Mots de passe définis
const PASSWORDS = {
  root: 'csqdata',
  admin: 'jjlesang83',
}

// État d'authentification
const isAuthenticated = ref(false)
const isAdminAuthenticated = ref(false)

export function useAuth() {
  // Fonction pour vérifier le mot de passe racine
  const checkRootPassword = (password: string): boolean => {
    if (password === PASSWORDS.root) {
      isAuthenticated.value = true
      localStorage.setItem('auth_authenticated', 'true')
      return true
    }
    return false
  }

  // Fonction pour vérifier le mot de passe admin
  const checkAdminPassword = (password: string): boolean => {
    if (password === PASSWORDS.admin) {
      isAdminAuthenticated.value = true
      localStorage.setItem('auth_admin_authenticated', 'true')
      return true
    }
    return false
  }

  // Fonction pour déconnecter
  const logout = () => {
    isAuthenticated.value = false
    isAdminAuthenticated.value = false
    localStorage.removeItem('auth_authenticated')
    localStorage.removeItem('auth_admin_authenticated')
  }

  // Fonction pour déconnecter seulement admin
  const logoutAdmin = () => {
    isAdminAuthenticated.value = false
    localStorage.removeItem('auth_admin_authenticated')
  }

  // Vérifier l'authentification au chargement
  const checkStoredAuth = () => {
    const storedAuth = localStorage.getItem('auth_authenticated')
    const storedAdminAuth = localStorage.getItem('auth_admin_authenticated')

    if (storedAuth === 'true') {
      isAuthenticated.value = true
    }
    if (storedAdminAuth === 'true') {
      isAdminAuthenticated.value = true
    }
  }

  // Computed pour vérifier si l'utilisateur peut accéder aux pages
  const canAccessPages = computed(() => isAuthenticated.value)
  const canAccessAdmin = computed(() => isAdminAuthenticated.value)

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    isAdminAuthenticated: computed(() => isAdminAuthenticated.value),
    canAccessPages,
    canAccessAdmin,
    checkRootPassword,
    checkAdminPassword,
    logout,
    logoutAdmin,
    checkStoredAuth,
  }
}
