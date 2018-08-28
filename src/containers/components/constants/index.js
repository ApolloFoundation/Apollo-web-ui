NRS.loadAlgorithmList = function (algorithmSelect, isPhasingHash) {
    var hashAlgorithms;
    if (isPhasingHash) {
        hashAlgorithms = NRS.constants.PHASING_HASH_ALGORITHMS;
    } else {
        hashAlgorithms = NRS.constants.HASH_ALGORITHMS;
    }
    for (var key in hashAlgorithms) {
        if (hashAlgorithms.hasOwnProperty(key)) {
            algorithmSelect.append($("<option />").val(hashAlgorithms[key]).text(key));
        }
    }
};

NRS.getRsAccountRegex = function(accountPrefix, withoutSeparator) {
    if (withoutSeparator) {
        return new RegExp("^" + accountPrefix + "-[A-Z0-9]{17}", "i");
    }
    return new RegExp(NRS.constants.ACCOUNT_REGEX_STR, "i");
};

NRS.getNumericAccountRegex = function() {
    return new RegExp("^\\d+$");
};

NRS.processConstants = function(response, resolve) {
    if (response.genesisAccountId) {
        NRS.constants.SERVER = response;
        NRS.constants.VOTING_MODELS = response.votingModels;
        NRS.constants.MIN_BALANCE_MODELS = response.minBalanceModels;
        NRS.constants.HASH_ALGORITHMS = response.hashAlgorithms;
        NRS.constants.PHASING_HASH_ALGORITHMS = response.phasingHashAlgorithms;
        NRS.constants.MINTING_HASH_ALGORITHMS = response.mintingHashAlgorithms;
        NRS.constants.MAX_TAGGED_DATA_DATA_LENGTH = response.maxTaggedDataDataLength;
        NRS.constants.MAX_PRUNABLE_MESSAGE_LENGTH = response.maxPrunableMessageLength;
        NRS.constants.GENESIS = response.genesisAccountId;
        NRS.constants.EPOCH_BEGINNING = response.epochBeginning;
        NRS.constants.REQUEST_TYPES = response.requestTypes;
        NRS.constants.API_TAGS = response.apiTags;
        NRS.constants.SHUFFLING_STAGES = response.shufflingStages;
        NRS.constants.SHUFFLING_PARTICIPANTS_STATES = response.shufflingParticipantStates;
        NRS.constants.DISABLED_APIS = response.disabledAPIs;
        NRS.constants.DISABLED_API_TAGS = response.disabledAPITags;
        NRS.constants.PEER_STATES = response.peerStates;
        NRS.constants.LAST_KNOWN_BLOCK.id = response.genesisBlockId;
        NRS.loadTransactionTypeConstants(response);
        NRS.constants.PROXY_NOT_FORWARDED_REQUESTS = response.proxyNotForwardedRequests;
        NRS.constants.COIN_SYMBOL = response.coinSymbol;
        $(".coin-symbol").html(response.coinSymbol);
        NRS.constants.ACCOUNT_PREFIX = response.accountPrefix;
        NRS.constants.PROJECT_NAME = response.projectName;
        NRS.constants.ACCOUNT_REGEX_STR = "^" + response.accountPrefix + "-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}";
        NRS.constants.ACCOUNT_RS_MATCH = NRS.getRsAccountRegex(response.accountPrefix);
        NRS.constants.ACCOUNT_NUMERIC_MATCH = NRS.getNumericAccountRegex();
        NRS.constants.ACCOUNT_MASK_ASTERIX = response.accountPrefix + "-****-****-****-*****";
        NRS.constants.ACCOUNT_MASK_UNDERSCORE = response.accountPrefix + "-____-____-____-_____";
        NRS.constants.ACCOUNT_MASK_PREFIX = response.accountPrefix + "-";
        NRS.constants.GENESIS_RS = converters.convertNumericToRSAccountFormat(response.genesisAccountId);
        NRS.constants.INITIAL_BASE_TARGET = parseInt(response.initialBaseTarget);
        NRS.constants.CURRENCY_TYPES = response.currencyTypes;
        if (resolve) {
            resolve();
        }
    }
};

NRS.loadServerConstants = function(resolve) {
    function processConstants(response) {
        NRS.processConstants(response, resolve);
    }
    if (NRS.isMobileApp()) {
        jQuery.ajaxSetup({ async: false });
        $.getScript("js/data/constants.js" );
        jQuery.ajaxSetup({async: true});
        processConstants(NRS.constants.SERVER);
    } else {
        if (isNode) {
            client.sendRequest("getConstants", {}, processConstants, false);
        } else {
            NRS.sendRequest("getConstants", {}, processConstants, false);
        }
    }
};

