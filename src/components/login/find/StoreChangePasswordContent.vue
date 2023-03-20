<template>
  <VForm ref="formValid">
    <VRow class="flex-column">
      <VCol>
        {{ $t('views.changePassword.pageInfo') }}
        {{ $t('views.changePassword.pageCommonInfo') }}
      </VCol>
      <VCol>
        <StoreTextField
          name="newPassword"
          v-model="form.newPassword"
          :title="$t('views.changePassword.inputField.newPassword.title')"
          :label="$t('views.changePassword.inputField.newPassword.label')"
          :placeholder="$t('views.changePassword.inputField.newPassword.placeholder')"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :dark="true"
          :rules="passwordRule"
          required
        />
      </VCol>
      <VCol>
        <StoreTextField
          name="confirmPassowrd"
          v-model="form.confirmPassowrd"
          :label="$t('views.changePassword.inputField.confirmPassowrd.label')"
          :placeholder="$t('views.changePassword.inputField.confirmPassowrd.placeholder')"
          :title="`${
            $t('views.changePassword.inputField.newPassword.title')
          }${$t('views.changePassword.inputField.confirmPassowrd.title')}`"
          variant="outlined"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :appendInnerIcon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :dark="true"
          :rules="passwordRule.concat(comparePassword)"
          maxlength="30"
          required
        />
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { defineComponent, ref, reactive, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';
import { useLocale } from 'vuetify';

import { useAuthStore, useCommonStore } from '@/stores';

import Rules from '@/utils/validationRules';
import StoreTextField from '@/components/common/StoreTextField.vue';

export default defineComponent({
  name: 'StoreChangePasswordContent',
  components: {
    StoreTextField,
  },
  emits: ['validation-changed'],
  setup(props, { emit }) {
    const logger = useLogger();
    const { t } = useLocale();
    const router = useRouter();
    const auth = useAuthStore();
    const common = useCommonStore();
    const { passwordRule, phoneRules } = Rules;

    const formValid = ref();
    const form = reactive({
      loginId: '',
      password: '',
      newPassword: '',
      confirmPassowrd: '',
    });
    const error = ref(false);
    const errorMessage = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const isPasswordChangeRequired = auth.currentUser?.isPasswordChangeRequired;

    // 비밀번호 확인
    const comparePassword = () =>
      form.newPassword === form.confirmPassowrd || t('views.changePassword.notMatchPassword');

    const changePassword = async () => {
      try {
        common.setIsOverlayLoading(true);
        error.value = false;

        const payload = {
          loginId: auth.currentUser?.loginId || '',
          newPassword: form.newPassword,
        };

        if (isPasswordChangeRequired && form.password === form.newPassword) {
          error.value = true;
          errorMessage.value = t('views.changePassword.needDifferentPassword');
          return;
        }

        if (auth.getCetificationParam?.loginId) {
          payload.loginId = auth.getCetificationParam?.loginId;
          await auth.generateTemporaryTokenForMobile(payload.loginId);
        }

        await auth.changePassword(payload);

        if (router.currentRoute.value?.query?.return_url) {
          router.replace({
            path: router.currentRoute.value?.query?.return_url,
            hash: router.currentRoute.value?.hash,
          });
          return;
        }

        common.showToast('success', '비밀번호가 변경되었습니다.\n변경한 비밀번호로 로그인해주세요.');
        router.push({ name: 'Login' });
      } catch (err) {
        common.showToast('error', '비밀번호가 변경에 실패했습니다.\n다시 시도해주세요.');
        logger.error(err);
      } finally {
        common.setIsOverlayLoading(false);
      }
    };

    // Form validation 확인
    const _checkFormValidation = async () => {
      const isVal = formValid.value?.items.every((element) => element.isValid);
      emit('validation-changed', true);

      if (isVal) {
        emit('validation-changed', false);
      }
    };

    watchEffect(() => {
      _checkFormValidation();
    });

    return {
      formValid,
      error,
      errorMessage,
      passwordRule,
      showPassword,
      showConfirmPassword,
      phoneRules,
      form,
      isPasswordChangeRequired,
      toPath: isPasswordChangeRequired ? { name: 'Main' } : { name: 'Login' },
      changePassword,
      comparePassword,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';
</style>
