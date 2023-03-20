<template>
  <VForm ref="formValid" @submit.prevent="startCertification">
    <VRow class="flex-column" no-gutters>
      <VCol> {{ $t('views.findPassword.pageInfo') }} </VCol>
      <VCol class="mt-6">
        <StoreTextField
          ref="loginIds"
          v-model="form.loginId"
          :title="$t('views.findPassword.inputField.loginId.title')"
          :label="$t('views.findPassword.inputField.loginId.label')"
          type="text"
          :dark="true"
          maxlength="20"
          autofocus
          required
        />
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { ref, reactive, defineComponent, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';
import logger from '@/plugins/vueLogger';

import { useAuthStore } from '@/stores';
import Rules from '@/utils/validationRules';

import StoreTextField from '@/components/common/StoreTextField.vue';
import useCertification from '@/composables/useCertification';

export default defineComponent({
  components: {
    StoreTextField,
  },
  name: 'StoreFindPasswordContent',
  setup(props, { emit }) {
    const { t } = useLocale();
    const router = useRouter();
    const auth = useAuthStore();
    const { loginIdRule } = Rules;
    const form = reactive({
      loginId: '',
    });
    const formValid = ref();
    const error = ref(false);
    const errorMessage = ref('');
    const { certLoad, isCertificated: _isCertificated, certError } = useCertification();

    const startCertification = async () => {
      try {
        const paylad = {
          loginId: form.loginId,
        };

        await certLoad(paylad);

        if(certError.value?.code) {
          error.value = true;
          if (certError.value.code === 'INVALID_INPUT') {
            errorMessage.value = t('views.findPassword.message.notFoundLoginId');
            return
          }
          errorMessage.value = t('views.certificationResult.message.occuredUnknownIssue');
        }
      } catch (err) {
        logger.log(err);
      }
    };

    watch(_isCertificated, async (newVal) => {
      if (newVal) {
        await auth.generateTemporaryTokenForMobile(form.loginId);
        router.push({ name: 'ChangePassword' });
      }
    });

    // Form validation 확인
    const _checkFormValidation = async () => {
      emit('validation-changed', true);
      if (form.loginId.length > 5) {
        emit('validation-changed', false);
      }
    };

    watchEffect(() => {
      _checkFormValidation();
    });
    return {
      formValid,
      form,
      error,
      errorMessage,
      loginIdRule,
      startCertification,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';
</style>
