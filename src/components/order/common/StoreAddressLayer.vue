<template>
  <StoreCommonLayer v-bind="{ dialog }" @close="emit('close-layer')">
    <template #header>
      {{ $t('common.address.findAddress') }}
    </template>
    <template #content>
      <div class="address-content">
        <VList class="pt-0">
          <VListItem class="pa-0">
            <StoreTextField
              name="inputAddressKeyword"
              v-model="inputAddressKeyword"
              :placeholder="$t('common.address.searchFormPlaceholder')"
              variant="outlined"
              @keypress.enter.stop="search"
              autofocus
            />
          </VListItem>
        </VList>
        <VList v-if="!getAddress || getAddress?.length === 0" subheader>
          <VListItem class="pa-0">
            <StoreBaseCard :color="gray2Color" flat>
              <template #card-header>
                <div class="px-2 pt-2 header-title font-weight-bold font-size-12">
                  {{ getAddress?.length === 0 ? $t('common.address.noSearch') : 'Tip' }}
                </div>
              </template>
              <template #card-content>
                <div class="mt-2 px-2 pb-2">
                  <span class="font-weight-bold font-size-12">{{
                    $t('common.address.tipBold')
                  }}</span>
                  <span class="font-size-12">{{ $t('common.address.tipDescript') }}</span>
                </div>
              </template>
            </StoreBaseCard>
          </VListItem>

          <VListItem class="pa-0 mt-4">
            <StoreBaseCard :color="gray2Color" flat>
              <template #card-header>
                <div class="px-2 pt-2 header-title font-weight-bold font-size-12">
                  {{ $t('common.address.initialSearch') }}
                </div>
              </template>
              <template #card-content>
                <div class="mt-2 px-2 pb-2">
                  <span class="font-size-12">{{
                    $t('common.address.initialSearchDescription')
                  }}</span>
                </div>
              </template>
            </StoreBaseCard>
          </VListItem>
        </VList>
        <VRow v-else dense class="flex-column my-1">
          <VCol
            class="mb-1"
            v-for="(item, index) in getAddress"
            :key="index"
            @click="seletedAddress(item)"
          >
            <p class="font-size-12 ml-3">
              <VChip size="x-small" label variant="outlined" close>
                {{ $t('common.address.road') }}
              </VChip>
              {{ `${item.sido} ${getRoadAddress(item)}` }}
            </p>
            <p class="font-size-12 ml-3 mt-1">
              <VChip size="x-small" label variant="outlined" close>
                {{ $t('common.address.jibun') }}
              </VChip>
              {{ `${item.sido} ${getJibunAddress(item)}` }}
            </p>
            <div class="mt-2">
              <VDivider />
            </div>
          </VCol>
        </VRow>
      </div>
    </template>
  </StoreCommonLayer>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useCommonStore } from '@/stores';

import StoreBaseCard from '@/components/common/StoreBaseCard.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';
import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';

import { gray2Color } from '@/styles/_export.module.scss';

export default defineComponent({
  components: { StoreTextField, StoreBaseCard, StoreCommonLayer },
  name: 'StoreAddressLayer',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set-data', 'close-layer'],
  setup(props, { emit }) {
    const common = useCommonStore();
    const inputAddressKeyword = ref('');

    const getRoadAddress = (item) => `${item.doro}  ${item.dorono} ${item.dororef}`;

    const getJibunAddress = (item) => {
      const jibunAddress = `${item.jibun}  ${item.jibunno}`;
      if (item.buildname) {
        return `${jibunAddress} (${item.buildname})`;
      }
      return jibunAddress;
    };

    const seletedAddress = (data) => {
      inputAddressKeyword.value = '';
      common.$state.address = null;
      emit('set-data', { ...data, roadAddress: getRoadAddress(data), jibunAddress: getJibunAddress(data) });
    };

    const search = async () => {
      await common.findAddressKeyword(inputAddressKeyword.value);
    };

    return {
      gray2Color,
      inputAddressKeyword,
      getAddress: computed(() => common.getAddressList),
      search,
      emit,
      seletedAddress,
      getRoadAddress,
      getJibunAddress,
    };
  },
});
</script>

<style lang="scss" scoped>
.address-content {
  white-space: pre-line;
  & div {
    font-size: 1.2rem;
  }
}
</style>
