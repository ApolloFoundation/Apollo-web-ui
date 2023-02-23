/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

 import BigNumber from "bignumber.js";
 const { BigInteger } = require('jsbn');
 
 export function bigIntDecimalsDivision (number, decimals) {
  const num = new BigNumber(number);
  const div = new BigNumber(10 ** decimals);
  const res =  num.dividedBy(div);
  return res.toFixed();
}

export function bigIntDivision (num1, num2) {
  const num = new BigNumber(num1);
  const div = new BigNumber(num2);
  const res =  num.dividedBy(div);
  return res.toFixed();
}

function normalizeTicker(ticker) {
  return (ticker === 'Apollo' ? 'APL' : ticker.toUpperCase());
}

function isNumericAccountImplAPL(account, regex) {
  return regex.test(account);
}

function isNumericAccount() {
  return (dispatch, getState) => {
    const { account } = getState();

    return isNumericAccountImplAPL(account, getNumericAccountRegex());
  };
}

function getNumericAccountRegex() {
  return new RegExp('^\\d+$');
}

function isRsAccount() {
  return (dispatch, getState) => {
    const { account } = getState();
    return isRsAccountImpl(account, getRsAccountRegexAPL(account.constants.accountPrefix) ? getRsAccountRegexAPL(account.constants.accountPrefix) : getRsAccountRegexAPL('APL'));
  };
}

function isRsAccountImpl(account, regex) {
  return regex.test(account);
}

function getRsAccountRegexAPL(accountPrefix, withoutSeparator) {
  return (dispatch, getState) => {
    const { account } = getState();

    if (withoutSeparator) {
      return new RegExp(`^${accountPrefix}-[A-Z0-9]{17}`, 'i');
    }
    return new RegExp(`^${account.constants.accountPrefix}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}`, 'i');
  };
}

function isFileEncryptionSupported() {
  return navigator.userAgent.indexOf('JavaFX') >= 0;
}

function isRequestTypeEnabled(requestType) {
  return (dispatch, getState) => {
    const { account } = getState();

    if (requestType.indexOf('+') > 0) {
      requestType = requestType.substring(0, requestType.indexOf('+'));
    }
    return !!account.requestTypes[requestType];
  };
}

function isRequirePost(requestType) {
  return (dispatch, getState) => {
    const { account } = getState();
    if (!account.constants.requestType[requestType]) {
      return false;
    }
    return account.requestType[requestType].requirePost === true;
  };
}

function escapeRespStr(val) {
  if (String(val) === 'PRIVATE_PAYMENT') {
    return 'Private payment';
  }
  return String(val).unescapeHTML().escapeHTML();
}

function isRequireBlockchain(requestType) {
  return (dispatch, getState) => {
    const { account } = getState();

    if (!account.constants.constants.requestType[requestType]) {
      return false;
    }
    return account.constants.requestType[requestType].requireBlockchain == true;
  };
}

function calculateOrderTotal(quantityATU, priceATM) {
  return quantityATU * priceATM;
}

function formatQuantity(quantity, decimals, noEscaping, zeroPad) {
  return formatAPL(convertToATUf(quantity, decimals, true), noEscaping, zeroPad);
}

function convertToATUf(quantity, decimals, returnAsObject) {
  quantity = String(quantity);

  if (quantity.length < decimals) {
    for (let i = quantity.length; i < decimals; i++) {
      quantity = `0${quantity}`;
    }
  }

  let mantissa = '';

  if (decimals) {
    mantissa = `.${quantity.substring(quantity.length - decimals)}`;
    quantity = quantity.substring(0, quantity.length - decimals);

    if (!quantity) {
      quantity = '0';
    }

    mantissa = mantissa.replace(/0+$/, '');

    if (mantissa === '.') {
      mantissa = '';
    }
  }

  if (returnAsObject) {
    return {
      amount: quantity,
      mantissa,
    };
  }
  return quantity + mantissa;
}

function convertToATM(currency) {
  currency = String(currency);

  const parts = currency.split('.');

  const amount = parts[0];

  // no fractional part
  let fraction;
  if (parts.length == 1) {
    fraction = '00000000';
  } else if (parts.length == 2) {
    if (parts[1].length <= 8) {
      fraction = parts[1];
    } else {
      fraction = parts[1].substring(0, 8);
    }
  }

  for (let i = fraction.length; i < 8; i++) {
    fraction += '0';
  }

  let result = `${amount}${fraction}`;

  // remove leading zeroes
  result = result.replace(/^0+/, '');

  if (result === '') {
    result = '0';
  }

  return result;
}

