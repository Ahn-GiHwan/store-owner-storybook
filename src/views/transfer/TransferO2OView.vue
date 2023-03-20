<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
          <StoreO2OContent
            ref="refStoreO2OContentComponent"
            @validation-changed="onValidationChanged"
          />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom
    class="mb-4"
    :error="error"
    :errorMessage="errorMessage"
  >
    <StoreButton block @click.stop="submit" :disabled="isDisabled">
      {{ $t('views.transfer.buttonText.nextStep') }}
    </StoreButton>
  </StoreContentBottom>
</template>

<script>
import { ref, defineComponent, computed } from 'vue';

import StoreO2OContent from '@/components/transfer/o2o/StoreO2OContent.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'TransferO2OView',
  components: {
    StoreO2OContent,
    StoreContentBottom,
    StoreButton,
  },
  setup() {
    const refStoreO2OContentComponent = ref('');
    const error = computed(() => refStoreO2OContentComponent.value?.error);
    const errorMessage = computed(() => refStoreO2OContentComponent.value?.errorMessage);
    const isDisabled = ref(true);

    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    return {
      refStoreO2OContentComponent,
      error,
      errorMessage,
      isDisabled,
      onValidationChanged,
      submit: () => refStoreO2OContentComponent.value.findStore(),
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
