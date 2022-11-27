<template>
  <div>
    <div>
      <n-modal v-model:show="editDialogOpen">
        <CMSCreateEditDialog :mode="editingRow === null ? 'create' : 'edit'" :type-name="typeName" :fields="fields" v-model:data="editDialogData" @create="itemCreatedCallback" @close="editDialogOpen = false" />
      </n-modal>
    </div>
    <div class="table-card-wrapper">
      <n-card class="table-card">
        <n-button v-if="props.creatable"
                  @click="createCallback"
                  strong secondary round large type="success" class="create-button">
          <template #icon>
            <FontAwesomeIcon icon="fal fa-plus"/>
          </template>
          Create
        </n-button>
        <slot name="header"></slot>

        <n-data-table
          remote
          striped
          :columns="tableColumns"
          :data="tableData"
          :loading="props.loading"
          :pagination="tablePaginationOptions"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">

import {NCard, NButton, NDataTable, NModal, useDialog} from "naive-ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {PropType, VNode} from "vue";
import type {CMSField} from "@/util/helper";
import {useGlimpseAbility} from "@/casl";
import {computed, h, ref} from "vue";
import type {RowData} from "naive-ui/es/data-table/src/interface";
import type {Type} from "naive-ui/es/button/src/interface";
import CMSCreateEditDialog from "@/components/dashboard/CMSCreateEditDialog.vue";

const ability = useGlimpseAbility();
const dialog = useDialog()

type ExtraAction = {
  name: string,
  type: Type,
  enabled?: (row: RowData) => boolean,
  callback: (row: RowData) => void
}

const props = defineProps({
  typeName: {
    required: true,
    type: String
  },
  fields: {
    required: true,
    type: Array as PropType<CMSField<any>[]>
  },
  creatable: {
    type: Boolean,
    default: true
  },
  data: {
    required: true,
    type: Array as PropType<any[]>
  },
  totalItems: {
    required: false,
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  extraActions: {
    type: Array as PropType<ExtraAction[]>,
    default: []
  },
  expandedRow: {
    type: Function as PropType<(row: RowData) => VNode | string>
  },
  rowExpandable: {
    type: Function as PropType<(row: RowData) => boolean>
  }
})

const emit = defineEmits(['create', 'update:page-size', 'update:current-page'])

const editingRow = ref<RowData | null>(null);
const editDialogData = ref<Record<string, any>>({});
const editDialogOpen = ref<boolean>(false);

const tableColumns = computed(() => {
  let expansionColumn = [];
  if(props.expandedRow) {
    const renderExpandedRow = props.expandedRow;
    expansionColumn.push(
      {
        type: 'expand',
        expandable: (rowData: RowData) => props.rowExpandable ? props.rowExpandable(rowData) : true,
        renderExpand: (rowData: RowData) => {
          return renderExpandedRow(rowData);
        }
      }
      )
  }

  const selectedColumns = props.fields.filter(field => field.readable).map((field) => {
    return {
      title: field.name,
      key: field.key,
      render(row: RowData) {
        if(field.renderTableCell) {
          return field.renderTableCell(row.data);
        } else {
          return row.data[field.key];
        }
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

  props.extraActions.forEach(action => {
    actions.push({
      name: action.name,
      enabled: (row: RowData) => !action.enabled || action.enabled(row),
      onClick(row: RowData) {
        action.callback(row);
      },
      buttonType: action.type
    })
  })

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

  return [...expansionColumn, ...selectedColumns, actionsColumn];
});

// Map input data to the same object but with the row key. Key is determined to be
//   the "id" field if it exists, otherwise just a random number.
const tableData = computed(() => {
  return props.data.map((row) => {
    return {
      ...row,
      key: row.id ?? Math.random()
    }
  })
})

const tablePaginationOptions = computed(() => ({
  page: props.currentPage,
  pageSize: props.pageSize,
  pageSlot: 5,
  pageCount: Math.max(1, Math.ceil(props.totalItems / props.pageSize)),
  onChange: (page: number) => {
    emit('update:current-page', page);
  },
  onUpdatePageSize: (size: number) => {
    emit('update:page-size', size);
    emit('update:current-page', 1);
  }
}));

function createCallback() {
  editingRow.value = null;
  editDialogData.value = {};
  editDialogOpen.value = true;
}

function itemCreatedCallback() {
  editDialogOpen.value = false;
  if(editingRow.value === null) {
    emit('create', editDialogData.value);
  } else {
    editingRow.value.edit(editDialogData.value);
  }
}

function editCallback(row: RowData) {
  editingRow.value = row;
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
  z-index: 1;
}
</style>
