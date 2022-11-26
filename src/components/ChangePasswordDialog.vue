<template>
  <n-modal :show="show" @update:show="modalShowUpdate">
    <n-card class="change-pass-card">
      <h1>Change Password</h1>
      <n-form ref="formRef" :model="formData" :rules="formRules" @input="onFormInput" @keyup="onFormKeypress">
        <n-form-item v-if="requireCurrent" label="Current Password" path="currentPassword">
          <n-input v-model:value="formData.currentPassword" type="password" />
        </n-form-item>
        <n-form-item label="New Password" path="newPassword">
          <n-input v-model:value="formData.newPassword" type="password" />
        </n-form-item>
        <n-form-item label="Confirm Password" path="confirmPassword">
          <n-input v-model:value="formData.confirmPassword" type="password" />
        </n-form-item>
      </n-form>

      <template #action>
        <div class="action-buttons">
          <n-button :disabled="!isFormValid" type="success" @click="submit">Change Password</n-button>
          <n-button type="default" @click="modalShowUpdate(false)">Cancel</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {NModal, NCard, NInput, NForm, NFormItem, NButton, FormValidationError} from "naive-ui";
import {reactive, ref} from "vue";

const props = defineProps({
  show: {
    required: true,
    type: Boolean
  },
  requireCurrent: {
    type: Boolean,
    default: true
  }
})

const isFormValid = ref<boolean>(false);
const formRef = ref<typeof NForm|null>(null);
const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const formRules = {
  currentPassword: props.requireCurrent ? [
    {
      required: true,
      message: 'Current password is required',
      trigger: 'input'
    }
  ] : [],
  newPassword: [
    {
      required: true,
      message: 'New password is required',
      trigger: 'input'
    },
    {
      min: 8,
      message: 'New password must be at least 8 characters',
      trigger: 'input'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Confirm password is required',
      trigger: 'input'
    },
    {
      message: "Passwords do not match",
      validator: (rule: any, value: string) => value === formData.newPassword,
      trigger: 'input'
    }
  ]
}

const emit = defineEmits(['update:show', 'submit'])

function onFormInput() {
  formRef.value?.validate((errors: FormValidationError[]) => {
    isFormValid.value = !errors || errors.length === 0;
  });
}

function onFormKeypress(e: KeyboardEvent) {
  if(e.key === 'Enter') {
    submit();
  }
}

function resetForm() {
  formData.currentPassword = '';
  formData.newPassword = '';
  formData.confirmPassword = '';
  formRef.value?.restoreValidation();
}

function submit() {
  formRef.value?.validate((errors: FormValidationError[]) => {
    isFormValid.value = !errors || errors.length === 0;
    if(isFormValid.value) {
      emit('update:show', false);
      emit('submit', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
    }
  });
}

function modalShowUpdate(show: boolean) {
  if(!show) {
    resetForm();
  }
  emit('update:show', show);
}
</script>

<style scoped lang="scss">
.change-pass-card {
  max-width: min(500px, 90%);
}
.action-buttons {
  float: right;
  * {
    margin-right: 10px;
  }
}
</style>
