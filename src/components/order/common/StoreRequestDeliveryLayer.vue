<template>
  <StoreCommonLayer v-bind="{ dialog }" bottom @close="emit('close-layer', isOrderChanged.value)">
    <template #header>
      {{ $props.action?.type === 'ChangeToAgencyDelivery'
          ? $t('common.layer.requestDelivery.changeToAgencyDeliveryTitle')
          : isNeedAcceptOrder
            ? $t('common.layer.requestDelivery.acceptOrderTitle')
            : $t('common.layer.requestDelivery.requestDeliveryTitle') }}
    </template>
    <template #content>
      <VForm>
        <VRow class="px-2 pb-2 flex-column text-center" no-gutters>
          <VCol class="text-left">
            {{ isForOrder
              ? $t('common.layer.requestDelivery.acceptOrderDescription')
              : $t('common.layer.requestDelivery.requestDeliveryDescription') }}
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextField
              name="prepareTime"
              v-model="prepareTimeValue"
              :title="$t('common.layer.requestDelivery.label.prepareTime')"
              variant="outlined"
              :dark="true"
              maxlength="30"
              append-inner-icon="mdi-menu-down"
              @click="isShowPrepareTimeModal = true"
              required
              :disabled="!deliveryPossibleInfo"
            />
          </VCol>
          <VCol v-if="isForOrder" class="mt-4 text-left">
            <StoreTextField
              name="storeDropExpectedTime"
              v-model="storeDropExpectedTimeValue"
              :title="$t('common.layer.requestDelivery.label.storeDropExpectedTime')"
              variant="outlined"
              :dark="true"
              maxlength="30"
              append-inner-icon="mdi-menu-down"
              @click="isShowStoreDropExpectedTimeModal = true"
              required
              :disabled="!deliveryPossibleInfo"
            />
          </VCol>
          <VCol v-if="isUntactVisible" class="text-left" >
            <VCheckbox
              v-model="form.isUntact"
              :label="$t('common.layer.requestDelivery.label.untact')"
              color="primary"
              hide-details
              class="checkbox"
              :disabled="!isUntactEnable"
            />
          </VCol>
          <VCol class="mt-4">
            <div v-if="!deliveryPossibleInfo" class="text-center">
              <VProgressCircular indeterminate color="primary"></VProgressCircular>
            </div>
            <template v-else>
              <VRow v-if="deliveryPossibleInfo.data" no-gutters class="flex-column">
                <VCol>
                  <StorePickupExpected :deliveryInfo="deliveryPossibleInfo.data" />
                </VCol>
                <VCol class="mt-2">
                  <StoreOrderDeliveryInfo :deliveryInfo="deliveryPossibleInfo.data" />
                </VCol>
              </VRow>
              <VRow v-else no-gutters class="flex-column">
                <VCol class="font-size-12 text-red d-flex align-center justify-end">
                  <VIcon
                    icon="mdi-alert-circle-outline"
                    color="#E53935"
                    size="1.4rem"
                    class="mr-1"
                  />
                  {{ $t(`errors.deliveryPossible.${deliveryPossibleInfo.error?.code}`,
                    $t('errors.deliveryPossible.UNKNOWN_SERVER_ERROR')) }}
                </VCol>
              </VRow>
            </template>
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #footer>
      <div class="d-flex">
        <VCol class="pa-0 pr-1">
          <StoreButton
            block
            variant="outlined"
            color="#BDBDBD"
            @click.stop="
              $props.action?.type === 'ChangeToAgencyDelivery'
                ? emit('close-layer')
                : handleRequestDelivery('SELF')"
          >
            <span class="s-color-gray-75 font-weight-bold">
              {{ $props.action?.type === 'ChangeToAgencyDelivery'
                ? $t('common.button.cancel')
                : $t('common.layer.requestDelivery.button.requestSelfDelivery') }}
            </span>
          </StoreButton>
        </VCol>
        <VCol class="pa-0 pl-1">
          <StoreButton
            block
            color="primary"
            :disabled="!deliveryPossibleInfo
              || !!deliveryPossibleInfo.error
              || !deliveryPossibleInfo.data.isPossible"
            @click.stop="handleRequestDelivery('AGENCY')"
          >
            <span class="font-weight-bold">
              {{ $props.action?.type === 'ChangeToAgencyDelivery'
                ? $t('common.layer.requestDelivery.button.changeToAgencyDelivery')
                : $t('common.layer.requestDelivery.button.requestAgencyDelivery') }}
            </span>
          </StoreButton>
        </VCol>
      </div>
    </template>
  </StoreCommonLayer>

  <!--상품준비시간 바텀시트-->
  <SelectTranslatedValueBottomSheet
    v-model:visible="isShowPrepareTimeModal"
    :title="$t('common.layer.requestDelivery.label.prepareTime')"
    :description="$t('common.layer.requestDelivery.label.riderPreparationTime')"
    translator="common.layer.requestDelivery.label.prepareTimeOption"
    :valueOptions="prepareTimeOptions"
    :selectedValue="form.prepareTime"
    type="PREPARE_TIME"
    @set-data="handleSetData"
    @close-layer="closeLayer"
  />

  <!--고객도착시간 바텀시트-->
  <SelectTranslatedValueBottomSheet
    v-model:visible="isShowStoreDropExpectedTimeModal"
    :title="$t('common.layer.requestDelivery.label.arrivalTime')"
    :description="$t('common.layer.requestDelivery.label.customerPreparationTime')"
    translator="common.layer.requestDelivery.label.storeDropExpectedTimeOption"
    :valueOptions="storeDropExpectedTimeOptions"
    :selectedValue="form.storeDropExpectedTime"
    type="STORE_DROP_EXPECTED_TIME"
    @set-data="handleSetData"
    @close-layer="closeLayer"
  />
