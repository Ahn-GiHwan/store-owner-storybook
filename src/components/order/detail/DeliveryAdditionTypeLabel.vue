<template>
  <div
    v-if="$props.delivery.additionType"
    class="addition-type font-weight-bold font-size-12 px-2"
  >
    {{ $t(`common.deliveryAdditionType.${$props.delivery.additionType}`,
      $t(`common.deliveryAdditionType.ETC`)) }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeliveryAdditionTypeLabel',
  props: {
    delivery: {
      type: Object,
    },
  },
});
</script>

<style lang="scss" scoped>
.addition-type {
  background: #FFF3E0;
  line-height: 2rem;
  color: #EF5320;
  border-radius: 2px;
}
</style>
