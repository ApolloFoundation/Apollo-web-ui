import BigNumber from "bignumber.js";

const fmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: ''
}

export function createBigNumber(number) {
  return BigNumber.isBigNumber(number) ? number : new BigNumber(number);
}

export function checkIsValidBignumber (number) {
  return BigNumber.isBigNumber(number) && !BigNumber.isNaN(number);
}

export function bigIntDecimalsDivision (number, decimals) {
 const num = createBigNumber(number);
 const div = new BigNumber(10 ** decimals);
 return num.dividedBy(div);
}

export function bigIntToFixed (number, toFixed = 0) {
  return number.toFixed(toFixed);
}

export function bigIntFormat (bigIntNum, options = {}) {
  if (!checkIsValidBignumber) return null;
  return bigIntNum.toFormat({
    ...fmt,
    ...options,
  }) 
}

export function bigIntDivision (num1, num2) {
 const num = createBigNumber(num1);
 const div = createBigNumber(num2);
 return num.dividedBy(div);
}

export function bigIntMultiply (num1, num2) {
 const num = createBigNumber(num1);
 const mul = createBigNumber(num2);
 return num.multipliedBy(mul);
}