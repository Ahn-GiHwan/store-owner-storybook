<template>
  <VDialog
    fullscreen
    v-model="$props.dialog"
    :scrim="false"
    transition="dialog-bottom-transition"
    persistent
  >
    <VCard>
      <header id="header">
        <div class="header">
          <VToolbar color="white">
            <VRow class="d-flex align-center text-center" no-gutters>
              <VCol cols="2" class="text-left">
                <VBtn v-if="showBackBtn()" height="52px" dark icon @click.stop="emit('close')">
                  <VIcon icon="mdi-arrow-left"></VIcon>

                </VBtn>
              </VCol>
              <VCol cols="8">
                <VAppBarTitle>
                  <span class="font-weight-bold font-size-16">
                    <slot name="header"></slot>
                  </span>
                </VAppBarTitle>
              </VCol>
              <VCol cols="2">
                <VSpacer />
              </VCol>
            </VRow>
          </VToolbar>
        </div>
      </header>
      <VDivider />

      <VSheet class="content-layer px-4 pt-4">
        <slot name="content"> </slot>
      </VSheet>

      <div v-if="$props.bottom" class="footer-layer">
        <VSheet class="footer-layer-wrap justify-center">
          <slot name="footer"> </slot>
        </VSheet>
      </div>
    </VCard>
  </VDialog>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores';

export default defineComponent({
  name: 'StoreCommonLayer',

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const showBackBtn = () => {
      const auth = useAuthStore();

      if (auth.currentUser?.isPasswordChangeRequired) {
        return false;
      }
      return true;
    };

    return {
      emit,
      showBackBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/common/form.scss';
@import '@/styles/common/button.scss';
@import '@/styles/layout/_header.scss';
.amount {
  background: $color-gray-f5;
  border-radius: 4px;
}
.footer-layer-wrap {
  width: 100vw;
  max-width: $breakpoint-tablet;
}
.footer-layer {
  overflow: hidden;
  position: fixed;
  display: flex;
  bottom: 0px;
  padding: 8px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  z-index: 1;
  background: white;
  justify-content: center;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
}

.header-layer {
  max-width: $breakpoint-tablet;
}
.content-layer {
  width: 100%;
  max-width: $breakpoint-tablet;
  align-self: center;
  padding-bottom: 84px;
}
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
.v-list {
  align-self: center;
}

.header {
  max-width: $breakpoint-tablet;
}
</style>