</template>

<script>
import { defineComponent, ref, computed, reactive, watch, onBeforeMount } from 'vue';
import { useLocale } from 'vuetify';

import { ORDER_TYPE, PAYMENT_METHOD } from '@/constants';
import { useAuthStore, useCommonStore } from '@/stores';
import { isNeedAccept, createPrepareTime, getMainDelivery, getPaymentMethod } from '@/utils/orderUtils';
import useOrderAsync from '@/composables/useOrderAsync';
import useDeliveryAsync from '@/composables/useDeliveryAsync';
import { oneMinute } from '@/utils/dateUtils';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import SelectTranslatedValueBottomSheet from '@/components/order/common/SelectTranslatedValueBottomSheet.vue';
import StorePickupExpected from '@/components/order/common/StorePickupExpected.vue';
import StoreOrderDeliveryInfo from '@/components/order/common/StoreOrderDeliveryInfo.vue';

export default defineComponent({
  components: {
    StoreCommonLayer,
    StoreTextField,
    StoreButton,
    SelectTranslatedValueBottomSheet,
    StorePickupExpected,
    StoreOrderDeliveryInfo,
  },
  name: 'StoreRequestDeliveryLayer',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
    },
  },
  emits: ['close-layer'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const common = useCommonStore();

    const authStore = useAuthStore();
    const { productPrepareTime } = authStore.currentStore;

    const isShowPrepareTimeModal = ref(false);
    const prepareTimeOptions = computed(() =>
      createPrepareTime(productPrepareTime).map(({ value }) => value));

    /**
     * 상품준비시간
     */
    const _minPrepareTime = computed(() => authStore.minimumPrepareTime);
    const initialPrepareTime = prepareTimeOptions.value
      .find((value) => value >= _minPrepareTime.value);
    const form = reactive({
      prepareTime: initialPrepareTime,
      storeDropExpectedTime: initialPrepareTime + 15,
      isUntact: props.order.isUntact,
    });

    // deliveryCondition 조회 후 최소 상품준비시간 설정
    watch(_minPrepareTime, (newTime) => {
      form.prepareTime = prepareTimeOptions.value.find((value) => value > newTime);
    });

    watch(() => form.prepareTime, (newVal, oldVal) => {
      // 최소 픽업시간 미만으로 선택한 경우
      if (_minPrepareTime.value > newVal) {
        form.prepareTime = oldVal;
        common.showToast('error', `${t('errors.deliveryPossible.INVALID_PICKUP_WISH_AT', { minute: _minPrepareTime.value })}`);
      }
    });

    const isShowStoreDropExpectedTimeModal = ref(false);
    const storeDropExpectedTimeOptions = computed(() =>
      createPrepareTime(form.prepareTime + 15).map(({ value }) => value));

    watch(() => ({ ...form }), (newValue, oldValue) => {
      if (newValue.prepareTime !== oldValue.prepareTime) {
        [form.storeDropExpectedTime] = storeDropExpectedTimeOptions.value;
      }
    });

    const {
      doRequestDelivery,
      doDeliveryPossible,
      doReRequestDelivery,
      doCancelDelivery,
      isSuccess: isAsyncDeliveryRequestSuccess,
      data: asyncDeliveryRequestData,
      error: asyncDeliveryRequestError,
    } = useDeliveryAsync();

    const deliveryPossibleInfo = ref(null);
    const _requestDeliveryPossible = async () => {
      const _order = props.order;
      deliveryPossibleInfo.value = null;

      // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 요청 합니다.
      let pickupMinute = form.prepareTime;
      if (pickupMinute <= 0) {
        pickupMinute = 5;
      }
      const payload = {
        dropJibunAddress: _order.dropJibunAddress,
        dropRoadAddress: _order.dropRoadAddress,
        dropAddressDetail: _order.dropAddressDetail,
        totalPayPrice: _order.totalPayPrice,
        actualPayPrice: _order.actualPayPrice,
        prepaidPrice: _order.prepaidPrice,
        dropWishAt: _order.dropWishAt,
        orderAgencyId: _order.orderAgencyId,
        isUntact: form.isUntact,
        isReservation: _order.isReservation,
        pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
      };
      await doDeliveryPossible(payload);
      deliveryPossibleInfo.value = {
        data: asyncDeliveryRequestData.value,
        error: asyncDeliveryRequestError.value,
      };
    };

    onBeforeMount(() => {
      if (props.dialog) {
        _requestDeliveryPossible();
      }
    });
    watch(() => props.dialog, (newValue) => {
      if (newValue) {
        _requestDeliveryPossible();
      }
    });

    const handleSetData = ({ type, value }) => {
      if (type === 'PREPARE_TIME') {
        isShowPrepareTimeModal.value = false;
        if (value) {
          form.prepareTime = value;
          _requestDeliveryPossible();
        }
      }

      if (type === 'STORE_DROP_EXPECTED_TIME') {
        isShowStoreDropExpectedTimeModal.value = false;
        if (value) {
          form.storeDropExpectedTime = value;
        }
      }
    };
    watch(() => form.isUntact, _requestDeliveryPossible);

    const closeLayer = () => {
      isShowPrepareTimeModal.value = false;
      isShowStoreDropExpectedTimeModal.value = false;
    };

    const isNeedAcceptOrder = computed(() => isNeedAccept(props.order));
    const isForOrder = computed(() => props.order.orderType === ORDER_TYPE.FOR_ORDER);

    const isOrderChanged = ref(false);
    const {
      doAcceptOrder,
      doUpdateOrderStoreDropExpectedAt,
      doPrepareOrderForNotification,
      isSuccess: isAsyncOrderRequestSuccess,
    } = useOrderAsync();
    const handleRequestDelivery = async (deliveryType) => {
      common.setIsOverlayLoading(true);
      const _order = props.order;
      const mainDelivery = getMainDelivery(_order);
      if (isNeedAcceptOrder.value) {
        if (mainDelivery) {
          await doUpdateOrderStoreDropExpectedAt({
            orderId: _order.orderId,
            storeDropExpectedAt: common.systemTimestamp + (form.storeDropExpectedTime * oneMinute),
          });
        } else {
          // 주문 수락
          await doAcceptOrder({
            orderId: _order.orderId,
            storeDropExpectedAt: common.systemTimestamp + (form.storeDropExpectedTime * oneMinute),
          });
        }
        if (!isAsyncOrderRequestSuccess.value) {
          common.setIsOverlayLoading(false);
          return;
        }
        isOrderChanged.value = true;
      }
      if (props.action?.type === 'ChangeToAgencyDelivery') {
        await doCancelDelivery({
          deliveryId: mainDelivery.deliveryId,
          cancelType: 'CANCEL_BY_STORE',
        }, t('errors.cancelDelivery.CHANGE_DELIVERY_FAILED'));
        if (!isAsyncDeliveryRequestSuccess.value) {
          common.setIsOverlayLoading(false);
          return;
        }
        isOrderChanged.value = true;
      }
      // 종결된 배달 재요청
      // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 요청합니다.
      let pickupMinute = form.prepareTime;
      if (pickupMinute <= 0) {
        pickupMinute = 5;
      }
      if (mainDelivery) {
        // 종결된 배달 재요청
        const payload = {
          orderId: _order.orderId,
          deliveryId: mainDelivery.deliveryId,
          deliveryType,
          pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
          isUntact: form.isUntact,
        };
        await doReRequestDelivery(payload, _order);
        // 주문 상품 준비 완료 알림
        if (_order.orderPreparedNotificationHistories.length > 0) {
          await doPrepareOrderForNotification({
            orderId: _order.orderId,
          });
        }
      } else {
        // 배달 요청
        const payload = {
          orderId: _order.orderId,
          deliveryType,
          pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
          isUntact: form.isUntact,
        };
        await doRequestDelivery(payload, _order);
      }

      isOrderChanged.value = true;
      common.setIsOverlayLoading(false);
      emit('close-layer', true);
    };

    const isUntactEnable = computed(() =>
      props.order.orderType === ORDER_TYPE.ACCEPTED_ORDER
      || props.order.orderType === ORDER_TYPE.STORE_ORDER);
    const isUntactVisible = computed(() =>
      (isUntactEnable.value && getPaymentMethod(props.order) === PAYMENT_METHOD.PREPAID)
      || (props.order.orderType === ORDER_TYPE.FOR_ORDER && props.order.isUntact === true));
    return {
      isNeedAcceptOrder,
      isForOrder,
      prepareTimeValue: computed(() => t('common.layer.requestDelivery.label.prepareTimeOption', { value: form.prepareTime })),
      prepareTimeOptions,
      isShowPrepareTimeModal,
      storeDropExpectedTimeValue: computed(() => t('common.layer.requestDelivery.label.storeDropExpectedTimeOption', { value: form.storeDropExpectedTime })),
      storeDropExpectedTimeOptions,
      isShowStoreDropExpectedTimeModal,
      handleSetData,
      form,
      deliveryPossibleInfo,
      closeLayer,
      isOrderChanged,
      handleRequestDelivery,
      emit,
      isUntactVisible,
      isUntactEnable,
    };
  },
});
</script>

<style lang="scss" scoped>
.checkbox {
  margin-left: -1rem;
}
</style>
