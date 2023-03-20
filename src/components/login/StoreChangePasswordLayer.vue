<template>
  <StoreCommonLayer v-bind="{ dialog }">
    <template #header>
      {{ $t('views.changePassword.changePassword') }}
    </template>
    <template #content>
      <VMain>
        <VForm ref="formValid">
          <VRow class="flex-column">
            <VCol>
              {{ $t('views.changePassword.pageInfo') }}
              {{ $t('views.changePassword.pageCommonInfo') }}
            </VCol>
            <VCol>
              <StoreTextField
                name="password"
                v-model="form.password"
                :title="$t('views.changePassword.inputField.password.title')"
                :label="$t('views.changePassword.inputField.password.label')"
                :placeholder="$t('views.changePassword.inputField.password.placeholder')"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :dark="true"
                maxlength="20"
                :rules="[currentComparePassword]"
                required
              />
            </VCol>
            <VCol>
              <StoreTextField
                name="newPassword"
                v-model="form.newPassword"
                :title="$t('views.changePassword.inputField.newPassword.title')"
                :label="$t('views.changePassword.inputField.newPassword.label')"
                :placeholder="$t('views.changePassword.inputField.newPassword.placeholder')"
                variant="outlined"
                :type="showNewPassword ? 'text' : 'password'"
                @click:append-inner="showNewPassword = !showNewPassword"
                :appendInnerIcon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :dark="true"
                maxlength="20"
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
                :title="`${$t('views.changePassword.inputField.newPassword.title')
                }${$t('views.changePassword.inputField.confirmPassowrd.title')}`"
                variant="outlined"
                :type="showConfirmPassword ? 'text' : 'password'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :appendInnerIcon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :dark="true"
                :rules="passwordRule.concat(comparePassword)"
                maxlength="20"
                required
              />
            </VCol>
          </VRow>
        </VForm>
      </VMain>
      <StoreContentBottom bottomUp>
        <template #bottom-up>
          <StoreButton block @click="changePassword" :disabled="isDisabled">
            {{ $t('views.changePassword.changePassword') }}
          </StoreButton>
        </template>
        <StoreFullDivider />
        <StoreCommonLink
          toPathName=""
          @click.prevent="skipChangePassword"
          :linkName="$t('views.changePassword.nextTimeChangePassword')"
        />
      </StoreContentBottom>
    </template>
  </StoreCommonLayer>
</template>

<script setup name="StoreChangePasswordLayer">
import { ref, reactive, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';
import { useLocale } from 'vuetify';

import { useAuthStore, useCommonStore } from '@/stores';
import Rules from '@/utils/validationRules';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreFullDivider from '@/components/common/StoreFullDivider.vue';
import StoreCommonLink from '@/components/common/StoreCommonLink.vue';

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  currentPassword: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['goto-main']);
const logger = useLogger();
const { t } = useLocale();
const router = useRouter();
const auth = useAuthStore();
const common = useCommonStore();
const { passwordRule } = Rules;

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
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isDisabled = ref(false);
const isPasswordChangeRequired = auth.currentUser?.isPasswordChangeRequired;

// 비밀번호 확인
const currentComparePassword = () =>
  form.password === props.currentPassword || '비밀번호 다름';

// 비밀번호 확인
const comparePassword = () =>
  form.newPassword === form.confirmPassowrd || t('views.changePassword.notMatchPassword');

const changePassword = async () => {
  try {
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

    common.setIsOverlayLoading(true);
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

    common.showToast('success', '비밀번호가 변경되었습니다.');
    router.push({ name: 'Main' });
  } catch (err) {
    common.showToast('error', '비밀번호 변경에 실패했습니다.\n다시 시도해주세요.');
    logger.error(err);
  } finally {
    common.setIsOverlayLoading(false);
  }
};

const skipChangePassword = async () => {
  try {
    common.setIsOverlayLoading(true);
    await auth.skipChangePassword({ loginId: auth.currentUser.loginId });
    await auth.me();
    emits('goto-main');
  } catch (err) {
    common.showToast('error', '알 수 없는 에러가 발생하였습니다.');
    logger.error(err);
  } finally {
    common.setIsOverlayLoading(false);
  }
};

// Form validation 확인
const _checkFormValidation = async () => {
  const isVal = formValid.value?.items.every((element) => element.isValid);
  isDisabled.value = true;

  if (isVal) {
    isDisabled.value = false;
  }
};

watchEffect(() => {
  _checkFormValidation();
});

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
.v-footer {
  overflow: hidden;
}
</style>
