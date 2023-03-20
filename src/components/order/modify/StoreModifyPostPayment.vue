<template>
  <StoreCommonLayer v-bind="{ dialog }" @close="emit('close-layer')">
    <template #header>
      {{ $t('views.modifyOrder.modifyPayment.modifyPayment') }}
    </template>
    <template #content>
      <VRow class="flex-column" no-gutters>
        <VCol>
          <span class="text-left text-black">{{
            $t('views.modifyOrder.modifyPayment.canModifyPostPayment')
          }}</span>
        </VCol>
        <!-- 추가 정보 -->
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="additionalInfo"
            :modelValue="additionalInfoStr"
            :title="additionalInfoTitle"
            variant="outlined"
            :disabled="true"
            dark
            autofocus
            required
          />
        </VCol>
        <!-- 선결제 금액 -->
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="prepaidPrice"
            v-model="prepaidPriceInput"
            :value="numberWithCommas(prepaidPriceInput)"
            :title="$t('views.modifyOrder.modifyPayment.prepaidPrice')"
            variant="outlined"
            :disabled="true"
            :dark="true"
            required
        /></VCol>
        <!-- 후불 결제 금액 -->
        <VCol class="mt-4">
          <StoreTextField
            type="tel"
            name="postPayPrice"
            v-model="postPayPriceInput"
            :value="numberWithCommas(postPayPriceInput)"
            :title="postPayPriceTitle"
            @input="inputHandler"
            variant="outlined"
            :dark="true"
            required
          />
          <!-- 할인 금액 등 표기 -->
          <div class="mt-1 text-right s-color-red-e5 font-size-12">
            <span v-if="hasDiscount">
              <!-- n 원 할인 적용-->
              {{ $t('views.modifyOrder.modifyPayment.discountApplied', {
                  discount:
                    `${numberWithCommas(0 - discountPrice)} ${$t('common.currency')}`
                })
              }}
            </span>
            <span v-else-if="isFreeOrder">
              {{ $t('views.modifyOrder.modifyPayment.freeOrder')}}
            </span>
          </div>
        </VCol>
        <!-- 1회용품 보증금 설정 -->
        <VCol
          class="d-flex align-center justify-space-between mt-4"
          v-if="isTaxFreePayPriceApplied"
        >
          {{ $t('views.modifyOrder.modifyPayment.titleTaxFreePayPrice') }}
          <StoreCounter
            v-model:count="cupDepositCount"
            :min-value="0"
            :max-value="100"
            :isDisabled="stringToNumber(postPayPriceInput) === 0"
          />
        </VCol>
        <VCol class="mt-4 pr-2">
          <VRow no-gutters>
            <!-- 후불 결제 방법 선택 -->
            <VCol class="post-paid">
              <span class="text-left font-size-14">
                {{ $t('views.modifyOrder.modifyPayment.postPaidPrice') }}
              </span>
            </VCol>
            <VCol cols="2">
              <StoreButton
                block
                class="pa-4"
                @click="calculatePrices(stringToNumber(postPayPriceInput), 0)"
                :color="stringToNumber(paymentCardPriceInput) > 0 ? 'primary' : 'grey'"
                :variant="isBtnEnabled? 'outlined' : 'tonal'"
              >
                <span :class="stringToNumber(paymentCardPriceInput) > 0 ? 'primary' : 'text-black'">
                  {{ $t('views.modifyOrder.modifyPayment.postPayByCard') }}
                </span>
              </StoreButton>
            </VCol>
            <VCol cols="2">
              <StoreButton
                block
                class="ml-2 pa-4"
                @click="calculatePrices(0, stringToNumber(postPayPriceInput))"
                :color="stringToNumber(paymentCashPriceInput) > 0 ? 'primary' : 'grey'"
                :variant="isBtnEnabled? 'outlined' : 'tonal'"
              >
                <span :class="stringToNumber(paymentCashPriceInput) > 0 ? 'primary' : 'text-black'">
                  {{ $t('views.modifyOrder.modifyPayment.postPayByCash') }}
                </span>
              </StoreButton>
            </VCol>
          </VRow>
        </VCol>
        <!-- 총 결제 금액 표기 -->
        <VCol class="mt-4">
          <VRow no-gutters class="pa-4 amount d-flex justify-space-between align-center">
            <VCol cols="5" class="text-left">
              <div>
                {{ $t('views.createOrder.inputField.totalPrice.title') }}
              </div>
              <div v-if="isTaxFreePayPriceApplied" class="font-size-12">
                {{ $t('views.modifyOrder.modifyPayment.includeTaxFreePayPrice02')}}
              </div>
            </VCol>
            <VCol class="text-right">
              {{ numberWithCommas(actualPayPriceInput) }} {{ $t('common.currency') }}
            </VCol>
          </VRow>
        </VCol>
        <div class="d-flex justify-space-between align-baseline mt-4">
          <VRow no-gutters>
            <VCol class="pr-2">
              <StoreButton
                block
                @click.stop="emit('close-layer')"
                variant="outlined"
                color="primary"
              >
                {{ $t('common.button.close') }}
              </StoreButton>
            </VCol>
            <VCol class="pl-2">
              <StoreButton
                block
                :disabled="isDisabled"
                @click.stop="onSettingData"
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

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useLocale } from 'vuetify';
import _ from 'lodash';
import { numberWithCommas, stringToNumber } from '@/utils/stringUtils';
import {
  getProductPriceExcludeTemporary,
  getTemporaryProduct,
  makeTemporaryProduct,
  getTotalProductPrice,
} from '@/utils/orderUtils';
import { useAuthStore, useCommonStore } from '@/stores';
import { CUP_DEPOSIT } from '@/constants';

