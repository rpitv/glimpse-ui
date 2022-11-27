<template>
  <div class="wrapper">
    <div>
      <div>
        <ChangePasswordDialog
          v-model:show="showChangePasswordDialog"
          :require-current="false"
          @submit="passwordChanged"
        />
      </div>
      <CMSItemTable
        type-name="User"
        :fields="tableFields"
        :data="tableData"
        :creatable="ability.can(AbilityActions.Create, AbilitySubjects.User)"
        v-model:page-size="tablePageSize"
        v-model:current-page="tableCurrentPage"
        :total-items="users.result.value?.userCount ?? 0"
        :loading="users.loading.value"
        :extra-actions="extraActions"
        :expanded-row="renderExpandedRow"
        @create="createUser"
      >
        <template #header>
          <DashboardBreadcrumb :route="breadcrumbRoute"/>
        </template>
      </CMSItemTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {NInput, NSelect, useMessage} from "naive-ui";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import CMSItemTable from "@/components/dashboard/CMSItemTable.vue";
import type {CMSField, CMSItem, DeepPartial} from "@/util/helper";
import type {Person, User} from "@/graphql/types";
import {computed, h, ref, Ref, VNode} from "vue";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {
  AbilityActions,
  AbilitySubjects,
  CreateNewUserDocument, DeleteUserDocument,
  EditUserDocument, GetAllPeopleDocument,
  GetAllUsersDocument
} from "@/graphql/types";
import {useGlimpseAbility} from "@/casl";
import {subject} from "@casl/ability";
import type {RowData} from "naive-ui/es/data-table/src/interface";
import ChangePasswordDialog from "@/components/ChangePasswordDialog.vue";
import UserPropertiesEditor from "@/components/dashboard/UserPropertiesEditor.vue";
import {RouterLink} from "vue-router";

const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Users', route: '/dashboard/users'}
];

const changePasswordDialogIsFor = ref<RowData|null>(null);
const showChangePasswordDialog = ref<boolean>(false);
const tablePageSize = ref<number>(20);
const tableCurrentPage = ref<number>(1);
const extraActions = [{
  name: 'Change Password',
  type: 'info',
  enabled(row: RowData) {
    return ability.can(AbilityActions.Update, subject(AbilitySubjects.User, row), 'password');
  },
  callback(row: RowData) {
    console.log(row);
    changePasswordDialogIsFor.value = row;
    showChangePasswordDialog.value = true;
  }
}]

const ability = useGlimpseAbility();
const message = useMessage();
const updateMut = useMutation(EditUserDocument);
updateMut.onDone(() => {
  users.refetch();
});
updateMut.onError((error) => {
  console.error(error);
  message.error('Failed to update user');
});
const deleteMut = useMutation(DeleteUserDocument);
deleteMut.onDone(() => {
  users.refetch();
});
deleteMut.onError((error) => {
  console.error(error);
  message.error('Failed to delete user');
});
const createMut = useMutation(CreateNewUserDocument);
createMut.onDone(() => {
  users.refetch();
});
createMut.onError((error) => {
  console.error(error);
  message.error('Failed to create user');
});
const getAllUsersArgs = computed(() => {
  return {
    pagination: {
      take: tablePageSize.value,
      skip: (tableCurrentPage.value - 1) * tablePageSize.value
    }
  }
})
const users = useQuery(GetAllUsersDocument, getAllUsersArgs);
users.onError((error) => {
  console.error(error);
  message.error('Failed to fetch users');
});
const people = useQuery(GetAllPeopleDocument, { pagination: { take: 100 }});
people.onError((error) => {
  console.error(error);
  message.error('Failed to fetch people');
});

const peopleDropdownOptions = computed(() => {
  return people.result.value?.GetAllPeople.map((person) => {
    return {
      label: person.name,
      value: person.id
    }
  }) ?? [];
});

