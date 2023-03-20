<template>
  <StoreModal>
    <template #header>
      <div class="d-flex justify-space-between">
        <span class="s-color-red-e5 font-weight-bold font-size-16">
          {{ $t('views.createOrder.duplicationModal.title') }}
        </span>
        <VIcon color="#424242" @click="$emit('close')">mdi-close</VIcon>
      </div>
    </template>
    <template #content>
      <span class="font-size-14 description">
        {{ $t('views.createOrder.duplicationModal.description') }}
      </span>
    </template>
    <template #footer>
      <div>
        <StoreButton block variant="outlined" color="grey" @click.stop="gotoMainView">
        <span class="s-color-gray-75">
          {{ $t('views.createOrder.duplicationModal.buttonText.gotoDeliveryStatusView') }}
        </span>
      </StoreButton>
      <StoreButton block class="mt-2" @click.stop="gotoOrderDetailView">
        {{ $t('views.createOrder.duplicationModal.buttonText.beforeOrderConfirm') }}
      </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent } from 'vue';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  components: {
    StoreModal,
    StoreButton,
  },
  name: 'StoreOrderDuplicationModal',
  props: {
    orderId: {
      type: Number,
    },
  },
  emits: ['close', 'gotoView'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    const gotoMainView = () => {
      emit('gotoView', { name: 'Main' });
      // TODO: 주문 리스트 화면으로 이동
    };

    const gotoOrderDetailView = () => {
      emit('gotoView', { name: 'OrderDetail', params: { orderId: props.orderId } });
    };

    return {
      closeModal,
      gotoMainView,
      gotoOrderDetailView,
    };
  },
});
</script>

<style lang="scss" scoped>
.description {
  white-space: pre-line;
}
</style>
