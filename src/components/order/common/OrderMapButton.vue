<template>
  <StoreButton
    variant="outlined"
    size="4rem"
    color="#CBCBCB"
    @click="isShowDropMapLayer = true"
  >
    <VIcon icon="mdi-map-marker" color="black"></VIcon>
  </StoreButton>
  <StoreDropAddressMapLayer
    v-if="$props.jibunAddress"
    :dialog="isShowDropMapLayer"
    :dropAddress="$props.roadAddress"
    :jibunAddress="$props.jibunAddress"
    :location="$props.location"
    @close-layer="closeLayer"
  />
</template>

<script>
import { defineComponent, ref } from 'vue';

import StoreButton from '@/components/common/StoreButton.vue';
import StoreDropAddressMapLayer from './StoreDropAddressMapLayer.vue';

export default defineComponent({
  name: 'OrderMapButton',
  components: {
    StoreButton,
    StoreDropAddressMapLayer,
  },
  props: {
    jibunAddress: {
      type: String,
    },
    roadAddress: {
      type: String,
    },
    location: {
      type: Object,
    },
  },
  setup() {
    const isShowDropMapLayer = ref(false);

    const closeLayer = () => {
      isShowDropMapLayer.value = false;
    };

    return {
      isShowDropMapLayer,
      closeLayer,
    };
  },
});
</script>
