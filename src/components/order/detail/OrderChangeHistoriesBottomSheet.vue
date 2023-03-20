<template>
  <StoreBottomSheet>
    <template #title>
      <span class="text-left font-size-16 font-weight-bold">
        주문 / 배달 정보 변경 내역
      </span>
    </template>
    <template #content>
      <template v-if="histories">
        <VRow class="px-2 pb-2 flex-column" no-gutters>
          <VCol v-for="(history, index) in histories" :key="index">
            <OrderChangeHistoryItem
              :history="history"
            />
          </VCol>
        </VRow>
      </template>
    </template>
  </StoreBottomSheet>
</template>

<script setup name="OrderChangeHistoriesBottomSheet">
import { computed } from 'vue';
import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import OrderChangeHistoryItem from '@/components/order/detail/OrderChangeHistoryItem.vue';

const props = defineProps({
  orderChangeHistories: {
    type: [Array, null],
    required: true,
  },
});

const histories = computed(() => props.orderChangeHistories);

</script>

<style lang="scss" scoped>

</style>
