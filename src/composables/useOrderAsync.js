import { ref } from 'vue';

import { useAuthStore, useOrderStore, useCommonStore, useErrorsStore } from '@/stores';
import { oneDay } from '@/utils/dateUtils';
import i18n from '@/plugins/vueI18n';

const { t } = i18n.global;

const useOrderAsync = () => {
  const common = useCommonStore();
  const errors = useErrorsStore();
  const _order = useOrderStore();
  const auth = useAuthStore();

  const isLoading = ref(false);
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

  const doGetOrders = async () => {
    try {
      initAsyncState();
      const currentTime = common.systemTimestamp;
      const payload = {
        createdAt: {
          startAt: currentTime - oneDay,
          endAt: currentTime + oneDay,
        },
        dropWishAt: {
          startAt: currentTime - oneDay,
          endAt: currentTime + 60 * oneDay,
        },
      };

      // 주문리스트 조회
      await _order.orders({
        storeId: auth.currentStore.storeId,
        ...payload,
      });

      isSuccess.value = true;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
      isSuccess.value = false;
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.requestDelivery.${error.value.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  const doGetOrdersPagination = async (where) => {
    try {
      initAsyncState();

      // 주문리스트 조회
      await _order.ordersPagination({
        storeId: auth.currentStore.storeId,
        where,
      });

      isSuccess.value = true;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
      isSuccess.value = false;
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.requestDelivery.${error.value.code}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')));
      }

      isLoading.value = false;
    }
  };

  const doAcceptOrder = async (payload) => {
    try {
      initAsyncState();
      const { acceptOrder } = await _order.acceptOrder({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = acceptOrder.isSuccess;

      if (!isSuccess.value) {
        setErrorCode(acceptOrder.reason);
      }
      data.value = acceptOrder;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.acceptOrder.${error.value.code}`, t('errors.acceptOrder.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  const doRejectOrder = async (payload) => {
    try {
      initAsyncState();
      const { rejectOrder } = await _order.rejectOrder({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = rejectOrder.isSuccess;

      if (!isSuccess.value) {
        setErrorCode(rejectOrder.reason);
      }
      data.value = rejectOrder;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.rejectOrder.${error.value.code}`, t('errors.rejectOrder.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  const doCancelOrder = async (payload) => {
    try {
      initAsyncState();
      const { cancelOrder } = await _order.cancelOrder({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = cancelOrder.isSuccess;

      if (!isSuccess.value) {
        setErrorCode(cancelOrder.reason);
      }
      data.value = cancelOrder;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.cancelOrder.${error.value.code}`, t('errors.cancelOrder.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  const doUpdateOrderStoreDropExpectedAt = async (payload) => {
    try {
      initAsyncState();
      const { updateOrderStoreDropExpectedAt } = await _order.updateOrderStoreDropExpectedAt({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = true;

      data.value = updateOrderStoreDropExpectedAt;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t('errors.updateOrderStoreDropExpectedAt.UNKNOWN_SERVER_ERROR'));
      }
      isLoading.value = false;
    }
  };

  const doPrepareOrderForNotification = async (payload) => {
    try {
      initAsyncState();
      const { prepareOrderForNotification } = await _order.prepareOrderForNotification({
        storeId: auth.currentStore.storeId,
        ...payload,
      });
      isSuccess.value = prepareOrderForNotification.isSuccess;

      if (!isSuccess.value) {
        setErrorCode(prepareOrderForNotification.reason);
      }
      data.value = prepareOrderForNotification;
    } catch (err) {
      setErrorCode(errors.convertedError?.code || errors.errorCode);
    } finally {
      if (!isSuccess.value) {
        common.showToast('error', t(`errors.prepareOrderForNotification.${error.value.code}`, t('errors.prepareOrderForNotification.UNKNOWN_SERVER_ERROR')));
      }
      isLoading.value = false;
    }
  };

  return {
    doGetOrdersPagination,
    doGetOrders,
    isLoading,
    data,
    error,
    isSuccess,
    doAcceptOrder,
    doRejectOrder,
    doCancelOrder,
    doUpdateOrderStoreDropExpectedAt,
    doPrepareOrderForNotification,
  };
};

export default useOrderAsync;
