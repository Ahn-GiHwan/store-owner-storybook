<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
          <StoreFindLoginIdContent
          ref="refFindLoginIdComponent"
          @validation-changed="onValidationChanged"
        />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom bottomUp :error="error" :errorMessage="errorMessage">
    <template #bottom-up>
      <StoreButton block @click.stop="submit" :disabled="isDisabled">
        {{ $t('views.findLoginId.findLoginId') }}
      </StoreButton>
    </template>
    <StoreFullDivider />
    <StoreCommonLink :toPathName="'Login'" :linkName="$t('common.gotoLoginPage')" />
  </StoreContentBottom>
</template>
<script>
import { ref, defineComponent, computed } from 'vue';

import StoreFindLoginIdContent from '@/components/login/find/StoreFindLoginIdContent.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreFullDivider from '@/components/common/StoreFullDivider.vue';
import StoreCommonLink from '@/components/common/StoreCommonLink.vue';

export default defineComponent({
  name: 'FindLoginIdView',
  components: {
    StoreFindLoginIdContent,
    StoreContentBottom,
    StoreButton,
    StoreFullDivider,
    StoreCommonLink,
  },
  setup() {
    const refFindLoginIdComponent = ref('');
    const showPassword = ref(false);
    const isDisabled = ref(true);

    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    return {
      refFindLoginIdComponent,
      error: computed(() => refFindLoginIdComponent.value.error),
      errorMessage: computed(() => refFindLoginIdComponent.value.errorMessage),
      showPassword,
      isDisabled,
      onValidationChanged,
      submit: () => refFindLoginIdComponent.value.findId(),
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
