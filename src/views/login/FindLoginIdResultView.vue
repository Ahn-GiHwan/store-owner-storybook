<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
        <StoreFindLoginIdResult ref="refFindLoginIdComponent" />
      </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom bottomUp>
    <template #bottom-up>
      <VRow no-gutters class="flex-column">
        <VCol class="d-flex justify-center">
        <StoreButton
          v-if="!isCertificated"
          variant="outlined"
          color="#616161"
          class="mb-4 font-weight-bold"
          block
          @click.stop="startCertification"
        >
          {{ $t('views.findLoginId.certificationAndShowLoginId') }}
        </StoreButton>
      </VCol>
      <VCol class="d-flex justify-center">
        <StoreButton block @click.stop="gotoFindPassword">
          {{ $t('views.findLoginId.findPassword') }}
        </StoreButton>
      </VCol>
    </VRow>
    </template>
    <StoreFullDivider />
    <StoreCommonLink :toPathName="'Login'" :linkName="$t('common.gotoLoginPage')" />
  </StoreContentBottom>
</template>
<script>
import { ref, defineComponent, computed } from 'vue';

import StoreFindLoginIdResult from '@/components/login/find/StoreFindLoginIdResult.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreFullDivider from '@/components/common/StoreFullDivider.vue';
import StoreCommonLink from '@/components/common/StoreCommonLink.vue';

export default defineComponent({
  name: 'FindLoginIdResultView',
  components: {
    StoreFindLoginIdResult,
    StoreContentBottom,
    StoreButton,
    StoreFullDivider,
    StoreCommonLink,
  },
  setup() {
    const refFindLoginIdComponent = ref('');

    return {
      refFindLoginIdComponent,
      isCertificated: computed(() => refFindLoginIdComponent.value?.isCertificated),
      gotoFindPassword: () => refFindLoginIdComponent.value.gotoFindPassword(),
      startCertification: () => refFindLoginIdComponent.value.startCertification(),
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
