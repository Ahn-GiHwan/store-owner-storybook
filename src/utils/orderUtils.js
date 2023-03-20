import {
  AGENCY_INFO,
  DELIVERY_STATUS,
  ORDER_SERVE_TYPE,
  ORDER_STATUS,
  ORDER_TYPE,
  DELIVERY_TYPE_DATA,
  DATE_SORTING_DATA,
  ORDER_STATUS_DATA,
  DATE_PERIOD_DATA,
  STORE_TYPE,
  ORDER_PRODUCT_TYPE,
  PAYMENT_METHOD,
  ORDER_CHANNEL,
} from '@/constants';

import { useCommonStore, useAuthStore } from '@/stores';
import { diffMinutes, oneMinute, getDatePeriod } from '@/utils/dateUtils';
import {
  isSelfDelivery,
  isAgencyDelivery,
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
} from '@/utils/deliveryUtils';

const preDefinedOrderChannels = [
  '13mile',
  'admin',
  'ainopos',
  'amore_aritaum',
  'angelinus',
  'angelsoft',
  'baechelin',
  'baegofa',
  'baemin',
  'baemin_delivery',
  'barogo_hq',
  'barogo_hub',
  'barogo_store',
  'beyondpos',
  'bgfretail',
  'bhc',
  'cj_food_vips',
  'css',
  'daegu',
  'daeguro',
  'daonfresh',
  'doyajokbalnfood',
  'dreamnhappy',
  'emart24',
  'firstkitchen',
  'foodtech',
  'gs_lalavla',
  'honeybees',
  'hyundaidept',
  'imtsoft',
  'kfc',
  'kiosk',
  'konai',
  'krispykreme',
  'lastorder',
  'lotteria',
  'meatpeople',
  'mfgkorea',
  'mybell',
  'myeongsu',
  'myungsu',
  'nhnpayco',
  'nowbusking',
  'nowpick',
  'oliveyoung',
  'payco',
  'pos',
  'posbank',
  'posfeed',
  'self',
  'sf_nobrandburger',
  'sf_nobrandpizza',
  'shuttle',
  'somunnanshop',
  'sp_br_baskinrobbins',
  'spc',
  'spiderinc',
  'starbucks',
  'tengo',
  'tgif',
  'tonymoly',
  'ulsanpay',
  'unionsoft',
  'unknown',
  'wemakepriceo',
  'wmpo',
  'yogiyo',
  'yogiyo_delivery',
];

// 주문의 메인 배달을 찾아줍니다.
const getMainDelivery = (order) => {
  const { deliveries } = order;

  if (deliveries) {
    const sorted = deliveries
      // 추가배달이 아닌 일반 배달에 대해서
      .filter((value) => !value.additionType && !value.parentDeliveryId)
      // 배달 생성 순 최신순 정렬
      .sort((a, b) => b.createdAt - a.createdAt);

    if (sorted.length > 0) {
      return sorted[0];
    }
  }
  return null;
};

// 주문의 추가 배달을 찾아줍니다.
const getAdditionalDeliveries = (order) => {
  if (order?.deliveries.length > 0) {
    return order.deliveries.filter((delivery) => !!delivery.additionType);
  }
  return [];
};

const hasAfterAllocated = (order) => {
  if (order) {
    return order.deliveries.filter(isAtLeastAllocatedDelivery).length > 0;
  }

  return false;
};

// 상품 중 배달팁이 존재하는지 여부를 리턴합니다.
const hasDeliveryTip = (order) => {
  const { orderProducts } = order;

  if (orderProducts) {
    const deliveryTips = orderProducts.filter(
      (value) => value.type === ORDER_PRODUCT_TYPE.DELIVERY_TIP,
    );

    return deliveryTips.length > 0;
  }
  return false;
};

// 배달팁 금액의 합계를 리턴합니다.
const deliveryTipPrice = (order) => {
  const { orderProducts } = order;

  let sum = 0;

  if (orderProducts) {
    const deliveryTips = orderProducts.filter(
      (value) => value.type === ORDER_PRODUCT_TYPE.DELIVERY_TIP,
    );
    for (let i = 0; i < deliveryTips.length; i += 1) {
      sum += deliveryTips[i].totalPrice;
    }
  }

  return sum;
};

