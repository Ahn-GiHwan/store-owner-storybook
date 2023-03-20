<template>
  <Sheet
    class="bottom-sheet-vue3__custom"
    v-bind="{ ...$props, ...$attrs }"
    align="center"
    :slideIcon="''"
    maxWidth="100vw"
    minHeight="100"
    radius="8px"
    v-slot="{ closeSelf }"
  >
    <VSheet class="pa-4 pt-0" :max-width="breakpointTablet">
      <div class="d-flex justify-space-between">
        <slot name="title"></slot>
        <span v-if="showCloseIcon"><VIcon @click="closeSelf">mdi-close</VIcon></span>
      </div>
      <slot name="sub-title"> </slot>
      <slot name="content"></slot>
    </VSheet>
  </Sheet>
</template>
<script>
import { defineComponent } from 'vue';
import { Sheet } from 'bottom-sheet-vue3';

import { breakpointTablet } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'StoreBottomSheet',
  components: {
    Sheet,
  },
  props: {
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      breakpointTablet,
    };
  },
});
</script>

<style lang="scss">
.bottom-sheet-vue3__custom {
  z-index: 1;
  .vier-sheet-head {
    padding: 10px !important;
  }
}

.vier-sheet-container {
    z-index: 80000;
  }
</style>
