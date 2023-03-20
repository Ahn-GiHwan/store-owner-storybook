<template>
  <VMain>
    <div class="content">
      <VRow no-gutters class="view-page">
        <VCol md="12">
          <StoreSignup ref="refSignupComponent" @validation-changed="onValidationChanged" />
        </VCol>
      </VRow>
    </div>
  </VMain>

  <StoreContentBottom class="mb-4">
    <StoreButton block @click.stop="submit" :disabled="isDisabled" class="text-center">
      {{ t('views.signup.memberJoin') }}
    </StoreButton>
  </StoreContentBottom>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useDisplay, useLocale } from 'vuetify';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreSignup from '@/components/login/signup/StoreSignup.vue';

export default defineComponent({
  name: 'SignupView',
  components: {
    StoreSignup,
    StoreContentBottom,
    StoreButton,
  },
  setup() {
    const { mobile } = useDisplay();
    const { t } = useLocale();
    const refSignupComponent = ref();
    const isDisabled = ref(true);

    const onValidationChanged = (value) => {
      isDisabled.value = value;
    };

    return {
      mobile,
      t,
      refSignupComponent,
      isDisabled,
      onValidationChanged,
      submit: () => refSignupComponent.value.submitForm(),
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
