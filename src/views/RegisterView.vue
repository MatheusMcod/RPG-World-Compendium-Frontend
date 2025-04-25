<template>
  <div class="min-h-screen flex items-center justify-center bg-pink-100">
    <div class="bg-white rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row w-full max-w-5xl">

      <div class="hidden md:block w-full md:w-1/2 rounded-2xl overflow-hidden">
        <img
          src="../assets/LoginImage.webp"
          alt="Crie seu mundo"
          class="object-cover h-full w-full"
        />
      </div>

      <div class="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8">
        <div class="flex items-center gap-2 mb-6">
          <img src="../assets/Logo.png" alt="Logo" class="w-8 h-8" />
          <h1 class="text-xl font-semibold">World Compendium</h1>
        </div>

        <h2 class="text-2xl font-bold mb-2">Registro</h2>
        <p class="text-sm text-gray-500 mb-6">Crie sua conta para acessar seu compendium</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input
            type="text"
            placeholder="Username"
            v-model="userRegister.name"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            v-model="userRegister.email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              v-model="userRegister.password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              class="absolute right-2 top-2"
              @click="showPassword = !showPassword"
            >
              👁️
            </button>
          </div>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              v-model="userRegister.confirm_password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              class="absolute right-2 top-2"
              @click="showPassword = !showPassword"
            >
              👁️
            </button>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Criar Conta
          </button>
        </form>

        <p class="mt-4 text-sm text-center">
          Já possui uma conta?
          <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import requests from '@/services/requests';
  import { useRouter } from 'vue-router';
  import { reactive, ref } from 'vue'

  const userRegister = reactive({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  const router = useRouter();
  const showPassword = ref(false)

  async function handleSubmit() {
    try {
      const {data} = await requests.post('user/auth/register/', userRegister);

      router.push('/login');
    } catch (error) {
      console.log('Error Login:', error);
    }
  }
</script>
