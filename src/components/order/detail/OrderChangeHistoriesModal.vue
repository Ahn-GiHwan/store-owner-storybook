<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold mb-2">
        {{ $t('views.orderDetail.orderChangeHistoriesModal.title') }}
      </span>
    </template>
    <template #content>
    </template>
  </StoreBottomSheet>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { useOrderDetailStore } from '@/stores';
import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';

export default defineComponent({
  name: 'OrderChangeHistoriesModal',
  components: {
    StoreBottomSheet,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const orderDetail = useOrderDetailStore();
    const orderChangeHistories = computed(() => orderDetail.getOrderChangeHistories);

    return {
      closeModal: () => {
        emit('close');
      },
      orderChangeHistories,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
