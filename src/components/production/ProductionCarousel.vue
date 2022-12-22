<template>
  <div v-if="items.length > 0">
    <n-carousel ref="carousel" class="aspect-ratio">
      <div v-for="item of items">
        <div v-if="item.__typename === 'Image'">
          <img :src="item.path" :alt="item.name" />
        </div>
        <div v-else>
          <iframe class="videoplayer" :src="item.metadata.url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </n-carousel>
    <n-space justify="space-between" v-if="items.length > 1">
      <n-button text class="left carouselbtns" @click="prev">
        &#10140;
      </n-button>
      <n-button text class="carouselbtns" @click="next">
        &#10140;
      </n-button>
    </n-space>
  </div>
  <div v-else>
    <p class="no-media">No images or videos available.</p>
  </div>
</template>

<script setup lang="ts">
import type {Image, Video} from "@/graphql/types";
import type {PropType} from "vue";
import {ref, watchEffect} from "vue";
import {NCarousel, NSpace, NButton} from "naive-ui";

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

watchEffect(() => {
  console.log(props.items);
})

const carousel = ref<InstanceType<typeof NCarousel> | null>(null);

// Components don't load in fast enough for refs so we need to use functions instead of just calling their methods
function prev() {
  carousel.value?.prev();
}

function next() {
  carousel.value?.next();
}
</script>

<style scoped lang="scss">
.aspect-ratio {
  aspect-ratio: 16 / 9;
  background-color: black;
  height: 100%;
  width: 100%;
}
img {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
}
.videoplayer {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
}

.carouselbtns {
  font-size: 28px;
}

.left {
  transform: rotate(180deg);
}

.no-media {
  text-align: center;
  font-style: italic;
}
</style>
