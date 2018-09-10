import qrcode from '../qr-code/qr-code'
import {getState} from "../../modules/account";
import BigInteger from 'big-integer';



function generateQRCode(target, qrCodeData, minType, cellSize) {
    var type = minType ? minType : 2;
    while (type <= 40) {
        try {
            var qr = qrcode(type, 'M');
            qr.addData(qrCodeData);
            qr.make();
            var img = qr.createImgTag(cellSize);
            return img;
        } catch (e) {
            type++;
        }
    }
    // $(target).empty().html($.t("cannot_encode_message", qrCodeData.length));
};

function getAccountMask(c) {
    // switch(c) {
    //     case "*":
    //         return NRS.constants.ACCOUNT_MASK_ASTERIX;
    //     case "_":
    //         return NRS.constants.ACCOUNT_MASK_UNDERSCORE;
    //     default:
    //         return NRS.constants.ACCOUNT_MASK_PREFIX ? NRS.constants.ACCOUNT_MASK_PREFIX : "APL-";
    // }

    return;
}

function isNumericAccountImpl(account, regex) {
    return regex.test(account);
};

function isNumericAccount(account) {
    return (dispatch, getState) => {

        const {account} = getState();

        return isNumericAccountImpl(account, getNumericAccountRegex());
    }
};

function getNumericAccountRegex() {
    return new RegExp("^\\d+$");
};

function isRsAccount(account) {
    return (dispatch, getState) => {

        const {account} = getState();
        // NRS.constants.SERVER = response;
        // NRS.constants.VOTING_MODELS = response.votingModels;
        // NRS.constants.MIN_BALANCE_MODELS = response.minBalanceModels;
        // NRS.constants.HASH_ALGORITHMS = response.hashAlgorithms;
        // NRS.constants.PHASING_HASH_ALGORITHMS = response.phasingHashAlgorithms;
        // NRS.constants.MINTING_HASH_ALGORITHMS = response.mintingHashAlgorithms;
        // NRS.constants.MAX_TAGGED_DATA_DATA_LENGTH = response.maxTaggedDataDataLength;
        // NRS.constants.MAX_PRUNABLE_MESSAGE_LENGTH = response.maxPrunableMessageLength;
        // NRS.constants.GENESIS = response.genesisAccountId;
        // NRS.constants.EPOCH_BEGINNING = response.epochBeginning;
        // NRS.constants.REQUEST_TYPES = response.requestTypes;
        // NRS.constants.API_TAGS = response.apiTags;
        // NRS.constants.SHUFFLING_STAGES = response.shufflingStages;
        // NRS.constants.SHUFFLING_PARTICIPANTS_STATES = response.shufflingParticipantStates;
        // NRS.constants.DISABLED_APIS = response.disabledAPIs;
        // NRS.constants.DISABLED_API_TAGS = response.disabledAPITags;
        // NRS.constants.PEER_STATES = response.peerStates;
        // NRS.constants.LAST_KNOWN_BLOCK.id = response.genesisBlockId;
        // NRS.loadTransactionTypeConstants(response);
        // NRS.constants.PROXY_NOT_FORWARDED_REQUESTS = response.proxyNotForwardedRequests;
        // NRS.constants.COIN_SYMBOL = response.coinSymbol;
        // $(".coin-symbol").html(response.coinSymbol);
        // NRS.constants.ACCOUNT_PREFIX = response.accountPrefix;
        // NRS.constants.PROJECT_NAME = response.projectName;
        // NRS.constants.ACCOUNT_REGEX_STR = "^" + response.accountPrefix + "-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}";
        // NRS.constants.ACCOUNT_RS_MATCH = NRS.getRsAccountRegex(response.accountPrefix);
        // NRS.constants.ACCOUNT_NUMERIC_MATCH = NRS.getNumericAccountRegex();
        // NRS.constants.ACCOUNT_MASK_ASTERIX = response.accountPrefix + "-****-****-****-*****";
        // NRS.constants.ACCOUNT_MASK_UNDERSCORE = response.accountPrefix + "-____-____-____-_____";
        // NRS.constants.ACCOUNT_MASK_PREFIX = response.accountPrefix + "-";
        // NRS.constants.GENESIS_RS = converters.convertNumericToRSAccountFormat(response.genesisAccountId);
        // NRS.constants.INITIAL_BASE_TARGET = parseInt(response.initialBaseTarget);
        // NRS.constants.CURRENCY_TYPES = response.currencyTypes;
        return isRsAccountImpl(account, getRsAccountRegex(account.constants.accountPrefix) ? getRsAccountRegex(account.constants.accountPrefix) : getRsAccountRegex("APL"));
    }
};

