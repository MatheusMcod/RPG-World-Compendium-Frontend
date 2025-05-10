<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Campanha {{ campaignId }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const campaignId = route.params.id
</script>
