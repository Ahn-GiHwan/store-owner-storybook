<template>
  <StoreModal>
    <template v-slot:header>
      {{ $t('views.createOrder.cancelModal.cancelWriting') }}
    </template>
    <template v-slot:content>
      <p class="modal-content">{{ $t('views.createOrder.cancelModal.cancelDescription') }}</p>
    </template>
    <template v-slot:footer>
      <VRow>
        <VCol>
          <StoreButton block class='outlined' variant="outlined" @click="emit('close')">
            <span class="s-color-gray-75">
              {{ $t('views.createOrder.cancelModal.buttonText.close') }}
            </span>
          </StoreButton>
        </VCol>
        <VCol>
          <StoreButton block @click="emit('cancel')">
            {{ $t('views.createOrder.cancelModal.buttonText.cancel') }}
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreModal>
</template>
<script>
import { defineComponent } from 'vue';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'StoreOrderWrittenCancelModal',
  components: {
    StoreModal,
    StoreButton,
  },
  emits: ['close', 'cancel'],
  setup(props, { emit }) {
    return {
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-content {
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 2rem;
  color: #616161;
}
</style>
