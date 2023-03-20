<template>
  <StoreCommonLayer v-bind="{ dialog }" @close="emits('close-layer')">
    <template #header>
      {{ $t('views.modifyOrder.modifyPayment.modifyPayment') }}
    </template>
    <template #content>
      <VRow class="flex-column" no-gutters>
        <VCol>
          <span class="text-left text-black">{{
            $t('views.modifyOrder.modifyPayment.canModifyAllPayment')
          }}</span>
        </VCol>
        <!-- 결제 금액 -->
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="actualPayPrice"
            v-model="actualPayPriceInput"
            :value="numberWithCommas(actualPayPriceInput)"
            :title="taxPayPriceTitle"
            @input="inputHandler"
            variant="outlined"
            :dark="true"
            required
          />
          <div class="mt-1 text-right font-size-12">
            <!-- 배달팁 적용시 배달팁 정보 표기 -->
            <span class="font-size-12">
              {{ additionalInfoStr }}
            </span>
            <!-- 할인 적용시 할인 금액 표기 -->
            <span v-if="discountPrice > 0" class="s-color-red-e5 font-size-12">
              {{
                ` ${$t('views.modifyOrder.modifyPayment.discountApplied', {
                  discount:
                    `${numberWithCommas(discountPrice)} ${$t('common.currency')}`
                })}`
              }}
            </span>
          </div>
        </VCol>
        <VCol
          class="d-flex align-center justify-space-between mt-4"
          v-if="isTaxFreePayPriceApplied"
        >
          {{ $t('views.modifyOrder.modifyPayment.titleTaxFreePayPrice') }}
          <StoreCounter
            v-model:count="cupDepositCount"
            :min-value="0"
            :max-value="100"
            :isDisabled="stringToNumber(actualPayPriceInput) === 0"
          />
        </VCol>
        <VCol class="mt-4">
          <VRow no-gutters>
            <!-- 후불 카드 버튼 -->
            <VCol class="pr-2" cols="3">
              <StoreButton
                block
                :color="stringToNumber(paymentCardPriceInput) > 0 ? 'primary' : 'grey'"
                :variant="isBtnEnabled ? 'outlined' : 'tonal'"
                @click.stop="changePaymentMethod(PAYMENT_METHOD.CARD)"
              >
                <span :class="stringToNumber(paymentCardPriceInput) > 0 ?
                  'primary' : 'text-black'"
                >
                {{
                  $t('views.modifyOrder.modifyPayment.postPayByCard')
                }}</span>
              </StoreButton>
            </VCol>
            <!-- 후불 현금 버튼 -->
            <VCol class="pr-2" cols="3">
              <StoreButton
                block
                :color="stringToNumber(paymentCashPriceInput) > 0 ? 'primary' : 'grey'"
                :variant="isBtnEnabled ? 'outlined' : 'tonal'"
                @click.stop="changePaymentMethod(PAYMENT_METHOD.CASH)"
              >
                <span
                  :class="stringToNumber(paymentCashPriceInput) > 0 ? 'primary' : 'text-black'"
                >
                {{
                  $t('views.modifyOrder.modifyPayment.postPayByCash')
                }}</span>
              </StoreButton>
            </VCol>
            <!-- 선결제 버튼 -->
            <VCol class="pr-2" cols="3">
              <StoreButton
                block
                :color="stringToNumber(prepaidPriceInput) > 0 ? 'primary' : 'grey'"
                :variant="isBtnEnabled ? 'outlined' : 'tonal'"
                @click.stop="changePaymentMethod(PAYMENT_METHOD.PREPAID)"
              >
                <span :class="stringToNumber(prepaidPriceInput) > 0 ? 'primary' : 'text-black'">{{
                  $t('views.modifyOrder.modifyPayment.prepay')
                }}</span>
              </StoreButton>
            </VCol>
            <!-- 복합결제 버튼 -->
            <VCol cols="3">
              <StoreButton
                block
                variant="text"
                :color="stringToNumber(actualPayPriceInput) > 0 ? primaryColor : ''"
                @click.stop="stringToNumber(actualPayPriceInput) > 0 ?
                  (isShowMixPaymentLayer = !isShowMixPaymentLayer) : ''"
              >
                <span
                  class="text-decoration-underline"
                  :class="stringToNumber(actualPayPriceInput.value) === 0 && 's-color-gray-99'"
                  >{{ $t('views.createOrder.paymentMethod.mixpaid') }}</span
                >
            </StoreButton>
            </VCol>
          </VRow>
        </VCol>
        <!-- 총 결제 금액 표기 -->
        <VCol class="mt-4">
          <VRow no-gutters class="pa-4 amount">
            <VCol cols="5" class="text-left"
              >{{ $t('views.createOrder.inputField.totalPrice.title') }}
            </VCol>
            <VCol class="text-right">
              {{ numberWithCommas(actualPayPriceInput) }} {{ $t('common.currency') }}
            </VCol>
          </VRow>
        </VCol>
        <!-- 복합결제시 복합결제 금액 입력 화면 -->
        <VCol v-if="isShowMixPaymentLayer">
          <VRow no-gutters class="flex-column">
            <VCol class="mt-4">
              <!-- 선결제 금액 입력 -->
              <StoreTextField
                type="tel"
                name="prepaidPrice"
                v-model="prepaidPriceInput"
                :value="numberWithCommas(prepaidPriceInput)"
                :title="$t('views.modifyOrder.modifyPayment.prepaidPrice')"
                :placeholder="$t(
                  'views.createOrder.mixPayment.inputField.preparePrice.placeholder')"
                variant="outlined"
                :dark="true"
                autofocus
                required
              />
              <!-- 남은 금액 표기 -->
              <div class="text-right font-size-12">
                {{ $t('views.createOrder.mixPayment.remainingAmount') }}

                <span class="s-color-red-e5 font-size-12"
                  >{{ remainPrice < 0 ? '-' : '' }}{{ numberWithCommas(remainPrice) }}</span
                >{{ $t('common.currency') }}
              </div>
            </VCol>
            <VCol class="mt-4">
              <!-- 후불 카드 금액 입력 -->
              <StoreTextField
                type="tel"
                name="paymentCardPrice"
                v-model="paymentCardPriceInput"
                :value="numberWithCommas(paymentCardPriceInput)"
                :title="$t('views.createOrder.paymentMethod.card')"
                :placeholder="$t(
                  'views.createOrder.mixPayment.inputField.creditCardPrice.placeholder')"
                @input="calculatePrice"
                variant="outlined"
                :dark="true"
                required
            /></VCol>
            <VCol class="mt-4">
              <!-- 후불 현금 금액 입력 -->
              <StoreTextField
                type="tel"
                name="paymentCashPrice"
                v-model="paymentCashPriceInput"
                :value="numberWithCommas(paymentCashPriceInput)"
                :title="$t('views.createOrder.paymentMethod.cash')"
                :placeholder="$t('views.createOrder.mixPayment.inputField.cashPrice.placeholder')"
                @input="calculatePrice"
                variant="outlined"
                :dark="true"
                required
              />
            </VCol>
            <!-- 금액 입력에 대한 오류 메시지 표기 -->
            <VCol class="mt-4" v-if="
                  calculatedTotalPrice > stringToNumber(actualPayPriceInput)">
              <div class="text-right">
                <span class="s-color-red-e5 font-size-12">
                  <VIcon icon="mdi-information-outline" />
                  {{ $t('views.createOrder.mixPayment.priceNotMatch') }}</span
                >
              </div>
            </VCol>
          </VRow>
        </VCol>
        <div class="d-flex justify-space-between align-baseline mt-4">
          <VRow no-gutters>
            <VCol class="pr-2">
              <StoreButton
                block
                @click.stop="emits('close-layer')"
                variant="outlined"
                color="primary"
              >
                {{ $t('common.button.cancel') }}
              </StoreButton>
            </VCol>
            <VCol class="pl-2">
              <StoreButton
                block
                :disabled="isDisabled"
                @click.stop="onSettingData({ prepaidPrice, _paymentCashPrice, _paymentCardPrice })"
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

