<template>
  <div class="d-flex mb-1">
    <VChip
      v-if="isViewLabel"
      class="mr-1"
      rounded="1"
      size="x-small"
      label
      :color="color"
      :variant="variant"
    >
      <span class="font-size-12"> {{ labelName }}</span>
    </VChip>

    <div
      v-if="color === 'error'"
      class="error-order font-size-12 px-1 mr-1"
    >
      배달중단
    </div>

    <!-- 배달상태가 실패되고 예약으로 한 주문일 경우 2가지 라벨 표기(배달중단, 예약) -->
    <template v-if="color === 'error' && isReservation">
      <VChip
        class="mr-1"
        rounded="1"
        size="x-small"
        label
        color="primary"
      >
        <span class="font-size-12"> 예약</span>
      </VChip>
    </template>
    <span
      class="font-size-12"
      :class="{'text-error': color==='error'}"
    >{{ orderDateTime }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { getOrderDateTime } from '@/utils/dateUtils';

export default defineComponent({
  name: 'StoreOrderTimeLabel',
  props: {
    order: {
      type: Object,
      require: true,
    },
    orderDateTime: {
      type: String,
      default: '',
    },
    isViewLabel: {
      type: Boolean,
      default: false,
    },
    isReservation: {
      type: Boolean,
      default: false,
    },
    labelName: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
    variant: {
      type: String,
      default: 'tonal',
    },
  },
  setup() {
    return {
      getOrderDateTime,
    };
  },
});
</script>

<style lang="scss" scoped>
.error-order {
  background: $color-red-e5;
  line-height: 2rem;
  color: white;
  border-radius: 2px;
}
</style>
