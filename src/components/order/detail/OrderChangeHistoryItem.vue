<template>
  <VCard
    v-if="changes.length > 0"
    flat
    :color="gray2Color"
    class="rounted mt-3"
  >
    <VRow no-gutters class="mx-3 mt-3 mb-1 d-flex justify-space-between">
      <VCol class="text-left flex-grow-1 flex-shrink-0">
        <span class="font-size-12 font-weight-700">
          {{ historyItemTitle }}
        </span>
      </VCol>
      <VCol
        style="min-width:8rem;"
        class="text-right flex-shrink-1 flex-grow-0">
        <span class="font-size-10 font-weight-700">
          {{ historyCreatedAt }}
        </span>
      </VCol>
    </VRow>
    <VRow no-gutters class="mx-3" v-for="(change, index) of changes" :key="index">
      <VCol class="text-left d-inline-flex flex-wrap" >
        <span class="font-size-12 s-color-gray-66">
          {{ change.beforeStr }}
        </span>
        <VIcon class="mx-1" icon="mdi-trending-neutral"/>
        <span class="font-size-12 font-weight-700">
          {{ change.afterStr }}
        </span>
      </VCol>
    </VRow>
    <VRow no-gutters class="mx-3 mt-1 mb-3 d-flex justify-space-between">
      <VCol class="text-left">
        <span class="font-size-12 s-color-gray-66">
          {{ whoChanged }}
        </span>
      </VCol>
      <VCol class="text-right">
        <template v-if="isShowAgencyInfo">
          <template
            v-if="
              history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_ORDER_AGENCY &&
              history.orderAgencyId"
          >
            <OrderAgencyIcon
              :orderAgencyId="history.orderAgencyId"
            />
            <span class="font-size-12 ml-2">
              {{ historyOrderAgencyName }}
            </span>
          </template>
          <template
            v-else-if="
              history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_DELIVERY_AGENCY &&
              history.deliveryAgencyId"
          >
            <DeliveryAgencyIcon
              :deliveryAgencyId="history.deliveryAgencyId"
            />
            <span class="font-size-12 ml-2">
              {{ historyDeliveryAgencyName }}
            </span>
          </template>
        </template>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup name="OrderChangeHistoryItem">
import { computed } from 'vue';
import { useLocale } from 'vuetify';
import { useAuthStore } from '@/stores';

import {
  getOrderDateTime,
} from '@/utils/dateUtils';

import {
  numberWithCommas,
  addHyphenPhoneNumber,
} from '@/utils/stringUtils';

import {
  ORDER_CHANGE_HISTORY_EVENT_NAME,
  ORDER_CHANGE_HISTORY_EDITOR_TYPE,
} from '@/constants';

import { gray2Color } from '@/styles/_export.module.scss';
import OrderAgencyIcon from '@/components/common/OrderAgencyIcon.vue';
import DeliveryAgencyIcon from '@/components/common/DeliveryAgencyIcon.vue';

const { t } = useLocale();
const authStore = useAuthStore();

const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
});

const historyOrderAgencyName = computed(() => {
  const { history } = props;
  if (history.orderAgencyId === '') {
    return t('common.orderAgencies.unknown');
  }
  return `${t(`common.orderAgencies.${history.orderAgencyId}`, history.orderAgencyId)}`;
});

const historyDeliveryAgencyName = computed(() => {
  const { history } = props;
  if (history.deliveryAgencyId === '') {
    return t('common.deliveryAgency.unknown');
  }
  return `${t(`common.deliveryAgency.${history.deliveryAgencyId}`, history.deliveryAgencyId)}`;
});

