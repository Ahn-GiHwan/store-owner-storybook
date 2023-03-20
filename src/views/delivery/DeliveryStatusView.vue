<template>
  <VMain :class="isLoading && 'd-flex justify-center align-center'">
    <VProgressCircular
      v-if="isLoading"
      indeterminate
      color="primary"
    />
    <template v-if="!error && !isLoading">
      <template v-if="orders.length > 0">
        <div
          v-for="(item, index) in orders"
          :key="index"
          class="content"
          @click="gotoOrderDatail(item.orderId)"
        >
          <StoreDeliveryStatusCard
            :class="[!mdAndUp && 'mx-2', 'mb-2', index === 0 && 'mt-2']"
            :order="item"
            @request-delivery="handleRequestDelivery(item)"
            @resolve-delivery="handleResolveDelivery(item)"
            @depart-delivery="handleDepartDelivery(item)"
            @arrive-delivery="handleArriveDelivery(item)"
            @acceptable-time-expired="handleAcceptTimeExpired"
          />
        </div>
      </template>
      <div v-else-if="orders.length === 0" class="empty">
        <VRow
          no-gutters=""
          class="flex-column text-center"
        >
          <VCol>
            <img :src="emptyImage">
          </VCol>
          <VCol><span class="font-weight-bold font-size-18"> 주문을 기다리고 있어요 </span></VCol>
          <VCol class="mt-3">
            <span class="text-primary">오늘의 매출이 궁금하세요? </span>
          </VCol>
          <VCol class="mt-3">
            <span class="text-primary">예치금은 충분한가요?</span>
          </VCol>
        </VRow>
      </div>
    </template>

    <!-- API 에러가 발생했을 때-->
    <ServerErrorView v-if="error"/>
  </VMain>

  <!-- 배달요청/수락 -->
  <StoreRequestDeliveryLayer
    v-if="selectedOrder"
    :dialog="isShowRequestDeliveryLayer"
    :order="selectedOrder"
    @close-layer="handleCloseLayer"
  />

  <!-- 해결하기 -->
  <StoreResolveDeliveryLayer
    v-if="selectedOrder"
    :dialog="isShowResolveDeliveryLayer"
    :order="selectedOrder"
    :callCenterHubPhone="callCenterHubPhone"
    @close-layer="handleCloseResolveDeliveryLayer"
  />
</template>

<script setup name="DeliveryStatusView">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';

import { useOrderStore, useCommonStore, useAuthStore } from '@/stores';
import useOrderAsync from '@/composables/useOrderAsync';

import StoreRequestDeliveryLayer from '@/components/order/common/StoreRequestDeliveryLayer.vue';
import StoreResolveDeliveryLayer from '@/components/order/common/StoreResolveDeliveryLayer.vue';
import StoreDeliveryStatusCard from '@/components/delivery/StoreDeliveryStatusCard.vue';
import ServerErrorView from '@/views/error/ServerErrorView.vue';
import emptyOrders from '@/assets/images/main/empty_orders.png';

import { getMainDelivery } from '@/utils/orderUtils';

const { mdAndUp } = useDisplay();
const router = useRouter();
const route = useRoute();

const orderStore = useOrderStore();
const commonStore = useCommonStore();
const authStore = useAuthStore();
const { doGetOrders, isLoading, error } = useOrderAsync();
const logger = useLogger();

const emptyImage = emptyOrders;

const gotoOrderDatail = (orderId) => {
  commonStore.setIsOverlayLoading(true);
  router.push(`order/${orderId}`);
};

// 현재 선택된 탭의 주문정보
const orders = computed(() => orderStore.selectedTabOrders);

onMounted(async () => {
  // 진행중인 모든 주문 정보 조회
  await doGetOrders();
});

const selectedOrder = ref(null);
const isShowRequestDeliveryLayer = ref(false);
const callCenterHubPhone = ref();

const handleCloseLayer = async (reload) => {
  isShowRequestDeliveryLayer.value = false;
  selectedOrder.value = null;
  if (reload) {
    await doGetOrders();
  }
};
const handleRequestDelivery = (clickedOrder) => {
  selectedOrder.value = clickedOrder;
  isShowRequestDeliveryLayer.value = true;
};

const isShowResolveDeliveryLayer = ref(false);
const handleResolveDelivery = async (clickedOrder) => {
  selectedOrder.value = clickedOrder;
  commonStore.setIsOverlayLoading(true);

  callCenterHubPhone.value = null;
  const isRoadShop = authStore.currentStore.manageOrderAgencyId === 'self';
  const mainDelivery = getMainDelivery(clickedOrder);
  if (isRoadShop && mainDelivery?.deliveryAgencyId) {
    try {
      const { deliveryAgencyCallCenterHubPhone } =
        await commonStore.deliveryAgencyCallCenterHubPhone({
          storeId: clickedOrder.storeId,
          deliveryAgencyId: mainDelivery.deliveryAgencyId,
        });
      callCenterHubPhone.value = deliveryAgencyCallCenterHubPhone.callCenterHubPhone;
    } catch (err) {
      logger.error(err);
    }
  }
  commonStore.setIsOverlayLoading(false);

  // NOTE: selectedOrder와 isShowResolveDeliveryLayer는 동시에 바꾸면, 타이밍상 ResolveDeliveryLayer watch 로직 안탐
  // 이를 회피하기 위해 setTimeout 적용
  setTimeout(() => {
    isShowResolveDeliveryLayer.value = true;
  });
};
const handleCloseResolveDeliveryLayer = async (action) => {
  isShowResolveDeliveryLayer.value = false;
  if (action) {
    await doGetOrders();
  }
};

const handleAcceptTimeExpired = async () => {
  isShowRequestDeliveryLayer.value = false;
  await doGetOrders();
};

const isGoBack = computed(() =>
  String(router.options.history.state.forward).localeCompare(route.path) === 0);

const isShowOverlayView = computed(() =>
  isShowRequestDeliveryLayer.value
  || isShowResolveDeliveryLayer.value);

const closeOverlayView = () => {
  isShowRequestDeliveryLayer.value = false;
  isShowResolveDeliveryLayer.value = false;
};

onBeforeRouteLeave((to, from, next) => {
  // NOTE: 첫 진입 페이지가 메인페이지라면, 여기 로직이 들어오지 않고 바로고사장님 사이트를 벗어남
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
