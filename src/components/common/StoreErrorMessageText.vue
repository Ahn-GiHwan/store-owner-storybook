<template>
  <div class="text-right">
    <span class="s-color-red-e5 font-size-12">
      <VIcon
        v-if="icon"
        icon="mdi-information-outline"
        size="small"
      />
      {{ errorMessage }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreErrorMessageText',
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
