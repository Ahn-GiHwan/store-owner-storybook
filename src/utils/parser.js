import * as Sentry from '@sentry/vue';
import logger from '@/plugins/vueLogger';
import { b64Toutf8 } from '@/utils/stringUtils';
import { PAYMENT_METHOD } from '@/constants';
/*
 * 크롬 익스텐션으로 넘어오는 값 구조 예시
 * 참고) https://github.com/barogo/gorela/issues/9911#issuecomment-1316671508
  {
      "orderPackageID": "10154087",
      "orderNumber": "1149994-16/11/2022-25691",
      "storeName": "NP6-1149994",
      "customerName": "양은광 -",
      "customerPhone": "01041542638",
      "parsedAddress": {
          "주소1": {
              "origin": "제주특별자치도서귀포시제주특별자치도 서귀포시 가파로67번길45 (대정읍 가파리) 지번: 4649994 동",
              "siDo": "제주특별자치도서귀포시제주특별자치도",
              "siGunGu": "서귀포시",
              "roadName": "가파로67번길",
              "mainBuildingNumber": "45",
              "type": "ROAD",
              "detail": "(대정읍 가파리) 지번: 4649994 동"
          },
          "주소2": {
              "origin": "제주특별자치도서귀포시대정읍464 -0 번지 9994 동",
              "siDo": "제주특별자치도",
              "siGunGu": "서귀포시",
              "eupMyeonDong": "대정읍",
              "mainLandNumber": "464",
              "type": "JIBUN",
              "detail": " -0 번지 9994 동"
          }
      },
      "order": {
          "주문날짜": "2022-11-16",
          "주문시간": "17:51",
          "회사명": "",
          "라이더이름": "",
          "주소2": "제주특별자치도서귀포시대정읍464 -0 번지 9994 동",
          "주소1": "제주특별자치도서귀포시제주특별자치도 서귀포시 가파로67번길45 (대정읍 가파리) 지번: 4649994 동",
          "주소특이사항": "",
          "주문특이사항": ""
      },
      "orderProducts": [
          {
              "제품명": "페퍼로니 메가/세트",
              "수량": 1,
              "단가": 11800,
              "수정주문": "",
              "총액": 12100
          },
          {
              "제품명": ">> 후렌치 후라이-M/단품",
              "수량": 1,
              "단가": "",
              "수정주문": "",
              "총액": ""
          },
          {
              "제품명": ">> 콜라-M",
              "수량": 1,
              "단가": "",
              "수정주문": "",
              "총액": ""
          },
          {
              "제품명": ">> 컵 보증금",
              "수량": "",
              "단가": 300,
              "수정주문": "",
              "총액": ""
          },
          (이하 생략...)
      ],
      "price": {
          "지불방법": "현금",
          "": "",
          "할인": 3000,
          "총액": 25400,
          "부가세": 2236,
          "지불금액": 25400,
          "소액주문비": 0,
          "거스름돈": 0
      }
  }
*/
const _parseJibunAddress = (originAddress) => {
  const {
    siDo,
    siGunGu,
    eupMyeonDong,
    ri,
    mainLandNumber,
    subLandNumber,
  } = originAddress;

  let result = '';
  if (siDo) result += siDo;
  if (siGunGu) result += ` ${siGunGu}`;
  if (eupMyeonDong) result += ` ${eupMyeonDong}`;
  if (ri) result += ` ${ri}`;
  if (mainLandNumber) result += ` ${mainLandNumber}`;
  if (subLandNumber) result += `-${subLandNumber}`;

  return result;
};

const _parseRoadAddress = (originAddress) => {
  const {
    siDo,
    siGunGu,
    eupMyeonDong,
    roadName,
    mainBuildingNumber,
    subBuildingNumber,
  } = originAddress;

  let result = '';
  if (siDo) result += siDo;
  if (siGunGu) result += ` ${siGunGu}`;
  if (eupMyeonDong) result += ` ${eupMyeonDong}`;
  if (roadName) result += ` ${roadName}`;
  if (mainBuildingNumber) result += ` ${mainBuildingNumber}`;
  if (subBuildingNumber) result += `-${subBuildingNumber}`;

  return result;
};

const _parseAddress = (parsedAddress) => {
  let roadAddress;
  let jibunAddress;
  let unknownAddress;

  let jibunDetail;
  let roadDetail;
  let unknownDetail;

  Object.values(parsedAddress).forEach((address) => {
    if (address.type === 'JIBUN') {
      jibunAddress = _parseJibunAddress(address);
      jibunDetail = address.detail;
    } else if (address.type === 'ROAD') {
      roadAddress = _parseRoadAddress(address);
      roadDetail = address.detail;
    } else {
      // UNKNOWN 타입이라면 우선 파싱은 합니다. 두 방법 모두로 파싱해 봅니다.
      unknownAddress = _parseRoadAddress(address) || _parseJibunAddress(address);
      unknownDetail = address.detail;
    }
  });

  // 도로명 주소가 존재하지 않는다면 unknownAddress 에서 받아온 주소를 도로명 주소로 간주합니다.
  roadAddress = roadAddress || unknownAddress;

  // 상세 주소는 각 주소별로 파싱에 성공한 상세주소가 있다면 도로명 > 지번 > 알수없음 타입의 상세주소를 사용합니다.
  const detail = roadDetail || jibunDetail || unknownDetail || '';

  return { roadAddress, jibunAddress, detail, unknownAddress };
};

