<template>
  <div>
    <div class="avatar-container">
      <n-avatar size="300" v-if="person.profilePicture?.path" :src="person.profilePicture.path"></n-avatar>
      <n-avatar size="300" v-else src="/default_thumbnail_300.png" />
    </div>
    <p class="name">{{person.name}}</p>
    <p v-if="displayedRole" class="role">{{displayedRole}}</p>
  </div>
</template>

<script setup lang="ts">
import { Person } from "@/graphql/types";
import type { PropType } from "vue";
import {NAvatar} from "naive-ui";


defineProps({
  person: {
    type: Object as PropType<Person>,
    required: true
  },
  displayedRole: {
    type: String
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