// 주문의 결제 방식을 리턴합니다.
const getPaymentMethod = (order) => {
  const {
    prepaidPrice,
    paymentCashPrice,
    paymentCardPrice,
  } = order;

  if (prepaidPrice > 0 && paymentCashPrice === 0 && paymentCardPrice === 0) {
    return PAYMENT_METHOD.PREPAID;
  }

  if (prepaidPrice === 0 && paymentCashPrice > 0 && paymentCardPrice === 0) {
    return PAYMENT_METHOD.CASH;
  }

  if (prepaidPrice === 0 && paymentCashPrice === 0 && paymentCardPrice > 0) {
    return PAYMENT_METHOD.CARD;
  }

  return PAYMENT_METHOD.MIXED_PAYMENT;
};

const getTotalProductPrice = (orderProducts) => {
  let price = 0;

  if (orderProducts) {
    for (let i = 0; i < orderProducts.length; i += 1) {
      let optionsPrice = 0;
      if (orderProducts[i].orderProductOptions) {
        for (let j = 0; j < orderProducts[i].orderProductOptions.length; j += 1) {
          optionsPrice +=
            orderProducts[i].orderProductOptions[j].unitPrice *
            orderProducts[i].orderProductOptions[j].quantity;
        }
      }
      // 단위 금액 * 갯수 + 옵션의 금액 * 갯수
      price += (orderProducts[i].unitPrice + optionsPrice) * orderProducts[i].quantity;
    }
  }
  return price;
};

const getTemporaryProduct = (orderProducts) => {
  if (Array.isArray(orderProducts)) {
    const index = orderProducts.findIndex(
      (value) => value.type === ORDER_PRODUCT_TYPE.TEMPORARY,
    );
    if (index > -1) {
      return orderProducts[index];
    }
  }
  return null;
};

const getProductPriceExcludeTemporary = (orderProducts) => {
  const tempProduct = getTemporaryProduct(orderProducts);
  if (tempProduct) {
    return getTotalProductPrice(orderProducts) - tempProduct.totalPrice;
  }
  return getTotalProductPrice(orderProducts);
};

const makeTemporaryProduct = () => ({
  type: ORDER_PRODUCT_TYPE.TEMPORARY,
  name: '임의 상품',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  storeProductId: 0,
  orderProductOptions: [],
});

const isOrderProductOptionEquals = (srcOption, targetOption) => (
  srcOption.name === targetOption.name &&
    srcOption.unitPrice === targetOption.unitPrice &&
    srcOption.quantity === targetOption.quantity
);

const isOrderProductOptionsEquals = (srcOptions, targetOptions) =>
  srcOptions.every((value, index) => isOrderProductOptionEquals(value, targetOptions[index]));

const isOrderProductEquals = (srcProduct, targetProduct) => (
  srcProduct.type === targetProduct.type &&
    srcProduct.name === targetProduct.name &&
    srcProduct.totalPrice === targetProduct.totalPrice &&
    srcProduct.unitPrice === targetProduct.unitPrice &&
    srcProduct.quantity === targetProduct.quantity &&
    isOrderProductOptionsEquals(srcProduct.orderProductOptions, targetProduct.orderProductOptions)
);

const isOrderProductsEquals = (srcOrder, targetOrder) => {
  const srcProducts = srcOrder.orderProducts;
  const targetProducts = targetOrder.orderProducts;

  if (srcProducts.length !== targetProducts.length) {
    return false;
  }

  return srcProducts.every((value, index) => isOrderProductEquals(value, targetProducts[index]));
};

/**
 * 상품 준비시간 데이터 생성 함수
 * 상품준비시간은 총 8개
 * 1~4는 5분씩 추가
 * 5~8는 10분씩 추가
 * */
const createPrepareTime = (prepareTime) =>
// 빈배열 8개 생성 후 0으로 채움
  Array(8)
    .fill(0)
    // 생성된 배열수만큼 반복
    // 0~3까지는 5분 단위 = 준비시간 + (순서(i) * 5)
    // 4~8까지는 10분 단위 = 5분 단위 + (i - 3) * 5
    .map((e, i) => ({
      str: `${(i < 4 ? prepareTime + (i * 5) : prepareTime + (i * 5 + (i - 3) * 5))} 분`,
      value: (i < 4 ? prepareTime + (i * 5) : prepareTime + (i * 5 + (i - 3) * 5)),
    }));

