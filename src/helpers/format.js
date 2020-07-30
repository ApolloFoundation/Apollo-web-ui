import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';

export const secureStorage = new SecureStorage(localStorage, {
  hash: function hash(key) {
    key = CryptoJS.SHA256(key, process.env.REACT_APP_SECRET_KEY);

    return key.toString();
  },
  encrypt: function encrypt(data) {
    data = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET_KEY);

    data = data.toString();

    return data;
  },
  decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY);

    data = data.toString(CryptoJS.enc.Utf8);

    return data;
  },
});

export const formatCrypto = (value, digits = 6) => {
  value = parseInt(value) || 0;
  return value > 0 ? (value / Math.pow(10, 18)).toLocaleString('en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }) : value;
};

export const formatGweiToEth = (value, digits = 9) => {
  value = parseInt(value) || 0;
  return value > 0 ? (value * 0.000000001).toLocaleString('en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits + 10,
  }) : value;
};

export const base64ToBlob = url => fetch(`data:application/octet-stream;base64,${url}`).then(res => res.blob());

export const formatDivision = (val1, val2, digits = 6) => {
  const result = val2 === 0 ? 0 : val1 / val2;
  return result.toLocaleString('en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const division = (val1, val2, digits = 6) => {
  const result = val2 === 0 ? 0 : val1 / val2;
  return result.toLocaleString('en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
};

export const multiply = (val1, val2, digitsMax = 10, digitsMin = 10) => (parseFloat(val1 * val2).toLocaleString('en', {
  minimumFractionDigits: digitsMin,
  maximumFractionDigits: digitsMax,
  useGrouping: false,
}).replaceAll(',', ''));

export const currencyTypes = {
  apl: 0,
  eth: 1,
  pax: 2,
};
