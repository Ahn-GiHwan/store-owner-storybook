<template>
  <div class="content mb-2">
    <StoreBaseCard flat>
      <template #card-header>
        <div no-gutters class="d-flex justify-space-between align-start pa-4 pt-6">
          <div class="d-inline-flex align-start align-content-start">
            <div
              class="d-flex"
              :class="mdAndUp ? 'flex-row' : 'flex-column'"
            >
              <div class="header-title font-weight-bold font-size-16 mr-2">
                {{ $t('views.orderDetail.deliveryCard.title') }}
                <template v-if="index">{{ index }}</template>
              </div>
              <div
                v-if="isMultiDelivery && isShowDeliveryStatus"
                class="text-left mr-2"
              >
                ({{ $t(`common.deliveryStatus.${$props.delivery.status}`)}})
              </div>
            </div>
            <DeliveryAdditionTypeLabel class="addition-type-label" :delivery="$props.delivery" />
          </div>
          <div>
            <div class="text-right">
              <DeliveryStatusLabel :order="order" :delivery="$props.delivery" />
            </div>
          </div>
        </div>
      </template>
      <template #card-content>
        <VRow no-gutters class="d-flex flex-column pa-4 pt-0">
          <VCol v-if="hasRiderDelivery($props.delivery)
            && ($props.delivery.driverName || $props.delivery.driverPhone)">
            <OrderListItem
              :label="$t('views.orderDetail.deliveryCard.fields.rider')"
              actionSize="none"
              :hasBottomBorder="false"
            >
              <template #list-item-content>
                <DeliveryDriverInfo :delivery="$props.delivery" />
              </template>
            </OrderListItem>
          </VCol>
          <VCol
            v-if="!$props.delivery.additionType
              && isDeferedPriceChanged($props.order, $props.delivery)"
          >
            <OrderListItem
              :label="$t('views.orderDetail.deliveryCard.fields.customerPaymentToRider')"
              actionSize="medium"
              :important="true"
            >
              <template #list-item-content>
                <DeliveryDeferedPriceChanged :order="$props.order" :delivery="$props.delivery" />
              </template>
              <template #list-item-action>
                <OrderPaymentMethod :order="delivery" />
              </template>
            </OrderListItem>
          </VCol>
          <VCol
            v-if="$props.delivery.deliveryType === DELIVERY_TYPE.AGENCY
              && $props.delivery.deliveryAgencyId"
            class="pt-2"
          >
            <StoreOrderDeliveryInfo :deliveryInfo="$props.delivery" />
          </VCol>
          <VCol class="mt-4">
            <DeliveryProgress :order="$props.order" :delivery="$props.delivery" />
          </VCol>
          <VCol class="mt-4 px-2">
            <template v-if="isFailedDelivery($props.delivery)">
              <VIcon icon="mdi-alert-circle-outline" color="#E53935" size="1.6rem" />
              <span class="ml-1 s-color-red-e5 font-size-12">
                {{ $t(`errors.${localeDeliveryStatusPrefix}.${$props.delivery.cancelType}`,
                  $t('errors.deliveryPossible.UNKNOWN_SERVER_ERROR')) }}
              </span>
            </template>
            <p v-if="needShowCSGuide" class="font-size-12 s-color-gray-61">
              {{ $t('views.orderDetail.deliveryCard.csGuide', {
                orderAgencyName: orderAgency.orderAgencyName,
                orderAgencyPhone: addHyphenPhoneNumber(orderAgency.orderAgencyPhone),
              }) }}
            </p>
          </VCol>
        </VRow>
      </template>
      <template #card-bottom>
        <VRow class="ma-0" v-if="hasAdditionalDeliveries">
          <template v-if="hasUntactImage">
            <VCol>
              <StoreButton
                block
                variant="outlined"
                color="#BDBDBD"
                height="4rem"
                @click.stop="handleShowUntactImage"
              >
                <span class="text-secondary">
                  {{ $t('views.orderDetail.button.untactImage') }}
                </span>
              </StoreButton>
            </VCol>
          </template>
          <template v-if="isSelfDeliveryCreatedWithAnotherDelivery
            || isSelfDeliveryDepartedWithAnotherDelivery">
            <template v-if="isCancelableDelivery">
              <VCol>
                <StoreButton
                  block
                  variant="outlined"
                  color="#BDBDBD"
                  height="4rem"
                  @click.stop="handleChangeToAgencyDelivery"
                >
                  <span class="text-secondary">
                    {{ $t('views.orderDetail.button.changeToAgencyDelivery') }}
                  </span>
                </StoreButton>
              </VCol>
            </template>
            <template v-if="isSelfDeliveryCreatedWithAnotherDelivery">
              <VCol>
                <StoreButton
                  block
                  height="4rem"
                  @click.stop="handleDepartDelivery"
                >
                  출발
                </StoreButton>
              </VCol>
            </template>
            <template v-if="isSelfDeliveryDepartedWithAnotherDelivery">
              <VCol>
                <StoreButton
                  block
                  height="4rem"
                  @click.stop="handleArriveDelivery"
                >
                  도착
                </StoreButton>
              </VCol>
            </template>
          </template>
          <template v-else>
            <template v-if="isCancelableDelivery">
              <VCol>
                <StoreButton
                  block
                  height="4rem"
                  @click.stop="handleCancelDelivery"
                >
                  {{ $t('views.orderDetail.button.cancelDelivery') }}
                </StoreButton>
              </VCol>
            </template>
          </template>
          <template v-if="isDeliveryFailedWithAnotherDelivery">
            <VCol>
              <StoreButton
                block
                height="4rem"
                @click.stop="handleResolveDelivery"
              >
                {{ $t('views.orderDetail.button.resolveProblem') }}
              </StoreButton>
            </VCol>
          </template>
        </VRow>
      </template>
    </StoreBaseCard>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { useDisplay } from 'vuetify';

