<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
  <CMSItemTable type-name="User" :fields="tableFields" :data="tableData" @create="createUser" />
</template>

<script setup lang="ts">
import {NInput} from "naive-ui";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import CMSItemTable from "@/components/dashboard/CMSItemTable.vue";
import type {CMSField, CMSItem} from "@/util/helper";
import type {User} from "@/graphql/types";
import {h} from "vue";


const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Users', route: '/dashboard/users'}
];

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

const tableData: CMSItem<User>[] = [
  {
    id: 1,
    editable: true,
    deletable: true,
    data: {
      username: 'bowerj5',
      mail: 'bowerj5@rpi.edu',
      person: {
        name: 'Joseph',
      },
      discord: '1358318523584235'
    },
    edit: (data) => {
      console.log('edit bowers')
      console.log(data);
    },
    delete: () => {
      console.log('delete bowers')
    },
    deleteMessage() {
      return 'Are you sure you want to delete User "bowerj5"? This is irreversible.'
    }
  }
]

function createUser(data: any) {
  console.log('create user')
  console.log(data);
}

</script>

<style scoped lang="scss">

</style>