const parseMcdonaldOrder = (hashValue) => {
  logger.info('hashValue', hashValue);
  const decodedData = JSON.parse(b64Toutf8(hashValue));
  logger.info('mcData', decodedData);

  const {
    orderNumber,
    // storeName, // 매장명
    customerName,
    customerPhone,
    order,
    parsedAddress,
    price,
    orderProducts: mcOrderProducts,
  } = decodedData;

  // 주문제휴사 정보
  const orderAgencyStoreId = orderNumber.split('-')[0];
  const orderAgencyOrderId = orderNumber;

  // 고객정보
  const ordererName = customerName;
  const ordererPhone = customerPhone;

  // 주소정보
  const { jibunAddress, roadAddress, detail, unknownAddress } = _parseAddress(parsedAddress);
  const dropJibunAddress = jibunAddress;
  const dropRoadAddress = roadAddress;
  const dropAddressDetail = detail;
  const dropUnknownAddress = unknownAddress;

  // 결제정보
  const totalPayPrice = price.총액 + price.소액주문비 + (price.할인 || 0);
  const actualPayPrice = price.총액 + price.소액주문비;

  let prepaidPrice = 0;
  let paymentCashPrice = 0;
  let paymentCardPrice = 0;

  let paymentMethodType;
  switch (price.지불방법) {
    case '선결제':
      prepaidPrice = actualPayPrice;
      paymentMethodType = PAYMENT_METHOD.PREPAID;
      break;
    case '수표':
    case '현금':
    case '오만원권':
      paymentCashPrice = actualPayPrice;
      paymentMethodType = PAYMENT_METHOD.CASH;
      break;
    case '카드 단말기':
      paymentCardPrice = actualPayPrice;
      paymentMethodType = PAYMENT_METHOD.CARD;
      break;
    default:
      {
        const errorMessage = `[parseMcdonaldOrder Error] ${price.지불방법} is not defineded`;
        logger.error(errorMessage);
        Sentry.captureException(new Error(errorMessage));
      }
      break;
  }

  // 주문상품정보
  // '>>' 텍스트 기준으로
  // - 없는 경우 상품
  // - 있는 경우 상품옵션으로 구분함
  let cupDeposit = 0;
  let orderProductIndex = -1;
  const orderProducts = [];
  mcOrderProducts.forEach((item) => {
    if (!item.제품명.includes('>>')) {
      orderProducts.push({
        type: 'FOOD',
        name: item.제품명,
        quantity: item.수량 || 1,
        unitPrice: item.단가 || 0,
        totalPrice: item.총액 || 0,
        orderProductOptions: [],
      });

      orderProductIndex += 1;
    } else {
      orderProducts[orderProductIndex].orderProductOptions.push({
        quantity: item.수량 || 1,
        name: item.제품명,
        unitPrice: item.단가 || 0,
      });
      // 컵 보증금
      if (item.제품명.includes('컵 보증금')) {
        cupDeposit += item.단가;
      }
    }
  });

  // 소액주문비가 있는 경우 배달팁 상품 메뉴 추가
  if (price.소액주문비 > 0) {
    orderProducts.push({
      type: 'DELIVERY_TIP',
      name: '배달팁',
      quantity: 1,
      unitPrice: price.소액주문비,
      totalPrice: price.소액주문비,
      orderProductOptions: [],
    });
  }

  // 비과세 계산 (선결제인 경우 0, 후불 결제인 경우 메뉴에 있는 컵 보증금 합계)
  const taxFreePayPrice = paymentMethodType === PAYMENT_METHOD.PREPAID ? 0 : cupDeposit;

  // 메모정보
  const storeOrderMemo = order.주문특이사항;

  return {
    orderAgencyStoreId,
    orderAgencyOrderId,
    ordererName,
    ordererPhone,
    dropJibunAddress,
    dropRoadAddress,
    dropAddressDetail,
    dropUnknownAddress,
    totalPayPrice,
    actualPayPrice,
    prepaidPrice,
    paymentCashPrice,
    paymentCardPrice,
    paymentMethodType,
    taxFreePayPrice,
    storeOrderMemo,
    orderProducts,
  };
};

export {
  parseMcdonaldOrder,
};
