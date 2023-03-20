<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">
        {{ $props.title }}
      </span>
    </template>
    <template #content>
      <VRow class="px-2 pb-2 flex-column" no-gutters>
        <p v-if="description" class="text-left font-size-14 mt-6 font-weight-400">
          {{ description }}
        </p>
        <VCol class="mt-3" v-for="(value, index) in $props.valueOptions" :key="index">
          <StoreButton
            block
            height="36"
            :color="gray7Color"
            variant="outlined"
            :class="selectedOption === value && 'selected'"
            @click="
              selectedOption = value;
              closeModal(selectedOption);
            "
          >
            <span
              :class="selectedOption === value ? 's-color-primary' : 'text-grey-darken-4'">
              {{ typeTranslator ? $t(`${typeTranslator}.${value}`) : $t(translator, { value }) }}
            </span>
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreBottomSheet>
</template>
<script>
import { ref, defineComponent } from 'vue';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import { gray7Color } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'SelectTranslatedValueBottomSheet',
  components: {
    StoreBottomSheet,
    StoreButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    translator: {
      type: String,
      default: '',
    },
    typeTranslator: {
      type: String,
    },
    valueOptions: {
      type: Array,
      default: () => [],
    },
    selectedValue: {
      type: [String, Number],
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  emits: ['set-data'],
  setup(props, { emit }) {
    const selectedOption = ref(props.selectedValue);
    const closeModal = () => {
      emit('set-data', { type: props.type, value: selectedOption.value });
    };

    return {
      gray7Color,
      selectedOption,
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
</style>
