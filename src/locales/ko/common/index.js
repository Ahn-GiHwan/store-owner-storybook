import login from './login';
import layer from './layer';

export default {
  login,
  layer,
  version: '버전',
  view: '보기',
  gotoLoginPage: '로그인 페이지로 이동',
  currency: '원',
  unit: {
    case: '건',
    orderProduct: '개',
  },
  button: {
    cancel: '취소',
    confirm: '확인',
    close: '닫기',
    modifyCompleted: '수정완료',
    complete: '완료',
    apply: '적용',
  },
  dateTime: {
    year: '년',
    month: '월',
    day: '일',
    hour: '일',
    minute: '분',
    second: '초',
  },
  address: {
    dropAddress: '도착지',
    name: '주소',
    road: '도로',
    jibun: '지번',
    findAddress: '주소검색',
    searchFormPlaceholder: '도로명+번지, 법정동+번지 주소를 입력하세요',
    noSearch: '검색결과가 없습니다.',
    tipBold: '도로명 + 번지, 법정동 + 번지',
    tipDescript:
      '로 검색하시면 더욱 빠르게 찾을 수 있습니다. 검색 결과가 많을 경우 시군구를 추가해 보세요.\n예시 : 언주로 314 , 역삼동 761-28\n\n강남 띄어쓰기를 하면 더욱 잘 찾을 수 있습니다. 검색 결과가 없을 경우 틀린 글자가 있는지 확인해 보세요.',
    initialSearch: '초성검색 사용하기',
    initialSearchDescription:
      '초성검색을 클릭하면 한글 초성 키보드를 사용할 수 있습니다.\n띄어쓰기에 유의해 주세요.\n예시 : ㄱㄴ ㅇㅈㄹ 134 32\n',
    O2OSkipOrderAddress: '대리 접수 주문으로 생략되었습니다.',
  },
  extraCharges: {
    WEATHER: '기상',
    HOLIDAY: '명절',
    AREA: '구역',
    TIME: '시간', // (피크, 야간)
    OVERLOAD: '과적',
    VALUABLE: '귀중',
    DISTANCE: '거리',
    ETC: '기타',
  },
  deliveryAgency: {
    barogo: '바로고',
    beyondinc: '비욘드아이엔씨',
    moacall: '모아콜',
    self: '자체배달',
    unknown: '알 수 없는 배달대행사',
  },
  deliveryStatus: {
    CREATED: '생성',
    ASSIGNED: '할당',
    ACCEPTED: '접수',
    ALLOCATED: '배차',
    ALLOCATION_CANCELED: '배차 취소',
    ALLOCATION_CHANGED: '배차 변경',
    COOK_REQUESTED: '조리 요청',
    ARRIVED: '도착',
    PICKUP_FINISHED: '픽업',
    DROP_FINISHED: '완료',
    CANCELED: '배달 취소',
    REJECTED: '배달 거절',
    FAILED: '배달 실패',
  },
  deliveryStatusForSelf: {
    ALLOCATED: '접수',
    PICKUP_FINISHED: '출발',
    DROP_FINISHED: '완료',
  },
  orderAgencies: {
    '13mile': '13마일',
    admin: '관리자 주문',
    ainopos: '아이노포스',
    amore_aritaum: '아리따움',
    angelinus: '엔제리너스',
    angelsoft: '매장천사',
    baechelin: '배슐랭',
    baegofa: '배고파',
    baemin: '배달의 민족',
    baemin_delivery: '배달의 민족',
    barogo_hq: '관리자CS (HQ)',
    barogo_hub: '관리자CS (HUB)',
    barogo_store: '바로고 상점',
    beyondpos: '비욘드포스',
    bgfretail: 'CU',
    bhc: '큰맘할매순대국',
    cj_food_vips: '빕스',
    css: 'CSS',
    daegu: '대구로',
    daeguro: '대구로',
    daonfresh: '한상드림',
    doyajokbalnfood: '도야족발',
    dreamnhappy: '콜신져',
    emart24: '이마트24',
    firstkitchen: '공유주방1번가',
    foodtech: '푸드테크',
    gs_lalavla: 'GS랄라블라',
    honeybees: '허니비즈',
    hyundaidept: '현대백화점',
    imtsoft: '도시주방',
    kfc: 'KFC',
    kiosk: '키오스크',
    konai: '배달서구',
    krispykreme: '크리스피크림',
    lastorder: '라스트오더',
    lotteria: '롯데리아',
    meatpeople: '미트피플',
    mfgkorea: '매드포갈릭',
    mybell: '마이벨',
    myeongsu: '배달의 명수',
    myungsu: '배달의 명수',
    nhnpayco: '페이코/배달특급',
    nowbusking: '나우버스킹',
    nowpick: '나우픽',
    oliveyoung: '올리브영',
    payco: '페이코/배달특급',
    pos: 'POS',
    posbank: '포스뱅크',
    posfeed: '포스피드',
    self: '자체주문',
    sf_nobrandburger: '노브랜드버거',
    sf_nobrandpizza: '노브랜드피자',
    shuttle: '셔틀딜리버리',
    somunnanshop: '소문난샵',
    sp_br_baskinrobbins: '배스킨라빈스',
    spc: 'SPC',
    spiderinc: '스파이더아이앤씨',
    starbucks: '스타벅스',
    tengo: 'Tengo',
    tgif: 'TGIF',
    tonymoly: '토니모리',
    ulsanpay: '울산페이',
    unionsoft: '유니온POS',
    unknown: '알수없는 제휴사',
    wemakepriceo: '위메프오',
    wmpo: '위메프오',
    yogiyo: '요기요',
    yogiyo_delivery: '요기요',
  },

  order: {
    deliveryInfo: {
      distance: '거리',
      distanceAgencyFee: '거리 비례 대행료',
      vatPrice: '부가세',
      extraCharge: '할증',
      totalCharge: '요금합계',
      delay: '지연',
      message: {
        estimatedPickupTime: '라이더 픽업 예상 시간에 맞춰 상품을 준비해주세요.',
        errorSettingAgencyFee: '배달대행료 설정에 맞지 않아 배달할 수 없습니다.',
        afterMinute: '분 후 ',
        pickupExpected: '라이더 픽업 예상',
      },
      sum: '합계',
    },
    salesInfo: {
      viewPeriod: '조회 기간',
      totalRevenue: '총 수익',
      detailSales: '상세 매출',
      totalPaymentPrice: '고객 결제 합계',
      totalPaymentHistory: '고객 결제 내역',
      totalPaymentHistoryNotice: '조회 기간 내 주문 정보 기반의 결제 금액입니다. \n 주문 한 건에 결제는 여러 건 발생할 수 있습니다.',
      totalDeliveryPrice: '배달 대행료 합계',
      totalDeliveryHistory: '배달 결제 내역',
      totalDeliveryHistoryNotice: '조회 기간 내 배달대행 건수와 배달대행료입니다. \n 하나의 주문에 여러 건 배달이 발생할 경우 배달이 완료된 건은 우선하여 배달 결제 내역에 포함됩니다.',
      deferredPayment: '후불결제',
      prepayment: '선결제',
      complexPayment: '복합결제',
      card: '카드',
      cash: '현금',
      cupDeposit: '1회용 컵 보증금',
      deliveryOrder: '배달 주문',
      packingOrder: '포장 주문',
      hallOrder: '홀 주문',
      basicAgencyFee: '기본 대행료',
      extraCharge: '할증',
      deliverySurcharge: '배달 할증',
      vatPrice: '부가세',
      deliveryNotice: '추가배달 주문 건에 배달이 여러 건 발생할 수 있습니다.',
      deliveryCommission: '배달 대행 수수료',
      managementFeeCase: '건당 관리비',
    },
  },
  deliveryAdditionType: {
    OVERLOAD: '부피 초과',
    MISSOUT_PRODUCT: '상품 누락',
    CLAIM_PRODUCT: '상품 문제',
    MISTAKE_STORE: '매장 실수',
    MISTAKE_DELIVERY: '라이더 실수',
    MISTAKE_CUSTOMER: '고객 실수',
    ETC: '기타 사유',
  },
  reorderType: {
    OVERLOAD: '부피 초과',
    MISSOUT_PRODUCT: '상품 누락',
    CLAIM_PRODUCT: '상품 문제',
    MISTAKE_STORE: '매장 실수',
    MISTAKE_CUSTOMER: '고객 실수',
    MISTAKE_DELIVERY: '라이더 실수',
    ETC: '기타',
  },
  paymentMethod: {
    PREPAID: '선결제',
    CASH: '현금결제',
    CARD: '카드결제',
    MIXED_PAYMENT: '복합결제',
  },
  deliveryPossibleReason: {
    BAD_WEATHER: '궂은 날씨로 배달할 수 없습니다.',
    CLOSE_AGENCY: '대행사 영업 중단으로 배달할 수 없습니다.',
    CLOSE_STORE: '배달 영업시간으로 설정되어 있지 않아 배달할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_DEFERRED_PAYMENT: '후불결제 불가능 배달대행사입니다. 결제수단을 변경하세요.',
    DELIVERY_AGENCY_CAN_NOT_RESERVATION: '예약할 수 있는 배달 대행사가 없어 배달할 수 없습니다.',
    DELIVERY_AGENCY_CAN_NOT_UNTACT: '비대면 배달이 가능한 배달 대행사가 없어 배달할 수 없습니다.',
    DELIVERY_DISABLED: '기타 사유로 배달이 중단되어 배달할 수 없습니다.',
    ETC: '기타 사유로 배달할 수 없습니다.',
    EXTERNAL_SERVICE_UNAVAILABLE: '배달대행사 서비스 중단으로 배달을 접수할 수 없습니다.',
    EXTRA_CHARGE_NOT_ACCEPTED: '할증 적용 여부를 선택하지 않아 배달할 수 없습니다.',
    INCORRECT_DELIVERY_PRICE_SETTING: '배달대행료 설정에 맞지 않아 배달할 수 없습니다.',
    INSUFFICIENT_DEPOSIT: '예치금이 부족해 배달할 수 없습니다.',
    INVALID_AREA: '배달할 수 없는 지역이라 배달할 수 없습니다.',
    INVALID_ADDRESS: '주소를 식별할 수 없어 배달할 수 없습니다.',
    InvalidpickupWishAt: '픽업시간(%s 이상)으로 상품준비시간을 선택해주세요.',
    MAINTENANCE_TIME: '대행사 점검 시간이라 배달을 접수할 수 없습니다.',
    NOT_FOUND_DELIVERY_POSSIBLE_AREA: '배달 가능 구역이 아니므로 직접 배달만 가능합니다.',
    OVER_CAPACITY: '현재 주문량이 많아 배달할 수 없습니다.',
    TOO_LONG_DELIVERY_DISTANCE: '너무 먼 거리라 배달할 수 없습니다.',
    UNKNOWN_SERVER_ERROR: '서버 오류로 배달을 접수 할 수 없습니다.',
    WRONG_REQUEST: '주문 정보가 잘못되어 배달할 수 없습니다.',
  },
};