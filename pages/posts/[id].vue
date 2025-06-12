<template>
  <div class="post-detail">
    <AppAlert>文章{{ id }}</AppAlert>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue"

const id = ref('')
const Route = useRoute();

onBeforeMount(() => {
  id.value = Route.params.id
})

</script>

<style lang="scss">

</style>