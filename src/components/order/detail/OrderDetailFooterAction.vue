<template>
  <div class="content w-100">
    <VRow class="ma-0">
      <!-- 완료나 취소(거절)가 아닌 주문만 버튼을 표시 -->
      <template v-if="!isFinished && !isCanceled">
        <!-- 거절된 주문 -->
        <template v-if="isRejected">
          <VCol>
            <div class="message">
              <VIcon icon="mdi-alert-circle-outline" color="#E53935" size="1.6rem" />
              <span class="ml-1 s-color-red-e5 font-size-12">
                {{ $t('views.orderDetail.orderCard.message.rejected') }}
              </span>
            </div>
          </VCol>
        </template>

        <!-- 접수대기 주문 -->
        <template v-else-if="isNeedAccept || isAcceptTimeExpired
          || isCanRequestDelivery || isDeliveryFailed">
          <!-- 해결하기 -->
          <template v-if="isDeliveryFailed">
            <VCol class="pa-2 pl-1">
              <StoreButton block color="primary" @click.stop="handleResolveProblem">
                <span class="font-weight-bold">
                  {{ $t('views.orderDetail.button.resolveProblem') }}
                </span>
              </StoreButton>
            </VCol>
          </template>
          <!-- 해결하기가 아닌 경우 (isNeedAccept || isCanRequestDelivery) -->
          <template v-else>
            <!-- 수락 가능한 주문 -->
            <template v-if="isForOrder">
              <!-- 수락 제한시간이 남은 경우 -->
              <template v-if="isNeedAccept">
                <VCol class="pa-2 pl-1">
                  <StoreButton block color="primary" @click.stop="handleRequestDelivery">
                    <span class="font-weight-bold">
                      {{ $t('views.orderDetail.button.acceptOrder') }}
                    </span>
                  </StoreButton>
                </VCol>
              </template>
              <template v-else-if="isCanRequestDelivery">
                <VCol v-if="isAdditionalDeliveriesAreAllBeforeAllocated" class="pa-2 pr-1">
                  <StoreButton
                    block
                    variant="outlined"
                    color="#BDBDBD"
                    @click.stop="handleModifyOrder"
                  >
                    <span class="s-color-gray-75 font-weight-bold">
                      {{ $t('views.orderDetail.button.updateOrder') }}
                    </span>
                  </StoreButton>
                </VCol>
                <VCol class="pa-2 pl-1">
                  <StoreButton block color="primary" @click.stop="handleRequestDelivery">
                    <span class="font-weight-bold">
                      {{ $t('views.orderDetail.button.requestDelivery') }}
                    </span>
                  </StoreButton>
                </VCol>
              </template>
              <!-- 수락 제한시간이 만료된 경우 -->
              <template v-else>
                <VCol>
                  <div class="message">
                    <VIcon icon="mdi-alert-circle-outline" color="#E53935" size="1.6rem" />
                    <span class="ml-1 s-color-red-e5 font-size-12">
                      {{ $t('views.orderDetail.orderCard.message.acceptTimeExpired') }}
                    </span>
                  </div>
                </VCol>
              </template>
            </template>
            <!-- 이미 수락된 주문 (배달 요청) -->
            <template v-else>
              <VCol v-if="isAdditionalDeliveriesAreAllBeforeAllocated" class="pa-2 pr-1">
                <StoreButton
                  block
                  variant="outlined"
                  color="#BDBDBD"
                  @click.stop="handleModifyOrder"
                >
                  <span class="s-color-gray-75 font-weight-bold">
                    {{ $t('views.orderDetail.button.updateOrder') }}
                  </span>
                </StoreButton>
              </VCol>
              <VCol class="pa-2 pl-1">
                <StoreButton block color="primary" @click.stop="handleRequestDelivery">
                  <span class="font-weight-bold">
                    {{ $t('views.orderDetail.button.requestDelivery') }}
                  </span>
                </StoreButton>
              </VCol>
            </template>
          </template>
        </template>

        <!-- 접수 주문 -->
        <template v-else-if="isAccepted">
          <VCol v-if="isAdditionalDeliveriesAreAllBeforeAllocated" class="pa-2 pr-1">
            <StoreButton block variant="outlined" color="#BDBDBD" @click.stop="handleModifyOrder">
              <span class="s-color-gray-75 font-weight-bold">
                {{ $t('views.orderDetail.button.updateOrder') }}
              </span>
            </StoreButton>
          </VCol>
          <VCol v-if="!hasAdditionalDeliveries" class="pa-2 pl-1">
            <StoreButton block color="primary" @click.stop="handleCancelDelivery">
              <span class="font-weight-bold">
                {{ $t('views.orderDetail.button.cancelDelivery') }}
              </span>
            </StoreButton>
          </VCol>
        </template>

        <!-- 배차 주문 -->
        <template v-else-if="isAllocated || isSelfDeliveryCreated || isDeliveriesInAllocated">
          <VCol v-if="isAdditionalDeliveriesAreAllBeforeAllocated" class="pa-2 pr-1">
            <StoreButton block variant="outlined" color="#BDBDBD" @click.stop="handleModifyOrder">
              <span class="s-color-gray-75 font-weight-bold">
                {{ $t('views.orderDetail.button.updateOrder') }}
              </span>
            </StoreButton>
          </VCol>
          <VCol v-if="!hasAdditionalDeliveries" class="pa-2 pl-1">
            <StoreButton
              v-if="isSelfDeliveryCreated"
              block
              color="primary"
              @click.stop="handleDepartDelivery"
            >
              <span class="font-weight-bold">
                {{ $t('views.orderDetail.button.departDelivery') }}
              </span>
            </StoreButton>
            <div v-else-if="isRoadShopOrder" class="message">
              <VIcon icon="mdi-alert-circle-outline" size="1.6rem" />
              <span class="ml-1 font-size-12">
                {{ $t('views.orderDetail.orderCard.message.cannotCancelDelivery') }}
              </span>
            </div>
            <StoreButton
              v-else
              block
              color="primary"
              @click.stop="handleCancelDelivery"
            >
              <span class="font-weight-bold">
                {{ $t('views.orderDetail.button.cancelDelivery') }}
              </span>
            </StoreButton>
          </VCol>
        </template>

        <!-- 픽업 주문 -->
        <template v-else-if="isPickupFinished || isDeliveriesInPickup || isSelfDeliveryDeparted">
          <template v-if="!hasAdditionalDeliveries">
            <template v-if="isSelfDeliveryDeparted">
              <VCol v-if="!isDeliveriesInPickup" class="pa-2 pr-1">
                <StoreButton
                  block
                  variant="outlined"
                  color="#BDBDBD"
                  @click.stop="handleModifyOrder"
                >
                  <span class="s-color-gray-75 font-weight-bold">
                    {{ $t('views.orderDetail.button.updateOrder') }}
                  </span>
                </StoreButton>
              </VCol>
              <VCol class="pa-2 pl-1">
                <StoreButton
                  block
                  color="primary"
                  @click.stop="handleArriveDelivery"
                >
                  <span class="font-weight-bold">
                    {{ $t('views.orderDetail.button.arriveDelivery') }}
                  </span>
                </StoreButton>
              </VCol>
            </template>
            <VCol v-else class="pa-2 pr-1">
              <div class="message">
                <VIcon icon="mdi-alert-circle-outline" size="1.6rem" />
                <span class="ml-1 font-size-12">
                  {{ $t('views.orderDetail.orderCard.message.cannotCancelDelivery') }}
                </span>
              </div>
            </VCol>
          </template>
        </template>
      </template>
    </VRow>
  </div>
