<template>
  <StoreCommonLayer v-bind="{ dialog }" bottom @close="emit('close-layer', isOrderChanged.value)">
    <template #header>
      {{ $t('views.orderDetail.deliveryAdditionLayer.title') }}
    </template>
    <template #content>
      <VForm>
        <VRow class="px-2 pb-2 flex-column text-center" no-gutters>
          <VCol class="text-left">
            {{ $t('views.orderDetail.deliveryAdditionLayer.description') }}
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextField
              name="additionType"
              v-model="additionTypeValue"
              :placeholder="
                $t('views.orderDetail.deliveryAdditionLayer.label.additionTypePlaceholder')"
              :title="$t('views.orderDetail.deliveryAdditionLayer.label.additionType')"
              variant="outlined"
              :dark="true"
              maxlength="30"
              append-inner-icon="mdi-menu-down"
              @click="isShowAdditionTypeModal = true"
              required
            />
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextField
              name="additionReason"
              v-model="form.additionReason"
              :title="$t('views.orderDetail.deliveryAdditionLayer.label.additionReason')"
              variant="outlined"
              :dark="true"
              maxlength="40"
              :disabled="!additionReasonRequired"
              :required="additionReasonRequired"
            />
            <StoreErrorMessageText
              v-if="additionReasonRequired && form.additionReason.length <= 0"
              errorMessage="상세 사유를 1자 이상 40자 이하로 작성해 주세요."
              icon
              class="mt-4"
            />
          </VCol>
          <VCol class="mt-4 text-left">
            <StoreTextField
              name="prepareTime"
              v-model="prepareTimeValue"
              :title="$t('views.orderDetail.deliveryAdditionLayer.label.prepareTime')"
              variant="outlined"
              :dark="true"
              maxlength="30"
              append-inner-icon="mdi-menu-down"
              @click="isShowPrepareTimeModal = true"
              required
              :disabled="!deliveryPossibleInfo"
            />
          </VCol>
          <VCol class="text-left" v-if="isUntactVisible">
            <VCheckbox
              v-model="form.isUntact"
              :label="$t('views.orderDetail.deliveryAdditionLayer.label.untact')"
              color="primary"
              hide-details
              class="checkbox"
              disabled
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
        <VCol class="pa-0 pl-1">
          <StoreButton
            block
            color="primary"
            :disabled="!deliveryPossibleInfo
              || !!deliveryPossibleInfo.error
              || !deliveryPossibleInfo.data.isPossible
              || !form.additionType
              || (additionReasonRequired && !form.additionReason)"
            @click.stop="handleDeliveryAddition"
          >
            <span class="font-weight-bold">
              {{ $t('views.orderDetail.deliveryAdditionLayer.button.requestDelivery') }}
            </span>
          </StoreButton>
        </VCol>
      </div>
    </template>
  </StoreCommonLayer>

  <!--추가 배달 사유 바텀시트-->
  <SelectTranslatedValueBottomSheet
    v-model:visible="isShowAdditionTypeModal"
    :title="$t('views.orderDetail.deliveryAdditionLayer.label.additionType')"
    :description="$t('views.orderDetail.deliveryAdditionLayer.label.description')"
    typeTranslator="common.deliveryAdditionType"
    :valueOptions="additionTypeOptions"
    :selectedValue="form.additionType"
    type="ADDITION_TYPE"
    @set-data="handleSetData"
    @close-layer="closeLayer"
  />

  <!--상품 준비시간 바텀시트-->
  <SelectTranslatedValueBottomSheet
    v-model:visible="isShowPrepareTimeModal"
    :title="$t('views.orderDetail.deliveryAdditionLayer.label.prepareTime')"
    :description="$t('views.orderDetail.deliveryAdditionLayer.riderPreparationTime')"
    translator="views.orderDetail.deliveryAdditionLayer.label.prepareTimeOption"
    :valueOptions="prepareTimeOptions"
    :selectedValue="form.prepareTime"
    type="PREPARE_TIME"
    @set-data="handleSetData"
    @close-layer="closeLayer"
  />
