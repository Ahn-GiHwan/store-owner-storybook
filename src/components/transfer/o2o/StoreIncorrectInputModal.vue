<template>
  <StoreModal>
    <template v-slot:header>
      {{ $t('views.transfer.modal.notFoundMessage') }} <br />
      {{ $t('views.transfer.modal.incorrectInput') }}
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-space-between align-baseline" style="gap: 1rem">
        <VBtn block height="52px" variant="outlined" color="grey" @click="closeModal(false)">
          <span class="font-size-lg text-grey">{{
            $t('views.transfer.modal.buttonText.close')
          }}</span>
        </VBtn>
      </div>
    </template>
  </StoreModal>
</template>
<script>
import { defineComponent } from 'vue';

import StoreModal from '@/components/common/StoreModal.vue';

export default defineComponent({
  components: {
    StoreModal,
  },
  name: 'StoreIncorrectInputModal',
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    return {
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-content {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #616161;
}
</style>
