<template>
<n-carousel class="aspect-ratio">
  <div v-for="item of items">
    <div v-if="item.__typename === 'Image'">
      <img :src="item.path" :alt="item.name" />
    </div>
    <div v-else>
      <iframe class="videoplayer" :src="item.metadata.url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</n-carousel>
</template>

<script setup lang="ts">
import type {Image, Video} from "@/graphql/types";
import type {PropType} from "vue";
import {NCarousel} from "naive-ui";

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
img {
  width: 100%;
  height: 100%;
}
.videoplayer {
  width: 100%;
  height: 1000px; // FIXME
}
</style>
