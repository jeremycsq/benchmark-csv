import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useSupabase() {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // État de connexion
  const isAuthenticated = computed(() => !!user.value)

  // Initialiser la session
  const initializeAuth = async () => {
    try {
      loading.value = true

      // Récupérer la session actuelle
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de l'initialisation"
    } finally {
      loading.value = false
    }
  }

  // Connexion avec email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const signUp = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur d'inscription"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: authError } = await supabase.auth.signOut()

      if (authError) throw authError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de déconnexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    user: computed(() => user.value),
    session: computed(() => session.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,

    // Méthodes
    initializeAuth,
    signIn,
    signUp,
    signOut,

    // Client Supabase direct
    supabase,
  }
}
