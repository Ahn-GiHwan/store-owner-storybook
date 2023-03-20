export default {
  ordersDownloadBottomSheet: {
    title: '엑셀 다운로드',
    description: '바로고 사장님의 카드 매출 자료를 엑셀 파일 (.xlsx)로 다운로드 가능합니다.',
    descriptionPreparing: '카드 매출 자료를 엑셀 파일 (.xlsx)로 다운로드 중입니다.\n 페이지를 벗어날 경우 다운로드는 취소됩니다.',
    label: {
      createdAt: '조회 기간',
      orderStatus: '주문 상태',
      orderOption: '정렬 기준',
      deliveryType: '배달 유형',
      orderCount: '주문 개수',
      finished: '완료',
      canceled: '취소',
      allOrder: '전체 주문',
      orderOptionDesc: '최신순',
      orderOptionAsc: '오래된 순',
      selfDeliveryType: '직접 배달',
      agencyDeliveryType: '배달대행사',
      allDeliveryType: '배달 전체',
      count: '{value}건',
      excelFilePreparing: '엑셀 파일 준비중 (최대 30초 소요)',
      excelFilePrepareSuccess: '엑셀 파일 준비 완료',
      paymentMethod: '결제 수단',
      paymentMethodAll: '결제 수단 전체',
      prepaidPaymentMethod: '선결제',
      cardPaymentMethod: '후불 카드',
      cashPaymentMethod: '후불 현금',
      mixedPaymentMetohd: '복합 결제',
    },
    message: {
      downloadPreparedSuccess: '엑셀 다운로드 준비가 완료되었습니다.\n다운로드를 마저 진행해주세요.',
      downloadPreparedFail: '엑셀 파일을 다운로드 받지 못했습니다. 다시 시도해 주세요.',
      downloadCanceled: '엑셀 파일 다운로드를 취소하였습니다.',
    },
    button: {
      excelDownload: '엑셀 다운로드',
      downloadPreparing: '다운로드 준비중',
    },
  },
  OrdersDownloadCancelModal: {
    title: '엑셀 다운로드를 취소하시겠어요?',
    description: '다운로드 받은 엑셀 파일은 저장되지 않습니다.',
    button: {
      continueDownload: '계속 다운로드',
      cancelDownload: '다운로드 취소',
    },
  },
};