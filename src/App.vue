<template>
  <VApp>
    <RouterView name="header" />
    <RouterView />
    <RouterView name="footer" />
  </VApp>
  <!-- TODO : isLoading 을 수정하려는 시도가 일어나는 경우가 있는지 확인이 필요함! -->
  <VOverlay v-model="isLoading" class="align-center justify-center" persistent>
    <VProgressCircular indeterminate size="64" color="primary"></VProgressCircular>
  </VOverlay>

  <StoreToastMessage
    v-model="showToast"
    :message="message"
    :color="color"
    rounded="4"
  />

  <StoreDeliveryStatusModal />
  <StoreAlertMessage />
</template>

<script>
import { computed } from 'vue';
import { useCommonStore } from '@/stores';
import useSocket from '@/composables/useSocket';

import StoreToastMessage from '@/components/common/StoreToastMessage.vue';
import StoreDeliveryStatusModal from '@/components/common/StoreDeliveryStatusModal.vue';
import StoreAlertMessage from '@/components/common/StoreAlertMessage.vue';

export default {
  name: 'App',
  components: { StoreToastMessage, StoreDeliveryStatusModal, StoreAlertMessage },
  setup() {
    const { initSocket } = useSocket();
    initSocket();

    const common = useCommonStore();

    // 오버레이 로딩
    const isLoading = computed({
      get: () => common.$state.isOverlayLoading,
      set: (value) => {
        common.setIsOverlayLoading(value);
      },
    });

    // snackbar(토스트)
    const showToast = computed(() => common.toast.show);
    const message = computed(() => common.toast.message);
    const color = computed(() => common.toast.color);

    return {
      isLoading,
      showToast,
      message,
      color,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/layout/header.scss';
@import '@/styles/layout/main.scss';
</style>
