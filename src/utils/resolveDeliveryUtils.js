import { ORDER_TYPE, DELIVERY_STATUS } from '@constants';
import { addHyphenPhoneNumber } from './stringUtils';

const resolveDeliverySolutionMap = {
  [ORDER_TYPE.FOR_ORDER]: {
    [DELIVERY_STATUS.REJECTED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INCORRECT_STORE_INFO_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INCORRECT_DELIVERY_PRICE_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INSUFFICIENT_DEPOSIT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INVALID_AREA: [
        'ChangeToSelfDelivery',
      ],
      INVALID_ADDRESS: [
        'ChangeToSelfDelivery',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      TOO_LONG_DELIVERY_DISTANCE: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
      WRONG_REQUEST: [
        'ChangeToSelfDelivery',
      ],
    },
    [DELIVERY_STATUS.FAILED]: {
      ALLOCATION_FAILED: [
        'ChangeToSelfDelivery',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      DELIVERY_AGENCY_CAN_NOT_RESERVATION: [],
      DELIVERY_AGENCY_CAN_NOT_UNTACT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      DELIVERY_AGENCY_DISABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      EXTERNAL_NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      EXTERNAL_SERVER_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      EXTERNAL_SERVER_TIMEOUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      EXTERNAL_SERVER_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      EXTERNAL_SERVICE_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INTERNAL_SYSTEM_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      MAINTENANCE_TIME: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      NOT_ALLOW_EXTERNAL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      NONE_DELIVERY_AGENCY_MAPPING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
    },
    [DELIVERY_STATUS.CANCELED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CANCEL_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CANCEL_BY_INTERNAL_ADMIN: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CANCEL_BY_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CHANGE_CUSTOMER_MIND: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CHANGE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      COMPLAIN_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      DAMAGE_PRODUCT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      DELAY_DELIVERY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      INVALID_AREA: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
      NOT_ANSWER_RECEIVER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      SOLD_OUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      TIMEOUT_CANCEL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      UNDERAGE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
      ],
      WRONG_RECEIVER_INFO: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
      WRONG_REQUEST: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
      ],
    },
  },
  [ORDER_TYPE.ACCEPTED_ORDER]: {
    [DELIVERY_STATUS.REJECTED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INCORRECT_STORE_INFO_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INCORRECT_DELIVERY_PRICE_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INSUFFICIENT_DEPOSIT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INVALID_AREA: [
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INVALID_ADDRESS: [
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      TOO_LONG_DELIVERY_DISTANCE: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      WRONG_REQUEST: [
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
    },
    [DELIVERY_STATUS.FAILED]: {
      ALLOCATION_FAILED: [
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      DELIVERY_AGENCY_CAN_NOT_RESERVATION: [
        'HideOrder',
      ],
      DELIVERY_AGENCY_CAN_NOT_UNTACT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      DELIVERY_AGENCY_DISABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      EXTERNAL_NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      EXTERNAL_SERVER_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      EXTERNAL_SERVER_TIMEOUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      EXTERNAL_SERVER_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      EXTERNAL_SERVICE_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INTERNAL_SYSTEM_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      MAINTENANCE_TIME: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      NOT_ALLOW_EXTERNAL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      NONE_DELIVERY_AGENCY_MAPPING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
    },
    [DELIVERY_STATUS.CANCELED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CANCEL_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CANCEL_BY_INTERNAL_ADMIN: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CANCEL_BY_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CHANGE_CUSTOMER_MIND: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CHANGE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      COMPLAIN_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      DAMAGE_PRODUCT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      DELAY_DELIVERY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      INVALID_AREA: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      NOT_ANSWER_RECEIVER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      SOLD_OUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      TIMEOUT_CANCEL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      UNDERAGE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      WRONG_RECEIVER_INFO: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
      WRONG_REQUEST: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'HideOrder',
      ],
    },
  },
  [ORDER_TYPE.STORE_ORDER]: {
    [DELIVERY_STATUS.REJECTED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INCORRECT_STORE_INFO_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INCORRECT_DELIVERY_PRICE_SETTING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INSUFFICIENT_DEPOSIT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INVALID_AREA: [
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INVALID_ADDRESS: [
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      TOO_LONG_DELIVERY_DISTANCE: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      WRONG_REQUEST: [
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
    },
    [DELIVERY_STATUS.FAILED]: {
      ALLOCATION_FAILED: [
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      DELIVERY_AGENCY_CAN_NOT_RESERVATION: [
        'CancelOrder',
      ],
      DELIVERY_AGENCY_CAN_NOT_UNTACT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      DELIVERY_AGENCY_DISABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      EXTERNAL_NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      EXTERNAL_SERVER_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      EXTERNAL_SERVER_TIMEOUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      EXTERNAL_SERVER_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      EXTERNAL_SERVICE_UNAVAILABLE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INTERNAL_SYSTEM_ERROR: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      MAINTENANCE_TIME: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      NOT_ALLOW_EXTERNAL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      NOT_FOUND_RESOURCE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      NONE_DELIVERY_AGENCY_MAPPING: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
    },
    [DELIVERY_STATUS.CANCELED]: {
      BAD_WEATHER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CANCEL_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CANCEL_BY_INTERNAL_ADMIN: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CANCEL_BY_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CHANGE_CUSTOMER_MIND: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CHANGE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CLOSE_AGENCY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      CLOSE_STORE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      COMPLAIN_BY_CUSTOMER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      DAMAGE_PRODUCT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      DELAY_DELIVERY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      ETC: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      INVALID_AREA: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      NOT_ANSWER_RECEIVER: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      OVER_CAPACITY: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      SOLD_OUT: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      TIMEOUT_CANCEL: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      UNDERAGE: [
        'RequestDelivery',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      WRONG_RECEIVER_INFO: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
      WRONG_REQUEST: [
        'ModifyOrder',
        'ChangeToSelfDelivery',
        'CancelOrder',
      ],
    },
  },
};

const getResolveDeliverySolutions = (order, mainDelivery) =>
  (resolveDeliverySolutionMap[order.orderType]
    && resolveDeliverySolutionMap[order.orderType][mainDelivery.status]
    && resolveDeliverySolutionMap[order.orderType][mainDelivery.status][mainDelivery.cancelType])
  || [];

const getMainCauseLabel = (t, mainDelivery) => {
  let mainCauseLabel;
  if (mainDelivery.status === DELIVERY_STATUS.REJECTED) {
    mainCauseLabel = t(`errors.deliveryRejected.${mainDelivery.cancelType}`, t('errors.deliveryRejected.NONE'));
  } else
  if (mainDelivery.status === DELIVERY_STATUS.FAILED) {
    mainCauseLabel = t(`errors.deliveryFailed.${mainDelivery.cancelType}`, t('errors.deliveryFailed.NONE'));
  } else
  if (mainDelivery.status === DELIVERY_STATUS.CANCELED) {
    mainCauseLabel = t(`errors.deliveryCanceled.${mainDelivery.cancelType}`, t('errors.deliveryCanceled.NONE'));
  } else {
    mainCauseLabel = t('errors.deliveryCanceled.ETC');
  }
  return mainCauseLabel;
};

const getHelpInformationLabel = (t, order, mainDelivery) => {
  let helpInformationLabel;
  if (mainDelivery.cancelType === 'INSUFFICIENT_DEPOSIT') {
    helpInformationLabel = {
      type: 'DEPOSIT',
      message: t('common.layer.resolveDelivery.label.deposit.loading'),
    };
  } else
  if (mainDelivery.cancelType === 'INVALID_AREA'
    || mainDelivery.cancelType === 'INVALID_ADDRESS'
    || mainDelivery.cancelType === 'TOO_LONG_DELIVERY_DISTANCE') {
    helpInformationLabel = {
      type: 'ADDRESS',
      message: `${order.dropJibunAddress} ${order.dropAddressDetail}`,
    };
  } else
  if (mainDelivery.cancelType === 'CHANGE_CUSTOMER_MIND'
    || mainDelivery.cancelType === 'UNDERAGE'
    || mainDelivery.cancelType === 'NOT_ANSWER_RECEIVER'
    || mainDelivery.cancelType === 'SOLD_OUT') {
    helpInformationLabel = {
      type: 'ORDERER_PHONE',
      message: t('common.layer.resolveDelivery.label.customerPhone', { phone: addHyphenPhoneNumber(order.ordererPhone) }),
    };
  }
  return helpInformationLabel;
};

const getActionLabel = (t, type, order, mainDelivery) => {
  let actionLabel;
  let subHelpLabel;
  if (type === 'modifyOrder') {
    if (mainDelivery.cancelType === 'INVALID_AREA'
      || mainDelivery.cancelType === 'INVALID_ADDRESS'
      || mainDelivery.cancelType === 'TOO_LONG_DELIVERY_DISTANCE'
      || mainDelivery.cancelType === 'WRONG_REQUEST') {
      actionLabel = t('common.layer.resolveDelivery.label.wrongAddress');
    } else
    if (mainDelivery.cancelType === 'WRONG_RECEIVER_INFO') {
      actionLabel = t('common.layer.resolveDelivery.label.wrongReceiverInfo');
    } else {
      actionLabel = t('common.layer.resolveDelivery.label.modifyOrder');
    }
  } else
  if (type === 'requestDelivery') {
    if (mainDelivery.cancelType === 'OVER_CAPACITY'
      || mainDelivery.cancelType === 'CLOSE_AGENCY'
      || mainDelivery.cancelType === 'BAD_WEATHER') {
      actionLabel = t('common.layer.resolveDelivery.label.operateAgain');
    } else
    if (mainDelivery.cancelType === 'INSUFFICIENT_DEPOSIT') {
      actionLabel = t('common.layer.resolveDelivery.label.rechargeDeposit');
    } else
    if (mainDelivery.cancelType === 'NOT_FOUND_RESOURCE') {
      actionLabel = t('common.layer.resolveDelivery.label.checkConnection');
      subHelpLabel = t('common.layer.resolveDelivery.label.checkConnectionSub');
    } else {
      actionLabel = t('common.layer.resolveDelivery.label.solveProblem');
    }
  } else
  if (type === 'changeToSelfDelivery') {
    actionLabel = t('common.layer.resolveDelivery.label.changeToSelfDelivery');
  } else
  if (type === 'cancelOrder') {
    actionLabel = t('common.layer.resolveDelivery.label.cancelOrder');
  } else
  if (type === 'hideOrder') {
    actionLabel = t('common.layer.resolveDelivery.label.hideOrder');
    subHelpLabel = t('common.layer.resolveDelivery.label.hideOrderSub');
  }
  return {
    actionLabel,
    subHelpLabel,
  };
};

export {
  getResolveDeliverySolutions,
  getMainCauseLabel,
  getHelpInformationLabel,
  getActionLabel,
};
