import { ORDER_STATUS, DELIVERY_TYPE, PAYMENT_METHOD } from '@/constants';

export const INIT_PAGINATION = {
  page: 1,
  limit: 10,
  offset: 0,
};

export const TIME_ZONE = 'Asia/Seoul';

export const FILTER_DATE_PERIOD = {
  TODAY: 'TODAY',
  ONE_WEEK: 'ONE_WEEK',
  ONE_MONTH: 'ONE_MONTH',
  SELF: 'SELF',
};

export const FILTER_ORDER_SORTING = {
  DESC: 'DESC',
  ASC: 'ASC',
};

export const DATE_PERIOD_DATA = [
  {
    id: 1,
    name: '당일',
    value: FILTER_DATE_PERIOD.TODAY,
  },
  {
    id: 2,
    name: '1주일',
    value: FILTER_DATE_PERIOD.ONE_WEEK,
  },
  {
    id: 3,
    name: '1개월',
    value: FILTER_DATE_PERIOD.ONE_MONTH,
  },
  {
    id: 4,
    name: '직접설정',
    value: FILTER_DATE_PERIOD.SELF,
  },
];

export const ORDER_STATUS_DATA = [
  {
    id: 1,
    name: '전체',
    value: '',
  },
  {
    id: 2,
    name: '완료',
    value: ORDER_STATUS.FINISHED,
  },
  {
    id: 3,
    name: '취소',
    value: ORDER_STATUS.CANCELED,
  },
];

export const DATE_SORTING_DATA = [
  {
    id: 1,
    name: '최신순',
    value: FILTER_ORDER_SORTING.DESC,
  },
  {
    id: 2,
    name: '오래된 순',
    value: FILTER_ORDER_SORTING.ASC,
  },
];

export const DELIVERY_TYPE_DATA = [
  {
    id: 1,
    name: '배달 전체',
    value: '',
  },
  {
    id: 2,
    name: '배달대행사',
    value: DELIVERY_TYPE.AGENCY,
  },
  {
    id: 3,
    name: '직접 배달',
    value: DELIVERY_TYPE.SELF,
  },
];

export const PAYMENT_METHOD_DATA = [
  {
    id: 1,
    name: '결제수단 전체',
    value: '',
  },
  {
    id: 2,
    name: '선결제',
    value: PAYMENT_METHOD.PREPAID,
  },
  {
    id: 3,
    name: '후불현금',
    value: PAYMENT_METHOD.CASH,
  },
  {
    id: 4,
    name: '후불카드',
    value: PAYMENT_METHOD.CARD,
  },
  {
    id: 5,
    name: '복합결제 ',
    value: PAYMENT_METHOD.MIXED_PAYMENT,
  },
];

export const PROGRESS_INCREASE_UNIT = 100 / 30;

// 컵 보증금 개당 금액
export const CUP_DEPOSIT = 300;

export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

export const REQUIRED_AGREEMENT_TYPE = ['TERMS', 'PRIVACY_POLICY'];

export const AGENCY_INFO = {
  YOGIYO_DELIVERY: {
    ID: 'yogiyo_delivery',
  },
  BAEMIN_DELIVERY: {
    ID: 'baemin_delivery',
  },
  ANGELSOFT: {
    ID: 'angelsoft',
  },
};

export const CUSTOM_DSM_TYPE = {
  DELIVERY_PICKUP_EXPECTED_AT_CHANGED: 'CUSTOM_DSM_DELIVERY_PICKUP_EXPECTED_AT_CHANGED',
  REQUEST_DELIVERY_REJECTED: 'CUSTOM_DSM_REQUEST_DELIVERY_REJECTED',
};
