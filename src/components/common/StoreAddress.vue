<template>
  <VDialog v-model="$props.dialog">
    <div class="header">
      <VToolbar color="white">
        <VRow class="d-flex align-center text-center" no-gutters>
          <VCol cols="2" class="text-left">
            <VBtn dark icon @click="seletedAddress()">
              <VIcon start icon="mdi-arrow-left"></VIcon>
            </VBtn>
          </VCol>
          <VCol cols="8">
            <VAppBarTitle
              ><span class="font-weight-bold font-size-16">{{
                $t('common.address.findAddress')
              }}</span></VAppBarTitle
            >
          </VCol>
          <VCol cols="2">
            <VSpacer />
          </VCol>
        </VRow>
      </VToolbar>
    </div>
    <VDivider />
    <div class="address-content">
      <VList lines="two" subheader>
        <VListItem class="pb-0">
          <StoreTextField
            name="inputAddressKeyword"
            v-model="inputAddressKeyword"
            :placeholder="$t('common.address.searchFormPlaceholder')"
            variant="outlined"
            @keyup.enter="search"
            autofocus
          />
        </VListItem>
      </VList>
      <VList v-if="!getAddress || getAddress?.length === 0" lines="two" subheader height="100vh">
        <VListItem class="pt-0 mb-4">
          <StoreBaseCard :color="gray2Color" flat>
            <template #card-header>
              <div class="px-2 pt-2 header-title font-weight-bold font-size-12">
                {{ getAddress?.length === 0 ? $t('common.address.noSearch') : 'Tip' }}
              </div>
            </template>
            <template #card-content>
              <div class="mt-2 px-2">
                <span class="font-weight-bold font-size-12">{{
                  $t('common.address.tipBold')
                }}</span>
                <span class="font-size-12">{{ $t('common.address.tipDescript') }}</span>
              </div>
            </template>
          </StoreBaseCard>
        </VListItem>
        <StoreBaseCard class="mx-2" :color="gray2Color" flat>
          <template #card-header>
            <div class="pa-2 header-title font-weight-bold font-size-12">
              {{ $t('common.address.initialSearch') }}
            </div>
          </template>
          <template #card-content>
            <div class="pa-2">
              <span class="content font-size-12">
                {{ $t('common.address.initialSearchDescription') }}
              </span>
            </div>
          </template>
        </StoreBaseCard>
      </VList>
      <VList v-else lines="two" subheader height="85vh">
        <VRow dense class="flex-column my-1">
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
              {{ `${item.sido} ${item.doro}  ${item.dorono} ${item.dororef}` }}
            </p>
            <p class="font-size-12 ml-3 mt-1">
              <VChip size="x-small" label variant="outlined" close>
                {{ $t('common.address.jibun') }}
              </VChip>
              {{ `${item.sido} ${item.jibun}  ${item.jibunno} (${item.hname})` }}
            </p>
            <div class="mt-2">
              <VDivider></VDivider>
            </div>
          </VCol>
        </VRow>
      </VList>
    </div>
  </VDialog>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useCommonStore } from '@/stores';

import StoreBaseCard from '@/components/common/StoreBaseCard.vue';
import StoreTextField from '@/components/common/StoreTextField.vue';

import { gray2Color } from '@/styles/_export.module.scss';

export default defineComponent({
  components: { StoreTextField, StoreBaseCard },
  name: 'StoreAddress',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-layer'],
  setup(props, { emit }) {
    const common = useCommonStore();
    const inputAddressKeyword = ref('');

    const seletedAddress = (data) => {
      inputAddressKeyword.value = '';
      common.$state.address = null;
      emit('close-layer', data);
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
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.address-content {
  white-space: pre-line;
  & div {
    font-size: 1.2rem;
  }
}

hr {
  background: rgba(255, 255, 255);
}

:deep(.v-overlay__content) {
  width: 100% !important;
  max-width: $breakpoint-tablet !important;
  top: 0;
  margin: 0 !important;
}

:deep(.v-overlay__scrim) {
  background-color: transparent;
}
</style>