function isRsAccountImpl(account, regex) {
    return regex.test(account);
};

function getRsAccountRegex(accountPrefix, withoutSeparator) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (withoutSeparator) {
            return new RegExp("^" + accountPrefix + "-[A-Z0-9]{17}", "i");
        }
        return new RegExp("^" + account.constants.accountPrefix + "-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}", "i");
    }
};

function isFileEncryptionSupported() {
    return navigator.userAgent.indexOf("JavaFX") >= 0; // When using JavaFX you cannot read the file to encrypt
};

function isRequestTypeEnabled(requestType) {
    // if ($.isEmptyObject(NRS.constants.REQUEST_TYPES)) {
    //     return true;
    // }
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
            // For requests invoked before the getConstants request returns
            // we implicitly assume that they can use GET
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
            // For requests invoked before the getConstants request returns,
            // we implicitly assume that they do not require the blockchain
            return false;
        }
        return true == account.constants.requestType[requestType].requireBlockchain;
    }
};

function calculateOrderTotal(quantityATU, priceATM) {
    return quantityATU * priceATM;
}

function formatQuantity(quantity, decimals, noEscaping, zeroPad) {
    return format(convertToATUf(quantity, decimals, true), noEscaping, zeroPad);
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

function format(params, no_escaping, zeroPad) {
    let zeros = "00000000";
    let amount;
    let mantissa;
    if (typeof params !== "object") {
        amount = String(params);
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
        params = {
            "amount": amount,
            "negative": negative,
            "mantissa": mantissa
        };
    }

    amount = String(params.amount);
    let digits = amount.split("").reverse();
    let formattedAmount = "";
    let locale = ".";
    let formattedMantissa = params.mantissa.replace(".", locale.decimal);
    if (zeroPad) {
        let mantissaLen = formattedMantissa.length;
        if (mantissaLen > 0) {
            formattedMantissa += zeros.substr(0, zeroPad - mantissaLen + 1);
        } else {
            formattedMantissa += zeros.substr(0, zeroPad);
            if (zeroPad !== 0) {
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

    let output = (params.negative ? params.negative : "") + formattedAmount + formattedMantissa;

    return output;
}

function formatOrderPricePerWholeATU(price, decimals, zeroPad) {
    price = calculateOrderPricePerWholeATU(price, decimals, true);
    return format(price, false, zeroPad);
}

function calculateOrderPricePerWholeATU(price, decimals, returnAsObject) {
    if (typeof price !== "object") {
        price = new BigInteger(String(price));
    }

    return convertToAPL(price.multiply(new BigInteger("" + Math.pow(10, decimals))), returnAsObject);
};

function convertToAPL(amount, returnAsObject) {
    let negative = "";
    let mantissa = "";

    if (typeof amount !== "object") {
        amount = new BigInteger(String(amount));
    }
    console.warn("WTFTFTFTTF----------------------------------------, ", amount);
    if (amount.compareTo(BigInteger.ZERO) < 0) {
        amount = amount.abs();
        negative = "-";
    }

    var fractionalPart = amount.mod(new BigInteger("100000000")).toString();
    amount = amount.divide(new BigInteger("100000000"));

    if (fractionalPart && fractionalPart != "0") {
        mantissa = ".";

        for (var i = fractionalPart.length; i < 8; i++) {
            mantissa += "0";
        }

        mantissa += fractionalPart.replace(/0+$/, "");
    }

    amount = amount.toString();

    if (returnAsObject) {
        return {
            "negative": negative,
            "amount": amount,
            "mantissa": mantissa
        };
    } else {
        return negative + amount + mantissa;
    }
};


export default {
    generateQRCode,
    getAccountMask,
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