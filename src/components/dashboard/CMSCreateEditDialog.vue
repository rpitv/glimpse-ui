<template>
  <div class="wrapper">
    <n-card class="create-modal-card">
      <h1>{{modeText}} {{typeName}}</h1>
      <n-form ref="formRef" :model="data" @input="formChanged" :rules="allFormRules">
        <n-form-item v-for="field of fieldsToShow" :label="field.name" :key="field.key" :path="field.key">
          <component v-if="field.renderEditInput" :is="field.renderEditInput()" v-model:value="inputData[field.key]" @keyup="keyPressedOnInput" />
        </n-form-item>
      </n-form>
      <template #action>
        <div class="create-action-buttons">
          <n-button type="default" @click="emit('close')">Cancel</n-button>
          <n-button :disabled="!isFormValid" type="success" @click="emit('create')">{{modeText}} {{typeName}}</n-button>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NForm, NFormItem, NButton, FormItemRule, FormValidationError} from "naive-ui";
import {CMSField} from "@/util/helper";
import {computed, onMounted, PropType, ref} from "vue";

const formRef = ref<typeof NForm|null>(null);
const isFormValid = ref<boolean>(false);

onMounted(() => {
  updateValidation();
  formRef.value?.restoreValidation();
});

function updateValidation() {
  if(!formRef.value) {
    return;
  }
  formRef.value.validate((errors: FormValidationError[]) => {
    isFormValid.value = !errors || errors.length === 0;
  });
}

function formChanged() {
  emit('update:data', inputData.value);
  updateValidation();
}

function keyPressedOnInput(e: KeyboardEvent) {
  if(e.key === 'Enter') {
    updateValidation();
    if(isFormValid.value) {
      emit('create');
    }
  }
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

const fieldsToShow = computed(() => props.fields.filter(field => {
  if (props.mode === 'edit') {
    return field.editable;
  } else {
    return field.creatable;
  }
}));

const allFormRules = computed(() => {
  const rules: Record<string, FormItemRule | FormItemRule[]> = {};
  for (const field of fieldsToShow.value) {
    if(field.rules) {
      rules[<string>field.key] = field.rules;
    }
  }
  return rules;
});
</script>

<style scoped lang="scss">
.wrapper {
  width: min(500px, 90%);
}
.create-action-buttons {
  * {
    float: right;
    margin-right: 10px;
  }
}
</style>
