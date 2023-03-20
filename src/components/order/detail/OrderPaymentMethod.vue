<template>
  <VIcon :icon="paymentMethod.icon" />
  <span class="ml-1 font-size-12">{{ paymentMethod.label }}</span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useLocale } from 'vuetify';

import { PAYMENT_METHOD } from '@/constants';
import { getPaymentMethod } from '@/utils/orderUtils';

export default defineComponent({
  name: 'OrderPaymentMethod',
  props: {
    order: {
      type: Object,
    },
  },
  setup(props) {
    const { t } = useLocale();

    const iconLabelSets = {
      [PAYMENT_METHOD.PREPAID]: {
        icon: 'mdi-credit-card-check',
        label: t('common.paymentMethod.PREPAID'),
      },
      [PAYMENT_METHOD.CASH]: {
        icon: 'mdi-cash',
        label: t('common.paymentMethod.CASH'),
      },
      [PAYMENT_METHOD.CARD]: {
        icon: 'mdi-credit-card',
        label: t('common.paymentMethod.CARD'),
      },
      [PAYMENT_METHOD.MIXED_PAYMENT]: {
        icon: 'mdi-credit-card-multiple',
        label: t('common.paymentMethod.MIXED_PAYMENT'),
      },
    };
    return {
      paymentMethod: computed(() => iconLabelSets[getPaymentMethod(props.order)]),
    };
  },
});
</script>

<style lang="scss" scoped>
span {
  vertical-align: middle;
}
</style>
