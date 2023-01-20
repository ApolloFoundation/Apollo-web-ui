/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import $ from 'jquery';
import i18n from 'i18next';
import util from '../../helpers/util/utils';
import crypto from '../crypto/crypto';
import config from '../../config';
import converters from '../converters'
import AplAddress from '../util/apladres'
import {processElGamalEncryption} from '../../actions/crypto';
import {NotificationManager} from "react-notifications";
import { handleFetch } from 'helpers/fetch';
import axios from 'axios';

const BigInteger = require('jsbn').BigInteger;
let forms = {};

const configServer = config;

let isLocalHost = false;

function checkRequestType(requestType, data) {
    const reqTypeOfForging = [
        'startForging',
        'stopForging'
    ]
    if (reqTypeOfForging.includes(requestType)) {
        return processElGamalEncryption(data, requestType);
    } else {
        return processElGamalEncryption(data);
    }
}

function submitForm(data, requestType, ) {
    return async (dispatch, getState) => {
        const {account, accountSettings, modals, fee} = getState();
        const { decimals } = account;
        if (requestType !== 'generateAccount') {
            if (data.secretPhrase) {
                let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(data.secretPhrase));
                isPassphrase = isPassphrase.split('-');
                isPassphrase[0] = account.constants.accountPrefix;
                isPassphrase = isPassphrase.join('-');

                if (account.accountRS !== isPassphrase) {
                    data.passphrase = await checkRequestType(requestType ,data.secretPhrase);
                    delete data.secretPhrase;
                } else {
                    data.secretPhrase = await checkRequestType(requestType ,data.secretPhrase);
                    delete data.passphrase;
                }
            } else if (data.passphrase) {
                let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(data.passphrase));
                isPassphrase = isPassphrase.split('-');
                isPassphrase[0] = account.constants.accountPrefix;
                isPassphrase = isPassphrase.join('-');
                if (account.accountRS !== isPassphrase) {
                    data.passphrase = await checkRequestType(requestType ,data.passphrase);
                    delete data.secretPhrase;
                } else {
                    data.secretPhrase = await checkRequestType(requestType ,data.passphrase);
                    delete data.passphrase;
                }
            }
        }

        if (data.encrypt_message) {
            data.messageToEncrypt = data.message;
            delete data.message;
            delete data.encrypt_message;
        }

        data.sender = account.account;

        var $form;
        var requestTypeKey;

        var successMessage = getSuccessMessage(requestTypeKey);
        var errorMessage = getErrorMessage(requestTypeKey);
        

        var formFunction = forms[requestType];
        var formErrorFunction = forms[requestType + "Error"];

        if (typeof formErrorFunction != "function") {
            formErrorFunction = false;
        }

        var originalRequestType = requestType;

        var invalidElement = false;

        console.dir({
            $form,
            requestTypeKey,
            successMessage,
            errorMessage,
            forms,
            formErrorFunction,
            invalidElement,
        })

        if (invalidElement) {
            return;
        }

        if (data.createNoneTransactionMethod) {
            data.account = account.account;
            delete data.sender;
        }

        if (Object.values(data).length) {
            var output = data;

            if (!output) {
                return;
            } else if (output.error) {
                if (formErrorFunction) {
                    // эта штука функцией не будет и на нее забиваем
                    formErrorFunction();
                }
                return;
            } else {
                // выносим requestType (вопрос зачем, если он у нас и так есть)
                if (output.requestType) {
                    requestType = output.requestType;
                }
                // такой фигни тоже вроде нет. Данные везде вроде норм передаются в модалках
                if (output.data) {
                    data = output.data;
                }
                // этой шляпы тоже нет в проекте по поиску
                if ("successMessage" in output) {
                    successMessage = output.successMessage;
                }
                if ("errorMessage" in output) {
                    errorMessage = output.errorMessage;
                }
                if (output.stop) {
                    if (errorMessage) {
                        $form.find(".error_message").html(errorMessage).show();
                    } else if (successMessage) {
                        $.growl(successMessage.escapeHTML(), {
                            type: "success"
                        });
                    }
                    return;
                }
                if (output.reload) {
                    window.location.reload(output.forceGet);
                    return;
                }
            }
        }

        if (!data.deadline) {
            data.deadline = 1440;
        }

        if (data.feeATM && $.isNumeric(data.feeATM)) {
            data.feeATM = data.feeATM * decimals
        }

        if (data.amountATM && $.isNumeric(data.amountATM)) {
            data.amountATM = data.amountATM * decimals
        }

        if (data.priceATM && $.isNumeric(data.priceATM)) {
            data.priceATM = data.priceATM * decimals
        }

        if (data.priceOrder) {
            data.priceATM = data.priceOrder;

            delete data.priceOrder;
        }

        if (data.quantityOrder) {
            data.quantityATU = data.quantityOrder;

            delete data.quantityOrder;
        }

        if (data.deliveryDeadlineTimestamp) {
            data.deliveryDeadlineTimestamp = String(toEpochTime() + 60 * 60 * data.deliveryDeadlineTimestamp);
        }

        if (data.doNotBroadcast || data.calculateFee) {
            data.broadcast = "false";

            if (data.doNotBroadcast) {
                delete data.doNotBroadcast;
            }
        }

        if ((data.feeAPL             > fee.minFeeAmount ||
             data.feeATM / decimals > fee.minFeeAmount
        ) && !fee.isFeeAlert) {
            NotificationManager.warning(`You are trying to send the transaction with fee that exceeds ${fee.minFeeAmount} APL`, 'Attention', 10000);

            dispatch({
                type: 'SET_FEE_ALERT',
                payload: true
            });
            dispatch({
                type: 'IS_MODAL_PROCESSING',
                payload: false
            });
            return;
        } else {
            dispatch({
                type: 'SET_FEE_ALERT',
                payload: false
            });
        }


        if (data.messageFile && data.encrypt_message) {
            console.log("🚀 ~ file: forms.js:222 ~ return ~ data.encrypt_message", data.encrypt_message, util.isFileEncryptionSupported())
            if (!util.isFileEncryptionSupported()) {
                $form.find(".error_message").html(i18n.t("file_encryption_not_supported")).show();
                if (formErrorFunction) {
                    formErrorFunction(false, data);
                }
                return;
            }
            try {
                crypto.encryptFileAPL(data.messageFile, data.encryptionKeys, function(encrypted) {
                    data.messageFile = encrypted.file;
                    data.encryptedMessageNonce = converters.byteArrayToHexString(encrypted.nonce);
                    delete data.encryptionKeys;

                    return sendRequest(requestType, data, function (response) {})
                });
            } catch (err) {
                $form.find(".error_message").html(String(err).escapeHTML()).show();
                if (formErrorFunction) {
                    formErrorFunction(false, data);
                }
            }
        } else {
            if (requestType === 'sendMoneyPrivate') {
                data.deadline = '1440';
                return sendRequest(requestType, data, function (response) {});
            } else {

                return dispatch(
                    sendRequest(requestType, data, function (response) {})
                );
            }

        }
    }
};

