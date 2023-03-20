<template>
  <div class="d-flex justify-end">
    <div
      v-if="$props.order.serveType === ORDER_SERVE_TYPE.HALL"
      class="hall font-size-12 px-2"
    >
      {{ $t('views.orderDetail.orderCard.label.hall') }}
    </div>
    <div
      v-else-if="$props.order.serveType === ORDER_SERVE_TYPE.PACKING"
      class="packing font-size-12 px-2"
    >
      {{ $t('views.orderDetail.orderCard.label.packing') }}
    </div>
    <div v-else class="d-flex flex-wrap justify-end">
      <div
        v-if="$props.order.reorderRelation"
        class="reorder font-size-12 px-2"
        :class="$props.order.isReservation && 'mr-1'"
      >
        {{ $t('views.orderDetail.orderCard.label.reorder') }}
        ({{ $t(`common.reorderType.${$props.order.reorderRelation.reorderType}`,
          $t('common.reorderType.ETC')) }})
      </div>
      <div v-if="$props.order.isReservation" class="reserved font-size-12 px-2 mr-1">
        {{ $t('views.orderDetail.orderCard.label.reserved') }} {{ reservedDateTime }}
      </div>
      <div
        v-if="$props.order.orderChannel === 'BAROGO_HUB'"
        class="hub-order font-size-12 px-2 mr-1"
      >
        {{ $t('views.orderDetail.orderCard.label.hubOrder') }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import { timestampToDateTime } from '@/utils/dateUtils';
import { ORDER_SERVE_TYPE } from '@/constants';

export default defineComponent({
  name: 'OrderTypeBadge',
  props: {
    order: {
      type: Object,
    },
  },
  setup(props) {
    return {
      ORDER_SERVE_TYPE,
      reservedDateTime: computed(() => (props.order?.isReservation ? timestampToDateTime(props.order.dropWishAt) : '')),
    };
  },
});
</script>

<style lang="scss" scoped>
.reserved {
  background: #E2F3FF;
  line-height: 2rem;
  color: #005EFF;
}
.hall {
  background: #FFF3E0;
  line-height: 2rem;
  color: #EF5320;
}
.packing {
  background: #F3E5F5;
  line-height: 2rem;
  color: #7B1FA2;
}
.reorder {
  background: #FFF3E0;
  line-height: 2rem;
  color: #EF5320;
}
.hub-order {
  background: #FFEBEB;
  line-height: 2rem;
  color: #FF1744;
}
</style>
