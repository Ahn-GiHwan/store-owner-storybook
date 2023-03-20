const regexPassword = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{10,}$/;
const regexPassword1 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
const regexId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
const regexPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
const regexTel = /^0([0-9]{1,4})-?([0-9]{3,4})-?([0-9]{4})$/;
const regexTel2 = /^(15|16|18)[0-9]{2}-?[0-9]{4}$/;
const regexName = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;

const commonRules = [(v) => !!v || '필수 입력값 입니다.'];

const validationBizNumber = (number) => {
  if (!number) return false;
  if (number.length < 12) return false;
  const numberMap = number
    .replace(/-/gi, '')
    .split('')
    .map((d) => parseInt(d, 10));
  if (numberMap.length === 10) {
    const keyList = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let chk = 0;
    keyList.forEach((d, i) => {
      chk += d * numberMap[i];
    });
    chk += parseInt((keyList[8] * numberMap[8]) / 10, 10);
    return Math.floor(numberMap[9]) === (10 - (chk % 10)) % 10;
  }
  return true;
};

const Rules = {
  loginIdRule: [
    (v) => ((v && v.length >= 5) && regexId.test(v)) || '영문자, 숫자 포함 5자 이상',
    (v) => (v && v.length > 20) && '최대 20자리까지 입력 가능합니다.',
  ],
  passwordRule: [
    (v) => (v && v.length >= 8) || '8자리 이상',
    (v) => (regexPassword1.test(v) || regexPassword.test(v)) || '영문, 숫자, 특수문자를 포함시켜 주세요.',
    (v) => (v && v.length > 20) && '최대 20자리까지 입력 가능합니다.',
  ],
  emailRules: [
    (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '유효한 이메일 입력하세요.',
  ],
  phoneRules: [
    (v) => ((v && v.replaceAll('-', '').length >= 10) && regexPhone.test(v)) || '올바른 휴대폰 번호를 입력해 주세요.',
  ],
  nameRules: [
    (v) => regexName.test(v) || '한글, 영문자만 입력하세요.',
    (v) => (v && v.length >= 2) || '최소 2자리 이상 입력하세요.',
  ],
  telRules: [(v) => regexTel.test(v) || regexTel2.test(v) || '잘못된 전화번호를 입력하였습니다.'],
  corpNumberRules: [
    (v) => (v && v.length === 12) || '10자리로 입력해 주세요.',
    (v) => validationBizNumber(v) || '올바른 사업자 번호를 입력해 주세요.',
  ],
};
Object.keys(Rules).forEach((key) => {
  Rules[key].unshift(...commonRules);
});

export default Rules;
