<template>
  <NavBar />
  <div class="flex items-center justify-center min-h-screen bg-pink-100 p-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6">
      <div class="flex space-x-4 border-b mb-4">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = tab"
          :class="[
            'py-2 px-4 font-semibold cursor-pointer',
            activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <div>
        <div v-if="activeTab === 'Campanhas Públicas'">
          <h2 class="text-xl font-bold mb-2">Campanhas Públicas</h2>
          <ul class="space-y-2">
            <li
              v-for="(campaign, i) in publicCampaigns"
              :key="i"
              class="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <span>{{ campaign.worldName }}</span>
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
                Solicitar entrada
              </button>
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'Convites Pendentes'">
          <h2 class="text-xl font-bold mb-2">Convites Pendentes</h2>
          <ul class="space-y-2">
            <li
              v-for="(Invite, i) in pendingInvitation"
              :key="i"
              class="p-4 bg-yellow-50 rounded-lg flex justify-between items-center"
            >
              <span>{{ Invite.campaign.worldName }}</span>
              <div class="space-x-2">
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer">Aceitar</button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">Recusar</button>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'Minhas Campanhas'">
          <h2 class="text-xl font-bold mb-2">Minhas Campanhas</h2>
          <ul class="space-y-2">
            <li
              v-for="(MyCampaign, i) in MyCampaigns"
              :key="i"
              class="p-4 bg-green-50 rounded-lg"
            >
              {{ MyCampaign.worldName }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 text-right">
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">
          Criar Campanha
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import requests from '@/services/requests';
import NavBar from '../components/NavBar.vue'

interface Player {
  id: number;
  name: string;
  email: string;
}

interface Campaign {
  id: number;
  worldName: string;
  description: string;
  players: Player[];
  isPublic: boolean;
  created_at: string;
  updated_at: string;
}

type Invitation = {
  id: number;
  campaign: Campaign;
  invited_user: Player;
  invited_by: Player;
  accepted: boolean;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

const tabs = ['Campanhas Públicas', 'Convites Pendentes', 'Minhas Campanhas']
const activeTab = ref('Campanhas Públicas')

const publicCampaigns = ref<Campaign[]>([])

const pendingInvitation = ref<Invitation[]>([])

const MyCampaigns = ref<Campaign[]>([])

onMounted(async () => {
  try {
    const campaignResponse = await requests.get('campaign/list/');
    const inviteResponse = await requests.get('campaign/invite/');
    const MyCampaignsResponse = await requests.get('campaign/');

    publicCampaigns.value = campaignResponse.data;
    pendingInvitation.value = inviteResponse.data;
    MyCampaigns.value = MyCampaignsResponse.data

  } catch (error) {
    console.log('Error Login:', error);
  }
})
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
