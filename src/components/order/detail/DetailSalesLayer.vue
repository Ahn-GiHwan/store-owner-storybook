<template>
  <StoreCommonLayer
    :dialog="dialog"
    :bottom="false"
    @close="emit('close-layer')"
  >
    <template #header>
      {{ $t('common.order.salesInfo.detailSales') }}
    </template>
    <template #content>
      <VMain class="py-0">
        <div
          class="content flex-column justify-center pb-2"
          :class="[!mdAndUp && 'mx-2']"
        >
          <VCard
            class="total-detail-sales py-4 px-6"
            width="100%"
            height="143px"
            variant="outlined"
            color="primary"
          >
            <p class="d-flex justify-space-between">
              <span class="font-size-12 font-weight-bold">
                {{$t('common.order.salesInfo.viewPeriod')}}
              </span>
              <span class="font-size-12 font-weight-bold">
                {{ getViewPeriod }}
              </span>
            </p>
            <p class="total-revenue my-2 pb-2 d-flex justify-space-between font-weight-bold">
              <span>
                {{$t('common.order.salesInfo.totalRevenue')}}
              </span>
              <span>
                {{numberWithCommas(orderStore.totalPaymentInfo.totalRevenue)}} 원
              </span>
            </P>
            <p class="d-flex justify-space-between s-color-black-11 font-weight-bold">
              <span class="font-size-12">
                {{$t('common.order.salesInfo.totalPaymentPrice')}}
              </span>
              <span class="font-size-12">
                {{numberWithCommas(orderStore.totalPaymentInfo.totalPaymentPrice)}} 원
              </span>
            </p>
            <div class="mt-2 d-flex justify-space-between s-color-black-11 font-weight-bold">
              <span class="font-size-12">
                {{$t('common.order.salesInfo.totalDeliveryPrice')}}
              </span>
              <span class="font-size-12">
                {{ getTotalDeliveryPrice }}
              </span>
            </div >
          </VCard>
          <VCard
            class="total-detail-sales mt-2 py-4 px-4"
            width="100%"
            variant="outlined"
            color="grey-lighten-2"
          >
            <div class="wrap-card-title">
              <p class="card-title font-size-16 font-weight-bold">
                {{$t('common.order.salesInfo.totalPaymentHistory')}}
              </p>
              <p class="card-notice font-size-12 mt-1 font-weight-400">
                {{$t('common.order.salesInfo.totalPaymentHistoryNotice')}}
              </p>
            </div>
            <PaymentDetailHistory
              class="mt-2"
              :payment-history="deliveryOrder"
            />
            <PaymentDetailHistory
              v-if="isCityKitchen && packingOrder.totalQuantity"
              class="mt-2"
              :payment-history="packingOrder"
            />
            <PaymentDetailHistory
              v-if="isCityKitchen && hallOrder.totalQuantity"
              class="mt-2"
              :payment-history="hallOrder"
            />
          </VCard>
          <VCard
            class="total-detail-sales mt-2 py-4 px-4"
            width="100%"
            variant="outlined"
            color="grey-lighten-2"
          >
            <div class="wrap-card-title">
              <p class="card-title font-size-16 font-weight-bold">
                {{$t('common.order.salesInfo.totalDeliveryHistory')}}
              </p>
              <p class="card-notice font-size-12 mt-1 font-weight-400">
                {{$t('common.order.salesInfo.totalDeliveryHistoryNotice')}}
              </p>
            </div>
            <PaymentDetailHistory
              class="mt-2"
              :payment-history="deliveryPriceInfo"
            />
          </VCard>
        </div>
      </VMain>
    </template>
  </StoreCommonLayer>
</template>

<script setup name="DetailSalesLayer">
import { useDisplay } from 'vuetify';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { STORE_TYPE } from '@constants/type';
import { timestampToDateTime } from '@utils/dateUtils';
import PaymentDetailHistory from '@/components/order/detail/PaymentDetailHistory.vue';
import { useAuthStore, useOrderStore } from '@/stores';
import { numberWithCommas } from '@/utils/stringUtils';
import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';

