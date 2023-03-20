<template>
  <VCardItem class="pa-0">
    <div class="mb-1 text-ellipsis">
      <span class="font-weight-bold">
        {{ order.orderAgencyDailyOrderId ? `[대기번호 ${order.orderAgencyDailyOrderId}]` : '' }}
        {{ order.orderDropAddress ? ordererAddress : '' }}
      </span>
      <span class="text-secondary ml-1">{{ order.dropAddressDetail }}</span>
    </div>
    <div class="text-caption mt-2">
      <div class="d-flex align-center text-secondary">
        <OrderAgencyIcon :order-agency-id="orderChannelAgency" />
        <div class="product ml-1">
          <span
            class="font-weight-bold"
          >{{ orderPrice }} {{ deliveryPrice }}</span>
        </div>
      </div>
    </div>
    <div class="text-caption mt-2">
      <div class="font-size-12 s-color-gray-66">
        {{ orderDeliveryPayment }}
      </div>
    </div>
  </VCardItem>
</template>

<script setup name="StoreCompletedOrdererInfo">
import { computed } from 'vue';

import { ORDER_CHANNEL, DELIVERY_TYPE, DELIVERY_STATUS } from '@/constants';
import { numberWithCommas } from '@/utils/stringUtils';
import { isPackingOrder, isHallOrder, getOrderPaymentName, getMainDelivery, getDeliveryPaymentName } from '@/utils/orderUtils';

import OrderAgencyIcon from '@/components/common/OrderAgencyIcon.vue';

const props = defineProps({
  order: {
    type: Object,
    require: true,
  },
});

const isOrderChannelBarogoHub = computed(
  () => props.order.orderChannel === ORDER_CHANNEL.BAROGO_HUB,
);

// 주문채널(or agencyId)
const orderChannelAgency = computed(() =>
  props.order.orderChannel?.toLowerCase() || props.order.orderAgencyId);

// 배달 주소
const ordererAddress = computed(() => {
  const dropAddress = props.order.orderDropAddress;
  let mainAddress = `${dropAddress.eupMyeonDong} ${dropAddress.mainLandNumber}-${dropAddress.subLandNumber}`;

  if (isOrderChannelBarogoHub.value && (!dropAddress.eupMyeonDong || !dropAddress.mainLandNumber)) {
    return '대리 접수 주문으로 생략되었습니다.';
  }

  if (!dropAddress.eupMyeonDong || !dropAddress.mainLandNumber) {
    mainAddress = `${dropAddress.roadName} ${dropAddress.mainBuildingNumber}`;
  }

  return mainAddress;
});

// 결제정보
const orderDeliveryPayment = computed(() => {
  const deliveryPayment = getDeliveryPaymentName(props.order);
  const orderPayment = getOrderPaymentName(props.order);

  if (deliveryPayment && deliveryPayment !== orderPayment) {
    return `${deliveryPayment} (${orderPayment} ‣ ${deliveryPayment})`;
  }

  return orderPayment;
});

// 주문금액
const orderPrice = computed(() => {
  const mainDelivery = getMainDelivery(props.order);
  const { actualPayPrice } = props.order;

  if (mainDelivery && actualPayPrice !== mainDelivery.actualPayPrice) {
    return `*${numberWithCommas(actualPayPrice)}원`;
  }

  return `${numberWithCommas(actualPayPrice)}원`;
});

// 대행료
const deliveryPrice = computed(() => {
  const mainDelivery = getMainDelivery(props.order);

  if (mainDelivery?.deliveryType === DELIVERY_TYPE.SELF) {
    return '직접배달';
  }

  if (isPackingOrder(props.order) || isHallOrder(props.order)) {
    return '-';
  }

  const totalPrice = props.order.deliveries.reduce((acc, cur) => {
    if (cur.status !== DELIVERY_STATUS.CANCELED) {
      return acc + cur.totalDeliveryPrice + cur.VATPrice;
    }
    return acc;
  }, 0);

  return `대행료 ${numberWithCommas(totalPrice)}원`;
});

</script>

<style lang="scss" scoped>
.product {
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  > span {
    font-size: 1.2rem;
  }
}
.text-ellipsis {
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
}
</style>
