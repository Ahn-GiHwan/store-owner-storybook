<template>
  <template>
    <template
      v-for="(dsmItem, index) in deliveryStatusModals"
      v-bind:key="index"
    >
      <StoreDeliveryStatusModalItem
        v-if="index <= currentIndex"
        :event="dsmItem.event"
        :message="dsmItem.message"
        :type="dsmItem.type"
        :waitingDsmCount="deliveryStatusModals.length - (index + 1)"
        @closed="handleClosed()"
      />
    </template>
  </template>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import useSocket from '@/composables/useSocket';
import { STORE_STATUS, STORE_USER_STATUS, SOCKET } from '@/constants';
import { useAuthStore, useOrderDetailStore, useCommonStore } from '@/stores';
import useOrderAsync from '@/composables/useOrderAsync';
import StoreDeliveryStatusModalItem from './StoreDeliveryStatusModalItem.vue';

export default defineComponent({
  name: 'StoreDeliveryStatusModal',
  components: {
    StoreDeliveryStatusModalItem,
  },
  setup() {
    const auth = useAuthStore();
    const route = useRoute();
    const orderDetail = useOrderDetailStore();
    const { doGetOrders } = useOrderAsync();
    const currentRouteName = computed(() => route.name);
    const currentOrderId = computed(() => Number(route.params.orderId));

    const common = useCommonStore();
    const currentIndex = ref(0);
    const { subscribe } = useSocket();

    const isReceivable = computed(() => {
      const store = auth.currentStore;
      const storeUser = auth.currentStoreUser;
      return store.status === STORE_STATUS.APPROVED
        && storeUser?.status === STORE_USER_STATUS.APPROVED;
    });

    [
      // order create
      SOCKET.EVENT.ORDER_CREATE_FOR_ORDER,
      SOCKET.EVENT.ORDER_CREATE_FOR_DELIVERY,
      SOCKET.EVENT.ORDER_CREATE_ACCEPTED_ORDER,
      SOCKET.EVENT.ORDER_CREATE_ADMIN_FOR_DELIVERY,
      SOCKET.EVENT.ORDER_CREATE_STORE_ORDER,
      // order status
      SOCKET.EVENT.ORDER_SWITCH_RESERVATION,
      SOCKET.EVENT.ORDER_STATUS_CANCELED_UPDATE,
      // order update
      SOCKET.EVENT.ORDER_PICKUP_WISH_AT_UPDATE,
      SOCKET.EVENT.ORDER_DROP_ADDRESS_UPDATE,
      SOCKET.EVENT.ORDER_PRODUCT_PAYMENT_UPDATE,
      SOCKET.EVENT.ORDER_PHONE_UPDATE,
      SOCKET.EVENT.ORDER_MEMO_UPDATE,
      // delivery create
      SOCKET.EVENT.DELIVERY_CREATE,
      SOCKET.EVENT.DELIVERY_SWITCH_SELF,
      // delivery status
      SOCKET.EVENT.DELIVERY_STATUS_ALLOCATED_UPDATE,
      SOCKET.EVENT.DELIVERY_STATUS_ALLOCATION_CANCELED_UPDATE,
      SOCKET.EVENT.DELIVERY_STATUS_ALLOCATION_CHANGED_UPDATE,
      SOCKET.EVENT.DELIVERY_STATUS_PICKUP_FINISHED_UPDATE,
      SOCKET.EVENT.DELIVERY_STATUS_DROP_FINISHED_UPDATE,
      SOCKET.EVENT.DELIVERY_STATUS_CANCELED_UPDATE,
      // delivery update
      SOCKET.EVENT.DELIVERY_CHARGE_UPDATE,
      SOCKET.EVENT.DELIVERY_PICKUP_EXPECTED_AT_UPDATE,
      SOCKET.EVENT.DELIVERY_PAYMENT_UPDATE,
      SOCKET.EVENT.DELIVERY_DROP_WISH_AT_UPDATE,
    ].forEach((event) => {
      subscribe(event, (message) => {
        if (isReceivable.value) {
          if (event === SOCKET.EVENT.ORDER_PRODUCT_PAYMENT_UPDATE
            || event === SOCKET.EVENT.DELIVERY_PAYMENT_UPDATE) {
            const { before, after } = message;
            if (before.taxFreePayPrice !== after.taxFreePayPrice) {
              // 1회용 컵 보증금
              common.showDeliveryStatusModal({ event, message, type: 'TAX_FREE_PAY_PRICE' });
            }
            if (before.prepaidPrice !== after.prepaidPrice
              || before.paymentCardPrice !== after.paymentCardPrice
              || before.paymentCashPrice !== after.paymentCashPrice) {
              // 결제 금액
              common.showDeliveryStatusModal({ event, message });
            }
          } else {
            common.showDeliveryStatusModal({ event, message });
          }
        }
        if (currentRouteName.value === 'OrderDetail' && currentOrderId.value === message.orderId) {
          const { storeId } = auth.currentStore;
          orderDetail.order({ storeId, orderId: message.orderId });
          orderDetail.orderChangeHistories({ storeId, orderId: message.orderId });
        } else
        if (currentRouteName.value === 'Main') {
          doGetOrders();
        }
      });
    });
    return {
      deliveryStatusModals: computed(() => common.deliveryStatusModals),
      currentIndex,
      restItemCount: computed(() => common.deliveryStatusModals.length - (currentIndex.value + 1)),
      handleClosed: () => {
        currentIndex.value += 1;
        if (currentIndex.value > common.deliveryStatusModals.length - 1) {
          common.truncateDeliveryStatusModal();
          currentIndex.value = 0;
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  color: #41CF6D;
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  &.negative {
    color: #E53935;
  }
}
.content {
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  .disabled {
    color: #616161;
    font-weight: 700;
    line-height: 18px;
    font-size: 12px;
  }
}
.close-button-wrap {
  margin: -1rem -1.2rem;
}
.address {
  line-height: 18px;
  font-size: 12px;
}
</style>
