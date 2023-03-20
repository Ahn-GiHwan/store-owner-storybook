<template>
  <VCard class="pa-6">
    <p class="o2o-title font-weight-bold font-size-18">
      {{ $t('views.transfer.o2o.subject') }}
    </p>
    <p class="mt-3 font-size-14">
      {{ $t('views.transfer.o2o.description') }}
    </p>
    <StoreButton class="mt-5" block @click="connectStore">
      {{ $t('views.transfer.o2o.buttonText') }}
    </StoreButton>
  </VCard>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'StoreO2O',
  components: {
    StoreButton,
  },
  setup() {
    const router = useRouter();

    const connectStore = () => {
      router.push({ name: 'TransferO2O' });
    };
    return {
      connectStore,
    };
  },
});
</script>

<style lang="scss" scoped>
.v-card {
  width: 100%;
  max-width: $breakpoint-tablet;
}
.o2o-title {
  line-height: 2.4rem;
  white-space: pre-line;
}
</style>