<script setup name="StoreModifyPayment">
import { ref, computed, watch } from 'vue';
import { useLocale } from 'vuetify';
import _ from 'lodash';

import { numberWithCommas, stringToNumber } from '@/utils/stringUtils';
import {
  getProductPriceExcludeTemporary,
  getTemporaryProduct,
  makeTemporaryProduct,
  getTotalProductPrice,
  getPaymentMethod,
} from '@/utils/orderUtils';
import { PAYMENT_METHOD, CUP_DEPOSIT } from '@/constants';
import { useAuthStore, useCommonStore } from '@/stores';

import StoreCounter from '@/components/common/StoreCounter.vue';
import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreButton from '@/components/common/StoreButton.vue';

import { primaryColor } from '@/styles/_export.module.scss';

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  totalPayPrice: {
    type: Number,
    required: true,
  },
  actualPayPrice: {
    type: Number,
    required: true,
  },
  paymentCardPrice: {
    type: Number,
    required: true,
  },
  paymentCashPrice: {
    type: Number,
    required: true,
  },
  prepaidPrice: {
    type: Number,
    required: true,
  },
  deliveryTipPrice: {
    type: Number,
    required: true,
  },
  taxFreePayPrice: {
    type: Number,
    required: true,
  },
  orderProducts: {
    type: [Array, null],
    required: true,
  } });
