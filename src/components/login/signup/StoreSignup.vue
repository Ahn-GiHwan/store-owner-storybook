<template>
  <VForm ref="formValid">
    <VRow no-gutters class="flex-column">
      <VCol class="mt-2">
        <StoreTextField
          name="loginId"
          v-model="form.loginId"
          :title="$t('views.signup.inputField.loginId.title')"
          :label="$t('views.signup.inputField.loginId.label')"
          :placeholder="$t('views.signup.inputField.loginId.placeholder')"
          type="text"
          :dark="true"
          :rules="loginIdRule"
          :errorMessages="errorMessage"
          @input="onInput"
          maxlength="20"
          :autofocus="true"
          required
        />
      </VCol>
      <VCol class="mt-4">
        <StoreTextField
          name="password"
          v-model="form.password"
          :title="$t('views.signup.inputField.password.title')"
          :label="$t('views.signup.inputField.password.label')"
          :placeholder="$t('views.signup.inputField.password.placeholder')"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :dark="true"
          :rules="passwordRule"
          maxlength="20"
          required
      /></VCol>
      <VCol class="mt-4">
        <StoreTextField
          name="confirmPassowrd"
          v-model="form.confirmPassowrd"
          :title="$t('views.signup.inputField.confirmPassword.title')"
          :label="$t('views.signup.inputField.confirmPassword.label')"
          :placeholder="$t('views.signup.inputField.confirmPassword.placeholder')"
          variant="outlined"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :appendInnerIcon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :dark="true"
          :rules="[comparePassword]"
          maxlength="20"
          required
      /></VCol>
      <VCol class="mt-4">
        <StoreTextField
          name="phoneNumber"
          v-model="form.phoneNumber"
          :title="$t('views.signup.inputField.phoneNumber.title')"
          :label="$t('views.signup.inputField.phoneNumber.label')"
          :placeholder="$t('views.signup.inputField.phoneNumber.placeholder')"
          variant="outlined"
          type="tel"
          :dark="true"
          :rules="phoneRules.concat(certificationRule)"
          maxlength="13"
          :disabled="isCertificated"
          @input="form.phoneNumber = addHyphenPhoneNumber(form.phoneNumber)"
          :appendOuterCustom="{
            name: $t('views.signup.inputField.phoneNumber.outerCustom'),
            height: 52,
            buttonEvent: startCertification,
          }"
          required
        />
        <div v-if="isCertificated" class="mt-1">
          <VIcon icon="mdi-check-circle" color="green" size="small" />
          {{ $t('views.signup.message.certificationComplete') }}
        </div>
      </VCol>
      <VCol class="mt-8">
        <VRow>
          <VCol>
            <StoreCheckboxAgreement
              name="isAgreeTerms"
              v-model="form.isAgreeTerms"
              label="common.login.agreements.label.required"
              :termsAndPolicies="terms"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <StoreCheckboxAgreement
              name="isAgreePrivacyPolicy"
              v-model="form.isAgreePrivacyPolicy"
              label="common.login.agreements.label.required"
              :termsAndPolicies="policy"
            />
          </VCol>
        </VRow>
        <!-- 맥도날드 버전에서 일단 주석-->
        <!-- <VRow>
          <VCol>
            <StoreCheckboxAgreement
              name="isAgreeMarketingAndAdvertisement"
              v-model="form.isAgreeMarketingAndAdvertisement"
              label="common.login.agreements.label.optional"
              :termsAndPolicies="marketingAndAdvertisement"
            />
          </VCol>
        </VRow> -->
      </VCol>
    </VRow>
  </VForm>
</template>
<script>
import { ref, reactive, computed, watchEffect, watch, defineComponent } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';
import { debounce } from 'lodash';

import { useAuthStore, useCommonStore } from '@/stores';
import Rules from '@/utils/validationRules';
import { addHyphenPhoneNumber } from '@/utils/stringUtils';
import { TERMS_AND_POLICY_TYPE } from '@/constants';

import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreCheckboxAgreement from '@/components/common/StoreCheckboxAgreement.vue';
import useCertification from '@/composables/useCertification';
import useTerms from '@/composables/useTerms';

