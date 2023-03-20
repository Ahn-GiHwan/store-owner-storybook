<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
          <StoreFindPasswordContent
              ref="refFindPasswordComponent"
              @validation-changed="onValidationChanged"
            />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom class="mb-4" :error="error" :errorMessage="errorMessage">
    <StoreButton :disabled="isDisabled" block @click.stop="submit">
      {{ $t('views.findPassword.certificationAndChangePassword') }}
    </StoreButton>
  </StoreContentBottom>
</template>

<script>
import { ref, defineComponent, computed } from 'vue';

import StoreFindPasswordContent from '@/components/login/find/StoreFindPasswordContent.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'FindPasswordView',
  components: {
    StoreFindPasswordContent,
    StoreContentBottom,
    StoreButton,
  },
  setup() {
    const refFindPasswordComponent = ref('');

    const isDisabled = ref(true);
    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };
    return {
      refFindPasswordComponent,
      error: computed(() => refFindPasswordComponent.value?.error),
      errorMessage: computed(() => refFindPasswordComponent.value?.errorMessage),
      isDisabled,
      onValidationChanged,
      submit: () => refFindPasswordComponent.value.startCertification(),
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
