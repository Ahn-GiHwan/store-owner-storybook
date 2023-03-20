<template>
  <VMain :class="isLoading && 'd-flex justify-center align-center'">
    <VProgressCircular
      v-if="isLoading"
      indeterminate
      color="primary"
    />
    <template v-if="order">
      <DeliveryInfo
        v-if="order.deliveries.length > 0"
        @show-untact-image="handleShowUntactImage"
        @depart-delivery="handleDepartDelivery"
        @arrive-delivery="handleArriveDelivery"
        @cancel-delivery="handleCancelDelivery"
        @change-to-agency-delivery="handleChangeToAgencyDelivery"
        @resolve-delivery="handleResolveDelivery"
      />
      <OrderInfo @acceptable-time-expired="handleAcceptableTimeExpired"/>
      <OrderDetailBottomAction
        @reject-order="isShowRejectOrderModal = true"
        @show-order-change-histories="isShowOrderChangeHistoryBottomSheet = true"
        @change-to-agency-delivery="handleChangeToAgencyDelivery"
        @delivery-addition="handleShowDeliveryAdditionModal"
        @cancel-order="isShowCancelOrderModal = true"
        @show-untact-image="handleShowUntactImage"
        @reorder="handleReorder"
      />
    </template>
  </VMain>
  <StoreContentBottom>
    <!-- 완료 주문에서 후불 결제가 포함된 경우에만 노출-->
    <VBtn
      v-if="isFinishedOrder"
      height="60"
      @click="isPaymentsBottomSheet = true"
      block
      >
      <div class="font-size-14 font-weight-bold">
        결제 금액 합계<br />
        <span
          :class="isSamePaymentAmount ? 's-color-primary' : 's-color-red-e5'"
        >{{ orderTotalPaymentAmount }}</span>
      </div>
    </VBtn>

    <OrderDetailFooterAction
      v-if="order"
      @modify-order="handleModifyOrder"
      @request-delivery="isShowRequestDeliveryLayer = true"
      @cancel-delivery="handleCancelDelivery"
      @resolve-delivery="handleResolveDelivery"
      @depart-delivery="handleDepartDelivery"
      @arrive-delivery="handleArriveDelivery"
    />
  </StoreContentBottom>

  <!-- 주문 취소 -->
  <CancelOrderModal
    v-if="order && isShowCancelOrderModal"
    :order="order"
    @close-modal="handleCloseLayerAndGoToMain"
  />

  <!-- 추가 배달 / 다시 주문 -->
  <DeliveryAdditionModal
    v-if="isShowDeliveryAdditionModal"
    @close-modal="isShowDeliveryAdditionModal = false"
    @delivery-addition="handleDeliveryAddition"
    @reorder="handleReorder"
  />

  <!-- 추가 배달 -->
  <DeliveryAdditionLayer
    v-if="order && isShowDeliveryAdditionLayer"
    :dialog="isShowDeliveryAdditionLayer"
    :order="order"
    @close-layer="handleCloseLayerAndReload"
  />

  <!-- 다시 주문 -->
  <ReorderLayer
    v-if="order && isShowReorderLayer"
    :dialog="isShowReorderLayer"
    :order="order"
    @close-layer="handleCloseLayerAndReload"
  />

  <!-- 배달요청/수락 -->
  <StoreRequestDeliveryLayer
    v-if="order"
    :dialog="isShowRequestDeliveryLayer"
    :order="order"
    :action="requestDeliveryAction"
    @close-layer="handleCloseLayerAndReload"
  />

  <!-- 거절 -->
  <RejectOrderModal
    v-if="order"
    v-model:visible="isShowRejectOrderModal"
    :order="order"
    @close-modal="handleCloseLayerAndGoToMain"
  />

  <!-- 배달 취소 -->
  <CancelDeliveryModal
    v-if="order && isShowCancelDeliveryModal"
    :order="order"
    :delivery="targetDelivery"
    @close-modal="handleCloseCancelDeliveryLayer"
  />
  <!-- 주문 정보 변경 내역 -->
  <OrderChangeHistoriesBottomSheet
    v-if="isShowOrderChangeHistoryBottomSheet && orderChangeHistories"
    :orderChangeHistories="orderChangeHistories"
    v-model:visible="isShowOrderChangeHistoryBottomSheet"
    @close="isShowOrderChangeHistoryBottomSheet = false"
  />
  <!-- 해결하기 -->
  <StoreResolveDeliveryLayer
    v-if="order"
    :dialog="isShowResolveDeliveryLayer"
    :order="order"
    :callCenterHubPhone="callCenterHubPhone"
    @close-layer="handleCloseResolveDeliveryLayer"
  />

  <!-- 배달 사진 -->
  <UntactImageModal
    v-if="targetDelivery"
    v-model:visible="isShowUntactImageModal"
    :delivery="targetDelivery"
    @close-modal="handleCloseUntactImageModal"
  />
  <CompletedPaymentsBottomSheet
      v-if="order"
      v-model:visible="isPaymentsBottomSheet"
      :order="order"
      :orderTotalPaymentAmount="orderTotalPaymentAmount"
      :isSamePaymentAmount="isSamePaymentAmount"
    />
