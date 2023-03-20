<template>
  <div class="btn-store text-center" :class="{ 'btn-disabled': $props.disabled }">
    <VBtn
      v-bind="{
        ...$props,
        ...$attrs,
      }"
      :color="buttonColor"
      :class="isCancelButton ? 'cancel-button' : ''"
    >
      <slot />
    </VBtn>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

import { disabledColor } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'StoreButton',
  props: {
    class: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    color: {
      type: String,
      default: 'primary',
    },
    block: {
      type: Boolean,
      require: false,
    },
    label: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '5.2rem',
    },
    isCancelButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return {
      buttonColor: computed(() => (props.disabled ? disabledColor : props.color)),
    };
  },
});
</script>
<style lang="scss" scoped>
.btn-disabled {
  background: $color-disabled;
  pointer-events: none;
}

.btn-store {
  width: 100%;
  max-width: 46rem;
  border-radius: 4px;
  & .outlined {
    border: 1px solid $color-gray-bd;
  }
  & .selected {
    border: 1px solid $color-primary;
  }
}

.cancel-button {
  border: solid 1px #bdbdbd;
  color: #bdbdbd;
}
</style>
