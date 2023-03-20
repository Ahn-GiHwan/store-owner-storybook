<template>
  <StoreCommonLayer v-bind="{ dialog }" @close="emit('close-layer')">
    <template #header>
      {{ $t('common.address.dropAddress') }} {{ $t('common.address.name') }}
    </template>
    <template #content>
      <iframe
        name="iframeMap"
        id="iframeMapViewComponent"
        width="100%"
        height="470px"
        :src="viewLocationNaverMap(location)"
        frameborder="0"
        scrolling="no"
        ref="iframeDom"
      ></iframe>
      <div class="pa-2">
        <div class="mt-2">
          {{ jibunAddress }}
        </div>
        <div class="mt-2">
          <VChip rounded="2" size="x-small" label variant="outlined" close>
            {{ $t('common.address.road') }}
          </VChip>
          <span class="ml-1 font-size-12"> {{ dropAddress }}</span>
        </div>
      </div>
    </template>
  </StoreCommonLayer>
</template>

<script>
import { defineComponent } from 'vue';
import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';

export default defineComponent({
  components: {
    StoreCommonLayer,
  },
  name: 'StoreDropAddressMapLayer',
  emits: ['close-layer'],
  props: {
    dialog: {
      type: Boolean,
    },
    location: Object,
    dropAddress: String,
    jibunAddress: String,
  },
  setup(props, { emit }) {
    const viewLocationNaverMap = (location) => {
      const payloadLoaction = Object.entries(location)
        .map((e) => e.join('='))
        .join('&');
      return `${import.meta.env.VITE_NAVER_MAP_API_URL}?${payloadLoaction}`;
    };

    return {
      viewLocationNaverMap,
      emit,
    };
  },
});
</script>

<style lang="scss" scoped></style>
