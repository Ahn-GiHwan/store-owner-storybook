<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="mb-4">
        <VCol>
          <StoreTransferResultContent
            ref="refTransferResultContentComponent"
            @validation-changed="onValidationChanged"
          />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom class="mb-4">
    <StoreButton block @click.stop="transferToBarogo" :disabled="isDisabled">
      {{ $t('views.transfer.buttonText.startBarogo') }}
    </StoreButton>
  </StoreContentBottom>
</template>

<script>
import { defineComponent, ref } from 'vue';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreTransferResultContent from '@/components/transfer/StoreTransferResultContent.vue';

export default defineComponent({
  name: 'TransferResultView',
  components: {
    StoreContentBottom,
    StoreButton,
    StoreTransferResultContent,
  },
  setup() {
    const isDisabled = ref(true);
    const refTransferResultContentComponent = ref();

    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    return {
      isDisabled,
      onValidationChanged,
      refTransferResultContentComponent,
      transferToBarogo: () => refTransferResultContentComponent.value.sumbitTransfer(),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
.v-main {
  background: white;
}
</style>
