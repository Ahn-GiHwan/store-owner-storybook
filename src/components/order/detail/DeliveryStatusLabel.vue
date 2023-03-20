<template>
  <span
    v-if="$props.delivery.deliveryType === DELIVERY_TYPE.SELF"
    class="font-weight-bold"
  >
    {{ $t(`views.orderDetail.deliveryCard.status.selfDelivery`) }}
  </span>
  <span
    v-else-if="$props.order.status === ORDER_STATUS.FINISHED
      && $props.delivery.status === DELIVERY_STATUS.DROP_FINISHED"
    class="font-weight-bold"
  >
    <template v-if="dropStatus && pickupStatus">
      {{ $t('views.orderDetail.deliveryCard.status.deliveryTime', {
        minutes: Math.ceil((dropStatus.changedAt - pickupStatus.changedAt) / (60 * 1000)) }) }}
    </template>
  </span>
  <span
    v-else-if="$props.delivery.status === DELIVERY_STATUS.PICKUP_FINISHED"
    class="font-weight-bold"
  >
    {{ $t('views.orderDetail.deliveryCard.status.pickupFinished',
      { minutes: timeDurationFromPickup }) }}
  </span>
  <span v-else-if="isFailedDelivery" class="font-weight-bold">
    {{ $t(`common.deliveryStatus.${$props.delivery.status}`) }}
  </span>
  <span
    v-else-if="$props.delivery.status === DELIVERY_STATUS.ALLOCATION_CANCELED"
    class="font-weight-bold"
  >
    {{ $t('views.orderDetail.deliveryCard.status.allocationCancelled') }}
  </span>
  <span
    v-else
    class="font-weight-bold"
  >
    <span class="s-color-primary">{{ pickupTime }}</span>
    {{ $t('views.orderDetail.deliveryCard.status.pickupExpected') }}
  </span>

</template>

<script>
import { defineComponent, computed } from 'vue';
import dayjs from 'dayjs';
import { useLocale } from 'vuetify';

import { useCommonStore } from '@/stores';
import { ORDER_STATUS, DELIVERY_TYPE, DELIVERY_STATUS } from '@/constants';
import { isFailedDelivery } from '@/utils/deliveryUtils';
import { timestampToDateTime } from '@/utils/dateUtils';

export default defineComponent({
  name: 'DeliveryStatusLabel',
  props: {
    order: {
      type: Object,
    },
    delivery: {
      type: Object,
    },
  },
  setup(props) {
    const { t } = useLocale();

    const common = useCommonStore();
    const pickupStatus = computed(() => props.delivery.deliveryStatuses
      .find((deliveryStatus) => deliveryStatus.status === DELIVERY_STATUS.PICKUP_FINISHED));
    const dropStatus = computed(() => props.delivery.deliveryStatuses
      .find((deliveryStatus) => deliveryStatus.status === DELIVERY_STATUS.DROP_FINISHED));

    return {
      ORDER_STATUS,
      DELIVERY_TYPE,
      DELIVERY_STATUS,
      isFailedDelivery: computed(() => isFailedDelivery(props.delivery)),
      pickupTime: computed(() => (
        props.delivery.pickupExpectedAt
          ? timestampToDateTime(
            props.delivery.pickupExpectedAt,
            dayjs().get('date') !== dayjs(props.delivery.pickupExpectedAt).get('date')
              ? t('views.orderDetail.deliveryCard.status.dateTimeFormat')
              : 'HH:mm',
          )
          : null)),
      timeDurationFromPickup: computed(() => (
        pickupStatus.value
          ? Math.ceil((common.systemTimestamp - pickupStatus.value.changedAt) / (60 * 1000))
          : null)),
      pickupStatus,
      dropStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
.content {
  line-height: 2.4rem;
}
</style>
