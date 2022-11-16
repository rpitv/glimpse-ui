<template>
<div>
  <p>{{result}}</p>
  <n-button @click="queryVariables.skipInput--">Previous</n-button>
  <n-button @click="queryVariables.skipInput++">Next</n-button>
</div>
</template>

<script setup lang="ts">
import {FindSomeUserDocument} from "@/graphql/types"
import {NButton} from "naive-ui";

import {useQuery} from "@vue/apollo-composable";
import {ref} from "vue";

const queryVariables = ref<{skipInput: number}>({
  skipInput: 0
});

const {result} = useQuery(FindSomeUserDocument, queryVariables);


</script>

<style scoped lang="scss">

</style>
