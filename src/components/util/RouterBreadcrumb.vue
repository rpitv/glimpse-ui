<template>
  <div class="dashboard-breadcrumb">
    <n-breadcrumb>
      <n-breadcrumb-item
        v-for="item of breadcrumbRouteExceptLast"
        :key="item.name"
        separator="»"
      >
        <RouterLink
          v-if="item.route"
          :to="item.route"
          class="breadcrumb-item-link"
        >
          {{ item.name }}
        </RouterLink>
        <span v-else>{{ item.name }}</span>
      </n-breadcrumb-item>
      <span class="last-breadcrumb-item">{{
        breadcrumbRoute[breadcrumbRoute.length - 1].name
      }}</span>
    </n-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from "naive-ui";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

if (!route.meta?.breadcrumb) {
  throw new Error(
    "Route must have a breadcrumb metadata property for RouterBreadcrumb to be used."
  );
}

const breadcrumbRoute = computed(() => {
  const breadcrumb = route.meta.breadcrumb;
  if (typeof breadcrumb === "function") {
    return breadcrumb(route);
  } else if (Array.isArray(breadcrumb)) {
    return breadcrumb;
  } else {
    throw new Error(
      "Breadcrumb metadata value must be of the type () => {name: string, route: RouteLocationRaw}[] | {name: string, route: RouteLocationRaw}[]."
    );
  }
});

// We create a NaiveUI breadcrumb item for each item except the last one, which is a larger font size span.
const breadcrumbRouteExceptLast = computed(() => {
  const routeCopy = [...breadcrumbRoute.value];
  routeCopy.pop();
  return routeCopy;
});
</script>

<style scoped lang="scss">
.dashboard-breadcrumb {
  margin-bottom: 25px;
}
.last-breadcrumb-item {
  font-size: 2em;
  position: relative;
  top: 0.2em;
}
.breadcrumb-item-link {
  color: inherit;
}
</style>
