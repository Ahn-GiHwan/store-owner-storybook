<template>
  <VContainer class="pa-0">
    <VRow no-gutters class="s-color-black-11 flex-column">
      <p>
        <span>{{ paymentHistory.title }}</span>
        <span class="s-color-primary ml-1">
          {{ paymentHistory.totalQuantity }}
        </span>
        <span>{{ $t('common.unit.case') }}</span>
      </p>
      <p class="font-size-12" v-if="paymentHistory.subtitle">
        {{ paymentHistory.subtitle }}
      </p>
    </VRow>
    <VCard
      v-if="paymentHistory.totalQuantity > 0"
      class="mt-2 payment-information pa-4 d-flex flex-column"
      variant="flat"
      color="grey-lighten-4"
      height="auto"
    >
      <VCardText
        class="pa-0 d-flex flex-column"
        v-for="(paymentInformation, index) in paymentHistory.paymentInformationList"
        :key="index"
      >
        <VRow justify="space-between" no-gutters>
          <VCol class="font-size-12">
            {{ paymentInformation.type }}
          </VCol>
          <VCol
            v-if="paymentInformation.quantity !== -1"
            class="text-right font-size-12" cols="2"
          >
            {{ paymentInformation.quantity }}{{ $t('common.unit.case') }}
          </VCol>
          <VCol class="text-right font-size-12">
            {{ paymentInformation.price }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
        <VRow
          class="payment-information-option"
          v-for="(option, optionIndex) in paymentInformation.options"
          :key="optionIndex"
          justify="space-between"
          no-gutters
        >
          <VCol class="ml-3 font-size-12 font-weight-400 s-color-gray-66">
            ㄴ {{ option.type }}
          </VCol>
          <VCol class="mr-3 font-size-12 font-weight-400 text-right s-color-gray-66" cols="2">
            {{ option.quantity }}{{ $t('common.unit.case') }}
          </VCol>
          <VCol class="font-size-12 font-weight-400 text-right s-color-gray-66">
            {{ option.price }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
      </VCardText>
      <div
        v-if="paymentHistory.additionalPaymentInformationList?.length > 0"
        class="payment-information additional-payment-information pt-2 px-0 pb-0 d-flex flex-column"
      >
        <VCardText
          class="pa-0 d-flex flex-column"
          v-for="(paymentInformation, index) in paymentHistory.additionalPaymentInformationList"
          :key="index"
      >
        <VRow justify="space-between" no-gutters>
          <VCol class="font-size-12">
            {{ paymentInformation.type }}
          </VCol>
          <VCol
            v-if="paymentInformation.quantity !== -1"
            class="text-right font-size-12" cols="2"
          >
            {{ paymentInformation.quantity }}{{ $t('common.unit.case') }}
          </VCol>
          <VCol class="text-right font-size-12">
            {{ paymentInformation.price }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
        <VRow
          class="payment-information-option"
          v-for="(option, optionIndex) in paymentInformation.options"
          :key="optionIndex"
          justify="space-between"
          no-gutters
        >
          <VCol class="ml-3 font-size-12 font-weight-400 s-color-gray-66">
            ㄴ {{ option.type }}
          </VCol>
          <VCol class="mr-3 font-size-12 font-weight-400 text-right s-color-gray-66" cols="2">
            {{ option.quantity }}{{ $t('common.unit.case') }}
          </VCol>
          <VCol class="font-size-12 font-weight-400 text-right s-color-gray-66">
            {{ option.price }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
      </VCardText>
      </div>
      <VCardText
        class="additional-payment-information pt-2 px-0 pb-0 d-flex flex-column"
      >
        <VRow justify="space-between" no-gutters>
          <VCol class="font-size-12">
            {{ $t('common.order.deliveryInfo.sum') }}
          </VCol>
          <VCol class="text-right font-size-12">
            {{ paymentHistory.totalPrice }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
        <VRow
          class="payment-information-option"
          v-for="(option, optionIndex) in paymentHistory.options"
          :key="optionIndex"
          justify="space-between"
          no-gutters
        >
          <VCol class="ml-3 font-size-12 font-weight-400 s-color-gray-66">
            ㄴ {{ option.type }}
          </VCol>
          <VCol class="mr-3 font-size-12 font-weight-400 text-right s-color-gray-66" cols="2">
            {{ option.quantity }}{{ $t('common.unit.case') }}
          </VCol>
          <VCol class="font-size-12 font-weight-400 text-right s-color-gray-66">
            {{ option.price }}{{ $t('common.currency') }}
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup name="PaymentDetailHistory">
defineProps({
  paymentHistory: {
    type: Object,
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.payment-information {
  gap: 8px;
}
.payment-information-option {
  margin-top: 2px;
  font-weight: 400;
}
.additional-payment-information {
  border-top: solid 1px $color-gray-eb;
}
:deep(.v-card .v-card-text) {
  line-height: 1.5rem;
}
:deep(.v-card__underlay) {
    display: none;
  }
</style>
