<template>
  <div v-if="incomplete">
    <Incomplete />
  </div>
</template>

<script setup lang="ts">

import Incomplete from "@/components/Incomplete.vue";
import { ref } from "vue";

const incomplete = ref<boolean>(true);

</script>

<style scoped lang="scss">

</style>
