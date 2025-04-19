<template>
  
</template>

<script setup lang="ts">
import requests from '@/services/requests';
import { reactive } from 'vue';
import { userAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const user = reactive({
  email: "",
  password: ""
});

const authStore = userAuthStore();
const rememberMe = ref(false)
const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function login() {
  try {
    const {data} = await requests.post('users/login/', user);

    authStore.setToken(data.token);
  } catch (error) {
    console.error('Error Login:', error);
  }
};
</script>

<style lang="scss" scoped>

</style>
