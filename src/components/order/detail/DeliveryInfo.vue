<template>
  <DeliverySummaryInfo :mainDelivery="mainDelivery" :additionalDeliveries="additionalDeliveries" />
  <DeliveryInfoItem
    v-for="(delivery, index) in [mainDelivery, ...additionalDeliveries]
      .sort(createdTimeSorter).sort(statusPrioritySorter)"
    :key="delivery.deliveryId"
    :order="order"
    :delivery="delivery"
    :index="index === 0 ? additionalDeliveries.length && 1 : index + 1"
    @show-untact-image="handleShowUntactImage"
    @depart-delivery="handleDepartDelivery"
    @arrive-delivery="handleArriveDelivery"
    @change-to-agency-delivery="handleChangeToAgencyDelivery"
    @cancel-delivery="handleCancelDelivery"
    @resolve-delivery="handleResolveDelivery"
  />
</template>

<script>
import { defineComponent, computed } from 'vue';

import { useOrderDetailStore } from '@/stores';
import { getMainDelivery, getAdditionalDeliveries } from '@/utils/orderUtils';
import { statusPrioritySorter, createdTimeSorter } from '@/utils/deliveryUtils';

import DeliverySummaryInfo from './DeliverySummaryInfo.vue';
import DeliveryInfoItem from './DeliveryInfoItem.vue';

export default defineComponent({
  name: 'DeliveryInfo',
  components: {
    DeliverySummaryInfo,
    DeliveryInfoItem,
  },
  emits: [
    'show-untact-image',
    'depart-delivery',
    'arrive-delivery',
    'change-to-agency-delivery',
    'cancel-delivery',
    'resolve-delivery',
  ],
  setup(props, { emit }) {
    const orderDetail = useOrderDetailStore();

    return {
      order: computed(() => orderDetail.getOrder),
      mainDelivery: computed(() => getMainDelivery(orderDetail.getOrder)),
      additionalDeliveries: computed(() => getAdditionalDeliveries(orderDetail.getOrder)),
      statusPrioritySorter,
      createdTimeSorter,
      handleShowUntactImage: (delivery) => {
        emit('show-untact-image', delivery);
      },
      handleDepartDelivery: (delivery) => {
        emit('depart-delivery', delivery);
      },
      handleArriveDelivery: (delivery) => {
        emit('arrive-delivery', delivery);
      },
      handleChangeToAgencyDelivery: () => {
        emit('change-to-agency-delivery');
      },
      handleCancelDelivery: (delivery) => {
        emit('cancel-delivery', delivery);
      },
      handleResolveDelivery: () => {
        emit('resolve-delivery');
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/layout/main.scss';

.header-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
</style>
