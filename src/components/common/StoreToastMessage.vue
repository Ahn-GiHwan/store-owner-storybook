<template>
  <VSnackbar
    v-bind="{ ...$props, ...$attrs }"
    :color="color"
    :timeout="timeout"
    rounded="4"
  >
    <div class="text-center snackbar-alert">
      <p v-if="message">{{ message }}</p>
      <slot></slot>
    </div>
  </VSnackbar>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreToastMessage',
  props: {
    color: {
      type: String,
      default: 'success',
    },
    message: {
      type: String,
      default: '',
    },
    timeout: {
      type: [String, Number],
      default: 5000,
    },
  },
});
</script>

<style lang="scss" scoped>
.v-snackbar:not(.v-snackbar--absolute) {
  height: 100%;
  position: fixed;
  z-index: 9999;
}

:deep(.v-snackbar__wrapper) {
  margin: 0;
  width: 94vw;
  max-width: 100%;
  bottom: 1.2rem;
}
.snackbar-alert {
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 2rem;
  align-items: center;
  text-align: center;
  white-space: pre-line;
}
</style>
