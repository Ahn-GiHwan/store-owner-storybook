<template>
  <OrderProduct :orderProduct="firstOrderProduct" :totalPayPrice="totalPayPrice" />
  <StoreButton
    v-if="orderProducts.length > 1"
    variant="outlined"
    block
    class="mt-1"
    size="4rem"
    color="#BDBDBD"
    @click="handleClick"
  >
    <span class="s-color-gray-75">
      {{ $t('views.orderDetail.button.showAllMenu', { count: orderProducts.length }) }}
    </span>
  </StoreButton>
</template>

<script>
import { defineComponent, computed } from 'vue';

import OrderProduct from './OrderProduct.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'OrderProductInfo',
  components: {
    OrderProduct,
    StoreButton,
  },
  emits: ['show-order-product-modal'],
  props: {
    order: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit('show-order-product-modal');
    };

    const firstOrderProduct = computed(() => {
      if (props.order.orderProducts.length > 0) {
        return (props.order.orderProducts[0].type === 'DELIVERY_TIP' && props.order.orderProducts.length > 1
          ? props.order.orderProducts[1]
          : props.order.orderProducts[0]);
      }
      return null;
    });

    return {
      firstOrderProduct,
      orderProducts: computed(() => props.order.orderProducts),
      totalPayPrice: computed(() => props.order.totalPayPrice),
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.order-product-wrapper {
  background: $color-gray-f5;
  border-radius: 4px;
}
</style>
