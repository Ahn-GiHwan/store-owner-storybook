<template>
  <template v-if="isAcceptableOrder">
    <template v-if="!timer?.isExpired.value">
      <span class="text-error font-size-12">{{ remainingTime }}</span>
    </template>
  </template>
</template>

<script setup name="StoreOrderTimer">
import { computed, watchEffect, onMounted } from 'vue';
import { useTimer } from 'vue-timer-hook';

import { useCommonStore } from '@/stores';
import { formatBy2DigitNumber, oneMinute } from '@/utils/dateUtils';
import { isNeedAccept } from '@/utils/orderUtils';

const props = defineProps({
  order: {
    type: Object,
  },
  orderAgencyRejectTime: {
    type: Number,
  },
});

const emits = defineEmits(['acceptable-time-expired']);

const commonStore = useCommonStore();

const isAcceptableOrder = computed(() => isNeedAccept(props.order));
const timer = computed(() => {
  if (isAcceptableOrder.value) {
    const expiredAt = props.order.createdAt
          + ((props.orderAgencyRejectTime || 5) * oneMinute);
    if (expiredAt > commonStore.systemTimestamp) {
      return useTimer(expiredAt);
    }
  }
  return { isExpired: { value: true } };
});

const remainingTime = computed(() => `취소까지 ${formatBy2DigitNumber(timer.value.hours.value * 60 + timer.value.minutes.value)}분 ${
  formatBy2DigitNumber(timer.value.seconds.value)}초`);

onMounted(() => {
  watchEffect(async () => {
    if (timer.value.isExpired.value) {
      // 이벤트가 발생하면 주문 목록을 다시 조회하는데 이 주문이 다시 조회되지 않도록 딜레이를 줌
      setTimeout(() => emits('acceptable-time-expired'), 1000);
    }
  });
});
</script>

<style lang="scss" scoped>
.horizontal {
  max-width: 54rem;
  height: 4px;
  background: $color-gray-f5;
}
</style>
