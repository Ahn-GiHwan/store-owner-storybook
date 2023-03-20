<template>
  <StoreModal>
    <template v-slot:header>
      <div class="text-left s-color-red-e5 font-size-16 font-weight-bold mt-2">
        {{ $t('common.layer.hideOrderModal.title') }}
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content">
        <template
          v-for="(text, index)
            in $t('common.layer.hideOrderModal.description').split('\n')"
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
          @click.stop="handleCancelOrder"
        >
          {{ $t('common.layer.hideOrderModal.button.hideOrder') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useCommonStore } from '@/stores';
import useOrderAsync from '@/composables/useOrderAsync';
import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'HideOrderModal',
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
    const common = useCommonStore();
    const isAgree = ref(false);
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
      emit('close-modal', isAsyncOrderRequestSuccess.value);
      common.setIsOverlayLoading(false);
    };

    return {
      isAgree,
      handleClose: () => {
        emit('close-modal');
      },
      handleCancelOrder,
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
