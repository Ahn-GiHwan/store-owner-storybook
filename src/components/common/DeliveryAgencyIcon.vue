<template>
  <img
    :srcset="`${iconSet[0]} 1x, ${iconSet[1]} 2x, ${iconSet[2]} 3x`"
    :src="iconSet[0]"
    alt="배달제휴사 아이콘" />
</template>
<script>
import { computed, defineComponent } from 'vue';
import barogo from '@/assets/images/icon/delivery/logo_delivery_barogo.png';
import barogo2x from '@/assets/images/icon/delivery/logo_delivery_barogo_2x.png';
import barogo3x from '@/assets/images/icon/delivery/logo_delivery_barogo_3x.png';
import beyondInc from '@/assets/images/icon/delivery/logo_delivery_beyondInc.png';
import beyondInc2x from '@/assets/images/icon/delivery/logo_delivery_beyondInc_2x.png';
import beyondInc3x from '@/assets/images/icon/delivery/logo_delivery_beyondInc_3x.png';
import moacall from '@/assets/images/icon/delivery/logo_delivery_moacall.png';
import moacall2x from '@/assets/images/icon/delivery/logo_delivery_moacall_2x.png';
import moacall3x from '@/assets/images/icon/delivery/logo_delivery_moacall_3x.png';
import unknown from '@/assets/images/icon/delivery/logo_delivery_unknown.png';
import unknown2x from '@/assets/images/icon/delivery/logo_delivery_unknown_2x.png';
import unknown3x from '@/assets/images/icon/delivery/logo_delivery_unknown_3x.png';
import self from '@/assets/images/icon/delivery/logo_delivery_self.png';
import self2x from '@/assets/images/icon/delivery/logo_delivery_self_2x.png';
import self3x from '@/assets/images/icon/delivery/logo_delivery_self_3x.png';

export default defineComponent({
  name: 'DeliveryAgencyIcon',
  props: {
    deliveryAgencyId: {
      type: String,
      default: 'unknown',
    },
  },
  setup(props) {
    const defaultIconSet = [unknown, unknown2x, unknown3x];
    const iconSets = {
      barogo: [barogo, barogo2x, barogo3x],
      beyondInc: [beyondInc, beyondInc2x, beyondInc3x],
      moacall: [moacall, moacall2x, moacall3x],
      self: [self, self2x, self3x],
    };
    const iconSet = computed(() => iconSets[props.deliveryAgencyId] || defaultIconSet);
    return {
      iconSet,
    };
  },
});
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
}
</style>
