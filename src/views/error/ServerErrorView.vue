<template>
  <VMain class="error-view-container flex-column d-flex justify-center align-center">
    <VRow class="flex-column justify-center align-center" no-gutters>
      <img :src="errorImage" class="error-image" alt="에러 이미지"/>
      <div class="wrap-error-text mt-3">
        <p class="not-found-text">
          {{ $t('views.notFound.message.occurredError') }}
        </p>
        <p class="not-found-text">
          {{ $t('views.notFound.message.refreshPage') }}
        </p>
      </div>
      <VBtn color="primary" class="mt-4 pa-0" width="136" height="40" @click.once="refreshPage">
        <span class="font-size-12">{{ $t('views.notFound.refreshBtn') }}</span>
        <VIcon class="ml-1" icon="mdi-cached"></VIcon>
      </VBtn>
    </VRow>
  </VMain>
</template>

<script setup name="ServerErrorView">
import { useRouter } from 'vue-router';
import errorImage from '@/assets/images/error/loading_error.png';

const router = useRouter();

const refreshPage = () => {
  router.go();
};

</script>

<style lang="scss" scoped>
@import '@/styles/layout/main.scss';
@import '@/styles/error.scss';
</style>
