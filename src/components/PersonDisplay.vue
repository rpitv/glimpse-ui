<template>
  <div>
    {{name}}
    <p>
      {{role}}
    </p>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

</script>

<style scoped>

</style>
