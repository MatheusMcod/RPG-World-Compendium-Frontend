<template>
  <div v-if="visible" class="fixed inset-0 bg-pink-100 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">Criar Nova Campanha</h2>
      <form @submit.prevent="createCampaign">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Nome do Mundo</label>
          <input v-model="worldName" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Descrição</label>
          <textarea v-model="description" class="w-full border rounded px-3 py-2" rows="3" required></textarea>
        </div>
        <div class="mb-4">
          <label class="inline-flex items-center space-x-2">
            <input v-model="isPublic" type="checkbox" class="form-checkbox text-indigo-600 cursor-pointer" />
            <span>Tornar a campanha pública</span>
          </label>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="close" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded cursor-pointer">Criar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import requests from '@/services/requests'
import { userAuthStore } from '@/stores/userAuthStore'

const auth = userAuthStore()

const emits = defineEmits(['close', 'campaign-created'])

const props = defineProps({
  visible: Boolean
})

const worldName = ref('')
const description = ref('')
const isPublic = ref(false)

onMounted(() => {
  if (!auth.user && auth.accessToken) {
    auth.fetchUser()
  }
})

const close = () => {
  emits('close')
}

const createCampaign = async () => {
  try {
    const response = await requests.post('campaign/', {
      worldName: worldName.value,
      description: description.value,
      master_id: auth.user?.id,
      isPublic: isPublic.value
    })
    emits('campaign-created', response.data)
    close()
  } catch (error) {
    console.error('Erro ao criar campanha:', error)
  }
}

</script>