function formatAPL(p, isEscaping, pad) {
  const zeros = '00000000';
  let amount;
  let mantissa;
  if (typeof p !== 'object') {
    amount = String(p);
    if (amount.indexOf('.') !== -1) {
      mantissa = amount.substr(amount.indexOf('.'));
      amount = amount.replace(mantissa, '');
    } else {
      mantissa = '';
    }
    const negative = amount.charAt(0) === '-' ? '-' : '';
    if (negative) {
      amount = amount.substring(1);
    }
    p = {
      amount,
      negative,
      mantissa,
    };
  }

  amount = String(p.amount);
  const digits = amount.split('').reverse();
  let formattedAmount = '';
  const locale = '.';
  let formattedMantissa = p.mantissa.replace('.', locale.decimal);
  if (pad) {
    const mantissaLen = formattedMantissa.length;
    if (mantissaLen > 0) {
      formattedMantissa += zeros.substr(0, pad - mantissaLen + 1);
    } else {
      formattedMantissa += zeros.substr(0, pad);
      if (pad !== 0) {
        formattedMantissa = locale.decimal + formattedMantissa;
      }
    }
  }
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedAmount = locale.section + formattedAmount;
    }
    formattedAmount = digits[i] + formattedAmount;
  }

  const output = (p.negative ? p.negative : '') + formattedAmount + formattedMantissa;

  return output;
}

function formatOrderPricePerWholeATU(price, decimals, zeroPad) {
  price = calculateOrderPricePerWholeATU(price, decimals, true);
  return formatAPL(price, false, zeroPad);
}

function calculateOrderPricePerWholeATU(price, decimals, returnAsObject) {
  if (typeof price !== 'object') {
    price = new BigInteger(String(price));
  }

  return convertToAPL(price.multiply(new BigInteger(`${Math.pow(10, decimals)}`)), returnAsObject);
}

function convertToAPL(a, isObject) {
  let negativeres = '';
  let mantissares = '';

  if (typeof a !== 'object') {
    a = new BigInteger(String(a));
  }

  if (a < 0) {
    a = a.abs();
    negativeres = '-';
  }

  const fractionalPart = a.mod(new BigInteger('100000000')).toString();
  a = a.divide(new BigInteger('100000000'));

  if (fractionalPart && fractionalPart != '0') {
    mantissares = '.';

    for (let i = fractionalPart.length; i < 8; i++) {
      mantissares += '0';
    }

    mantissares += fractionalPart.replace(/0+$/, '');
  }

  a = a.toString();

  if (isObject) {
    return {
      negative: negativeres,
      amount: a,
      mantissa: mantissares,
    };
  }
  return negativeres + a + mantissares;
}

function amountToPrecision(amount, decimals) {
  amount = String(amount);

  const parts = amount.split('.');

  if (parts.length == 1) {
    return parts[0];
  } if (parts.length == 2) {
    let fraction = parts[1];
    fraction = fraction.replace(/0+$/, '');

    if (fraction.length > decimals) {
      fraction = fraction.substring(0, decimals);
    }

    return `${parts[0]}.${fraction}`;
  }
}

function resolverReservePerUnit(decimals, reserveSupply, amount) {
  const resSupply = parseInt(convertToATUf(reserveSupply, decimals)).toString();
  const amountATM = convertToATM(amount);
  let unitAmountATM = new BigInteger(amountATM);
  if (resSupply) {
    unitAmountATM = unitAmountATM.divide(new BigInteger(resSupply));
  }
  const roundUnitAmountATM = convertToATM(amountToPrecision(convertToAPL(unitAmountATM), decimals));
  const reserveCurrencyTotal = convertToAPL(roundUnitAmountATM);
  const reserveCurrencyAmount = convertToAPL(new BigInteger(roundUnitAmountATM).multiply(new BigInteger(resSupply)).toString());
  return {
    total: reserveCurrencyTotal,
    amount: reserveCurrencyAmount,
  };
}

function isDesktopApp() {
  return navigator.userAgent.indexOf('JavaFX') >= 0;
}

function parseStringBySpace(str) {
  const parsedStr = str ? str.replace(/\W\s+/g, ' ').toLowerCase().split(' ') : [];
  return parsedStr;
}

// return false if it isn't available
function checkEthNodeAvailable (wallets) {
  return !(wallets?.balances?.pax === null && wallets?.balances?.eth === null);
}

export default {
  isNumericAccount,
  isRsAccount,
  calculateOrderTotal,
  formatQuantity,
  formatOrderPricePerWholeATU,
  isRequestTypeEnabled,
  isFileEncryptionSupported,
  escapeRespStr,
  isRequirePost,
  resolverReservePerUnit,
  isRequireBlockchain,
  isDesktopApp,
  parseStringBySpace,
  normalizeTicker,
  checkEthNodeAvailable,
};
