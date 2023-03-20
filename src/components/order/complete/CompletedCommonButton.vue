<template>
  <div v-if="title" class="text-left mb-2 font-size-12">{{ title }}</div>
  <VRow no-gutters>
    <VCol v-for="(item, index) in data" :key="index" class="pr-2">
      <StoreButton
        block
        v-bind="{...getBtnStyle(index)}"
        @click.stop="selectedItem(index); emits('button-clicked', item)"
        height="4rem"
      >
        <span :class="selectedIndex === index ? 'primary' : 'text-secondary'">{{ item.name }}</span>
      </StoreButton>
    </VCol>
  </VRow>
</template>

<script setup name="CompletedCommonButton">
import StoreButton from '@/components/common/StoreButton.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  data: {
    type: Array,
    require: true,
  },
  selectedIndex: {
    type: Number,
  },
});

const emits = defineEmits(['update:selectedIndex', 'button-clicked']);

const selectedItem = (idx) => {
  emits('update:selectedIndex', idx);
};

const getBtnStyle = (id) => {
  if (id === props.selectedIndex) {
    return {
      variant: 'outlined',
      color: 'primary',
    };
  }
  return {
    variant: 'outlined',
    class: 'outlined',
  };
};

</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
</style>