const orderProductsFilter = (products) => {
  const productText = [];

  products.forEach((item) => {
    if (item.type !== ORDER_PRODUCT_TYPE.DELIVERY_TIP) {
      if (item.type === ORDER_PRODUCT_TYPE.SUMMARY) {
        productText.push(`${item.name}`);
      } else {
        productText.push(`${item.name} ${item.quantity}개`);
      }
    }
  });

  if (productText.length === 0) {
    productText.push('상품이 없습니다.');
  }
  return productText.join(', ');
};

const getOrderProceedAt = (order, orderAgency) => {
  if (order.isReservation && orderAgency) {
    return order.dropWishAt - (orderAgency.reservedOrderDisplayTime * 60 * 1000);
  }
  return order.createdAt;
};

const reserveOrderProceedAt = (order) => {
  const common = useCommonStore();
  return (
    order.dropWishAt - common.orderReservedOrderDisplayTime(order.orderAgencyId) * oneMinute
  );
};

const needShowCSGuideForCancel = (order) =>
  order.orderType === ORDER_TYPE.ACCEPTED_ORDER
  && (order.orderAgencyId === AGENCY_INFO.YOGIYO_DELIVERY.ID
    || order.orderAgencyId === AGENCY_INFO.BAEMIN_DELIVERY.ID);

const orderProceedAt = (order) => {
  const common = useCommonStore();
  if (order.isReservation) {
    return (
      order.dropWishAt -
          (common.orderReservedOrderDisplayTime(order.orderAgencyId) + 2) * oneMinute
    );
  }
  return order.createdAt;
};

// 거절이나 실패가 아닌 추가배달이 없는지 여부
const isOnlyOneDelivery = (order) => {
  let result = true;

  order.deliveries.forEach((v) => {
    if (
      ![DELIVERY_STATUS.FAILED, DELIVERY_STATUS.REJECTED].includes(v.status) &&
      v.additionType
    ) {
      result = false;
    }
  });

  return result;
};

const isNeedAccept = (order) => {
  const common = useCommonStore();

  // for order 주문이고
  return (
    order.orderType === ORDER_TYPE.FOR_ORDER &&
    // 제휴사 주문이고
    order.orderAgencyId !== 'self' &&
    // 수락되지 않았고
    order.status === ORDER_STATUS.CREATED &&
    // 요청된 배달이 하나도 없고
    order.deliveries.length === 0 &&
    // 수락 제한시간이 지나지 않았고
    diffMinutes(orderProceedAt(order), common.systemTimestamp) <
      common.orderAgencyRejectTime(order.orderAgencyId)
  );
};

const isAcceptTimeExpired = (order) => {
  const common = useCommonStore();

  // for order 주문이고
  return (
    order.orderType === ORDER_TYPE.FOR_ORDER &&
    // 제휴사 주문이고
    order.orderAgencyId !== 'self' &&
    // 수락되지 않았고
    order.status === ORDER_STATUS.CREATED &&
    // 요청된 배달이 하나도 없고
    order.deliveries.length === 0 &&
    // 수락 제한시간이 지나지 않았고
    diffMinutes(orderProceedAt(order), common.systemTimestamp) >=
      common.orderAgencyRejectTime(order.orderAgencyId)
  );
};

const isCanRequestDelivery = (order) => {
  const mainDelivery = getMainDelivery(order);

  // for order, accepted order, store order 이고
  return (
    [ORDER_TYPE.FOR_ORDER, ORDER_TYPE.ACCEPTED_ORDER, ORDER_TYPE.STORE_ORDER].includes(
      order.orderType,
    ) &&
    // 수락되었거나 준비완료 되었으며
    [ORDER_STATUS.ACCEPTED].includes(order.status) &&
    // 배달 타입 주문이고
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 현재 메인배달이 존재하지 않을 경우
    isOnlyOneDelivery(order) &&
    !mainDelivery
  );
};

