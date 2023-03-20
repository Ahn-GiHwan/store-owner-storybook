import { DELIVERY_TYPE, DELIVERY_STATUS } from '@/constants';

// valeu 가 없어도 에러가 나지 않도록 빈 객체를 리턴하는 래퍼
const objectParamWrapper = (fn) => (value) => (fn(value || {}));

const isSelfDelivery = objectParamWrapper((delivery) =>
  delivery.deliveryType === DELIVERY_TYPE.SELF);

const isAgencyDelivery = objectParamWrapper((delivery) =>
  delivery.deliveryType === DELIVERY_TYPE.AGENCY);

const DELIVERY_STATUS_GROUP_TYPE = {
  BEFORE_ALLOCATED: 'BEFORE_ALLOCATED',
  ALLOCATED: 'ALLOCATED',
  BEFORE_PICKUP_FINISHED: 'BEFORE_PICKUP_FINISHED',
  PICKUP_FINISHED: 'PICKUP_FINISHED',
  BEFORE_DROP_FINISHED: 'BEFORE_DROP_FINISHED',
  DROP_FINISHED: 'DROP_FINISHED',
  NOT_FAILED: 'NOT_FAILED',
  FAILED: 'FAILED',
  AT_LEAST_ALLOCATED: 'AT_LEAST_ALLOCATED',
  AT_LEAST_PICKUP_FINISHED: 'AT_LEAST_PICKUP_FINISHED',
};

const DELIVERY_STATUS_GROUP = {};

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.BEFORE_ALLOCATED
] = [
  DELIVERY_STATUS.CREATED,
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.ACCEPTED,
  DELIVERY_STATUS.ALLOCATION_CANCELED,
];

const isBeforeAllocatedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_ALLOCATED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.ALLOCATED
] = [
  DELIVERY_STATUS.ALLOCATED,
  DELIVERY_STATUS.ALLOCATION_CHANGED,
  DELIVERY_STATUS.COOK_REQUESTED,
  DELIVERY_STATUS.ARRIVED,
];

const isAllocatedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.ALLOCATED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.BEFORE_PICKUP_FINISHED
] = [
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_ALLOCATED],
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.ALLOCATED],
];

const isBeforePickupFinishedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_PICKUP_FINISHED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.PICKUP_FINISHED
] = [
  DELIVERY_STATUS.PICKUP_FINISHED,
];

const isPickupFinishedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.PICKUP_FINISHED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.BEFORE_DROP_FINISHED
] = [
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_PICKUP_FINISHED],
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.PICKUP_FINISHED],
];

const isBeforeDropFinishedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_DROP_FINISHED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.DROP_FINISHED
] = [
  DELIVERY_STATUS.DROP_FINISHED,
];

const isDropFinishedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.DROP_FINISHED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.NOT_FAILED
] = [
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_DROP_FINISHED],
  DELIVERY_STATUS.DROP_FINISHED,
];

const isNotFailedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.NOT_FAILED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.FAILED
] = [
  DELIVERY_STATUS.CANCELED,
  DELIVERY_STATUS.REJECTED,
  DELIVERY_STATUS.FAILED,
];

const isFailedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.FAILED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.AT_LEAST_PICKUP_FINISHED
] = [
  DELIVERY_STATUS.PICKUP_FINISHED,
  DELIVERY_STATUS.DROP_FINISHED,
];

const isAtLeastPickupFinishedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.AT_LEAST_PICKUP_FINISHED]
    .includes(delivery.status));

DELIVERY_STATUS_GROUP[
  DELIVERY_STATUS_GROUP_TYPE.AT_LEAST_ALLOCATED
] = [
  DELIVERY_STATUS.ALLOCATED,
  DELIVERY_STATUS.ALLOCATION_CHANGED,
  DELIVERY_STATUS.COOK_REQUESTED,
  DELIVERY_STATUS.ARRIVED,
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.AT_LEAST_PICKUP_FINISHED],
];

const isAtLeastAllocatedDelivery = objectParamWrapper((delivery) =>
  DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.AT_LEAST_ALLOCATED]
    .includes(delivery.status));

const hasRiderDelivery = objectParamWrapper((delivery) => ![
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.BEFORE_ALLOCATED],
  ...DELIVERY_STATUS_GROUP[DELIVERY_STATUS_GROUP_TYPE.FAILED],
].includes(delivery.status));

const isDeferedPriceChanged = (order, delivery) =>
  order.paymentCardPrice !== delivery.paymentCardPrice
  || order.paymentCashPrice !== delivery.paymentCashPrice
  || order.prepaidPrice !== delivery.prepaidPrice
  || order.taxFreePayPrice !== delivery.taxFreePayPrice;

const deliveryStatusPriorityMap = {
  [DELIVERY_STATUS.CREATED]: 2,
  [DELIVERY_STATUS.ASSIGNED]: 2,
  [DELIVERY_STATUS.ACCEPTED]: 2,
  [DELIVERY_STATUS.ALLOCATED]: 3,
  [DELIVERY_STATUS.ALLOCATION_CANCELED]: 2,
  [DELIVERY_STATUS.ALLOCATION_CHANGED]: 3,
  [DELIVERY_STATUS.COOK_REQUESTED]: 3,
  [DELIVERY_STATUS.ARRIVED]: 3,
  [DELIVERY_STATUS.PICKUP_FINISHED]: 4,
  [DELIVERY_STATUS.DROP_FINISHED]: 5,
  [DELIVERY_STATUS.CANCELED]: 1,
  [DELIVERY_STATUS.REJECTED]: 1,
  [DELIVERY_STATUS.FAILED]: 1,
};

const statusPrioritySorter = (a, b) =>
  (deliveryStatusPriorityMap[a.status] < deliveryStatusPriorityMap[b.status] ? -1 : 1);

const createdTimeSorter = (a, b) => (b.createdAt - a.createdAt);

export {
  isSelfDelivery,
  isAgencyDelivery,
  DELIVERY_STATUS_GROUP,
  DELIVERY_STATUS_GROUP_TYPE,
  isBeforeAllocatedDelivery,
  isAllocatedDelivery,
  isBeforePickupFinishedDelivery,
  isPickupFinishedDelivery,
  isBeforeDropFinishedDelivery,
  isDropFinishedDelivery,
  isNotFailedDelivery,
  isFailedDelivery,
  isAtLeastPickupFinishedDelivery,
  isAtLeastAllocatedDelivery,
  hasRiderDelivery,
  isDeferedPriceChanged,
  statusPrioritySorter,
  createdTimeSorter,
};
