<template>
<div>
  <ProductionCarousel />
  <h1>{{ production.result.value?.ReadProduction?.name }}</h1>
  <span>
    {{production.result.value?.ReadProduction?.category?.name}}
    •
    {{ production.result.value?.ReadProduction.startTime }}
  </span>
  <p>{{production.result.value?.ReadProduction.description}}</p>
  <ProductionCredits />
  <ProductionTags />
</div>
</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {useQuery} from "@vue/apollo-composable";
import {ReadProductionDocument} from "@/graphql/types";
import ProductionTags from "@/components/production/ProductionTags.vue";
import ProductionCredits from "@/components/production/ProductionCredits.vue";
import ProductionCarousel from "@/components/production/ProductionCarousel.vue";

const route = useRoute();

const production = useQuery(ReadProductionDocument, {
  id: route.params.id.toString()
});
</script>

<style scoped lang="scss">

</style>