function toEpochTime(currentTime) {
    if (currentTime == undefined) {
        currentTime = new Date();
    }
    return Math.floor((currentTime - 1385294400000) / 1000);
};

function getSuccessMessage(requestType) {
    var ignore = ["asset_exchange_change_group_name", "asset_exchange_group", "add_contact", "update_contact", "delete_contact",
        "send_message", "decrypt_messages", "start_forging", "stop_forging", "generate_token", "send_money", "set_alias", "add_asset_bookmark", "sell_alias"
    ];

    if (ignore.indexOf(requestType) !== -1) {
        return "";
    } else {
        var key = "success_" + requestType;
    }
}

function getErrorMessage(requestType) {
    var ignore = ["start_forging", "stop_forging", "generate_token", "validate_token"];

    if (ignore.indexOf(requestType) != -1) {
        return "";
    } else {
        var key = "error_" + requestType;
    }
}

function addMessageData(data, requestType) {
    return (dispatch, getState) => {

        const {account} = getState();
        if (requestType == "sendMessage") {
            data.add_message = true;
        }

        if (!data.add_message && !data.add_note_to_self) {
            delete data.message;
            delete data.note_to_self;
            delete data.encrypt_message;
            delete data.add_message;
            delete data.add_note_to_self;
            return data;
        } else if (!data.add_message) {
            delete data.message;
            delete data.encrypt_message;
            delete data.add_message;
        } else if (!data.add_note_to_self) {
            delete data.note_to_self;
            delete data.add_note_to_self;
        }

        data["_extra"] = {
            "message": data.message,
            "note_to_self": data.note_to_self
        };
        var encrypted;
        var uploadConfig = getFileUploadConfig("sendMessage", data);
        if ($(uploadConfig.selector)[0].files[0]) {
            data.messageFile = $(uploadConfig.selector)[0].files[0];
        }
        if (data.add_message && (data.message || data.messageFile)) {
            if (data.encrypt_message) {
                try {
                    var options = {};
                    if (data.recipient) {
                        options.account = data.recipient;
                    } else if (data.encryptedMessageRecipient) {
                        options.account = data.encryptedMessageRecipient;
                        delete data.encryptedMessageRecipient;
                    }

                    if (data.messageFile) {
                        // We read the file data and encrypt it later
                        data.messageToEncryptIsText = "false";
                        data.encryptedMessageIsPrunable = "true";
                        data.encryptionKeys = getEncryptionKeys(options, data.secretPhrase);
                    } else {
                        if (data.doNotSign) {
                            data.messageToEncrypt = data.message;
                        } else {
                            encrypted = encryptNote(data.message, options, data.secretPhrase);
                            data.encryptedMessageData = encrypted.message;
                            data.encryptedMessageNonce = encrypted.nonce;
                        }
                        data.messageToEncryptIsText = "true";
                        if (!data.permanent_message) {
                            data.encryptedMessageIsPrunable = "true";
                        }
                    }
                    delete data.message;
                } catch (err) {
                    throw err;
                }
            } else {
                if (data.messageFile) {
                    data.messageIsText = "false";
                    data.messageIsPrunable = "true";
                } else {
                    data.messageIsText = "true";
                    if (!data.permanent_message && converters.stringToByteArray(data.message).length >= 28) {
                        data.messageIsPrunable = "true";
                    }
                }
            }
        } else {
            delete data.message;
        }

        if (data.add_note_to_self && data.note_to_self) {
            try {
                if (data.doNotSign) {
                    data.messageToEncryptToSelf = data.note_to_self;
                } else {
                    encrypted = encryptNote(data.note_to_self, {
                        "publicKey": converters.hexStringToByteArray(crypto.generatePublicKeyAPL(data.secretPhrase))
                    }, data.secretPhrase);

                    data.encryptToSelfMessageData = encrypted.message;
                    data.encryptToSelfMessageNonce = encrypted.nonce;
                }
                data.messageToEncryptToSelfIsText = "true";
                delete data.note_to_self;
            } catch (err) {
                throw err;
            }
        } else {
            delete data.note_to_self;
        }
        delete data.add_message;
        delete data.add_note_to_self;
        return data;
    }
};

