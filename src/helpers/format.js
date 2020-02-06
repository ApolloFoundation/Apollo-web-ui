export const formatCrypto = (value, digits = 6) => {
    value = parseInt(value) || 0;
    return value > 0 ? (value / Math.pow(10, 18)).toLocaleString('en', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }) : value;
};

export const formatGweiToEth = (value, digits = 9) => {
    value = parseInt(value) || 0;
    return value > 0 ? (value * 0.000000001).toLocaleString('en', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits + 10
    }) : value;
};

export const base64ToBlob = (url) => {
    return fetch(`data:application/octet-stream;base64,${url}`).then(res => res.blob());
};

export const formatDivision = (val1, val2, digits = 6) => {
    const result = val2 === 0 ? 0 : val1 / val2;
    return result.toLocaleString('en', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
};

export const division = (val1, val2, digits = 6) => {
    const result = val2 === 0 ? 0 : val1 / val2;
    return result.toLocaleString('en', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: false
    });
};

export const multiply = (val1, val2, digits = 10) => parseFloat((val1 * val2).toLocaleString('en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false
}).replaceAll(',', ''));

export const currencyTypes = {
    'apl': 0,
    'eth': 1,
    'pax': 2,
};
