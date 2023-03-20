<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">
        {{ title }}
      </span>
    </template>
    <template #content>
      <VRow class="px-2 pb-2 flex-column" no-gutters>
        <p class="text-left font-size-14 mt-6 font-weight-400">
          {{ description }}
        </p>
        <VCol class="mt-3" v-for="(time, index) in times" :key="index">
          <StoreButton
            block
            height="36"
            :color="gray7Color"
            variant="outlined"
            :class="selectedMinute === time.value && 'selected'"
            @click.stop="
              selectedMinute = time.value;
              closeModal(selectedMinute);
            "
          >
            <span class="text-black">{{ time.str }}</span>
          </StoreButton>
        </VCol>
      </VRow>
    </template>
  </StoreBottomSheet>
</template>

<script setup name="StoreProductPrepareBottomSheet">
import { ref, onMounted } from 'vue';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreButton from '@/components/common/StoreButton.vue';
import { gray7Color } from '@/styles/_export.module.scss';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  dataType: {
    type: String,
    required: true,
  },
  times: {
    type: Array,
    default: () => [],
  },
  selectedTime: {
    type: [String, Number],
  },
  description: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['set-data']);

const selectedMinute = ref(parseInt(props.selectedTime, 10));

const closeModal = (val) => {
  emits('set-data', { type: props.dataType, value: val });
};

onMounted(() => {
  selectedMinute.value = parseInt(props.selectedTime, 10);
});

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
</style>
