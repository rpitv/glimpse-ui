<template>

</template>

<script setup lang="ts">

import type {PropType} from "vue";

const props = defineProps({
  tags: {
    type: Array as PropType<string[]>,
    required: true
  }
})
</script>

<style scoped lang="scss">

</style>