const isDeliveryFailed = (order) => {
  const mainDelivery = getMainDelivery(order);

  // for order, accepted order, store order 타입의 주문이고
  return (
    // 취소, 거절되지 않았고
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
      order.status,
    ) &&
    // 메인배달 외에 추가배달이 없고
    isOnlyOneDelivery(order) &&
    mainDelivery !== null &&
    isFailedDelivery(mainDelivery)
  );
};

const isDeliveryFailedWithAnotherDelivery = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // for order, accepted order, store order 타입의 주문이고
    [ORDER_TYPE.FOR_ORDER, ORDER_TYPE.ACCEPTED_ORDER, ORDER_TYPE.STORE_ORDER].includes(
      order.orderType,
    ) &&
    // 취소, 거절되지 않았고
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
      order.status,
    ) &&
    mainDelivery !== null &&
    isFailedDelivery(mainDelivery)
  );
};

const isReservationProceedingOrder = (order) => {
  const common = useCommonStore();
  // 취소, 거절되지 않았고
  return (
    // 예약 주문이며
    order.isReservation &&
    // 고객 도착시간이 정해져 있고
    order.dropWishAt &&
    // 라이더 앱 노출시간이 지난 경우
    orderProceedAt(order) <= common.systemTimestamp
  );
};

const activeDeliveriesCount = (order) =>
  order.deliveries.filter(isNotFailedDelivery).length;

const afterAllocatedCount = (order) => order.deliveries.filter(
  (v) =>
    isAgencyDelivery(v) &&
      isAtLeastAllocatedDelivery(v),
).length;

const beforePickupFinishedCount = (order, onlyAgency = true) => order.deliveries.filter(
  (v) =>
    (isAgencyDelivery(v) || !onlyAgency) &&
      isBeforePickupFinishedDelivery(v),
).length;

const afterPickupCount = (order) => order.deliveries.filter(
  (v) =>
    isAgencyDelivery(v) &&
      isAtLeastPickupFinishedDelivery(v),
).length;

const beforeDropFinishedCount = (order, onlyAgency = true) => order.deliveries.filter(
  (v) =>
    (isAgencyDelivery(v) || onlyAgency) &&
      isBeforeDropFinishedDelivery(v),
).length;

const isProceedingOrder = (order) => (
  (!order.isReservation || isReservationProceedingOrder(order)) &&
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
      order.status,
    )
);

// 거절이나 실패가 아닌 추가배달이 없고, 메인 배달이 배달 대행인지 여부
const isOnlyOneAcceptedDelivery = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    isOnlyOneDelivery(order) &&
    mainDelivery &&
    isAgencyDelivery(mainDelivery)
  );
};

// 거절이나 실패가 아닌 추가배달이 하나 이상 있는지 여부
const isMultiAcceptedDeliveries = (order) => !isOnlyOneDelivery(order);

const beforeAllocatedCount = (order, onlyAgency = true) => order.deliveries.filter(
  (v) =>
    (isAgencyDelivery(v) || onlyAgency) &&
    isBeforeAllocatedDelivery(v),
).length;

const isAccepted = (order) => (
  isProceedingOrder(order) &&
    (
      (isOnlyOneAcceptedDelivery(order) && afterAllocatedCount(order) === 0) ||
      (isMultiAcceptedDeliveries(order) && (
        // 배차전 배달이 있거나
        beforeAllocatedCount(order) > 0 ||
        // 살아있는 배달이 없거나
        !order.deliveries.some(isBeforeDropFinishedDelivery)
      ))
    )
);

const isOrderTypeStatus = (order) => (
  ([ORDER_TYPE.FOR_ORDER, ORDER_TYPE.ACCEPTED_ORDER, ORDER_TYPE.STORE_ORDER].includes(
    order.orderType,
  ) &&
      [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(order.status)) ||
    ([ORDER_TYPE.FOR_DELIVERY, ORDER_TYPE.ADMIN_FOR_DELIVERY].includes(order.orderType) &&
      [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
        order.status,
      ))
);

const isAllocated = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // 주문 서비스 타입이 배달이고
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 메인배달만 있고
    isOnlyOneDelivery(order) &&
    // 배달 타입이 에이전시이고
    isAgencyDelivery(mainDelivery) &&
    // 배차된 상태이고
    isAllocatedDelivery(mainDelivery) &&
    isOrderTypeStatus(order)
  );
};

