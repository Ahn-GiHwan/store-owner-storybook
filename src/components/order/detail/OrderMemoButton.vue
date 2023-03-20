<template>
  <StoreButton
    variant="outlined"
    size="4rem"
    color="#CBCBCB"
    @click="handleClick"
  >
    <VIcon icon="mdi-dots-vertical" color="black"></VIcon>
  </StoreButton>
</template>

<script>
import { defineComponent } from 'vue';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'OrderMemoButton',
  components: {
    StoreButton,
  },
  emits: ['show-order-memo-modal'],
  props: {
    order: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit('show-order-memo-modal');
    };

    return {
      handleClick,
    };
  },
});
</script>
