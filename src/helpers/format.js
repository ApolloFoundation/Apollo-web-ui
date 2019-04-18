export const formatCrypto = (value) => {
    value = parseInt(value);
    return value > 0 ? (value / Math.pow(10, 18)).toLocaleString('en', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
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

export const multiply = (val1, val2) => parseFloat((val1 * val2).toFixed(10));

export const currencyTypes = {
    'apl': 0,
    'eth': 1,
    'pax': 2,
};
