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
              <button @click="joinCampaignRequest(campaign.id)" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
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
                <button @click="responseJoinRequest(Invite.campaign.id, 'accepted')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer">Aceitar</button>
                <button @click="responseJoinRequest(Invite.campaign.id, 'rejected')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">Recusar</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="activeTab === 'Minhas Campanhas'">
        <h2 class="text-xl font-bold mb-2">Minhas Campanhas</h2>
        <ul class="space-y-2">
          <li
            v-for="(MyCampaign, i) in MyCampaigns"
            :key="i"
            class="p-4 bg-green-50 rounded-lg flex justify-between items-center"
          >
            <span>{{ MyCampaign.worldName }}</span>
            <div class="space-x-2">
              <button
                @click="goToCampaign(MyCampaign.id)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Acessar
              </button>
              <button
                @click="removeCampaign(MyCampaign.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Remover
              </button>
            </div>
          </li>
        </ul>
      </div>

      <CreateCampaignModal
        :visible="showModal"
        @close="showModal = false"
        @campaign-created="handleCampaignCreated"
      />

      <div class="mt-6 text-right">
        <button @click="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">
          Criar Campanha
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import requests from '@/services/requests';
import NavBar from '../components/NavBar.vue';
import CreateCampaignModal from '../components/CreateCampaignModal.vue';
import { useRouter } from 'vue-router';
import { campaignStore } from '@/stores/campaignStore';

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

const tabs = ['Campanhas Públicas', 'Convites Pendentes', 'Minhas Campanhas'];
const activeTab = ref('Campanhas Públicas');

const publicCampaigns = ref<Campaign[]>([]);
const pendingInvitation = ref<Invitation[]>([]);
const MyCampaigns = ref<Campaign[]>([]);
const showModal = ref(false);
const router = useRouter();
const campaignStoreInstance = campaignStore();

const handleCampaignCreated = (newCampaign: Campaign) => {
  MyCampaigns.value.push(newCampaign);
}

const goToCampaign = async (id: number) => {
  try {
      const response = await requests.get(`/campaign/${id}`);
      campaignStoreInstance.setCampaign(response.data);
      router.push(`/campaign/${id}`);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
    }

}

const removeCampaign = async (id: number) => {
  try {
    await requests.delete(`campaign/?campaign_id=${id}`);
    MyCampaigns.value = MyCampaigns.value.filter(c => c.id !== id);
  } catch (error) {
    console.error('Erro ao remover campanha:', error);
  }
}

const joinCampaignRequest = async (campaign_id: number) => {
  try {
    const response = await requests.post('campaign/join/', {
      campaign: campaign_id
    })
  } catch (error) {
    console.error('Error joining campaign:', error);
  }
}

const responseJoinRequest = async(campaign_id: number, join_response: string) => {
  try {
    const response = await requests.post(`campaign/join/${campaign_id}/response/`, {
      status: join_response
    })
  } catch (error) {
    console.error('Error joining campaign:', error);
  }
}

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
