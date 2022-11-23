<template>

</template>

<script setup lang="ts">
import type {PropType} from "vue";
import type {Credit} from "@/graphql/types";

const props = defineProps({
  credits: {
    type: Array as PropType<Pick<Credit, "__typename" | "title" | "priority" | "person">[]>,
    required: true
  }
});
</script>

<style scoped lang="scss">

</style>
