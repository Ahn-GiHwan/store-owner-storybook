<template>
  <div
    v-if="$props.order.orderPreparedNotificationHistories.length > 0"
    class="prepared font-weight-bold font-size-12 px-2"
  >
    {{ $t('views.orderDetail.orderCard.label.prepared') }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OrderPreparedLabel',
  props: {
    order: {
      type: Object,
    },
  },
});
</script>

<style lang="scss" scoped>
.prepared {
  background: $color-gray-f5;
  line-height: 2rem;
}
</style>
