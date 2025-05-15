import { defineStore } from 'pinia';
import { ref } from 'vue';

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

export const campaignStore = defineStore('campaign', () => {
  const storedCampaign = localStorage.getItem('campaign');
  const campaign = ref<Campaign | null>(
    storedCampaign ? JSON.parse(storedCampaign) : null
  );

  function setCampaign(selectCampaign: Campaign) {
    campaign.value = selectCampaign;
    localStorage.setItem('campaign', JSON.stringify(selectCampaign));
  }

  function clearCampaign() {
    campaign.value = null;
    localStorage.removeItem('campaign');
  }

  return { campaign, setCampaign, clearCampaign };
});