</template>
<script>
import { computed, defineComponent } from 'vue';

import
{
  isNeedAccept,
  isAcceptTimeExpired,
  isCanRequestDelivery,
  isDeliveryFailed,
  isAccepted,
  isAllocated,
  isSelfDeliveryCreated,
  isDeliveriesInAllocated,
  isRoadShopOrder,
  isDeliveriesInPickup,
  isPickupFinished,
  isSelfDeliveryDeparted,
  isHallOrder,
  isPackingOrder,
  hasAdditionalDeliveries,
} from '@/utils/orderUtils';
import { isAtLeastAllocatedDelivery } from '@/utils/deliveryUtils';
import { ORDER_STATUS, ORDER_TYPE } from '@/constants';
import { useOrderDetailStore } from '@/stores';

import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'OrderDetailFooterAction',
  components: {
    StoreButton,
  },
  emits: ['modify-order', 'request-delivery', 'resolve-delivery', 'cancel-delivery', 'depart-delivery', 'arrive-delivery'],
  setup(props, { emit }) {
    const orderDetail = useOrderDetailStore();
    const order = computed(() => orderDetail.getOrder);

    return {
      isNeedAccept: computed(() => order.value && isNeedAccept(order.value)),
      isAcceptTimeExpired: computed(() => order.value && isAcceptTimeExpired(order.value)),
      isCanRequestDelivery: computed(() => order.value && isCanRequestDelivery(order.value)),
      isDeliveryFailed: computed(() => order.value && isDeliveryFailed(order.value)),

      isAccepted: computed(() => order.value && isAccepted(order.value)),
      isFinished: computed(() => order.value?.status === ORDER_STATUS.FINISHED),
      isCanceled: computed(() => order.value?.status === ORDER_STATUS.CANCELED
        || order.value?.status === ORDER_STATUS.FAILED),
      isRejected: computed(() => order.value?.status === ORDER_STATUS.REJECTED),
      isAllocated: computed(() => order.value && isAllocated(order.value)),
      isSelfDeliveryCreated: computed(() => order.value && isSelfDeliveryCreated(order.value)),
      isDeliveriesInAllocated: computed(() => order.value && isDeliveriesInAllocated(order.value)),
      isRoadShopOrder: computed(() => order.value && isRoadShopOrder(order.value)),

      isPickupFinished: computed(() => order.value && isPickupFinished(order.value)),
      isSelfDeliveryDeparted: computed(() => order.value && isSelfDeliveryDeparted(order.value)),
      isHallOrder: computed(() => order.value && isHallOrder(order.value)),
      isPackingOrder: computed(() => order.value && isPackingOrder(order.value)),
      isDeliveriesInPickup: computed(() => order.value && isDeliveriesInPickup(order.value)),

      isForOrder: computed(() => order.value && order.value.orderType === ORDER_TYPE.FOR_ORDER),
      hasAdditionalDeliveries: computed(() => order.value && hasAdditionalDeliveries(order.value)),

      isAdditionalDeliveriesAreAllBeforeAllocated: computed(() =>
        !order.value.deliveries
          .filter((delivery) => delivery.additionType)
          .some(isAtLeastAllocatedDelivery)),

      handleModifyOrder: () => {
        emit('modify-order');
      },
      handleRequestDelivery: () => {
        emit('request-delivery');
      },
      handleResolveProblem: () => {
        emit('resolve-delivery');
      },
      handleCancelDelivery: () => {
        emit('cancel-delivery');
      },
      handleDepartDelivery: () => {
        emit('depart-delivery');
      },
      handleArriveDelivery: () => {
        emit('arrive-delivery');
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.message {
  height: 4.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
