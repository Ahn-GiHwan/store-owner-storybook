<template>
  <VCard
    flat
    class="status-card w-100 pa-4"
    :class="[
      { canceled: isDeliveryFailedOrder },
      { 'loading-prepare': isUpdateLoading },
    ]"
  >
    <div class="d-flex" :class="mdAndUp ? 'flex-row' : 'flex-column'">
      <div class="flex-grow-1">
        <VProgressCircular
          v-if="isUpdateLoading"
          indeterminate
          color="primary"
          class="mr-1"
        />

        <!-- 수락이 필요한 주문인지(타이머 표시) -->
        <div v-if="isNeedAcceptOrder">
          <StoreOrderTimer
            :order="order"
            :orderAgencyRejectTime="rejectTime"
            @acceptable-time-expired="handleAcceptableTimeExpired"
          />
        </div>

        <template v-else>
          <!-- 주문상태 뱃지  -->
          <StoreOrderServeTypeBadge
            v-for="(item, index) in order.badge"
            :key="index"
            :labelName="item.labelName"
            :color="item.color"
            :variant="item.variant"
          />

          <!-- 접수시간  -->
          <span
            class="font-size-12"
            :class="isDeliveryFailedOrder ? 's-color-red-e5' : 's-color-gray-66'"
          >
            {{ orderDateTime }}
          </span>
        </template>

        <!-- 주문자 주소, 메뉴, 폰번호 정보 -->
        <StoreOrdererInfo :order="order"/>

        <!-- 주문카드의 에러사유 표시영역 -->
        <div v-if="isDeliveryFailedOrder" class="text-start pa-0 mt-1">
          <StoreErrorMessageText
            class="text-start"
            :error-message="errorMessage"
          />
        </div>
      </div>

      <template v-if="currentTab !== 'waiting' && !mdAndUp">
        <!-- 라이더 정보 다중배달 -->
        <div v-if="isMultiDeliveryOrder">
          <StoreDeliveryAgencyInfo :order="order" />
        </div>
      </template>

      <!-- 배달 요청-->
      <template v-if="isNeedAcceptOrder || isCanRequestDeliveryOrder">
        <div :class="mdAndUp ? 'right-button align-self-stretch d-flex' : 'flex-grow-1 mt-3'">
          <StoreButton
            class="outlined font-weight-bold align-self-stretch"
            :width="mdAndUp ? '8.8rem' : '100vw'"
            :height="mdAndUp ? '100%' : ''"
            @click.stop="handleRequestDelivery"
          >
          {{ isNeedAcceptOrder ? '수락' : '배달요청' }}
          </StoreButton>
        </div>
      </template>

      <template v-else-if="isDeliveryFailedOrder">
        <div :class="mdAndUp ? 'right-button align-self-stretch d-flex' : 'flex-grow-1 mt-3'">
          <StoreButton
            class="outlined font-weight-bold align-self-stretch"
            :width="mdAndUp ? '8.8rem' : '100vw'"
            :height="mdAndUp ? '100%' : ''"
            @click.stop="handleResolveDelivery"
          >
            해결하기
          </StoreButton>
        </div>
      </template>

      <template v-else-if="isSelfDeliveryCreatedOrder">
        <div :class="mdAndUp ? 'right-button align-self-stretch d-flex' : 'flex-grow-1 mt-3'">
          <StoreButton
            class="outlined font-weight-bold align-self-stretch"
            variant="outlined"
            :width="mdAndUp ? '8.8rem' : '100vw'"
            :height="mdAndUp ? '100%' : ''"
            @click.stop="handleDepartDelivery"
          >
            <span class="text-secondary">출발</span>
          </StoreButton>
        </div>
      </template>

      <template v-else-if="isSelfDeliveryDepartedOrder">
        <div :class="mdAndUp ? 'right-button align-self-stretch d-flex' : 'flex-grow-1 mt-3'">
          <StoreButton
            class="outlined font-weight-bold align-self-stretch"
            variant="outlined"
            :width="mdAndUp ? '8.8rem' : '100vw'"
            :height="mdAndUp ? '100%' : ''"
            @click.stop="handleArriveDelivery"
          >
            <span class="text-secondary">도착</span>
          </StoreButton>
        </div>
      </template>

      <template v-else-if="isCanPrepareForCityKitchenOrder || isCanPrepareForNotificationOrder">
        <div :class="mdAndUp ? 'right-button align-self-stretch d-flex' : 'flex-grow-1 mt-3'">
          <StoreButton
            class="outlined font-weight-bold align-self-stretch"
            variant="outlined"
            :width="mdAndUp ? '8.8rem' : '100vw'"
            :height="mdAndUp ? '100%' : ''"
            @click.stop="handlePrepareOrder"
          >
            <span class="text-secondary">준비완료</span>
          </StoreButton>
        </div>
      </template>

      <!-- 준비완료 알림을 보낸 후 배달이 추가 되었을 때 -->

      <template v-else>
        <!-- 라이더 정보 (직접배달x 홀x 포장x 단일배달) -->
        <div
          v-if="isNotHallAndPackingAndOnlyOneDelivery"
          :class="mdAndUp ? 'right-info align-self-stretch d-flex' : 'flex-grow-1 mt-3'"
        >
          <StoreDeliveryAgencyInfo :order="order" />
        </div>
      </template>
    </div>

    <template v-if="currentTab !== 'waiting' && mdAndUp">
      <!-- 라이더 정보 다중배달 -->
      <div v-if="isMultiDeliveryOrder">
        <StoreDeliveryAgencyInfo :order="order" />
      </div>
    </template>
  </VCard>
