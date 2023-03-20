<template>
  <VMain>
    <div
      class="content flex-column"
      :class="[!mdAndUp && 'mx-2']"
    >
    <div class="d-inline d-flex justify-space-between">
      <span class="mt-6 font-weight-bold font-size-18">총 수익: {{ totalRevenue }} 원</span>
      <span class="mt-6 text-secondary font-size-12">{{ orderStatusCountText }}</span>
    </div>
      <VBtn
        block
        variant="outlined"
        height="4rem"
        class="outlined bg-white pa-2 my-4"
        @click="isFilterBottomSheet = true"
      >
        <span class="s-color-primary">
          <VIcon>mdi-filter-variant</VIcon> {{filtersName}}
        </span>
      </VBtn>
      <VRow dense class="mb-1" v-if="!isLoading && completedOrders.length > 0">
        <VCol>
          <StoreButton
            block
            class="outlined bg-white"
            variant="outlined"
            height="4rem"
            @click.stop="isShowOrdersDownloadBottomSheet = true"
          >
            <span class="text-secondary">
              엑셀 다운로드
            </span>
          </StoreButton>
        </VCol>
        <VCol>
          <StoreButton
            block
            class="outlined bg-white"
            variant="outlined"
            height="4rem"
            @click.stop="openDetailSales"
          >
            <span class="text-secondary">상세매출</span>
          </StoreButton>
        </VCol>
      </VRow>
    </div>

    <div
      v-for="(item, index) in completedOrders"
      :key="index"
      class="content"
      @click="gotoCompletedOrderDatail(item.orderId)"
    >
      <StoreCompletedOrderCard
        :class="['mt-2', !mdAndUp && 'mx-2']"
        :order="item"
      />
    </div>

    <!--무한 스크롤링-->
    <VueEternalLoading :load="loadMore" v-model:is-initial="isInitial">
      <template #loading>
        <div class="my-loading text-center">
          <VProgressCircular
            indeterminate
            color="primary"
          />
        </div>
      </template>
      <template #no-more>
        <div class="my-no-more"></div>
      </template>
      <template #no-results>
        <div class="my-no-results"></div>
      </template>
      <template #error>
        <div class="my-error"></div>
      </template>
    </VueEternalLoading>

    <!-- 조회결과가 없을 경우 -->
    <div
      v-if="!isLoading && completedOrders.length === 0"
      class="empty"
    >
      <VRow
        no-gutters=""
        class="flex-column text-center"
      >
        <VCol>
          <img :src="emptyCompletedOrders" alt="완료된 주문 빈 이미지">
        </VCol>
        <VCol>
          <span class="font-weight-bold font-size-18 text-secondary"> 완료된 주문이 없습니다.</span>
        </VCol>
      </VRow>
    </div>
    <CompletedFilterBottomSheet
      v-model:visible="isFilterBottomSheet"
      @filter-query="handleFilteringOrders"
    />

    <OrdersDownloadBottomSheet
      ref="refOrdersDownloadBottomSheet"
      :selectedFilterInfo="selectedFilterInfo"
      v-model:visible="isShowOrdersDownloadBottomSheet"
      @close="isShowOrdersDownloadBottomSheet = false"
    />

    <OrdersDownloadCancelModal
      v-if="isShowOrdersDownloadCancelModal"
      @close="handleCloseOrdersDownloadCancelModal"
    />
  </VMain>
  <DetailSalesLayer
    :dialog="detailSalesDialog"
    @close-layer="closeDetailSales"
  />
</template>

<script setup name="CompleteOrderView">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { VueEternalLoading } from '@ts-pro/vue-eternal-loading';

import { INIT_PAGINATION, ORDER_STATUS } from '@/constants';
import { makeFilterQuery, getSelectedFiltersName } from '@/utils/orderUtils';
import { useAuthStore, useOrderStore } from '@/stores';
import { numberWithCommas } from '@/utils/stringUtils';
import useOrderAsync from '@/composables/useOrderAsync';

