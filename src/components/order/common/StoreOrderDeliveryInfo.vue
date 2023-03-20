<template>
  <VRow class="flex-column text-right" no-gutters>
    <VCol>
      <VSheet :color="gray2Color">
        <VCardActions class="pa-0 pl-4">
          <DeliveryAgencyIcon :deliveryAgencyId="deliveryInfo.deliveryAgencyId" />
          <span class="ml-2">
            {{ $t(`common.deliveryAgency.${deliveryInfo.deliveryAgencyId}`) }}
          </span>
          <div v-if="deliveryInfo.delayTime > 0" class="ml-2 s-color-red-e5">
            <VChip size="small" label>
              <span class="font-size-14">
                {{ $t('common.order.deliveryInfo.delay') }}
                {{ `${deliveryInfo.delayTime}${$t('common.dateTime.minute')}` }}
              </span>
            </VChip>
          </div>
          <VSpacer />
          <span>
            {{ $t('common.order.deliveryInfo.totalCharge') }}
            {{ numberWithCommas(deliveryInfo.totalDeliveryPrice + deliveryInfo.VATPrice) }}
            {{ $t('common.currency') }}
          </span>
          <VBtn
            :icon="isExpand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="isExpand = !isExpand"
          ></VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="isExpand">
            <VRow no-gutters class="px-4 pb-3">
              <VDivider />
              <VRow class="mt-1">
                <VCol class="text-start" cols="9">
                  - {{ $t('common.order.deliveryInfo.distanceAgencyFee') }} ({{
                    $t('common.order.deliveryInfo.distance')
                  }}
                  {{ deliveryInfo.deliveryDistance / 1000 }} km)</VCol
                >
                <VCol
                  >{{ numberWithCommas(deliveryInfo.deliveryPrice) }}
                  {{ $t('common.currency') }}</VCol
                >
              </VRow>
              <template v-for="(item, index) in deliveryInfo.extraCharges" :key="index">
                <VCol class="text-start" cols="9"
                  >- {{ $t(`common.extraCharges.${item.type}`) }}
                  {{ $t('common.order.deliveryInfo.extraCharge') }}</VCol
                >
                <VCol>{{ numberWithCommas(item.charge) }} {{ $t('common.currency') }}</VCol>
              </template>

              <template v-if="deliveryInfo.VATPrice > 0">
                <VCol class="text-start" cols="9"
                  >- {{ $t('common.order.deliveryInfo.vatPrice') }}</VCol
                >
                <VCol
                  >+ {{ numberWithCommas(deliveryInfo.VATPrice) }} {{ $t('common.currency') }}</VCol
                >
              </template>
            </VRow>
          </div>
        </VExpandTransition>
      </VSheet>
    </VCol>
  </VRow>
</template>
<script>
import { defineComponent, ref } from 'vue';

import { numberWithCommas, addHyphenPhoneNumber, stringToNumber } from '@/utils/stringUtils';

import DeliveryAgencyIcon from '@/components/common/DeliveryAgencyIcon.vue';

import { gray2Color } from '@/styles/_export.module.scss';

export default defineComponent({
  name: 'StoreOrderDeliveryInfo',
  components: { DeliveryAgencyIcon },
  props: {
    deliveryInfo: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isExpand = ref(true);

    return {
      isExpand,
      gray2Color,
      numberWithCommas,
      addHyphenPhoneNumber,
      stringToNumber,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel-title__overlay) {
  background-color: $color-gray-f5;
}
:deep(.v-expansion-panel-text__wrapper) {
  background-color: $color-gray-f5;
  padding: 0 1.6rem 1.2rem 1.6rem;
}
</style>