const isSelfDeliveryCreated = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // 주문 서비스 타입이 배달이고
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 진행중인 주문이고
    isProceedingOrder(order) &&
    // 메인배달만 있고
    isOnlyOneDelivery(order) &&
    // 배달타입이 self
    isSelfDelivery(mainDelivery) &&
    // 배달 상태가 접수, 배차
    isBeforePickupFinishedDelivery(mainDelivery)
  );
};

const isSelfDeliveryCreatedWithAnotherDelivery = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // 주문 서비스 타입이 배달이고
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 진행중인 주문이고
    isProceedingOrder(order) &&
    // 다중 배달이고
    !isOnlyOneDelivery(order) &&
    // 배달타입이 self
    isSelfDelivery(mainDelivery) &&
    // 배달 상태가 접수, 배차
    isBeforePickupFinishedDelivery(mainDelivery)
  );
};

const isDeliveriesInProgress = (order) => (
  // 진행중인 주문이고
  isProceedingOrder(order) &&
    // 다중 배달이고
    isMultiAcceptedDeliveries(order) &&
    // 배차 이전 상태가 전체 살아있는 배달의 갯수와 같을 때
    afterAllocatedCount(order) > 0
);

const isDeliveriesInAllocated = (order) => (
  // 주문 서비스 타입이 배달이고
  order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 진행중인 주문이고
    isProceedingOrder(order) &&
    // 다중 배달이고
    isMultiAcceptedDeliveries(order) &&
    // 배차 이전 상태가 없고
    beforeAllocatedCount(order, false) === 0 &&
    // 픽업 이전 상태가 있을 때
    beforePickupFinishedCount(order, false) > 0
);

const isDeliveriesInPickup = (order) => (
  // 주문 서비스 타입이 배달이고
  order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 진행중인 주문이고
    isProceedingOrder(order) &&
    // 다중 배달이고
    isMultiAcceptedDeliveries(order) &&
    // 픽업 이전 상태가 없고
    beforePickupFinishedCount(order, false) === 0 &&
    // 드랍 이전 상태가 있을 때
    beforeDropFinishedCount(order, false) > 0
);

const isPickupFinished = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // 주문 서비스 타입이 배달이고
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    // 메인배달만 있고
    isOnlyOneDelivery(order) &&
    // 배달 타입이 에이전시이고
    isAgencyDelivery(mainDelivery) &&
    // 픽업된 상태이고
    isPickupFinishedDelivery(mainDelivery) &&
    isOrderTypeStatus(order)
  );
};

const isSelfDeliveryDeparted = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
      order.status,
    ) &&
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    isOnlyOneDelivery(order) &&
    isSelfDelivery(mainDelivery) &&
    isPickupFinishedDelivery(mainDelivery)
  );
};

const isSelfDeliveryDepartedWithAnotherDelivery = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
      order.status,
    ) &&
    order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
    !isOnlyOneDelivery(order) &&
    isSelfDelivery(mainDelivery) &&
    isPickupFinishedDelivery(mainDelivery)
  );
};

const isHallOrder = (order) => (
  [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
    order.status,
  ) &&
    order.serveType === ORDER_SERVE_TYPE.HALL &&
    order.deliveries.length === 0
);

const isPackingOrder = (order) => (
  [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
    order.status,
  ) &&
    order.serveType === ORDER_SERVE_TYPE.PACKING &&
    order.deliveries.length === 0
);

// 도시주방에서 준비완료가 가능
const isCanPrepareForCityKitchen = (order) => {
  const auth = useAuthStore();
  return (
    auth.currentStore.storeType === STORE_TYPE.CITY_KITCHEN &&
    [ORDER_STATUS.CREATED, ORDER_STATUS.ACCEPTED].includes(order.status)
  );
};

// 준비완료 버튼
const isCanPrepareForNotification = (order) => {
  const mainDelivery = getMainDelivery(order);

  return (
    // 단일배달이고
    (isOnlyOneDelivery(order) &&
      // 바로고 배달 대행이면서
      mainDelivery?.deliveryAgencyId === 'barogo' &&
      // 픽업전이고
      isBeforePickupFinishedDelivery(mainDelivery) &&
      // 준비완료를 아직 안했고
      order.orderPreparedNotificationHistories.length === 0) ||
    // 다중 배달이고
    (isMultiAcceptedDeliveries(order) &&
      // 바로고 배달대행이 존재하고
      order.deliveries
        .filter(isAgencyDelivery)
        .some((item) => item.deliveryAgencyId === 'barogo') &&
      // 픽업 이전인 배달이 존재하고
      order.deliveries
        .filter(isAgencyDelivery)
        .some((item) => isBeforePickupFinishedDelivery(item)) &&
      // 준비완료 한적이 없고
      order.orderPreparedNotificationHistories.length === 0)
  );
};