defineProps({
  dialog: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close-layer']);
const { t } = useI18n();
const { mdAndUp } = useDisplay();
const orderStore = useOrderStore();
const authStore = useAuthStore();
// 조회 기간
const getViewPeriod = computed(() => {
  const { createdAt } = orderStore.selectedFiltering;
  if (!createdAt) {
    return false;
  }
  return `${timestampToDateTime(createdAt.startAt, 'YYYY-MM-DD')} - ${timestampToDateTime(createdAt.endAt, 'YYYY-MM-DD')}`;
});

// 배달 대행료 합계
const getTotalDeliveryPrice = computed(() => {
  if (!orderStore.totalPaymentInfo.totalDeliveryPrice) {
    return `0 ${t('common.currency')}`;
  }

  const totalDeliveryPrice = numberWithCommas(orderStore.totalPaymentInfo.totalDeliveryPrice);
  return `- ${totalDeliveryPrice} ${t('common.currency')}`;
});
const { storeType } = authStore.currentStore;
// 도시주방인지
const isCityKitchen = computed(() => storeType === STORE_TYPE.CITY_KITCHEN);
// 배달 주문 데이터
const deliveryOrder = computed(() => {
  const {
    countOrder,
    countPostpaidPrice,
    sumPostpaidPrice,
    countPaymentCardPrice,
    sumPaymentCardPrice,
    countPaymentCashPrice,
    sumPaymentCashPrice,
    countPrepaidPrice,
    sumPrepaidPrice,
    countPaymentMixedPrice,
    sumPaymentMixedPrice,
    sumActualPayPrice,
    countTaxFreePayPrice,
    sumTaxFreePayPrice,
  } = orderStore.deliveryOrder;
  const parseDeliveryOrder = {
    title: t('common.order.salesInfo.deliveryOrder'),
    totalQuantity: numberWithCommas(countOrder),
    totalPrice: numberWithCommas(sumActualPayPrice),
    options: [
      {
        type: t('common.order.salesInfo.cupDeposit'),
        quantity: numberWithCommas(countTaxFreePayPrice),
        price: numberWithCommas(sumTaxFreePayPrice),
      },
    ],
    paymentInformationList: [
      {
        type: t('common.order.salesInfo.deferredPayment'),
        quantity: numberWithCommas(countPostpaidPrice),
        price: numberWithCommas(sumPostpaidPrice),
        options: [
          {
            type: t('common.order.salesInfo.card'),
            quantity: numberWithCommas(countPaymentCardPrice),
            price: numberWithCommas(sumPaymentCardPrice),
          },
          {
            type: t('common.order.salesInfo.cash'),
            quantity: numberWithCommas(countPaymentCashPrice),
            price: numberWithCommas(sumPaymentCashPrice),
          },
        ],
      },
      {
        type: t('common.order.salesInfo.prepayment'),
        quantity: numberWithCommas(countPrepaidPrice),
        price: numberWithCommas(sumPrepaidPrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.complexPayment'),
        quantity: numberWithCommas(countPaymentMixedPrice),
        price: numberWithCommas(sumPaymentMixedPrice),
        options: [],
      },
    ],
  };
  return parseDeliveryOrder;
});
// 포장 주문 데이터
const packingOrder = computed(() => {
  const {
    countOrder,
    countPostpaidPrice,
    sumPostpaidPrice,
    countPrepaidPrice,
    sumPrepaidPrice,
    countPaymentMixedPrice,
    sumPaymentMixedPrice,
    sumActualPayPrice,
    countTaxFreePayPrice,
    sumTaxFreePayPrice,
  } = orderStore.packingOrder;
  const parsePackingOrder = {
    title: t('common.order.salesInfo.packingOrder'),
    totalQuantity: countOrder && numberWithCommas(countOrder),
    totalPrice: numberWithCommas(sumActualPayPrice),
    options: [
      {
        type: t('common.order.salesInfo.cupDeposit'),
        quantity: numberWithCommas(countTaxFreePayPrice),
        price: numberWithCommas(sumTaxFreePayPrice),
      },
    ],
    paymentInformationList: [
      {
        type: t('common.order.salesInfo.deferredPayment'),
        quantity: numberWithCommas(countPostpaidPrice),
        price: numberWithCommas(sumPostpaidPrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.prepayment'),
        quantity: numberWithCommas(countPrepaidPrice),
        price: numberWithCommas(sumPrepaidPrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.complexPayment'),
        quantity: numberWithCommas(countPaymentMixedPrice),
        price: numberWithCommas(sumPaymentMixedPrice),
        options: [],
      },
    ],
  };
  return parsePackingOrder;
});
// 홀 주문 데이터
const hallOrder = computed(() => {
  const {
    countOrder,
    countPostpaidPrice,
    sumPostpaidPrice,
    countPrepaidPrice,
    sumPrepaidPrice,
    countPaymentMixedPrice,
    sumPaymentMixedPrice,
    sumActualPayPrice,
    countTaxFreePayPrice,
    sumTaxFreePayPrice,
  } = orderStore.hallOrder;
  const parseHallOrder = {
    title: t('common.order.salesInfo.hallOrder'),
    totalQuantity: countOrder && numberWithCommas(countOrder),
    totalPrice: numberWithCommas(sumActualPayPrice),
    options: [
      {
        type: t('common.order.salesInfo.cupDeposit'),
        quantity: numberWithCommas(countTaxFreePayPrice),
        price: numberWithCommas(sumTaxFreePayPrice),
      },
    ],
    paymentInformationList: [
      {
        type: t('common.order.salesInfo.deferredPayment'),
        quantity: numberWithCommas(countPostpaidPrice),
        price: numberWithCommas(sumPostpaidPrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.prepayment'),
        quantity: numberWithCommas(countPrepaidPrice),
        price: numberWithCommas(sumPrepaidPrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.complexPayment'),
        quantity: numberWithCommas(countPaymentMixedPrice),
        price: numberWithCommas(sumPaymentMixedPrice),
        options: [],
      },
    ],
  };
  return parseHallOrder;
});
// 배달 결제 내역 데이터
const deliveryPriceInfo = computed(() => {
  const {
    countDeliveryPrice,
    sumDeliveryPrice,
    countExtraCharge,
    sumExtraCharge,
    sumVATPrice,
    sumTotalDeliveryPrice,
    extraCharges,
    countCommission,
    sumCommission,
    countMaintenanceFee,
    sumMaintenanceFee,
  } = orderStore.deliveryPriceInfo;

  let distanceCharges = 0;
  const weatherCharges = {
    type: `${t('common.extraCharges.WEATHER')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };
  const areaCharges = {
    type: `${t('common.extraCharges.AREA')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };
  const timeCharges = {
    type: `${t('common.extraCharges.TIME')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };
  const valuableCharges = {
    type: `${t('common.extraCharges.VALUABLE')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };
  const holidayCharges = {
    type: `${t('common.extraCharges.HOLIDAY')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };
  const otherCharges = {
    type: `${t('common.extraCharges.ETC')} ${t('common.order.salesInfo.extraCharge')}`,
    quantity: 0,
    price: 0,
  };

  extraCharges.forEach((extraCharge) => {
    if (extraCharge.chargeType === 'DISTANCE') {
      distanceCharges += extraCharge.charge;
      return;
    }
    if (extraCharge.chargeType === 'WEATHER') {
      weatherCharges.price += extraCharge.charge;
      weatherCharges.quantity += extraCharge.count;
      return;
    }
    if (extraCharge.chargeType === 'AREA') {
      areaCharges.price += extraCharge.charge;
      areaCharges.quantity += extraCharge.count;
      return;
    }
    if (extraCharge.chargeType === 'TIME') {
      timeCharges.price += extraCharge.charge;
      timeCharges.quantity += extraCharge.count;
      return;
    }
    if (extraCharge.chargeType === 'VALUABLE') {
      valuableCharges.price += extraCharge.charge;
      valuableCharges.quantity += extraCharge.count;
      return;
    }
    if (extraCharge.chargeType === 'HOLIDAY') {
      holidayCharges.price += extraCharge.charge;
      holidayCharges.quantity += extraCharge.count;
      return;
    }
    otherCharges.price += extraCharge.charge;
    otherCharges.quantity += extraCharge.count;
  });
  const parseExtraCharges = [
    weatherCharges,
    areaCharges,
    timeCharges,
    valuableCharges,
    holidayCharges,
    otherCharges,
  ].reduce((acc, cur) => {
    if (cur.quantity > 0) {
      const parseCur = {
        type: cur.type,
        price: numberWithCommas(cur.price),
        quantity: numberWithCommas(cur.quantity),
      };
      acc.push(parseCur);
      return acc;
    }
    return acc;
  }, []);
  const basicAgencyFeePrice = sumDeliveryPrice + distanceCharges;
  const parseDeliveryPriceInfo = {
    title: t('common.order.salesInfo.deliveryOrder'),
    subtitle: `(${t('common.order.salesInfo.deliveryNotice')})`,
    totalQuantity: numberWithCommas(countDeliveryPrice),
    totalPrice: numberWithCommas(sumTotalDeliveryPrice),
    options: [],
    paymentInformationList: [
      {
        type: t('common.order.salesInfo.basicAgencyFee'),
        quantity: numberWithCommas(countDeliveryPrice),
        price: numberWithCommas(basicAgencyFeePrice),
        options: [],
      },
      {
        type: t('common.order.salesInfo.deliverySurcharge'),
        quantity: numberWithCommas(countExtraCharge),
        price: numberWithCommas(sumExtraCharge),
        options: parseExtraCharges,
      },
      {
        type: t('common.order.salesInfo.deliveryCommission'),
        quantity: numberWithCommas(countCommission),
        price: numberWithCommas(sumCommission),
        options: [],
      },
      {
        type: t('common.order.salesInfo.vatPrice'),
        quantity: -1, // 건수를 표기하지 않는 케이스
        price: numberWithCommas(sumVATPrice),
        options: [],
      },
    ],
    additionalPaymentInformationList: [
      {
        type: t('common.order.salesInfo.managementFeeCase'),
        quantity: numberWithCommas(countMaintenanceFee),
        price: numberWithCommas(sumMaintenanceFee),
        options: [],
      },
    ],
  };
  return parseDeliveryPriceInfo;
});
</script>
<style lang="scss" scoped>
.content {
  white-space: pre-line;

  .total-detail-sales {
    .total-revenue {
      border-bottom: solid 1px $color-gray-cb;
      > span {
        font-size: 18px;
      }
    }
    .wrap-card-title {
      .card-title {
        color: #000;
      }
      .card-notice {
        word-break: keep-all;
        color: $color-gray-61;
      }
    }
  }
}
</style>