function getEncryptionKeys(options, secretPhrase){
    if (!options.sharedKey) {
        if (!options.privateKey) {
            if (!secretPhrase) {

            }

            options.privateKey = converters.hexStringToByteArray(crypto.getPrivateKeyAPL(secretPhrase));
        }

        if (!options.publicKey) {
            if (!options.account) {
                throw {
                    "message": i18n.t("error_account_id_not_specified"),
                    "errorCode": 2
                };
            }

            try {
                options.publicKey = converters.hexStringToByteArray(crypto.getPublicKeyAPL(options.account, true));
            } catch (err) {
                var aplAddress = new AplAddress();

                if (!aplAddress.set(options.account)) {
                    throw {
                        "message": i18n.t("error_invalid_account_id"),
                        "errorCode": 3
                    };
                } else {
                    throw {
                        "message": i18n.t("error_public_key_not_specified"),
                        "errorCode": 4
                    };
                }
            }
        } else if (typeof options.publicKey == "string") {
            options.publicKey = converters.hexStringToByteArray(options.publicKey);
        }
    }
    return options;
};

function encryptNote(message, options, secretPhrase) {
    try {
        options = crypto.getEncryptionKeysAPl(options, secretPhrase);
        var encrypted = crypto.encryptDataAPL(converters.stringToByteArray(message), options);
        return {
            "message": converters.byteArrayToHexString(encrypted.data),
            "nonce": converters.byteArrayToHexString(encrypted.nonce)
        };
    } catch (err) {
        if (err.errorCode && err.errorCode < 5) {
            throw err;
        } else {
            throw {
                "message": i18n.t("error_message_encryption"),
                "errorCode": 5
            };
        }
    }
};

