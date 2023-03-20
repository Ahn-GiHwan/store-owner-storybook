<template>
  <StoreModal>
    <template v-slot:header>
      <span class="text-left text-black font-size-16">{{
        $t('views.transfer.modal.checkStoreInfo')
      }}</span>
    </template>
    <template v-slot:content>
      <p class="text-left">
        {{ $t('views.transfer.modal.checkStoreDescription') }}
      </p>
      <br />
      <VRow>
        <VCol>
          <CheckboxAgreement
            v-model="agreement"
            :label="$t('views.transfer.modal.requireCheckLabel')"
            :title="$t('views.transfer.modal.termsAndConditions')"
          />
        </VCol>
      </VRow>
    </template>
    <template v-slot:footer>
      <VRow class="mt-1" no-gutters>
        <VCol class="pr-1">
          <StoreButton
            block
            class="outlined"
            variant="outlined"
            @click.stop="emit('close')"
          >
            <span class="text-secondary">{{ $t('views.transfer.modal.buttonText.close') }}</span>
          </StoreButton>
        </VCol>
        <VCol class="pl-1">
          <StoreButton block :disabled="!agreement" @click.stop="emit('confirm')">
            {{
              $t('views.transfer.modal.buttonText.confirm')
            }}
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreModal>
</template>

<script>
import { defineComponent, ref } from 'vue';

import StoreModal from '@/components/common/StoreModal.vue';
import CheckboxAgreement from '@/components/common/StoreCheckboxAgreement.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'StoreCheckAgreementModal',
  components: {
    StoreModal,
    CheckboxAgreement,
    StoreButton,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const agreement = ref(false);
    return {
      agreement,
      emit,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
* {
  white-space: pre-line;
}
</style>
