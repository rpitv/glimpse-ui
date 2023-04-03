<template>
  <div>
    <n-modal
      v-if="modal"
      v-model:show="showModal"
      :closable="true"
      @close="showModal = false"
    >
      <div :style="`width: min(${maxWidth}px, 80%)`">
        <slot />
      </div>
    </n-modal>
    <div v-else class="content-wrapper">
      <div :style="`width: min(${maxWidth}px, 80%)`">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NModal } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { useRouteStore } from "@/stores/route";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const routeStore = useRouteStore();

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 500,
  },
  modal: {
    type: Boolean,
    default: false,
  },
});

const showModal = computed<boolean>({
  get: () => true,
  set: () => routeStore.goToParent(),
});
</script>

<style scoped lang="scss">
.content-wrapper {
  display: flex;
  justify-content: center;
}
</style>
