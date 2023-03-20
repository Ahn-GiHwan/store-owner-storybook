<template>
  <StoreCounter
    data-testid='tt'
    v-model:count="count"
    :min-value="minValue"
    :max-value="maxValue"
    :isDisabled="isDisabled"
  />
</template>

<script setup name='StoriesCounter'>
import StoreCounter from '@components/common/StoreCounter.vue';

import { ref } from 'vue';

defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
});

const count = ref(1);
</script>
