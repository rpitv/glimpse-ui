<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
  <CMSItemTable
    type-name="User"
    :fields="tableFields"
    :data="tableData"
    :creatable="ability.can(AbilityActions.Create, AbilitySubjects.User)"
    v-model:page-size="tablePageSize"
    v-model:current-page="tableCurrentPage"
    :total-items="users.result.value?.userCount ?? 0"
    :loading="users.loading.value"
    @create="createUser"
  />
</template>

<script setup lang="ts">
import {NInput} from "naive-ui";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import CMSItemTable from "@/components/dashboard/CMSItemTable.vue";
import type {CMSField, CMSItem, DeepPartial} from "@/util/helper";
import type {User, UserUpdateInput} from "@/graphql/types";
import {computed, h, ref, Ref} from "vue";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {
  AbilityActions,
  AbilitySubjects,
  CreateNewUserDocument, DeleteUserDocument,
  EditUserDocument,
  GetAllUsersDashboardDocument
} from "@/graphql/types";
import {useGlimpseAbility} from "@/casl";
import {subject} from "@casl/ability";

const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Users', route: '/dashboard/users'}
];

const tablePageSize = ref<number>(20);
const tableCurrentPage = ref<number>(1);

const ability = useGlimpseAbility();
const updateUserMut = useMutation(EditUserDocument);
updateUserMut.onDone(() => {
  users.refetch();
});
const deleteUserMut = useMutation(DeleteUserDocument);
deleteUserMut.onDone(() => {
  users.refetch();
});
const createUserMut = useMutation(CreateNewUserDocument);
createUserMut.onDone(() => {
  users.refetch();
});
const getAllUsersArgs = computed(() => {
  return {
    pagination: {
      take: tablePageSize.value,
      skip: (tableCurrentPage.value - 1) * tablePageSize.value
    }
  }
})
const users = useQuery(GetAllUsersDashboardDocument, getAllUsersArgs);

const tableFields: CMSField<User>[] = [
  {
    name: 'Username',
    key: 'username',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {label: 'Username'});
    },
  },
  {
    name: 'Email',
    key: 'mail',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {label: 'Email'});
    },
  },
  {
    name: 'Person',
    key: 'person',
    readable: false,
    creatable: false,
    editable: false,
    renderEditInput: () => {
      return h(NInput, {label: 'Person'});
    },
  },
  {
    name: 'Discord',
    key: 'discord',
    readable: false,
    creatable: false,
    editable: false,
    renderEditInput: () => {
      return h(NInput, {label: 'Discord'});
    },
  }
]

const tableData: Ref<CMSItem<User>[]> = computed(() => {
  return users.result.value?.GetAllUsersDashboard.map((user): CMSItem<User> => {
    return {
      id: user.id,
      data: {...user},
      editable: ability.can(AbilityActions.Update, subject(AbilitySubjects.User, {...user})),
      deletable: ability.can(AbilityActions.Delete, subject(AbilitySubjects.User, {...user})),
      edit(data: DeepPartial<User>) {
        if(data.username === user.username) {
          delete data.username;
        }
        if(data.mail === user.mail) {
          delete data.mail;
        }
        if(data.discord === user.discord) {
          delete data.discord;
        }
        if(data.person?.id === user.person?.id) {
          delete data.person;
        }
        const inputData: UserUpdateInput = {
          username: data.username ?? undefined,
          mail: data.mail ?? undefined,
          personId: data.person?.id ?? undefined,
          discord: data.discord ?? undefined
        }
        updateUserMut.mutate({
          id: user.id,
          input: inputData
        });
      },
      delete() {
        deleteUserMut.mutate({id: user.id});
      },
      deleteMessage() {
        return `Are you sure you want to delete User "${user.username}"? This is irreversible.`
      }
    }
  }) ?? [];
});

function createUser(data: any) {
  createUserMut.mutate({
    input: {
      username: data.username,
      mail: data.mail
    }
  });
}

</script>

<style scoped lang="scss">

</style>
