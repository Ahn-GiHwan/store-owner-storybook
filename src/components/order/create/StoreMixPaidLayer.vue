<template>
  <StoreCommonLayer v-bind="{ dialog }" @close="onCloseLayer">
    <template #header>
      {{ $t('views.createOrder.paymentMethod.mixpaid') }}
    </template>
    <template #content>
      <VRow class="flex-column" no-gutters>
        <VCol>
          <span class="text-left text-black">{{ $t('views.createOrder.mixPayment.title') }}</span>
        </VCol>
        <VCol class="mt-4">
          <VRow no-gutters class="pa-4 amount">
            <VCol class="d-flex align-center justify-space-between">
              <div class="d-inline">
                {{ $t('views.createOrder.inputField.totalPrice.title') }}
                <span v-if="cupDepositPrice > 0" class="font-size-12">
                  {{ `(${$t('views.createOrder.cupDeposit')} ${numberWithCommas(cupDepositPrice)}${
                    $t('common.currency')} ${$t('views.createOrder.cupDepositInclusion')})`}}
                </span>
              </div>
              <span>
                {{ numberWithCommas(totalPrice) }} {{ $t('common.currency') }}
              </span>
            </VCol>
          </VRow>
        </VCol>
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="preparePrice"
            v-model="preparePrice"
            :value="numberWithCommas(preparePrice)"
            :title="$t('views.createOrder.paymentMethod.prepaid')"
            :placeholder="$t('views.createOrder.mixPayment.inputField.preparePrice.placeholder')"
            variant="outlined"
            :dark="true"
            @input="inputHandler"
            autofocus
            required
          />
          <div class="text-right font-size-12">
            {{ $t('views.createOrder.mixPayment.remainingAmount') }}

            <span class="s-color-red-e5 font-size-12"
              >{{ remainPrice < 0 ? '-' : '' }}{{ numberWithCommas(remainPrice) }}</span
            >{{ $t('common.currency') }}
          </div>
        </VCol>
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="creditCardPrice"
            v-model="creditCardPrice"
            :value="numberWithCommas(creditCardPrice)"
            :title="$t('views.createOrder.paymentMethod.card')"
            :placeholder="$t('views.createOrder.mixPayment.inputField.creditCardPrice.placeholder')"
            @input="calculatePrice"
            variant="outlined"
            :dark="true"
            required
        /></VCol>
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="cashPrice"
            v-model="cashPrice"
            :value="numberWithCommas(cashPrice)"
            :title="$t('views.createOrder.paymentMethod.cash')"
            :placeholder="$t('views.createOrder.mixPayment.inputField.cashPrice.placeholder')"
            @input="calculatePrice"
            variant="outlined"
            :dark="true"
            required
          />
        </VCol>
        <VCol class="mt-4"  v-if="errorMessage" >
          <StoreErrorMessageText :errorMessage="errorMessage" icon />
        </VCol>
        <div class="d-flex justify-space-between align-baseline mt-4">
          <VRow no-gutters>
            <VCol class="pr-2">
              <StoreButton block @click.stop="onCloseLayer" variant="outlined" color="grey">
                {{ $t('common.button.close') }}
              </StoreButton>
            </VCol>
            <VCol class="pl-2">
              <StoreButton
                block
                :disabled="isDisabled"
                @click.stop="onSettingData({ preparePrice, creditCardPrice, cashPrice })"
              >
                {{ $t('common.button.modifyCompleted') }}
              </StoreButton>
            </VCol>
          </VRow>
        </div>
      </VRow>
    </template>
  </StoreCommonLayer>
</template>

<script setup name="StoreMixPaidLayer">
import { ref, computed, watch } from 'vue';
import { useLocale } from 'vuetify';

import { useCommonStore } from '@/stores';
import { numberWithCommas, stringToNumber } from '@/utils/stringUtils';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import StoreErrorMessageText from '@/components/common/StoreErrorMessageText.vue';

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  actualPayPrice: {
    type: String,
    required: true,
  },
  paymentCardPrice: {
    type: String,
    required: true,
  },
  paymentCashPrice: {
    type: String,
    required: true,
  },
  prepaidPrice: {
    type: String,
    required: true,
  },
  cupDepositPrice: {
    type: Number,
  },
});

const emits = defineEmits(['close-layer', 'set-data']);

const { t } = useLocale();
const commonStore = useCommonStore();

const totalPrice = computed(() => stringToNumber(props.actualPayPrice));
const _prepaidPrice = computed(() => props.prepaidPrice);
const _paymentCardPrice = computed(() => props.paymentCardPrice);
const _paymentCashPrice = computed(() => props.paymentCashPrice);
const preparePrice = ref('');
const creditCardPrice = ref('');
const cashPrice = ref('');
const isDisabled = ref(true);

const onCloseLayer = () => {
  emits('close-layer');
};

watch(() => props.dialog, () => {
  preparePrice.value = _prepaidPrice.value;
  creditCardPrice.value = _paymentCardPrice.value;
  cashPrice.value = _paymentCashPrice.value;
});

const calculateTotalPrice = computed(
  () =>
    totalPrice.value -
        stringToNumber(preparePrice.value) -
        stringToNumber(creditCardPrice.value) -
        stringToNumber(cashPrice.value),
);
const remainPrice = computed(() => totalPrice.value - stringToNumber(preparePrice.value));
const errorMessage = computed(() => {
  if (preparePrice.value !== '' && calculateTotalPrice.value !== 0) {
    return t('views.createOrder.mixPayment.priceNotMatch');
  }

  return false;
});
const onSettingData = (value) => {
  // 컵 보증금이 있을때 총 결제금액은 전액 선결제로 결제불가 (actualPayPrice === 선결제)
  if (remainPrice.value === 0) {
    commonStore.showToast('error', `${t('views.createOrder.mixPayment.toastMessage.notPrepaid')}`);
    return;
  }
  if (stringToNumber(creditCardPrice.value) < props.cupDepositPrice
  && stringToNumber(cashPrice.value) < props.cupDepositPrice) {
    commonStore.showToast('error', `${t('views.createOrder.mixPayment.toastMessage.notDivisible', { price: numberWithCommas(props.cupDepositPrice) })}`);
    return;
  }
  emits('set-data', { type: 'PAYMENT', value });
};

const inputHandler = () => {
  creditCardPrice.value = '';
  cashPrice.value = '';
};

const calculatePrice = (e) => {
  const inputValue = stringToNumber(e.target.value);
  const calculateResultPrice =
        remainPrice.value - inputValue > 0 ? remainPrice.value - inputValue : 0;

  if (e.target.name === 'cashPrice') {
    creditCardPrice.value = calculateResultPrice;
  }
  if (e.target.name === 'creditCardPrice') {
    cashPrice.value = calculateResultPrice;
  }
};

watch(calculateTotalPrice, (newVal) => {
  if (newVal !== 0) {
    isDisabled.value = true;
  } else {
    isDisabled.value = false;
  }
});

watch(_prepaidPrice, (newVal) => {
  preparePrice.value = newVal;
});

watch(_paymentCardPrice, (newVal) => {
  creditCardPrice.value = newVal;
});

watch(_paymentCashPrice, (newVal) => {
  cashPrice.value = newVal;
});

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
.amount {
  background: $color-gray-f5;
  border-radius: 4px;
}
</style>
