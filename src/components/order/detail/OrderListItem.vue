<template>
  <div
    class="d-flex align-start py-4"
    :class="{
      'order-list-item__bottom-line': $props.hasBottomBorder && !$props.important,
      important: $props.important
    }"
  >
    <div class="s-color-gray-66 order-list-item__label mr-1">
      {{ $props.label }}
    </div>
    <div
      class="order-list-item__content-wrapper d-flex justify-space-between align-start"
    >
      <div class="order-list-item__content">
        <slot name="list-item-content" />
      </div>
      <div
        v-if="$props.actionSize !== 'none'"
        class="order-list-item__action"
        :class="$props.actionSize"
      >
        <slot name="list-item-action" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OrderListItem',
  props: {
    label: {
      type: String,
      default: '',
    },
    hasBottomBorder: {
      type: Boolean,
      default: true,
    },
    actionSize: {
      type: String,
      default: 'default',
    },
    important: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.order-list-item__bottom-line {
  border-bottom: 1px solid #EBEBEB;
}
.important {
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #E8F5E9;
}
.order-list-item__label {
  width: 80px;
}
.order-list-item__content-wrapper {
  width: calc(100% - 80px);
  flex-basis: calc(100% - 80px);
}
.order-list-item__content {
  flex-grow: 1;
}
.order-list-item__action {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 42px;
  &.medium {
    flex-basis: 72px;
  }
  &.large {
    flex-basis: 150px;
  }
}
</style>
