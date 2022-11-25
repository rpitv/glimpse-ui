<template>
  <div>
    <n-card class="create-modal-card">
      <h1>{{modeText}} {{typeName}}</h1>
      <n-form :model="data" @change="formChanged">
        <n-form-item v-for="field of fields" :label="field.name" :key="field.key">
          <component :is="field.renderEditInput()" v-model:value="inputData[field.key]" />
        </n-form-item>
      </n-form>
      <template #action>
        <div class="create-action-buttons">
          <n-button type="default" @click="emit('close')">Cancel</n-button>
          <n-button type="success" @click="emit('create')">{{modeText}} {{typeName}}</n-button>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NForm, NFormItem, NButton} from "naive-ui";
import {CMSField} from "@/util/helper";
import {computed, PropType, ref} from "vue";

function formChanged() {
  emit('update:data', inputData.value);
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
  data: {
    required: true,
    type: Object as PropType<Record<string, string>>
  },
  mode: {
    required: true,
    type: String as PropType<'edit' | 'create'>
  }
});

const emit = defineEmits(['create', 'close', 'update:data'])

const inputData = ref<Record<string, any>>(props.data);

const modeText = computed(() => props.mode === 'edit' ? 'Edit' : 'Create');
</script>

<style scoped lang="scss">
.create-action-buttons {
  * {
    float: right;
    margin-right: 10px;
  }
}
</style>
