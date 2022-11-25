<template>
  <div>
    <div>
      <n-modal v-model:show="createPopupVisible">
        <div class="create-modal-card-wrapper">
          <n-card class="create-modal-card">
            <h1>Create Group</h1>
            <n-form :model="createGroupFormInput" :rules="createGroupFormRules">
              <n-form-item label="Name" path="name">
                <n-input v-model:value="createGroupFormInput.name" maxlength="50" show-count />
              </n-form-item>
              <n-form-item label="Priority" path="priority">
                <n-input-number v-model:value="createGroupFormInput.priority"/>
              </n-form-item>
              <n-form-item label="Parent" path="parent">
                <n-input-number v-model:value="createGroupFormInput.parent"/>
              </n-form-item>
            </n-form>
          </n-card>
        </div>
      </n-modal>
    </div>
    <div class="table-card-wrapper">
      <n-card class="table-card">
        <n-button v-if="ability.can(AbilityActions.Create, AbilitySubjects.Group)"
                  @click="createGroup"
                  strong secondary round large type="success" class="create-button">
          <template #icon>
            <FontAwesomeIcon icon="fal fa-plus"/>
          </template>
          Create
        </n-button>

        <DashboardBreadcrumb :route="breadcrumbRoute"/>

        <n-data-table
          remote
          striped
          :columns="tableColumns"
          :pagination="tablePaginationOptions"
          :loading="isTableLoading"
          :data="tableData"/>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import {
  NButton,
  NDataTable,
  NCard,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  useDialog,
  FormItemRule
} from "naive-ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, h, reactive, ref} from "vue";
import {AbilityActions, useGlimpseAbility} from "@/casl";
import {AbilitySubjects} from "@/graphql/types";
import {subject} from "@casl/ability";

type RowData = {
  name: string,
  id: number,
  children?: RowData[]
}

const ability = useGlimpseAbility();
const dialog = useDialog();

const createGroupFormInput = reactive({
  name: "",
  priority: 0,
  parent: 0
});

const createGroupFormRules = reactive({
  name: [
    {
      required: true,
      message: "Name is required"
    },
    {
      validator: (rule: FormItemRule, value: string): boolean => value.length <= 50,
      message: "Name cannot be longer than 50 characters",
      trigger: ["input", "blur"]
    }
  ],
  priority: [
    {
      required: true,
      message: "Priority is required"
    }
  ],
  parent: []
});

function deleteGroup(row: RowData) {
  console.log(row);
  dialog.error({
    title: "Delete Group",
    content: `Are you sure you want to delete the group "${row.name}"? This is irreversible. Current members of this group will be removed from the group.`,
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick() {
      console.log("Delete group");
    }
  });
}

function editGroup(row: RowData) {
  console.log(row);
}

const createPopupVisible = ref<boolean>(false);

function createGroup() {
  createPopupVisible.value = true;
}

const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Groups', route: '/dashboard/groups'}
];

const tableColumns = [
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'name',
    title: 'Name'
  },
  {
    key: 'priority',
    title: 'Priority'
  },
  {
    key: 'actions',
    title: 'Actions',
    render(row: RowData) {
      return h('div', [
        h(
          NButton,
          {
            disabled: !ability.can(AbilityActions.Update, subject(AbilitySubjects.Group, row) as any),
            title: !ability.can(AbilityActions.Update, subject(AbilitySubjects.Group, row) as any) ? 'You do not have permission to edit this Group' : '',
            style: 'margin: 0.5em 0.5em 0.5em 0;',
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => editGroup(row)
          },
          {default: () => 'Edit'}
        ), h(
          NButton,
          {
            disabled: !ability.can(AbilityActions.Delete, subject(AbilitySubjects.Group, row) as any),
            title: !ability.can(AbilityActions.Delete, subject(AbilitySubjects.Group, row) as any) ? 'You do not have permission to delete this Group' : '',
            type: 'error',
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => deleteGroup(row)
          },
          {default: () => 'Delete'}
        )
      ])
    }
  }
];

const tableCurrentPage = ref(1);
const tablePageSize = ref(20);
const tableTotalItems = ref(600); // TODO
const isTableLoading = ref(false);

const tablePaginationOptions = computed(() => ({
  page: tableCurrentPage.value,
  pageSize: tablePageSize.value,
  pageSlot: 5,
  pageCount: Math.max(1, Math.ceil(tableTotalItems.value / tablePageSize.value)),
  onChange: (page: number) => {
    tableCurrentPage.value = page;
  },
  onUpdatePageSize: (size: number) => {
    tablePageSize.value = size;
    tableCurrentPage.value = 1;
  }
}));

const tableData: RowData[] = reactive([ // TODO
  {
    id: 1,
    name: 'Group 1',
    priority: 0
  },
  {
    id: 2,
    name: 'Group 2',
    priority: 0,
    children: [
      {
        id: 3,
        name: "Group 3",
      }
    ]
  },
  {
    id: 3,
    name: 'Group 3',
    priority: 0
  }
]);

</script>

<style scoped lang="scss">
.table-card {
  width: 80%;
  margin-top: 6em;

}

.table-card-wrapper {
  display: flex;
  justify-content: center;
}

.create-button {
  float: right;
  z-index: 10;
}

.create-modal-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;

  .create-modal-card {
    width: 80%;
  }
}
</style>
