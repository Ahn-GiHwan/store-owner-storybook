<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">
        {{ $t('views.orderDetail.orderMemoModal.title') }}
      </span>
    </template>
    <template #content>
      <div
        v-if="ordererOrderMemo"
        class="order-memo-wrapper pa-3 mt-4"
      >
        <div class="text-left font-weight-bold mb-4">
          {{ $t('views.orderDetail.orderMemoModal.label.customerRequest') }}
        </div>
        <div class="text-left text-break">
          {{ ordererOrderMemo }}
        </div>
      </div>
      <div
        v-if="storeOrderMemo"
        class="order-memo-wrapper pa-3 mt-4"
      >
        <div class="text-left font-weight-bold mb-4">
          {{ $t('views.orderDetail.orderMemoModal.label.storeRequest') }}
        </div>
        <div class="text-left text-break">
          {{ storeOrderMemo }}
        </div>
      </div>
    </template>
  </StoreBottomSheet>
</template>

<script>
import { defineComponent, computed } from 'vue';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';

export default defineComponent({
  name: 'OrderMemoModal',
  components: {
    StoreBottomSheet,
  },
  emits: ['close'],
  props: {
    order: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    return {
      ordererOrderMemo: computed(() => props.order.ordererOrderMemo),
      storeOrderMemo: computed(() => props.order.storeOrderMemo),
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.order-memo-wrapper {
  background: $color-gray-f5;
  font-size: 1.2rem;
  line-height: 1.8rem;
}
</style>
