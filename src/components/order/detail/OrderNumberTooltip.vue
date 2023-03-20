<template>
  <VTooltip
    v-if="order && orderAgency"
    v-model="isTooltip"
    location="bottom end"
    origin="end top"
    open-on-click
    no-click-animation
    :open-on-hover="false"
    class="order-number-tooltip"
  >
    <template v-slot:activator="{ props }">
      <VBtn size="x-small" icon v-bind="props">
        <VIcon size="x-small">mdi-information</VIcon>
      </VBtn>
    </template>
    <p v-if="!isStoreOrder" class="tooltip-allow-point-event">
      {{ $t('views.orderDetail.tooltip.orderAgencyOrderId', {
        orderAgencyName: $t(`common.orderAgencies.${appropriateOrderChannel}`),
        orderAgencyOrderId: order.orderAgencyOrderId
      }) }}
    </p>
    <template v-if="mainDelivery">
      <template
        v-for="(delivery, index) in [mainDelivery, ...additionalDeliveries]
          .sort(createdTimeSorter).sort(statusPrioritySorter)"
        :key="delivery.deliveryId"
      >
        <p class="allow-point-event">
          {{ $t('views.orderDetail.tooltip.deliveryId') }}
          <template v-if="additionalDeliveries.length > 0">
          {{ ` ${index + 1} : ` }}
          </template>
          {{ delivery.deliveryId }}
        </p>
      </template>
    </template>
  </VTooltip>
</template>
<script>
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';

import { useOrderDetailStore, useCommonStore } from '@/stores';
import { ORDER_TYPE } from '@/constants';

import { getMainDelivery, getAdditionalDeliveries, preDefinedOrderChannels } from '@/utils/orderUtils';
import { statusPrioritySorter, createdTimeSorter } from '@/utils/deliveryUtils';

export default defineComponent({
  name: 'OrderNumberTooltip',
  components: {},
  setup() {
    const orderDetail = useOrderDetailStore();
    const common = useCommonStore();

    const order = computed(() => orderDetail.getOrder);

    const orderAgency = computed(() =>
      common.getOrderAgencies?.find(
        ({ orderAgencyId }) => orderAgencyId === order.value?.orderAgencyId,
      ));

    const isTooltip = ref(false);
    const closeTooltip = () => {
      isTooltip.value = false;
    };

    // 툴팁 외부 영역을 클릭했을 때 툴팁이 닫히도록 하는 이벤트
    const externalClick = (e) => {
      if (!e.target.parentNode.closest('.v-overlay__content')) {
        closeTooltip();
      }
    };

    onMounted(() => {
      window.addEventListener('click', externalClick);
    });

    onUnmounted(() => {
      window.removeEventListener('click', externalClick);
    });

    return {
      order,
      isStoreOrder: computed(() => order.value?.orderType === ORDER_TYPE.STORE_ORDER),
      orderAgency,
      appropriateOrderChannel: computed(() => {
        let candidate;
        if (order.value) {
          if (order.value.orderChannel && order.value.orderChannel !== 'ETC') {
            candidate = order.value.orderChannel.toLowerCase();
          } else {
            candidate = orderAgency.value.orderAgencyId;
          }
          if (preDefinedOrderChannels.includes(candidate)) {
            return candidate;
          }
        }
        return 'unknown';
      }),
      mainDelivery: computed(() => order.value && getMainDelivery(order.value)),
      additionalDeliveries: computed(() => order.value && getAdditionalDeliveries(order.value)),
      statusPrioritySorter,
      createdTimeSorter,
      isTooltip,
      closeTooltip,
    };
  },
});
</script>
<!-- 툴팁의 경우 특별히 따로 준 스타일이 없고, 툴팁 자체의 teleport가 body로 되어있어 deep을 통한 스타일 변경이 먹히지 않아 scoped 제거 -->
<style lang="scss">
.tooltip-allow-point-event {
  pointer-events: auto;
}

.v-overlay-container {
  .v-tooltip {
    .v-overlay__content {
      background: rgb(var(--v-theme-surface-variant));
    }
  }
}
</style>
