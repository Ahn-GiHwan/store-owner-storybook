<template>
  <div class="content d-flex flex-column">
    <VRow class="row-item ma-0" v-for="(buttonSet, index) in buttons" v-bind:key="index">
      <VCol class="col-item" v-for="(button, subIndex) in buttonSet" v-bind:key="subIndex">
        <StoreButton
          v-if="button.eventEmitter"
          block
          variant="outlined"
          color="#BDBDBD"
          height="4rem"
          @click.stop="button.eventEmitter"
        >
          <span :class="button.danger ? 's-color-red-e5 font-weight-bold' : 'text-secondary'">
            {{ $t(button.label) }}
          </span>
        </StoreButton>
        <p v-else class="text-center font-size-12 font-weight-bold s-color-gray-bd">
          {{ $t(button.label) }}
        </p>
      </VCol>
    </VRow>
  </div>
</template>
<script>
import { computed, defineComponent } from 'vue';

import
{
  isNeedAccept,
  isAcceptTimeExpired,
  isSelfDeliveryCreated,
  isSelfDeliveryDeparted,
  isCancelableOrder,
  isHidableOrder,
  getMainDelivery,
  hasUntactImage,
  hasAdditionalDeliveries,
} from '@/utils/orderUtils';
import { ORDER_STATUS, ORDER_TYPE } from '@/constants';
import { useOrderDetailStore } from '@/stores';
import StoreButton from '@/components/common/StoreButton.vue';

export default defineComponent({
  name: 'OrderDetailBottomAction',
  components: {
    StoreButton,
  },
  emits: [
    'reject-order',
    'show-order-change-histories',
    'delivery-addition',
    'change-to-agency-delivery',
    'cancel-order',
    'show-untact-image',
    'reorder',
  ],
  setup(props, { emit }) {
    const orderDetail = useOrderDetailStore();
    const order = computed(() => orderDetail.getOrder);
    const orderChangeHistories = computed(() => orderDetail.getOrderChangeHistories);

    const BUTTON_TYPE = {
      REJECT_ORDER: 'REJECT_ORDER',
      ORDER_CHANGE_HISTORY: 'ORDER_CHANGE_HISTORY',
      CANCEL_ORDER: 'CANCEL_ORDER',
      CANNOT_CANCEL_ORDER: 'CANNOT_CANCEL_ORDER',
      DELIVERY_ADDITION: 'DELIVERY_ADDITION',
      CHANGE_TO_AGENCY_DELIVERY: 'CHANGE_TO_AGENCY_DELIVERY',
      UNTACT_IMAGE: 'UNTACT_IMAGE',
      REORDER: 'REORDER',
    };
    const BUTTON_INFO = {
      [BUTTON_TYPE.REJECT_ORDER]: {
        label: 'views.orderDetail.button.rejectOrder',
        eventEmitter: () => emit('reject-order'),
        danger: true,
      },
      [BUTTON_TYPE.ORDER_CHANGE_HISTORY]: {
        label: 'views.orderDetail.button.orderChangeHistory',
        eventEmitter: () => emit('show-order-change-histories'),
      },
      [BUTTON_TYPE.CANCEL_ORDER]: {
        label: 'views.orderDetail.button.cancelOrder',
        eventEmitter: () => emit('cancel-order'),
        danger: true,
      },
      [BUTTON_TYPE.CANNOT_CANCEL_ORDER]: {
        label: 'views.orderDetail.orderCard.message.cannotCancelOrder',
      },
      [BUTTON_TYPE.DELIVERY_ADDITION]: {
        label: 'views.orderDetail.button.deliveryAddition',
        eventEmitter: () => emit('delivery-addition'),
      },
      [BUTTON_TYPE.CHANGE_TO_AGENCY_DELIVERY]: {
        label: 'views.orderDetail.button.changeToAgencyDelivery',
        eventEmitter: () => emit('change-to-agency-delivery'),
      },
      [BUTTON_TYPE.UNTACT_IMAGE]: {
        label: 'views.orderDetail.button.untactImage',
        eventEmitter: () => emit('show-untact-image'),
      },
      [BUTTON_TYPE.REORDER]: {
        label: 'views.orderDetail.button.reorder',
        eventEmitter: () => emit('reorder'),
      },
    };

    const buttons = computed(() => {
      const _order = order.value;
      const _buttons = [];
      if (_order) {
        if (isNeedAccept(_order)) {
          _buttons.push(BUTTON_INFO[BUTTON_TYPE.REJECT_ORDER]);
        }
        if (orderChangeHistories.value?.length > 0) {
          _buttons.push(BUTTON_INFO[BUTTON_TYPE.ORDER_CHANGE_HISTORY]);
        }
        if (isCancelableOrder(_order)) {
          _buttons.push(BUTTON_INFO[BUTTON_TYPE.CANCEL_ORDER]);
        }
        if (!isNeedAccept(_order) && !isAcceptTimeExpired(_order)
          && !isCancelableOrder(_order) && !isHidableOrder(_order)
          && _order.orderType !== ORDER_TYPE.STORE_ORDER) {
          _buttons.push(BUTTON_INFO[BUTTON_TYPE.CANNOT_CANCEL_ORDER]);
        }
        if (_order.status !== ORDER_STATUS.FINISHED && _order.status !== ORDER_STATUS.CANCELED
          && _order.status !== ORDER_STATUS.FAILED && _order.status !== ORDER_STATUS.REJECTED) {
          if (getMainDelivery(_order)) {
            _buttons.push(BUTTON_INFO[BUTTON_TYPE.DELIVERY_ADDITION]);
          }
          if (isSelfDeliveryCreated(_order) || isSelfDeliveryDeparted(_order)) {
            _buttons.push(BUTTON_INFO[BUTTON_TYPE.CHANGE_TO_AGENCY_DELIVERY]);
          }
        } else {
          if (!hasAdditionalDeliveries(_order)
            && hasUntactImage(order.value, getMainDelivery(order.value))) {
            _buttons.push(BUTTON_INFO[BUTTON_TYPE.UNTACT_IMAGE]);
          }
          if (!_order.isMasked) {
            _buttons.push(BUTTON_INFO[BUTTON_TYPE.REORDER]);
          }
        }
      }
      return _buttons
        .sort((a, b) => (a.danger && !b.danger ? -1 : 1))
        .sort((a, b) => (a.eventEmitter && !b.eventEmitter ? -1 : 1))
        .reduce((acc, button) => {
          const lastItem = acc[acc.length - 1];
          // 마지막 줄이 (배열의 마지막 요소가)
          // 없거나 (배열 길이가 0)
          // 버튼이 두개 있거나
          // (버튼이 하나만 있는데) 글자만 있는 버튼인 경우
          // (버튼이 하나만 있는데) 현재 추가하려는 버튼이 글자만 있는 버튼인 경우
          if (lastItem === undefined
            || lastItem.length >= 2
            || !lastItem[0].eventEmitter
            || !button.eventEmitter) {
            // 다음줄에 버튼을 넣는다.
            acc.push([button]);
          } else {
            // (버튼이 하나만 있는데..) 글자만 있는 버튼이 아닌 경우
            // 같은 줄에 버튼을 추가한다.
            lastItem.push(button);
          }
          return acc;
        }, []);
    });

    return {
      buttons,
    };
  },
});
</script>
<style lang="scss" scoped>
.content {
  background: $color-gray-f5 !important;
}
:deep(.v-btn) {
  background-color: $color-gray-ff;
}

.row-item:first-child {
  .v-col {
    padding-bottom: 0;
  }
}

.col-item:nth-child(2) {
  padding-left: 0;
}
</style>
