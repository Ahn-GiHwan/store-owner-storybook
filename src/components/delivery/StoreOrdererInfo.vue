<template>
  <VCardItem class="pa-0">
    <div class="mt-2 mb-2 text-ellipsis">
      <span class="font-weight-bold">
        {{ order.orderAgencyDailyOrderId ? `[대기번호 ${order.orderAgencyDailyOrderId}]` : '' }}
        {{ ordererAddress }}
      </span>
      <span
        v-if="!isSkipAddress"
        class="text-secondary ml-1"
      >
        {{ order.dropAddressDetail }}
      </span>
    </div>
    <div class="text-caption">
      <div class="d-flex align-center text-secondary">
        <OrderAgencyIcon :order-agency-id="orderChannel" />
        <div class="product ml-1">
          <span class="font-weight-bold">
            주문금액 {{ numberWithCommas(order.actualPayPrice) }}원
          </span>
          <span class="ml-2">{{ orderProducts }}</span>
        </div>
      </div>
    </div>
    <div class="text-caption mt-3">
      <div class="font-size-12 s-color-gray-66">
        <span
          v-if="isOrderChannelBarogoHub"
          class="text-red font-size-12">
            허브 대리 접수
        </span>
        {{ ordererPhone }}
        <VChip
          v-if="order.ordererOrderMemo || order.storeOrderMemo"
          rounded="1"
          size="x-small"
          label
          :color="gray6Color"
          class="ml-1"
        >
          <span class="font-size-12 s-color-gray-66">요청사항</span>
        </VChip>
      </div>
    </div>
  </VCardItem>
</template>

<script setup name="StoreOrdererInfo">
import { computed } from 'vue';

import { useLocale } from 'vuetify';
import { isDeligatingOrder, isDeligatingOrderWithoutAddress, orderProductsFilter } from '@/utils/orderUtils';
import { addHyphenPhoneNumber, numberWithCommas } from '@/utils/stringUtils';

import OrderAgencyIcon from '@/components/common/OrderAgencyIcon.vue';
import { gray6Color } from '@/styles/_export.module.scss';

const props = defineProps({
  order: {
    type: Object,
    require: true,
  },
});

const { t } = useLocale();

const isOrderChannelBarogoHub = computed(() => isDeligatingOrder(props.order));

// 주문채널
const orderChannel = computed(() => {
  if (!props.order.orderChannel) {
    return props.order.orderAgencyId;
  }
  return props.order.orderChannel.toLowerCase();
});

// 주문상품
const orderProducts = computed(() => orderProductsFilter(props.order?.orderProducts));

// O2O를 통해 접수된 주문이면서 지번주소, 도로명주소가 없는 주문인지
const isSkipAddress = computed(() => isDeligatingOrderWithoutAddress(props.order));

// 주문자주소
const ordererAddress = computed(() => {
  if (isSkipAddress.value) {
    return t('common.address.O2OSkipOrderAddress');
  }

  const dropAddress = props.order.orderDropAddress;
  if (!dropAddress) {
    return '';
  }

  let mainAddress = `${dropAddress.eupMyeonDong} ${dropAddress.mainLandNumber}-${dropAddress.subLandNumber}`;
  if (!dropAddress.eupMyeonDong || !dropAddress.mainLandNumber) {
    mainAddress = `${dropAddress.roadName} ${dropAddress.mainBuildingNumber}`;
  }

  return mainAddress;
});

// 주문자 휴대번호
const ordererPhone = computed(() => {
  if (props.order.ordererPhone) {
    return addHyphenPhoneNumber(props.order.ordererPhone);
  }

  // 주문자 폰이 없을 경우 받는자 폰번호 노출
  if (props.order.receiverPhone) {
    return addHyphenPhoneNumber(props.order.receiverPhone);
  }

  return '전화번호가 없습니다.';
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
