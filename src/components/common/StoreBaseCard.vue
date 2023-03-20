<template>
  <VRow no-gutters>
    <VCol>
      <VCard v-bind="{ ...$attrs }">
        <slot name="card-header" />
        <slot name="card-content" />
        <slot name="card-bottom" />
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreBaseCard',
});
</script>
