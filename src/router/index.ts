import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/traffic',
    },
    {
      path: '/traffic',
      name: 'traffic',
      component: () => import('../views/TrafficView.vue'),
    },
    {
      path: '/engagement',
      name: 'engagement',
      component: () => import('../views/EngagementView.vue'),
    },
    {
      path: '/frustration',
      name: 'frustration',
      component: () => import('../views/FrustrationView.vue'),
    },
    {
      path: '/conversion',
      name: 'conversion',
      component: () => import('../views/ConversionView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/auth/admin',
      name: 'auth-admin',
      component: () => import('../views/AuthAdminView.vue'),
    },
  ],
})

// Garde de navigation pour l'authentification
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite l'authentification admin
  if (to.meta.requiresAdmin) {
    const adminAuth = localStorage.getItem('auth_admin_authenticated')
    if (adminAuth !== 'true') {
      // Stocker la route de destination pour rediriger après login
      sessionStorage.setItem('redirectAfterAuth', to.fullPath)
      next('/auth/admin')
      return
    }
  }

  // Vérifier l'authentification générale pour toutes les autres routes
  if (to.path !== '/auth' && to.path !== '/auth/admin') {
    const auth = localStorage.getItem('auth_authenticated')
    if (auth !== 'true') {
      // Stocker la route de destination pour rediriger après login
      sessionStorage.setItem('redirectAfterAuth', to.fullPath)
      next('/auth')
      return
    }
  }

  next()
})

export default router
