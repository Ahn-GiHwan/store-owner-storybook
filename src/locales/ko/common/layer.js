export default {
  requestDelivery: {
    acceptOrderTitle: '주문 수락',
    requestDeliveryTitle: '배달 요청',
    changeToAgencyDeliveryTitle: '배달대행으로 변경',
    acceptOrderDescription: '상품 준비시간과 배달 완료시간을 선택하세요.',
    requestDeliveryDescription: '상품 준비시간을 선택하세요.',
    label: {
      arrivalTime: '고객 도착 시간',
      prepareTime: '상품 준비시간',
      storeDropExpectedTime: '배달 완료시간 (고객 안내)',
      prepareTimeOption: '{value}분',
      storeDropExpectedTimeOption: '{value}분 후',
      untact: '비대면 배달 요청',
      riderPreparationTime: '라이더님이 오기 전까지의 준비 시간을 선택해주세요.',
      customerPreparationTime: '고객에게 안내할 배달 완료 시간을 선택합니다.',
    },
    button: {
      requestSelfDelivery: '직접 배달',
      requestAgencyDelivery: '배달 요청',
      changeToAgencyDelivery: '배달대행으로 변경',
    },
  },
  resolveDelivery: {
    title: '해결하기',
    button: {
      modifyOrder: '주문 수정',
      requestDelivery: '배달 요청',
      changeToSelfDelivery: '직접 배달',
      cancelOrder: '주문 취소',
      hideOrder: '목록에서 제거',
    },
    label: {
      customerPhone: '주문인 연락처 : {phone}',
      changeToSelfDelivery: '라이더를 부르지 않고 직접 배달하시겠어요?',
      wrongAddress: '고객 주소를 잘못 입력했나요?',
      wrongReceiverInfo: '고객 정보나 전화번호가 다른가요?',
      modifyOrder: '주문서를 수정하시겠어요?',
      operateAgain: '대행사가 다시 운영을 시작했나요?',
      rechargeDeposit: '예치금을 충전했나요?',
      checkConnection: '대행사와 연동 상태를 확인했나요?',
      checkConnectionSub: '대행사와 연동 상태를 확인했나요?',
      solveProblem: '문제가 해결되어 다시 배달해야 하나요?',
      cancelOrder: '더 이상 배달할 방법이 없나요?',
      hideOrder: '바로고가 배달할 주문이 아닌가요?',
      hideOrderSub: '배달의 민족, 요기요 주문을 취소해야 한다면 주문앱 고객센터로 연락해주세요.',
      deposit: {
        loading: '예치금 잔액을 조회하고 있습니다.',
        loaded: '{deliveryAgency} 예치금 {deposit}원',
        error: '예치금 잔액을 조회하지 못했습니다.',
      },
    },
  },
  hideOrderModal: {
    title: '목록에서 정말로 제거하시겠어요?',
    description: '바로고 사장님 프로그램에서만 주문이 제거됩니다.',
    button: {
      hideOrder: '목록에서 제거',
    },
  },
  cancelOrderModal: {
    title: '주문을 정말로 취소하시겠어요?',
    description: '주문을 취소할 시, 진행중이던 배달도\n함께 취소됩니다.',
    button: {
      cancelOrder: '주문 취소',
    },
  },
};
