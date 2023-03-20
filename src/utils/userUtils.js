import { TERMS_AND_POLICY_TYPE } from '@/constants';

const getAgreementStatus = (userTermsAgreements, currentTimestamp) => {
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const isAgreeTermsRequired = !(userTermsAgreements
    .find((v) => v.termsAndPolicyType === TERMS_AND_POLICY_TYPE.TERMS)?.isAgree || false);
  const isAgreePrivacyPolicyRequired = !(userTermsAgreements
    .find((v) => v.termsAndPolicyType === TERMS_AND_POLICY_TYPE.PRIVACY_POLICY)?.isAgree || false);

  const lastMarketingAgreement = userTermsAgreements
    .find((v) => v.termsAndPolicyType === TERMS_AND_POLICY_TYPE.MARKETING
      && (currentTimestamp - v.createdAt < SEVEN_DAYS || v.isAgree));
  const lastAdvertisementAgreement = userTermsAgreements
    .find((v) => v.termsAndPolicyType === TERMS_AND_POLICY_TYPE.ADVERTISEMENT
      && (currentTimestamp - v.createdAt < SEVEN_DAYS || v.isAgree));

  return {
    isAgreementRequired: isAgreeTermsRequired
      || isAgreePrivacyPolicyRequired,
    // || !lastMarketingAgreement
    // || !lastAdvertisementAgreement,
    status: {
      isAgreeTermsRequired,
      isAgreePrivacyPolicyRequired,
      // isAgreeMarketingRequired: !lastMarketingAgreement,
      // isAgreeAdvertisementRequired: !lastAdvertisementAgreement,
    },
  };
};

export {
  getAgreementStatus,
};
