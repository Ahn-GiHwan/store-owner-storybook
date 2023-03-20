<template>
  <VMain>
  <div class="content">
    <VRow no-gutters class="d-flex flex-column ma-4">
      <VCol>
        <VCard flat>
          <VIcon :color="result.color" size="80"> mdi-check </VIcon>
        </VCard>
      </VCol>
      <VCol class="my-4">
        <p :class="['font-size-24 font-weight-bold', result.success ? 'text-primary' : 'text-error']">
          {{ $t('views.certificationResult.certification') }}
          {{
            result.success
              ? $t('views.certificationResult.success')
              : $t('views.certificationResult.fail')
          }}
        </p>
      </VCol>
      <VCol class="result-message">
        <template v-if="result.success">
          <p>{{ $t('views.certificationResult.message.gotoBarogoStore') }}</p>
          <p>{{ $t('views.certificationResult.message.thanksForCertification') }}</p>
        </template>
        <template v-else>
          <p>{{ $t('views.certificationResult.message.isOccuredCertificationIssue') }}</p>
          <p>{{ $t('views.certificationResult.message.contactToHere') }}</p>
        </template>
        <div v-if="!result.success" class="mt-3">
          <span>{{ result.reason }}</span>
        </div>
      </VCol>
    </VRow>
  </div>
  </VMain>

  <StoreContentBottom class="mb-4">
    <StoreButton block @click="completeCertification">
      {{ result.buttonLabel }}
    </StoreButton>
  </StoreContentBottom>
</template>
<script>
import { defineComponent, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from 'vuetify';

import StoreContentBottom from '@/components/common/StoreContentBottom.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'CertificationResultView',
  components: { StoreContentBottom, StoreButton },
  setup() {
    const { t } = useLocale();
    const route = useRoute();
    const result = {
      success: false,
      color: 'error',
      reason:
        route.query.reason === 'invalidPhone'
          ? t('views.certificationResult.message.retryBecauseOfInvalidPhone')
          : t('views.certificationResult.message.occuredUnknownIssue'),
      buttonLabel: t('views.certificationResult.retryCertification'),
    };

    onBeforeMount(() => {
      if (route.query?.status === 'success') {
        result.success = true;
        result.color = 'primary';
        result.buttonLabel = t('views.certificationResult.confirmation');
      }
    });

    const completeCertification = () => {
      window.opener.certificationResultCallback(result.success);
      window.close();
    };

    return {
      result,
      completeCertification,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/button.scss';
.result-message > p {
  font-size: $font-size-lg;
  line-height: 2.4rem;
}
footer {
  max-width: $breakpoint-tablet;
}
</style>
