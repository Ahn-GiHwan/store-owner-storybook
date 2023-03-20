<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">
        결제 정보
      </span>
    </template>
    <template #content>
      <div class="my-4 d-flex">
        <span class="font-size-16 font-weight-bold"
        :class="isSamePaymentAmount ? 's-color-primary' : 's-color-red-e5'"
        >
          결제 금액 합계 {{ orderTotalPaymentAmount }}
      </span>
      </div>
      <CompletedPaymentsItem
        class="mt-2"
        v-for="(item, index) in payments"
        :key="index"
        :payment="item"
        :riderInfo="orderDetailStore.deliveryRiderInfo(item.deliveryId)"
      />
    </template>
  </StoreBottomSheet>
</template>

<script setup name="CompletedPaymentsBottomSheet">
import { computed } from 'vue';
import { useOrderDetailStore } from '@/stores';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import CompletedPaymentsItem from '@/components/order/complete/CompletedPaymentsItem.vue';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  orderTotalPaymentAmount: {
    type: String,
    required: true,
  },
  isSamePaymentAmount: {
    type: Boolean,
    required: true,
  },
});

const orderDetailStore = useOrderDetailStore();

// 주문 결제정보 리스트
const payments = computed(() => {
  if (props.order.payments?.length > 0) {
    const _payments = props.order.payments.map((item) => {
      let displayAt = item.canceledAt;

      // 카드 정상 승인이면
      if (!item.isCanceled) {
        displayAt = item.approvalAt;

        // 바로머니 approvalAt 정보가 없기 때문에 생성일자 값으로
        if (item.paymentMethod === 'BARO_MONEY') {
          displayAt = item.createdAt;
        }
      }
      return {
        ...item,
        displayAt,
      };
    });
    // displayAt(승인이나 취소) 정렬 최신순
    return _payments.sort((a, b) => b.displayAt - a.displayAt);
  }
  return [];
});

</script>

  <style lang="scss" scoped>
  @import '@/styles/common/form.scss';
  @import '@/styles/common/button.scss';
  </style>
