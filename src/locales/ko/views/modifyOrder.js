export default {
  modifyOrder: '주문서 수정',
  orderInfo: '주문 정보',
  deliveryInfo: '배달 정보',
  inputField: {
    ordererPhone: {
      title: '전화번호',
      label: '전화번호를 입력해 주세요.',
      placeholder: '숫자만 입력해 주세요.',
    },
    dropAddress: {
      title: '주소 검색',
      label: '배달주소를 검색합니다.',
      roadName: '도로명',
      jibunName: '지번',
    },
    dropAddressDetail: {
      title: '상세 주소',
      placeholder: '상세 주소를 입력해 주세요.',
    },
    actualPayPrice: {
      title: '메뉴 금액',
      modifyPrice: '금액 수정',
    },
    totalPrice: {
      title: '￦ 총 결제 금액',
      freeProductMessage: '무료로 제공하는 주문입니다.',
    },
    storeOrderMemo: {
      title: '라이더에게 요청사항(선택)',
      label: '요청사항을 입력해 주세요.',
      placeholder: '요청사항을 입력해 주세요.',
      appendButton: '간편 선택',
    },
    isUntact: {
      label: '비대면 배달',
    },
    productPrepareTime: {
      title: '상품 준비 시간',
      noChanges: '변경 없음',
      minutesBefore: '분 전',
      minutesAfter: '분 후',
      description: '라이더님이 오기 전까지의 준비 시간을 선택해주세요.',
    },
    storeDropExpectedAt: {
      title: '고객 도착 시간',
      noChanges: '변경 없음',
      minutesBefore: '분 전',
      minutesAfter: '분 후',
      description: '고객에게 안내할 배달 완료 시간을 선택합니다.',
    },
  },
  paymentMethod: {
    card: '후불카드',
    cash: '후불현금',
    prepaid: '선결제',
    mixpaid: '복합결제',
  },
  paymentAdditionalInfo: {
    deliveryTip: '- 배달팁',
    includeDeliveryTip: ' 배달팁 포함',
    discountPrice: '- 할인 금액',
    prepaidPrice: '- 선결제 금액',
    postpaidPrice: '- 후불결제 금액',
    paymentMethod: '- 결제수단',
    taxFreePayPrice: '- 1회용 컵 보증금',
    taxFreePriceIncludePostPayPrice: '* 결제 금액에 포함 ({taxFreePrice})',
    postPaid: '후불결제',
    modifyPayment: '금액 수정',
    PREPAID: '선결제',
    CARD: '카드',
    CASH: '현금',
    MIXED_PAYMENT: '복합결제',
  },
  modifyPayment: {
    modifyPayment: '금액 수정',
    canModifyPostPayment: '후불 결제 금액을 수정할 수 있습니다.',
    canModifyAllPayment: '결제 금액을 수정할 수 있습니다.',
    paymentPrice: '결제 금액',
    additionalInfo: '추가 정보',
    prepaidPrice: '선결제 금액',
    postPaidPrice: '후불결제 금액',
    postPayByCard: '후불카드',
    postPayByCash: '후불현금',
    prepay: '선결제',
    none: '없음',
    remainingAmount: '남은 결제 금액',
    deliveryTip: '배달팁',
    taxFreePayPrice: '비과세',
    included: '포함',
    discountApplied: '- {discount} 할인적용',
    freeOrder: '무료로 제공하는 주문입니다.',
    includeTaxFreePayPrice01: '(*1회용 컵 보증금 포함)',
    includeTaxFreePayPrice02: '(1회용 컵 보증금 포함)',
    titleTaxFreePayPrice: '1회용 컵 보증금 (개당 300원)',
    errors: {
      taxFreePayPriceMustBeLessThanPostPayPrice: '1회용 컵 보증금 ({taxFreePrice}) 은 후불결제 금액 초과로 설정할 수 없습니다.',
      taxFreePayPriceMustBeLessThanMenuPrice: '1회용 컵 보증금 ({taxFreePrice}) 은 메뉴 금액 초과로 설정할 수 없습니다.',
      taxFreePayPriceCannotBePrepaid: '1회용 컵 보증금은 선결제로 설정할 수 없습니다. 다른 결제수단을 사용해 주세요.',
      postPayPriceMustBeGreaterThanTaxFreePayPrice: '후불결제 금액은 1회용 컵 보증금 {taxFreePrice} 미만으로 설정할 수 없습니다.',
      menuPriceMustBeGreaterThanTaxFreePayPrice: '메뉴 금액은 1회용 컵 보증금 {taxFreePrice} 미만으로 설정할 수 없습니다.',
      maximumCountOfCupDepositIs99: '1회용 컵 보증금은 최대 99개까지 설정 가능합니다.',
    },
  },
  message: {
    errorIsUntact: '비대면 배달은 선결제만 가능합니다.',
    fixAndRetry: '수정 후 다시 시도해주세요.',
    mustChangePickupWishAt: '상품 준비시간을 다시 선택해주세요.',
    clickPaymentModifyButton: '금액 수정 버튼을 선택하여 결제 수단을 변경하세요',
    modifyRejected: {
      NOT_ALLOW: '이미 진행되었기 때문에 주문을 수정할 수 없습니다.',
      NOT_ALLOW_EXTERNAL: '이미 진행되었기 때문에 주문을 수정할 수 없습니다.',
      INVALID_STATUS: '이미 진행되었기 때문에 주문을 수정할 수 없습니다.',
      IMPOSSIBLE_CARD_PAY_TYPE_STORE: '유효한 결제 방법이 아닙니다. 다른 결제 방법으로 수정해주세요.',
      IMPOSSIBLE_CASH_PAY_TYPE: '유효한 결제 방법이 아닙니다. 다른 결제 방법으로 수정해주세요.',
      IMPOSSIBLE_PREPAID: '유효한 결제 방법이 아닙니다. 다른 결제 방법으로 수정해주세요.',
      INCORRECT_STORE_INFO_SETTING: '결제정보 수정에 실패했습니다. 관리자에게 문의해주세요.',
      INSUFFICIENT_RIDER_BAROMONEY: '라이더의 출금 금액이 부족합니다.',
      INVALID_GOODS_PAY_TYPE: '유효한 결제 방법이 아닙니다. 다른 결제 방법으로 수정해주세요.',
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID: '선결제만 가능합니다. 수정 후 다시 시도해주세요.',
      INVALID_GOODS_PAY_TYPE_ONLY_PREPAID_OR_CARD: '선결제 혹은 카드 결제만 가능합니다. 수정 후 다시 시도해주세요.',
      UNKNOWN_ERROR: '주문 수정에 실패했습니다. 다시 시도해주세요.',
    },
  },
  bottomSheet: {
    orderMemos: {
      title: '라이더 요청사항',
    },
    productPrepare: {
      title: '상품 준비시간',
    },
  },
  cancelModal: {
    cancelModify: '수정하던 내용을 지울까요?',
    cancelDescription: '수정하던 내용을 지우고 계속합니다.',
    buttonText: {
      cancel: '취소',
      confirm: '확인',
    },
  },
  tempProduct: '임의상품',
  cancel: '취소',
  confirmModify: '수정 완료',
  requestDelivery: '배달 요청',
  selfDelivery: '직접 배달',
};