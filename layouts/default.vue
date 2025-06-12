<template>
  <div class="layout-default h-screen flex flex-col overflow-hidden">
    <AppHeader></AppHeader>
    <div class="flex-1 p-16px overflow-hidden">
    <slot></slot>
    </div>
    <AppFooter></AppFooter>
  </div>
</template>

<script setup>
import { ref } from "vue"

</script>

<style lang="scss">

</style>