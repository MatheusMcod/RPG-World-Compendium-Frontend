import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userAuthStore = defineStore('userAuth', () => {
  const token = ref(localStorage.getItem('token'));

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  async function checkToken(tokenAuth: string) {
    try {
      const token = tokenAuth;
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }

  return { setToken, token }
})
