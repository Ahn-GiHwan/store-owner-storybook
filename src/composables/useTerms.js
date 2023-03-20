import { ref, onMounted } from 'vue';

import { useAuthStore } from '@/stores';
import { TERMS_AND_POLICY_TYPE } from '@/constants';

const parseBodyTag = (html) => {
  const startBody = html.indexOf('<body');
  const endBody = html.indexOf('</body>') + 7;
  const noneStyle = '<style> ul, ol { list-style:none; } </style>';
  return html.substring(startBody, endBody) + noneStyle;
};

export default function useTerms() {
  const auth = useAuthStore();

  const policy = ref(null);
  const terms = ref(null);
  const marketingAndAdvertisement = ref(null);

  onMounted(async () => {
    const { termsAndPolicies } = await auth.getTermsPolicies();

    terms.value = {
      first: {
        title: 'common.login.agreements.label.terms',
        contents: parseBodyTag(
          termsAndPolicies.find((termsAndPolicy) =>
            termsAndPolicy.termsAndPolicyType === TERMS_AND_POLICY_TYPE.TERMS).contents,
        ),
      },
    };
    policy.value = {
      first: {
        title: 'common.login.agreements.label.privacyPolicy',
        contents: parseBodyTag(
          termsAndPolicies.find((termsAndPolicy) =>
            termsAndPolicy.termsAndPolicyType === TERMS_AND_POLICY_TYPE.PRIVACY_POLICY).contents,
        ),
      },
    };
    marketingAndAdvertisement.value = {
      first: {
        title: 'common.login.agreements.label.marketing',
        contents: parseBodyTag(
          termsAndPolicies.find((termsAndPolicy) =>
            termsAndPolicy.termsAndPolicyType === TERMS_AND_POLICY_TYPE.MARKETING).contents,
        ),
      },
      second: {
        title: 'common.login.agreements.label.advertisement',
        contents: parseBodyTag(
          termsAndPolicies.find((termsAndPolicy) =>
            termsAndPolicy.termsAndPolicyType === TERMS_AND_POLICY_TYPE.ADVERTISEMENT).contents,
        ),
      },
    };
  });

  return {
    terms,
    policy,
    marketingAndAdvertisement,
  };
}
