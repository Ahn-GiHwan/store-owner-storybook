<template>
  <VRow no-gutters class="flex-column">
    <VCol> {{ $t('views.findLoginId.message.confirmLoginId') }} </VCol>
    <VCol class="mt-4">
      <VDivider />
    </VCol>
  </VRow>
  <VRow no-gutters class="flex-column mt-3 mx-2">
    <VCol class="mb-4 mx-3" v-for="(item, index) in getFindLoginList" :key="index">
      <p class="font-size-16">{{ item.loginId }}</p>
      <p class="text-grey font-size-14">
        {{
          item.lastLoginAt
            ? `${$t('views.findLoginId.lastLogin')} ${
              timestampToDateTime(item.lastLoginAt, 'YYYY-MM-DD HH:mm:ss')}`
            : $t('views.findLoginId.notLoginHistory')
        }}
      </p>
    </VCol>
  </VRow>
  <VRow no-gutters class="flex-column">
    <VCol class="mb-2">
      <VDivider />
    </VCol>
  </VRow>
</template>

<script>
import { defineComponent, computed, watch, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores';
import { timestampToDateTime } from '@/utils/dateUtils';

import useCertification from '@/composables/useCertification';

export default defineComponent({
  name: 'StoreFindLoginIdResult',
  components: {},
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const { certLoad, isCertificated: _isCertificated, certVerificationId } = useCertification();
    const isCertificated = computed(() => _isCertificated.value);

    const gotoFindPassword = () => {
      router.replace({ name: 'FindPassword' });
    };

    // 나이스 본인 인증
    const startCertification = () => {
      if (auth.getFindUser?.name) {
        const paylad = {
          phone: auth.getFindUser?.phone,
        };
        certLoad(paylad);
      }
    };

    watch(isCertificated, async (newVal) => {
      if (newVal) {
        const payload = {
          name: auth.getFindUser?.name,
          phone: auth.getFindUser?.phone,
          identityVerificationId: certVerificationId.value,
        };
        await auth.findUnmaskedLoginId(payload);
      }
    });

    onBeforeMount(() => {
      if (auth.getFindLoginList.length === 0) {
        router.replace({ name: 'FindLoginId' });
      }
    });

    return {
      isCertificated,
      getFindLoginList: computed(() => auth.getFindLoginList),
      startCertification,
      gotoFindPassword,
      timestampToDateTime,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/mixins';
</style>
