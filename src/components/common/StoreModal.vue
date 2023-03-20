<template>
  <VDialog v-model="dialog" persistent :width="$props.width">
    <VCard class="pa-4">
      <header class="modal-header">
        <VCardText class="pa-0">
          <slot name="header" />
        </VCardText>
      </header>
      <main class="modal-content">
        <VCardText class="pa-0 mt-4 mb-6">
          <slot name="content" />
        </VCardText>
      </main>
      <footer class="modal-footer">
        <slot name="footer">
          <VCardActions>
            <VSpacer />
            <VBtn color="green darken-1" text @click="closeModal"> Disagree </VBtn>
            <VBtn color="green darken-1" text @click="dialog = false"> Agree </VBtn>
          </VCardActions>
        </slot>
      </footer>
    </VCard>
  </VDialog>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'StoreModal',
  props: {
    width: {
      type: [String, Number],
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
}
.modal-header .v-card-text {
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 26px;
  letter-spacing: 0.2px;
  color: red;
}
.modal-content .v-card-text {
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 22px;
  color: #111111;
}
.modal-footer {
  & button {
    font-size: 1.4rem;
  }
}
</style>
