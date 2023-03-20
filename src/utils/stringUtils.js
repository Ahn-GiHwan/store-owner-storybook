const addHyphenPhoneNumber = (value) => {
  if (!value) {
    return '';
  }
  let newValue = '';
  newValue = value.replace(/[^0-9*]/g, '');

  const result = [];
  let restNumber = '';

  // 지역번호와 나머지 번호로 나누기
  if (newValue.startsWith('02')) {
    // 서울 02 지역번호
    result.push(newValue.substr(0, 2));
    restNumber = newValue.substring(2);
  } else if (newValue.startsWith('1')) {
    // 지역 번호가 없는 경우
    // 1xxx-yyyy
    restNumber = newValue;
  } else if (newValue.startsWith('0507')) {
    // 안심 번호로 시작하는 경우
    // 0507-xxxx-yyyy
    result.push(newValue.substr(0, 4));
    restNumber = newValue.substring(4);
  } else {
    // 나머지 3자리 지역번호
    // 0xx-yyyy-zzzz
    result.push(newValue.substr(0, 3));
    restNumber = newValue.substring(3);
  }

  if (restNumber.length === 7) {
    // 7자리만 남았을 때는 xxx-yyyy
    result.push(restNumber.substring(0, 3));
    result.push(restNumber.substring(3));
  } else {
    result.push(restNumber.substring(0, 4));
    result.push(restNumber.substring(4));
  }
  return result.filter((val) => val).join('-');
};

const addHyphenBusinessNumber = (_str) => {
  let str = _str;
  if (!str) return str;
  str = str.replace(/[^0-9]/g, '');
  let tmp = '';
  if (str.length < 4) {
    return str;
  }
  if (str.length < 6) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  }
  if (str.length < 11) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 2);
    tmp += '-';
    tmp += str.substr(5);
  }
  return tmp;
};

const validationBizNumber = (number) => {
  const numberMap = number
    .replace(/-/gi, '')
    .split('')
    .map((d) => parseInt(d, 10));
  const keyList = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let chk = 0;
  keyList.forEach((d, i) => {
    chk += d * numberMap[i];
  });
  chk += parseInt((keyList[8] * numberMap[8]) / 10, 10);
  return Math.floor(numberMap[9]) === (10 - (chk % 10)) % 10;
};

const comma = (str) => {
  const _str = String(str);
  return _str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};

const uncomma = (str) => {
  const _str = String(str);
  return _str.replace(/[^\d]+/g, '');
};

const numberWithCommas = (value) => comma(uncomma(value));

const stringToNumber = (value) => {
  if (typeof value === 'string') {
    return Number(value.replaceAll(',', ''));
  }
  return value;
};

const removeNonNumeric = (str) => {
  let result = str;
  if (result === null || result === undefined) {
    result = '';
  }
  return result.replace(/[\D]/g, '');
};

const utf8Tob64 = (str) => window.btoa(unescape(encodeURIComponent(str)));

const b64Toutf8 = (str) => decodeURIComponent(escape(window.atob(str)));

const nameMasking = (str) => str.substring(0, 1) + str.substring(1).replace(/./g, '*');

const phoneMasking = (str) => str.replace(/\d(?=.{4})/g, '*');

export {
  stringToNumber,
  numberWithCommas,
  addHyphenPhoneNumber,
  addHyphenBusinessNumber,
  validationBizNumber,
  removeNonNumeric,
  utf8Tob64,
  b64Toutf8,
  nameMasking,
  phoneMasking,
};
