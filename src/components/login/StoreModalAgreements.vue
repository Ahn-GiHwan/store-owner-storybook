<template>
  <StoreModal width="280px">
    <template v-slot:header>
      <div class="text-left text-black font-size-16 font-weight-bold  mt-2">
        {{ $t(`common.login.agreements.modal.${
          isMandatoryAgreementRequired ? 'title': 'marketingTitle'}`) }}
      </div>
    </template>
    <template v-slot:content>
      <p class="text-left">
        {{ $t(`common.login.agreements.modal.${
          isMandatoryAgreementRequired ? 'description': 'marketingDescription'}`) }}
      </p>
      <p
        v-if="isMandatoryAgreementRequired"
        class="text-left text-black font-size-12 font-weight-bold mt-6 mb-2"
      >
        {{ $t('common.login.agreements.modal.section.title') }}
      </p>
      <VRow v-if="isMandatoryAgreementRequired">
        <VCol>
          <CheckboxAgreement
            v-model="isAgreeAll"
            label="common.login.agreements.label.agreeAll"
          />
        </VCol>
      </VRow>
      <VDivider v-if="isMandatoryAgreementRequired" class="my-2" />
      <VRow v-if="isMandatoryAgreementRequired" class="mb-1">
        <VCol>
          <CheckboxAgreement
            v-model="isAgreeTerms"
            label="common.login.agreements.label.required"
            :termsAndPolicies="terms"
          />
        </VCol>
      </VRow>
      <VRow v-if="isMandatoryAgreementRequired" class="mb-1">
        <VCol>
          <CheckboxAgreement
            v-model="isAgreePrivacyPolicy"
            label="common.login.agreements.label.required"
            :termsAndPolicies="policy"
          />
        </VCol>
      </VRow>
      <!-- 맥도날드 오픈에는 스펙아웃으로 주석처리 -->
      <!-- <VRow :class="!isMandatoryAgreementRequired && 'mt-2'">
        <VCol>
          <CheckboxAgreement
            v-model="isAgreeMarketingAndAdvertisement"
            label="common.login.agreements.label.optional"
            :termsAndPolicies="marketingAndAdvertisement"
          />
        </VCol>
      </VRow> -->
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-space-between align-baseline mt-2" style="gap: 1rem">
        <StoreButton
          v-if="!isMandatoryAgreementRequired"
          block
          variant="outlined"
          color="#CBCBCB"
          @click.stop="skipAgree()"
        >
          <span class="s-color-gray-75">
            {{ $t('common.login.agreements.modal.button.hideSevenDays') }}
          </span>
        </StoreButton>
        <StoreButton
          block
          @click.stop="updateAgree()"
          :disabled="isMandatoryAgreementRequired
            ? (!isAgreeTerms || !isAgreePrivacyPolicy)
            : !isAgreeMarketingAndAdvertisement"
        >
          {{ $t('common.button.complete') }}
        </StoreButton>
      </div>
    </template>
  </StoreModal>
</template>

<script setup name="StoreModalAgreements">
import { computed, ref, watch } from 'vue';
import { useLogger } from 'vue-logger-plugin';
import { useLocale } from 'vuetify';

import { useAuthStore, useCommonStore } from '@/stores';
import { TERMS_AND_POLICY_TYPE } from '@/constants';
import { getAgreementStatus } from '@/utils/userUtils';
import useTerms from '@/composables/useTerms';

import StoreModal from '@/components/common/StoreModal.vue';
import CheckboxAgreement from '@/components/common/StoreCheckboxAgreement.vue';
import StoreButton from '@/components/common/StoreButton.vue';

const emits = defineEmits(['goto-main']);
const logger = useLogger();
const { t } = useLocale();
const { terms, policy/* , marketingAndAdvertisement */ } = useTerms();
const auth = useAuthStore();
const common = useCommonStore();
const { status: agreementsentStatus } =
      getAgreementStatus(auth.currentUser.userTermsAgreements, common.systemTimestamp);

