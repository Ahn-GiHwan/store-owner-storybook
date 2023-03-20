<template>
  <!-- 단일배달 -->
  <div
    v-if="isOnlyOneDeliveryOrder"
    class="delivery d-flex justify-center w-100"
    :class="mdAndUp ? 'flex-column align-self-stretch' : 'align-center'"
  >
    <div>
      <div class="d-flex align-center" :class="!mdAndUp && 'mr-2'">
        <DeliveryAgencyIcon
          :delivery-agency-id="mainDelivery.deliveryAgencyId"
        />
        <span class="ml-2">
          {{ mainDelivery.driverName
            ? mainDelivery.driverName : getDeliveryAgencyName(mainDelivery)
          }}
        </span>
      </div>
    </div>
    <div v-if="mainDelivery.driverPhone">
      <span class="text-secondary font-size-12">{{ driverPhone }}</span>
    </div>
    <VDivider v-if="mdAndUp" class="my-1" />
    <span v-else class="text-grey mx-2">|</span>
    <div class="text-center">
      <span class="text-secondary font-size-12 font-weight-bold">
        {{ deliveryAgencyPrice }}
      </span>
    </div>
  </div>

  <!-- 다중배달 -->
  <VRow v-else dense class="mt-3">
    <VCol
      v-for="(item, idx) in deliveries"
      :key="idx"
      cols="6"
    >
      <div class="delivery align-center d-flex justify-space-between px-4">
        <DeliveryAgencyIcon :delivery-agency-id="item.deliveryAgencyId" />
        <span class="ml-1 font-size-12">{{getDeliveryAgencyName(item)}}</span>
        <span
          class="ml-auto font-weight-bold font-size-12"
          :class="{'text-red': isDeliveryFail(item.status) }">
          {{getDeliveryStatusName(item)}}
        </span>
      </div>
    </VCol>
  </VRow>
</template>

<script setup name="StoreDeliveryAgencyInfo">
import { computed } from 'vue';
import { useDisplay, useLocale } from 'vuetify';

import { DELIVERY_STATUS, DELIVERY_TYPE } from '@/constants';
import { addHyphenPhoneNumber, numberWithCommas } from '@/utils/stringUtils';
import { statusPrioritySorter, createdTimeSorter } from '@/utils/deliveryUtils';
import { getMainDelivery, getAdditionalDeliveries, isOnlyOneDelivery } from '@/utils/orderUtils';
import DeliveryAgencyIcon from '@/components/common/DeliveryAgencyIcon.vue';

const props = defineProps({
  order: {
    type: Object,
    require: true,
  },
});

const { mdAndUp } = useDisplay();
const { t } = useLocale();

// 메인배달
const mainDelivery = computed(() => getMainDelivery(props.order));

// 단일배달
const isOnlyOneDeliveryOrder = computed(() => isOnlyOneDelivery(props.order));

// 다중배달
const deliveries = computed(() =>
  [mainDelivery.value, ...getAdditionalDeliveries(props.order)]
    .sort(createdTimeSorter).sort(statusPrioritySorter));

// 라이더 폰번호
const driverPhone = computed(() => addHyphenPhoneNumber(mainDelivery.value?.driverPhone));

// 대행료
const deliveryAgencyPrice = computed(() => `대행료 ${
  numberWithCommas(
    mainDelivery.value.totalDeliveryPrice + mainDelivery.value.VATPrice,
  )
}원`);

// 배달 대행사명
const getDeliveryAgencyName = (delivery) => t(`common.deliveryAgency.${delivery.deliveryAgencyId}`);

// 배달 상태명
const getDeliveryStatusName = (delivery) =>
  (delivery.deliveryType === DELIVERY_TYPE.SELF
    ? t(`common.deliveryStatusForSelf.${delivery.status}`, t(`common.deliveryStatus.${delivery.status}`))
    : t(`common.deliveryStatus.${delivery.status}`));

// 배달 취소 상태 확인
const isDeliveryFail = (status) =>
  [DELIVERY_STATUS.FAILED, DELIVERY_STATUS.REJECTED, DELIVERY_STATUS.CANCELED].includes(status);

</script>

<style lang="scss" scoped>
.delivery {
  padding: 0.8rem;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  div * {
    font-size: 12px;
  }
}
.mdAndup {
  height: 10.2rem;
}
</style>
