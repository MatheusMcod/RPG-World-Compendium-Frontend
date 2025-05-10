import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/campaigns/select',
      name: 'campaigns-select',
      component: () => import('../views/CampaignSelectView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/campaign/:id',
      name: 'campaign-detail',
      component: () => import('../views/CampaignView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ],
})

export default router