const historyItemTitle = computed(() => {
  const { history } = props;
  let { eventName } = history;
  switch (eventName) {
    // 픽업 예상시간 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PICKUP_EXPECTED_AT:
      // 주문제휴사, 배달대행사에 의해 수정된 건에 따라 다르게 제목을 출력
      if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_ORDER_AGENCY) {
        eventName += '_BY_ORDERAGENCY';
      } else
      if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_DELIVERY_AGENCY) {
        eventName += '_BY_DELIVERYAGENCY';
      }
      break;

    // 결제 금액 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PAYMENT_INFO:
      // 배달대행사 통해서 결제정보가 수정된 경우 라이더 결제 금액 변경으로 표기
      if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_DELIVERY_AGENCY) {
        eventName += '_BY_DELIVERYAGENCY';
      }
      break;

    // 전화번호 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PHONE_INFO:
      // 수령자 연락처만 바뀐 경우 수령인 연락처 변경으로 타이틀 명시
      if (
        history.before.receiverPhone !== history.after.receiverPhone &&
        history.before.ordererPhone === history.after.ordererPhone
      ) {
        eventName += '_FOR_RECEIVER';
      }
      break;

    // 나머지 이벤트들은 이벤트 이름에 특별한 작업 없이 바로 출력 가능
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PICKUP_WISH_AT:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_DELIVERY_TO_SELF:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_STORE_DROP_EXPECTED_AT:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_DROP_INFO:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_CHARGE_INFO:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PRODUCT_INFO:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_MEMO_INFO:
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_ORDER_TO_RESERVATION:
      break;
    default:
      eventName = 'unknown';
  }

  return t(`views.orderDetail.orderChangeHistories.title.${eventName}`);
});

const historyCreatedAt = computed(() => getOrderDateTime(props.history.createdAt, 'M월 D일 HH:mm'));

