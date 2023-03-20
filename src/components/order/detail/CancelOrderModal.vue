<template>
  <StoreModal v-if="!isConfirmlessCancel">
    <template v-slot:header>
      <div class="d-flex justify-space-between align-start">
        <div class="text-left font-size-16 font-weight-bold mt-2">
          {{ $t('views.orderDetail.cancelOrderModal.title') }}
        </div>
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.cancelOrderModal.description').split('\n')"
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
          @click.stop="handleCancelOrder()"
        >
          {{ $t('views.orderDetail.cancelOrderModal.button.cancelOrder') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { DELIVERY_STATUS, DELIVERY_TYPE, ORDER_TYPE } from '@/constants';
import { useCommonStore } from '@/stores';
import { isOnlyOneDelivery, getMainDelivery } from '@/utils/orderUtils';
import useOrderAsync from '@/composables/useOrderAsync';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'CancelOrderModal',
  components: {
    StoreModal,
    StoreButton,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    const isAgree = ref(false);
    const common = useCommonStore();
    const {
      doCancelOrder,
      isSuccess: isAsyncOrderRequestSuccess,
    } = useOrderAsync();

    const handleCancelOrder = async () => {
      common.setIsOverlayLoading(true);
      const payload = {
        orderId: props.order.orderId,
      };
      await doCancelOrder(payload);
      common.setIsOverlayLoading(false);
      emit('close-modal', isAsyncOrderRequestSuccess.value);
    };

    const isConfirmlessCancel = ref(false);
    if (props.order.orderType === ORDER_TYPE.STORE_ORDER
      && isOnlyOneDelivery(props.order)) {
      const mainDelivery = getMainDelivery(props.order);
      if (!mainDelivery || (
        mainDelivery.deliveryType === DELIVERY_TYPE.SELF
        && mainDelivery.status !== DELIVERY_STATUS.DROP_FINISHED)) {
        isConfirmlessCancel.value = true;
        handleCancelOrder();
      }
    }

    return {
      isAgree,
      handleClose: () => {
        emit('close-modal');
      },
      handleCancelOrder,
      isConfirmlessCancel,
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
