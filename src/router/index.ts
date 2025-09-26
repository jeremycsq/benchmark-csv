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
    },
  ],
})

export default router
