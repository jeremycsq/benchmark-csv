import { createClient } from '@supabase/supabase-js'
import { env, validateEnv } from '../config/env'

// Validation de la configuration
validateEnv()

export const supabase = createClient(env.supabase.url, env.supabase.anonKey)

// Types pour vos tables (à adapter selon votre schéma)
export interface Database {
  public: {
    Tables: {
      // Exemple de table - à adapter selon votre schéma
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}
