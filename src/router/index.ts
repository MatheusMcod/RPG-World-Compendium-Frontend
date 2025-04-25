import { createRouter, createWebHistory } from 'vue-router'
import requests from '@/services/requests';

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

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'login' });
    }

    try {
      const response = await requests.get('user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('User not authorized');
      }

      next();
    } catch (error) {
      console.error(error);
      next({ name: 'login' });
    }
  } else {
    next();
  }
})

export default router

