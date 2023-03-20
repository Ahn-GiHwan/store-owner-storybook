<template>
  <div
    class="d-flex"
    :class="mdAndUp ? 'justify-space-between align-center py-4' : 'flex-column pb-5 pt-6'"
  >
    <div class="pr-2">
      {{ label.actionLabel }}
      <template v-if="label.subHelpLabel">
        <br />
        <span class="sub-help-label">{{ label.subHelpLabel }}</span>
      </template>
    </div>
    <div>
      <StoreButton
        :block="!mdAndUp"
        :color="isCancelOrder ? '#fff': primary"
        :border="isCancelOrder"
        :isCancelButton="isCancelOrder"
        @click.stop="emit('click')"
        :class="!mdAndUp && 'mt-3'"
      >
        <span class="font-weight-bold">
          {{ $t(`common.layer.resolveDelivery.button.${$props.type}`) }}
        </span>
      </StoreButton>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useDisplay, useLocale } from 'vuetify';

import StoreButton from '@/components/common/StoreButton.vue';
import { getMainDelivery } from '@/utils/orderUtils';
import {
  getActionLabel,
} from '@/utils/resolveDeliveryUtils';

export default defineComponent({
  components: {
    StoreButton,
  },
  name: 'StoreResolveDeliveryItem',
  emits: ['click'],
  props: {
    type: {
      type: String,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { mdAndUp } = useDisplay();
    const { t } = useLocale();

    const isCancelOrder = computed(() => props.type === 'cancelOrder');

    return {
      mdAndUp,
      label: computed(() =>
        getActionLabel(t, props.type, props.order, getMainDelivery(props.order))),
      emit,
      isCancelOrder,
    };
  },
});
</script>

<style lang="scss" scoped>
.sub-help-label {
  font-size: 1.2rem;
  line-height: 1.8rem;
  color: #616161;
}
</style>
