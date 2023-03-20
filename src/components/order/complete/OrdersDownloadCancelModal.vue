<template>
  <StoreModal>
    <template #header>
      <span class="s-color-red-e5 font-weight-bold font-size-16">
        {{ $t('views.orderComplete.OrdersDownloadCancelModal.title') }}
      </span>
    </template>
    <template #content>
      <span class="font-size-12">
        {{ $t('views.orderComplete.OrdersDownloadCancelModal.description') }}
      </span>
    </template>
    <template #footer>
      <div class="d-flex justify-space-between mt-1" style="gap: 1rem">
        <StoreButton block variant="outlined" color="grey" @click="closeModal(false)">
          <span class="s-color-gray-75">
            {{ $t('views.orderComplete.OrdersDownloadCancelModal.button.continueDownload') }}
          </span>
        </StoreButton>
        <StoreButton block @click="closeModal(true)">
          {{ $t('views.orderComplete.OrdersDownloadCancelModal.button.cancelDownload') }}
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
  name: 'OrdersDownloadCancelModal',
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = (isCancel) => {
      emit('close', isCancel);
    };

    return {
      closeModal,
    };
  },
});

</script>
