<template>
  <div class="">
    <span
      v-if="$props.order.status === ORDER_STATUS.FINISHED"
      class="finished font-size-12"
    >
      <VIcon
        icon="mdi-check-circle"
        color="#41CF6D"
        size="1.6rem"
      />
      {{ $t('views.orderDetail.orderCard.label.finished') }}
    </span>
    <span
      v-else-if="$props.order.status === ORDER_STATUS.CANCELED"
      class="canceled font-size-12"
    >
      <VIcon
        icon="mdi-check-circle"
        color="error"
        size="1.6rem"
      />
      {{ $t('views.orderDetail.orderCard.label.cancelled') }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { ORDER_STATUS } from '@/constants';

export default defineComponent({
  name: 'OrderStatusLabel',
  props: {
    order: {
      type: Object,
    },
  },
  setup() {
    return {
      ORDER_STATUS,
    };
  },
});
</script>

<style lang="scss" scoped>
.finished {
  color: #41CF6D;
}
.canceled {
  color: #FF5252;
}
</style>
