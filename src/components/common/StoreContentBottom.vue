<template>
  <VFooter app class="py-0">
    <VRow class="flex-column align-center" no-gutters>
      <VCol class="d-flex error-text justify-right py-0 mb-3" v-if="error">
        <StoreErrorMessageText :errorMessage="errorMessage" />
      </VCol>
      <VCol v-if="bottomUp" class="d-flex justify-center mb-4">
        <slot name="bottom-up" />
      </VCol>
      <VCol class="d-flex justify-center">
        <slot />
      </VCol>
    </VRow>
  </VFooter>
</template>

<script>
import { defineComponent } from 'vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';

export default defineComponent({
  name: 'StoreContentBottom',
  components: {
    StoreErrorMessageText,
  },
  props: {
    className: String,
    error: Boolean,
    errorMessage: {
      type: String,
      default: '',
    },
    bottomUp: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.error-text {
  max-width: 45.4rem;
  justify-content: end;
}
</style>
