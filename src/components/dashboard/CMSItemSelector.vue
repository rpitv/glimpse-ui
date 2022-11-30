<template>
  <div>
    <n-data-table
      :loading="loading"
      :columns="tableColumns"
      :data="tableData"
      v-model:checked-row-keys="checkedRows"
      striped
    />
    <n-pagination
      :item-count="totalItems"
      :page="currentPage"
      :page-size="pageSize"
      @update:page="emit('update:current-page', $event)"
      @update:page-size="emit('update:page-size', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import {NDataTable, NPagination} from "naive-ui";
import type {PropType} from "vue";
import {computed} from "vue";
import type {CMSSelectionRow} from "@/util/helper";

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  selectedRows: {
    type: Array as PropType<CMSSelectionRow[]>,
    required: true
  },
  displayedRows: {
    type: Object as PropType<CMSSelectionRow[]>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalItems: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['add', 'remove', 'update:current-page', 'update:page-size'])

const tableColumns = [
  {
    type: 'selection',
    multiple: props.multiple
  },
  {
    title: 'Name',
    key: 'name'
  }
]

const tableData = computed(() => {
  const selectedRows = props.selectedRows.map(value => {
    return {
      key: value.key,
      name: value.label
    }
  });

  const displayedRows = props.displayedRows.map(value => {
    return {
      key: value.key,
      name: value.label
    }
  });

  const allRows = selectedRows.concat(displayedRows);
  return allRows.filter((value, index, self) => {
    return self.findIndex(v => v.key === value.key) === index;
  });
})

const checkedRows = computed({
  get: () => {
    return props.selectedRows.map(value => value.key)
  },
  set: (newValue: string[]) => {
    // Get the list of rows which are selected now but weren't selected before.
    //  This list is just a list of IDs so we map it to the actual row object.
    const addedRows = newValue
      .filter(value => !props.selectedRows.map(v => v.key).includes(value))
      .map(id => props.displayedRows.find(value => value.key === id));

    // Get the list of rows which are not selected now but were selected before.
    const removedRows = props.selectedRows
      .filter(value => !newValue.includes(value.key));

    for(const row of addedRows) {
      emit('add', row);
    }
    for(const row of removedRows) {
      emit('remove', row);
    }
  }
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
</script>

<style scoped lang="scss">
</style>
