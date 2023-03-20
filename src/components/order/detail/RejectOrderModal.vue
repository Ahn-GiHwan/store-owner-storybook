<template>
  <StoreBottomSheet v-if="!selectedRejectType">
    <template #title>
      <span class="text-left font-size-16 font-weight-bold mb-2">
        {{ $t('views.orderDetail.rejectOrderModal.title') }}
      </span>
    </template>
    <template #content>
      <VRow class="px-2 pb-2 flex-column text-center" no-gutters>
        <VCol class="my-2 text-left">
          {{ $t('views.orderDetail.rejectOrderModal.description') }}
        </VCol>
        <VCol
          class="mt-3"
          v-for="(type, index) in orderRejectTypes"
          :key="index"
        >
          <StoreButton
            block
            variant="outlined"
            :color="selectedRejectType === type ? 'primary' : '#BDBDBD'"
            height="3.6rem"
            @click.stop="selectedRejectType = type"
          >
            <span
              class="font-weight-bold"
              :class="selectedRejectType === type ? 's-color-primary' : 'text-grey-darken-4'"
            >
              {{ $t(`views.orderDetail.rejectOrderModal.label.rejectType.${type}`) }}
            </span>
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreBottomSheet>
  <StoreModal v-else>
    <template v-slot:header>
      <div class="d-flex justify-space-between align-start">
        <div class="text-left font-size-16 font-weight-bold mt-2">
          {{ $t('views.orderDetail.rejectOrderModal.modalTitle') }}
        </div>
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left content">
        <template
          v-for="(text, index)
            in $t('views.orderDetail.rejectOrderModal.modalDescription').split('\n')"
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
          @click.stop="handleRejectOrder"
        >
          {{ $t('views.orderDetail.button.rejectOrder') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useCommonStore } from '@/stores';
import useOrderAsync from '@/composables/useOrderAsync';
import { ORDER_REJECT_TYPE } from '@/constants';
import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  components: {
    StoreBottomSheet,
    StoreButton,
    StoreModal,
  },
  name: 'RejectOrderModal',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    const isAgree = ref(false);
    const common = useCommonStore();
    const selectedRejectType = ref();

    const {
      doRejectOrder,
      isSuccess: isAsyncOrderRequestSuccess,
    } = useOrderAsync();

    const close = (modified) => {
      selectedRejectType.value = undefined;
      emit('close-modal', modified);
    };
    const handleRejectOrder = async () => {
      common.setIsOverlayLoading(true);
      const _order = props.order;
      await doRejectOrder({
        orderId: _order.orderId,
        rejectType: selectedRejectType.value,
      });
      if (!isAsyncOrderRequestSuccess.value) {
        common.setIsOverlayLoading(false);
        return;
      }
      close(true);
    };

    return {
      isAgree,
      handleRejectOrder,
      orderRejectTypes: Object.keys(ORDER_REJECT_TYPE),
      selectedRejectType,
      handleClose: close,
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
