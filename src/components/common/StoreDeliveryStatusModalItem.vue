<template>
  <VSnackbar
    v-model="snackbar"
    multi-line
    timeout="5000"
    width="100%"
    max-width="49rem"
    color="#111111"
    @update:modelValue="handleModalEvent"
    :style="`z-index: ${90000 + ($props.waitingDsmCount * 10)};`"
    @click="handleClick"
  >
    <VRow class="ma-0">
      <VCol class="pa-0 d-flex justify-space-between">
        <div class="w-100">
          <span class="title mr-2" :class="isNegative && 'negative'">{{ title }}</span>
          <p class="w-100 d-inline">
            <span
              v-for="(content, index) in contents"
              v-bind:key="index"
              class="content"
              :class="content.disabled && 'disabled'"
            >
              {{ content.label }}
            </span>
          </p>
        </div>
        <div class="close-button-wrap">
          <VBtn
            variant="text"
            @click.stop="handleClose"
            class="pa-0 text-right"
            size="x-small"
            icon="mdi-close"
          />
        </div>
      </VCol>
    </VRow>
    <VDivider class="my-2" color="rgba(255,255,255,0.1)"/>
    <VRow class="ma-0">
      <VCol class="pa-0">
        <span class="address">{{ address }}</span>
      </VCol>
    </VRow>
    <audio
      hidden="true"
      ref="audio"
    >
      <source :src="dsmSoundEffect" type="audio/wav">
    </audio>
    <div class="more py-2 px-8" v-if="snackbar && $props.waitingDsmCount > 0">
      +{{ $props.waitingDsmCount }}개 알림 보기
    </div>
  </VSnackbar>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useLocale } from 'vuetify';
import { useRouter, useRoute } from 'vue-router';

import dsmSoundEffect from '@/assets/sounds/delivery_status.wav';
import { SOCKET, CUSTOM_DSM_TYPE } from '@/constants';
import { timestampToDateTime } from '@/utils/dateUtils';
import { numberWithCommas } from '@/utils/stringUtils';
import { getPaymentMethod } from '@/utils/orderUtils';

