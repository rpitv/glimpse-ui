<template>
  <div>
    <router-view />
    <UserList
      v-if="routeStore.hasSwitchedRoutes || route.name === 'dashboard-users'"
    />
  </div>
</template>

<script setup lang="ts">
import UserList from "@/components/user/UserList.vue";
import { useRouteStore } from "@/stores/route";
import { useRoute } from "vue-router";

const route = useRoute();
const routeStore = useRouteStore();
</script>

<style lang="scss"></style>
