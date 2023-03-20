<template>
  <VMain>
    <VRow class="flex-column pa-4" no-gutters>
      <VCol class="d-flex justify-center">
        <StoreBarogo />
      </VCol>
      <VCol class="mt-4 d-flex justify-center">
        <StoreO2O />
      </VCol>
    </VRow>
  </VMain>
</template>

<script>
import { defineComponent } from 'vue';

import StoreBarogo from '@/components/transfer/barogo/StoreBarogo.vue';
import StoreO2O from '@/components/transfer/o2o/StoreO2O.vue';

export default defineComponent({
  name: 'TransferIntroView',
  components: {
    StoreBarogo,
    StoreO2O,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/main.scss';
</style>
