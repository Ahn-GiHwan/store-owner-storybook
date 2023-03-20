<template>
  <StoreCommonLayer v-bind="{ dialog }" bottom @close="emit('close-layer')">
    <template #header>
      {{ $t('common.layer.resolveDelivery.title') }}
    </template>
    <template #content>
      <p class="main-cause-label mt-2 mb-3 font-weight-bold text-black">{{ mainCauseLabel }}</p>
      <span v-if="helpInformationLabel" class="help-information-label mt-3">
        <template v-if="helpInformationLabel.type === 'DEPOSIT'">
          {{ $t(`common.layer.resolveDelivery.label.deposit.${storeDepositLoadingStatus}`, {
            deliveryAgency: storeDepositData?.deliveryAgencyName,
            deposit: numberWithCommas(storeDepositData?.deposit),
          }) }}
          <template v-if="storeDepositLoadingStatus !== 'loading'">
            <VBtn size="x-small" height="auto" class="text-black" icon @click="loadStoreDeposit">
              <VIcon icon="mdi-sync"></VIcon>
            </VBtn>
          </template>
        </template>
        <template v-else>
          {{ helpInformationLabel.message }}
        </template>
      </span>
      <template v-if="resolveDeliverySolutions.includes('ModifyOrder')">
        <StoreResolveDeliveryItem
          type="modifyOrder"
          :order="$props.order"
          @click="handleModifyOrder"
        />
        <VDivider/>
      </template>
      <template v-if="resolveDeliverySolutions.includes('RequestDelivery')">
        <StoreResolveDeliveryItem
          type="requestDelivery"
          :order="$props.order"
          @click="isShowRequestDeliveryLayer = true"
        />
        <VDivider/>
      </template>
      <template v-if="resolveDeliverySolutions.includes('ChangeToSelfDelivery')">
        <StoreResolveDeliveryItem
          type="changeToSelfDelivery"
          :order="$props.order"
          @click="handleChangeToSelfDelivery"
        />
        <VDivider/>
      </template>
      <template v-if="resolveDeliverySolutions.includes('CancelOrder')">
        <StoreResolveDeliveryItem
          type="cancelOrder"
          :order="$props.order"
          @click="handleCancelOrder"
        />
        <VDivider/>
      </template>
      <template v-if="resolveDeliverySolutions.includes('HideOrder')
        && isAllowHideOrderAgencyOrder">
        <StoreResolveDeliveryItem
          type="hideOrder"
          :order="$props.order"
          @click="handleHideOrder"
        />
        <VDivider/>
      </template>
      <template v-if="isShowOrderAgencyContact || isShowDeliveryAgencyContact">
        <p class="mt-4">관리자에게 직접 문의하시겠어요?</p>
        <!-- 주문 제휴사 고객센터 연락처 -->
        <p v-if="isShowOrderAgencyContact" class="help-information-label mt-1">
          {{orderAgency.orderAgencyName}} 고객센터:
          {{ addHyphenPhoneNumber(orderAgency.orderAgencyPhone) }}
        </p>

        <!-- 배달 대행사 연락처 -->
        <p v-if="isShowDeliveryAgencyContact" class="help-information-label mt-1">
          {{ deliveryAgencyContact }}
        </p>
      </template>
    </template>
  </StoreCommonLayer>

  <!-- 배달 요청 -->
  <StoreRequestDeliveryLayer
    :dialog="isShowRequestDeliveryLayer"
    :order="$props.order"
    @close-layer="handleCloseLayerAndReload"
  />

  <!-- 주문 취소 -->
  <CancelOrderModal
    v-if="isShowCancelOrderModal"
    :order="$props.order"
    @close-modal="handleCloseModal"
  />

  <!-- 목록에서 제거 -->
  <HideOrderModal
    v-if="isShowHideOrderModal"
    :order="$props.order"
    @close-modal="handleCloseModal"
  />
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter } from 'vue-router';

import { ORDER_TYPE, DELIVERY_TYPE } from '@/constants';
import { useCommonStore, useAuthStore } from '@/stores';
import useDeliveryAsync from '@/composables/useDeliveryAsync';
import {
  getMainCauseLabel,
  getHelpInformationLabel,
  getResolveDeliverySolutions,
} from '@/utils/resolveDeliveryUtils';
import { getMainDelivery, isAllowHideOrderAgencyOrder } from '@/utils/orderUtils';
import { oneMinute } from '@/utils/dateUtils';
import { addHyphenPhoneNumber, numberWithCommas } from '@/utils/stringUtils';

import StoreCommonLayer from '@/components/common/StoreCommonLayer.vue';
import StoreResolveDeliveryItem from './StoreResolveDeliveryItem.vue';
import StoreRequestDeliveryLayer from '@/components/order/common/StoreRequestDeliveryLayer.vue';
import CancelOrderModal from './CancelOrderModal.vue';
import HideOrderModal from './HideOrderModal.vue';

