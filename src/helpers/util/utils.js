import qrcode from '../qr-code/qr-code'
import {getState} from "../../modules/account";
import BigInteger from 'big-integer';


function isNumericAccountImplAPL(account, regex) {
    return regex.test(account);
};

function isNumericAccount(account) {
    return (dispatch, getState) => {

        const {account} = getState();

        return isNumericAccountImplAPL(account, getNumericAccountRegex());
    }
};

function getNumericAccountRegex() {
    return new RegExp("^\\d+$");
};

function isRsAccount(account) {
    return (dispatch, getState) => {

        const {account} = getState();
        return isRsAccountImpl(account, getRsAccountRegexAPL(account.constants.accountPrefix) ? getRsAccountRegexAPL(account.constants.accountPrefix) : getRsAccountRegexAPL("APL"));
    }
};

function isRsAccountImpl(account, regex) {
    return regex.test(account);
};

function getRsAccountRegexAPL(accountPrefix, withoutSeparator) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (withoutSeparator) {
            return new RegExp("^" + accountPrefix + "-[A-Z0-9]{17}", "i");
        }
        return new RegExp("^" + account.constants.accountPrefix + "-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}", "i");
    }
};

function isFileEncryptionSupported() {
    return navigator.userAgent.indexOf("JavaFX") >= 0;
};

function isRequestTypeEnabled(requestType) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (requestType.indexOf("+") > 0) {
            requestType = requestType.substring(0, requestType.indexOf("+"));
        }
        return !!account.requestTypes[requestType];
    }
};

function isRequirePost(requestType) {
    return (dispatch, getState) => {

        const {account} = getState();
        if (!account.constants.requestType[requestType]) {

            return false;
        }
        return true === account.requestType[requestType].requirePost;
    }

};

function escapeRespStr(val) {
    if (String(val) === 'PRIVATE_PAYMENT') {
        return 'Private payment';
    }
    return String(val).unescapeHTML().escapeHTML();
};

function isRequireBlockchain(requestType) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (!account.constants.constants.requestType[requestType]) {
            return false;
        }
        return true == account.constants.requestType[requestType].requireBlockchain;
    }
};

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
            quantity = "0" + quantity;
        }
    }

    let mantissa = "";

    if (decimals) {
        mantissa = "." + quantity.substring(quantity.length - decimals);
        quantity = quantity.substring(0, quantity.length - decimals);

        if (!quantity) {
            quantity = "0";
        }

        mantissa = mantissa.replace(/0+$/, "");

        if (mantissa === ".") {
            mantissa = "";
        }
    }

    if (returnAsObject) {
        return {
            "amount": quantity,
            "mantissa": mantissa
        };
    } else {
        return quantity + mantissa;
    }
}

function formatAPL(p, isEscaping, pad) {
    let zeros = "00000000";
    let amount;
    let mantissa;
    if (typeof p !== "object") {
        amount = String(p);
        if (amount.indexOf(".") !== -1) {
            mantissa = amount.substr(amount.indexOf("."));
            amount = amount.replace(mantissa, "");
        } else {
            mantissa = "";
        }
        let negative = amount.charAt(0) === "-" ? "-" : "";
        if (negative) {
            amount = amount.substring(1);
        }
        p = {
            "amount": amount,
            "negative": negative,
            "mantissa": mantissa
        };
    }

    amount = String(p.amount);
    let digits = amount.split("").reverse();
    let formattedAmount = "";
    let locale = ".";
    let formattedMantissa = p.mantissa.replace(".", locale.decimal);
    if (pad) {
        let mantissaLen = formattedMantissa.length;
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

    let output = (p.negative ? p.negative : "") + formattedAmount + formattedMantissa;

    return output;
}

function formatOrderPricePerWholeATU(price, decimals, zeroPad) {
    price = calculateOrderPricePerWholeATU(price, decimals, true);
    return formatAPL(price, false, zeroPad);
}

function calculateOrderPricePerWholeATU(price, decimals, returnAsObject) {
    if (typeof price !== "object") {
        price = new BigInteger(String(price));
    }

    return convertToAPL(price.multiply(new BigInteger("" + Math.pow(10, decimals))), returnAsObject);
};

function convertToAPL(a, isObject) {
    let negativeres = "";
    let mantissares = "";

    if (typeof a !== "object") {
        a = new BigInteger(String(a));
    }

    if (a.compareTo(BigInteger.ZERO) < 0) {
        a = a.abs();
        negativeres = "-";
    }

    var fractionalPart = a.mod(new BigInteger("100000000")).toString();
    a = a.divide(new BigInteger("100000000"));

    if (fractionalPart && fractionalPart != "0") {
        mantissares = ".";

        for (var i = fractionalPart.length; i < 8; i++) {
            mantissares += "0";
        }

        mantissares += fractionalPart.replace(/0+$/, "");
    }

    a = a.toString();

    if (isObject) {
        return {
            "negative": negativeres,
            "amount": a,
            "mantissa": mantissares
        };
    } else {
        return negativeres + a + mantissares;
    }
};


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
    isRequireBlockchain
}