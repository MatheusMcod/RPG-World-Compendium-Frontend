<template>
  <div>
    <h2>Teste</h2>
    <div v-if="user">
      <p><strong>Nome:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/services/requests';

interface User {
  id: number;
  name: string;
  email: string;
}

const user = ref<User | null>(null);

onMounted(async () => {
  try {
    const { data } = await axiosInstance.get<User>('/user/');

    user.value = data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
  }
});
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
