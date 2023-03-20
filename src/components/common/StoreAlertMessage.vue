<template>
  <template
    v-for="(alertMessage, index) in alertMessages"
    v-bind:key="index"
  >
    <StoreAlertMessageItem
      :alertMessage="alertMessage"
      :waitingMessageCount="alertMessages.length - 1"
      @closed="handleClosed"
    />
  </template>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter, useRoute } from 'vue-router';

import useSocket from '@/composables/useSocket';
import { STORE_STATUS, STORE_USER_STATUS, SOCKET } from '@/constants';
import { useCommonStore, useAuthStore } from '@/stores';
import { numberWithCommas } from '@/utils/stringUtils';
import StoreAlertMessageItem from './StoreAlertMessageItem.vue';

/**
 * TODO: 수락 제한 시간이 종료되었습니다. (FOR_ORDER 주문이 수락 가능 시간이 지났을 때)
 */

export default defineComponent({
  name: 'StoreAlertMessage',
  components: {
    StoreAlertMessageItem,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const currentRouteName = computed(() => route.name);
    const { t } = useLocale();
    const snackbar = ref(true);
    const common = useCommonStore();
    const auth = useAuthStore();

    const { subscribe } = useSocket();

    const isOrderInfoReceivable = computed(() => {
      const store = auth.currentStore;
      const storeUser = auth.storeUserList
        .find((_storeUser) => _storeUser.storeId === store.storeId);
      return store.status === STORE_STATUS.APPROVED
        && storeUser?.status === STORE_USER_STATUS.APPROVED;
    });
    //
    subscribe(SOCKET.EVENT.PAYMENTS_UPDATED_BARO_MONEY, ({ charge, subType, changedAt }) => {
      if (isOrderInfoReceivable.value) {
        if (subType === 'GOODS_PRICE_DEPOSIT') {
          common.showAlertMessage(
            {
              title: '상품 대금 결제금액이 바로머니로 입금되었습니다.',
              message: `바로고 ${numberWithCommas(charge)}원 입금 완료`,
            },
            changedAt,
          );
        } else
        if (subType === 'GOODS_PRICE_REFUND') {
          common.showAlertMessage(
            {
              title: '상품 대금 결제금액이 바로머니로 환불되었습니다.',
              message: `바로고 ${numberWithCommas(charge)}원 환불 완료`,
            },
            changedAt,
          );
        }
      }
    });
    subscribe(SOCKET.EVENT.DELIVERY_MESSAGE_CREATED, ({
      orderId,
      dropJibunAddress,
      dropAddressDetail,
      deliveryMessage: {
        message,
        createdAt,
      },
    }) => {
      if (isOrderInfoReceivable.value) {
        common.showAlertMessage(
          {
            title: '라이더 메시지',
            subtitle: `${dropJibunAddress} ${dropAddressDetail}`,
            message,
          },
          createdAt,
          () => {
            if (currentRouteName.value === 'OrderDetail') {
              router.replace({ name: 'OrderDetail', params: { orderId } });
            } else {
              router.push({ name: 'OrderDetail', params: { orderId } });
            }
          },
          true,
        );
      }
    });

    const isStoreInfoReceivable = computed(() => {
      const store = auth.currentStore;
      const storeUser = auth.currentStoreUser;
      return store.status === STORE_STATUS.APPROVED && storeUser;
    });
    subscribe(SOCKET.EVENT.DELIVERY_AGENCY_DELIVERY_DISABLE, ({ deliveryAgencyId, reason }) => {
      if (isStoreInfoReceivable.value) {
        common.showAlertMessage(
          {
            title: `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}' 배달 접수가 중단됩니다.`,
            message: `${t(`errors.deliveryDisabled.${reason}`, t('errors.deliveryDisabled.ETC'))}`,
          },
          undefined,
          undefined,
          false,
        );
      }

      auth.refreshDeliveryAgencyStores();
    });
    subscribe(SOCKET.EVENT.DELIVERY_AGENCY_DELIVERY_ENABLE, ({ deliveryAgencyId }) => {
      if (isStoreInfoReceivable.value) {
        common.showAlertMessage({
          title: `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}' 에서 다시 배달을 시작합니다.`,
          message: `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}' 배달 중단 해제`,
        });
      }

      auth.refreshDeliveryAgencyStores();
    });
    subscribe(SOCKET.EVENT.STORE_DEPOSIT_UPDATE, ({ deliveryAgencyId, addedDeposit }) => {
      if (isStoreInfoReceivable.value) {
        common.showAlertMessage({
          title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} 입금이 완료되었습니다.`,
          message: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} ${numberWithCommas(addedDeposit)}원 입금 완료`,
        });
      }

      auth.refreshDeliveryAgencyStores();
    });
    subscribe(SOCKET.EVENT.WITHDRAWAL_STATUS_CHANGED, ({
      isSuccess,
      deliveryAgencyId,
      withdrawalAmount,
    }) => {
      if (isStoreInfoReceivable.value) {
        if (isSuccess) {
          common.showAlertMessage({
            title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} 예치금이 정상적으로 출금되었습니다.`,
            message: `${numberWithCommas(withdrawalAmount)}원 출금 완료`,
          });
        } else {
          common.showAlertMessage(
            {
              title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} 예치금이 정상적으로 출금되지 않았습니다.`,
              message: `${numberWithCommas(withdrawalAmount)}원 출금 실패`,
            },
            undefined,
            undefined,
            false,
          );
        }
      }

      auth.refreshDeliveryAgencyStores();
    });
    subscribe(SOCKET.EVENT.DELAY_TIME_CHANGED, ({ deliveryAgencyId, delayTime }) => {
      if (isStoreInfoReceivable.value) {
        if (delayTime > 0) {
          common.showAlertMessage(
            {
              title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} 배달이 ${delayTime}분 지연됩니다.`,
              message: `배달 지연 ${delayTime}분`,
            },
            undefined,
            undefined,
            false,
          );
        } else {
          common.showAlertMessage({
            title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))} 배달 지연이 해제되었습니다.`,
            message: '-',
          });
        }
      }

      auth.refreshDeliveryAgencyStores();
    });
    subscribe(SOCKET.EVENT.EXTRA_CHARGE_CHANGED, ({ deliveryAgencyId, extraCharges }) => {
      const newExtraCharges = extraCharges.filter((extraCharge) => extraCharge.status === 'ON');
      const removedExtraCharges = extraCharges.filter((extraCharge) => extraCharge.status === 'OFF');
      if (newExtraCharges.length > 0) {
        const _getExtraChargeLabel = (rawExtraCharges) => {
          const grouped = rawExtraCharges.reduce((acc, extraCharge) => {
            acc[extraCharge.dataType] += extraCharge.charge;
            return acc;
          }, { FIXED: 0, RATE: 0 });

          const results = [];
          if (grouped.FIXED > 0) {
            results.push(`${numberWithCommas(grouped.FIXED)}원`);
          }
          if (grouped.RATE > 0) {
            results.push(`${numberWithCommas(grouped.RATE)}%`);
          }
          return results.join(', ');
        };
        common.showAlertMessage({
          title: removedExtraCharges.length > 0
            ? `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}'에서 할증 적용 합니다.`
            : `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}'에서 할증 적용 시작 합니다.`,
          message: `할증 (${_getExtraChargeLabel(newExtraCharges)})`,
        });
      } else {
        common.showAlertMessage({
          title: `'${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}'에서 할증 해제 합니다.`,
          message: '할증 적용 해제',
        });
      }

      auth.refreshDeliveryAgencyStores();
    });

    auth.$subscribe((mutation) => {
      if (mutation.type === 'direct'
        && mutation.events?.key === '_storeDeposits'
        && mutation.events?.newValue.some(({ deposit }) => deposit < 10000)) {
        const { deliveryAgencyId, deposit }
          = mutation.events.newValue.find(({ deposit: d }) => d < 10000);
        common.showAlertMessage(
          {
            title: `${t(`common.deliveryAgency.${deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}의 예치금이 부족합니다.`,
            message: `남은 예치금 ${numberWithCommas(deposit)} 원`,
          },
          undefined,
          undefined,
          false,
        );
      }
    });

    return {
      snackbar,
      alertMessages: computed(() => common.alertMessages),
      handleClosed: common.hideAlertMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  color: #000000;
}
.close-button-wrap {
  margin: -1rem -1.2rem;
}
.content {
  line-height: 18px;
  font-size: 12px;
  color: #616161;
}
</style>
