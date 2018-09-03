import qrcode from '../qr-code/qr-code'
import {getState} from "../../modules/account";


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

function  getAccountMask(c) {
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

export default {
    generateQRCode,
    getAccountMask,
    isNumericAccount,
    isRsAccount,
    isRequestTypeEnabled,
    isFileEncryptionSupported,
    escapeRespStr,
    isRequirePost,
    isRequireBlockchain
}