</template>

<script>
import { defineComponent, onBeforeMount, computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useLocale } from 'vuetify';
import { useLogger } from 'vue-logger-plugin';

import { ORDER_TYPE, DELIVERY_STATUS, ORDER_STATUS } from '@/constants';
import { useAuthStore, useCommonStore, useOrderDetailStore, useErrorsStore } from '@/stores';
import { getMainDelivery } from '@/utils/orderUtils';
import { numberWithCommas } from '@/utils/stringUtils';
import useDeliveryAsync from '@/composables/useDeliveryAsync';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import DeliveryInfo from '@/components/order/detail/DeliveryInfo.vue';
import OrderInfo from '@/components/order/detail/OrderInfo.vue';
import OrderDetailBottomAction from '@/components/order/detail/OrderDetailBottomAction.vue';
import OrderDetailFooterAction from '@/components/order/detail/OrderDetailFooterAction.vue';
import DeliveryAdditionModal from '@/components/order/detail/DeliveryAdditionModal.vue';
import DeliveryAdditionLayer from '@/components/order/detail/DeliveryAdditionLayer.vue';
import ReorderLayer from '@/components/order/detail/ReorderLayer.vue';
import RejectOrderModal from '@/components/order/detail/RejectOrderModal.vue';
import CancelOrderModal from '@/components/order/detail/CancelOrderModal.vue';
import StoreRequestDeliveryLayer from '@/components/order/common/StoreRequestDeliveryLayer.vue';
import CancelDeliveryModal from '@/components/order/detail/CancelDeliveryModal.vue';
import OrderChangeHistoriesBottomSheet from '@/components/order/detail/OrderChangeHistoriesBottomSheet.vue';
import StoreResolveDeliveryLayer from '@/components/order/common/StoreResolveDeliveryLayer.vue';
import UntactImageModal from '@/components/order/detail/UntactImageModal.vue';
import CompletedPaymentsBottomSheet from '@/components/order/complete/CompletedPaymentsBottomSheet.vue';

