<template>
  <VRow class="pa-4 flex-column pickup" no-gutters>
    <VCol class="text-left">
      <span class="font-size-14 font-weight-bold">
        <span class="s-color-primary">
          {{ timestampToMinute(deliveryInfo.pickupExpectedAt) }}
          {{ $t('common.order.deliveryInfo.message.afterMinute') }}
        </span>
        {{ $t('common.order.deliveryInfo.message.pickupExpected') }}
      </span>
    </VCol>
    <VCol class="text-left">
      <span class="font-size-12 s-color-gray-66">
        {{ $t('common.order.deliveryInfo.message.estimatedPickupTime') }}
      </span>
    </VCol>
  </VRow>
</template>
<script>
import { defineComponent } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'StorePickupExpected',
  components: { },
  props: {
    deliveryInfo: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { $d } = dayjs();
    const timestampToMinute = (pickupAt) => ((pickupAt - $d.getTime()) / 60000).toFixed();

    return {
      timestampToMinute,
    };
  },
});
</script>

<style lang="scss" scoped>
.pickup {
  background: $color-gray-f5;
  border-radius: 4px;
}

</style>
