<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol>
          <StoreChangePasswordContent
          ref="refChangePasswordComponent"
          @validation-changed="onValidationChanged"
          />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom bottomUp :error="error" :errorMessage="errorMessage">
    <template #bottom-up>
      <StoreButton block @click.stop="changePassword" :disabled="isDisabled">
        {{ $t('views.changePassword.changePassword') }}
      </StoreButton>
    </template>
    <StoreFullDivider />
    <StoreCommonLink :toPathName="'Login'" :linkName="$t('common.gotoLoginPage')" />
  </StoreContentBottom>
</template>
<script>
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores';

import StoreChangePasswordContent from '@/components/login/find/StoreChangePasswordContent.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreFullDivider from '@/components/common/StoreFullDivider.vue';
import StoreCommonLink from '@/components/common/StoreCommonLink.vue';

export default defineComponent({
  name: 'ChangePasswordView',
  components: {
    StoreChangePasswordContent,
    StoreContentBottom,
    StoreButton,
    StoreFullDivider,
    StoreCommonLink,
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();

    const refChangePasswordComponent = ref('');
    const isDisabled = ref(true);
    const isPasswordChangeRequired = computed(
      () => refChangePasswordComponent.value.isPasswordChangeRequired,
    );
    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    const skipChangePassword = () => {
      if (isPasswordChangeRequired.value) {
        auth.skipChangePassword({ loginId: auth.currentUser.loginId });

        if (router.currentRoute.value?.query?.return_url) {
          router.replace({
            path: router.currentRoute.value?.query?.return_url,
            hash: router.currentRoute.value?.hash,
          });
        }
      }
    };
    return {
      isPasswordChangeRequired,
      error: computed(() => refChangePasswordComponent.value?.error),
      errorMessage: computed(() => refChangePasswordComponent.value?.errorMessage),
      refChangePasswordComponent,
      isDisabled,
      onValidationChanged,
      changePassword: () => refChangePasswordComponent.value.changePassword(),
      skipChangePassword,
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