const emits = defineEmits(['close-layer', 'set-data']);

const { t } = useLocale();
const auth = useAuthStore();
const common = useCommonStore();

const actualPayPriceInput = ref('');
const prepaidPriceInput = ref('');
const paymentCashPriceInput = ref('');
const paymentCardPriceInput = ref('');

const orderProductsInput = ref(null);
const cupDepositCount = ref(0);

// actualPayPriceInput 값이 있는 경우 결제수단 버튼 활성화 처리
const isBtnEnabled = computed(() => stringToNumber(actualPayPriceInput.value) > 0);

const remainPrice = computed(
  () => stringToNumber(actualPayPriceInput.value) - stringToNumber(prepaidPriceInput.value),
);

const isTaxFreePayPriceApplied = computed(() =>
  auth.currentStore?.isTaxFreePayPriceApplied);

const taxPayPriceTitle = computed(() => {
  let title = t('views.modifyOrder.modifyPayment.paymentPrice');
  if (isTaxFreePayPriceApplied.value) {
    title = `${title} ${t('views.modifyOrder.modifyPayment.includeTaxFreePayPrice01')}`;
  }
  return title;
});

const discountPrice = computed(
  () => props.totalPayPrice - stringToNumber(actualPayPriceInput.value),
);

const additionalInfoStr = computed(() => {
  let str = '';
  if (props.deliveryTipPrice > 0) {
    str +=
          `, ${props.deliveryTipPrice} ${t('common.currency')} ` +
          ` ${t('views.modifyOrder.modifyPayment.deliveryTip')}`;
  }

  if (str.length > 0) {
    str = `${str.slice(2, str.length)} ${t('views.modifyOrder.modifyPayment.included')}`;
  } else {
    str = '';
  }

  return str;
});

const calculatedTotalPrice = computed(() =>
  stringToNumber(prepaidPriceInput.value) +
  stringToNumber(paymentCardPriceInput.value) +
  stringToNumber(paymentCashPriceInput.value));

const visible = computed(() => props.dialog);
const isDisabled = computed(() => stringToNumber(actualPayPriceInput.value) > 0 &&
          calculatedTotalPrice.value !== stringToNumber(actualPayPriceInput.value));

const isShowMixPaymentLayer = ref(false);

