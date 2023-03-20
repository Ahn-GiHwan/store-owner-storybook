<template>
  <span class="text-shades-black">
    {{ phoneNumber }}
  </span>
  <span class="ml-2 font-size-12 s-color-gray-61" v-if="receiverPhoneNumber">
    {{ receiverPhoneNumber }}
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useLocale } from 'vuetify';

import { addHyphenPhoneNumber } from '@/utils/stringUtils';

export default defineComponent({
  name: 'OrderPhoneNumber',
  props: {
    order: {
      type: Object,
    },
  },
  setup(props) {
    const { t } = useLocale();

    const phoneNumber = computed(() => {
      if (props.order.ordererPhone) {
        return addHyphenPhoneNumber(props.order.ordererPhone);
      }
      if (props.order.receiverPhone) {
        return addHyphenPhoneNumber(props.order.receiverPhone);
      }
      return t('views.orderDetail.message.noPhoneNumber');
    });
    const receiverPhoneNumber = computed(() => {
      if (props.order.ordererPhone && props.order.receiverPhone
        && props.order.ordererPhone !== props.order.receiverPhone) {
        return t('views.orderDetail.orderCard.label.receiverPhone', {
          receiverPhoneNumber: addHyphenPhoneNumber(props.order.receiverPhone),
        });
      }
      return null;
    });

    return {
      phoneNumber,
      receiverPhoneNumber,
    };
  },
});
</script>
