<template>
  <div class="w-64 bg-gray-100 h-full p-4 border-r">
    <h2 class="text-xl font-bold mb-4">Painel</h2>

    <nav class="space-y-2">
      <button
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
        :class="{ 'bg-gray-300 font-semibold': modelValue === 'info' }"
        @click="$emit('update:modelValue', 'info')"
      >
        Informações
      </button>
      <button
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
        :class="{ 'bg-gray-300 font-semibold': modelValue === 'maps' }"
        @click="$emit('update:modelValue', 'maps')"
      >
        Mapas
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>
