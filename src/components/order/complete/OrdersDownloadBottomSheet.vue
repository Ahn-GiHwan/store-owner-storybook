<template>
  <StoreBottomSheet>
    <template #title>
      <div class="text-left font-size-16 font-weight-bold mb-2">
        {{ $t('views.orderComplete.ordersDownloadBottomSheet.title') }}
      </div>
    </template>
    <template #content>
      <div class="text-left font-size-14 text-break mt-2">
        {{ description }}
      </div>

      <div v-if="downloadStatus === DOWNLOAD_STATUS.READY"
        class="download-info-wrapper mt-2 pt-1 pb-1">
        <div class="ml-2 mt-1 mb-1 text-left"
            v-for="(item, index) in downloadInfoItems" :key="index">
          <span class="download-info-title font-size-12 s-color-gray-66">{{ item.title }}</span>
          <span class="ml-2 s-color-black-11 font-size-12 ">{{ item.value }} </span>
        </div>
      </div>
      <div v-else class="mt-7">
        <VProgressLinear
          :height="8"
          v-model="progressValue"
          color="primary"
          ></VProgressLinear>
          <div class="mt-2 font-size-14 s-color-gray-61">
            {{ excelFileProgressText }}
          </div>
      </div>

      <div class="mt-4 mb-2">
        <StoreButton
            :disabled="downloadStatus === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS"
            block
            color="primary"
            @click.stop="downloadOrders()"
          >
            <span class="font-weight-bold">
              {{ downloadButtonText }}
            </span>
          </StoreButton>
      </div>
    </template>
  </StoreBottomSheet>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useLocale } from 'vuetify';
import { useLogger } from 'vue-logger-plugin';

import useSocket from '@/composables/useSocket';
import { useAuthStore, useCommonStore } from '@/stores';

import { timestampToDateTime } from '@/utils/dateUtils';

// 결제수단 관련은 추후에 PAYMENT_METHOD 추가
import { ORDER_STATUS, DELIVERY_TYPE, SOCKET, PROGRESS_INCREASE_UNIT } from '@/constants';

import StoreBottomSheet from '@/components/common/StoreBottomSheet.vue';
import StoreButton from '@/components/common/StoreButton.vue';

const DOWNLOAD_STATUS = {
  READY: 'READY',
  PREPARE_IN_PROGRESS: 'PREPARE_IN_PROGRESS',
  PREPARE_SUCCESS: 'PREPARE_SUCCESS',
};

