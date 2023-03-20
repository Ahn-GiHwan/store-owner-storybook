<template>
  <VMain>
    <VContainer fluid class="pa-0">
      <VRow no-gutters>
        <VCol>
          <StoreLoginImage />
        </VCol>
        <VCol class="align-self-center">
          <StoreLogin />
        </VCol>
      </VRow>
  </VContainer>
  </VMain>
</template>

<script>
import { defineComponent } from 'vue';

import StoreLogin from '@/components/login/StoreLogin.vue';
import StoreLoginImage from '@/components/login/StoreLoginImage.vue';

export default defineComponent({
  name: 'LoginView',
  components: {
    StoreLogin,
    StoreLoginImage,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/login';
</style>
