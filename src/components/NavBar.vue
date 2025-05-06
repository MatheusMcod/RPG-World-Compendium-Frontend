<template>
  <nav class="bg-white shadow-md px-4 py-2 flex items-center justify-between">
    <div class="text-xl font-bold text-blue-600">
      <img src="../assets/Logo.png" alt="Logo" class="h-15 w-auto" />
    </div>
    <div class="hidden md:flex gap-6 text-gray-700">
      <a href="#" class="hover:text-blue-500">Início</a>
      <a href="#" class="hover:text-blue-500">Campanhas</a>
      <a href="#" class="hover:text-blue-500">Convites</a>
      <a href="#" class="hover:text-blue-500">Perfil</a>
    </div>
    <button @click="toggleMenu" class="md:hidden focus:outline-none">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col gap-4 p-4 md:hidden z-50"
    >
      <a href="#" class="hover:text-blue-500">Início</a>
      <a href="#" class="hover:text-blue-500">Campanhas</a>
      <a href="#" class="hover:text-blue-500">Convites</a>
      <a href="#" class="hover:text-blue-500">Perfil</a>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const isOpen = ref(false)

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }
</script>