const onSettingData = () => {
  const _prepaidPrice = stringToNumber(prepaidPriceInput.value);
  const _actualPayPrice = stringToNumber(actualPayPriceInput.value);
  const _paymentCashPrice = stringToNumber(paymentCashPriceInput.value);
  const _paymentCardPrice = stringToNumber(paymentCardPriceInput.value);
  const _taxFreePayPrice = cupDepositCount.value * CUP_DEPOSIT;

  // 선결제 금액만 존재하는 경우
  if (cupDepositCount.value > 0 && _prepaidPrice === _actualPayPrice) {
    common.showToast(
      'error',
      t('views.modifyOrder.modifyPayment.errors.taxFreePayPriceCannotBePrepaid'),
    );

    return;
  }

  // 1회용 컵 보증금 금액이 메뉴금액보다 큰 경우
  if (_taxFreePayPrice > _actualPayPrice) {
    common.showToast(
      'error',
      t('views.modifyOrder.modifyPayment.errors.taxFreePayPriceMustBeLessThanMenuPrice', {
        taxFreePrice: `${numberWithCommas(_taxFreePayPrice)} ${t('common.currency')}`,
      }),
    );

    return;
  }

  // 후불 결제 금액이 1회용 컵 보증금 금액보다 모두 작은 경우
  if (_taxFreePayPrice > _paymentCashPrice && _taxFreePayPrice > _paymentCardPrice) {
    common.showToast(
      'error',
      t('views.modifyOrder.modifyPayment.errors.postPayPriceMustBeGreaterThanTaxFreePayPrice', {
        taxFreePrice: `${numberWithCommas(_taxFreePayPrice)} ${t('common.currency')}`,
      }),
    );

    return;
  }

  const products = Array.from(orderProductsInput.value);

  // 임의상품을 제외한 메뉴금액의 총 합을 구합니다.
  const productPrice = getProductPriceExcludeTemporary(products);

  if (_actualPayPrice > productPrice) {
    // 결제 금액보다 상품가가 적은 경우, 임의상품을 추가해 줍니다.
    let tempProduct = getTemporaryProduct(products);

    if (!tempProduct) {
      tempProduct = makeTemporaryProduct();
      products.push(tempProduct);
    }

    tempProduct.unitPrice = _actualPayPrice - productPrice;
    tempProduct.totalPrice = tempProduct.unitPrice;
    tempProduct.quantity = 1;
  } else if (products.length > 1) {
    // 결제 금액보다 상품가가 크거나 같은 경우, 임의상품이 있다면 임의상품을 제거해 줍니다.
    // 임의상품이 있더라도 상품이 임의상품 하나밖에 없을 경우에는 제거하지 않음 (제거하면 수정했을 때 products가 빈 배열로 가게 되어 에러 발생)
    const tempProduct = getTemporaryProduct(products);
    if (tempProduct) {
      const index = products.findIndex((value) => value === tempProduct);
      products.splice(index, 1);
    }
  }

  const value = {
    totalPayPrice: getTotalProductPrice(products),
    actualPayPrice: _actualPayPrice,
    prepaidPrice: _prepaidPrice,
    paymentCardPrice: _paymentCardPrice,
    paymentCashPrice: _paymentCashPrice,
    taxFreePayPrice: _taxFreePayPrice,
    orderProducts: [...products],
  };

  emits('set-data', { type: 'PAYMENT', value });
};

const inputHandler = () => {
  prepaidPriceInput.value = '';
  paymentCashPriceInput.value = '';
  paymentCardPriceInput.value = '';
};

const changePaymentMethod = (method) => {
  if (method === PAYMENT_METHOD.PREPAID) {
    prepaidPriceInput.value = actualPayPriceInput.value;
    paymentCardPriceInput.value = '';
    paymentCashPriceInput.value = '';
  } else if (method === PAYMENT_METHOD.CARD) {
    prepaidPriceInput.value = '';
    paymentCardPriceInput.value = actualPayPriceInput.value;
    paymentCashPriceInput.value = '';
  } else if (method === PAYMENT_METHOD.CASH) {
    prepaidPriceInput.value = '';
    paymentCardPriceInput.value = '';
    paymentCashPriceInput.value = actualPayPriceInput.value;
  }
};

