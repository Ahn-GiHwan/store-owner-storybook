export const EXTRA_CHARGE_TYPE = {
  WEATHER: 'WEATHER',
  HOLIDAY: 'HOLIDAY',
  AREA: 'HOLIDAY',
  TIME: 'TIME',
  OVERLOAD: 'OVERLOAD',
  VALUABLE: 'VALUABLE',
  DISTANCE: 'DISTANCE',
  ETC: 'ETC',
};

/*
  TERMS_AND_POLICY_TYPE 약관의 종류
    TERMS : 이용 약관
    PRIVACY_POLICY : 개인정보 활용 동의
    MARKETING : 마케팅 정보 활용 동의
    ADVERTISEMENT : 광고성 정보 수신 동의
*/
export const TERMS_AND_POLICY_TYPE = {
  TERMS: 'TERMS',
  PRIVACY_POLICY: 'PRIVACY_POLICY',
  MARKETING: 'MARKETING',
  ADVERTISEMENT: 'ADVERTISEMENT',
};

/*
  STORE_STATUS 상점의 승인 상태
  CREATED : 상점이 생성되었지만 승인되지 않음
  APPROVED : 상점이 승인됨
  REJECTED : 상점이 승인 거절 됨
*/
export const STORE_STATUS = {
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

/*
  STORE_USER_STATUS 상점의 승인 상태
  CREATED : 상점 유저 관계가 생성되었지만 승인되지 않음
  APPROVED : 상점 유저 관계가 승인됨
  REJECTED : 상점 유저 관계가 승인 거절 됨
*/
export const STORE_USER_STATUS = {
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const ORDER_PRODUCT_TYPE = {
  FOOD: 'FOOD',
  DELIVERY_TIP: 'DELIVERY_TIP',
  GROCERY: 'GROCERY',
  CONVENIENCE_STORE: 'CONVENIENCE_STORE',
  PHARMACY: 'PHARMACY',
  SUMMARY: 'SUMMARY',
  DESSERT: 'DESSERT',
  DRINK: 'DRINK',
  TEMPORARY: 'TEMPORARY',
  ETC: 'ETC',
};

export const PAYMENT_METHOD = {
  PREPAID: 'PREPAID',
  CARD: 'CARD',
  CASH: 'CASH',
  MIXED_PAYMENT: 'MIXED_PAYMENT',
};

// 주문 상태
export const ORDER_STATUS = {
  CREATED: 'CREATED',
  ACCEPTED: 'ACCEPTED',
  PREPARED: 'PREPARED',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
};

// 주문 타입
export const ORDER_TYPE = {
  FOR_ORDER: 'FOR_ORDER',
  FOR_DELIVERY: 'FOR_DELIVERY',
  ACCEPTED_ORDER: 'ACCEPTED_ORDER',
  STORE_ORDER: 'STORE_ORDER',
  ADMIN_FOR_DELIVERY: 'ADMIN_FOR_DELIVERY',
};

// 배달 상태
export const DELIVERY_STATUS = {
  CREATED: 'CREATED',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  ALLOCATED: 'ALLOCATED',
  ALLOCATION_CANCELED: 'ALLOCATION_CANCELED',
  ALLOCATION_CHANGED: 'ALLOCATION_CHANGED',
  COOK_REQUESTED: 'COOK_REQUESTED',
  ARRIVED: 'ARRIVED',
  PICKUP_FINISHED: 'PICKUP_FINISHED',
  DROP_FINISHED: 'DROP_FINISHED',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
};

// 주문의 제공 타입
export const ORDER_SERVE_TYPE = {
  DELIVERY: 'DELIVERY',
  HALL: 'HALL',
  PACKING: 'PACKING',
};

// 배달의 타입
export const DELIVERY_TYPE = {
  AGENCY: 'AGENCY',
  SELF: 'SELF',
};

// 상점 타입
export const STORE_TYPE = {
  CITY_KITCHEN: 'CITY_KITCHEN',
  NONE: 'NONE',
};

export const ORDER_REJECT_TYPE = {
  CHANGE_CUSTOMER_MIND: 'CHANGE_CUSTOMER_MIND',
  CLOSE_STORE: 'CLOSE_STORE',
  BUSY_STORE: 'BUSY_STORE',
  SOLD_OUT: 'SOLD_OUT',
  ETC: 'ETC',
};

/*
  DELIVERY_ADDITION_TYPE 배달 추가 사유
    OVERLOAD: 부피 초과
    MISSOUT_PRODUCT: 상품 누락
    CLAIM_PRODUCT: 상품 문제
    MISTAKE_STORE: 매장 실수 -> 컨트롤룸에서만 설정 가능
    MISTAKE_DELIVERY: 라이더 실수 -> 컨트롤룸에서만 설정 가능
    MISTAKE_CUSTOMER: 고객 실수 -> 컨트롤룸에서만 설정 가능
    ETC: 기타
*/
export const DELIVERY_ADDITION_TYPE = {
  OVERLOAD: 'OVERLOAD',
  MISSOUT_PRODUCT: 'MISSOUT_PRODUCT',
  CLAIM_PRODUCT: 'CLAIM_PRODUCT',
  ETC: 'ETC',
};

/*
  REORDER_TYPE 다시주문 유형
    OVERLOAD: 부피 초과
    MISSOUT_PRODUCT: 상품 누락
    CLAIM_PRODUCT: 상품 문제
    MISTAKE_STORE: 매장 실수
    MISTAKE_CUSTOMER: 고객 실수
    MISTAKE_DELIVERY: 라이더 실수
    ETC: 기타
*/
export const REORDER_TYPE = {
  OVERLOAD: 'OVERLOAD',
  MISSOUT_PRODUCT: 'MISSOUT_PRODUCT',
  CLAIM_PRODUCT: 'CLAIM_PRODUCT',
  MISTAKE_STORE: 'MISTAKE_STORE',
  MISTAKE_CUSTOMER: 'MISTAKE_CUSTOMER',
  MISTAKE_DELIVERY: 'MISTAKE_DELIVERY',
  ETC: 'ETC',
};

/*
  MAPPING_STATUS 제휴사의 매핑 상태
    DONE: 연동중
    PAUSED: 연동중지
    NONE: 없음
    ANOTHER_GORELA_STORE_MAPPED: 다른 고릴라 상점에 매핑됨
*/
export const MAPPING_STATUS = {
  DONE: 'DONE',
  PAUSED: 'PAUSED',
  NONE: 'NONE',
  ANOTHER_GORELA_STORE_MAPPED: 'ANOTHER_GORELA_STORE_MAPPED',
};

/*
  EXTRA_CHARGE_DATA_TYPE 할증의 부과 타입
    FIXED : 정액
    RATE : 정률
*/
export const EXTRA_CHARGE_DATA_TYPE = {
  FIXED: 'FIXED',
  RATE: 'RATE',
};

export const ORDER_CHANNEL = {
  BAEMIN: 'BAEMIN',
  YOGIYO: 'YOGIYO',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
  SHUTTLE: 'SHUTTLE',
  BAEGOFA: 'BAEGOFA',
  WMPO: 'WMPO',
  DDINGDONG: 'DDINGDONG',
  COUPANG: 'COUPANG',
  HAPPYORDER: 'HAPPYORDER',
  FACEBOOK: 'FACEBOOK',
  MANUAL: 'MANUAL',
  POS: 'POS',
  KIOSK: 'KIOSK',
  BULLEOBOMNAE: 'BULLEOBOMNAE',
  LASTORDER: 'LASTORDER',
  STAMPANG: 'STAMPANG',
  SOMUNNANSHOP: 'SOMUNNANSHOP',
  WOODEL: 'WOODEL',
  SDO: 'SDO',
  PAYCO: 'PAYCO',
  MEATQ: 'MEATQ',
  ETC: 'ETC',
  BAEDALTONG: 'BAEDALTONG',
  MUKKEBI: 'MUKKEBI',
  SEOUL: 'SEOUL',
  KONA: 'KONA',
  MYUNGSU: 'MYUNGSU',
  WOOLSAN: 'WOOLSAN',
  DAEGU: 'DAEGU',
  UBPAY: 'UBPAY',
  BAECHELIN: 'BAECHELIN',
  HUNGRY_PANDA: 'HUNGRY_PANDA',
  MASITDA: 'MASITDA',
  DDANGKYEOYO: 'DDANGKYEOYO',
  PPLUS: 'PPLUS',
  // NOTE: 바로고 허브 및 스토어앱에서 주문 대리접수시 주문을 구분하기 위해 저장하는 용도
  BAROGO_HUB: 'BAROGO_HUB',
  BAROGO_STORE: 'BAROGO_STORE',
  BAROGO_HQ: 'BAROGO_HQ',
};

export const DELIVERY_CANCEL_TYPE = {
  INVALID_AREA: 'INVALID_AREA',
  OVER_CAPACITY: 'OVER_CAPACITY',
  CHANGE_STORE: 'CHANGE_STORE',
  BAD_WEATHER: 'BAD_WEATHER',
  CLOSE_AGENCY: 'CLOSE_AGENCY',
  INSUFFICIENT_DEPOSIT: 'INSUFFICIENT_DEPOSIT',
  WRONG_REQUEST: 'WRONG_REQUEST',
  WRONG_RECEIVER_INFO: 'WRONG_RECEIVER_INFO',
  NOT_ANSWER_RECEIVER: 'NOT_ANSWER_RECEIVER',
  CHANGE_CUSTOMER_MIND: 'CHANGE_CUSTOMER_MIND',
  DAMAGE_PRODUCT: 'DAMAGE_PRODUCT',
  SOLD_OUT: 'SOLD_OUT',
  TIMEOUT_CANCEL: 'TIMEOUT_CANCEL',
  UNDERAGE: 'UNDERAGE',
  DELAY_DELIVERY: 'DELAY_DELIVERY',
  CANCEL_BY_STORE: 'CANCEL_BY_STORE',
  CANCEL_BY_CUSTOMER: 'CANCEL_BY_CUSTOMER',
  CANCEL_BY_INTERNAL_ADMIN: 'CANCEL_BY_INTERNAL_ADMIN',
  ORDER_AGENCY_CANCELED: 'ORDER_AGENCY_CANCELED',
  CANCEL_BY_ADMIN: 'CANCEL_BY_ADMIN',
  BUSY_STORE: 'BUSY_STORE',
  CLOSE_STORE: 'CLOSE_STORE',
  MISTAKE_BY_ADMIN: 'MISTAKE_BY_ADMIN',
  COMPLAIN_BY_CUSTOMER: 'COMPLAIN_BY_CUSTOMER',
  CANCEL_BY_SWITCH_SELF_DELIVERY: 'CANCEL_BY_SWITCH_SELF_DELIVERY',
  INVALID_STATUS: 'INVALID_STATUS',
  ETC: 'ETC',
};

/*
  ORDER_CHANGE_HISTORY_EVENT_NAME 주문 변경내역 히스토리의 이벤트 이름
    CHANGE_PICKUP_WISH_AT : 픽업 요청시간 변경
    CHANGE_PICKUP_EXPECTED_AT : 픽업 예정시간 변경
    CHANGE_STORE_DROP_EXPECTED_AT : 고객 도착시간 변경
    CHANGE_DROP_INFO : 도착지 정보 변경
    CHANGE_CHARGE_INFO : 금액 정보 변경
    CHANGE_PRODUCT_INFO : 상품 정보 변경
    CHANGE_PAYMENT_INFO : 결제 정보 변경
    CHANGE_MEMO_INFO : 메모 변경
    CHANGE_PHONE_INFO : 전화번호 변경
    CHANGE_ORDER_TO_RESERVATION : 배대사 통해 예약주문으로 변경
    CHANGE_DELIVERY_TO_SELF : 배대사 통해 직접배달로 변경
*/
export const ORDER_CHANGE_HISTORY_EVENT_NAME = {
  CHANGE_PICKUP_WISH_AT: 'CHANGE_PICKUP_WISH_AT',
  CHANGE_PICKUP_EXPECTED_AT: 'CHANGE_PICKUP_EXPECTED_AT',
  CHANGE_STORE_DROP_EXPECTED_AT: 'CHANGE_STORE_DROP_EXPECTED_AT',
  CHANGE_DROP_INFO: 'CHANGE_DROP_INFO',
  CHANGE_CHARGE_INFO: 'CHANGE_CHARGE_INFO',
  CHANGE_PRODUCT_INFO: 'CHANGE_PRODUCT_INFO',
  CHANGE_PAYMENT_INFO: 'CHANGE_PAYMENT_INFO',
  CHANGE_MEMO_INFO: 'CHANGE_MEMO_INFO',
  CHANGE_PHONE_INFO: 'CHANGE_PHONE_INFO',
  CHANGE_ORDER_TO_RESERVATION: 'CHANGE_ORDER_TO_RESERVATION',
  CHANGE_DELIVERY_TO_SELF: 'CHANGE_DELIVERY_TO_SELF',
};

/*
  ORDER_CHANGE_HISTORY_EDITOR_TYPE 주문 변경내역 히스토리의 수정자 타입
    DEV_USER_ORDER_AGENCY: 주문제휴사
    DEV_USER_DELIVERY_AGENCY: 배달대행사
    STORE_USER: 상점의 유저
    ADMIN_USER: 컨트롤룸 유저
    INTERNAL_SYSTEM: 고릴라 내부 시스템
*/
export const ORDER_CHANGE_HISTORY_EDITOR_TYPE = {
  DEV_USER_ORDER_AGENCY: 'DEV_USER_ORDER_AGENCY',
  DEV_USER_DELIVERY_AGENCY: 'DEV_USER_DELIVERY_AGENCY',
  STORE_USER: 'STORE_USER',
  ADMIN_USER: 'ADMIN_USER',
  INTERNAL_SYSTEM: 'INTERNAL_SYSTEM',
};
