<template>
  <div>
    <n-grid :cols="2" :x-gap="10">
      <n-grid-item>
        {{ userGroups.result }}
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import type {User} from "@/graphql/types";
import type {PropType} from "vue";
import type {CMSItem} from "@/util/helper";
import {useQuery} from "@vue/apollo-composable";
import {GetUserGroupsDocument} from "@/graphql/types";

const props = defineProps({
  user: {
    required: true,
    type: Object as PropType<CMSItem<User>>
  }
});

const userGroups = useQuery(GetUserGroupsDocument, {
  user: props.user.id
})
</script>

<style scoped lang="scss">

</style>