const isDeliveryCanceled = (order) => {
  const mainDelivery = getMainDelivery(order);
  return ([ORDER_TYPE.FOR_ORDER, ORDER_TYPE.ACCEPTED_ORDER, ORDER_TYPE.STORE_ORDER].includes(
    order.orderType,
  ) &&
  [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARED].includes(
    order.status,
  ) &&
  isOnlyOneDelivery(order)) &&
  mainDelivery.status === DELIVERY_STATUS.CANCELED;
};

const isWaitingAcceptedStatus = (order) => (
  isNeedAccept(order) ||
  isCanRequestDelivery(order) ||
  isDeliveryFailed(order) ||
  isDeliveryCanceled(order)
);

const getOrderPaymentName = (order) => {
  let orderPaymentName = '';
  if (
    (order.prepaidPrice > 0 && order.paymentCardPrice > 0) ||
    (order.prepaidPrice > 0 && order.paymentCashPrice > 0) ||
    (order.paymentCardPrice > 0 && order.paymentCashPrice > 0)
  ) {
    orderPaymentName = '복합결제';
  } else if (order.paymentCardPrice > 0) {
    orderPaymentName = '후불카드';
  } else if (order.paymentCashPrice > 0) {
    orderPaymentName = '후불현금';
  } else if (order.prepaidPrice > 0) {
    orderPaymentName = '선결제';
  }

  return orderPaymentName;
};

const hasAdditionalDeliveries = (order) => order &&
  order.deliveries.length > 0 &&
  order.deliveries.some((delivery) => delivery.additionType);

const appendOrderBadgeData = (order) => {
  const badgeList = [];
  const badgeData = {};

  if (isDeliveryFailed(order)) {
    badgeData.labelName = '배달중단';
    badgeData.color = 'error';
    badgeList.push({ ...badgeData });
  } else if (isPackingOrder(order)) {
    badgeData.labelName = '포장';
    badgeData.color = 'purple';
    badgeList.push({ ...badgeData });
  } else if (isHallOrder(order)) {
    badgeData.labelName = '홀';
    badgeData.color = 'orange';
    badgeList.push({ ...badgeData });
  }

  if (order.reorderRelation) {
    badgeData.labelName = '다시주문';
    badgeData.color = 'orange';
    badgeList.push({ ...badgeData });
  }

  if (order.isReservation) {
    badgeData.labelName = '예약';
    badgeData.color = 'primary';
    badgeList.push({ ...badgeData });
  }

  if (!hasAdditionalDeliveries(order)) {
    const mainDelivery = getMainDelivery(order);
    if (isSelfDelivery(mainDelivery)) {
      badgeData.labelName = '직접배달';
      badgeData.color = 'secondary';
      badgeData.variant = 'outlined';
      badgeList.push({ ...badgeData });
    }
  }
  return badgeList;
};

const sumOrderTotalPayPrice = (orderProducts) => {
  let totalPayPrice = 0;
  orderProducts.forEach((orderProduct) => {
    totalPayPrice += orderProduct.totalPrice;
  });

  return totalPayPrice;
};

const makeFilterQuery = (selectedFilter, date) => {
  const queryPayload = {};
  queryPayload.createdAt = getDatePeriod(selectedFilter.datePeriod);

  if (selectedFilter.datePeriod === 'SELF' && date) {
    queryPayload.createdAt = getDatePeriod(selectedFilter.datePeriod, date);
  }
  queryPayload.orderStatus = selectedFilter.orderStatus
    ? [selectedFilter.orderStatus] : [ORDER_STATUS.FINISHED, ORDER_STATUS.CANCELED];
  queryPayload.orderOption = ['createdAt', selectedFilter.orderSorting];
  // value가 undefined인 객체는 서버로 보내지 않아서 따로 delete하지 않고 값이 빈 값일 때는 undefined로 처리
  queryPayload.deliveryType = selectedFilter.deliveryType || undefined;
  queryPayload.paymentMethod = selectedFilter.paymentMethod || undefined;

  return queryPayload;
};

