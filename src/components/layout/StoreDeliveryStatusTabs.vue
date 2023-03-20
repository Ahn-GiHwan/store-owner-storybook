<template>
  <VTabs
    v-model="tab"
    color="primary"
    grow
    @click="changeTab"
  >
    <VTab
      v-for="(item, index) in tabs"
      :key="index"
      :value="item.field"
    >
      {{ item.name }} {{ order[item.field].length }}
    </VTab>
  </VTabs>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useOrderStore } from '@/stores';

export default defineComponent({
  name: 'StoreDeliveryStatusTabs',
  setup() {
    const order = useOrderStore();
    const tab = ref(order.selectedTab);
    const tabs = [
      {
        name: '접수대기',
        field: 'waiting',
      },
      {
        name: '접수',
        field: 'accepted',
      },
      {
        name: '배차',
        field: 'allocated',
      },
      {
        name: '픽업',
        field: 'pickup',
      },
    ];

    const changeTab = () => {
      order.changeDeliveryStatus(tab.value);
    };

    return {
      tab,
      tabs,
      changeTab,
      order,
    };
  },
});
</script>
