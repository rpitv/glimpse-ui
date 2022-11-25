<template>
  <div>
    <div>
      <n-modal v-model:show="editDialogOpen">
        <CMSCreateEditDialog :mode="editDialogMode" :type-name="typeName" :fields="fields" v-model:data="editDialogData" @create="itemCreatedCallback" @close="editDialogOpen = false" />
      </n-modal>
    </div>
    <div class="table-card-wrapper">
      <n-card class="table-card">
        <!-- FIXME v-if -->
        <n-button v-if="ability.can(AbilityActions.Create, AbilitySubjects.Group)"
                  @click="createCallback"
                  strong secondary round large type="success" class="create-button">
          <template #icon>
            <FontAwesomeIcon icon="fal fa-plus"/>
          </template>
          Create
        </n-button>

        <n-data-table
          remote
          striped
          :columns="tableColumns"
          :data="tableData"/>

        <!-- TODO -->
        <!--        :pagination="tablePaginationOptions"-->
        <!--        :loading="isTableLoading"-->
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">

import {NCard, NButton, NDataTable, NModal, useDialog} from "naive-ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {PropType} from "vue";
import type {CMSField} from "@/util/helper";
import {useGlimpseAbility} from "@/casl";
import {AbilityActions, AbilitySubjects} from "@/graphql/types";
import {computed, h, ref} from "vue";
import type {RowData} from "naive-ui/es/data-table/src/interface";
import type {Type} from "naive-ui/es/button/src/interface";
import CMSCreateEditDialog from "@/components/dashboard/CMSCreateEditDialog.vue";

const ability = useGlimpseAbility();
const dialog = useDialog()

const props = defineProps({
  typeName: {
    required: true,
    type: String
  },
  fields: {
    required: true,
    type: Array as PropType<CMSField<any>[]>
  },
  data: {
    required: true,
    type: Array as PropType<any[]>
  }
})

const editDialogMode = ref<"create" | "edit">("create")
const editDialogData = ref<Record<string, any>>({});
const editDialogOpen = ref<boolean>(false);

const tableColumns = computed(() => {
  const selectedColumns = props.fields.filter(field => field.readable).map((field) => {
    return {
      title: field.name,
      key: field.key,
      render(row: RowData) {
        return h("span", {}, row.data[field.key]);
      }
    }
  })

  type RowAction = {
    name: string,
    enabled: boolean | ((rowData: RowData) => boolean),
    onClick: (row: RowData) => void,
    buttonType: Type
  };

  const actions: RowAction[] = [
    {
      name: "Edit",
      enabled: (row: RowData) => row.editable,
      onClick(row: RowData) {
        editCallback(row);
      },
      buttonType: "default"
    },
    {
      name: "Delete",
      enabled: (row: RowData) => row.deletable,
      onClick(row: RowData) {
        deleteCallback(row);
      },
      buttonType: "error"
    }
  ]

  const actionsColumn = {
    key: 'actions',
    title: 'Actions',
    render(row: RowData) {
      const buttons = [];

      for(const action of actions) {
        const enabled = typeof action.enabled === "boolean" ? action.enabled : action.enabled(row);
        buttons.push(h(
          NButton,
          {
            disabled: !enabled,
            title: !enabled ? `You do not have permission to ${action.name.toLowerCase()} this ${props.typeName}` : '',
            style: 'margin: 0.5em 0.5em 0.5em 0;',
            type: action.buttonType,
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => action.onClick(row)
          },
          {default: () => action.name}
        ))
      }

      return h('div', {}, buttons);
    }
  };

  return [...selectedColumns, actionsColumn];
});

const tableData = computed(() => {
  return props.data;
});

function createCallback() {
  editDialogMode.value = "create";
  editDialogData.value = {};
  editDialogOpen.value = true;
}

function itemCreatedCallback() {
  console.log(editDialogData.value)
}

function editCallback(row: RowData) {
  editDialogMode.value = "edit";
  editDialogData.value = row.data;
  editDialogOpen.value = true;
}

function deleteCallback(row: RowData) {
  dialog.warning({
    title: "Delete User",
    content: row.deleteMessage(row),
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick() {
      row.delete();
    }
  });
}
</script>

<style scoped lang="scss">
.create-button {
  margin-bottom: 10px;
  float: right;
}
</style>
