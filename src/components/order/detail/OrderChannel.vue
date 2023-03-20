<template>
  <div class="d-flex align-center">
    <OrderAgencyIcon :orderAgencyId="appropriateOrderChannel" />
    <span
      class="ml-1"
      :class="getOrderAgencyNameFontColor"
    >
      {{ appropriateOrderAgencyName }}
    </span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useLocale } from 'vuetify';

import { ORDER_CHANNEL } from '@/constants/type';
import { preDefinedOrderChannels } from '@/utils/orderUtils';
import OrderAgencyIcon from '@/components/common/OrderAgencyIcon.vue';

export default defineComponent({
  name: 'OrderChannel',
  components: {
    OrderAgencyIcon,
  },
  props: {
    orderAgency: {
      type: Object,
    },
    orderChannel: {
      type: String,
    },
  },
  setup(props) {
    const { t } = useLocale();
    const appropriateOrderChannel = computed(() => {
      let candidate;
      if (props.orderChannel && props.orderChannel !== 'ETC') {
        candidate = props.orderChannel.toLowerCase();
      } else {
        candidate = props.orderAgency.orderAgencyId;
      }
      if (preDefinedOrderChannels.includes(candidate)) {
        return candidate;
      }
      return 'unknown';
    });

    const getOrderAgencyNameFontColor = computed(() => {
      const isHubOrder = props.orderChannel === ORDER_CHANNEL.BAROGO_HUB;

      return {
        'text-shades-black': !isHubOrder,
        'text-red-darken-1': isHubOrder,
      };
    });

    return {
      appropriateOrderChannel,
      appropriateOrderAgencyName: computed(() => {
        if (appropriateOrderChannel.value === 'unknown') {
          return props.orderAgency.orderAgencyName;
        }
        return t(`common.orderAgencies.${appropriateOrderChannel.value}`);
      }),
      getOrderAgencyNameFontColor,
    };
  },
});
</script>
