<template>
  <div class="home-page">
    <img src="~/assets/img/nuxt_logo.png" class="logo" alt="">
    <AppAlert>
      欢迎来到首页
    </AppAlert>
  </div>
</template>

<script setup>
import { ref } from "vue"

</script>

<style lang="scss">
.home-page {
  text-align: center;
  .logo {
    height: 64px;
    margin-bottom: 20px;
  }
}
</style>