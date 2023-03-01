<template>
  <div v-for="person in role.people">
    <div class="avatar-container">
      <n-avatar size="300" v-if="person.person.profilePicture?.path" :src="person.person.profilePicture.path"></n-avatar>
      <n-avatar size="300" v-else src="/default_thumbnail_300.png" />
    </div>
    <p class="name">{{person.person.name}}</p>
    <p class="name">{{role.name}}</p>
  </div>
</template>

<script setup lang="ts">
import { Role } from "@/graphql/types"
import type { PropType } from "vue";
import {NAvatar} from "naive-ui";


defineProps({
  role: {
    type: Object as PropType<Role>,
    required: true
  }
})
</script>

<style scoped lang="scss">
.avatar-container {
  display: flex;
  justify-content: center;
}
.name {
  text-align: center;
}
</style>