const calculatePrice = (event) => {
  const _prepaidPrice = stringToNumber(prepaidPriceInput.value);
  const _paymentCardPrice = stringToNumber(paymentCardPriceInput.value);
  const _paymentCashPrice = stringToNumber(paymentCashPriceInput.value);
  const _actualPayPriceInput = stringToNumber(actualPayPriceInput.value);

  if (event.target.name === 'paymentCardPrice') {
    const remained = _actualPayPriceInput - (_prepaidPrice + _paymentCardPrice);

    if (remained >= 0) {
      paymentCashPriceInput.value = numberWithCommas(remained);
    }
  } else if (event.target.name === 'paymentCashPrice') {
    const remained =
          _actualPayPriceInput - (_prepaidPrice + _paymentCashPrice);

    if (remained >= 0) {
      paymentCardPriceInput.value = numberWithCommas(remained);
    }
  }
};

// dialog 가 보여질 때 금액정보 다시 채워주기
watch(visible, (newVal) => {
  if (newVal) {
    actualPayPriceInput.value = numberWithCommas(props.actualPayPrice);
    prepaidPriceInput.value = numberWithCommas(props.prepaidPrice);
    paymentCardPriceInput.value = numberWithCommas(props.paymentCardPrice);
    paymentCashPriceInput.value = numberWithCommas(props.paymentCashPrice);
    cupDepositCount.value = Math.floor(props.taxFreePayPrice / CUP_DEPOSIT);

    const order = {
      prepaidPrice: props.prepaidPrice,
      paymentCardPrice: props.paymentCardPrice,
      paymentCashPrice: props.paymentCashPrice,
    };

    isShowMixPaymentLayer.value = PAYMENT_METHOD.MIXED_PAYMENT === getPaymentMethod(order);
    orderProductsInput.value = _.cloneDeep(props.orderProducts);
  }
});

watch(cupDepositCount, (newVal) => {
  if (isTaxFreePayPriceApplied.value) {
    const _actualPayPrice = stringToNumber(actualPayPriceInput.value);
    const _paymentCashPrice = stringToNumber(paymentCashPriceInput.value);
    const _paymentCardPrice = stringToNumber(paymentCardPriceInput.value);
    const _taxFreePayPrice = newVal * CUP_DEPOSIT;

    // 1회용품 보증금 금액이 입력한 후불 메뉴금액 보다 큰 경우
    if (newVal * CUP_DEPOSIT > _actualPayPrice) {
      common.showToast(
        'error',
        t('views.modifyOrder.modifyPayment.errors.taxFreePayPriceMustBeLessThanMenuPrice', {
          taxFreePrice: `${numberWithCommas(_taxFreePayPrice)} ${t('common.currency')}`,
        }),
      );

      cupDepositCount.value -= 1;
    } else if (_taxFreePayPrice > _paymentCashPrice && _taxFreePayPrice > _paymentCardPrice) {
      common.showToast(
        'error',
        t('views.modifyOrder.modifyPayment.errors.taxFreePayPriceMustBeLessThanPostPayPrice', {
          taxFreePrice: `${numberWithCommas(_taxFreePayPrice)} ${t('common.currency')}`,
        }),
      );

      cupDepositCount.value -= 1;
    } else if (newVal > 99) {
      common.showToast(
        'error',
        t('views.modifyOrder.modifyPayment.errors.maximumCountOfCupDepositIs99'),
      );

      // 원래대로 돌려놓는다.
      cupDepositCount.value = 99;
    }
  }
});

watch(actualPayPriceInput, (newVal, oldVal) => {
  if (
    isTaxFreePayPriceApplied.value &&
        cupDepositCount.value > 0 &&
        stringToNumber(newVal) < cupDepositCount.value * CUP_DEPOSIT
  ) {
    common.showToast(
      'error',
      t('views.modifyOrder.modifyPayment.errors.menuPriceMustBeGreaterThanTaxFreePayPrice', {
        taxFreePrice: `${numberWithCommas(cupDepositCount.value * CUP_DEPOSIT)} ${t('common.currency')}`,
      }),
    );

    actualPayPriceInput.value = oldVal;
  }
});

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
.amount {
  background: $color-gray-f5;
  border-radius: 4px;
}

.post-paid {
  display: flex;
  align-items: center;
}
</style>