import { useCommonStore } from '@/stores';
import StoreBaseCard from '@/components/common/StoreBaseCard.vue';
import { addHyphenPhoneNumber } from '@/utils/stringUtils';
import { hasRiderDelivery, isFailedDelivery, isDeferedPriceChanged } from '@/utils/deliveryUtils';
import {
  needShowCSGuideForCancel,
  hasAdditionalDeliveries,
  hasUntactImage,
  getMainDelivery,
  isSelfDeliveryCreatedWithAnotherDelivery,
  isSelfDeliveryDepartedWithAnotherDelivery,
  isRoadShopOrder,
  isDeliveryFailedWithAnotherDelivery,
  isOnlyOneDelivery,
} from '@/utils/orderUtils';
import { DELIVERY_TYPE, DELIVERY_STATUS } from '@/constants';

import StoreButton from '@/components/common/StoreButton.vue';
import DeliveryAdditionTypeLabel from './DeliveryAdditionTypeLabel.vue';
import OrderListItem from './OrderListItem.vue';
import DeliveryStatusLabel from './DeliveryStatusLabel.vue';
import DeliveryDriverInfo from './DeliveryDriverInfo.vue';
import DeliveryDeferedPriceChanged from './DeliveryDeferredPriceChanged.vue';
import OrderPaymentMethod from './OrderPaymentMethod.vue';
import DeliveryProgress from './DeliveryProgress.vue';
import StoreOrderDeliveryInfo from '@/components/order/common/StoreOrderDeliveryInfo.vue';