function convertToAPL(amount, returnAsObject) {
    var negative = "";
    var mantissa = "";

    if (typeof amount != "object") {
        amount = new BigInteger(String(amount));
    }

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

function updateFee(modal, feeATM) {
    var fee = $("#" + modal.attr('id').replace('_modal', '') + "_fee");
    fee.val(convertToAPL(feeATM));
    var recalcIndicator = $("#" + modal.attr('id').replace('_modal', '') + "_recalc");
    recalcIndicator.hide();
}

function sendRequest(requestType, data, callback, options) {
    return (dispatch, getState) => {
        const account = getState().account;
        console.log("🚀 ~ file: forms.js:506 ~ return ~ account", account)

        if (!options) {
            options = {};
        }
        if (requestType == undefined) {
            return;
        }

        if (!util.isRequestTypeEnabled(requestType)) {
            return {
                "errorCode": 1,
                "errorDescription": i18n.t("request_of_type", {
                    type: requestType
                })
            };
        }
        if (data == undefined) {
            return;
        }
        if (callback == undefined) {
            return;
        }

        $.each(data, function (key, val) {
            if (key != "secretPhrase") {
                if (typeof val == "string") {
                    data[key] = $.trim(val);
                }
            }
        });
        //convert APL to ATM...
        var field = "N/A";

        // convert asset/currency decimal amount to base unit
        try {
            var currencyFields = [
                ["phasingQuorumATUf", "phasingHoldingDecimals"],
                ["phasingMinBalanceATUf", "phasingHoldingDecimals"],
                ["controlQuorumATUf", "controlHoldingDecimals"],
                ["controlMinBalanceATUf", "controlHoldingDecimals"],
                ["minBalanceATUf", "create_poll_asset_decimals"],
                ["minBalanceATUf", "create_poll_ms_decimals"],
                ["amountATUf", "shuffling_asset_decimals"],
                ["amountATUf", "shuffling_ms_decimals"]
            ];
            var toDelete = [];
            for (i = 0; i < currencyFields.length; i++) {
                var decimalUnitField = currencyFields[i][0];
                var decimalsField = currencyFields[i][1];
                field = decimalUnitField.replace("ATUf", "");

                if (decimalUnitField in data && decimalsField in data) {
                    data[field] = convertToATU(parseFloat(data[decimalUnitField]), parseInt(data[decimalsField]));
                    toDelete.push(decimalUnitField);
                    toDelete.push(decimalsField);
                }
            }
            for (var i = 0; i < toDelete.length; i++) {
                delete data[toDelete[i]];
            }
        } catch (err) {
            return {
                "errorCode": 1,
                "errorDescription": err + " (" + i18n.t(field) + ")"
            };
        }

        if (!data.recipientPublicKey) {
            delete data.recipientPublicKey;
        }
        if (!data.referencedTransactionFullHash) {
            delete data.referencedTransactionFullHash;
        }

        //gets account id from passphrase client side, used only for login.
        var accountId;
        if (requestType == "getAccountIdAPL") {
            accountId = dispatch(crypto.getAccountIdAPL()(data.secretPhrase));

            var aplAddress = new AplAddress();
            var accountRS = "";
            if (aplAddress.set(accountId)) {
                accountRS = aplAddress.toString();
            }
            callback({
                "account": accountId,
                "accountRS": accountRS
            });
            return;
        }

        return dispatch(processAjaxRequest(requestType, data, callback, options));
    }
};

function convertToATU(quantity, decimals) {
    quantity = String(quantity);

    var parts = quantity.split(".");

    var qnt = parts[0];

    //no fractional part
    var i;
    if (parts.length == 1) {
        if (decimals) {
            for (i = 0; i < decimals; i++) {
                qnt += "0";
            }
        }
    } else if (parts.length == 2) {
        var fraction = parts[1];
        if (fraction.length > decimals) {
            throw i18n.t("error_fraction_decimals", {
                "decimals": decimals
            });
        } else if (fraction.length < decimals) {
            for (i = fraction.length; i < decimals; i++) {
                fraction += "0";
            }
        }
        qnt += fraction;
    } else {
        throw i18n.t("error_invalid_input");
    }

    //in case there's a comma or something else in there.. at this point there should only be numbers
    if (!/^\d+$/.test(qnt)) {
        throw i18n.t("error_invalid_input_numbers");
    }
    try {
        if (parseInt(qnt) === 0) {
            return "0";
        }
    } catch (e) {
    }

    //remove leading zeroes
    return qnt.replace(/^0+/, "");
};

function convertToATM(currency) {
    currency = String(currency);

    var parts = currency.split(".");

    var amount = parts[0];

    //no fractional part
    var fraction;
    if (parts.length == 1) {
        fraction = "00000000";
    } else if (parts.length == 2) {
        if (parts[1].length <= 8) {
            fraction = parts[1];
        } else {
            fraction = parts[1].substring(0, 8);
        }
    } else {
        throw i18n.t("error_invalid_input");
    }

    for (var i = fraction.length; i < 8; i++) {
        fraction += "0";
    }

    var result = amount + "" + fraction;

    //in case there's a comma or something else in there.. at this point there should only be numbers
    if (!/^\d+$/.test(result)) {
        throw i18n.t("error_invalid_input");
    }

    //remove leading zeroes
    result = result.replace(/^0+/, "");

    if (result === "") {
        result = "0";
    }

    return result;
};

function isPassphraseAtRisk() {
    return (dispatch, getState) => {

        const {account} = getState();

        return !isLocalHost || account.blockchainStatus && account.blockchainStatus.apiProxy || isMobileApp();
    }
};

function isMobileApp() {
    return (dispatch, getState) => {
        const {account} = getState();
        return window["cordova"] !== undefined || (account.mobileSettings && account.mobileSettings.is_simulate_app);
    }
};

function isVolatileRequest(doNotSign, type, requestType, secretPhrase) {
    if (secretPhrase && util.isMobileApp()) {
        return true;
    }
    return (isPassphraseAtRisk() || doNotSign) && type == "POST" && !util.isSubmitPassphrase(requestType);
}

function processAjaxRequest(requestType, data, callback, options) {
    return (dispatch) => {
        var extra = null;
        if (data["_extra"]) {
            extra = data["_extra"];
            delete data["_extra"];
        }
        var currentPage = null;
        var currentSubPage = null;

        var httpMethod = (util.isRequirePost(requestType) || "secretPhrase" in data || "doNotSign" in data || "adminPassword" in data ? "POST" : "GET");
        if (httpMethod == "GET") {
            if (typeof data == "string") {
                data += "&random=" + Math.random();
            } else {
                data.random = Math.random();
            }
        }

        if (data.referencedTransactionFullHash) {
            if (!/^[a-z0-9]{64}$/.test(data.referencedTransactionFullHash)) {
                return {
                    "errorCode": -1,
                    "errorDescription": i18n.t("error_invalid_referenced_transaction_hash")
                };
            }
        }

        var secretPhrase = "";

        $.support.cors = true;
        // Used for passing row query string which is too long for a GET request
        if (data.querystring) {
            data = data.querystring;
            httpMethod = "POST";
        }
        var contentType;
        var processData;
        var formData = null;

        var url;
        if (requestType === 'importKeyViaFile') {
            url = configServer.api.server + '/rest/keyStore/upload';
        } else {
            if (options.remoteNode) {
                url = options.remoteNode.getUrl() + "/apl";
            } else {
                url = configServer.api.serverUrl;
            }

            url += "requestType=" + requestType;
        }

        var config = dispatch(getFileUploadConfig(requestType, data));
        console.log("🚀 ~ file: forms.js:749 ~ return ~ config", config)

        if (config) {
            // inspired by http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
            contentType = false;
            processData = false;
            formData = new FormData();
            var file = data.file;
            // var tempFiel = Object.assign(data.messageFile);
            if (data.messageFile) {
                file = data.messageFile;
                delete data.messageFile;
                delete data.encrypt_message;
            } else {
                try {
                    // file = $("#file")[0].files[0];
                } catch(e) {
                    // console.log(e);
                }
            }
            if (!file && (requestType === "uploadTaggedData" || requestType === "importKeyViaFile")) {
                return {
                    "errorCode": 3,
                    "errorDescription": i18n.t("error_no_file_chosen")
                };
            }
            if (file && file.size > config.maxSize) {
                return {
                    "errorCode": 3,
                    "errorDescription": i18n.t(config.errorDescription, {
                        "size": file.size,
                        "allowed": config.maxSize
                    })
                };
            }
            httpMethod = "POST";
            formData.append(config.requestParam, file);

            if (requestType === "importKeyViaFile") {
                delete data.sender;
                delete data.format;
                delete data.deadline;
            }
            for (var key in data) {
                if (!data.hasOwnProperty(key)) {
                    continue;
                }
                if (data[key] instanceof Array) {
                    for (var i = 0; i < data[key].length; i++) {
                        formData.append(key, data[key][i]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            }
        }
         else {
            // JQuery defaults
            contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            processData = true;
        }

        dispatch({
            type: 'SET_AMOUNT_WARNING',
            payload: 0
        });
        dispatch({
            type: 'SET_FEE_WARNING',
            payload: 0
        });
        dispatch({
            type: 'SET_ASSET_WARNING',
            payload: 0
        });
        dispatch({
            type: 'SET_CURRENCY_WARNING',
            payload: 0
        });

        if (data.messageFile === 'undefined') {
            delete data.messageFile;
        }

        if (requestType === "importKeyViaFile") {
            return fetch(`${configServer.api.server}/rest/keyStore/upload`, {
                method: 'POST',
                body: (formData != null ? formData : data)
            })
                .then(res => res.json())
                .then((res) => {
                    return res;
                })
                .catch(() => {

                });
        }
        if (requestType === "cancelBidOrder" || requestType === "cancelAskOrder") {
            delete data.publicKey;
        }

        if (data.formData) {
            return axios.post('/apl?requestType=' + requestType, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        // return handleFetch('/apl?requestType=' + requestType, 'POST', formData, requestType, false, true)
        console.dir({
            url,
            options,
            currentPage,
            currentSubPage,
            processData,
            contentType,
            data,
        })

        return $.ajax({
            url: url,
            crossDomain: true,
            dataType: "json",
            type: 'POST',
            timeout: (options.timeout === undefined ? 30000 : options.timeout),
            async: (options.isAsync === undefined ? true : options.isAsync),
            currentPage: currentPage,
            currentSubPage: currentSubPage,
            shouldRetry: null,
            traditional: true,
            data: (formData != null && Object.keys(formData) ? formData : data),
            contentType: contentType,
            processData: processData
        })

    }
};

function getFileUploadConfig(requestType, data) {
    return (dispatch, getState) => {
        const {account} = getState();

        var config = {};
        if (requestType === "uploadTaggedData") {
            config.selector = "#upload_file";
            config.requestParam = "file";
            config.errorDescription = "error_file_too_big";
            config.maxSize = account.constants.MAX_TAGGED_DATA_DATA_LENGTH;
            return config;
        } else if (requestType === "dgsListing") {
            config.selector = "#dgs_listing_image";
            config.requestParam = "messageFile";
            config.errorDescription = "error_image_too_big";
            config.maxSize = account.constants.maxPrunableMessageLength;
            return config;
        } else if (requestType === "sendMessage") {
            config.selector = "#upload_file_message";
            if (data.encrypt_message) {
                config.requestParam = "encryptedMessageFile";
            } else {
                config.requestParam = "messageFile";
            }
            config.errorDescription = "error_message_too_big";
            config.maxSize = account.constants.maxPrunableMessageLength;
            return config;
        } else if (requestType === "importKeyViaFile") {
            config.selector = "#upload_file_message";
            config.requestParam = "keyStore";
            config.errorDescription = "error_secret_file_too_big";
            config.maxSize = (account.constants && account.constants.maxImportSecretFileLength) || 1000;
            return config;
        }
        return null;
    }
};

function getAdminPassword() {
    return (dispatch, getState) => {
        const {account} = getState();

        if (window.java) {
            return window.java.getAdminPassword();
        }
        return account.settings.admin_password;
    };
};

function addMissingData(data) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (!("amountATM" in data)) {
            data.amountATM = "0";
        }
        if (!("recipient" in data)) {
            data.recipient = account.genesis;
            data.recipientRS = account.genesisRs;
        }
    }
}

export default {
    submitForm
};