</template>

<script>
import { defineComponent, ref, computed, reactive, watch, onBeforeMount } from 'vue';
import { useLocale } from 'vuetify';

import { DELIVERY_ADDITION_TYPE } from '@/constants';
import { useAuthStore, useCommonStore } from '@/stores';
import { createPrepareTime } from '@/utils/orderUtils';
import useDeliveryAsync from '@/composables/useDeliveryAsync';
import { oneMinute } from '@/utils/dateUtils';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import SelectTranslatedValueBottomSheet from '@/components/order/common/SelectTranslatedValueBottomSheet.vue';
import StorePickupExpected from '@/components/order/common/StorePickupExpected.vue';
import StoreOrderDeliveryInfo from '@/components/order/common/StoreOrderDeliveryInfo.vue';

export default defineComponent({
  components: {
    StoreCommonLayer,
    StoreTextField,
    StoreErrorMessageText,
    StoreButton,
    SelectTranslatedValueBottomSheet,
    StorePickupExpected,
    StoreOrderDeliveryInfo,
  },
  name: 'DeliveryAdditionLayer',
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

    const isShowAdditionTypeModal = ref(false);

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
      additionType: '',
      isUntact: props.order.isUntact,
      additionReason: '',
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

    const {
      doRequestDeliveryAddition,
      doDeliveryPossible,
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
        isUntact: _order.isUntact,
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
      _requestDeliveryPossible();
    });

    watch(() => form.additionType, (newValue) => {
      if (newValue !== DELIVERY_ADDITION_TYPE.ETC) {
        form.additionReason = '';
      }
    });

    const handleSetData = ({ type, value }) => {
      if (type === 'ADDITION_TYPE') {
        isShowAdditionTypeModal.value = false;
        if (value) {
          form.additionType = value;
        }
      }
      if (type === 'PREPARE_TIME') {
        isShowPrepareTimeModal.value = false;
        if (value) {
          form.prepareTime = value;
          _requestDeliveryPossible();
        }
      }
    };

    const closeLayer = () => {
      isShowAdditionTypeModal.value = false;
      isShowPrepareTimeModal.value = false;
    };

    const isOrderChanged = ref(false);
    const handleDeliveryAddition = async () => {
      common.setIsOverlayLoading(true);
      const _order = props.order;
      // 배달 추가
      // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 요청합니다.
      let pickupMinute = form.prepareTime;
      if (pickupMinute <= 0) {
        pickupMinute = 5;
      }

      const payload = {
        orderId: _order.orderId,
        pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
        additionType: form.additionType,
        additionReason: form.additionReason,
      };
      await doRequestDeliveryAddition(payload, _order);

      common.setIsOverlayLoading(false);
      if (isAsyncDeliveryRequestSuccess.value) {
        isOrderChanged.value = true;
        emit('close-layer', true);
      }
    };

    const isUntactVisible = computed(() => props.order.isUntact);
    return {
      additionTypeValue: computed(() => (form.additionType ? t(`common.deliveryAdditionType.${form.additionType}`) : '')),
      additionTypeOptions: Object.values(DELIVERY_ADDITION_TYPE),
      isShowAdditionTypeModal,
      additionReasonRequired: computed(() => form.additionType === DELIVERY_ADDITION_TYPE.ETC),
      prepareTimeValue: computed(() => t('views.orderDetail.deliveryAdditionLayer.label.prepareTimeOption', { value: form.prepareTime })),
      prepareTimeOptions,
      isShowPrepareTimeModal,
      handleSetData,
      form,
      deliveryPossibleInfo,
      closeLayer,
      isOrderChanged,
      handleDeliveryAddition,
      emit,
      isUntactVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.checkbox {
  margin-left: -1rem;
}
</style>
