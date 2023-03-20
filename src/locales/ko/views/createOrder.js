export default {
  createOrder: '주문서 작성',
  orderInfo: '주문 정보',
  deliveryInfo: '배달 정보',
  cupDeposit: '1회용 컵 보증금',
  cupDepositOne: '개당 300원',
  cupDepositInclusion: '포함',
  applying: '적용중',
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
    },
    dropAddressDetail: {
      title: '상세 주소',
      placeholder: '상세 주소를 입력해 주세요.',
    },
    actualPayPrice: {
      title: '메뉴 금액',
      label: '금액을 입력해 주세요.',
      placeholder: '숫자만 입력하세요.',
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
      freeProductMessage: '무료로 제공하는 주문입니다.',
      description: '라이더님이 오기 전까지의 준비 시간을 선택해주세요.',
    },
  },
  mixPayment: {
    title: '결제 수단별로 나누어서 결제합니다.',
    remainingAmount: '남은 결제 금액',
    priceNotMatch: '분할 금액이 총 금액과 일치하지 않습니다.',
    inputField: {
      preparePrice: {
        placeholder: '선결제 금액을 입력해 주세요.',
      },
      creditCardPrice: {
        placeholder: '후불카드 금액을 입력해 주세요.',
      },
      cashPrice: {
        placeholder: '후불현금 금액을 입력해 주세요.',
      },
    },
    toastMessage: {
      notPrepaid: '1회용 컵 보증금은 선결제로 설정할 수 없습니다.\n다른 결제 수단을 사용해 주세요.',
      notDivisible: '1회용 컵 보증금은 {price}원 미만으로 결제수단을 나눌 수 없습니다.',
    },
  },
  paymentMethod: {
    card: '후불카드',
    cash: '후불현금',
    prepaid: '선결제',
    mixpaid: '복합결제',
  },
  message: {
    cupDepositMaxcount: '1회용 컵 보증금은 최대 99개까지 설정 가능합니다.',
    cupDepositOverPriceMenu: '1회용 컵 보증금 ({price}원)은 메뉴 금액 초과로 설정할 수 없습니다.',
    menuPriceNotSetting: '메뉴 금액은 1회용 컵 보증금 {price}원 미만으로 설정할 수 없습니다.',
    errorIsUntact: '비대면 배달은 선결제만 가능합니다.',
    fixAndRetry: '수정 후 다시 시도해주세요.',
    errorOverTime: '완료 후 3시간이 지난 주문은 다시 주문할 수 없습니다.',
    errorTemporaryAndRetry: '일시적인 문제로 접수에 실패했습니다. 다시 시도해주세요.',
    errorInvaildAddress: '주소를 식별할 수 없습니다. 주소를 변경하시거나, 관리자에게 문의해주세요.',
    reOrderConfirmText: '고객 정보, 총 결제 금액, 결제 수단을 확인했습니다.',
    invalidOrderTotalPrice: '상품 가격과 총 결제금액이 다릅니다. 주문 제휴사에서 다시 확인해주세요.',
  },
  bottomSheet: {
    orderMemos: {
      title: '라이더 요청사항',
    },
    productPrepare: {
      title: '상품 준비시간',
    },
  },
  orderDelivery: {
    distance: '거리',
    distanceAgencyFee: '거리 비례 대행료',
    vatPrice: '부가세',
    extraCharge: '할증',
    totalCharge: '요금 합계',
    delay: '지연',
    message: {
      estimatedPickupTime: '라이더 픽업 예상 시간에 맞춰 상품을 준비해주세요.',
      errorSettingAgencyFee: '배달대행료 설정에 맞지 않아 배달할 수 없습니다.',
      afterMinute: '분 후 ',
      pickupExpected: '라이더 픽업 예상',
    },
  },
  tempProduct: '임의상품',
  tempProductOption: '임의상품옵션',
  selfDelivery: '직접배달',
  agencyDelivery: '배달요청',
  cancelModal: {
    buttonText: {
      close: '닫기',
      cancel: '작성 취소',
    },
    cancelWriting: '주문서 작성을 취소하시겠어요?',
    cancelDescription:
      '작성하신 모든 내용은 저장되지 않습니다.',
  },
  duplicationModal: {
    title: '중복 주문입니다.',
    description: '다시 주문을 원하시면, 기존 주문서에서\n \'다시 주문\' 버튼을 선택하세요.',
    buttonText: {
      gotoDeliveryStatusView: '배달 현황으로 돌아가기',
      beforeOrderConfirm: '기존 주문서 확인하기',
    },
  },
};
