<template>
  <VMain class="error-view-container flex-column d-flex justify-center align-center">
    <VRow class="flex-column justify-center align-center">
      <img :src="errorImage" class="error-image" alt="에러 이미지"/>
      <div class="wrap-error-text mt-3">
        <p class="not-found-text">
          {{ $t('views.notFound.message.notFoundPage') }}
        </p>
        <p class="not-found-text">
          {{ $t('views.notFound.message.refreshPage') }}
        </p>
      </div>
      <VBtn color="primary" class="mt-4 pa-0" width="136" @click.once="goMain">
        <span class="font-size-12">{{ $t('views.notFound.moveMainPage') }}</span>
        <VIcon class="ml-1" icon="mdi-cached"></VIcon>
      </VBtn>
    </VRow>
    <p class="help-call-message font-size-12 mb-8">
      <span>{{ $t('views.notFound.message.askHelp') }}</span>
      <a href="tel:02-550-9900"> 02-550-9900</a>
    </p>
  </VMain>
</template>

<script setup name="NotFoundView">
import { useRouter } from 'vue-router';
import errorImage from '@/assets/images/error/delivery_error.png';

const router = useRouter();
const goMain = () => {
  router.push({ name: 'Main' });
};

</script>

<style lang="scss" scoped>
@import '@/styles/layout/main.scss';
@import '@/styles/error.scss';
</style>
