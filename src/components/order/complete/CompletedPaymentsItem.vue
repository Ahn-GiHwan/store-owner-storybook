<template>
  <VSheet :color="gray2Color">
    <VRow no-gutters class="px-4 pb-3">
      <VCol class="d-flex justify-space-between pt-4 pb-2">
        <div>
          <span class="font-size-12 font-weight-bold mr-2">
            {{ numberWithCommas(payment.charge) }}
          </span>
          <span class="font-size-10">
            {{paymentStatusName}}
          </span>
          <VIcon
            :icon="payment.isCanceled ? 'mdi-close-circle' : 'mdi-check-circle'"
            :color="payment.isCanceled ? 'red' : 'green' "
            size="x-small"
          />
        </div>
        <span>{{ processingTimeAt }}</span>
      </VCol>
      <VDivider />
      <VRow no-gutters="" class="flex-column mt-2">
        <VCol v-if="payment.approvalNumber" class="d-flex justify-space-between">
          <span>승인 번호</span>
          <span>{{ payment.approvalNumber}}</span>
        </VCol>
        <VCol v-if="payment.approvalNumber" class="d-flex justify-space-between mt-1">
          <span>카드 정보</span>
          <span>{{ payment.cardCompany}} {{ payment.cardNumber}}</span>
        </VCol>
        <VCol v-if="riderInfo?.driverPhone" class="d-flex justify-space-between mt-1">
          <span>라이더 정보</span>
          <span>{{ addHyphenPhoneNumber(riderInfo?.driverPhone)}}</span>
        </VCol>
      </VRow>
    </VRow>
  </VSheet>
</template>

<script setup name="CompletedPaymentsItem">
import { computed } from 'vue';
import { getOrderDateTime } from '@/utils/dateUtils';
import { addHyphenPhoneNumber, numberWithCommas } from '@/utils/stringUtils';

import { gray2Color } from '@/styles/_export.module.scss';

const props = defineProps({
  payment: {
    type: Object,
    require: true,
  },
  riderInfo: {
    type: Object,
    require: true,
  },
});

// 결제 상태 이름
const paymentStatusName = computed(() => {
  let statusName = '';

  if (props.payment.paymentMethod === 'BARO_MONEY') {
    statusName = '바로머니 입금';

    if (props.payment.isCanceled) {
      statusName = '바로머니 환불';
    }
  } else {
    statusName = '카드 승인 ';

    if (props.payment.isCanceled) {
      statusName += '취소';
    }
  }

  return statusName;
});

// 결제상태 datetime 표시
const processingTimeAt = computed(() => getOrderDateTime(props.payment.displayAt, 'YYYY-MM-DD HH:mm:ss'));
</script>
