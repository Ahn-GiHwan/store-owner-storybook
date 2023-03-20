<template>
  <VContainer>
    <StoreBottomSheet
      v-model:visible="bindVisible"
    >
      <template #title>
        <span class="text-left font-size-16 font-weight-bold">
          보기 옵션
        </span>
      </template>
      <template #content>
        <VRow
          class="flex-column"
          no-gutters
        >
          <VCol class="mt-2">
            <CompletedCommonButton
              v-model:selectedIndex="selectedDatePeriod"
              :title="periodTitle"
              :data="DATE_PERIOD_DATA"
              @button-clicked="handleDatePeriod"
            />
          </VCol>
          <VCol class="mt-6">
            <CompletedCommonButton
              v-model:selectedIndex="selectedOrderStatus"
              title="주문 상태"
              :data="ORDER_STATUS_DATA"
            />
          </VCol>
          <VCol class="mt-6">
            <CompletedCommonButton
              v-model:selectedIndex="selectedSorting"
              title="정렬 기준"
              :data="DATE_SORTING_DATA"
            />
          </VCol>
          <!-- 결제 수단 관련 - 추후에 적용 -->
          <!-- <VCol class="mt-6 two-line">
            <CompletedCommonButton
              v-model:selectedIndex="selectedPaymentMethodType"
              title="결제 수단"
              :data="PAYMENT_METHOD_DATA"
            />
          </VCol> -->
          <VCol class="mt-6">
            <CompletedCommonButton
              v-model:selectedIndex="selectedDeliveryType"
              title="배달 유형"
              :data="DELIVERY_TYPE_DATA"
            />
          </VCol>
          <VCol class="mt-6">
            <StoreButton block @click.stop="submitFilter">
              조회
            </StoreButton>
          </VCol>
        </VRow>
      </template>
    </StoreBottomSheet>
    <StoreDatePicker
      id="date-picker"
      ref="refTempDatePicker"
      v-model:date="date"
      teleport-id="date-picker"
      :minDateNumber="180"
    />
  </VContainer>
</template>

<script setup name="CompletedFilterBottomSheet">
import { computed, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';

import { DELIVERY_TYPE_DATA, DATE_SORTING_DATA, ORDER_STATUS_DATA, DATE_PERIOD_DATA, PAYMENT_METHOD_DATA } from '@/constants';
import { useOrderStore } from '@/stores';
import { makeFilterQuery } from '@/utils/orderUtils';
import { timestampToDateTime, getDatePeriod } from '@/utils/dateUtils';

import StoreDatePicker from '@/components/common/StoreDatePicker.vue';
import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import CompletedCommonButton from '@/components/order/complete/CompletedCommonButton.vue';

const emits = defineEmits(['filter-query', 'update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const bindVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emits('update:visible', value);
  },
});

const orderStore = useOrderStore();

const orderFilter = computed(() => orderStore.selectedFiltering);
const selectedFilter = ref({
  ...orderFilter,
});
const _beforeChangedSelectedFilter = {
  ...orderStore.selectedFiltering,
};
const refTempDatePicker = ref('');
const date = ref(
  [new Date(orderFilter.value.createdAt.startAt), new Date(orderFilter.value.createdAt.endAt)],
);

const changedDatePeriod = ref({
  startAt: `${timestampToDateTime(orderStore.selectedFiltering.createdAt.startAt, 'YYYY-MM-DD')}`,
  endAt: `${timestampToDateTime(orderStore.selectedFiltering.createdAt.endAt, 'YYYY-MM-DD')}`,
});

const periodTitle = computed(() => `조회 기간 (${changedDatePeriod.value.startAt} ~ ${changedDatePeriod.value.endAt})`);
// 기간조회
const selectedDatePeriod = ref(
  DATE_PERIOD_DATA.findIndex((item) => item.value === orderFilter.value.datePeriod),
);

// 기간조회 - 직접설정
const handleDatePeriod = (data) => {
  changedDatePeriod.value.startAt = timestampToDateTime(getDatePeriod(data.value).startAt, 'YYYY-MM-DD');
  changedDatePeriod.value.endAt = timestampToDateTime(getDatePeriod(data.value).endAt, 'YYYY-MM-DD');

  if (data.id === 4) {
    refTempDatePicker.value.openCalendar();
  }
  watch(date, (newPeriodDate, oldPeriodDate) => {
    const { startAt, endAt } = getDatePeriod(data.value, newPeriodDate);
    const date1 = dayjs(endAt, 'YYYY-MM-DD HH:mm:ss.SSS');
    const date2 = dayjs(startAt, 'YYYY-MM-DD HH:mm:ss.SSS');

    // 31일 이내 범위체크
    if (date1.diff(date2, 'day') > 30) {
      // bottomSheet에 가려져서 우선 alert으로 대체
      alert('31일 범위로 선택해 주세요.');
      date.value = [oldPeriodDate[0], oldPeriodDate[1]];
      return;
    }

    changedDatePeriod.value.startAt = timestampToDateTime(startAt, 'YYYY-MM-DD');
    changedDatePeriod.value.endAt = timestampToDateTime(endAt, 'YYYY-MM-DD');
  });
};

// 주문상태
const selectedOrderStatus = ref(
  ORDER_STATUS_DATA.findIndex((item) => item.value === orderFilter.value.orderStatus),
);

// 정렬
const selectedSorting = ref(
  DATE_SORTING_DATA.findIndex((item) => item.value === orderFilter.value.orderSorting),
);

// 결제수단
const selectedPaymentMethodType = ref(
  PAYMENT_METHOD_DATA.findIndex((item) => item.value === orderFilter.value.paymentMethod),
);

// 배달유형
const selectedDeliveryType = ref(
  DELIVERY_TYPE_DATA.findIndex((item) => item.value === orderFilter.value.deliveryType),
);

const isChanged = ref(false);
const submitFilter = () => {
  isChanged.value = true;

  // 선택된 필터 버튼
  selectedFilter.value = {
    datePeriod: DATE_PERIOD_DATA[selectedDatePeriod.value].value,
    orderStatus: ORDER_STATUS_DATA[selectedOrderStatus.value].value,
    orderSorting: DATE_SORTING_DATA[selectedSorting.value].value,
    deliveryType: DELIVERY_TYPE_DATA[selectedDeliveryType.value].value,
    paymentMethod: PAYMENT_METHOD_DATA[selectedPaymentMethodType.value].value,
  };

  // 쿼리 조건 설정
  const queryPayload = makeFilterQuery(selectedFilter.value, date.value);
  orderStore.setFilterConditions(queryPayload);

  selectedFilter.value.createdAt = queryPayload.createdAt;
  orderStore.setSelectedFiltering(selectedFilter.value);
  emits('filter-query');
};

onUnmounted(() => {
  // 필터값 변경 후 바텀시트를 그냥 닫을 경우 원래 값으로 원복
  if (!isChanged.value) {
    orderStore.setSelectedFiltering(_beforeChangedSelectedFilter);
  }
});

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
.v-snackbar:not(.v-snackbar--absolute) {
  height: 100%;
  position: fixed;
  z-index: 9999;
}

.two-line {
  :deep(.v-row) {
    row-gap: 8px;
  }
}
  </style>
