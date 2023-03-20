<template>
  <StoreModal v-if="isForDelivery && isLastProcessingDelivery && !hasDropFinishedDelivery">
    <template v-slot:header>
      <div class="text-left s-color-red-e5 font-size-16 font-weight-bold mt-2">
        {{ $t('views.orderDetail.cancelDeliveryModal.titleForDelivery') }}
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content s-color-red-e5 mb-4" v-if="isAllocated">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelDeliveryModal.cancelFeeWarning').split('\n')"
          v-bind:key="index"
        >
          <br v-if="index > 0" />
          {{ text }}
        </template>
      </p>
      <p class="text-left content">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelDeliveryModal.descriptionForDelivery').split('\n')"
          v-bind:key="index"
        >
          <br v-if="index > 0" />
          {{ text }}
        </template>
      </p>
      <VRow class="mt-2">
        <VCol class="pa-0">
          <VCheckbox
            v-model="isAgree"
            color="primary"
            hide-details
            label="[필수] 내용을 이해했습니다."
          />
        </VCol>
      </VRow>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-space-between align-baseline mt-2" style="gap: 1rem">
        <StoreButton
          block
          variant="outlined"
          color="#CBCBCB"
          @click.stop="handleClose()"
        >
          <span class="s-color-gray-75">
            {{ $t('common.button.close') }}
          </span>
        </StoreButton>
        <StoreButton
          block
          :disabled="!isAgree"
          @click.stop="handleCancelDelivery"
        >
          {{ $t('views.orderDetail.cancelDeliveryModal.button.cancelDelivery') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
  <StoreModal v-else-if="isMainDelivery">
    <template v-slot:header>
      <div class="d-flex justify-space-between align-start">
        <div class="text-left text-black font-size-16 font-weight-bold mt-2">
          {{ $t('views.orderDetail.cancelDeliveryModal.title') }}
        </div>
        <div class="close-button text-black">
          <VBtn color="default" dark icon="mdi-close" @click="handleClose()"/>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content s-color-red-e5 mb-4" v-if="isAllocated">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelDeliveryModal.cancelFeeWarning').split('\n')"
          v-bind:key="index"
        >
          <br v-if="index > 0" />
          {{ text }}
        </template>
      </p>
      <p class="text-left content">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelDeliveryModal.description').split('\n')"
          v-bind:key="index"
        >
          <br v-if="index > 0" />
          {{ text }}
        </template>
      </p>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-space-between align-baseline mt-2" style="gap: 1rem">
        <StoreButton
          block
          variant="outlined"
          color="#CBCBCB"
          @click.stop="handleCancelDelivery()"
        >
          <span class="s-color-gray-75">
            {{ $t('views.orderDetail.cancelDeliveryModal.button.cancelDeliveryOnly') }}
          </span>
        </StoreButton>
        <StoreButton
          block
          @click.stop="handleChangeToSelfDelivery()"
        >
          {{ $t('views.orderDetail.cancelDeliveryModal.button.changeToSelfDelivery') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
  <StoreModal v-else>
    <template v-slot:header>
      <div class="d-flex justify-space-between align-start">
        <div class="text-left text-black font-size-16 font-weight-bold mt-2">
          {{ $t('views.orderDetail.cancelDeliveryModal.titleForAdditionalDelivery') }}
        </div>
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content s-color-red-e5 mb-4" v-if="isAllocated">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelDeliveryModal.cancelFeeWarning').split('\n')"
          v-bind:key="index"
        >
          <br v-if="index > 0" />
          {{ text }}
        </template>
      </p>
      <p class="text-left content">
        {{ $t('views.orderDetail.cancelDeliveryModal.descriptionForAdditionalDelivery') }}
      </p>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-space-between align-baseline mt-2" style="gap: 1rem">
        <StoreButton
          block
          variant="outlined"
          color="#CBCBCB"
          @click.stop="handleClose()"
        >
          <span class="s-color-gray-75">
            {{ $t('common.button.close') }}
          </span>
        </StoreButton>
        <StoreButton
          block
          @click.stop="handleCancelDelivery"
        >
          {{ $t('views.orderDetail.cancelDeliveryModal.button.cancelDelivery') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useLocale } from 'vuetify';
import { DELIVERY_TYPE, ORDER_TYPE, DELIVERY_STATUS } from '@/constants';
import { useAuthStore, useCommonStore } from '@/stores';
import { getMainDelivery } from '@/utils/orderUtils';
import { oneMinute } from '@/utils/dateUtils';
import useDeliveryAsync from '@/composables/useDeliveryAsync';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'CancelDeliveryModal',
  components: {
    StoreModal,
    StoreButton,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    delivery: {
      type: Object,
      required: true,
    },
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    const isAgree = ref(false);
    const authStore = useAuthStore();
    const common = useCommonStore();
    const { t } = useLocale();
    const { productPrepareTime } = authStore.currentStore;
    const {
      doCancelDelivery,
      doReRequestDelivery,
      isSuccess: isAsyncDeliveryRequestSuccess,
    } = useDeliveryAsync();

    const handleCancelDelivery = async () => {
      common.setIsOverlayLoading(true);
      const payload = {
        deliveryId: props.delivery.deliveryId,
        cancelType: 'CANCEL_BY_STORE',
      };
      await doCancelDelivery(payload, t('errors.cancelDelivery.CANCEL_DELIVERY_FAILED'));
      common.setIsOverlayLoading(false);
      if (isAsyncDeliveryRequestSuccess.value) {
        emit('close-modal', isAsyncDeliveryRequestSuccess.value);
      }
    };

    const handleChangeToSelfDelivery = async () => {
      common.setIsOverlayLoading(true);
      let payload = {
        deliveryId: props.delivery.deliveryId,
        cancelType: 'CANCEL_BY_STORE',
      };
      await doCancelDelivery(payload, t('errors.cancelDelivery.CHANGE_DELIVERY_FAILED'));
      if (isAsyncDeliveryRequestSuccess.value) {
        // 종결된 배달 재요청
        // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 요청합니다.
        let pickupMinute = productPrepareTime;
        if (pickupMinute <= 0) {
          pickupMinute = 5;
        }
        payload = {
          orderId: props.order.orderId,
          deliveryId: props.delivery.deliveryId,
          deliveryType: DELIVERY_TYPE.SELF,
          pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
        };
        await doReRequestDelivery(payload, props.order);
      }
      common.setIsOverlayLoading(false);
      if (isAsyncDeliveryRequestSuccess.value) {
        emit('close-modal', isAsyncDeliveryRequestSuccess.value);
      }
    };

    return {
      isForDelivery: computed(() => props.order.orderType === ORDER_TYPE.FOR_DELIVERY
        || props.order.orderType === ORDER_TYPE.ADMIN_FOR_DELIVERY),
      isLastProcessingDelivery: computed(() => {
        const notClosedDeliveries = props.order.deliveries.filter((d) => ![
          DELIVERY_STATUS.DROP_FINISHED,
          DELIVERY_STATUS.CANCELED,
          DELIVERY_STATUS.REJECTED,
          DELIVERY_STATUS.FAILED,
        ].includes(d.status));
        return notClosedDeliveries.length === 1
          && notClosedDeliveries[0].deliveryId === props.delivery.deliveryId;
      }),
      hasDropFinishedDelivery: computed(() => {
        const dropFinishedDeliveries = props.order.deliveries
          .filter((d) => d.status === DELIVERY_STATUS.DROP_FINISHED);
        return dropFinishedDeliveries.length > 0;
      }),
      isAllocated: computed(() => [
        DELIVERY_STATUS.ALLOCATED,
        DELIVERY_STATUS.ALLOCATION_CHANGED,
        DELIVERY_STATUS.COOK_REQUESTED,
        DELIVERY_STATUS.ARRIVED,
      ].includes(props.delivery.status)),
      isAgree,
      handleClose: () => {
        emit('close-modal');
      },
      handleCancelDelivery,
      handleChangeToSelfDelivery,
      isMainDelivery: computed(() =>
        getMainDelivery(props.order).deliveryId === props.delivery.deliveryId),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';

.close-button {
  margin-top: -1rem;
  margin-right: -1rem;
}
.content {
  letter-spacing: -0.1px;
}
</style>
