<template>
  <div class="d-flex flex-row flex-wrap justify-space-between align-stretch">
    <DeliveryProgressItem
      :label="$t('views.orderDetail.deliveryCard.fields.accepted')"
      v-bind="status.accepted"
      :isFirst="true"
    />
    <template v-if="$props.delivery.deliveryType === DELIVERY_TYPE.AGENCY">
      <DeliveryProgressItem
        :label="$t('views.orderDetail.deliveryCard.fields.allocated')"
        v-bind="status.allocated"
      />
    </template>
    <DeliveryProgressItem
      :label="$props.delivery.deliveryType === DELIVERY_TYPE.AGENCY
        ? $t('views.orderDetail.deliveryCard.fields.pickupFinished')
        : $props.order.serveType === ORDER_SERVE_TYPE.DELIVERY
          ? $t('views.orderDetail.deliveryCard.fields.deliveryStarted')
          : $t('views.orderDetail.deliveryCard.fields.prepared')"
      v-bind="status.pickupFinished"
    />
    <DeliveryProgressItem
      :label="$props.order.serveType === ORDER_SERVE_TYPE.DELIVERY
        ? $t('views.orderDetail.deliveryCard.fields.dropFinished')
        : $t('views.orderDetail.deliveryCard.fields.served')"
      v-bind="status.dropFinished"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { DELIVERY_TYPE, DELIVERY_STATUS, ORDER_SERVE_TYPE } from '@/constants';
import DeliveryProgressItem, { DELIVERY_PROGRESS_ITEM_STATE } from './DeliveryProgressItem.vue';

export default defineComponent({
  name: 'DeliveryProgress',
  components: {
    DeliveryProgressItem,
  },
  props: {
    order: {
      type: Object,
    },
    delivery: {
      type: Object,
    },
  },
  setup(props) {
    return {
      status: computed(() => {
        const deliveryStatuses = [...props.delivery.deliveryStatuses];
        const status = {
          accepted: {},
          allocated: {},
          pickupFinished: {},
          dropFinished: {},
        };
        deliveryStatuses.sort((a, b) => (a.changedAt > b.changedAt ? 1 : -1));
        const stateTransitionMap = {
          [DELIVERY_STATUS.ACCEPTED]: {
            field: 'accepted',
            state: DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          },
          [DELIVERY_STATUS.ALLOCATED]: {
            field: 'allocated',
            state: DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          },
          [DELIVERY_STATUS.ALLOCATION_CANCELED]: {
            field: 'allocated',
            state: DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS,
          },
          [DELIVERY_STATUS.ALLOCATION_CHANGED]: {
            field: 'allocated',
            state: DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          },
          [DELIVERY_STATUS.PICKUP_FINISHED]: {
            field: 'pickupFinished',
            state: DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          },
          [DELIVERY_STATUS.DROP_FINISHED]: {
            field: 'dropFinished',
            state: DELIVERY_PROGRESS_ITEM_STATE.SUCCESS,
          },
        };
        deliveryStatuses.forEach((deliveryStatus) => {
          if (stateTransitionMap[deliveryStatus.status]) {
            const { field, state } = stateTransitionMap[deliveryStatus.status];
            status[field].state = state;
            status[field].time = deliveryStatus.changedAt;
          }
          if (deliveryStatus.status === DELIVERY_STATUS.CANCELED) {
            if (status.dropFinished.state) {
              status.dropFinished.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS;
              status.dropFinished.time = deliveryStatus.changedAt;
            } else
            if (status.pickupFinished.state) {
              status.dropFinished.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
              status.dropFinished.time = deliveryStatus.changedAt;
            } else
            if (status.allocated.state) {
              if (status.allocated.state === DELIVERY_PROGRESS_ITEM_STATE.SUCCESS) {
                status.pickupFinished.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
                status.pickupFinished.time = deliveryStatus.changedAt;
              } else {
                status.allocated.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL_WITH_PROGRESS;
                status.allocated.time = deliveryStatus.changedAt;
              }
            } else
            if (status.accepted) {
              status.allocated.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
              status.allocated.time = deliveryStatus.changedAt;
            } else {
              status.accepted.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
              status.accepted.time = deliveryStatus.changedAt;
            }
          }
        });
        if (status.dropFinished.state && !status.pickupFinished.state) {
          status.pickupFinished.state = DELIVERY_PROGRESS_ITEM_STATE.SUCCESS;
        }
        if (status.pickupFinished.state && !status.allocated.state) {
          status.allocated.state = DELIVERY_PROGRESS_ITEM_STATE.SUCCESS;
        }
        if (status.allocated.state && !status.accepted.state) {
          status.accepted.state = DELIVERY_PROGRESS_ITEM_STATE.SUCCESS;
        }
        if (!status.dropFinished.state && !status.pickupFinished.state
          && !status.allocated.state && !status.accepted.state) {
          status.accepted.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
          status.accepted.state = DELIVERY_PROGRESS_ITEM_STATE.FAIL;
          status.accepted.time = props.delivery.createdAt;
        }
        return status;
      }),
      DELIVERY_TYPE,
      ORDER_SERVE_TYPE,
    };
  },
});
</script>
