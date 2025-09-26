// Configuration des variables d'environnement Supabase
export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://bkxbndowpjrpfxvroiez.supabase.co',
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreGJuZG93cGpycGZ4dnJvaWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzA2MzMsImV4cCI6MjA2NTc0NjYzM30.iFJSn4sELTCAt1buwCfNu1xTkLe87TzuzghpIL9FwJA',
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
