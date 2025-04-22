<template>
  <div class="min-h-screen bg-pink-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl flex max-w-5xl w-full overflow-hidden">

      <div class="w-full md:w-1/2 p-8">
        <div class="flex items-center space-x-2 mb-6">
          <img src="../assets/Logo.png" alt="Logo" class="h-10" />
          <h1 class="text-2xl font-bold">World Compendium</h1>
        </div>

        <h2 class="text-xl font-semibold mb-2">Login</h2>
        <p class="text-sm text-gray-600 mb-6">Faça login para acessar seu compendium</p>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="email">Email</label>
            <input type="email" v-model="user.email" id="email" class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300" required />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="password">Password</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="user.password" id="password" class="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring focus:border-blue-300" required />
              <button type="button" @click="togglePassword" class="absolute inset-y-0 right-2 flex items-center text-gray-500">
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm mb-4">
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="rememberMe" class="form-checkbox text-blue-500 mr-2" />
              Remember me
            </label>
            <a href="#" class="text-pink-500 hover:underline">Forgot Password</a>
          </div>

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow cursor-pointer">Login</button>
        </form>

        <p class="text-sm text-center mt-4">Não possui uma conta? <RouterLink to="/register" class="text-pink-500 hover:underline">Sign up</RouterLink></p>
      </div>

      <div class="hidden md:flex flex-col justify-center items-center w-1/2 bg-white p-8">
        <img src="https://media.indiedb.com/cache/images/games/1/53/52512/thumb_620x2000/campfire1.gif" alt="Campfire Art" class="rounded-xl mb-6" />
        <p class="text-center text-lg font-semibold">Transforme sua maneira de construir mundos</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import requests from '@/services/requests';
import { reactive } from 'vue';
import { userAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const user = reactive({
  email: "",
  password: ""
});

const authStore = userAuthStore();
const rememberMe = ref(false)
const showPassword = ref(false)
const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function login() {
  try {
    const {data} = await requests.post('users/login/', user);

    authStore.setToken(data.token);
    router.push('/teste')
  } catch (error) {
    console.error('Error Login:', error);
  }
};
</script>

<style lang="scss" scoped>

</style>
