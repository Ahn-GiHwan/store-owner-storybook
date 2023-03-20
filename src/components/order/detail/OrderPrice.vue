<template>
  <span class="text-shades-black">
    {{ $t('views.orderDetail.orderCard.label.actualPayPrice',
      { price: numberWithCommas(actualPayPrice) }) }}
    <span v-if="deliveryTip || taxFreePayPrice" class="font-size-12 s-color-gray-66">
      {{ `(${
        deliveryTip ? $t('views.orderDetail.orderCard.label.deliveryTip',
          { price: numberWithCommas(deliveryTip.totalPrice) }) : ''
      }${
        deliveryTip && taxFreePayPrice ? ', ' : ''
      }${
        taxFreePayPrice ? $t('views.orderDetail.orderCard.label.taxFreePayPrice',
          { price: numberWithCommas(taxFreePayPrice) }) : ''
      })` }}
    </span>
    <VTooltip
      v-if="taxFreePayPrice"
      location="top"
      open-on-click
      :open-on-hover="false"
    >
      <template v-slot:activator="{ props }">
        <VBtn size="x-small" icon v-bind="props">
          <VIcon size="x-small">mdi-information</VIcon>
        </VBtn>
      </template>
      <span>
        {{ $t('views.orderDetail.tooltip.taxFreePayPrice') }}
      </span>
    </VTooltip>
  </span>
  <template v-if="discountPrice">
    <br />
    <span class="font-size-12 text-red">
      {{ $t('views.orderDetail.orderCard.label.discountPrice',
        { price: numberWithCommas(discountPrice) }) }}
    </span>
  </template>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { getMainDelivery } from '@/utils/orderUtils';
import { numberWithCommas } from '@/utils/stringUtils';

export default defineComponent({
  name: 'OrderPrice',
  props: {
    order: {
      type: Object,
    },
  },
  setup(props) {
    const taxFreePayPrice = computed(() => {
      const mainDelivery = getMainDelivery(props.order);
      if (!mainDelivery) {
        return props.order.taxFreePayPrice;
      }

      if (mainDelivery.taxFreePayPrice === props.order.taxFreePayPrice) {
        return props.order.taxFreePayPrice;
      }

      return false;
    });

    return {
      actualPayPrice: computed(() => props.order.actualPayPrice),
      deliveryTip: computed(() => props.order.orderProducts.find((orderProduct) => orderProduct.type === 'DELIVERY_TIP')),
      taxFreePayPrice,
      discountPrice: computed(() => props.order.totalPayPrice - props.order.actualPayPrice),
      numberWithCommas,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-shades-black {
  line-height: 2rem
}
.v-btn {
  height: 3.2rem !important;;
  margin: -6px 0;
}
.text-red {
  line-height: 1.8rem;
}
</style>
