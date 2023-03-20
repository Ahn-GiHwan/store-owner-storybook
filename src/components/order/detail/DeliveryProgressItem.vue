<template>
  <VDivider
    v-if="!$props.isFirst"
    class="delivery-progress-line"
    :class="$props.state === DELIVERY_PROGRESS_ITEM_STATE.SUCCESS
      || $props.state === DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS ? 'success' : ''"
  />
  <div class="delivery-progress-item d-flex flex-column justify-start align-center">
    <VIcon
      v-if="$props.state === DELIVERY_PROGRESS_ITEM_STATE.SUCCESS"
      icon="mdi-check-circle"
      color="#41CF6D"
      size="1.6rem"
    />
    <VIcon
      v-else-if="$props.state === DELIVERY_PROGRESS_ITEM_STATE.FAIL
      || $props.state === DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS"
      icon="mdi-close-circle"
      color="#FF5252"
      size="1.6rem"
    />
    <VIcon v-else icon="mdi-check-circle" color="#EBEBEB" size="1.6rem" />
    <span class="mt-1 font-size-12">{{ $props.label }}</span>
    <span v-if="$props.time" class="font-size-12 s-color-gray-66">
      {{ timestampToDateTime($props.time, 'HH:mm') }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { timestampToDateTime } from '@/utils/dateUtils';

export const DELIVERY_PROGRESS_ITEM_STATE = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  FAIL_WITH_PROGRESS: 'FAIL_WITH_PROGRESS',
  DEFAULT: 'DEFAULT',
};

export default defineComponent({
  name: 'DeliveryProgressItem',
  props: {
    isFirst: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      validator(value) {
        return [
          DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          DELIVERY_PROGRESS_ITEM_STATE.FAIL,
          DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS,
          DELIVERY_PROGRESS_ITEM_STATE.DEFAULT,
        ].includes(value);
      },
      default: DELIVERY_PROGRESS_ITEM_STATE.DEFAULT,
    },
    label: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
    },
  },
  setup() {
    return {
      DELIVERY_PROGRESS_ITEM_STATE,
      timestampToDateTime,
    };
  },
});
</script>

<style lang="scss" scoped>
.delivery-progress-item {
  flex-basis: 56px;
  span {
    font-size: 12px;
    line-height: 18px;
  }
}
.delivery-progress-line {
  flex-basis: 0;
  align-self: start;
  margin: 7px -23px 0;
  border-width: thin 0;
  border-color: #EBEBEB;
  &.success {
    border-color: #41CF6D;
  }
}
</style>
