<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">{{
        $t('views.createOrder.bottomSheet.orderMemos.title')
      }}</span>
    </template>
    <template #content>
      <VRow class="px-2 pb-2 flex-column text-center" no-gutters>
        <VCol class="mt-3" v-for="(value, index) in storeMemos" :key="index">
          <StoreButton
            block
            height="36"
            :color="gray7Color"
            variant="outlined"
            @click.stop="closeModal(value.content, value.isUntact)"
          >
            <span class="text-black">{{ value.content }}</span>
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreBottomSheet>
</template>
<script>
import { defineComponent } from 'vue';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import { gray7Color } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'StoreRequestMemoBottomSheet',
  components: {
    StoreBottomSheet,
    StoreButton,
  },
  props: {
    storeMemos: {
      type: Array,
      required: true,
    },
  },
  emits: ['set-data'],
  setup(props, { emit }) {
    const closeModal = (value, isUntact) => {
      emit('set-data', { type: 'MEMO', value, isUntact });
    };

    return {
      closeModal,
      gray7Color,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
</style>
