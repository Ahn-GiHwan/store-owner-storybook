<template>
  <div class="content">
    <StoreBaseCard flat>
      <template #card-header>
        <div class="d-flex justify-space-between align-center pa-4 pt-6">
          <div class="d-flex flex-wrap align-center">
            <div class="header-title font-weight-bold font-size-16 mr-2">
              {{ $t('views.orderDetail.orderCard.title') }}
            </div>
            <OrderPreparedLabel :order="order" />
          </div>
          <div class="d-flex justify-end flex-wrap-reverse">
            <OrderStatusLabel :order="order" />
            <OrderTimeLabel
              :order="order"
              :orderAgency="orderAgency"
              @acceptable-time-expired="handleAcceptableTimeExpired"
            />
          </div>
        </div>
      </template>
      <template #card-content>
        <VRow no-gutters class="d-flex flex-column px-4 pt-0">
          <VCol>
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.orderChannel')"
              :actionSize="order.isReservation
                || order.reorderRelation
                || order.serveType === ORDER_SERVE_TYPE.HALL
                || order.serveType === ORDER_SERVE_TYPE.PACKING
                || order.orderChannel === 'BAROGO_HUB'
                ? 'large' : 'none'"
            >
              <template #list-item-content>
                <OrderChannel :orderAgency="orderAgency" :orderChannel="order.orderChannel" />
              </template>
              <template #list-item-action>
                <OrderTypeBadge :order="order" />
              </template>
            </OrderListItem>
          </VCol>
          <VCol>
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.phoneNumber')"
              actionSize="none">
              <template #list-item-content>
                <OrderPhoneNumber :order="order" />
              </template>
            </OrderListItem>
          </VCol>
          <VCol data="123" v-if="!order.serveType || order.serveType === ORDER_SERVE_TYPE.DELIVERY">
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.address')"
              :actionSize="Number.isNaN(Number(order.pickupLocation?.latitude))
                || Number.isNaN(Number(order.pickupLocation?.longitude))
                || Number.isNaN(Number(order.dropLocation?.latitude))
                || Number.isNaN(Number(order.dropLocation?.longitude))
                || isDeligatingOrderWithoutAddress
                ? 'none' : 'default'"
            >
              <template #list-item-content>
                <OrderAddress :order="order" />
              </template>
              <template #list-item-action>
                <OrderMapButton
                  :jibunAddress="order.dropJibunAddress"
                  :roadAddress="order.dropRoadAddress"
                  :location="{
                    from_lat: order.pickupLocation?.latitude,
                    from_lng: order.pickupLocation?.longitude,
                    to_lat: order.dropLocation?.latitude,
                    to_lng: order.dropLocation?.longitude,
                  }"
                />
              </template>
            </OrderListItem>
          </VCol>
          <VCol>
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.payment')"
              actionSize="medium"
            >
              <template #list-item-content>
                <OrderPrice :order="order" />
              </template>
              <template #list-item-action>
                <OrderPaymentMethod v-if="order.actualPayPrice > 0" :order="order" />
              </template>
            </OrderListItem>
          </VCol>
          <VCol v-if="order.ordererOrderMemo || order.storeOrderMemo || order.isUntact">
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.memo')"
              :actionSize="order.ordererOrderMemo || order.storeOrderMemo ? undefined : 'none'"
            >
              <template #list-item-content>
                <OrderMemo :order="order" />
              </template>
              <template #list-item-action>
                <OrderMemoButton
                  :order="order"
                  @show-order-memo-modal="isShowOrderMemoModal = true"
                />
              </template>
            </OrderListItem>
          </VCol>
          <VCol>
            <OrderListItem
              :label="$t('views.orderDetail.orderCard.fields.products')"
              :hasBottomBorder="false"
              actionSize="none"
            >
              <template #list-item-content>
                <OrderProductInfo
                  :order="order"
                  @show-order-product-modal="isShowOrderProductModal = true"
                />
              </template>
            </OrderListItem>
          </VCol>
        </VRow>
      </template>
    </StoreBaseCard>
    <OrderMemoModal
      :order="order"
      v-model:visible="isShowOrderMemoModal"
    />
    <OrderProductModal
      :order="order"
      v-model:visible="isShowOrderProductModal"
    />
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';

import { useOrderDetailStore, useCommonStore } from '@/stores';
import { ORDER_SERVE_TYPE } from '@/constants';
import { isDeligatingOrderWithoutAddress } from '@/utils/orderUtils';

import StoreBaseCard from '@/components/common/StoreBaseCard.vue';
import OrderPreparedLabel from './OrderPreparedLabel.vue';
import OrderStatusLabel from './OrderStatusLabel.vue';
import OrderTimeLabel from './OrderTimeLabel.vue';
import OrderListItem from './OrderListItem.vue';
import OrderChannel from './OrderChannel.vue';
import OrderTypeBadge from './OrderTypeBadge.vue';
import OrderPhoneNumber from './OrderPhoneNumber.vue';
import OrderAddress from './OrderAddress.vue';
import OrderMapButton from '../common/OrderMapButton.vue';
import OrderPrice from './OrderPrice.vue';
import OrderPaymentMethod from './OrderPaymentMethod.vue';
import OrderMemo from './OrderMemo.vue';
import OrderMemoButton from './OrderMemoButton.vue';
import OrderProductInfo from './OrderProductInfo.vue';
import OrderMemoModal from './OrderMemoModal.vue';
import OrderProductModal from './OrderProductModal.vue';

export default defineComponent({
  name: 'OrderInfo',
  components: {
    StoreBaseCard,
    OrderPreparedLabel,
    OrderStatusLabel,
    OrderTimeLabel,
    OrderListItem,
    OrderChannel,
    OrderTypeBadge,
    OrderPhoneNumber,
    OrderAddress,
    OrderMapButton,
    OrderPrice,
    OrderPaymentMethod,
    OrderMemo,
    OrderMemoButton,
    OrderProductInfo,
    OrderMemoModal,
    OrderProductModal,
  },
  emits: ['acceptable-time-expired'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const orderDetail = useOrderDetailStore();
    const order = computed(() => orderDetail.getOrder);

    const common = useCommonStore();
    const orderAgency = computed(() =>
      order.value && common.getOrderAgencies?.find(
        ({ orderAgencyId }) => orderAgencyId === order.value?.orderAgencyId,
      ));

    const isShowOrderMemoModal = ref(false);

    const handleCloseMemoModal = () => {
      isShowOrderMemoModal.value = false;
    };

    const isShowOrderProductModal = ref(false);

    const handleCloseProductModal = () => {
      isShowOrderProductModal.value = false;
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    const isShowOverlayView = computed(() =>
      isShowOrderMemoModal.value
      || isShowOrderProductModal.value);

    const closeOverlayView = () => {
      isShowOrderMemoModal.value = false;
      isShowOrderProductModal.value = false;
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
      ORDER_SERVE_TYPE,
      order,
      orderAgency,
      isShowOrderMemoModal,
      handleCloseMemoModal,
      isShowOrderProductModal,
      handleCloseProductModal,
      handleAcceptableTimeExpired: () => {
        common.showAlertMessage(
          {
            title: '수락 제한 시간이 종료되었습니다.',
            message: `‘${orderAgency.value.orderAgencyName}' ${order.value.orderId}번 주문`,
          },
          undefined,
          undefined,
          false,
        );
        emit('acceptable-time-expired');
      },
      isDeligatingOrderWithoutAddress: computed(() =>
        isDeligatingOrderWithoutAddress(order.value)),
    };
  },
});
</script>

<style lang="scss" scoped>
.header-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
</style>