export default defineComponent({
  name: 'StoreSignup',
  components: {
    StoreTextField,
    StoreCheckboxAgreement,
  },
  emits: ['validation-changed'],
  setup(props, { emit }) {
    const auth = useAuthStore();
    const router = useRouter();
    const common = useCommonStore();
    const { loginIdRule, passwordRule, phoneRules } = Rules;
    const { terms, policy, marketingAndAdvertisement } = useTerms();
    const { t } = useLocale();
    const logger = useLogger();

    const form = reactive({
      loginId: '',
      password: '',
      confirmPassowrd: '',
      phoneNumber: '',
      isAgreeTerms: false,
      isAgreePrivacyPolicy: false,
      isAgreeMarketingAndAdvertisement: false,
    });
    const formValid = ref();
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const errorMessage = ref('');

    const {
      certLoad,
      isCertificated: _isCertificated,
      certVerificationId,
    } = useCertification();
    const isCertificated = computed(() => _isCertificated.value);

    // 비밀번호 확인 rule 추가
    const comparePassword = () =>
      form.password === form.confirmPassowrd || t('views.signup.message.incorrectPassword');

    // 휴대번호 인증완료 확인 rule 추가
    const certificationRule = () =>
      isCertificated.value || t('views.signup.message.certificationTry');

    // 나이스 본인 인증
    const startCertification = () => {
      if (form.phoneNumber) {
        const paylad = {
          phone: form.phoneNumber.replaceAll('-', ''),
        };
        certLoad(paylad);
      }
    };

    // Form validation 확인
    const _checkFormValidation = async () => {
      const isVal = await formValid.value?.items.every((element) => element.isValid);
      emit('validation-changed', true);

      if (isVal && form.isAgreePrivacyPolicy && form.isAgreeTerms) {
        emit('validation-changed', false);
      }
    };

    // 아이디 중복 확인
    const onInput = debounce(async (e) => {
      if (e.target.value.length > 4) {
        try {
          const { isDuplicatedLoginId } = await auth.isDuplicatedLoginId({
            loginId: e.target.value,
          });
          errorMessage.value = isDuplicatedLoginId
            ? t('views.signup.message.duplicatedLoginId')
            : '';
          _checkFormValidation();
        } catch (err) {
          logger.error(err);
        }
      } else {
        errorMessage.value = '';
      }
    }, 500);

    // 회원 등록 요청
    const submitForm = async () => {
      try {
        const { valid } = await formValid.value.validate();

        if (!valid) {
          return;
        }

        const { isAgreeTerms, isAgreePrivacyPolicy, isAgreeMarketingAndAdvertisement } = form;

        const userTermsAgreements = [
          {
            termsAndPolicyType: TERMS_AND_POLICY_TYPE.TERMS,
            isAgree: isAgreeTerms,
          },
          {
            termsAndPolicyType: TERMS_AND_POLICY_TYPE.PRIVACY_POLICY,
            isAgree: isAgreePrivacyPolicy,
          },
          // {
          //   termsAndPolicyType: TERMS_AND_POLICY_TYPE.MARKETING,
          //   isAgree: isAgreeMarketingAndAdvertisement,
          // },
          // {
          //   termsAndPolicyType: TERMS_AND_POLICY_TYPE.ADVERTISEMENT,
          //   isAgree: isAgreeMarketingAndAdvertisement,
          // },
        ];

        const payload = {
          loginId: form.loginId,
          password: form.password,
          confirmPassowrd: form.confirmPassowrd,
          phoneNumber: form.phoneNumber,
          identityVerificationId: certVerificationId.value,
          userTermsAgreements,
        };

        common.setIsOverlayLoading(true);
        await auth.registerUser(payload);
        await auth.loginUserForMobile(payload);
        router.push({ name: 'SignupComplete' });
      } catch (err) {
        common.showToast('error', '회원가입에 실패했습니다.\n다시 시도해주세요.');
      } finally {
        common.setIsOverlayLoading(false);
      }
    };

    // 인증완료 후 휴대번호 validation 체크
    watch(isCertificated, () => {
      const formPhone = formValid.value?.items.find((v) => v.id === 'phoneNumber');
      formPhone.validate();
    });

    // 필수 동의 체크 유효성 체크
    watch(() => ({ ...form }), (newValue, oldValue) => {
      if ((newValue.isAgreeTerms !== oldValue.isAgreeTerms)
        || (oldValue.isAgreePrivacyPolicy !== newValue.isAgreePrivacyPolicy)) {
        _checkFormValidation();
      }
    });

    watchEffect(() => {
      _checkFormValidation();
    });

    return {
      formValid,
      errorMessage,
      loginIdRule,
      passwordRule,
      phoneRules,
      form,
      showPassword,
      showConfirmPassword,
      terms,
      policy,
      marketingAndAdvertisement,
      onInput,
      isCertificated,
      addHyphenPhoneNumber,
      certificationRule,
      startCertification,
      submitForm,
      comparePassword,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
</style>