export default defineComponent({
  name: 'OrdersDownloadBottomSheet',
  components: {
    StoreBottomSheet,
    StoreButton,
  },
  emits: ['close'],
  props: {
    selectedFilterInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const auth = useAuthStore();
    const common = useCommonStore();
    const logger = useLogger();
    const { subscribe, unsubscribe, reconnect } = useSocket();
    const { t } = useLocale();

    const progressValue = ref(0);
    const downloadStatus = ref(DOWNLOAD_STATUS.READY);
    let fileDownloadUrl;

    const isDownloadPreparing = computed(() =>
      downloadStatus.value === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS);
    const isDownloadPrepareSuccess = computed(() =>
      downloadStatus.value === DOWNLOAD_STATUS.PREPARE_SUCCESS);

    const description = computed(() =>
      (downloadStatus.value === DOWNLOAD_STATUS.READY
        ? t('views.orderComplete.ordersDownloadBottomSheet.description')
        : t('views.orderComplete.ordersDownloadBottomSheet.descriptionPreparing')));
    const downloadButtonText = computed(() =>
      (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS
        ? t('views.orderComplete.ordersDownloadBottomSheet.button.downloadPreparing')
        : t('views.orderComplete.ordersDownloadBottomSheet.button.excelDownload')));
    const excelFileProgressText = computed(() =>
      (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS
        ? t('views.orderComplete.ordersDownloadBottomSheet.label.excelFilePreparing')
        : t('views.orderComplete.ordersDownloadBottomSheet.label.excelFilePrepareSuccess')));

    const _orderStatusToText = (orderStatus) => {
      if (orderStatus.length === 1) {
        if (orderStatus[0] === ORDER_STATUS.FINISHED) {
          return t('views.orderComplete.ordersDownloadBottomSheet.label.finished');
        } if (orderStatus[0] === ORDER_STATUS.CANCELED) {
          return t('views.orderComplete.ordersDownloadBottomSheet.label.canceled');
        }
      }

      return t('views.orderComplete.ordersDownloadBottomSheet.label.allOrder');
    };

    const _orderOptionToText = (orderOption) => {
      if (orderOption[1] === 'DESC') {
        return t('views.orderComplete.ordersDownloadBottomSheet.label.orderOptionDesc');
      }

      return t('views.orderComplete.ordersDownloadBottomSheet.label.orderOptionAsc');
    };

    const _deliveryTypeToText = (deliveryType) => {
      if (deliveryType === DELIVERY_TYPE.SELF) {
        return t('views.orderComplete.ordersDownloadBottomSheet.label.selfDeliveryType');
      } if (deliveryType === DELIVERY_TYPE.AGENCY) {
        return t('views.orderComplete.ordersDownloadBottomSheet.label.agencyDeliveryType');
      }

      return t('views.orderComplete.ordersDownloadBottomSheet.label.allDeliveryType');
    };

    // 결제수단 관련 - 추후에 적용
    // const _paymentMethodToText = (paymentMethod) => {
    //   if (paymentMethod === PAYMENT_METHOD.PREPAID) {
    //     return t('views.orderComplete.ordersDownloadBottomSheet.label.prepaidPaymentMethod');
    //   }

    //   if (paymentMethod === PAYMENT_METHOD.CASH) {
    //     return t('views.orderComplete.ordersDownloadBottomSheet.label.cashPaymentMethod');
    //   }

    //   if (paymentMethod === PAYMENT_METHOD.CARD) {
    //     return t('views.orderComplete.ordersDownloadBottomSheet.label.cardPaymentMethod');
    //   }

    //   if (paymentMethod === PAYMENT_METHOD.MIXED_PAYMENT) {
    //     return t('views.orderComplete.ordersDownloadBottomSheet.label.mixedPaymentMetohd');
    //   }

    //   return t('views.orderComplete.ordersDownloadBottomSheet.label.paymentMethodAll');
    // };

    const downloadInfoItems = computed(() => [
      {
        title: t('views.orderComplete.ordersDownloadBottomSheet.label.createdAt'),
        value: `${timestampToDateTime(props.selectedFilterInfo.createdAt.startAt, 'YYYY-MM-DD')} - ${timestampToDateTime(props.selectedFilterInfo.createdAt.endAt, 'YYYY-MM-DD')}`,
      },
      {
        title: t('views.orderComplete.ordersDownloadBottomSheet.label.orderStatus'),
        value: _orderStatusToText(props.selectedFilterInfo.orderStatus),
      },
      {
        title: t('views.orderComplete.ordersDownloadBottomSheet.label.orderOption'),
        value: _orderOptionToText(props.selectedFilterInfo.orderOption),
      },
      // 결제수단 관련 - 추후에 적용
      // {
      //   title: t('views.orderComplete.ordersDownloadBottomSheet.label.paymentMethod'),
      //   value: _paymentMethodToText(props.selectedFilterInfo.paymentMethod),
      // },
      {
        title: t('views.orderComplete.ordersDownloadBottomSheet.label.deliveryType'),
        value: _deliveryTypeToText(props.selectedFilterInfo.deliveryType),
      },
      {
        title: t('views.orderComplete.ordersDownloadBottomSheet.label.orderCount'),
        value: t('views.orderComplete.ordersDownloadBottomSheet.label.count', { value: props.selectedFilterInfo.orderCount }),
      },
    ]);

    const _increaseProgress = () => {
      if (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS) {
        setTimeout(() => {
          if (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_SUCCESS) {
            return;
          }

          progressValue.value += PROGRESS_INCREASE_UNIT;
          if (progressValue.value > 100) {
            emit('close');
            downloadStatus.value = DOWNLOAD_STATUS.READY;
            progressValue.value = 0;
            common.showToast('error', t('views.orderComplete.ordersDownloadBottomSheet.message.downloadPreparedFail'));
          }
        }, 1000);
      }
    };

    const downloadOrders = async () => {
      if (downloadStatus.value === DOWNLOAD_STATUS.READY) {
        const payload = {
          storeId: auth.currentStore.storeId,
          createdAt: {
            startAt: props.selectedFilterInfo.createdAt.startAt,
            endAt: props.selectedFilterInfo.createdAt.endAt,
          },
          orderOption: props.selectedFilterInfo.orderOption,
          orderStatus: props.selectedFilterInfo.orderStatus,
          paymentMethod: props.selectedFilterInfo.paymentMethod,
        };

        if (props.selectedFilterInfo.deliveryType) {
          payload.deliveryType = props.selectedFilterInfo.deliveryType;
        }

        try {
          await common.downloadOrders(payload);
        } catch (error) {
          logger.error(error);
          return;
        }

        downloadStatus.value = DOWNLOAD_STATUS.PREPARE_IN_PROGRESS;
        _increaseProgress();
      } else if (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_SUCCESS) {
        try {
          // NOTE: 링크를 통한 즉시 다운로드 실행 코드
          const element = document.createElement('a');
          element.href = fileDownloadUrl;
          element.download = ''; // 브라우저마다 동작이 달라서 해당 속성을 추가함
          element.click();
          element.remove();

          // NOTE: a 태그로 다운로드 시, 크롬에서 소켓연결이 끊어지는 이슈 강제로 reconnect 하도록 수정함
          reconnect();
          common.showToast('success', t('views.orderComplete.ordersDownloadBottomSheet.message.downloadPreparedSuccess'));
        } catch (error) {
          common.showToast('error', t('views.orderComplete.ordersDownloadBottomSheet.message.downloadPreparedFail'));
          logger.error(error);
        }

        emit('close');
        downloadStatus.value = DOWNLOAD_STATUS.READY;
        progressValue.value = 0;
      }
    };

    watch(progressValue, () => {
      if (progressValue.value >= 100) {
        return;
      }

      _increaseProgress();
    });

    const cancelDownload = () => {
      downloadStatus.value = DOWNLOAD_STATUS.READY;
      progressValue.value = 0;

      common.showToast('error', t('views.orderComplete.ordersDownloadBottomSheet.message.downloadCanceled'));
    };

    const downloadPreparedHandler = (message) => {
      if (downloadStatus.value === DOWNLOAD_STATUS.PREPARE_IN_PROGRESS) {
        const { isSuccess, downloadUrl, message: _message } = message;
        if (isSuccess && downloadUrl) {
          downloadStatus.value = DOWNLOAD_STATUS.PREPARE_SUCCESS;
          progressValue.value = 100;
          fileDownloadUrl = downloadUrl;
        } else {
          logger.error(_message);
          emit('close');
          downloadStatus.value = DOWNLOAD_STATUS.READY;
          progressValue.value = 0;
          common.showToast('error', t('views.orderComplete.ordersDownloadBottomSheet.message.downloadPreparedFail'));
        }
      }
    };

    onMounted(() => {
      subscribe(SOCKET.EVENT.DOWNLOAD_STATUS_PREPARED, downloadPreparedHandler);
    });

    onUnmounted(() => {
      unsubscribe(SOCKET.EVENT.DOWNLOAD_STATUS_PREPARED, downloadPreparedHandler);
    });

    return {
      downloadInfoItems,
      downloadOrders,
      isDownloadPreparing,
      isDownloadPrepareSuccess,
      progressValue,
      downloadStatus,
      description,
      downloadButtonText,
      excelFileProgressText,
      DOWNLOAD_STATUS,
      cancelDownload,
    };
  },
});
</script>

<style lang="scss" scoped>
.download-info-wrapper {
  background: $color-gray-f5;
  border-radius: 4px;
}

.download-info-title {
  display: inline-block;
  width: 56px;
}
</style>
