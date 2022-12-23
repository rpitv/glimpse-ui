<template>
  <h3>Credits</h3>
    <n-grid :cols="3">
        <n-grid-item v-for="credit in credits" :key="credit.id" class="col">
          <!--TODO-->
          <span class="no-display-at-1250">&ensp; </span>
          <n-image v-if="credit.person.images" :src="credit.person.images[0].image" class="profile-icon" width="25"/>
          <n-image v-else width="25" class="profile-icon"
            src="https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg"
          />
          <span class="name">&nbsp;{{ credit.person.name }}</span>
          <span class="no-display-at-1250"> - </span>
          <span class="title">{{ credit.title }}</span>
        </n-grid-item>
    </n-grid>
</template>

<script setup lang="ts">
import type {PropType} from "vue";
import type {Credit} from "@/graphql/types";
import {NGrid, NGridItem, NImage} from "naive-ui";

const props = defineProps({
  credits: {
    type: Array as PropType<Pick<Credit, "__typename" | "title" | "priority" | "person" | "id">[]>,
    required: true
  }
});

</script>

<style scoped lang="scss">

.profile-icon {
  border-radius: 50%;
  display: inline;
  vertical-align: middle;
}

.name {
  font-weight: bold;
}

.col {
  padding: 5px;
}

@media screen and (max-width: 1250px) {
  .col {
    text-align: center;
   }
  .name {
    display: block;
  }
  .no-display-at-1250 {
    display: none;
  }
}

</style>
