<template>
<div>
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
import {NRadioGroup, NRadioButton, NTransfer, NButton} from "naive-ui";
import {AbilityActions, AbilitySubjects} from "@/graphql/types";
import {computed, ref} from "vue";

const availableActions: AbilityActions[] = [
  AbilityActions.Create, AbilityActions.Read, AbilityActions.Update, AbilityActions.Delete, AbilityActions.Manage
];
const selectedAction = ref<AbilityActions>(AbilityActions.Create);

const availableSubjects: AbilitySubjects[] = [
  AbilitySubjects.AccessLog,
  AbilitySubjects.AlertLog,
  AbilitySubjects.Asset,
  AbilitySubjects.AuditLog,
  AbilitySubjects.BlogPost,
  AbilitySubjects.Category,
  AbilitySubjects.ContactSubmission,
  AbilitySubjects.ContactSubmissionAssignee,
  AbilitySubjects.Credit,
  AbilitySubjects.Group,
  AbilitySubjects.GroupPermission,
  AbilitySubjects.Image,
  AbilitySubjects.Person,
  AbilitySubjects.PersonImage,
  AbilitySubjects.Production,
  AbilitySubjects.ProductionImage,
  AbilitySubjects.ProductionRsvp,
  AbilitySubjects.ProductionTag,
  AbilitySubjects.ProductionVideo,
  AbilitySubjects.Redirect,
  AbilitySubjects.Role,
  AbilitySubjects.Stream,
  AbilitySubjects.User,
  AbilitySubjects.UserGroup,
  AbilitySubjects.UserPermission,
  AbilitySubjects.Video,
  AbilitySubjects.Vote,
  AbilitySubjects.VoteResponse
];

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
  console.log(selectedAction.value, selectedSubjects.value);
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
