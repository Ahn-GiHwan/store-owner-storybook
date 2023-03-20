<template>
  <VRadio class="py-2" :v-bind="{ ...$props, ...$attrs }" :color="color">
    <template v-slot:label> <slot></slot></template>
  </VRadio>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreTextFieldRadio',
  props: {
    className: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    color: {
      type: String,
      default: 'primary',
    },
  },
});
</script>