function onPeopleDropdownScroll(event: Event) {
  const target = event.currentTarget as HTMLElement;
  // When we're within 10px of the bottom of the scroll window, attempt to fetch more people.
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    // If we're already fetching more results, or we've fetched all the results, don't fetch more
    if(people.loading.value || (people.result.value?.GetAllPeople.length ?? 0) >= (people.result.value?.personCount ?? 0)) {
      return;
    }

    people.fetchMore({
      variables: {
        pagination: {
          take: 100,
          cursor: people.result?.value?.GetAllPeople[people.result?.value?.GetAllPeople.length - 1]?.id
        }
      },
      updateQuery(previousResult, {fetchMoreResult}) {
        // Filter out people which are already in the list
        let peopleToAdd = fetchMoreResult?.GetAllPeople || [];
        peopleToAdd = peopleToAdd.filter((group: any) => !previousResult.GetAllPeople.find((previousPerson: any) => previousPerson.id === group.id));
        // Combine the previous list with the list of just fetched groups
        return {
          personCount: fetchMoreResult?.personCount ?? 0,
          GetAllPeople: [
            ...previousResult.GetAllPeople,
            ...peopleToAdd
          ]
        }
      }
    });
  }
}

function renderExpandedRow(row: RowData): VNode {
  return h(UserPropertiesEditor, {
    user: row
  });
}

const tableFields: CMSField<User>[] = [
  {
    name: 'ID',
    key: 'id',
    readable: true,
    creatable: false,
    editable: false
  },
  {
    name: 'Username',
    key: 'username',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {maxlength: 8, showCount: true});
    },
    rules: [
      {required: true, message: 'Username is required', trigger: ['blur', 'input']},
      {max: 8, message: 'Username must be at most 8 characters', trigger: ['blur', 'input']}
    ]
  },
  {
    name: 'Email',
    key: 'mail',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {maxlength: 300});
    },
    rules: [
      {required: true, message: 'Email is required', trigger: ['blur', 'input']},
      {message: 'Must be a valid email address', type: 'email', trigger: ['blur', 'input']}
    ]
  },
  {
    name: 'Person',
    key: 'person',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NSelect, {'onScroll': onPeopleDropdownScroll, options: peopleDropdownOptions.value, clearable: true});
    },
    renderTableCell(row: RowData) {
      if(!row.person) {
        return '';
      }
      return h(RouterLink, {to: `/dashboard/people/${row.person.id}`}, {
        default: () => row.person.name
      });
    },
    inputValueTransformer(value: Person|null) {
      if(!value) {
        return null;
      }
      return value.id;
    },
    outputValueTransformer(value: string|null) {
      if(!value) {
        return null;
      }
      return {id: value};
    },
  },
  {
    name: 'Discord',
    key: 'discord',
    readable: false,
    creatable: false,
    editable: false,
    renderEditInput: () => {
      return h(NInput);
    },
  }
]

const tableData: Ref<CMSItem<User>[]> = computed(() => {
  return users.result.value?.GetAllUsers.map((user): CMSItem<User> => {
    return {
      id: user.id,
      data: {...user},
      editable: ability.can(AbilityActions.Update, subject(AbilitySubjects.User, {...user})),
      deletable: ability.can(AbilityActions.Delete, subject(AbilitySubjects.User, {...user})),
      edit(data: DeepPartial<User>) {
        updateMut.mutate({
          id: user.id,
          input: {
            username: data.username === user.username ? undefined : data.username ?? null,
            mail: data.mail === user.mail ? undefined : data.mail ?? null,
            personId: data.person?.id === user.person?.id ? undefined : data.person?.id ?? null,
            discord: data.discord === user.discord ? undefined : data.discord ?? null,
          }
        });
      },
      delete() {
        deleteMut.mutate({id: user.id});
      },
      deleteMessage() {
        return `Are you sure you want to delete User "${user.username}"? This is irreversible.`
      }
    }
  }) ?? [];
});

function createUser(data: any) {
  createMut.mutate({
    input: {
      username: data.username,
      mail: data.mail,
      personId: data.person?.id,
    }
  });
}

function passwordChanged({newPassword}: {newPassword: string, currentPassword?: string}) {
  if (changePasswordDialogIsFor.value) {
    updateMut.mutate({
      id: changePasswordDialogIsFor.value.id,
      input: {
        password: newPassword
      }
    });
    showChangePasswordDialog.value = false;
  }
}

</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  & > div {
    width: 80%;
  }
  margin-top: 5em;
  margin-bottom: 5em;
}
</style>
