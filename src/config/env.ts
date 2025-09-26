// Configuration des variables d'environnement Supabase
export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
}

// Vérification de la configuration
export const validateEnv = () => {
  if (!env.supabase.url || !env.supabase.anonKey) {
    console.error("❌ Variables d'environnement Supabase manquantes!")
    console.error('Veuillez créer un fichier .env avec:')
    console.error('VITE_SUPABASE_URL=votre_url_supabase')
    console.error('VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase')
    return false
  }
  console.log('✅ Configuration Supabase valide')
  return true
}
