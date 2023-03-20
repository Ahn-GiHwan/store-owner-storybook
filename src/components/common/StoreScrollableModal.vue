<template>
  <div>
    <VDialog v-model="dialog" scrollable persistent width="280px">
      <VCard>
        <VCardTitle class="d-flex justify-space-between my-4">
          <span class="font-size-16 font-weight-bold">{{ title }}</span>
          <VIcon @click="closeModal">mdi-close</VIcon>
        </VCardTitle>
        <VCardText>
          <div v-html="contents"></div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'StoreScrollableModal',
  props: {
    title: String,
    contents: {
      type: String,
      default: '',
    },
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    const dialog = ref(true);

    const closeModal = () => {
      dialog.value = false;
      emit('close-modal');
    };

    return {
      dialog,
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.v-overlay__content) {
  align-items: center;
  .v-card {
    width: 28rem;
  }
  .v-card-text {
    height: 33.8rem;
  }
}
</style>
