<template>
<div class="aspect-ratio">

</div>
</template>

<script setup lang="ts">
import type {Image, Video} from "@/graphql/types";
import type {PropType} from "vue";

const props = defineProps({
  items: {
    type: Array as PropType<
      (
        Pick<Video, "__typename" | "name" | "format" | "metadata"> |
        Pick<Image, "__typename" | "name" | "description" | "path">
        )[]>,
    required: true
  }
});


</script>

<style scoped lang="scss">
.aspect-ratio {
  aspect-ratio: 16/9;
  background: black;
}
</style>