import StoreCounter from '@/components/common/StoreCounter.vue';
import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'StoreModifyPostPaymentLayer',
  components: {
    StoreCommonLayer,
    StoreTextField,
    StoreButton,
    StoreCounter,
  },

  props: {
    dialog: {
      type: Boolean,
      default: false,
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
    },
  },
  emits: ['close-layer', 'set-data'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const auth = useAuthStore();
    const common = useCommonStore();

    const additionalInfoTitle = computed(() => {
      if (props.deliveryTipPrice > 0) {
        return t('views.modifyOrder.modifyPayment.deliveryTip');
      }
      return t('views.modifyOrder.modifyPayment.additionalInfo');
    });

    const additionalInfoStr = computed(() => {
      // 배달팁이 있으면 배달팁만 노출
      if (props.deliveryTipPrice > 0) {
        return `${props.deliveryTipPrice} ${t('common.currency')} ${t('views.modifyOrder.modifyPayment.deliveryTip')} ${t('views.modifyOrder.modifyPayment.included')}`;
      }

      // 배달팁이 없고 비과세가 있으면 비과세 노출
      if (props.taxFreePayPrice > 0) {
        return `${props.taxFreePayPrice} ${t('common.currency')} ${t('views.modifyOrder.modifyPayment.taxFreePayPrice')} ${t('views.modifyOrder.modifyPayment.included')}`;
      }

      return t('views.modifyOrder.modifyPayment.none');
    });

    const methodSelected = ref(false);

    const postPayPriceInput = ref('');
    const paymentCardPriceInput = ref('');
    const paymentCashPriceInput = ref('');
    const prepaidPriceInput = ref('');
    const orderProductsInput = ref(null);
    const cupDepositCount = ref(0);

    // postPayPriceInput 값이 있는 경우 결제수단 버튼 활성화 처리
    const isBtnEnabled = computed(() => stringToNumber(postPayPriceInput.value) > 0);

    const hasDiscount = computed(() =>
      props.actualPayPrice - (
        stringToNumber(prepaidPriceInput.value) +
        stringToNumber(postPayPriceInput.value)
      ) > 0 && stringToNumber(prepaidPriceInput.value) +
        stringToNumber(postPayPriceInput.value) > 0);

    const discountPrice = computed(() =>
      props.actualPayPrice - (
        stringToNumber(prepaidPriceInput.value) +
        stringToNumber(postPayPriceInput.value)
      ));

    const isFreeOrder = computed(() =>
      (stringToNumber(prepaidPriceInput.value) +
        stringToNumber(postPayPriceInput.value)) === 0);

    const actualPayPriceInput = computed(
      () => stringToNumber(prepaidPriceInput.value) +
      stringToNumber(paymentCardPriceInput.value) +
      stringToNumber(paymentCashPriceInput.value),
    );

    const isTaxFreePayPriceApplied = computed(() =>
      auth.currentStore?.isTaxFreePayPriceApplied);

    const postPayPriceTitle = computed(() => {
      let title = t('views.modifyOrder.modifyPayment.postPaidPrice');
      if (isTaxFreePayPriceApplied.value) {
        title += t('views.modifyOrder.modifyPayment.includeTaxFreePayPrice01');
      }
      return title;
    });

    const visible = computed(() => props.dialog);
    const orgPaymentCardPrice = computed(() => props.paymentCardPrice);
    const orgPaymentCashPrice = computed(() => props.paymentCashPrice);
    const isDisabled = computed(() => {
      // 원래 결제해야할 금액이 있었으나 무료로 제공하기로 변경하면 무조건 활성화 (isDisabled = false)
      if (props.actualPayPrice > 0 && isFreeOrder.value) {
        return false;
      }
      return (
      // 결제 금액에 변경된 것이 없으면 비활성화
        stringToNumber(paymentCardPriceInput.value) === props.paymentCardPrice &&
        stringToNumber(paymentCashPriceInput.value) === props.paymentCashPrice &&
        cupDepositCount.value * CUP_DEPOSIT === props.taxFreePayPrice
      ) ||
      // 결제 방법이 선택되지 않으면 비활성화
      (
        paymentCardPriceInput.value === '' &&
        paymentCashPriceInput.value === '' &&
        !methodSelected.value
      );
    });

    const onSettingData = () => {
      const products = Array.from(orderProductsInput.value);

      // 임의상품을 제외한 메뉴금액의 총 합을 구합니다.
      const productPrice = getProductPriceExcludeTemporary(products);

      if (actualPayPriceInput.value > productPrice) {
        // 결제 금액보다 상품가가 적은 경우, 임의상품을 추가해 줍니다.
        let tempProduct = getTemporaryProduct(products);
        if (!tempProduct) {
          tempProduct = makeTemporaryProduct();
          products.push(tempProduct);
        }

        tempProduct.unitPrice = actualPayPriceInput.value - productPrice;
        tempProduct.totalPrice = tempProduct.unitPrice;
        tempProduct.quantity = 1;
      } else {
        // 결제 금액보다 상품가가 크거나 같은 경우, 임의상품이 있다면 임의상품을 제거해 줍니다.
        const tempProduct = getTemporaryProduct(products);

        if (tempProduct) {
          const index = products.findIndex((value) => value === tempProduct);
          products.splice(index, 1);
        }
      }

      const value = {
        totalPayPrice: getTotalProductPrice(products),
        actualPayPrice: actualPayPriceInput.value,
        prepaidPrice: stringToNumber(prepaidPriceInput.value),
        paymentCardPrice: stringToNumber(paymentCardPriceInput.value),
        paymentCashPrice: stringToNumber(paymentCashPriceInput.value),
        taxFreePayPrice: cupDepositCount.value * CUP_DEPOSIT,
        orderProducts: [...products],
      };

      emit('set-data', { type: 'POST_PAYMENT', value });
    };

    const inputHandler = () => {
      paymentCardPriceInput.value = '';
      paymentCashPriceInput.value = '';
      methodSelected.value = false;
    };

    const calculatePrices = (card, cash) => {
      paymentCardPriceInput.value = numberWithCommas(card);
      paymentCashPriceInput.value = numberWithCommas(cash);
      methodSelected.value = true;
    };

    // dialog 가 보여질 때 금액정보 다시 채워주기
    watch(visible, (newVal) => {
      if (newVal) {
        paymentCardPriceInput.value = numberWithCommas(props.paymentCardPrice);
        paymentCashPriceInput.value = numberWithCommas(props.paymentCashPrice);
        prepaidPriceInput.value = numberWithCommas(props.prepaidPrice);
        orderProductsInput.value = _.cloneDeep(props.orderProducts);
        cupDepositCount.value = Math.floor(props.taxFreePayPrice / CUP_DEPOSIT);

        postPayPriceInput.value = numberWithCommas(props.paymentCardPrice + props.paymentCashPrice);
      }
    });

    watch(cupDepositCount, (newVal) => {
      if (isTaxFreePayPriceApplied.value) {
        if (newVal * CUP_DEPOSIT > postPayPriceInput.value) {
          common.showToast(
            'error',
            t('views.modifyOrder.modifyPayment.errors.taxFreePayPriceMustBeLessThanPostPayPrice', {
              taxFreePrice: `${numberWithCommas(newVal * CUP_DEPOSIT)} ${t('common.currency')}`,
            }),
          );

          // 원래대로 돌려놓는다.
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

    watch(postPayPriceInput, (newVal, oldVal) => {
      if (
        isTaxFreePayPriceApplied.value &&
        cupDepositCount.value > 0 &&
        stringToNumber(newVal) < cupDepositCount.value * CUP_DEPOSIT
      ) {
        common.showToast(
          'error',
          t('views.modifyOrder.modifyPayment.errors.postPayPriceMustBeGreaterThanTaxFreePayPrice', {
            taxFreePrice: `${numberWithCommas(cupDepositCount.value * CUP_DEPOSIT)} ${t('common.currency')}`,
          }),
        );

        postPayPriceInput.value = oldVal;
      }
    });

    return {
      isBtnEnabled,
      isDisabled,
      additionalInfoTitle,
      additionalInfoStr,
      prepaidPriceInput,
      paymentCardPriceInput,
      paymentCashPriceInput,
      actualPayPriceInput,
      orderProductsInput,
      postPayPriceInput,
      cupDepositCount,
      orgPaymentCardPrice,
      orgPaymentCashPrice,
      postPayPriceTitle,
      hasDiscount,
      discountPrice,
      isFreeOrder,
      isTaxFreePayPriceApplied,
      inputHandler,
      calculatePrices,
      onSettingData,
      stringToNumber,
      numberWithCommas,
      emit,
    };
  },
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