export default defineComponent({
  name: 'OrderDetailView',
  components: {
    DeliveryInfo,
    OrderInfo,
    StoreContentBottom,
    OrderDetailBottomAction,
    OrderDetailFooterAction,
    DeliveryAdditionModal,
    DeliveryAdditionLayer,
    ReorderLayer,
    RejectOrderModal,
    CancelOrderModal,
    StoreRequestDeliveryLayer,
    CancelDeliveryModal,
    OrderChangeHistoriesBottomSheet,
    StoreResolveDeliveryLayer,
    UntactImageModal,
    CompletedPaymentsBottomSheet,
  },
  setup() {
    const { t } = useLocale();
    const logger = useLogger();

    const auth = useAuthStore();
    const common = useCommonStore();
    const errors = useErrorsStore();
    const route = useRoute();
    const router = useRouter();
    const orderId = computed(() => Number(route.params.orderId));
    const { storeId } = auth.currentStore;
    const orderDetail = useOrderDetailStore();

    const loadOrder = () => orderId.value && orderDetail.order({ storeId, orderId: orderId.value })
      .then(() => orderId.value
        && orderDetail.orderChangeHistories({ storeId, orderId: orderId.value }))
      .catch(() => {
        if (errors.convertedError?.code === 'NOT_FOUND_RESOURCE') {
          router.replace({ name: 'NotFoundPage' });
        }
      });

    onBeforeMount(loadOrder);
    watchEffect(loadOrder);

    const isLoading = computed(() =>
      orderDetail.getIsLoading && orderDetail.getIsLoadingHistories);

    const order = computed(() => orderDetail.getOrder);
    const orderChangeHistories = computed(() => orderDetail.getOrderChangeHistories);

    const orderTotalPaymentAmount = computed(() => {
      let paymentAmountPayMethod = '';
      let methodName = '';

      if (order.value?.payments) {
        const paymentType = new Set();
        // 승인 취소된 결제와 무관하게 2가지 이상은 복합결제로
        const amount = order.value.payments.reduce((acc, cur) => {
          paymentType.add(cur.paymentMethod);

          // 정상 결제(승인)금액만 sum
          if (!cur.isCanceled) {
            return acc + cur.charge;
          }
          return acc;
        }, 0);

        if (paymentType.values().next().value === 'CARD') {
          methodName = `${t('common.paymentMethod.CARD')}`;
        } else {
          methodName = `${t('common.paymentMethod.CASH')}`;
        }

        // 단일 결제
        paymentAmountPayMethod = `${amount ? numberWithCommas(amount) : '-'} ${t('common.currency')} (${methodName})`;

        // 복합결제(CARD && 바로머니)
        if (paymentType.size > 1) {
          paymentAmountPayMethod = `${amount ? numberWithCommas(amount) : '-'} ${t('common.currency')} (${`${t('common.paymentMethod.MIXED_PAYMENT')}`})`;
        }
      }
      return paymentAmountPayMethod;
    });

    const isFinishedOrder = computed(() => {
      if (order.value?.status === ORDER_STATUS.FINISHED && order.value.payments?.length > 0) {
        return order.value.payments.some((item) => item.paymentMethod === 'CARD' || item.paymentMethod === 'BARO_MONEY');
      }
      return false;
    });

    const isSamePaymentAmount = computed(() => {
      if (isFinishedOrder.value) {
        const delivery = getMainDelivery(order.value);
        // 배달 결제요금 (defferedPrice)
        const sumDelivery = delivery.paymentCardPrice + delivery.paymentCashPrice;
        return Number(sumDelivery) === Number(orderTotalPaymentAmount.value.replaceAll(/[^0-9]/g, ''));
      }
      return false;
    });

    const requestDeliveryAction = ref(null);
    const isShowRequestDeliveryLayer = ref(false);
    const isShowRejectOrderModal = ref(false);
    const isShowCancelDeliveryModal = ref(false);
    const isShowOrderChangeHistoryBottomSheet = ref(false);
    const isShowResolveDeliveryLayer = ref(false);
    const isShowDeliveryAdditionLayer = ref(false);
    const isShowReorderLayer = ref(false);
    const isShowCancelOrderModal = ref(false);
    const isPaymentsBottomSheet = ref(false);

    const handleCloseLayerAndReload = async (modified) => {
      isShowDeliveryAdditionLayer.value = false;
      isShowReorderLayer.value = false;
      isShowRequestDeliveryLayer.value = false;
      if (modified) {
        requestDeliveryAction.value = null;
        loadOrder();
      }
    };

    const handleCloseLayerAndGoToMain = async (modified) => {
      isShowCancelOrderModal.value = false;
      isShowRejectOrderModal.value = false;
      if (modified) {
        router.back();
      }
    };

    const handleCloseResolveDeliveryLayer = async (action) => {
      isShowResolveDeliveryLayer.value = false;
      if (action === 'go-to-main') {
        router.go(-1);
      } else
      if (action === 'reload') {
        loadOrder();
      }
    };

    const {
      doUpdateDeliveryStatus,
    } = useDeliveryAsync();

    const handleDepartDelivery = async (delivery) => {
      common.setIsOverlayLoading(true);

      let targetDelivery;
      if (!delivery) {
        targetDelivery = getMainDelivery(order.value);
      } else {
        targetDelivery = delivery;
      }

      // 출발
      const payload = {
        deliveryId: targetDelivery.deliveryId,
        status: DELIVERY_STATUS.PICKUP_FINISHED,
      };
      await doUpdateDeliveryStatus(payload);

      common.setIsOverlayLoading(false);
      loadOrder();
    };

    const handleArriveDelivery = async (delivery) => {
      common.setIsOverlayLoading(true);

      let targetDelivery;
      if (!delivery) {
        targetDelivery = getMainDelivery(order.value);
      } else {
        targetDelivery = delivery;
      }

      // 도착
      const payload = {
        deliveryId: targetDelivery.deliveryId,
        status: DELIVERY_STATUS.DROP_FINISHED,
      };
      await doUpdateDeliveryStatus(payload);

      common.setIsOverlayLoading(false);
      loadOrder();
    };

    const handleChangeToAgencyDelivery = () => {
      const mainDelivery = getMainDelivery(order.value);
      requestDeliveryAction.value = {
        type: 'ChangeToAgencyDelivery',
        delivery: mainDelivery,
      };
      isShowRequestDeliveryLayer.value = true;
    };

    const callCenterHubPhone = ref();
    const handleResolveDelivery = async () => {
      common.setIsOverlayLoading(true);
      callCenterHubPhone.value = null;

      const isRoadShop = auth.currentStore.manageOrderAgencyId === 'self';
      const mainDelivery = getMainDelivery(order.value);
      if (isRoadShop && mainDelivery?.deliveryAgencyId) {
        try {
          const { deliveryAgencyCallCenterHubPhone } =
        await common.deliveryAgencyCallCenterHubPhone({
          storeId: order.value.storeId,
          deliveryAgencyId: mainDelivery.deliveryAgencyId,
        });
          callCenterHubPhone.value = deliveryAgencyCallCenterHubPhone.callCenterHubPhone;
        } catch (err) {
          logger.error(err);
        }
      }
      common.setIsOverlayLoading(false);

      isShowResolveDeliveryLayer.value = true;
    };

    const isShowDeliveryAdditionModal = ref(false);
    const handleDeliveryAddition = () => {
      isShowDeliveryAdditionModal.value = false;
      isShowDeliveryAdditionLayer.value = true;
    };
    const handleReorder = () => {
      isShowDeliveryAdditionModal.value = false;
      isShowReorderLayer.value = true;
    };

    const targetDelivery = ref(null);
    const handleCloseCancelDeliveryLayer = async (canceled) => {
      isShowCancelDeliveryModal.value = false;
      if (canceled) {
        // 주문까지 취소되는 배달 취소는 취소 후 메인 화면으로 보냄
        if (order.value.orderType === ORDER_TYPE.FOR_DELIVERY
          || order.value.orderType === ORDER_TYPE.ADMIN_FOR_DELIVERY) {
          router.go(-1);
        } else {
          loadOrder();
        }
      }
      targetDelivery.value = null;
    };

    const isShowUntactImageModal = ref(false);
    const handleShowUntactImage = (delivery) => {
      if (!delivery) {
        targetDelivery.value = getMainDelivery(order.value);
      } else {
        targetDelivery.value = delivery;
      }
      isShowUntactImageModal.value = true;
    };

    const handleCloseUntactImageModal = () => {
      isShowUntactImageModal.value = false;
      targetDelivery.value = null;
    };

    const handleCancelDelivery = (delivery) => {
      if (!delivery) {
        targetDelivery.value = getMainDelivery(order.value);
      } else {
        targetDelivery.value = delivery;
      }
      isShowCancelDeliveryModal.value = true;
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    const isShowOverlayView = computed(() =>
      isShowDeliveryAdditionLayer.value
      || isShowReorderLayer.value
      || isShowRequestDeliveryLayer.value
      || isShowRejectOrderModal.value
      || isShowOrderChangeHistoryBottomSheet.value
      || isPaymentsBottomSheet.value
      || isShowResolveDeliveryLayer.value
      || isShowCancelDeliveryModal.value
      || isShowDeliveryAdditionModal.value);

    const closeOverlayView = () => {
      isShowDeliveryAdditionLayer.value = false;
      isShowReorderLayer.value = false;
      isShowRequestDeliveryLayer.value = false;
      isShowRejectOrderModal.value = false;
      isShowOrderChangeHistoryBottomSheet.value = false;
      isPaymentsBottomSheet.value = false;
      isShowResolveDeliveryLayer.value = false;
      isShowCancelDeliveryModal.value = false;
      isShowDeliveryAdditionModal.value = false;
    };

    onBeforeRouteLeave((to, from, next) => {
      if (isGoBack.value && isShowOverlayView.value) {
        closeOverlayView();
        next(false);
        return;
      }
      next();
    });

    return {
      isLoading,
      order,
      orderChangeHistories,
      handleModifyOrder: () => {
        router.push({ name: 'ModifyOrder', params: { orderId: order.value.orderId } });
      },
      orderTotalPaymentAmount,
      isFinishedOrder,
      isSamePaymentAmount,
      isShowRequestDeliveryLayer,
      isShowRejectOrderModal,
      isShowCancelDeliveryModal,
      isShowOrderChangeHistoryBottomSheet,
      handleCloseLayerAndReload,
      handleCloseLayerAndGoToMain,
      handleCloseCancelDeliveryLayer,
      isShowResolveDeliveryLayer,
      handleCloseResolveDeliveryLayer,
      handleDepartDelivery,
      handleArriveDelivery,
      requestDeliveryAction,
      handleChangeToAgencyDelivery,
      handleAcceptableTimeExpired: () => {
        isShowRequestDeliveryLayer.value = false;
        isShowRejectOrderModal.value = false;
        loadOrder();
      },
      isShowDeliveryAdditionModal,
      isShowDeliveryAdditionLayer,
      handleDeliveryAddition,
      isShowReorderLayer,
      handleReorder,
      isShowCancelOrderModal,
      isShowUntactImageModal,
      isPaymentsBottomSheet,
      targetDelivery,
      handleShowUntactImage,
      handleCloseUntactImageModal,
      handleCancelDelivery,
      handleResolveDelivery,
      handleShowDeliveryAdditionModal: () => {
        if (order.value.reorderRelation) {
          handleDeliveryAddition();
        } else {
          isShowDeliveryAdditionModal.value = true;
        }
      },
      callCenterHubPhone,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
@import '@/styles/mixins';
</style>