</template>

<script setup name="StoreDeliveryStatusCard">
import { computed, ref } from 'vue';
import { useLocale, useDisplay } from 'vuetify';
import dayjs from 'dayjs';

import { DELIVERY_TYPE, DELIVERY_STATUS } from '@/constants';
import { useAuthStore, useOrderStore, useCommonStore, useErrorsStore } from '@/stores';
import { getOrderDateTime } from '@/utils/dateUtils';
import {
  isOnlyOneDelivery,
  isPackingOrder,
  isHallOrder,
  isMultiAcceptedDeliveries,
  isDeliveryFailed,
  isNeedAccept,
  isCanRequestDelivery,
  isSelfDeliveryCreated,
  isSelfDeliveryDeparted,
  isCanPrepareForCityKitchen,
  isCanPrepareForNotification,
  getMainDelivery,
} from '@/utils/orderUtils';
import useDeliveryAsync from '@/composables/useDeliveryAsync';

import StoreButton from '@/components/common/StoreButton.vue';
import StoreOrderServeTypeBadge from '@/components/delivery/StoreOrderServeTypeBadge.vue';
import StoreOrderTimer from '@/components/delivery/StoreOrderTimer.vue';
import StoreOrdererInfo from '@/components/delivery/StoreOrdererInfo.vue';
import StoreDeliveryAgencyInfo from '@/components/delivery/StoreDeliveryAgencyInfo.vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';

const { t } = useLocale();
const { mdAndUp } = useDisplay();

const props = defineProps({
  order: {
    type: Object,
    require: true,
  },
});

const emit = defineEmits(['request-delivery', 'resolve-delivery', 'depart-delivery', 'arrive-delivery', 'acceptable-time-expired']);

const orderStore = useOrderStore();
const commonStore = useCommonStore();
const errorsStore = useErrorsStore();

// 접수대기
// 수락이 필요한 주문
const isNeedAcceptOrder = computed(() => isNeedAccept(props.order));
const rejectTime = computed(() => commonStore.orderAgencyRejectTime(props.order.orderAgencyId));
const handleAcceptableTimeExpired = () => {
  const orderAgency = commonStore.getOrderAgencies?.find(
    ({ orderAgencyId }) => orderAgencyId === props.order.orderAgencyId,
  );
  commonStore.showAlertMessage(
    {
      title: '수락 제한 시간이 종료되었습니다.',
      message: `‘${orderAgency.orderAgencyName}' ${props.order.orderId}번 주문`,
    },
    undefined,
    undefined,
    false,
  );
  emit('acceptable-time-expired');
};

// 배달 요청이 필요한 주문
const isCanRequestDeliveryOrder = computed(() => isCanRequestDelivery(props.order));

const handleRequestDelivery = () => {
  emit('request-delivery');
};

// 실패한 배달의 주문
const isDeliveryFailedOrder = computed(() => isDeliveryFailed(props.order));
const mainDelivery = computed(() => getMainDelivery(props.order));

const getDeliveryStatusPrefix = (status) => {
  switch (status) {
    case DELIVERY_STATUS.REJECTED:
      return 'deliveryRejected';
    case DELIVERY_STATUS.FAILED:
      return 'deliveryFailed';
    default:
      return 'deliveryCanceled';
  }
};
const errorMessage = ref(computed(() => t(
  `errors.${getDeliveryStatusPrefix(mainDelivery.value?.status)}.${mainDelivery.value?.cancelType}`,
  t('errors.deliveryPossible.UNKNOWN_SERVER_ERROR'),
)));

