<template>
  <!-- 1회용 컵 보증금(개당 300원) -->
  <div class="d-flex">
    <VBtn
      data-testid='down'
      variant="outlined"
      size="x-small"
      color="primary"
      @click="bindCount--"
      :disabled="isDisabled || count < 1"
    >
      <VIcon size="large">mdi-minus</VIcon>
    </VBtn>
    <VTextField
      v-model="bindCount"
      type="tel"
      name="count"
      class="count-field__input"
      variant="solo"
      maxlength="2"
      size="2"
      single-line
      hide-details
      :disabled="isDisabled"
      required
    />
    <VBtn
      data-testid='up'
      variant="outlined"
      size="x-small"
      color="primary"
      @click="bindCount++"
      :disabled="isDisabled || count === maxValue"
    >
    <VIcon size="large">mdi-plus</VIcon>
    </VBtn>
</div>
</template>

<script setup name="StoreCounter">
import { computed, defineEmits } from 'vue';

const props = defineProps({
  count: {
    type: [Number, String],
    default: 0,
    required: true,
  },
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

const emits = defineEmits(['update:count']);

const bindCount = computed({
  get: () => props.count,
  set: (value) => {
    emits('update:count', value);
  },
});
</script>

<style lang="scss" scoped>
.v-btn {
  height: 4rem !important;
  border: 1px solid #CBCBCB;
}
:deep(.v-input__control) {
  width: 4rem;
  height: 4rem;
}
.count-field__input {
  border: 0px solid red !important;
}

:deep(.v-field__input) {
  padding: 8px;
  text-align: center;
}

:deep(.v-field) {
  box-shadow: none;
}

:deep(.v-field__field) {
  height: 4rem;
  align-items: center;
}
</style>
