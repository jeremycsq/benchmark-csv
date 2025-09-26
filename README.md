# Mon Projet Vue - Template Moderne

Un template moderne et performant pour vos applications Vue.js, créé avec Vue 3, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- **Vue.js 3** avec Composition API
- **TypeScript** pour un développement plus sûr
- **Tailwind CSS** pour un design moderne et responsive
- **Vue Router** pour la gestion des routes
- **Pinia** pour la gestion d'état
- **Vite** pour un build ultra-rapide
- **ESLint** et **Prettier** pour la qualité du code
- **Design responsive** et moderne

## 📦 Installation

1. Clonez le projet :

```bash
git clone <votre-repo>
cd benchmark
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

4. Ouvrez votre navigateur sur `http://localhost:5173`

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run format` - Formate le code avec Prettier
- `npm run lint` - Vérifie le code avec ESLint

## 📁 Structure du projet

```
src/
├── assets/          # Ressources statiques (CSS, images)
├── components/      # Composants Vue réutilisables
├── router/          # Configuration du routeur
├── stores/          # Stores Pinia
├── views/           # Pages de l'application
├── App.vue          # Composant racine
└── main.ts          # Point d'entrée de l'application
```

## 🎨 Personnalisation

### Couleurs Tailwind

Le projet utilise une palette de couleurs personnalisable. Modifiez le fichier `tailwind.config.js` pour ajuster les couleurs :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Composants

Les composants sont organisés dans le dossier `src/components/`. Vous pouvez créer de nouveaux composants et les importer dans vos vues.

## 📱 Responsive Design

Le template est entièrement responsive et utilise les classes Tailwind CSS pour s'adapter à tous les écrans :

- Mobile : `< 768px`
- Tablet : `768px - 1024px`
- Desktop : `> 1024px`

## 🔧 Configuration

### TypeScript

Le projet est configuré avec TypeScript. Les types sont définis dans le dossier `src/types/` (à créer si nécessaire).

### Router

Les routes sont configurées dans `src/router/index.ts`. Ajoutez de nouvelles routes selon vos besoins.

### Pinia

Les stores Pinia sont dans `src/stores/`. Créez de nouveaux stores pour gérer l'état de votre application.

## 🚀 Déploiement

### Build pour la production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

### Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement que c'est un projet Vue.js
3. Le déploiement se fera automatiquement à chaque push

### Déploiement sur Netlify

1. Connectez votre repository GitHub à Netlify
2. Configurez la commande de build : `npm run build`
3. Configurez le dossier de publication : `dist`

## 📚 Ressources utiles

- [Documentation Vue.js](https://vuejs.org/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Vite](https://vitejs.dev/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous avez des questions ou des problèmes, n'hésitez pas à ouvrir une issue sur GitHub.

---

Créé avec ❤️ et Vue.js
