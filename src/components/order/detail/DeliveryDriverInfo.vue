<template>
  <span class="text-shades-black">
    <span>{{ driverName }}</span>
    <span :class="driverName && 'ml-2'">{{ driverPhone }}</span>
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { addHyphenPhoneNumber } from '@/utils/stringUtils';

export default defineComponent({
  name: 'DeliveryDriverInfo',
  props: {
    delivery: {
      type: Object,
    },
  },
  setup(props) {
    return {
      driverName: computed(() => props.delivery.driverName || ''),
      driverPhone: computed(() => addHyphenPhoneNumber(props.delivery.driverPhone) || '전화번호가 없습니다.'),
    };
  },
});
</script>