const getSelectedFiltersName = (selectedFiltering) => {
  const name = [];
  name.push(DATE_PERIOD_DATA.find((item) => item.value === selectedFiltering.datePeriod).name);
  name.push(ORDER_STATUS_DATA.find((item) => item.value === selectedFiltering.orderStatus).name);
  name.push(DATE_SORTING_DATA.find((item) => item.value === selectedFiltering.orderSorting).name);
  name.push(DELIVERY_TYPE_DATA.find((item) => item.value === selectedFiltering.deliveryType).name);
  return name.join(' ・ ');
};
// 주문이 수정 가능한 주문인지 판단
const isEditableOrder = (order) => order &&
    // 주문이 완료되지 않았고
    [
      ORDER_STATUS.CREATED,
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.PREPARED,
    ].includes(order.status) &&
    // 모든 배달이 픽업 전이고
    afterPickupCount(order) === 0;

const isRoadShopOrder = (order) =>
  order.manageOrderAgencyId === 'self';

const isAllowHideOrderAgencyOrder = (order) =>
  [
    AGENCY_INFO.BAEMIN_DELIVERY.ID,
    AGENCY_INFO.YOGIYO_DELIVERY.ID,
    AGENCY_INFO.ANGELSOFT.ID,
  ].includes(order.orderAgencyId);

const isCancelableOrder = (order) => order &&
  [ // 주문이 완료되지 않았고
    ORDER_STATUS.CREATED,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.PREPARED,
  ].includes(order.status) &&
  activeDeliveriesCount(order) <= 1 &&
  order.orderType === ORDER_TYPE.STORE_ORDER &&
  (
    ( // 자제추문이면서 배달대행이고 배차 상태 전
      order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
      isAgencyDelivery(getMainDelivery(order)) &&
      !isAtLeastAllocatedDelivery(getMainDelivery(order))
    ) || ( // 자체주문이고 자체배달이면서 완료 전
      order.serveType === ORDER_SERVE_TYPE.DELIVERY &&
      isSelfDelivery(getMainDelivery(order)) &&
      !isDropFinishedDelivery(getMainDelivery(order))
    ) || ( // 자체주문이고 포장이면서 완료되지 않은 경우
      order.serveType === ORDER_SERVE_TYPE.PACKING
    )
  );

const isHidableOrder = (order) => order &&
  [ // 주문이 완료되지 않았고
    ORDER_STATUS.CREATED,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.PREPARED,
  ].includes(order.status) &&
  order.orderType === ORDER_TYPE.ACCEPTED_ORDER &&
  isAllowHideOrderAgencyOrder(order) &&
  (
    !order.deliveries
      .filter(isAgencyDelivery)
      .some(isAtLeastAllocatedDelivery) &&
    !order.deliveries
      .filter(isSelfDelivery)
      .some(isDropFinishedDelivery)
  );

const hasUntactImage = (order, delivery) => {
  const common = useCommonStore();

  return order &&
    delivery?.dropImageUrl &&
    common.systemTimestamp - order.createdAt < 30 * 24 * 60 * 60 * 1000;
};

const deleteOrderProductsProperty = (products) => products.forEach((p) => {
  delete p.orderProductId;
  delete p.orderId;
  delete p.createdAt;
  delete p.updatedAt;

  p.orderProductOptions.forEach((o) => {
    delete o.orderProductOptionId;
    delete o.orderProductId;
    delete o.createdAt;
    delete o.updatedAt;
  });
});

// O2O를 통해 접수된 대리접수 주문인지 여부
const isDeligatingOrder = (order) =>
  order &&
  order.orderType === ORDER_TYPE.STORE_ORDER &&
  (
    order.orderChannel === ORDER_CHANNEL.BAROGO_HUB ||
    order.orderChannel === ORDER_CHANNEL.BAROGO_HQ ||
    order.orderChannel === ORDER_CHANNEL.BAROGO_STORE
  );

