<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="flex-column view-page">
        <VCol>
          <StoreSignupCompleteTop />
        </VCol>
        <VCol>
          <StoreSignupCompleteContent />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom class="mb-4">
    <StoreButton block @click.stop="connectStore" class="text-center">
      {{ $t('views.signup.startStoreConnection') }}
    </StoreButton>
  </StoreContentBottom>
</template>

<script>
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreSignupCompleteContent from '@/components/login/signup/StoreSignupCompleteContent.vue';
import StoreSignupCompleteTop from '@/components/login/signup/StoreSignupCompleteTop.vue';

export default defineComponent({
  name: 'SignupCompleteView',
  components: {
    StoreContentBottom,
    StoreButton,
    StoreSignupCompleteContent,
    StoreSignupCompleteTop,
  },
  setup() {
    const { mobile } = useDisplay();
    const router = useRouter();

    const connectStore = () => {
      router.push({ name: 'TransferBarogo' });
    };

    return { mobile, connectStore };
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
