<template>
  <div class="login-page h-screen p-20px flex items-center justify-center">
    <div class="login-container bg-white rounded-sm">
      <div class="font-bold text-center text-lg">Login</div>
      <button type="button" class="login-btn rounded-md block w-full mt-sm" @click="handleLogin()">Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue"
import { useApiFetch } from '~/composables/useApiFetch';

definePageMeta({
  layout: false
})

useHead({
  title: 'Login'
})

const authStore = useAuthStore()

const router = useRouter()

onBeforeMount(() => {
  authStore.removeToken();
})

async function handleLogin() {
 
  try {
    const { data } = await useApiFetch('/api/login')
    console.log("🚀 ~ handleLogin ~ data:", data)
    authStore.setToken(data.token);
    router.push('/')
  } catch(err) {
    console.error(err);
  }
}

</script>

<style lang="scss">
@use '~/assets/css/_colors.scss' as colors;

.login-page {
  .login-container {
    width: 300px;
    padding: 16px 12px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
  }
  .login-btn {
    background-color: colors.$primary-color;
    height: 36px;
    color: #fff;
    transition: background-color .3s;
    &:hover {
      background-color: colors.$primary-light-color;
    }
  }
}
</style>