function getKeyByValue(map, value) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            if (value === map[key]) {
                return key;
            }
        }
    }
    return null;
}

function getVotingModelName(code) {
    dispatch => {
        return getKeyByValue(NRS.constants.votingModels, code);
    }
};

function getVotingModelCode(name) {
    return NRS.constants.VOTING_MODELS[name];
};

function getMinBalanceModelName(code) {
    return getKeyByValue(NRS.constants.MIN_BALANCE_MODELS, code);
};

function getMinBalanceModelCode(name) {
    return NRS.constants.MIN_BALANCE_MODELS[name];
};

function getHashAlgorithm(code) {
    return getKeyByValue(NRS.constants.HASH_ALGORITHMS, code);
};

function getShufflingStage(code) {
    return getKeyByValue(NRS.constants.SHUFFLING_STAGES, code);
};

function getShufflingParticipantState(code) {
    return getKeyByValue(NRS.constants.SHUFFLING_PARTICIPANTS_STATES, code);
};

function getPeerState(code) {
    return getKeyByValue(NRS.constants.PEER_STATES, code);
};

function isRequireBlockchain(requestType) {
    if (!NRS.constants.REQUEST_TYPES[requestType]) {
        // For requests invoked before the getConstants request returns,
        // we implicitly assume that they do not require the blockchain
        return false;
    }
    return true == NRS.constants.REQUEST_TYPES[requestType].requireBlockchain;
};

function isRequireFullClient(requestType) {
    if (!NRS.constants.REQUEST_TYPES[requestType]) {
        // For requests invoked before the getConstants request returns,
        // we implicitly assume that they do not require full client
        return false;
    }
    return true == NRS.constants.REQUEST_TYPES[requestType].requireFullClient;
};

function isRequestForwardable(requestType) {
    return NRS.isRequireBlockchain(requestType) &&
        !NRS.isRequireFullClient(requestType) &&
        (!(NRS.constants.PROXY_NOT_FORWARDED_REQUESTS instanceof Array) ||
            NRS.constants.PROXY_NOT_FORWARDED_REQUESTS.indexOf(requestType) < 0);
};

function isRequirePost(requestType) {
    if (!NRS.constants.REQUEST_TYPES[requestType]) {
        // For requests invoked before the getConstants request returns
        // we implicitly assume that they can use GET
        return false;
    }
    return true == NRS.constants.REQUEST_TYPES[requestType].requirePost;
};

function isRequestTypeEnabled(requestType) {
    if ($.isEmptyObject(NRS.constants.REQUEST_TYPES)) {
        return true;
    }
    if (requestType.indexOf("+") > 0) {
        requestType = requestType.substring(0, requestType.indexOf("+"));
    }
    return !!NRS.constants.REQUEST_TYPES[requestType];
};

function isSubmitPassphrase(requestType) {
    return requestType == "startForging" ||
        requestType == "stopForging" ||
        requestType == "startShuffler" ||
        requestType == "getForging" ||
        requestType == "markHost" ||
        requestType == "startFundingMonitor";
};

function isScheduleRequest(requestType) {
    var keyword = NRS.constants.SCHEDULE_PREFIX;
    return requestType && requestType.length >= keyword.length && requestType.substring(0, keyword.length) == keyword;
};

function getFileUploadConfig(requestType, data) {
    var config = {};
    if (requestType == "uploadTaggedData") {
        config.selector = "#upload_file";
        config.requestParam = "file";
        config.errorDescription = "error_file_too_big";
        config.maxSize = NRS.constants.MAX_TAGGED_DATA_DATA_LENGTH;
        return config;
    } else if (requestType == "dgsListing") {
        config.selector = "#dgs_listing_image";
        config.requestParam = "messageFile";
        config.errorDescription = "error_image_too_big";
        config.maxSize = NRS.constants.MAX_PRUNABLE_MESSAGE_LENGTH;
        return config;
    } else if (requestType == "sendMessage") {
        config.selector = "#upload_file_message";
        if (data.encrypt_message) {
            config.requestParam = "encryptedMessageFile";
        } else {
            config.requestParam = "messageFile";
        }
        config.errorDescription = "error_message_too_big";
        config.maxSize = NRS.constants.MAX_PRUNABLE_MESSAGE_LENGTH;
        return config;
    }
    return null;
};

function isApiEnabled(depends) {
    if (!depends) {
        return true;
    }
    var tags = depends.tags;
    if (tags) {
        for (var i=0; i < tags.length; i++) {
            if (tags[i] && !tags[i].enabled) {
                return false;
            }
        }
    }
    var apis = depends.apis;
    if (apis) {
        for (i=0; i < apis.length; i++) {
            if (apis[i] && !apis[i].enabled) {
                return false;
            }
        }
    }
    return true;
};