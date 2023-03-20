import { ref } from 'vue';

import { DELIVERY_STATUS, CUSTOM_DSM_TYPE } from '@/constants';
import { useDeliveryStore, useCommonStore, useErrorsStore, useAuthStore } from '@/stores';
import i18n from '@/plugins/vueI18n';

const { t } = i18n.global;

const useDeliveryAsync = () => {
  const delivery = useDeliveryStore();
  const common = useCommonStore();
  const errors = useErrorsStore();
  const auth = useAuthStore();

  const isLoading = ref(true);
  const data = ref(null);
  const error = ref(null);
  const isSuccess = ref(false);

  // 상태변수 초기화
  const initAsyncState = () => {
    isLoading.value = true;
    data.value = null;
    error.value = null;
    isSuccess.value = false;
  };

  const setErrorCode = (code) => {
    error.value = { code };
  };

  // 배달 가능, 요금 조회
  const doDeliveryPossible = async (payload) => {
    try {
      initAsyncState();
      const { deliveryPossible } = await delivery.deliveryPossible({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = deliveryPossible.isPossible;

      if (!isSuccess.value) {
        setErrorCode(deliveryPossible.reason);
        return;
      }
      data.value = deliveryPossible;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      isLoading.value = false;
    }
  };

  // 배달 요청
  const doRequestDelivery = async (payload, order) => {
    try {
      initAsyncState();
      const { requestDelivery } = await delivery.requestDelivery({
        storeId: auth.currentStore.storeId,
        ...payload,
      });

      if (!requestDelivery.isSuccess) {
        if (requestDelivery.delivery?.status === DELIVERY_STATUS.REJECTED) {
          common.showDeliveryStatusModal({
            event: CUSTOM_DSM_TYPE.REQUEST_DELIVERY_REJECTED,
            message: {
              orderId: order.orderId,
              cancelType: requestDelivery.delivery?.cancelType || requestDelivery.reason,
              dropJibunAddress: order.dropJibunAddress,
              dropRoadAddress: order.dropRoadAddress,
              dropAddressDetail: order.dropAddressDetail,
            },
          });
        } else {
          setErrorCode(requestDelivery.reason);
        }
      } else {
        isSuccess.value = true;
      }
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value && error.value) {
        common.showToast('error', t(`errors.requestDelivery.${error.value.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  // 배달 취소
  const doCancelDelivery = async (payload, defaultErrorMessage) => {
    try {
      initAsyncState();
      const { cancelDelivery } = await delivery.cancelDelivery({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = cancelDelivery.isSuccess;

      if (!isSuccess.value) {
        setErrorCode(cancelDelivery.reason);
      }
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.cancelDelivery.${error.value.code}`, defaultErrorMessage));
      }
      isLoading.value = false;
    }
  };

  // 종결된 배달 재요청
  const doReRequestDelivery = async (payload, order) => {
    try {
      initAsyncState();
      const { reRequestDelivery } = await delivery.reRequestDelivery({
        storeId: auth.currentStore.storeId,
        ...payload,
      });

      if (!reRequestDelivery.isSuccess) {
        if (reRequestDelivery.delivery?.status === DELIVERY_STATUS.REJECTED) {
          common.showDeliveryStatusModal({
            event: CUSTOM_DSM_TYPE.REQUEST_DELIVERY_REJECTED,
            message: {
              orderId: order.orderId,
              cancelType: reRequestDelivery.delivery?.cancelType || reRequestDelivery.reason,
              dropJibunAddress: order.dropJibunAddress,
              dropRoadAddress: order.dropRoadAddress,
              dropAddressDetail: order.dropAddressDetail,
            },
          });
        } else {
          setErrorCode(reRequestDelivery.reason);
        }
      } else {
        isSuccess.value = true;
      }
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value && error.value) {
        common.showToast('error', t(`errors.requestDelivery.${error.value.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  // 출발 / 도착
  const doUpdateDeliveryStatus = async (payload) => {
    try {
      initAsyncState();
      await delivery.updateDeliveryStatus({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
    } catch (err) {
      common.showToast('error', t('errors.updateDeliveryStatus.UNKNOWN_SERVER_ERROR'));
    } finally {
      isLoading.value = false;
    }
  };

  // 배달 추가
  const doRequestDeliveryAddition = async (payload, order) => {
    try {
      initAsyncState();
      const { requestDeliveryAddition } = await delivery.requestDeliveryAddition({
        storeId: auth.currentStore.storeId,
        ...payload,
      });

      if (!requestDeliveryAddition.isSuccess) {
        if (requestDeliveryAddition.delivery?.status === DELIVERY_STATUS.REJECTED) {
          common.showDeliveryStatusModal({
            event: CUSTOM_DSM_TYPE.REQUEST_DELIVERY_REJECTED,
            message: {
              orderId: order.orderId,
              cancelType: requestDeliveryAddition.delivery?.cancelType
                || requestDeliveryAddition.reason,
              dropJibunAddress: order.dropJibunAddress,
              dropRoadAddress: order.dropRoadAddress,
              dropAddressDetail: order.dropAddressDetail,
            },
          });
        } else {
          setErrorCode(requestDeliveryAddition.reason);
        }
      } else {
        isSuccess.value = true;
      }
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value && error.value) {
        common.showToast('error', t(`errors.requestDelivery.${error.value.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    data,
    error,
    isSuccess,
    doRequestDelivery,
    doDeliveryPossible,
    doCancelDelivery,
    doReRequestDelivery,
    doUpdateDeliveryStatus,
    doRequestDeliveryAddition,
  };
};

export default useDeliveryAsync;