import StoreCompletedOrderCard from '@/components/order/complete/StoreCompletedOrderCard.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import OrdersDownloadBottomSheet from '@/components/order/complete/OrdersDownloadBottomSheet.vue';
import OrdersDownloadCancelModal from '@/components/order/complete/OrdersDownloadCancelModal.vue';
import CompletedFilterBottomSheet from '@/components/order/complete/CompletedFilterBottomSheet.vue';
import DetailSalesLayer from '@/components/order/detail/DetailSalesLayer.vue';
import emptyCompletedOrders from '@/assets/images/main/empty_completed_orders.png';

const { mdAndUp } = useDisplay();
const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const { doGetOrdersPagination, isLoading } = useOrderAsync();

const isFilterBottomSheet = ref(false);
const totalRevenue = computed(() => {
  if (orderStore.totalPaymentInfo?.totalRevenue) {
    return numberWithCommas(orderStore.totalPaymentInfo.totalRevenue);
  }
  return 0;
});
const completedOrders = computed(() => orderStore.completed);
const completedTotalCount = computed(() => orderStore.completedTotalCount);
const pagenation = ref({ ...INIT_PAGINATION });
const filtersName = computed(() => getSelectedFiltersName(orderStore.selectedFiltering));

// 주문 카운트
const _orderStatusCount = computed(() => ({
  FINISHED: orderStore.orderStatusCount?.find((item) =>
    item.status === ORDER_STATUS.FINISHED)?.count || 0,
  CANCELED: orderStore.orderStatusCount?.find((item) =>
    item.status === ORDER_STATUS.CANCELED)?.count || 0,
}));

// 주문상태 필터 카운트 표시
const orderStatusCountText = computed(() => {
  const countText = [];
  const total = `전체 ${numberWithCommas(_orderStatusCount.value.FINISHED + _orderStatusCount.value.CANCELED)}`;
  const finished = `완료 ${numberWithCommas(_orderStatusCount.value.FINISHED)}`;
  const canceled = `취소 ${numberWithCommas(_orderStatusCount.value.CANCELED)}`;

  if (orderStore.filterConditions?.orderStatus.length > 1) {
    countText.push(total, finished, canceled);
  } else if (orderStore.filterConditions?.orderStatus[0] === 'CANCELED') {
    countText.push(canceled);
  } else if (orderStore.filterConditions?.orderStatus[0] === 'FINISHED') {
    countText.push(finished);
  }

  return countText.join(' ・ ');
});

const gotoCompletedOrderDatail = (orderId) => {
  /**
   * 상세화면 이동 후 뒤로가기 했을 경우
   * 이전 스크롤 포지션이 리셋되는 현상으로 일단 주석처리
   * */
  // commonStore.setIsOverlayLoading(true);
  router.push(`order/${orderId}`);
};

// 스크롤 페이지네이션 offset 처리
const moreScrollPage = (page) => {
  pagenation.value.offset = (page - 1) * pagenation.value.limit;
};

// 매출액(수익금) 조회 및 상태별 count
const fetchFinishedOrderStatAndCount = () => {
  const { createdAt } = orderStore.filterConditions;
  orderStore.finishedOrderStat({ storeId: authStore.currentStore.storeId, ...createdAt });
  orderStore.orderStatusesCount({
    storeId: authStore.currentStore.storeId,
    createdAt: orderStore.filterConditions.createdAt,
    deliveryType: orderStore.filterConditions.deliveryType,
    paymentMethod: orderStore.filterConditions.paymentMethod,
  });
};

onMounted(() => {
  let _queryPayload = null;

  // 필터 초기값 설정
  if (orderStore.selectedFiltering.datePeriod === 'SELF') {
    const { startAt, endAt } = orderStore.selectedFiltering.createdAt;
    const date = [new Date(startAt), new Date(endAt)];
    _queryPayload = makeFilterQuery(orderStore.selectedFiltering, date);
  } else {
    _queryPayload = makeFilterQuery(orderStore.selectedFiltering);
  }

  orderStore.setFilterConditions(_queryPayload);
  fetchFinishedOrderStatAndCount();
});