const isAgreeAll = ref(false);
const isAgreeTerms = ref(!agreementsentStatus.isAgreeTermsRequired);
const isAgreePrivacyPolicy = ref(!agreementsentStatus.isAgreePrivacyPolicyRequired);
const isAgreeMarketingAndAdvertisement = ref(false);
const isMandatoryAgreementRequired = computed(() => agreementsentStatus.isAgreeTermsRequired
        && agreementsentStatus.isAgreePrivacyPolicyRequired);

watch(isAgreeAll, (newValue) => {
  if (newValue) {
    isAgreeTerms.value = newValue;
    isAgreePrivacyPolicy.value = newValue;
    // 스펙아웃 주석처리
    // isAgreeMarketingAndAdvertisement.value = newValue;
  }
});

// 필수 동의 모두 선택 후 1개라도 선택 해제시 토스트얼럿 노출
watch(
  () => ({
    isAgreeTerms: isAgreeTerms.value,
    isAgreePrivacyPolicy: isAgreePrivacyPolicy.value,
  }),
  (newValue, oldValue) => {
    if (oldValue.isAgreeTerms !== newValue.isAgreeTerms && !newValue.isAgreeTerms) {
      common.showToast('error', t('common.login.agreements.message.agreementRequired'));
    } else
    if (oldValue.isAgreePrivacyPolicy !== newValue.isAgreePrivacyPolicy
      && !newValue.isAgreePrivacyPolicy) {
      common.showToast('error', t('common.login.agreements.message.agreementRequired'));
    }
  },
);

const setIsAgreeAll = (newValue) => {
  if (!newValue) {
    isAgreeAll.value = false;
  } else if (isAgreeTerms.value
          && isAgreePrivacyPolicy.value
          // 스펙아웃 주석처리
          // && isAgreeMarketingAndAdvertisement.value
  ) {
    isAgreeAll.value = true;
  }
};
watch(isAgreeTerms, setIsAgreeAll);
watch(isAgreePrivacyPolicy, setIsAgreeAll);
// 스펙아웃 주석처리
// watch(isAgreeMarketingAndAdvertisement, setIsAgreeAll);

const updateAgree = async () => {
  const userTermsAgreementsData = [];

  const {
    isAgreeTermsRequired,
    isAgreePrivacyPolicyRequired,
    // isAgreeMarketingRequired,
    // isAgreeAdvertisementRequired,
  } = agreementsentStatus;

  if (isAgreeTermsRequired) {
    userTermsAgreementsData.push({
      termsAndPolicyType: TERMS_AND_POLICY_TYPE.TERMS,
      isAgree: isAgreeTerms.value,
    });
  }
  if (isAgreePrivacyPolicyRequired) {
    userTermsAgreementsData.push({
      termsAndPolicyType: TERMS_AND_POLICY_TYPE.PRIVACY_POLICY,
      isAgree: isAgreePrivacyPolicy.value,
    });
  }

  // if (isAgreeMarketingRequired) {
  //   userTermsAgreementsData.push({
  //     termsAndPolicyType: TERMS_AND_POLICY_TYPE.MARKETING,
  //     isAgree: isAgreeMarketingAndAdvertisement.value,
  //   });
  // }

  // if (isAgreeAdvertisementRequired) {
  //   userTermsAgreementsData.push({
  //     termsAndPolicyType: TERMS_AND_POLICY_TYPE.ADVERTISEMENT,
  //     isAgree: isAgreeMarketingAndAdvertisement.value,
  //   });
  // }

  common.setIsOverlayLoading(true);
  try {
    const { updateUserAgreements } = await auth.updateUserAgreements(userTermsAgreementsData);

    if (updateUserAgreements) {
      await auth.me();
      emits('goto-main');
    }
  } catch (error) {
    logger.error(error);
  } finally {
    common.setIsOverlayLoading(false);
  }
};

const skipAgree = async () => {
  isAgreeMarketingAndAdvertisement.value = false;
  await updateAgree();
};

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
</style>