const changes = computed(() => {
  const { history } = props;
  const result = [];
  let beforeStr = '';
  let afterStr = '';

  switch (history.eventName) {
    // 상품 준비시간 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PICKUP_WISH_AT:
      if (history.before?.pickupWishAt > 0) {
        beforeStr = getOrderDateTime(history.before?.pickupWishAt, 'DD일 HH:mm');
      }
      afterStr = getOrderDateTime(history.after?.pickupWishAt, 'DD일 HH:mm');
      result.push({ beforeStr, afterStr });

      break;

    // 픽업 예상시간 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PICKUP_EXPECTED_AT:
      if (history.before?.pickupExpectedAt > 0) {
        beforeStr = getOrderDateTime(history.before?.pickupExpectedAt, 'DD일 HH:mm');
      }
      afterStr = getOrderDateTime(history.after?.pickupExpectedAt, 'DD일 HH:mm');

      result.push({ beforeStr, afterStr });
      break;

    // 고객 도착시간 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_STORE_DROP_EXPECTED_AT:
      if (history.before?.storeDropExpectedAt > 0) {
        beforeStr = getOrderDateTime(history.before?.storeDropExpectedAt, 'DD일 HH:mm');
      }
      afterStr = getOrderDateTime(history.after?.storeDropExpectedAt, 'DD일 HH:mm');

      result.push({ beforeStr, afterStr });
      break;

    // 도착지 주소 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_DROP_INFO:
      if (history.before?.dropJibunAddress) {
        beforeStr = `${history.before?.dropJibunAddress} ${history.before?.dropAddressDetail ? history.before?.dropAddressDetail : ''}`;
        afterStr = `${history.after?.dropJibunAddress} ${history.after?.dropAddressDetail ? history.after?.dropAddressDetail : ''}`;
      } else if (history.before?.dropRoadAddress) {
        beforeStr = `${history.before?.dropRoadAddress} ${history.before?.dropAddressDetail ? history.before?.dropAddressDetail : ''}`;
        afterStr = `${history.after?.dropRoadAddress} ${history.after?.dropAddressDetail ? history.after?.dropAddressDetail : ''}`;
      } else if (history.before?.dropAddressDetail
        || history.after?.dropAddressDetail) { // 상세주소만 변경된 경우
        beforeStr = history.before?.dropAddressDetail || '';
        afterStr = history.after?.dropAddressDetail || '';
      }
      result.push({ beforeStr, afterStr });
      break;

    // 배달대행료 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_CHARGE_INFO:
      // 요금 합계 변경된 경우
      if (history.before?.totalDeliveryPrice !== history.after?.totalDeliveryPrice) {
        beforeStr =
          `${t('views.orderDetail.orderChangeHistories.subTitle.totalDeliveryPrice')} ` +
          `${numberWithCommas(
            (
              history.before.totalDeliveryPrice +
              (history.before.VATPrice ? history.before.VATPrice : 0)
            ).toString(),
          )} ${t('common.currency')}`;
        afterStr =
          `${numberWithCommas(
            (
              history.after.totalDeliveryPrice +
              (history.after.VATPrice ? history.after.VATPrice : 0)
            ).toString(),
          )} ${t('common.currency')}`;

        result.push({ beforeStr, afterStr });
      }

      // 기본 대행료가 변경된 경우
      if (history.before?.deliveryPrice !== history.after?.deliveryPrice) {
        beforeStr =
          `${t('views.orderDetail.orderChangeHistories.subTitle.deliveryPrice')} ` +
          `${numberWithCommas(history.before.deliveryPrice.toString())} ${t('common.currency')}`;
        afterStr =
          `${numberWithCommas(history.after.deliveryPrice.toString())} ${t('common.currency')}`;

        result.push({ beforeStr, afterStr });
      }

      // 할증 요금이 변경된 경우
      if (history.before?.totalExtraCharge !== history.after?.totalExtraCharge) {
        const chargeSet = new Set();
        const charges = [];

        // before, after 에 등록되어 있는 모든 할증 종류를 알아냅니다.
        if (history.before?.extraCharges) {
          history.before.extraCharges.forEach((charge) => chargeSet.add(charge.type));
        }
        if (history.after?.extraCharges) {
          history.after.extraCharges.forEach((charge) => chargeSet.add(charge.type));
        }
        // 알아낸 모든 할증 타입에 대해서 before, after 값을 알아냅니다.
        chargeSet.forEach((type) => {
          const chargeInfo = {
            type,
            beforeCharge: 0,
            afterCharge: 0,
          };

          const beforeCharge =
            history.before?.extraCharges.find((charge) => charge.type === type);
          const afterCharge =
            history.after?.extraCharges.find((charge) => charge.type === type);
          // 이전 할증 값이 있다면 할증 금액을 저장합니다.
          if (beforeCharge) {
            chargeInfo.beforeCharge = beforeCharge.charge;
          }
          // 나중 할증 값이 있다면 할증 금액을 저장합니다.
          if (afterCharge) {
            chargeInfo.afterCharge = afterCharge.charge;
          }
          // 할증 리스트에 추가합니다.
          charges.push(chargeInfo);
        });

        // 알아낸 할증 종류별 할증 값에 대해서 한줄 씩 값을 추가해 줍니다.
        charges.forEach((charge) => {
          beforeStr =
            `${t(`common.extraCharges.${charge.type}`)} ${t('common.order.deliveryInfo.extraCharge')}: ` +
            `${numberWithCommas(charge.beforeCharge.toString())} ${t('common.currency')}`;

          afterStr =
            `${numberWithCommas(charge.afterCharge.toString())} ${t('common.currency')}`;

          result.push({ beforeStr, afterStr });
        });
      }

      // 부가세 금액이 변경된 경우
      if (history.before?.VATPrice !== history.after?.VATPrice) {
        beforeStr =
          `${t('views.orderDetail.orderChangeHistories.subTitle.vatPrice')} ` +
          `${numberWithCommas(history.before.VATPrice.toString())} ${t('common.currency')}`;
        afterStr =
          `${numberWithCommas(history.after.VATPrice.toString())} ${t('common.currency')}`;

        result.push({ beforeStr, afterStr });
      }
      break;
    // 상품 금액 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PRODUCT_INFO:
      beforeStr =
        `${numberWithCommas(history.before.actualPayPrice.toString())} ${t('common.currency')}`;
      afterStr =
        `${numberWithCommas(history.after.actualPayPrice.toString())} ${t('common.currency')}`;

      result.push({ beforeStr, afterStr });
      break;

    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PAYMENT_INFO:
      // 결제 금액중 일부라도 변경된 경우
      if
      (
        history.before.prepaidPrice !== history.after.prepaidPrice ||
        history.before.paymentCashPrice !== history.after.paymentCashPrice ||
        history.before.paymentCardPrice !== history.after.paymentCardPrice ||
        history.before.taxFreePayPrice !== history.after.taxFreePayPrice
      ) {
        beforeStr = '';
        afterStr = '';

        // 선결제 금액이 수정된 경우, 배달대행사에서 prepaidPrice를 변경한 경우에만 표시
        if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_DELIVERY_AGENCY &&
          history.before.prepaidPrice !== history.after.prepaidPrice) {
          beforeStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.prepaidPrice', {
              prepaidPrice: numberWithCommas(history.before.prepaidPrice.toString()),
            })}`;

          afterStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.prepaidPrice', {
              prepaidPrice: numberWithCommas(history.after.prepaidPrice.toString()),
            })}`;
        }

        // 현금 결제 건
        if (history.before.paymentCashPrice !== history.after.paymentCashPrice) {
          beforeStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.cashPrice', {
              cashPrice: numberWithCommas(history.before.paymentCashPrice.toString()),
            })}`;

          afterStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.cashPrice', {
              cashPrice: numberWithCommas(history.after.paymentCashPrice.toString()),
            })}`;
        }

        // 카드 결제 건
        if (history.before.paymentCardPrice !== history.after.paymentCardPrice) {
          beforeStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.cardPrice', {
              cardPrice: numberWithCommas(history.before.paymentCardPrice.toString()),
            })}`;

          afterStr +=
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.cardPrice', {
              cardPrice: numberWithCommas(history.after.paymentCardPrice.toString()),
            })}`;
        }
        // 결제금액에 대한 변경내역 추가
        if (beforeStr !== '' && afterStr !== '') {
          result.push({
            beforeStr: beforeStr.slice(2, beforeStr.length),
            afterStr: afterStr.slice(2, afterStr.length) });
        }

        // 비과세 금액이 변경된 경우
        if (history.before?.taxFreePayPrice !== history.after?.taxFreePayPrice) {
          beforeStr =
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.beforeTaxFreePayPrice', {
              price: numberWithCommas(history.before.taxFreePayPrice.toString()),
            })}`;

          afterStr =
            `, ${t('views.orderDetail.orderChangeHistories.subTitle.afterTaxFreePayPrice', {
              price: numberWithCommas(history.after.taxFreePayPrice.toString()),
            })}`;

          result.push({ beforeStr, afterStr });
        }
      }
      break;

    // 메모 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_MEMO_INFO:
      // 상점 메모 변경
      if (history.before.storeOrderMemo !== history.after.storeOrderMemo) {
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.storeOrderMemo') +
          (history.before.storeOrderMemo ? history.before.storeOrderMemo : '');
        afterStr = history.after.storeOrderMemo ? history.after.storeOrderMemo : '';

        result.push({ beforeStr, afterStr });
      }
      // 고객 메모 변경
      if (history.before.ordererOrderMemo !== history.after.ordererOrderMemo) {
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.ordererOrderMemo') +
          (history.before.ordererOrderMemo ? history.before.ordererOrderMemo : '');
        afterStr = history.after.ordererOrderMemo ? history.after.ordererOrderMemo : '';

        result.push({ beforeStr, afterStr });
      }
      break;

    // 연락처 변경
    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_PHONE_INFO:
      // 주문자, 수령자 연락처가 서로 달라진 경우
      if (
        history.before.ordererPhone !== history.after.ordererPhone &&
        history.before.receiverPhone !== history.after.receiverPhone &&
        history.after.ordererPhone !== history.after.receiverPhone
      ) {
        // 주문자 연락처 변경사항
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.ordererPhone') +
          (history.before.ordererPhone ? addHyphenPhoneNumber(history.before.ordererPhone) : '');
        afterStr = history.after.ordererPhone ? addHyphenPhoneNumber(history.after.ordererPhone) : '';

        result.push({ beforeStr, afterStr });

        // 수령자 연락처 변경사항
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.receiverPhone') +
          (history.before.receiverPhone ? addHyphenPhoneNumber(history.before.receiverPhone) : '');
        afterStr = history.after.receiverPhone ? addHyphenPhoneNumber(history.after.receiverPhone) : '';

        result.push({ beforeStr, afterStr });
      } else if (history.before.ordererPhone !== history.after.ordererPhone) {
        // 주문자 연락처만 바뀐 경우
        beforeStr = history.before.ordererPhone ? addHyphenPhoneNumber(history.before.ordererPhone) : '';
        afterStr = history.after.ordererPhone ? addHyphenPhoneNumber(history.after.ordererPhone) : '';

        result.push({ beforeStr, afterStr });
      } else if (history.before.receiverPhone !== history.after.receiverPhone) {
        // 수령자 연락처만 바뀐 경우
        beforeStr = history.before.receiverPhone ? addHyphenPhoneNumber(history.before.receiverPhone) : '';
        afterStr = history.after.receiverPhone ? addHyphenPhoneNumber(history.after.receiverPhone) : '';

        result.push({ beforeStr, afterStr });
      }
      break;

    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_ORDER_TO_RESERVATION:
      if (history.before?.dropWishAt !== history.after?.dropWishAt) {
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.receipted');
        afterStr = t('views.orderDetail.orderChangeHistories.subTitle.changeToReservation', {
          dropWishAt: getOrderDateTime(history.after.dropWishAt, 'yyyy-MM-dd HH:mm'),
        });

        result.push({ beforeStr, afterStr });
      }
      break;

    case ORDER_CHANGE_HISTORY_EVENT_NAME.CHANGE_DELIVERY_TO_SELF:
      if (history.before?.cancelType !== history.after?.cancelType) {
        beforeStr = t('views.orderDetail.orderChangeHistories.subTitle.receipted');
        afterStr = t('views.orderDetail.orderChangeHistories.subTitle.changeToSelfDelivery', {
          dropWishAt: getOrderDateTime(history.createdAt, 'yyyy-MM-dd HH:mm'),
        });

        result.push({ beforeStr, afterStr });
      }
      break;

    default:
      break;
  }
  return result;
});

const whoChanged = computed(() => {
  const { history } = props;

  if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.STORE_USER) {
    return t(
      'views.orderDetail.orderChangeHistories.orderHistoryEditorByStoreAndAdmin',
      { editorName: authStore.currentStore.name },
    );
  } if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.ADMIN_USER) {
    return t(
      'views.orderDetail.orderChangeHistories.orderHistoryEditorByStoreAndAdmin',
      { editorName: t('views.orderDetail.orderChangeHistories.adminName') },
    );
  } if (history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.INTERNAL_SYSTEM) {
    return t(
      'views.orderDetail.orderChangeHistories.orderHistoryEditorByStoreAndAdmin',
      { editorName: t('views.orderDetail.orderChangeHistories.systemName') },
    );
  }
  return t(
    'views.orderDetail.orderChangeHistories.orderHistoryEditor',
    { editorName: history.editorName },
  );
});

const isShowAgencyInfo = computed(() =>
  props.history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_ORDER_AGENCY ||
  props.history.editorType === ORDER_CHANGE_HISTORY_EDITOR_TYPE.DEV_USER_DELIVERY_AGENCY);

</script>

<style lang="scss" scoped>

</style>