export default defineComponent({
  name: 'StoreDeliveryStatusModalItem',
  components: {
  },
  props: {
    event: {
      type: String,
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
    },
    waitingDsmCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['closed'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const router = useRouter();
    const route = useRoute();
    const currentRouteName = computed(() => route.name);
    const snackbar = ref(true);
    const audio = ref(null);
    const isNegative = ref(false);
    const title = ref('');
    const contents = ref([]);
    const address = ref('');

    onMounted(() => {
      const promise = audio.value?.play();
      if (promise) {
        promise.then(() => {
          // Autoplay started!
        }).catch(() => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
      }
    });

    address.value = `${props.message.dropJibunAddress ? props.message.dropJibunAddress : ''} ${
      props.message.dropAddressDetail ? props.message.dropAddressDetail : ''}`;
    switch (props.event) {
      // order create
      case SOCKET.EVENT.ORDER_CREATE_FOR_ORDER:
      case SOCKET.EVENT.ORDER_CREATE_FOR_DELIVERY:
      case SOCKET.EVENT.ORDER_CREATE_ACCEPTED_ORDER:
      case SOCKET.EVENT.ORDER_CREATE_ADMIN_FOR_DELIVERY:
      case SOCKET.EVENT.ORDER_CREATE_STORE_ORDER:
        title.value = '주문 접수';
        contents.value.push({ label: '접수된 주문을 확인해주세요.' });
        break;
      // order status
      case SOCKET.EVENT.ORDER_SWITCH_RESERVATION:
        title.value = '배달 변경';
        contents.value.push({ label: '관리자 요청으로 예약배달로 주문이 변경되었습니다.' });
        break;
      case SOCKET.EVENT.ORDER_STATUS_CANCELED_UPDATE:
        title.value = '주문 취소';
        isNegative.value = true;
        contents.value.push({ label: '고객 요청으로 주문이 취소 되었습니다.' });
        break;
      // order update
      case SOCKET.EVENT.ORDER_PICKUP_WISH_AT_UPDATE:
        title.value = '정보 변경';
        contents.value.push({ label: '픽업 요청시간이 변경 되었습니다.' });
        break;
      case SOCKET.EVENT.ORDER_DROP_ADDRESS_UPDATE:
        title.value = '정보 변경';
        contents.value.push({ label: '고객주소가 변경 되었습니다.' });
        break;
      case SOCKET.EVENT.ORDER_PRODUCT_PAYMENT_UPDATE:
      case SOCKET.EVENT.DELIVERY_PAYMENT_UPDATE: // delivery update
        if (props.type === 'TAX_FREE_PAY_PRICE') {
          title.value = '정보 변경';
          contents.value.push({ label: `이전 1회용 컵 보증금 (${numberWithCommas(props.message.before.taxFreePayPrice)}원) ‣ `, disabled: true });
          contents.value.push({ label: `변경 1회용 컵 보증금 (${numberWithCommas(props.message.after.taxFreePayPrice)}원)` });
        } else {
          title.value = '결제 변경';
          contents.value.push({
            label: `${t(`common.paymentMethod.${getPaymentMethod(props.message.before)}`)
            } ${numberWithCommas(props.message.before.prepaidPrice + props.message.before.paymentCardPrice + props.message.before.paymentCashPrice)}원 ‣ `,
            disabled: true,
          });
          contents.value.push({
            label: `${t(`common.paymentMethod.${getPaymentMethod(props.message.after)}`)
            } (${[
              props.message.after.prepaidPrice > 0 && `${t('common.paymentMethod.PREPAID')} ${numberWithCommas(props.message.after.prepaidPrice)}원`,
              props.message.after.paymentCardPrice > 0 && `${t('common.paymentMethod.CARD')} ${numberWithCommas(props.message.after.paymentCardPrice)}원`,
              props.message.after.paymentCashPrice > 0 && `${t('common.paymentMethod.CASH')} ${numberWithCommas(props.message.after.paymentCashPrice)}원`,
            ].filter((method) => method).join(', ')})`,
          });
        }
        break;
      case SOCKET.EVENT.ORDER_PHONE_UPDATE:
        title.value = '정보 변경';
        contents.value.push({ label: '고객 연락처가 변경 되었습니다.' });
        break;
      case SOCKET.EVENT.ORDER_MEMO_UPDATE:
        title.value = '정보 변경';
        contents.value.push({ label: '요청사항이 변경 되었습니다.' });
        break;
      // delivery create
      case SOCKET.EVENT.DELIVERY_CREATE:
        title.value = '배달 추가';
        contents.value.push({ label: `${t(`common.deliveryAdditionType.${props.message.deliveryAdditionType}`, t('common.deliveryAdditionType.ETC'))}로 바로고 관리자가 배달을 한 건 더 추가했습니다.` });
        break;
      case SOCKET.EVENT.DELIVERY_SWITCH_SELF:
        title.value = '배달 변경';
        contents.value.push({ label: '관리자 요청으로 직접배달로 주문이 변경되었습니다.' });
        break;
      // delivery status
      case SOCKET.EVENT.DELIVERY_STATUS_ALLOCATED_UPDATE:
        title.value = '배차 완료';
        contents.value.push({ label: '접수 ‣ 배차' });
        contents.value.push({ label: ' ‣ 픽업 ‣ 완료', disabled: true });
        break;
      case SOCKET.EVENT.DELIVERY_STATUS_ALLOCATION_CANCELED_UPDATE:
        title.value = '배차 취소';
        isNegative.value = true;
        contents.value.push({ label: '접수' });
        contents.value.push({ label: ' ‣ 배차 ‣ 픽업 ‣ 완료', disabled: true });
        break;
      case SOCKET.EVENT.DELIVERY_STATUS_ALLOCATION_CHANGED_UPDATE:
        title.value = '라이더 변경';
        contents.value.push({ label: `${t(`common.deliveryAgency.${props.message.deliveryAgencyId}`, t('common.deliveryAgency.unknown'))}에서 담당 라이더를 변경했습니다.` });
        break;
      case SOCKET.EVENT.DELIVERY_STATUS_PICKUP_FINISHED_UPDATE:
        title.value = '픽업 완료';
        contents.value.push({ label: '접수 ‣ 배차 ‣ 픽업' });
        contents.value.push({ label: ' ‣ 완료', disabled: true });
        break;
      case SOCKET.EVENT.DELIVERY_STATUS_DROP_FINISHED_UPDATE:
        title.value = '배달 완료';
        contents.value.push({ label: '접수 ‣ 배차 ‣ 픽업 ‣ 완료' });
        break;
      case SOCKET.EVENT.DELIVERY_STATUS_CANCELED_UPDATE:
        title.value = '배달 취소';
        isNegative.value = true;
        contents.value.push({ label: t(`errors.deliveryCanceled.${props.message.deliveryCancelType}`, t('errors.deliveryCanceled.NONE')) });
        break;
      // delivery update
      case SOCKET.EVENT.DELIVERY_CHARGE_UPDATE:
        title.value = '대행료 변경';
        contents.value.push({ label: `주문 정보가 수정되어 대행료 ${numberWithCommas(props.message.totalDeliveryPrice + props.message.VATPrice)}원으로 변경되었습니다.` });
        break;
      case SOCKET.EVENT.DELIVERY_PICKUP_EXPECTED_AT_UPDATE:
        title.value = '픽업 시간 변경';
        contents.value.push({ label: `${timestampToDateTime(props.message.pickupExpectedAt, 'HH:mm')}에 픽업을 예상합니다.` });
        break;
      // case SOCKET.EVENT.DELIVERY_PAYMENT_UPDATE: - 위에 있음
      //   break;
      case SOCKET.EVENT.DELIVERY_DROP_WISH_AT_UPDATE:
        title.value = '정보 변경';
        contents.value.push({ label: `배달 예약 시간이 ${timestampToDateTime(props.message.afterDropWishAt)}로 변경되었습니다.` });
        break;
      case CUSTOM_DSM_TYPE.DELIVERY_PICKUP_EXPECTED_AT_CHANGED:
        title.value = '픽업 시간 변경';
        contents.value.push({ label: `${timestampToDateTime(props.message.pickupExpectedAt, 'HH:mm')}에 픽업을 예상합니다.` });
        break;
      case CUSTOM_DSM_TYPE.REQUEST_DELIVERY_REJECTED:
        title.value = '접수 실패';
        isNegative.value = true;
        contents.value.push({ label: t(`errors.requestDelivery.${props.message.cancelType}`, t('errors.requestDelivery.UNKNOWN_SERVER_ERROR')) });
        break;
      default:
        snackbar.value = false;
    }

    const closeModal = () => {
      snackbar.value = false;
      emit('closed');
    };

    return {
      snackbar,
      audio,
      dsmSoundEffect,
      isNegative,
      title,
      contents,
      address,
      handleModalEvent: (modelValue) => {
        // 자동으로 닫힐 때 호출됨
        if (!modelValue) {
          emit('closed');
        }
      },
      handleClick: () => {
        // DSM을 클릭할 때 호출됨
        closeModal();

        if (currentRouteName.value === 'OrderDetail') {
          router.replace({ name: 'OrderDetail', params: { orderId: props.message.orderId } });
        } else {
          router.push({ name: 'OrderDetail', params: { orderId: props.message.orderId } });
        }
      },
      handleClose: () => {
        // 닫기 버튼을 누를 때 호출됨
        closeModal();
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  color: #41CF6D;
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  &.negative {
    color: #E53935;
  }
}
.content {
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
  &.disabled {
    color: #616161;
  }
}
.close-button-wrap {
  margin: -1rem -1.2rem;
}
.address {
  line-height: 18px;
  font-size: 12px;
}
.more {
  position: absolute;
  top: -4rem;
  right: 0.4rem;
  background: #000000;
  border-radius: 10rem;
  font-weight: 700;
  line-height: 18px;
  font-size: 12px;
}
.v-snackbar:not(.v-snackbar--absolute) {
  height: 100%;
  position: fixed;
  z-index: 9999;
}
</style>
