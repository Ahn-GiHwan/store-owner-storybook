<template>
  <VMain class="error-view-container flex-column d-flex justify-center align-center">
    <VRow class="flex-column justify-center align-center">
      <img :src="errorImage" class="error-image" alt="에러 이미지"/>
      <div class="wrap-error-text mt-3">
        <p class="not-found-text">
          {{ $t('views.notFound.message.improveSite') }}
        </p>
        <p class="not-found-text">
          {{ $t('views.notFound.message.systemMaintenance') }}
        </p>
      </div>
    </VRow>
    <p class="help-call-message font-size-12 mb-8">
      <span>{{ $t('views.notFound.message.askHelp') }}</span>
      <a href="tel:02-550-9900"> 02-550-9900</a>
    </p>
  </VMain>
</template>

<script setup name="ServerMaintenanceView">
import errorImage from '@/assets/images/error/server_maintenance.png';

</script>

<style lang="scss" scoped>
@import '@/styles/layout/main.scss';
@import '@/styles/error.scss';
</style>