// 페이지네이션 스크롤링 fetch 기능
const loadMore = async ({ loaded, noMore }) => {
  // completed 스토어 갯수와 total 카운트가 같으면 더이상 호출하지 않음
  if (completedTotalCount.value > 0 && completedTotalCount.value === orderStore.completed.length) {
    noMore();
    return;
  }

  /**
   * 페이징 처리 (페이지당 limit 10개씩)
   * (완료갯수 / 10) 올림해서 현재 페이지번호를 구한 뒤 다음 페이지 호출을 위해 1을 더함
   * */
  const _pageNumber = Math.ceil(orderStore.completed.length / pagenation.value.limit) + 1;
  moreScrollPage(_pageNumber);

  const { limit, offset } = pagenation.value;

  const payload = {
    ...orderStore.filterConditions,
    limit,
    offset,
  };

  await doGetOrdersPagination(payload);
  loaded(completedTotalCount.value - orderStore.completed.length);
};

// 필터 설정 후 조회 버튼 클릭시
const isInitial = ref(true);
const handleFilteringOrders = async () => {
  isFilterBottomSheet.value = false;
  orderStore.resetCompletedList();

  fetchFinishedOrderStatAndCount();
  isInitial.value = true;
};

// -- 엑셀 다운로드 관련 로직 --
const _getFilterOrderCount = () => {
  let count = `${_orderStatusCount.value[orderStore.filterConditions?.orderStatus[0]] || 0}`;

  if (orderStore.filterConditions?.orderStatus.length > 1) {
    count = _orderStatusCount.value.FINISHED + _orderStatusCount.value.CANCELED;
  }

  return numberWithCommas(count);
};

const selectedFilterInfo = computed(() => ({
  ...orderStore.filterConditions,
  orderCount: _getFilterOrderCount(),
}));

const refOrdersDownloadBottomSheet = ref();
const isShowOrdersDownloadBottomSheet = ref(false);
const isShowOrdersDownloadCancelModal = ref(false);

const handleCloseOrdersDownloadCancelModal = (isCancel) => {
  isShowOrdersDownloadCancelModal.value = false;
  if (isCancel) {
    refOrdersDownloadBottomSheet.value?.cancelDownload();
  } else {
    isShowOrdersDownloadBottomSheet.value = true;
  }
};

watch(isShowOrdersDownloadBottomSheet, () => {
  if (isShowOrdersDownloadBottomSheet.value === false
    && (refOrdersDownloadBottomSheet.value?.isDownloadPreparing
        || refOrdersDownloadBottomSheet.value?.isDownloadPrepareSuccess)) {
    isShowOrdersDownloadCancelModal.value = true;
  }
});
// -- 엑셀 다운로드 관련 로직 --

// 상세매출 레이어 관련 로직
const detailSalesDialog = ref(false);
const openDetailSales = () => {
  detailSalesDialog.value = true;
};
const closeDetailSales = () => {
  detailSalesDialog.value = false;
};

const isGoBack = computed(() =>
  String(router.options.history.state.forward).localeCompare(route.path) === 0);

const isShowOverlayView = computed(() =>
  isFilterBottomSheet.value
  || isShowOrdersDownloadBottomSheet.value
  || detailSalesDialog.value);

const closeOverlayView = () => {
  isFilterBottomSheet.value = false;
  isShowOrdersDownloadBottomSheet.value = false;
  detailSalesDialog.value = false;
};

onBeforeRouteLeave((to, from, next) => {
  // device back 버튼 클릭 시, 오버레이 화면이 있다면 닫도록 함
  if (isGoBack.value && isShowOverlayView.value) {
    closeOverlayView();
    next(false);
    return;
  }

  next();
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';

.outlined {
    border: 1px solid $color-gray-bd;
  }
.content {
  background: #f5f5f5;
}
.empty {
margin-top: 5.6rem;
line-height: 24px;
}

img {
width: 17.2rem
}
</style>
