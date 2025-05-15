<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Upload de Mapas</h2>

    <div class="mb-4">
      <label
        for="map-upload"
        class="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        <i class="fas fa-upload mr-2"></i>
        Selecionar imagem
      </label>
      <input
        id="map-upload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      />
    </div>

    <div v-if="previewUrl" class="relative w-full max-w-md">
      <img
        :src="previewUrl"
        alt="Mapa preview"
        class="rounded-lg shadow-md max-h-96 object-contain"
      />
      <button
        @click="removeImage"
        class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition cursor-pointer"
        title="Remover imagem"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const previewUrl = ref<string | null>(null)

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  previewUrl.value = null
}
</script>
