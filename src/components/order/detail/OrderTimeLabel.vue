<template>
  <div class="ml-2">
    <span class="font-size-12 s-color-gray-66">
      <template v-if="isAcceptableOrder">
        <template v-if="!isExpired">
          취소까지 시간
          <span class="text-red">
            {{ remainingTime }}
          </span>
        </template>
        <template v-else>
          자동 거절되었습니다.
        </template>
      </template>
      <template v-else>
        {{ orderProceedAtLabel }}
      </template>
    </span>
  </div>
</template>

<script>
/**
 * {주문일시}
 *   order.isReservation === true
 *     orderProceedAt + '배달 접수'
 *   order.isReservation !== true
 *     createdAt + '주문 접수'
 * order.status === ORDER_STATUS.FINISHED
 *   'v 완료된 주문'(초록) + {주문일시}
 * order.status === ORDER_STATUS.CANCELED
 *   '취소된 주문'(빨강) + {주문일시}
 * order.status === ORDER_STATUS.CREATED
 *   && order.orderType === ORDER_TYPE.FOR_ORDER
 *   수락 제한시간 전
 *     '취소까지 시간' mm:ss
 *   수락 제한시간 만료
 *     '자동 거절되었습니다.'
 * 그 외
 *   {주문일시}
 */
import { defineComponent, computed, onMounted, watchEffect } from 'vue';
import { useTimer } from 'vue-timer-hook';
import { useLocale } from 'vuetify';

import { useCommonStore } from '@/stores';
import { isNeedAccept, getOrderProceedAt } from '@/utils/orderUtils';
import { formatBy2DigitNumber, timestampToDateTime } from '@/utils/dateUtils';

export default defineComponent({
  name: 'OrderTimeLabel',
  props: {
    order: {
      type: Object,
    },
    orderAgency: {
      type: Object,
    },
  },
  emits: ['acceptable-time-expired'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const common = useCommonStore();

    const isAcceptableOrder = computed(() => isNeedAccept(props.order));
    let timer;
    if (isAcceptableOrder.value) {
      const expiredAt = props.order.createdAt
        + ((props.orderAgency.orderAgencyRejectTime || 5) * 60 * 1000);
      if (expiredAt < common.systemTimestamp) {
        timer = { isExpired: { value: true } };
      } else {
        timer = useTimer(expiredAt);
      }
    }

    onMounted(() => {
      watchEffect(async () => {
        if (timer?.isExpired?.value) {
          emit('acceptable-time-expired');
        }
      });
    });

    return {
      isAcceptableOrder,
      isExpired: timer?.isExpired.value,
      remainingTime: computed(() => `${formatBy2DigitNumber(timer.hours.value * 60 + timer.minutes.value)}:${
        formatBy2DigitNumber(timer.seconds.value)}`),
      orderProceedAtLabel: computed(() =>
        `${timestampToDateTime(getOrderProceedAt(props.order, props.orderAgency))} ${
          props.order.isReservation
            ? t('views.orderDetail.orderCard.label.deliveryReceived')
            : t('views.orderDetail.orderCard.label.orderReceived')
        }`),
    };
  },
});
</script>

<style lang="scss" scoped>
.horizontal {
  max-width: 54rem;
  height: 4px;
  background: $color-gray-f5;
}
</style>
