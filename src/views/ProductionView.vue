<template>
  <div class="card-wrapper">
    <n-card class="card">
      <ProductionCarousel :items="sampleItems"/>
      <h1 class="prod-title">{{ production.result.value?.ReadProduction?.name }}</h1>
      <p class="prod-subtitle">{{ productionSubtitle }}</p>
      <p class="prod-description">{{ production.result.value?.ReadProduction?.description }}</p>
      <ProductionCredits :credits="[]"/>
      <ProductionTags :tags="production.result.value?.ReadProduction?.tags.map(tag => tag.tag)"/>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard} from "naive-ui";
import {useRoute} from "vue-router";
import {useQuery} from "@vue/apollo-composable";
import {Image, ReadProductionDocument, Video, VideoFormat} from "@/graphql/types";
import ProductionTags from "@/components/production/ProductionTags.vue";
import ProductionCredits from "@/components/production/ProductionCredits.vue";
import ProductionCarousel from "@/components/production/ProductionCarousel.vue";
import {computed} from "vue";
import moment from "moment";

const route = useRoute();

const production = useQuery(ReadProductionDocument, {
  id: route.params.id.toString()
});

const sampleItems: (
  Pick<Video, "__typename" | "name" | "format" | "metadata"> |
  Pick<Image, "__typename" | "name" | "description" | "path">
  )[] = [
  {
    __typename: "Image",
    name: "Image 1",
    description: "Image 1 description",
    path: "https://picsum.photos/200/300"
  },
  {
    __typename: "Video",
    name: "Video 1",
    format: VideoFormat.Embed,
    metadata: {
      "url": "https://www.youtube.com/embed/P_ckAbOr0r4"
    }
  }
]

/**
 * Subtitle of the production. Contains the category and start date/time of the production, if available.
 *   If both are present, they are separated by a bullet point.
 */
const productionSubtitle = computed<string>(() => {
  const startTime = production.result.value?.ReadProduction?.startTime;
  const category = production.result.value?.ReadProduction?.category;

  const startTimeFormatStr = "MMMM Do YYYY, h:mm A";
  if (startTime && category) {
    return `${category.name} \u2022 ${moment(startTime).format(startTimeFormatStr)}`;
  } else if (startTime) {
    return moment(startTime).format(startTimeFormatStr);
  } else if (category) {
    return category.name || "";
  } else {
    return "";
  }
})
</script>

<style scoped lang="scss">
.card-wrapper {
  padding-top: 5em;
  display: flex;
  justify-content: center;
}
.card {
  height: 100%;
  width: 65%;
  margin-bottom: 3em;
}

.prod-title, .prod-subtitle {
  margin: 0;
}

.prod-subtitle {
  font-size: 1.1em;
  font-weight: 500;
  font-style: italic;
  opacity: 75%;
}
</style>
