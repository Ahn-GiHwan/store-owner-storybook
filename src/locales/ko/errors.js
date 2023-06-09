export default {
  common: {
    UNKNOWN_SERVER_ERROR: '일시적인 오류가 발생하였습니다.',
  },
  createDeliveryOrder: {
    EXTERNAL_SERVER_ERROR: '배달대행사 서버의 문제로 접수에 실패했습니다. 다시 시도해주세요.',
    EXTERNAL_NOT_FOUND_RESOURCE: '배달대행사가 연동되어 있지 않습니다.',
    NONE_ORDER_AGENCY_MAPPING: '주문제휴사가 연동되어 있지 않습니다.',
    INVALID_ADDRESS: '주소를 식별할 수 없어 배달을 접수할 수 없습니다.',
    GENERAL_ERROR: '일시적인 문제로 접수에 실패했습니다. 다시 시도해주세요.',
  },
  deliveryPossible: {
    INVALID_AREA: '배달할 수 없는 지역이라 배달할 수 없습니다.',
    INVALID_ADDRESS: '주소를 식별할 수 없어 배달할 수 없습니다.',
    TOO_LONG_DELIVERY_DISTANCE: '너무 먼 거리라 배달할 수 없습니다.',
    INCORRECT_DELIVERY_PRICE_SETTING: '배달대행료 설정에 맞지 않아 배달할 수 없습니다.',
    OVER_CAPACITY: '현재 주문량이 많아 배달할 수 없습니다.',
    BAD_WEATHER: '궂은 날씨로 배달할 수 없습니다.',
    CLOSE_AGENCY: '대행사 영업 중단으로 배달할 수 없습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달할 수 없습니다.',
    INSUFFICIENT_DEPOSIT: '예치금이 부족해 배달할 수 없습니다.',
    WRONG_REQUEST: '주문 정보가 잘못되어 배달할 수 없습니다.',
    EXTRA_CHARGE_NOT_ACCEPTED: '할증 적용 여부를 선택하지 않아 배달할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_RESERVATION: '예약할 수 있는 배달 대행사가 없어 배달할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_UNTACT: '비대면 배달이 가능한 배달 대행사가 없어 배달할 수 없습니다.',
    DELIVERY_DISABLED: '기타 사유로 배달이 중단되어 배달할 수 없습니다.',
    ETC: '기타 사유로 배달할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 배달을 접수 할 수 없습니다.',
    MAINTENANCE_TIME: '대행사 점검 시간이라 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_DEFERRED_PAYMENT: '후불결제 불가능 배달대행사입니다. 결제수단을 변경하세요.',
    INVALID_PICKUP_WISH_AT: '픽업시간({minute}분 이상)으로 상품준비시간을 선택해주세요.',
    EXTERNAL_SERVICE_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    NONE_DELIVERY_AGENCY_MAPPING: '배달대행사가 연동되어 있지 않습니다.',
  },
  acceptOrder: {
    CANCEL_BY_CUSTOMER: '고객 취소로 주문을 수락할 수 없습니다.',
    CANCEL_BY_TIMEOUT: '시간 초과로 인한 주문 취소로 주문을 수락할 수 없습니다.',
    ACCEPT_BY_STORE: '이미 수락된 주문입니다.',
    REJECT_BY_STORE: '이미 거절된 주문입니다.',
    NEED_CONTACT: '고객센터 연락이 필요한 주문입니다.',
    ETC: '기타 사유로 주문을 수락할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 주문을 수락할 수 없습니다.',
  },
  rejectOrder: {
    CANCEL_BY_CUSTOMER: '고객 취소로 주문을 거절할 수 없습니다.',
    CANCEL_BY_TIMEOUT: '시간 초과로 인한 주문 취소로 주문을 거절할 수 없습니다.',
    ACCEPT_BY_STORE: '이미 수락된 주문입니다.',
    REJECT_BY_STORE: '이미 거절된 주문입니다.',
    NEED_CONTACT: '고객센터 연락이 필요한 주문입니다.',
    ETC: '기타 사유로 주문을 거절할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 주문을 거절할 수 없습니다.',
  },
  cancelOrder: {
    INVALID_STATUS: '이미 진행되어 주문을 취소할 수 없습니다.',
    ETC: '기타 사유로 주문을 취소할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 주문을 취소할 수 없습니다.',
  },
  requestDelivery: {
    BAD_WEATHER: '궂은 날씨로 배달을 접수할 수 없습니다.',
    CLOSE_AGENCY: '대행사 영업 중단으로 배달을 접수할 수 없습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달을 접수할 수 없습니다.',
    DELIVERY_DISABLED: '기타 사유로 배달이 중단되어 배달을 접수할 수 없습니다.',
    ETC: '배달을 접수할 수 없습니다.',
    EXTRA_CHARGE_NOT_ACCEPTED: '할증 적용 여부를 선택하지 않아 배달을 접수할 수 없습니다.',
    INCORRECT_STORE_INFO_SETTING: '상점 설정에 맞지 않아 배달을 접수할 수 없습니다.',
    INCORRECT_DELIVERY_PRICE_SETTING: '배달대행료 설정에 맞지 않아 배달을 접수할 수 없습니다.',
    INSUFFICIENT_DEPOSIT: '예치금이 부족해 배달을 접수할 수 없습니다.',
    INVALID_AREA: '배달할 수 없는 지역이라 배달을 접수할 수 없습니다.',
    INVALID_ADDRESS: '주소를 식별할 수 없어 배달을 접수할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: '선결제 방법이 아니라 배달을 접수할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: '선결제, 카드결제 방법이 아니라 배달을 접수할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE: '적합한 상품결제 방법이 아니라 배달을 접수할 수 없습니다.',
    NONE: '배달을 접수할 수 없습니다.',
    OVER_CAPACITY: '현재 주문량이 많아 배달을 접수할 수 없습니다.',
    TOO_LONG_DELIVERY_DISTANCE: '너무 먼 거리라 배달을 접수할 수 없습니다.',
    WRONG_REQUEST: '주문 정보가 잘못되어 배달을 접수할 수 없습니다.',
    UNKNOWN_STORE: '상점 연동이 되어 있지 않습니다.',
    STOP_STORE_BUSINESS: '상점 영업 중지 상태라 배달을 접수할 수 없습니다.',
    ALLOCATION_FAILED: '배달대행사가 지정되지 않아 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_RESERVATION: '예약할 수 있는 배달 대행사가 없어 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_UNTACT: '비대면 배달이 가능한 배달 대행사가 없어 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_DISABLE: '기타 사유로 배달이 중단되어 배달을 접수할 수 없습니다.',
    EXTERNAL_NOT_FOUND_RESOURCE: '배달대행사가 연동되어 있지 않습니다.',
    EXTERNAL_SERVER_ERROR: '배달을 접수할 수 없습니다. (서버에러)',
    EXTERNAL_SERVER_TIMEOUT: '배달을 접수할 수 없습니다. (타임아웃)',
    EXTERNAL_SERVER_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    EXTERNAL_SERVICE_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    INTERNAL_SYSTEM_ERROR: '배달을 접수할 수 없습니다. (통신에러)',
    MAINTENANCE_TIME: '대행사 점검 시간이라 배달을 접수할 수 없습니다.',
    NONE_DELIVERY_AGENCY_MAPPING: '배달대행사가 연동되어 있지 않습니다.',
    NOT_ALLOW_EXTERNAL: '배달대행사 점검시간으로 배달을 접수할 수 없습니다.',
    NOT_FOUND_RESOURCE: '배달대행사가 연동되어 있지 않습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 배달을 접수할 수 없습니다.',
  },
  deliveryRejected: {
    BAD_WEATHER: '궂은 날씨로 배달을 접수할 수 없습니다.',
    CLOSE_AGENCY: '대행사 영업 중단으로 배달을 접수할 수 없습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달을 접수할 수 없습니다.',
    DELIVERY_DISABLED: '기타 사유로 배달이 중단되어 배달을 접수할 수 없습니다.',
    ETC: '배달을 접수할 수 없습니다.',
    EXTRA_CHARGE_NOT_ACCEPTED: '할증 적용 여부를 선택하지 않아 배달을 접수할 수 없습니다.',
    INCORRECT_STORE_INFO_SETTING: '상점 설정에 맞지 않아 배달을 접수할 수 없습니다.',
    INCORRECT_DELIVERY_PRICE_SETTING: '배달대행료 설정에 맞지 않아 배달을 접수할 수 없습니다.',
    INSUFFICIENT_DEPOSIT: '예치금이 부족해 배달을 접수할 수 없습니다.',
    INVALID_AREA: '배달할 수 없는 지역이라 배달을 접수할 수 없습니다.',
    INVALID_ADDRESS: '존재하지 않는 주소로 배달 요청할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: '선결제 방법이 아니라 배달을 접수할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: '선결제, 카드결제 방법이 아니라 배달을 접수할 수 없습니다.',
    INVALID_GOODS_PAY_TYPE: '적합한 상품결제 방법이 아니라 배달을 접수할 수 없습니다.',
    NONE: '배달을 접수할 수 없습니다.',
    NOT_FOUND_DELIVERY_POSSIBLE_AREA: '배달 가능 구역이 아니므로 직접 배달만 가능합니다.',
    OVER_CAPACITY: '현재 주문량이 많아 배달을 접수할 수 없습니다.',
    TOO_LONG_DELIVERY_DISTANCE: '너무 먼 거리라 배달을 접수할 수 없습니다.',
    WRONG_REQUEST: '주문 정보가 잘못되어 배달을 접수할 수 없습니다.',
    UNKNOWN_STORE: '상점 연동이 되어 있지 않습니다.',
    STOP_STORE_BUSINESS: '상점 영업 중지 상태라 배달을 접수할 수 없습니다.',
  },
  deliveryFailed: {
    ALLOCATION_FAILED: '배달대행사가 지정되지 않아 배달을 접수할 수 없습니다.',
    CLOSE_AGENCY: '대행사 영업 중단으로 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_RESERVATION: '예약할 수 있는 배달 대행사가 없어 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_UNTACT: '비대면 배달이 가능한 배달 대행사가 없어 배달을 접수할 수 없습니다.',
    DELIVERY_AGENCY_DISABLE: '기타 사유로 배달이 중단되어 배달을 접수할 수 없습니다.',
    EXTERNAL_NOT_FOUND_RESOURCE: '배달대행사가 연동되어 있지 않습니다.',
    EXTERNAL_SERVER_ERROR: '배달을 접수할 수 없습니다. (서버에러)',
    EXTERNAL_SERVER_TIMEOUT: '배달을 접수할 수 없습니다. (타임아웃)',
    EXTERNAL_SERVER_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    EXTERNAL_SERVICE_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    INTERNAL_SYSTEM_ERROR: '배달을 접수할 수 없습니다. (통신에러)',
    INVALID_ADDRESS: '주소를 식별할 수 없어 배달할 수 없습니다.',
    MAINTENANCE_TIME: '대행사 점검 시간이라 배달을 접수할 수 없습니다.',
    NONE: '배달을 접수할 수 없습니다.',
    NONE_DELIVERY_AGENCY_MAPPING: '배달대행사가 연동되어 있지 않습니다.',
    NOT_ALLOW_EXTERNAL: '배달대행사 점검시간으로 배달을 접수할 수 없습니다.',
    NOT_FOUND_RESOURCE: '배달대행사가 연동되어 있지 않습니다.',
  },
  deliveryCanceled: {
    BAD_WEATHER: '궂은 날씨로 배달이 취소되었습니다.',
    CANCEL_BY_CUSTOMER: '고객 요청으로 배달이 취소되었습니다.',
    CANCEL_BY_INTERNAL_ADMIN: '관리자 요청으로 배달이 취소되었습니다.',
    CANCEL_BY_STORE: '사장님 요청으로 배달이 취소되었습니다.',
    CHANGE_CUSTOMER_MIND: '고객 변심으로 배달이 취소되었습니다.',
    CHANGE_STORE: '픽업지가 변경되어 배달이 취소되었습니다.',
    CLOSE_AGENCY: '대행사 지사가 영업중이 아니라서 배달이 취소되었습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달이 취소되었습니다.',
    COMPLAIN_BY_CUSTOMER: '고객 불만으로 배달이 취소되었습니다.',
    DAMAGE_PRODUCT: '상품이 손상되어 배달이 취소되었습니다.',
    DELAY_DELIVERY: '배달이 지연되어 배달이 취소되었습니다.',
    ETC: '배달이 취소되었습니다.',
    INVALID_AREA: '배달이 어려운 지역이라 배달이 취소되었습니다.',
    MISTAKE_BY_ADMIN: '관리자 실수로 배달이 취소되었습니다.',
    NOT_ANSWER_RECEIVER: '고객이 연락을 받지 않아 배달이 취소되었습니다.',
    OVER_CAPACITY: '현재 주문량이 많아 배달이 취소되었습니다.',
    SOLD_OUT: '주문 상품이 품절되어 배달이 취소되었습니다.',
    TIMEOUT_CANCEL: '오래 배차가 되지 않아 배달이 취소되었습니다.',
    UNDERAGE: '고객이 미성년자이기 때문에 배달이 취소되었습니다.',
    WRONG_RECEIVER_INFO: '고객 정보가 잘못되어 배달이 취소되었습니다.',
    WRONG_REQUEST: '주문 정보가 잘못되어 배달이 취소되었습니다.',
  },
  deliveryDisabled: {
    OVER_CAPACITY: '현재 주문량이 많아 배달 수행이 중단되었습니다.',
    BAD_WEATHER: '궂은 날씨로 배달 수행이 중단되었습니다.',
    CLOSE_AGENCY: '대행사 지사가 영업중이 아니라서 배달 수행이 중단되었습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달 수행이 중단되었습니다.',
    ETC: '배달 수행이 중단되었습니다.',
  },
  cancelDelivery: {
    INVALID_STATUS: '이미 진행되어 배달을 취소할 수 없습니다.',
    ETC: '기타 사유로 배달을 취소할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 배달을 취소할 수 없습니다.',
    CANCEL_DELIVERY_FAILED: '일시적인 문제로 배달 취소에 실패했습니다.',
    CHANGE_DELIVERY_FAILED: '일시적인 문제로 배달 변경에 실패했습니다.',
  },
  updateOrderStoreDropExpectedAt: {
    UNKNOWN_SERVER_ERROR: '서버 오류로 고객 도착일시를 수정할 수 없습니다.',
  },
  updateDeliveryStatus: {
    UNKNOWN_SERVER_ERROR: '서버 오류로 배달 상태를 수정할 수 없습니다.',
  },
  prepareOrderForNotification: {
    INVALID_STATUS: '이미 진행되어 주문 상품 준비 완료 알림을 보낼 수 없습니다.',
    ALREADY_COMPLETED_ORDER_PRODUCT_PREPARE: '이미 상품 준비가 되어 있어서 주문 상품 준비 완료 알림을 보낼 수 없습니다.',
    ETC: '기타 사유로 주문 상품 준비 완료 알림을 보낼 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 주문 상품 준비 완료 알림을 보낼 수 없습니다.',
    UNCONNECTED_INTERNET: '문제가 발생해서 상품 준비완료 알림을 보내지 못했습니다. 다시 시도해주세요.',
  },
};
