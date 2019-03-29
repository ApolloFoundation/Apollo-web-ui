export const formatCrypto = (value) => {
    value = parseInt(value);
    return value > 0 ? (value / Math.pow(10, 18)).toLocaleString('en', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
    }) : value;
};