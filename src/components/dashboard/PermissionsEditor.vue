<template>
<div>
  <n-table>
    <thead>
    <tr>
      <th>Action</th>
      <th>Subjects</th>
      <th>Fields</th>
      <th>Conditions</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="permission of value">
      <td><pre>{{permission.action.toUpperCase()}}</pre></td>
      <td><pre>{{permission.subject.includes("all") ? "ALL" : permission.subject.join('\n')}}</pre></td>
      <td><pre>{{permission.fields?.length ? permission.fields?.join('\n') : 'ALL'}}</pre></td>
      <td><pre>{{permission.conditions ? JSON.stringify(permission.conditions) : 'NONE'}}</pre></td>
      <td><n-button secondary circle type="error" aria-label="Delete" @click="deletePermissionClicked(permission)">
        <template #icon>
          <FontAwesomeIcon icon="fal fa-trash"/>
        </template>
      </n-button></td>
    </tr>
    </tbody>
  </n-table>
  <h3>Create Permission</h3>
  <label>Action</label>
  <n-radio-group v-model:value="selectedAction">
    <n-radio-button v-for="action of availableActions" :key="action" :value="action"
                    :label="action.charAt(0).toUpperCase() + action.slice(1)">
    </n-radio-button>
  </n-radio-group>
  <label class="mt-10">Subjects</label>
  <n-transfer v-model:value="selectedSubjects" :options="subjectsOptions" />
  <!-- TODO fields input -->
  <!-- TODO conditions input -->
  <n-button class="mt-10" type="primary" @click="createPermissionClicked">Create Permission</n-button>
</div>
</template>

<script setup lang="ts">
import {NRadioGroup, NRadioButton, NTransfer, NButton, NTable} from "naive-ui";
import {AbilitySubjects, Permission} from "@/graphql/types";
import {computed, PropType, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { AbilityActions } from "@/casl";

const props = defineProps({
  value: {
    type: Array as PropType<Permission[]>,
    required: true
  }
})

const emit = defineEmits(['create', 'delete'])

const availableActions: AbilityActions[] = [
  AbilityActions.Create, AbilityActions.Read, AbilityActions.Update, AbilityActions.Delete, AbilityActions.Manage
];
const selectedAction = ref<AbilityActions>(AbilityActions.Create);

const availableSubjects: AbilitySubjects[] = Object.values(AbilitySubjects);

const subjectsOptions = computed(() => {
  return availableSubjects.map(subject => {
    return {
      label: subject,
      value: subject
    }
  })
})

const selectedSubjects = ref<AbilitySubjects[]>([]);

function createPermissionClicked() {
  emit('create', {
    action: selectedAction.value,
    subject: selectedSubjects.value
  });
}

function deletePermissionClicked(permission: Permission) {
  emit('delete', permission.id);
}

</script>

<style scoped lang="scss">
.mt-10 {
  margin-top: 10px;
}

label {
  display: block;
}
</style>
