<template>
  <VCard
    flat
    class="status-card"
    :class="{ canceled: isOrderCanceled }"
  >
    <VRow
      no-gutters
      class="pa-4"
    >
      <VCol>
        <!-- 주문상태 뱃지  -->
        <StoreOrderServeTypeBadge
          v-for="(item, index) in badgeList" :key="index"
          :isViewLabel="item.isViewLabel"
          :labelName="item.labelName"
          :color="item.color"
        />

        <!-- 접수시간  -->
        <span class="font-size-12 s-color-gray-66">
          {{ orderDateTime }}
        </span>

        <!-- 주문자 정보(주소, 결제금액, 결제수단)  -->
        <StoreCompletedOrdererInfo
          :order="order"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup name="StoreCompletedOrderCard">
import { computed, onMounted, reactive } from 'vue';

import { ORDER_SERVE_TYPE, ORDER_STATUS } from '@/constants';

import { getOrderDateTime } from '@/utils/dateUtils';
import { getAdditionalDeliveries } from '@/utils/orderUtils';

import StoreOrderServeTypeBadge from '@/components/order/complete/StoreOrderServeTypeBadge.vue';
import StoreCompletedOrdererInfo from '@/components/order/complete/StoreCompletedOrdererInfo.vue';

const props = defineProps({
  order: {
    type: Object,
    require: true,
  },
});

// 취소된 주문
const isOrderCanceled = computed(() => props.order?.status === ORDER_STATUS.CANCELED);

// 접수 시간
const orderDateTime = computed(() => `${getOrderDateTime(props.order.createdAt, 'MM-DD HH:mm')}`);

const orderServeTypeBadge = reactive({
  isViewLabel: false,
  labelName: '',
  color: '',
});

const badgeList = reactive([]);

// 주문별 상태 라벨 설정
const _setOrderServeTypeBadge = () => {
  if (isOrderCanceled.value) {
    orderServeTypeBadge.isViewLabel = false;
    orderServeTypeBadge.labelName = '주문취소';
    orderServeTypeBadge.color = 'error';
    badgeList.push({ ...orderServeTypeBadge });
  } else if (props.order.serveType === ORDER_SERVE_TYPE.PACKING) {
    orderServeTypeBadge.isViewLabel = true;
    orderServeTypeBadge.labelName = '포장';
    orderServeTypeBadge.color = 'purple';
    badgeList.push({ ...orderServeTypeBadge });
  } else if (props.order.serveType === ORDER_SERVE_TYPE.HALL) {
    orderServeTypeBadge.isViewLabel = true;
    orderServeTypeBadge.labelName = '홀';
    orderServeTypeBadge.color = 'orange';
    badgeList.push({ ...orderServeTypeBadge });
  }

  if (props.order.reorderRelation) {
    orderServeTypeBadge.isViewLabel = true;
    orderServeTypeBadge.labelName = '다시주문';
    orderServeTypeBadge.color = 'orange';
    badgeList.push({ ...orderServeTypeBadge });
  }

  if (getAdditionalDeliveries(props.order).length > 0) {
    orderServeTypeBadge.isViewLabel = true;
    orderServeTypeBadge.labelName = '추가배달';
    orderServeTypeBadge.color = 'orange';
    badgeList.push({ ...orderServeTypeBadge });
  }

  if (props.order.isReservation) {
    orderServeTypeBadge.isViewLabel = true;
    orderServeTypeBadge.labelName = '예약';
    orderServeTypeBadge.color = 'primary';
    badgeList.push({ ...orderServeTypeBadge });
  }
};

onMounted(() => {
  _setOrderServeTypeBadge();
});

</script>

<style lang="scss" scoped>
.status-card {
  width: 100vw;
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.canceled {
  background: #ffebeb;
}

</style>
