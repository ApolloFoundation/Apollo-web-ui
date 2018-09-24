/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
 * Copyright © 2016-2017 Jelurida IP B.V.                                     *
 *                                                                            *
 * See the LICENSE.txt file at the top-level directory of this distribution   *
 * for licensing information.                                                 *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,*
 * no part of the Nxt software, including this file, may be copied, modified, *
 * propagated, or distributed except according to the terms contained in the  *
 * LICENSE.txt file.                                                          *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 * Copyright © 2017-2018 Apollo Foundation                                    *
 *                                                                            *
 ******************************************************************************/

/**
 * @depends {nrs.js}
 */

import $ from 'jquery';
import i18n from 'i18next';
import util from '../../helpers/util/utils';
import crypto from '../crypto/crypto';
import config from '../../config';
import converters from '../converters'
import BigInteger from 'big-integer';
import AplAddress from '../util/apladres'
import store from '../../store';
import {NotificationManager} from "react-notifications";

let forms = {};

const configServer = config;

let isLocalHost = false;

function submitForm($modal, $btn, data, requestType) {
    return async (dispatch, getState) => {

        const {account} = getState();

        if (!$btn) {
            // $btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
        }

        // if (data.secretPhrase) {
        //     const isPassphrase = dispatch(await dispatch(crypto.getAccountIdAsync(data.secretPhrase)));
        //
        //     console.log(isPassphrase);
        //
        //     if (account.accountRS !== isPassphrase) {
        //         return {errorCode: 10, errorDescription: 'Incorrect secret phrase.'};
        //     }
        // }

        var $form;
        var requestTypeKey;
        // if (requestType) {
        //     requestTypeKey = requestType.replace(/([A-Z])/g, function($1) {
        //         return "_" + $1.toLowerCase();
        //     });
        // }

        var successMessage = getSuccessMessage(requestTypeKey);
        var errorMessage = getErrorMessage(requestTypeKey);

        var formFunction = forms[requestType];
        var formErrorFunction = forms[requestType + "Error"];

        if (typeof formErrorFunction != "function") {
            formErrorFunction = false;
        }

        var originalRequestType = requestType;

        var invalidElement = false;

        if (invalidElement) {
            return;
        }

        if (Object.values(data).length) {
            var output = data;

            if (!output) {
                return;
            } else if (output.error) {
                // $form.find(".error_message").html(output.error.escapeHTML()).show();
                if (formErrorFunction) {
                    formErrorFunction();
                }
                unlockForm($modal, $btn);
                return;
            } else {
                if (output.requestType) {
                    requestType = output.requestType;
                }
                if (output.data) {
                    data = output.data;
                }
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
                    unlockForm($modal, $btn, !output.keepOpen);
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

        if (data.feeATM) {
            data.feeATM = data.feeATM + '00000000'
        }

        if (data.amountATM) {
            data.amountATM = data.amountATM + '00000000'
        }

        if (data.priceATM) {
            data.priceATM = data.priceATM + '00000000'
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

            if (data.calculateFee) {
                if (account.publicKey) {
                    data.publicKey = account.publicKey;
                    delete data.secretPhrase;
                }
            }
            if (data.doNotBroadcast) {
                delete data.doNotBroadcast;
            }
        }
        if (data.messageFile && data.encrypt_message) {
            if (!util.isFileEncryptionSupported()) {
                $form.find(".error_message").html(i18n.t("file_encryption_not_supported")).show();
                if (formErrorFunction) {
                    formErrorFunction(false, data);
                }
                unlockForm($modal, $btn);
                return;
            }
            try {
                crypto.encryptFile(data.messageFile, data.encryptionKeys, function(encrypted) {
                    data.messageFile = encrypted.file;
                    data.encryptedMessageNonce = converters.byteArrayToHexString(encrypted.nonce);
                    delete data.encryptionKeys;

                    return sendRequest(requestType, data, function (response) {
                        formResponse(response, data, requestType, $modal, $form, $btn, successMessage,
                            originalRequestType, formErrorFunction, errorMessage);
                    })
                });
            } catch (err) {
                $form.find(".error_message").html(String(err).escapeHTML()).show();
                if (formErrorFunction) {
                    formErrorFunction(false, data);
                }
                unlockForm($modal, $btn);
            }
        } else {
            if (requestType === 'sendMoneyPrivate') {
                data.deadline = '1440';
                return sendRequest(requestType, data, function (response) {
                    formResponse(response, data, requestType, $modal, $form, $btn, successMessage,
                        originalRequestType, formErrorFunction, errorMessage);
                });
            } else {



                return dispatch(
                    sendRequest(requestType, data, function (response) {
                    formResponse(response, data, requestType, $modal, $form, $btn, successMessage,
                        originalRequestType, formErrorFunction, errorMessage);
                    })
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

        // if ($.i18n.exists(key)) {
        //     return i18n.t(key);
        // } else {
        //     return "";
        // }
    }
}

function getErrorMessage(requestType) {
    var ignore = ["start_forging", "stop_forging", "generate_token", "validate_token"];

    if (ignore.indexOf(requestType) != -1) {
        return "";
    } else {
        var key = "error_" + requestType;

        // if ($.i18n.exists(key)) {
        //     return i18n.t(key);
        // } else {
        //     return "";
        // }
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
                    if (data.recipientPublicKey) {
                        options.publicKey = data.recipientPublicKey;
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
                        "publicKey": converters.hexStringToByteArray(crypto.generatePublicKey(data.secretPhrase))
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

            options.privateKey = converters.hexStringToByteArray(crypto.getPrivateKey(secretPhrase));
        }

        if (!options.publicKey) {
            if (!options.account) {
                throw {
                    "message": i18n.t("error_account_id_not_specified"),
                    "errorCode": 2
                };
            }

            try {
                options.publicKey = converters.hexStringToByteArray(crypto.getPublicKey(options.account, true));
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
        options = crypto.getEncryptionKeys(options, secretPhrase);
        var encrypted = crypto.encryptData(converters.stringToByteArray(message), options);
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

function formResponse(response, data, requestType, $modal, $form, $btn, successMessage,
                      originalRequestType, formErrorFunction, errorMessage) {
    //todo check again.. response.error
    var formCompleteFunction;


    if (response.fullHash) {
        unlockForm($modal, $btn);
        if (data.calculateFee) {
            updateFee($modal, response.transactionJSON.feeATM);
            return;
        }

        if (!$modal.hasClass("modal-no-hide")) {
            $modal.modal("hide");
            $.growl(i18n.t("send_money_submitted"), {
                "type": "success"
            });
        }

        if (successMessage) {
            $.growl(successMessage.escapeHTML(), {
                type: "success"
            });
        }

        formCompleteFunction = forms[originalRequestType + "Complete"];

        // if (requestType != "parseTransaction" && requestType != "calculateFullHash") {
        //     if (typeof formCompleteFunction == "function") {
        //         data.requestType = requestType;
        //
        //         if (response.transaction) {
        //             addUnconfirmedTransaction(response.transaction, function(alreadyProcessed) {
        //                 response.alreadyProcessed = alreadyProcessed;
        //                 formCompleteFunction(response, data);
        //             });
        //         } else {
        //             response.alreadyProcessed = false;
        //             formCompleteFunction(response, data);
        //         }
        //     } else {
        //         addUnconfirmedTransaction(response.transaction);
        //     }
        // } else {
        //     if (typeof formCompleteFunction == "function") {
        //         data.requestType = requestType;
        //         formCompleteFunction(response, data);
        //     }
        // }

    } else if (response.errorCode) {
        // $form.find(".error_message").html(util.escapeRespStr(response.errorDescription)).show();

        if (formErrorFunction) {
            formErrorFunction(response, data);
        }

        unlockForm($modal, $btn);
    } else {

        if (data.calculateFee) {
            unlockForm($modal, $btn, false);

            if (requestType === 'sendMoneyPrivate') {
                var fee = $('#send_money_fee_info');
                fee.val(convertToAPL(response.transactionJSON.feeATM));
                var recalcIndicator = $("#" + $modal.attr('id').replace('_modal', '') + "_recalc");
                recalcIndicator.hide();
                return;
            } else {
                updateFee($modal, response.transactionJSON.feeATM);
                return;
            }
        }
        var sentToFunction = false;
        if (!errorMessage) {
            formCompleteFunction = forms[originalRequestType + "Complete"];

            if (typeof formCompleteFunction === 'function') {
                sentToFunction = true;
                data.requestType = requestType;

                unlockForm($modal, $btn);

                if (!$modal.hasClass("modal-no-hide")) {

                    $modal.modal("hide");
                    /*                        $.growl(i18n.t("send_money_submitted"), {
                                                "type": "success"
                                            });*/
                }
                formCompleteFunction(response, data);
            } else {
                errorMessage = i18n.t("error_unknown");
            }
        }
        if (!sentToFunction) {
            unlockForm($modal, $btn, true);

            $.growl("The private transaction has been submitted!", {
                "type": "success"
            });
        }
    }
}

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

function lockForm($modal) {
    $modal.find("button").prop("disabled", true);
    var $btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
    if ($btn) {
        $btn.button("loading");
    }
    $modal.modal("lock");
    return $btn;
};

function unlockForm($modal, $btn, hide) {
    // $modal.find("button").prop("disabled", false);
    // if ($btn) {
    //     $btn.button("reset");
    // }
    // $modal.modal("unlock");
    // if (hide) {
    //     $modal.modal("hide");
    // }
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
        try {
            var aplFields = [
                ["feeAPL", "feeATM"],
                ["amountAPL", "amountATM"],
                ["priceAPL", "priceATM"],
                ["refundAPL", "refundATM"],
                ["discountAPL", "discountATM"],
                ["phasingQuorumAPL", "phasingQuorum"],
                ["phasingMinBalanceAPL", "phasingMinBalance"],
                ["controlQuorumAPL", "controlQuorum"],
                ["controlMinBalanceAPL", "controlMinBalance"],
                ["controlMaxFeesAPL", "controlMaxFees"],
                ["minBalanceAPL", "minBalance"],
                ["shufflingAmountAPL", "amount"],
                ["monitorAmountAPL", "amount"],
                ["monitorThresholdAPL", "threshold"]
            ];

            for (i = 0; i < aplFields.length; i++) {
                var aplField = aplFields[i][0];
                var nqtField = aplFields[i][1];
                if (aplField in data) {
                    data[nqtField] = convertToATM(data[aplField]);
                    delete data[aplField];
                }
            }
        } catch (err) {
            return {
                "errorCode": 1,
                "errorDescription": err + " (" + field + ")"
            };
        }
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


        //Fill phasing parameters when mandatory approval is enabled
        // if (requestType != "approveTransaction"
        //     && account.accountControls && $.inArray('PHASING_ONLY', account.accountControls) > -1
        //     && account.phasingOnly
        //     && account.phasingOnly.votingModel >= 0) {
        //
        //     var phasingControl = account.phasingOnly;
        //     var maxFees = new BigInteger(phasingControl.maxFees);
        //     if (maxFees > 0 && new BigInteger(data.feeATM).compareTo(new BigInteger(phasingControl.maxFees)) > 0) {
        //         callback({
        //             "errorCode": 1,
        //             "errorDescription": i18n.t("error_fee_exceeds_max_account_control_fee", {
        //                 "maxFee": convertToAPL(phasingControl.maxFees), "symbol": account.constants.coinSymbol
        //             })
        //         });
        //         return;
        //     }
        //     var phasingDuration = parseInt(data.phasingFinishHeight) - NRS.lastBlockHeight;
        //     var minDuration = parseInt(phasingControl.minDuration) > 0 ? parseInt(phasingControl.minDuration) : 0;
        //     var maxDuration = parseInt(phasingControl.maxDuration) > 0 ? parseInt(phasingControl.maxDuration) : NRS.constants.SERVER.maxPhasingDuration;
        //
        //     if (phasingDuration < minDuration || phasingDuration > maxDuration) {
        //         callback({
        //             "errorCode": 1,
        //             "errorDescription": i18n.t("error_finish_height_out_of_account_control_interval", {
        //                 "min": NRS.lastBlockHeight + minDuration,
        //                 "max": NRS.lastBlockHeight + maxDuration
        //             })
        //         });
        //         return;
        //     }
        //
        //     var phasingParams = NRS.phasingControlObjectToPhasingParams(phasingControl);
        //     $.extend(data, phasingParams);
        //     data.phased = true;
        //
        //     delete data.phasingHashedSecret;
        //     delete data.phasingHashedSecretAlgorithm;
        //     delete data.phasingLinkedFullHash;
        // }

        if (!data.recipientPublicKey) {
            delete data.recipientPublicKey;
        }
        if (!data.referencedTransactionFullHash) {
            delete data.referencedTransactionFullHash;
        }

        //gets account id from passphrase client side, used only for login.
        var accountId;
        if (requestType == "getAccountId") {
            accountId = dispatch(crypto.getAccountId()(data.secretPhrase));

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
        // check to see if secretPhrase supplied matches logged in account, if not - show error.
        if ("secretPhrase" in data) {
            return (dispatch(processAjaxRequest(requestType, data, callback, options)));


        } else {
            const formRes = dispatch(processAjaxRequest(requestType, data, callback, options));

            return formRes;
            // dispatch(processAjaxRequest(requestType, data, callback, options));
        }
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
    return (dispatch, getState) => {

        const {account} = getState();

        var extra = null;
        if (data["_extra"]) {
            extra = data["_extra"];
            delete data["_extra"];
        }
        var currentPage = null;
        var currentSubPage = null;

        //means it is a page request, not a global request.. Page requests can be aborted.
        // if (requestType.slice(-1) == "+") {
        //     requestType = requestType.slice(0, -1);
        //     currentPage = NRS.currentPage;
        // } else {
        //     //not really necessary... we can just use the above code..
        //     var plusCharacter = requestType.indexOf("+");
        //
        //     if (plusCharacter > 0) {
        //         requestType = requestType.substr(0, plusCharacter);
        //         currentPage = NRS.currentPage;
        //     }
        // }
        //
        // if (currentPage && NRS.currentSubPage) {
        //     currentSubPage = NRS.currentSubPage;
        // }

        var httpMethod = (util.isRequirePost(requestType) || "secretPhrase" in data || "doNotSign" in data || "adminPassword" in data ? "POST" : "GET");
        if (httpMethod == "GET") {
            if (typeof data == "string") {
                data += "&random=" + Math.random();
            } else {
                data.random = Math.random();
            }
        }

        // if (("secretPhrase" in data) &&
        //      util.accountInfo.errorCode && util.accountInfo.errorCode == 5) {
        //     callback({
        //         "errorCode": 2,
        //         "errorDescription": i18n.t("error_new_account")
        //     }, data);
        //     return;
        // }

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

        var config = dispatch(getFileUploadConfig(requestType, data));

        if (config) {
            // inspired by http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
            contentType = false;
            processData = false;
            formData = new FormData();
            var file;
            // var tempFiel = Object.assign(data.messageFile);
            if (data.messageFile) {
                file = data.messageFile;
                delete data.messageFile;
                delete data.encrypt_message;
            } else {
                try {
                    file = $("#file")[0].files[0];
                } catch(e) {
                    // console.log(e);
                }
            }
            if (!file && requestType == "uploadTaggedData") {
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
        } else {
            // JQuery defaults
            contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            processData = true;
        }
        var url;
        if (options.remoteNode) {
            url = options.remoteNode.getUrl() + "/apl";
        } else {
            url = configServer.api.serverUrl;
        }

        url += "requestType=" + requestType;

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
            data: (formData != null ? formData : data),
            contentType: contentType,
            processData: processData
        })
        // .done(function (response) {
        //     console.log(response);
        //     if (typeof data == "string") {
        //         data = { "querystring": data };
        //         if (extra) {
        //             data["_extra"] = extra;
        //         }
        //     }
        //
        //     return response;
        // }).fail(function (xhr, textStatus, error) {
        //
        //     if ((error == "error" || textStatus == "error") && (xhr.status == 404 || xhr.status == 0)) {
        //         if (httpMethod == "POST") {
        //             // NRS.connectionError();
        //         }
        //     }
        //
        //     if (error != "abort") {
        //         if (options.remoteNode) {
        //             options.remoteNode.blacklist();
        //         } else {
        //             // NRS.resetRemoteNode(true);
        //         }
        //         if (error == "timeout") {
        //             error = i18n.t("error_request_timeout");
        //         }
        //         callback({
        //             "errorCode": -1,
        //             "errorDescription": error
        //         }, {});
        //     }
        // });
    }
};

// function getRequestPath(noProxy) {
//     return (dispatch, getState) => {
//         const {account} = getState();
//
//         var url = getRemoteNodeUrl();
//         if (!account.apiProxy ) {
//             return url + "/apl";
//         } else {
//             return url + "/apl-proxy";
//         }
//     }
// };
//
// function getRemoteNodeUrl() {
//     if (!NRS.isMobileApp()) {
//         if (!isNode) {
//             return "";
//         }
//         return NRS.getModuleConfig().url;
//     }
//     if (remoteNode) {
//         return remoteNode.getUrl();
//     }
//     remoteNode = NRS.remoteNodesMgr.getRandomNode();
//     if (remoteNode) {
//         var url = remoteNode.getUrl();
//         NRS.logConsole("Remote node url: " + url);
//         return url;
//     } else {
//         NRS.logConsole("No available remote nodes");
//         $.growl(i18n.t("no_available_remote_nodes"));
//     }
// };

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
