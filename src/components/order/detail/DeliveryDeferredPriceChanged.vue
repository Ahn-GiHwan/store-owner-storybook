<template>
  <div class="d-flex flex-wrap">
    <span class="mr-1">{{
      numberWithCommas(
        $props.delivery.prepaidPrice
        + $props.delivery.paymentCardPrice
        + $props.delivery.paymentCashPrice)
    }} {{ $t('common.currency') }}</span>
    <span v-if="adiitionalInfo" class="font-size-12 s-color-gray-66"> {{ adiitionalInfo }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useLocale } from 'vuetify';

import { numberWithCommas } from '@/utils/stringUtils';
import { isProceedingOrder } from '@/utils/orderUtils';

/** 라이더 결제 정보 영역 발생 조건
 * • 딜리버리 > 라이더 결제 금액 변경으로 paymentCardPrice, paymentCashPrice, prepaidPrice 중 1개 라도 변경 시,
 *   라이더 결제 금액 영역 발생
 * • 선결제 금액 0원, 후불 결제만 발생한 경우 (prepaidPrice = 0 이 된 경우)
 *   ◦ 완료 전 (라이더 결제 예정 금액) 텍스트 표기
 *   ◦ 완료 후 (라이더 결제 예정 금액) 텍스트 발생하지 않음
 * • 선결제 포함한 복합결제 발생한 경우 (prepaidPrice = n and  (paymentCardPrice = n or paymentCashPrice =n) 인 경우)
 *   ◦ 완료 전/후 (선결제 n원 포함) 텍스트 표기  (8-3-42 참고)
 * • 후불 X, 선결제 금액만 있는 경우 (prepaidPrcie = n,  paymentCardPricem= 0, paymentCashPrice = 0 인 경우)
 *   ◦ 금액만 표기 ( ) 부가 텍스트 없음
 */

export default defineComponent({
  name: 'DeliveryDeferredPriceChanged',
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

    /*
    선결제 100 % 인 경우, (후불결제금액 X)
      부가정보 없음
    후불결제금액이 있는 경우
      선결제 금액이 있는 경우
        (선결제 n원 포함) 표시
        비과세 금액이 다른 경우
          (선결제 n원, 1회용 컵 보증금 n원 포함) 표시
      선결제 금액이 없는 경우
        비과세 금액이 다른 경우
          (1회용 컵 보증금 n원 포함) 표시
        그외
          주문 상태가 진행중 이라면(=finished, canceled, rejected, failed가 아니라면)
            (라이더 결제 예정 금액) 를 표기…
          그 외 (주문이 종결 상태)
            부가 정보 없음
    */
    const adiitionalInfo = computed(() => {
      let result;

      // 후불결제 금액이 있는 경우
      if (props.delivery.paymentCardPrice > 0 || props.delivery.paymentCashPrice > 0) {
        // 선결제 금액이 있는 경우
        if (props.delivery.prepaidPrice > 0) {
          // 비과세 금액이 다른 경우
          if (props.order.taxFreePayPrice !== props.delivery.taxFreePayPrice) {
            result = t('views.orderDetail.deliveryCard.label.prepaidPriceAndTaxFreePayPriceIncluded', {
              prepaidPrice: numberWithCommas(props.delivery.prepaidPrice),
              taxFreePayPrice: numberWithCommas(props.delivery.taxFreePayPrice),
            });
          } else {
            result = t('views.orderDetail.deliveryCard.label.prepaidPriceIncluded', {
              price: numberWithCommas(props.delivery.prepaidPrice),
            });
          }
        } else if (props.order.taxFreePayPrice !== props.delivery.taxFreePayPrice) {
          result = t('views.orderDetail.deliveryCard.label.taxFreePayPriceIncluded', {
            taxFreePayPrice: numberWithCommas(props.delivery.taxFreePayPrice),
          });
        } else if (isProceedingOrder(props.order)) {
          result = t('views.orderDetail.deliveryCard.label.customerPaymentToRider');
        }
      }

      return result;
    });

    return {
      numberWithCommas,
      adiitionalInfo,
    };
  },
});
</script>
