# Configuration Supabase

Ce projet est configuré pour utiliser Supabase comme base de données. Voici comment le configurer :

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé API anonyme

## 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_SUPABASE_URL=votre_url_supabase_ici
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase_ici
```

### Où trouver ces valeurs :

1. **URL Supabase** : Dans votre dashboard Supabase → Settings → API → Project URL
2. **Clé API anonyme** : Dans votre dashboard Supabase → Settings → API → Project API keys → anon public

## 3. Structure du projet

```
src/
├── lib/
│   └── supabase.ts          # Configuration du client Supabase
├── config/
│   └── env.ts               # Configuration des variables d'environnement
├── composables/
│   └── useSupabase.ts       # Composable Vue pour utiliser Supabase
└── components/
    └── SupabaseExample.vue  # Exemple d'utilisation
```

## 4. Utilisation

### Authentification

```typescript
import { useSupabase } from '@/composables/useSupabase'

const { signIn, signUp, signOut, user, isAuthenticated } = useSupabase()

// Connexion
await signIn('email@example.com', 'password')

// Inscription
await signUp('email@example.com', 'password')

// Déconnexion
await signOut()
```

### Requêtes de base de données

```typescript
import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()

// Récupérer des données
const { data, error } = await supabase.from('table_name').select('*')

// Insérer des données
const { data, error } = await supabase.from('table_name').insert([{ column: 'value' }])

// Mettre à jour des données
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', 1)

// Supprimer des données
const { data, error } = await supabase.from('table_name').delete().eq('id', 1)
```

## 5. Types TypeScript

Vous pouvez générer les types TypeScript automatiquement depuis votre schéma Supabase :

1. Installez l'extension Supabase CLI
2. Connectez-vous à votre projet
3. Générez les types : `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts`

## 6. Sécurité

- Ne partagez jamais votre clé API de service (service_role) côté client
- Utilisez Row Level Security (RLS) dans Supabase pour sécuriser vos données
- Configurez les politiques d'accès dans votre dashboard Supabase

## 7. Exemple de table

Voici un exemple de table `profiles` que vous pouvez créer dans Supabase :

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 8. Démarrage

1. Configurez vos variables d'environnement
2. Lancez le serveur de développement : `npm run dev`
3. Ouvrez le composant `SupabaseExample.vue` pour tester la connexion

## Support

Pour plus d'informations, consultez la [documentation officielle de Supabase](https://supabase.com/docs).