const handleResolveDelivery = () => {
  emit('resolve-delivery');
};

const isUpdateLoading = ref(false);

const {
  doUpdateDeliveryStatus,
} = useDeliveryAsync();

// 직접배달 (출발전)
const isSelfDeliveryCreatedOrder = computed(() => isSelfDeliveryCreated(props.order));

const handleDepartDelivery = async () => {
  isUpdateLoading.value = true;
  // 출발
  const payload = {
    deliveryId: mainDelivery.value.deliveryId,
    status: DELIVERY_STATUS.PICKUP_FINISHED,
  };
  await doUpdateDeliveryStatus(payload);
  isUpdateLoading.value = false;
  orderStore.refreshOrders();
};

// 직접배달 (출발후)
const isSelfDeliveryDepartedOrder = computed(() => isSelfDeliveryDeparted(props.order));

const handleArriveDelivery = async () => {
  isUpdateLoading.value = true;
  // 도착
  const payload = {
    deliveryId: mainDelivery.value.deliveryId,
    status: DELIVERY_STATUS.DROP_FINISHED,
  };
  await doUpdateDeliveryStatus(payload);
  isUpdateLoading.value = false;
  orderStore.refreshOrders();
};

// 준비완료(도시주방) 가능 주문
const isCanPrepareForCityKitchenOrder = computed(() => isCanPrepareForCityKitchen(props.order));

// 준비완료(배달) 가능 주문
const isCanPrepareForNotificationOrder = computed(() => isCanPrepareForNotification(props.order));

const authStore = useAuthStore();
const handlePrepareOrder = async () => {
  try {
    isUpdateLoading.value = true;

    // 주문 상품 준비 완료 (도시주방용)
    if (isCanPrepareForCityKitchenOrder.value) {
      await orderStore.prepareOrder({
        storeId: authStore.currentStore.storeId,
        orderId: props.order.orderId,
      });
    }
    // 주문 상품 준비 완료 (배달대행사에 알림)
    await orderStore.prepareOrderForNotification({
      storeId: authStore.currentStore.storeId,
      orderId: props.order.orderId,
    });

    orderStore.refreshOrders();
  } catch (err) {
    let errorCode = errorsStore?.convertedError?.code;

    // 인터넷 연결에 문제가 있는 상태면
    if (!errorCode && !window.navigator.onLine) {
      errorCode = 'UNCONNECTED_INTERNET';
    }

    commonStore.showToast('error', t(`errors.prepareOrderForNotification.${errorCode}`, t('errors.prepareOrderForNotification.UNKNOWN_SERVER_ERROR')));
  } finally {
    isUpdateLoading.value = false;
  }
};

// 다중 배달 주문
const isMultiDeliveryOrder = computed(() => isMultiAcceptedDeliveries(props.order));

const currentTab = computed(() => orderStore.selectedTab);

// 접수 시간
const orderDateTime = computed(() => {
  let orderAcceptedTime = `${getOrderDateTime(props.order.createdAt)}  접수`;
  // 배차탭은 픽업시간으로 표기
  if (currentTab.value === 'allocated' &&
    !isSelfDeliveryCreated(props.order) && (mainDelivery.value?.pickupExpectedAt) > 0) {
    const date1 = dayjs(mainDelivery.value.pickupExpectedAt);
    const date2 = dayjs(commonStore.systemTimestamp);

    const diffMinutes = date2.diff(date1, 'm');

    if (diffMinutes < 0) {
      orderAcceptedTime = `${date1.diff(date2, 'm')}분 후 픽업 예상`;
    } else
    if (diffMinutes < 5) {
      orderAcceptedTime = '곧 픽업합니다.';
    } else {
      orderAcceptedTime = `${getOrderDateTime(mainDelivery.value.pickupExpectedAt)} 픽업 예상`;
    }
  }
  return orderAcceptedTime;
});

const isNotHallAndPackingAndOnlyOneDelivery = computed(
  () =>
    !isPackingOrder(props.order) && !isHallOrder(props.order) &&
      mainDelivery.value?.deliveryType !== DELIVERY_TYPE.SELF &&
      isOnlyOneDelivery(props.order),
);

</script>

<style lang="scss" scoped>
.status-card {
  border: 1px solid #e0e0e0;
}

.canceled {
  background: #ffebeb;
}

.loading-prepare {
  opacity: 0.5;
}

.right-button {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 8.8rem;
}

.right-info {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 10.7rem;
}
</style>
