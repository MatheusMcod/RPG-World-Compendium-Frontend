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
      path: '/teste',
      name: 'teste',
      component: () => import('../views/TesteView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ],
})

export default router