export default defineComponent({
  components: {
    StoreCommonLayer,
    StoreResolveDeliveryItem,
    StoreRequestDeliveryLayer,
    CancelOrderModal,
    HideOrderModal,
  },
  name: 'StoreResolveDeliveryLayer',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    callCenterHubPhone: {
      type: String,
    },
  },
  emits: ['close-layer'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const router = useRouter();
    const mainDelivery = computed(() => getMainDelivery(props.order));

    const common = useCommonStore();
    const orderAgency = computed(() =>
      common.getOrderAgencies?.find(
        ({ orderAgencyId }) => orderAgencyId === props.order.orderAgencyId,
      ));

    const isShowRequestDeliveryLayer = ref(false);
    const handleCloseLayerAndReload = async (modified) => {
      isShowRequestDeliveryLayer.value = false;
      if (modified) {
        emit('close-layer', 'reload');
      }
    };

    const authStore = useAuthStore();
    const { productPrepareTime } = authStore.currentStore;
    const {
      doReRequestDelivery,
    } = useDeliveryAsync();

    const handleChangeToSelfDelivery = async () => {
      common.setIsOverlayLoading(true);
      // 배달 요청
      // 픽업 요청시간이 0보다 작은 경우는 최소 5분으로 요청합니다.
      let pickupMinute = productPrepareTime;
      if (pickupMinute <= 0) {
        pickupMinute = 5;
      }

      // 종결된 배달 재요청
      const payload = {
        orderId: props.order.orderId,
        deliveryId: mainDelivery.value.deliveryId,
        deliveryType: DELIVERY_TYPE.SELF,
        pickupWishAt: common.systemTimestamp + (pickupMinute * oneMinute),
      };
      await doReRequestDelivery(payload, props.order);

      emit('close-layer', 'reload');
      common.setIsOverlayLoading(false);
    };

    const isShowCancelOrderModal = ref(false);
    const handleCancelOrder = async () => {
      isShowCancelOrderModal.value = true;
    };

    const isShowHideOrderModal = ref(false);
    const handleHideOrder = async () => {
      isShowHideOrderModal.value = true;
    };

    const handleCloseModal = async (changed) => {
      isShowCancelOrderModal.value = false;
      isShowHideOrderModal.value = false;
      if (changed) {
        emit('close-layer', 'go-to-main');
      }
    };

    const helpInformationLabel = computed(() =>
      getHelpInformationLabel(t, props.order, mainDelivery.value));

    const storeDepositLoadingStatus = ref('loading');
    const storeDepositData = ref(null);

    const loadStoreDeposit = async () => {
      storeDepositData.value = null;
      if (mainDelivery.value.deliveryAgencyId) {
        storeDepositLoadingStatus.value = 'loading';
        try {
          const { storeDeposit } = await authStore.storeDeposit({
            storeId: props.order.storeId,
            deliveryAgencyId: mainDelivery.value.deliveryAgencyId,
          });
          if (storeDeposit && storeDeposit.length > 0) {
            storeDeposit[0].deliveryAgencyName = t(`common.deliveryAgency.${storeDeposit[0].deliveryAgencyId}`);
            [storeDepositData.value] = storeDeposit;
            storeDepositLoadingStatus.value = 'loaded';
          } else {
            storeDepositLoadingStatus.value = 'error';
          }
        } catch (e) {
          storeDepositLoadingStatus.value = 'error';
        }
      } else {
        storeDepositLoadingStatus.value = 'error';
      }
    };

    watch(() => props.dialog, async (newValue) => {
      // 예치금 조회
      if (newValue && helpInformationLabel.value?.type === 'DEPOSIT') {
        loadStoreDeposit();
      }
    });

    // 로드샵(자체관리) 상점 여부
    const isRoadShop = computed(() => authStore.currentStore.manageOrderAgencyId === 'self');
    const deliveryAgencyContact = computed(() => {
      // 배달 대행사 연락처
      // - 로드샵 상점 : 배달 관리자 대표번호(허브 콜센터 전화번호) 노출
      // - 로드샵 상점(가맹점 또는 허브 연결 정지인 경우) : 바로고 고객 센터 02-550-9900 노출
      // - 브랜드 상점 : 바로고 고객 센터 02-550-9988 노출
      if (isRoadShop.value) {
        if (props.callCenterHubPhone) {
          return `배달 관리자 대표번호: ${addHyphenPhoneNumber(props.callCenterHubPhone)}`;
        }

        return '바로고 고객 센터: 02-550-9900';
      }

      return '바로고 고객 센터: 02-550-9988';
    });

    return {
      mainCauseLabel: computed(() => getMainCauseLabel(t, mainDelivery.value)),
      helpInformationLabel,
      storeDepositLoadingStatus,
      storeDepositData,
      loadStoreDeposit,
      numberWithCommas,
      resolveDeliverySolutions: computed(() =>
        getResolveDeliverySolutions(props.order, mainDelivery.value)),
      orderAgency,
      isSelfDelivery: computed(() => mainDelivery.value.deliveryType === DELIVERY_TYPE.SELF),
      isAllowHideOrderAgencyOrder: computed(() => isAllowHideOrderAgencyOrder(props.order)),
      isShowRequestDeliveryLayer,
      handleCloseLayerAndReload,
      emit,
      handleChangeToSelfDelivery,
      handleModifyOrder: () => {
        emit('close-layer');
        router.push({
          name: 'ModifyOrder',
          params: { orderId: props.order.orderId },
          query: { 'request-delivery': true },
        });
      },
      isShowCancelOrderModal,
      handleCancelOrder,
      isShowHideOrderModal,
      handleHideOrder,
      handleCloseModal,
      addHyphenPhoneNumber,
      deliveryAgencyContact,
      isShowOrderAgencyContact: computed(() =>
        props.order.orderType !== ORDER_TYPE.STORE_ORDER
        && orderAgency.value.orderAgencyPhone),
      isShowDeliveryAgencyContact: computed(() =>
        mainDelivery.value.deliveryType !== DELIVERY_TYPE.SELF
        && mainDelivery.value.deliveryAgencyId),
    };
  },
});
</script>

<style lang="scss" scoped>
.main-cause-label {
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.help-information-label {
  font-size: 12px;
  line-height: 18px;
  color: #999999;
}
</style>
