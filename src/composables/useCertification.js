import { ref } from 'vue';

import { useAuthStore, useErrorsStore, useCommonStore } from '@/stores';

/** nice 본인인증 */
const useCertification = () => {
  const isCertificated = ref(false);
  const certError = ref(null);
  const certVerificationId = ref('');
  const auth = useAuthStore();
  const common = useCommonStore();

  const errors = useErrorsStore();

  const certLoad = async (payload) => {
    try {
      certError.value = null;
      const { requestIdentityVerificationAddress } = await auth.requestCertification(payload);
      const popup = window.open(requestIdentityVerificationAddress.identityVerificationAddress, '', 'width=100%');

      if (popup === null || popup === undefined) {
        common.showToast('error', '사파리 브라우저를 사용하시는 경우 팝업 차단을 해지해 주세요.\n[아이폰 설정 - Safari - 팝업 차단 - 해지]');
        return;
      }

      // 나이스 본인인증 callback
      window.certificationResultCallback = (res) => {
        if (!res) {
          certLoad(payload);
          return;
        }
        isCertificated.value = true;
        certVerificationId.value = requestIdentityVerificationAddress.identityVerificationId;
      };
    } catch (err) {
      certError.value = errors.convertedError;
    }
  };
  return { certError, certLoad, isCertificated, certVerificationId };
};

export default useCertification;