// O2O를 통해 접수된 대리접수 주문이면서 주소가 빈 값으로 접수가 되었는지 여부
const isDeligatingOrderWithoutAddress = (order) =>
  isDeligatingOrder(order) &&
  !order.dropJibunAddress &&
  !order.dropRoadAddress;

const getDeliveryPaymentName = (order) => {
  const mainDelivery = getMainDelivery(order);
  let paymentName = '';

  if (!mainDelivery) {
    return false;
  }

  if (
    (mainDelivery.prepaidPrice > 0 && mainDelivery.paymentCardPrice > 0) ||
    (mainDelivery.prepaidPrice > 0 && mainDelivery.paymentCashPrice > 0) ||
    (mainDelivery.paymentCardPrice > 0 && mainDelivery.paymentCashPrice > 0)
  ) {
    paymentName = '복합결제';
  } else if (mainDelivery.paymentCardPrice > 0) {
    paymentName = '후불카드';
  } else if (mainDelivery.paymentCashPrice > 0) {
    paymentName = '후불현금';
  } else if (mainDelivery.prepaidPrice > 0) {
    paymentName = '선결제';
  }

  return paymentName;
};

// 주문 상품 가격 유효성 체크
const isValidOrderProductsPrice = (orderProducts) => {
  let result = true;

  orderProducts.forEach((orderProduct) => {
    const orderProductOptions = orderProduct.options || orderProduct.orderProductOptions || [];
    const sumOptionPrice = orderProductOptions.reduce((sumPrice, orderProductOption) =>
      (sumPrice + (orderProductOption.unitPrice * orderProductOption.quantity)), 0);

    const sumProductAndOptionPrice =
      (orderProduct.unitPrice + sumOptionPrice) * orderProduct.quantity;

    if (sumProductAndOptionPrice !== orderProduct.totalPrice) {
      result = false;
    }
  });

  return result;
};

export {
  getMainDelivery,
  getAdditionalDeliveries,
  deleteOrderProductsProperty,
  preDefinedOrderChannels,
  getOrderProceedAt,
  needShowCSGuideForCancel,
  isNeedAccept,
  isAcceptTimeExpired,
  isCanRequestDelivery,
  isDeliveryFailed,
  isDeliveryFailedWithAnotherDelivery,
  isReservationProceedingOrder,
  activeDeliveriesCount,
  afterAllocatedCount,
  beforePickupFinishedCount,
  afterPickupCount,
  beforeDropFinishedCount,
  isProceedingOrder,
  isOnlyOneAcceptedDelivery,
  isMultiAcceptedDeliveries,
  isAccepted,
  isOrderTypeStatus,
  isAllocated,
  isSelfDeliveryCreated,
  isSelfDeliveryCreatedWithAnotherDelivery,
  isDeliveriesInProgress,
  isDeliveriesInAllocated,
  isDeliveriesInPickup,
  isPickupFinished,
  isSelfDeliveryDeparted,
  isSelfDeliveryDepartedWithAnotherDelivery,
  isHallOrder,
  isPackingOrder,
  isCanPrepareForCityKitchen,
  isCanPrepareForNotification,
  isOnlyOneDelivery,
  isWaitingAcceptedStatus,
  orderProceedAt,
  reserveOrderProceedAt,
  isDeliveryCanceled,
  getOrderPaymentName,
  appendOrderBadgeData,
  sumOrderTotalPayPrice,
  makeFilterQuery,
  getSelectedFiltersName,
  hasAfterAllocated,
  hasDeliveryTip,
  deliveryTipPrice,
  getPaymentMethod,
  getTotalProductPrice,
  getTemporaryProduct,
  getProductPriceExcludeTemporary,
  makeTemporaryProduct,
  isOrderProductOptionEquals,
  isOrderProductOptionsEquals,
  isOrderProductEquals,
  isOrderProductsEquals,
  createPrepareTime,
  orderProductsFilter,
  isEditableOrder,
  isRoadShopOrder,
  isAllowHideOrderAgencyOrder,
  hasAdditionalDeliveries,
  isCancelableOrder,
  isHidableOrder,
  hasUntactImage,
  isDeligatingOrder,
  isDeligatingOrderWithoutAddress,
  getDeliveryPaymentName,
  isValidOrderProductsPrice,
};
