<template>
  <div
    v-if="ordererOrderMemo"
    class="text-shades-black"
    :class="storeOrderMemo ? 'single-line' : 'multi-line'"
  >
    {{ $t('views.orderDetail.orderCard.label.customer') }} : {{ ordererOrderMemo }}
  </div>
  <div
    v-if="storeOrderMemo"
    class="text-shades-black"
    :class="ordererOrderMemo ? 'single-line' : 'multi-line'"
  >
    {{ $t('views.orderDetail.orderCard.label.store') }} : {{ storeOrderMemo }}
  </div>
  <div
    v-if="order.isUntact"
    class="text-shades-black single-line"
  >
    <span class="s-color-gray-66">비대면 배달</span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'OrderMemo',
  props: {
    order: {
      type: Object,
    },
  },
  setup(props) {
    return {
      ordererOrderMemo: computed(() => props.order.ordererOrderMemo),
      storeOrderMemo: computed(() => props.order.storeOrderMemo),
    };
  },
});
</script>

<style lang="scss" scoped>
div {
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.single-line {
  -webkit-line-clamp: 1;
  line-clamp: 1;
  max-height: 2rem;
}
.multi-line {
  -webkit-line-clamp: 2;
  line-clamp: 2;
  max-height: 4rem;
}
</style>
