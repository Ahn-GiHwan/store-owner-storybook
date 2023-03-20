<template>
  <StoreModal>
    <template v-slot:header>
      <div class="text-left text-black font-size-16 font-weight-bold mt-2">
        {{ $t('views.orderDetail.deliveryAdditionModal.title') }}
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left px-4 py-3 mb-4 section">
        <span class="d-block text-black font-weight-bold mb-2">
          {{ $t('views.orderDetail.deliveryAdditionModal.deliveryAddition.title') }}
        </span>
        <span class="d-block mb-2">
          {{ $t('views.orderDetail.deliveryAdditionModal.deliveryAddition.description') }}
        </span>
        <StoreButton
          block
          @click.stop="handleDeliveryAddition"
        >
          <span class="font-weight-bold">
            {{ $t('views.orderDetail.deliveryAdditionModal.deliveryAddition.button') }}
          </span>
        </StoreButton>
      </p>
      <p class="text-left px-4 py-3 mb-4 section">
        <span class="d-block text-black font-weight-bold mb-2">
          {{ $t('views.orderDetail.deliveryAdditionModal.reOrder.title') }}
        </span>
        <span class="d-block mb-2">
          {{ $t('views.orderDetail.deliveryAdditionModal.reOrder.description') }}
        </span>
        <StoreButton
          block
          @click.stop="handleReorder"
        >
          <span class="font-weight-bold">
            {{ $t('views.orderDetail.deliveryAdditionModal.reOrder.button') }}
          </span>
        </StoreButton>
      </p>
      <p class="s-color-gray-61">
        {{ $t('views.orderDetail.deliveryAdditionModal.contactCenter') }}
      </p>
    </template>
    <template v-slot:footer>
      <StoreButton
        block
        variant="outlined"
        color="#CBCBCB"
        @click.stop="handleClose"
      >
        <span class="s-color-gray-75">
          {{ $t('common.button.close') }}
        </span>
      </StoreButton>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent } from 'vue';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'DeliveryAdditionModal',
  components: {
    StoreModal,
    StoreButton,
  },
  emits: ['close-modal', 'delivery-addition', 'reorder'],
  setup(props, { emit }) {
    return {
      handleClose: () => {
        emit('close-modal');
      },
      handleDeliveryAddition: () => {
        emit('delivery-addition');
      },
      handleReorder: () => {
        emit('reorder');
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';

.section {
  letter-spacing: -0.1px;
  background-color: #F5F5F5;
  color: #616161;
}
</style>
