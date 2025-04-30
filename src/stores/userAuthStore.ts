import { defineStore } from 'pinia';
import { ref } from 'vue';

import axiosInstance from '@/services/requests';

export const userAuthStore = defineStore('userAuth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh'));

  function setAccessToken(access: string) {
    accessToken.value = access;
    localStorage.setItem('access', access);

  }

  function setRefreshToken(refresh: string) {
    refreshToken.value = refresh;
    localStorage.setItem('refresh', refresh);
  }

  function clearToken() {
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('refresh');
    localStorage.removeItem('access');
  }

  async function logout() {
    try {
      await axiosInstance.post('/auth/logout/');
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      clearToken();
    }
  }

  return { accessToken, refreshToken, setAccessToken, setRefreshToken, clearToken, logout };
});
