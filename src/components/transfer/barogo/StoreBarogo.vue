<template>
  <VCard class="pa-6">
    <p class="barogo-title font-weight-bold font-size-18">
      {{ $t('views.transfer.barogo.subject') }}
    </p>
    <p class="barogo-content mt-3 font-size-14">
      {{ $t('views.transfer.barogo.description') }}
    </p>
    <StoreButton
      block
      class="mt-10 outlined"
      variant="outlined"
      @click.stop="agreement = true"
    >
      <span class="font-weight-bold text-secondary">
        {{ $t('views.transfer.barogo.buttonText') }}
      </span>
    </StoreButton>
  </VCard>
  <StoreCheckAgreementModal v-if="agreement" @close="closeModal" @confirm="connectStore" />
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';

import StoreButton from '@/components/common/StoreButton.vue';
import StoreCheckAgreementModal from '@/components/transfer/barogo/StoreCheckAgreementModal.vue';

export default defineComponent({
  name: 'StoreBarogo',
  components: {
    StoreButton,
    StoreCheckAgreementModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const agreement = ref(false);

    const closeModal = () => {
      agreement.value = false;
    };

    const connectStore = () => {
      agreement.value = false;
      router.push({ name: 'TransferBarogo' });
    };

    const isGoBack = computed(() =>
      String(router.options.history.state.forward).localeCompare(route.path) === 0);

    onBeforeRouteLeave((to, from, next) => {
      // TODO: beforehook 에서 next로 다른 url로 접근하여 여기로 들어오지 않고, 다른 라우트로 이동하고 있음
      // 추후 개선이 필요한 부분임.
      if (isGoBack.value && agreement.value) {
        agreement.value = false;
        next(false);
        return;
      }

      next();
    });

    return {
      agreement,
      connectStore,
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.v-card {
  width: 100%;
  max-width: $breakpoint-tablet;
}
.barogo-title {
  line-height: 2.4rem;
}
.barogo-content {
  white-space: pre-line;
}
</style>
