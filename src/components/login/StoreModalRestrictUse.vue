<template>
  <StoreModal>
    <template v-slot:header>
      이용 제한 되었습니다. <br />휴대폰 본인인증을 진행해 주세요.
    </template>
    <template v-slot:content>
      비밀번호를 5회 이상 잘못 입력하여
      <br />
      이용이 제한되었습니다.
      <br />
      <br />
      인증 절차를 완료해 주세요.
    </template>
    <template v-slot:footer>
      <VRow no-gutters>
        <VCol class="mr-1">
          <StoreButton block variant="outlined" color="primary" @click.stop="closeModal">
            <span class="font-size-lg text-blue">닫기</span>
          </StoreButton>
        </VCol>
        <VCol class="ml-1">
          <StoreButton block color="primary" @click.stop="startCertification">
            <span class="font-size-lg text-white">본인인증</span>
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreModal>
</template>
<script>
import { computed, defineComponent, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import useCertification from '@/composables/useCertification';

import StoreModal from '@/components/common/StoreModal.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'StoreRestrictUseModal',
  components: {
    StoreModal,
    StoreButton,
  },
  emits: ['close'],
  props: {
    loginId: String,
  },
  setup(props, { emit }) {
    const router = useRouter();

    const agreements = reactive({
      isAgreeTerms: false,
      isAgreePrivacyPolicy: false,
    });
    const closeModal = () => {
      emit('close');
    };

    const { certLoad, isCertificated: _isCertificated } = useCertification();
    const isCertificated = computed(() => _isCertificated.value);

    // 나이스 본인 인증
    const startCertification = () => {
      const payload = {
        loginId: props.loginId,
      };
      certLoad(payload);
    };

    watch(isCertificated, () => {
      router.push({ name: 'ChangePassword' });
    });

    return {
      agreements,
      startCertification,
      closeModal,
    };
  },
});
</script>
