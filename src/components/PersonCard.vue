<template>
  <div>
    <div class="avatar-container">
      <img style="max-width: 250px" v-if="person.profilePicture?.path" :src="person.profilePicture.path" />
      <img style="max-width: 250px" v-else src="/default_thumbnail_300.png" />
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
  font-weight: bold;
}
.role {
  text-align: center;
  color: #ff7676;
}
</style>
