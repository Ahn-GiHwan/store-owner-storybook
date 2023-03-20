<template>
  <div>
    <div
      class="d-flex justify-space-between"
      :class="!title && maxlength !== undefined && 'flex-row-reverse'"
    >
      <p v-if="title" :class="['mb-2', dark ? 'text-black' : 'text-white']">
        {{ title }}
      </p>
      <p v-if="maxlength !== undefined">
        {{ `${modelValue?.length || 0}/${maxlength}` }}
      </p>
    </div>
    <VTextarea
      v-bind="{
        ...$props,
        ...$attrs,
      }"
      :class="disabled ? 'input-disabled' : 'input-enabled'"
      variant="outlined"
      rows="6"
      no-resize
      :bg-color="gray8Color"
      hide-details="auto"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { gray8Color } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'StoreTextarea',
  props: {
    title: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    appendIcon: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary darken-2',
    },
    dark: {
      type: Boolean,
      require: true,
    },
    disabled: Boolean,
    label: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: undefined,
    },
    name: {
      type: String,
      default: '',
    },
    appendInnerCustom: {
      type: Object,
      default: () => {},
    },
    appendOuterCustom: {
      type: Object,
      default: () => {},
    },
    appendInnerIcon: {
      type: String,
      default: '',
    },
    prependInnerIcon: {
      type: String,
      default: '',
    },
    required: Boolean,
    rules: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'text',
    },
    error: Boolean,
    errorMessages: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {
      gray8Color,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-disabled {
  background: $color-gray-ee;
  border-color: $color-gray-bd;
}

.input-enabled {
  background: $color-gray-ff;
  border-color: $color-gray-bd;
}

</style>
