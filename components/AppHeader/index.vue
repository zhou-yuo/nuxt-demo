<template>
  <div class="app-header flex items-center justify-between">
    <h1 class="text-xl font-bold">App Header</h1>

    <ul class="flex">
      <li class="ml-16px" v-for="item in menu">
        <NuxtLink :to="item.path">{{ item.name }}</NuxtLink>
      </li>
    </ul>
  </div>  
</template>

<script setup>
import { reactive } from "vue"

const menu = reactive([
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/posts/1', name: 'Posts1' },
  { path: '/posts/2', name: 'Posts2' },
  { path: '/login', name: 'Logout' },
])

</script>

<style lang="scss">
.app-header {
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, .75);
  border-bottom: 1px solid #E2E8F1;
}
</style>