<template>
  <div class="flex h-screen">
    <CampaignSidebar v-model="activeTab" />

    <div class="flex-1 p-6 overflow-y-auto">
      <div v-if="activeTab === 'info'">
        <h1 class="text-2xl font-bold mb-4">Informações da Campanha</h1>
        <input v-model="campaign.worldName" class="w-full p-2 border rounded mb-2" placeholder="Nome do Mundo" />
        <textarea v-model="campaign.description" class="w-full p-2 border rounded" rows="4" placeholder="Descrição" />
        <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="saveCampaign">
          Salvar
        </button>
      </div>

      <div v-else-if="activeTab === 'maps'">
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
            class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
            title="Remover imagem"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CampaignSidebar from '@/components/CampaignSidebar.vue';
  import { campaignStore } from '@/stores/campaignStore';
  import requests from '@/services/requests';
  import { userAuthStore } from '@/stores/userAuthStore';


  const activeTab = ref<'info' | 'maps'>('info');
  const previewUrl = ref<string | null>(null);
  const authStore = userAuthStore();

  const campaignStoreInstance = campaignStore();

  const campaign = ref({
    worldName: campaignStoreInstance.campaign?.worldName || '',
    description: campaignStoreInstance.campaign?.description || '',
  })

  console.log(campaignStoreInstance.campaign)

  const saveCampaign = async() => {
    try {
      const response = await requests.put('campaign/', {
      id: campaignStoreInstance.campaign?.id,
      worldName: campaign.value.worldName,
      description: campaign.value.description,
      master_id: authStore.user?.id,
    })

    campaignStoreInstance.setCampaign(response.data);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  }

  async function handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !campaignStoreInstance.campaign?.id) return;

    previewUrl.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('map', file);
    formData.append('campaign', campaignStoreInstance.campaign.id.toString());

    try {
      const response = await requests.post('/maps/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload bem-sucedido:', response.data);
    } catch (error) {
      console.error('Erro ao fazer upload do mapa:', error);
    }
  }

  function removeImage() {
    previewUrl.value = null
  }
</script>
