<template>
  <span class="text-shades-black">
    {{ mainAddress }}
  </span>
  <template v-if="subAddress">
    <br />
    <span class="font-size-12 s-color-gray-66">
      {{ subAddress }}
    </span>
  </template>
</template>

<script setup name="OrderAddress">
import { computed } from 'vue';
import { useLocale } from 'vuetify/lib/framework.mjs';
import { isDeligatingOrderWithoutAddress } from '@/utils/orderUtils';

const props = defineProps({
  order: {
    type: Object,
  },
});

const { t } = useLocale();

// O2O를 통해 접수된 주문이면서 지번주소, 도로명주소가 없는 주문인지
const isSkipAddress = computed(() => isDeligatingOrderWithoutAddress(props.order));

const mainAddress = computed(() => {
  // O2O를 통해 접수된 주문이면서 지번, 도로명 주소가 없으면 대리 접수 주문으로 생략되었다는 문구 표시
  if (isSkipAddress.value) {
    return t('common.address.O2OSkipOrderAddress');
  }

  // 그렇지 않으면 지번주소 + 상세주소 표시
  return `${props.order.dropJibunAddress} ${props.order.dropAddressDetail}`;
});

const subAddress = computed(() => {
  // O2O를 통해 접수된 주문이면서 지번, 도로명 주소가 없으면 상세 주소 표시
  if (isSkipAddress.value) {
    return props.order.dropAddressDetail;
  }

  // 그렇지 않으면 도로명 주소 표시
  return props.order.dropRoadAddress;
});
</script>
