<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold mb-2">
        {{ $t('views.orderDetail.orderProductModal.title') }}
      </span>
    </template>
    <template #content>
      <OrderProduct
        v-for="orderProduct in orderProducts"
        :key="orderProduct.orderProductId"
        :orderProduct="orderProduct"
        class="mt-2"
      />
    </template>
  </StoreBottomSheet>
</template>

<script>
import { defineComponent, computed } from 'vue';

import OrderProduct from './OrderProduct.vue';
import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';

export default defineComponent({
  name: 'OrderProductModal',
  components: {
    OrderProduct,
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
      orderProducts: computed(() => props.order.orderProducts),
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
