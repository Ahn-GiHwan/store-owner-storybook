<template>
  <div class="content mb-4" v-if="$props.additionalDeliveries.length > 0">
    <StoreBaseCard flat>
      <template #card-header>
        <div no-gutters class="d-flex justify-space-between align-start pa-4">
          <div class="header-title font-weight-bold font-size-16">
            {{ $t('views.orderDetail.deliverySummaryCard.title', { count: deliveryCount }) }}
          </div>
          <div class="d-flex flex-column align-end">
            <div class="d-flex flex-wrap text-right">
              <span
                class="font-size-12"
                v-if="waitingCount > 0"
              >
                {{ $t( 'views.orderDetail.deliverySummaryCard.label.waiting',
                  { count: waitingCount }) }}
              </span>
              <span
                class="font-size-12"
                v-if="inProgressCount > 0"
                :class="waitingCount > 0 && 'ml-2'"
              >
                {{ $t( 'views.orderDetail.deliverySummaryCard.label.inProgress',
                  { count: inProgressCount }) }}
              </span>
              <span
                class="font-size-12"
                v-if="completedCount > 0"
                :class="(waitingCount > 0 || inProgressCount > 0) && 'ml-2'"
              >
                {{ $t( 'views.orderDetail.deliverySummaryCard.label.completed',
                  { count: completedCount }) }}
              </span>
              <span
                class="font-size-12"
                v-if="cancelledCount > 0"
                :class="(waitingCount > 0 || inProgressCount > 0 || completedCount > 0) && 'ml-2'"
              >
                {{ $t( 'views.orderDetail.deliverySummaryCard.label.cancelled',
                  { count: cancelledCount }) }}
              </span>
            </div>
            <div class="text-right">
              <span class="font-size-12">
                {{ $t( 'views.orderDetail.deliverySummaryCard.label.totalDeliveryPrice',
                  { price: numberWithCommas(totalDeliveryPrice) }) }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </StoreBaseCard>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { DELIVERY_STATUS, DELIVERY_TYPE } from '@/constants';
import { numberWithCommas } from '@/utils/stringUtils';
import StoreBaseCard from '@/components/common/StoreBaseCard.vue';

export default defineComponent({
  name: 'DeliverySummaryInfo',
  components: {
    StoreBaseCard,
  },
  props: {
    mainDelivery: {
      type: Object,
    },
    additionalDeliveries: {
      type: Array,
    },
  },
  setup(props) {
    const deliveries = computed(() => [props.mainDelivery, ...props.additionalDeliveries]);

    const waitingStatuses = {
      [DELIVERY_TYPE.AGENCY]: [
        DELIVERY_STATUS.CREATED,
        DELIVERY_STATUS.ASSIGNED,
        DELIVERY_STATUS.ACCEPTED,
        DELIVERY_STATUS.ALLOCATION_CANCELED,
      ],
      [DELIVERY_TYPE.SELF]: [
        DELIVERY_STATUS.CREATED,
        DELIVERY_STATUS.ASSIGNED,
        DELIVERY_STATUS.ACCEPTED,
        DELIVERY_STATUS.ALLOCATION_CANCELED,
        DELIVERY_STATUS.ALLOCATED,
        DELIVERY_STATUS.ALLOCATION_CHANGED,
        DELIVERY_STATUS.COOK_REQUESTED,
        DELIVERY_STATUS.ARRIVED,
      ],
    };
    const inProgressStatuses = {
      [DELIVERY_TYPE.AGENCY]: [
        DELIVERY_STATUS.ALLOCATED,
        DELIVERY_STATUS.ALLOCATION_CHANGED,
        DELIVERY_STATUS.COOK_REQUESTED,
        DELIVERY_STATUS.ARRIVED,
        DELIVERY_STATUS.PICKUP_FINISHED,
      ],
      [DELIVERY_TYPE.SELF]: [
        DELIVERY_STATUS.PICKUP_FINISHED,
      ],
    };
    const completedStatuses = [
      DELIVERY_STATUS.DROP_FINISHED,
    ];
    const cancelledDeliveryStatus = [
      DELIVERY_STATUS.CANCELED,
      DELIVERY_STATUS.REJECTED,
      DELIVERY_STATUS.FAILED,
    ];
    return {
      deliveryCount: computed(() => props.additionalDeliveries.length + 1),
      waitingCount: computed(() =>
        deliveries.value
          .filter((delivery) =>
            waitingStatuses[delivery.deliveryType].includes(delivery.status)).length),
      inProgressCount: computed(() =>
        deliveries.value
          .filter((delivery) =>
            inProgressStatuses[delivery.deliveryType].includes(delivery.status)).length),
      completedCount: computed(() =>
        deliveries.value
          .filter((delivery) =>
            completedStatuses.includes(delivery.status)).length),
      cancelledCount: computed(() =>
        deliveries.value
          .filter((delivery) =>
            cancelledDeliveryStatus.includes(delivery.status)).length),
      numberWithCommas,
      totalDeliveryPrice: computed(() =>
        deliveries.value
          .reduce((acc, delivery) =>
            (cancelledDeliveryStatus.includes(delivery.status)
              ? acc
              : acc + (delivery.totalDeliveryPrice || 0) + (delivery.VATPrice || 0)), 0)),
    };
  },
});
</script>

<style lang="scss" scoped>
.header-title {
  line-height: 2.4rem;
  white-space: pre-line;
  color: #0072FF;
}
</style>
