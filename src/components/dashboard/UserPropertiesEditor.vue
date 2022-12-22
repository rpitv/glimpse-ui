<template>
  <div>
    <n-grid cols="1 s:1 m:2" responsive="screen" :x-gap="10">
      <n-grid-item>
        <h2>Groups</h2>
        <CMSItemSelector :displayed-rows="displayedRows" :selected-rows="selectedRows"
                         :loading="userGroups.loading.value || allGroups.loading.value"
                         :total-items="allGroups.result.value?.groupCount ?? 0"
                         v-model:current-page="tableCurrentPage"
                         v-model:page-size="tablePageSize"
                         @add="groupAdded"
                         @remove="groupRemoved"
        />
      </n-grid-item>
      <n-grid-item>
        <h2>Permissions</h2>
        <PermissionsEditor :value="user.data.permissions" @create="permissionCreated" @delete="permissionDeleted" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import type {User, UserPermission} from "@/graphql/types";
import type {PropType} from "vue";
import type {CMSItem, CMSSelectionRow} from "@/util/helper";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {
  AbilityActions, AbilitySubjects,
  CreateUserGroupDocument,
  DeleteUserGroupDocument,
  GetAllGroupNamesDocument,
  GetUserGroupsDocument
} from "@/graphql/types";
import CMSItemSelector from "@/components/dashboard/CMSItemSelector.vue";
import {computed, ref} from "vue";
import PermissionsEditor from "@/components/dashboard/PermissionsEditor.vue";

const props = defineProps({
  user: {
    required: true,
    type: Object as PropType<CMSItem<User>>
  }
});

const emit = defineEmits(['change']);

const tablePageSize = ref<number>(2);
const tableCurrentPage = ref<number>(1);

const deleteUserGroupMut = useMutation(DeleteUserGroupDocument);
deleteUserGroupMut.onDone(() => {
  userGroups.refetch();
});
const createUserGroupMut = useMutation(CreateUserGroupDocument);
createUserGroupMut.onDone(() => {
  userGroups.refetch();
});
const userGroups = useQuery(GetUserGroupsDocument, {
  user: props.user.id
});
const allGroupsVars = computed(() => {
  return {
    pagination: {
      take: tablePageSize.value,
      skip: (tableCurrentPage.value - 1) * tablePageSize.value
    }
  }
})
const allGroups = useQuery(GetAllGroupNamesDocument, allGroupsVars)

const displayedRows = computed<CMSSelectionRow[]>(() => {
  return allGroups.result.value?.GetAllGroupNames.map((group) => {
    return {
      key: group.id,
      label: group.name
    }
  }) ?? [];
});

const selectedRows = computed<CMSSelectionRow[]>(() => {
  return userGroups.result.value?.User?.groups?.map((group) => {
    return {
      key: group.group.id,
      label: group.group.name
    }
  }) ?? [];
});

function groupAdded(group: CMSSelectionRow) {
  createUserGroupMut.mutate({
    userId: props.user.id,
    groupId: group.key
  });
}

function groupRemoved(group: CMSSelectionRow) {
  const userGroup = userGroups.result.value?.User?.groups?.find((userGroup) => {
    return userGroup.group.id === group.key;
  });
if (userGroup) {
    deleteUserGroupMut.mutate({
      id: userGroup.id
    });
  }
}

function permissionCreated(action: AbilityActions, subject: AbilitySubjects[]) {
console.log(action, subject);
}

function permissionDeleted(permission: UserPermission) {
console.log(permission);
}
</script>

<style scoped lang="scss">
h2 {
  margin: 0 0 1em;
}
</style>
