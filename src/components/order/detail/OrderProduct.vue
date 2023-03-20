<template>
  <div class="pa-3 order-product-wrapper">
    <div class="d-flex justify-space-between">
      <span class="text-shades-black">
        {{ productName }}
        <template v-if="!$props.orderProduct || $props.orderProduct.type !== 'SUMMARY'">
         {{ productQuantity }}{{ $t('common.unit.orderProduct') }}
        </template>
      </span>
      <span class="price text-shades-black">
        {{ productPrice }} {{ $t('common.currency') }}
      </span>
    </div>
    <template v-if="$props.orderProduct && $props.orderProduct.type !== 'SUMMARY'">
      <div
        class="d-flex justify-space-between mt-2"
        v-if="$props.orderProduct.orderProductOptions.length > 0"
      >
        <span class="s-color-gray-61">
          {{ $t('views.orderDetail.orderCard.label.basePrice') }}
        </span>
        <span class="price s-color-gray-61">
          {{ numberWithCommas($props.orderProduct.unitPrice * $props.orderProduct.quantity)
          }} {{ $t('common.currency') }}
        </span>
      </div>
      <div
        class="d-flex justify-space-between mt-2"
        v-for="(option) in $props.orderProduct.orderProductOptions"
        v-bind:key="option.orderProductOptionId"
      >
        <span class="s-color-gray-61">
          {{ option.name }} {{ option.quantity }}{{ $t('common.unit.orderProduct') }}
        </span>
        <span class="price s-color-gray-61">
          + {{ numberWithCommas(option.unitPrice * option.quantity)
          }} {{ $t('common.currency') }}
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { numberWithCommas } from '@/utils/stringUtils';

export default defineComponent({
  name: 'OrderProduct',
  props: {
    orderProduct: {
      type: Object,
    },
    totalPayPrice: {
      type: Number,
    },
  },
  setup(props) {
    const productName = computed(() => (props.orderProduct ? props.orderProduct.name : '임의상품'));
    const productQuantity = computed(() => (props.orderProduct ? props.orderProduct.quantity : 1));
    const productPrice = computed(() => (props.orderProduct
      ? numberWithCommas(props.orderProduct.totalPrice)
      : numberWithCommas(props.totalPayPrice) || 0));
    return {
      productName,
      productQuantity,
      productPrice,
      numberWithCommas,
    };
  },
});
</script>

<style lang="scss" scoped>
.order-product-wrapper {
  background: $color-gray-f5;
  border-radius: 4px;
  .price {
    min-width: 8rem;
    text-align: right;
  }
}
</style>