export default defineComponent({
  name: 'DeliveryInfoItem',
  components: {
    StoreBaseCard,
    DeliveryAdditionTypeLabel,
    OrderListItem,
    DeliveryStatusLabel,
    DeliveryDriverInfo,
    DeliveryDeferedPriceChanged,
    OrderPaymentMethod,
    DeliveryProgress,
    StoreOrderDeliveryInfo,
    StoreButton,
  },
  props: {
    order: {
      type: Object,
    },
    delivery: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  emits: [
    'show-untact-image',
    'depart-delivery',
    'arrive-delivery',
    'change-to-agency-delivery',
    'cancel-delivery',
    'resolve-delivery',
  ],
  setup(props, { emit }) {
    const common = useCommonStore();
    const { mdAndUp } = useDisplay();
    const orderAgency = computed(() =>
      common.getOrderAgencies?.find(
        ({ orderAgencyId }) => orderAgencyId === props.order.orderAgencyId,
      ));

    const isMultiDelivery = computed(() => !isOnlyOneDelivery(props.order));
    const isShowDeliveryStatus = computed(() =>
      props.delivery.status === DELIVERY_STATUS.ALLOCATION_CHANGED);

    return {
      mdAndUp,
      DELIVERY_TYPE,
      orderAgency,
      localeDeliveryStatusPrefix: computed(() => {
        switch (props.delivery.status) {
          case DELIVERY_STATUS.REJECTED:
            return 'deliveryRejected';
          case DELIVERY_STATUS.FAILED:
            return 'deliveryFailed';
          default:
            return 'deliveryCanceled';
        }
      }),
      // NOTE: 주문제휴사 고객센터 안내가 필요한 경우에만 주문제휴사 정보를 전달함.
      needShowCSGuide: computed(() => needShowCSGuideForCancel(props.order) && orderAgency.value),
      deliveryAgency: computed(() =>
        common.getDeliveryAgencies?.find(
          ({ deliveryAgencyId }) => deliveryAgencyId === props.delivery.deliveryAgencyId,
        )),
      isMultiDelivery,
      isShowDeliveryStatus,
      hasRiderDelivery,
      isDeferedPriceChanged,
      isFailedDelivery,
      addHyphenPhoneNumber,
      hasAdditionalDeliveries: computed(() => hasAdditionalDeliveries(props.order)),
      hasUntactImage: computed(() =>
        props.order && hasUntactImage(props.order, props.delivery)),
      handleShowUntactImage: () => {
        emit('show-untact-image', props.delivery);
      },
      isSelfDeliveryCreatedWithAnotherDelivery: computed(() =>
        getMainDelivery(props.order).deliveryId === props.delivery.deliveryId
        && isSelfDeliveryCreatedWithAnotherDelivery(props.order)),
      handleDepartDelivery: () => {
        emit('depart-delivery', props.delivery);
      },
      isSelfDeliveryDepartedWithAnotherDelivery: computed(() =>
        getMainDelivery(props.order).deliveryId === props.delivery.deliveryId
        && isSelfDeliveryDepartedWithAnotherDelivery(props.order)),
      handleArriveDelivery: () => {
        emit('arrive-delivery', props.delivery);
      },
      isCancelableDelivery: computed(() => {
        if (props.delivery.deliveryType === DELIVERY_TYPE.SELF) {
          return [
            DELIVERY_STATUS.ACCEPTED,
            DELIVERY_STATUS.ALLOCATION_CANCELED,
            DELIVERY_STATUS.ALLOCATION_CHANGED,
            DELIVERY_STATUS.ALLOCATED,
            DELIVERY_STATUS.COOK_REQUESTED,
            DELIVERY_STATUS.ARRIVED,
            DELIVERY_STATUS.PICKUP_FINISHED,
          ].includes(props.delivery.status);
        }
        return isRoadShopOrder(props.order)
          ? [
            DELIVERY_STATUS.ACCEPTED,
            DELIVERY_STATUS.ALLOCATION_CANCELED,
          ].includes(props.delivery.status)
          : [
            DELIVERY_STATUS.ACCEPTED,
            DELIVERY_STATUS.ALLOCATION_CANCELED,
            DELIVERY_STATUS.ALLOCATION_CHANGED,
            DELIVERY_STATUS.ALLOCATED,
            DELIVERY_STATUS.COOK_REQUESTED,
            DELIVERY_STATUS.ARRIVED,
          ].includes(props.delivery.status);
      }),
      handleChangeToAgencyDelivery: () => {
        emit('change-to-agency-delivery');
      },
      handleCancelDelivery: () => {
        emit('cancel-delivery', props.delivery);
      },
      isDeliveryFailedWithAnotherDelivery: computed(() =>
        getMainDelivery(props.order).deliveryId === props.delivery.deliveryId
          && isDeliveryFailedWithAnotherDelivery(props.order)),
      handleResolveDelivery: () => {
        emit('resolve-delivery');
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.header-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
.content {
  line-height: 2.4rem;
}
.important-column {
  background-color: #E8F5E9;
}
.addition-type-label {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
</style>
