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
import util from '../../helpers/util/utils';
import crypto from '../crypto/crypto';
import config from '../../config';
import converters from '../converters'
import BigInteger from 'big-integer';
import AplAddress from '../util/apladres'

let forms = {};

// $(".modal form input").keydown(function(e) {
//     return (dispatch, getState) => {
//         const {account} = getState();
//
//         if (e.which == "13") {
//             e.preventDefault();
//             if (account.settings["submit_on_enter"] && e.target.type != "textarea") {
//                 $(this).submit();
//             } else {
//                 return false;
//             }
//         }
//     }
// });
//
// $(".modal button.btn-primary:not([data-dismiss=modal]):not([data-ignore=true]),button.btn-calculate-fee,button.scan-qr-code").click(function() {
//     var $btn = $(this);
//     var $modal = $(this).closest(".modal");
//     if ($btn.hasClass("scan-qr-code")) {
//         var data = $btn.data();
//         NRS.scanQRCode(data.reader, function(text) {
//             $modal.find("#" + data.result).val(text);
//         });
//         return;
//     }
//     try {
//         NRS.submitForm($modal, $btn);
//     } catch(e) {
//         $modal.find(".error_message").html("Form submission error '" + e.message + "' - please report to developers").show();
//         NRS.unlockForm($modal, $btn);
//     }
// });
//
// $(".modal input,select,textarea").change(function() {
//     var id = $(this).attr('id');
//     var modal = $(this).closest(".modal");
//     if (!modal) {
//         return;
//     }
//     var feeFieldId = modal.attr('id');
//     if (!feeFieldId) {
//         // Not a modal dialog with fee calculation widget
//         return;
//     }
//     feeFieldId = feeFieldId.replace('_modal', '') + "_fee";
//     if (id == feeFieldId) {
//         return;
//     }
//     var fee = $("#" + feeFieldId);
//     if (fee.val() == "") {
//         return;
//     }
//     var recalcIndicator = $("#" + modal.attr('id').replace('_modal', '') + "_recalc");
//     recalcIndicator.show();
// });

const configServer = config;

let isLocalHost = false;

function submitForm($modal, $btn, data, requestType) {
    return (dispatch, getState) => {

        const {account} = getState();

        if (!$btn) {
            // $btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
        }

        // $modal = $btn.closest(".modal");
        //
        // $modal.modal("lock");
        // $modal.find("button").prop("disabled", true);

        var $form;
        // if ($btn.data("form")) {
        //     // $form = $modal.find("form#" + $btn.data("form"));
        //     if (!$form.length) {
        //         // $form = $modal.find("form:first");
        //     }
        // } else {
        //     // $form = $modal.find("form:first");
        // }

        // var requestType;
        // if ($btn.data("request")) {
        //     requestType = $btn.data("request");
        // } else {
        //     requestType = $form.find("input[name=request_type]").val();
        // }

        var requestTypeKey = requestType.replace(/([A-Z])/g, function($1) {
            return "_" + $1.toLowerCase();
        });


        var successMessage = getSuccessMessage(requestTypeKey);
        var errorMessage = getErrorMessage(requestTypeKey);

        var formFunction = forms[requestType];
        var formErrorFunction = forms[requestType + "Error"];

        if (typeof formErrorFunction != "function") {
            formErrorFunction = false;
        }

        var originalRequestType = requestType;

        var invalidElement = false;

        //TODO multi calculating
        // $form.find(":input").each(function() {
        //
        //     if ($(this).is(":invalid")) {
        //         var error = "";
        //         var name = String($(this).attr("name")).replace("APL", "").replace("ATM", "").capitalize();
        //         var value = $(this).val();
        //
        //
        //         if ($(this).hasAttr("max")) {
        //             if (!/^[\-\d\.]+$/.test(value)) {
        //                 error = $.t("error_not_a_number", {
        //                     "field": NRS.getTranslatedFieldName(name).toLowerCase()
        //                 }).capitalize();
        //             } else {
        //                 var max = $(this).attr("max");
        //
        //                 if (value > max) {
        //                     error = $.t("error_max_value", {
        //                         "field": NRS.getTranslatedFieldName(name).toLowerCase(),
        //                         "max": max
        //                     }).capitalize();
        //                 }
        //             }
        //         }
        //
        //         if ($(this).hasAttr("min")) {
        //             if (!/^[\-\d\.]+$/.test(value)) {
        //                 error = $.t("error_not_a_number", {
        //                     "field": NRS.getTranslatedFieldName(name).toLowerCase()
        //                 }).capitalize();
        //             } else {
        //                 var min = $(this).attr("min");
        //
        //                 if (value < min) {
        //                     error = $.t("error_min_value", {
        //                         "field": NRS.getTranslatedFieldName(name).toLowerCase(),
        //                         "min": min
        //                     }).capitalize();
        //                 }
        //             }
        //         }
        //
        //         if (!error) {
        //             error = $.t("error_invalid_field", {
        //                 "field": NRS.getTranslatedFieldName(name).toLowerCase()
        //             }).capitalize();
        //         }
        //
        //         $form.find(".error_message").html(error).show();
        //
        //         if (formErrorFunction) {
        //             formErrorFunction();
        //         }
        //
        //         NRS.unlockForm($modal, $btn);
        //         invalidElement = true;
        //         return false;
        //     }
        // });

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

        // if (!data) {
        //     data = getFormData($form);
        // }
        // if ($btn.hasClass("btn-calculate-fee")) {
        //
        //     data.calculateFee = true;
        //     data.feeAPL = "0";
        //     $form.find(".error_message").html("").hide();
        // } else {
        //     delete data.calculateFee;
        //     if (!data.feeAPL) {
        //         data.feeAPL = "0";
        //     }
        // }

        if (data.recipient) {
            data.recipient = $.trim(data.recipient);
            if (util.isNumericAccount(data.recipient)) {
                $form.find(".error_message").html($.t("error_numeric_ids_not_allowed")).show();
                if (formErrorFunction) {
                    formErrorFunction(false, data);
                }
                unlockForm($modal, $btn);
                return;
            } else if (!util.isRsAccount(data.recipient)) {
                var convertedAccountId = data.converted_account_id;
                if (!convertedAccountId || (!util.isNumericAccount(convertedAccountId) && !util.isRsAccount(convertedAccountId))) {
                    $form.find(".error_message").html($.t("error_account_id")).show();
                    if (formErrorFunction) {
                        formErrorFunction(false, data);
                    }
                    unlockForm($modal, $btn);
                    return;
                } else {
                    data.recipient = convertedAccountId;
                    data["_extra"] = {
                        "convertedAccount": true
                    };
                }
            }
        }

        if (requestType === "sendMoney" || requestType === "transferAsset") {
            var merchantInfo = $modal.find("input[name=merchant_info]").val();
            if (merchantInfo) {
                var result = merchantInfo.match(/#merchant:(.*)#/i);

                if (result && result[1]) {
                    merchantInfo = $.trim(result[1]);

                    if (!data.add_message || !data.message) {
                        $form.find(".error_message").html($.t("info_merchant_message_required")).show();
                        if (formErrorFunction) {
                            formErrorFunction(false, data);
                        }
                        unlockForm($modal, $btn);
                        return;
                    }

                    if (merchantInfo === "numeric") {
                        merchantInfo = "[0-9]+";
                    } else if (merchantInfo === "alphanumeric") {
                        merchantInfo = "[a-zA-Z0-9]+";
                    }

                    var regexParts = merchantInfo.match(/^\/(.*?)\/(.*)$/);

                    if (!regexParts) {
                        regexParts = ["", merchantInfo, ""];
                    }

                    var strippedRegex = regexParts[1].replace(/^[\^\(]*/, "").replace(/[\$\)]*$/, "");

                    if (regexParts[1].charAt(0) != "^") {
                        regexParts[1] = "^" + regexParts[1];
                    }

                    if (regexParts[1].slice(-1) != "$") {
                        regexParts[1] = regexParts[1] + "$";
                    }
                    var regexp;
                    if (regexParts[2].indexOf("i") !== -1) {
                        regexp = new RegExp(regexParts[1], "i");
                    } else {
                        regexp = new RegExp(regexParts[1]);
                    }

                    if (!regexp.test(data.message)) {
                        var regexType;
                        errorMessage = "";
                        var lengthRequirement = strippedRegex.match(/\{(.*)\}/);

                        if (lengthRequirement) {
                            strippedRegex = strippedRegex.replace(lengthRequirement[0], "+");
                        }

                        if (strippedRegex == "[0-9]+") {
                            regexType = "numeric";
                        } else if (strippedRegex == "[a-z0-9]+" || strippedRegex.toLowerCase() == "[a-za-z0-9]+" || strippedRegex == "[a-z0-9]+") {
                            regexType = "alphanumeric";
                        } else {
                            regexType = "custom";
                        }

                        if (lengthRequirement) {
                            if (lengthRequirement[1].indexOf(",") != -1) {
                                lengthRequirement = lengthRequirement[1].split(",");
                                var minLength = parseInt(lengthRequirement[0], 10);
                                if (lengthRequirement[1]) {
                                    var maxLength = parseInt(lengthRequirement[1], 10);
                                    errorMessage = $.t("error_merchant_message_" + regexType + "_range_length", {
                                        "minLength": minLength,
                                        "maxLength": maxLength
                                    });
                                } else {
                                    errorMessage = $.t("error_merchant_message_" + regexType + "_min_length", {
                                        "minLength": minLength
                                    });
                                }
                            } else {
                                var requiredLength = parseInt(lengthRequirement[1], 10);
                                errorMessage = $.t("error_merchant_message_" + regexType + "_length", {
                                    "length": requiredLength
                                });
                            }
                        } else {
                            errorMessage = $.t("error_merchant_message_" + regexType);
                        }

                        $form.find(".error_message").html(errorMessage).show();
                        if (formErrorFunction) {
                            formErrorFunction(false, data);
                        }
                        unlockForm($modal, $btn);
                        return;
                    }
                }
            }
        }

        // try {
        //     data = addMessageData(data, requestType);
        // } catch (err) {
        //     $form.find(".error_message").html(String(err.message).escapeHTML()).show();
            // if (formErrorFunction) {
            //     formErrorFunction();
            // }
            // unlockForm($modal, $btn);
            // return;
        // }

        if (!data.deadline) {
            data.deadline = 1440;
        }

        if (data.feeATM) {
            data.feeATM = data.feeATM + '00000000'
        }

        // if (data.deadline) {
        //     data.deadline = String(data.deadline * 60); //hours to minutes
        // }

        // if ("secretPhrase" in data && !data.secretPhrase.length && !NRS.rememberPassword &&
        //     !(data.calculateFee && NRS.accountInfo.publicKey)) {
        //     $form.find(".error_message").html($.t("error_passphrase_required")).show();
        //     if (formErrorFunction) {
        //         formErrorFunction(false, data);
        //     }
        //     $("#" + $modal.attr('id').replace('_modal', '') + "_password").focus();
        //     NRS.unlockForm($modal, $btn);
        //     return;
        // }

        // if (!NRS.showedFormWarning) {
        //     if ("amountAPL" in data && NRS.settings["amount_warning"] && NRS.settings["amount_warning"] != "0") {
        //         try {
        //             var amountATM = NRS.convertToATM(data.amountAPL);
        //         } catch (err) {
        //             $form.find(".error_message").html(String(err).escapeHTML() + " (" + $.t("amount") + ")").show();
        //             if (formErrorFunction) {
        //                 formErrorFunction(false, data);
        //             }
        //             NRS.unlockForm($modal, $btn);
        //             return;
        //         }
        //
        //         if (new BigInteger(amountATM).compareTo(new BigInteger(NRS.settings["amount_warning"])) > 0) {
        //             NRS.showedFormWarning = true;
        //             $form.find(".error_message").html($.t("error_max_amount_warning", {
        //                 "amount": NRS.formatAmount(NRS.settings["amount_warning"]), "symbol": NRS.constants.COIN_SYMBOL
        //             })).show();
        //             if (formErrorFunction) {
        //                 formErrorFunction(false, data);
        //             }
        //             NRS.unlockForm($modal, $btn);
        //             return;
        //         }
        //     }
        //     if ("feeAPL" in data && NRS.settings["fee_warning"] && NRS.settings["fee_warning"] != "0") {
        //
        //         try {
        //             var feeATM = NRS.convertToATM(data.feeAPL);
        //         } catch (err) {
        //             $form.find(".error_message").html(String(err).escapeHTML() + " (" + $.t("fee") + ")").show();
        //             if (formErrorFunction) {
        //                 formErrorFunction(false, data);
        //             }
        //             NRS.unlockForm($modal, $btn);
        //             return;
        //         }
        //
        //         if (new BigInteger(feeATM).compareTo(new BigInteger(NRS.settings["fee_warning"])) > 0) {
        //             NRS.showedFormWarning = true;
        //             $form.find(".error_message").html($.t("error_max_fee_warning", {
        //                 "amount": NRS.formatAmount(NRS.settings["fee_warning"]), "symbol": NRS.constants.COIN_SYMBOL
        //             })).show();
        //             if (formErrorFunction) {
        //                 formErrorFunction(false, data);
        //             }
        //             NRS.unlockForm($modal, $btn);
        //             return;
        //         }
        //     }
        //
        //     if ("decimals" in data) {
        //         try {
        //             var decimals = parseInt(data.decimals);
        //         } catch (err) {
        //             decimals = 0;
        //         }
        //
        //         if (decimals < 2 || decimals > 6) {
        //             if (requestType == "issueAsset" && data.quantityATU == "1") {
        //                 // Singleton asset no need to warn
        //             } else {
        //                 NRS.showedFormWarning = true;
        //                 var entity = (requestType == 'issueCurrency' ? 'currency' : 'asset');
        //                 $form.find(".error_message").html($.t("error_decimal_positions_warning", {
        //                     "entity": entity
        //                 })).show();
        //                 if (formErrorFunction) {
        //                     formErrorFunction(false, data);
        //                 }
        //                 NRS.unlockForm($modal, $btn);
        //                 return;
        //             }
        //         }
        //     }
        //
        //     var convertAPLFields = ["phasingQuorumAPL", "phasingMinBalanceAPL"];
        //     $.each(convertAPLFields, function(key, field) {
        //         if (field in data) {
        //             try {
        //                 NRS.convertToATM(data[field]);
        //             } catch (err) {
        //                 $form.find(".error_message").html(String(err).escapeHTML()).show();
        //                 if (formErrorFunction) {
        //                     formErrorFunction(false, data);
        //                 }
        //                 NRS.unlockForm($modal, $btn);
        //             }
        //         }
        //     });
        // }

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
                $form.find(".error_message").html($.t("file_encryption_not_supported")).show();
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

function getSuccessMessage(requestType) {
    var ignore = ["asset_exchange_change_group_name", "asset_exchange_group", "add_contact", "update_contact", "delete_contact",
        "send_message", "decrypt_messages", "start_forging", "stop_forging", "generate_token", "send_money", "set_alias", "add_asset_bookmark", "sell_alias"
    ];

    if (ignore.indexOf(requestType) !== -1) {
        return "";
    } else {
        var key = "success_" + requestType;

        // if ($.i18n.exists(key)) {
        //     return $.t(key);
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
        //     return $.t(key);
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
                    "message": $.t("error_account_id_not_specified"),
                    "errorCode": 2
                };
            }

            try {
                options.publicKey = converters.hexStringToByteArray(crypto.getPublicKey(options.account, true));
            } catch (err) {
                var aplAddress = new AplAddress();

                if (!aplAddress.set(options.account)) {
                    throw {
                        "message": $.t("error_invalid_account_id"),
                        "errorCode": 3
                    };
                } else {
                    throw {
                        "message": $.t("error_public_key_not_specified"),
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
                "message": $.t("error_message_encryption"),
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
            $.growl($.t("send_money_submitted"), {
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
                    /*                        $.growl($.t("send_money_submitted"), {
                                                "type": "success"
                                            });*/
                }
                formCompleteFunction(response, data);
            } else {
                errorMessage = $.t("error_unknown");
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
            callback({
                "errorCode": 1,
                "errorDescription": $.t("request_of_type", {
                    type: requestType
                })
            });
            return;
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
            callback({
                "errorCode": 1,
                "errorDescription": err + " (" + $.t(field) + ")"
            });
            return;
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
            callback({
                "errorCode": 1,
                "errorDescription": err + " (" + $.t(field) + ")"
            });
            return;
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
        //             "errorDescription": $.t("error_fee_exceeds_max_account_control_fee", {
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
        //             "errorDescription": $.t("error_finish_height_out_of_account_control_interval", {
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
            // accountId = crypto.getAccountId(NRS.rememberPassword ? _password : data.secretPhrase);
            // accountId = dispatch(crypto.getAccountId(data.secretPhrase));
            //
            // console.log(accountId);

            return (dispatch(processAjaxRequest(requestType, data, callback, options)));


        } else {
            const formRes = dispatch(processAjaxRequest(requestType, data, callback, options));

            console.log(formRes);

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
            throw $.t("error_fraction_decimals", {
                "decimals": decimals
            });
        } else if (fraction.length < decimals) {
            for (i = fraction.length; i < decimals; i++) {
                fraction += "0";
            }
        }
        qnt += fraction;
    } else {
        throw $.t("error_invalid_input");
    }

    //in case there's a comma or something else in there.. at this point there should only be numbers
    if (!/^\d+$/.test(qnt)) {
        throw $.t("error_invalid_input_numbers");
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
        throw $.t("error_invalid_input");
    }

    for (var i = fraction.length; i < 8; i++) {
        fraction += "0";
    }

    var result = amount + "" + fraction;

    //in case there's a comma or something else in there.. at this point there should only be numbers
    if (!/^\d+$/.test(result)) {
        throw $.t("error_invalid_input");
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
        //         "errorDescription": $.t("error_new_account")
        //     }, data);
        //     return;
        // }

        if (data.referencedTransactionFullHash) {
            if (!/^[a-z0-9]{64}$/.test(data.referencedTransactionFullHash)) {
                callback({
                    "errorCode": -1,
                    "errorDescription": $.t("error_invalid_referenced_transaction_hash")
                }, data);
                return;
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

        var config = getFileUploadConfig(requestType, data);
        if (config && $(config.selector)[0] && $(config.selector)[0].files[0]) {
            // inspired by http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
            contentType = false;
            processData = false;
            formData = new FormData();
            var file;
            if (data.messageFile) {
                file = data.messageFile;
                delete data.messageFile;
                delete data.encrypt_message;
            } else {
                file = $(config.selector)[0].files[0];
            }
            if (!file && requestType == "uploadTaggedData") {
                callback({
                    "errorCode": 3,
                    "errorDescription": $.t("error_no_file_chosen")
                }, data);
                return;
            }
            if (file && file.size > config.maxSize) {
                callback({
                    "errorCode": 3,
                    "errorDescription": $.t(config.errorDescription, {
                        "size": file.size,
                        "allowed": config.maxSize
                    })
                }, data);
                return;
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
        //             error = $.t("error_request_timeout");
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
//         $.growl($.t("no_available_remote_nodes"));
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
            config.maxSize = account.constants.MAX_PRUNABLE_MESSAGE_LENGTH;
            return config;
        } else if (requestType === "sendMessage") {
            config.selector = "#upload_file_message";
            if (data.encrypt_message) {
                config.requestParam = "encryptedMessageFile";
            } else {
                config.requestParam = "messageFile";
            }
            config.errorDescription = "error_message_too_big";
            config.maxSize = account.constants.MAX_PRUNABLE_MESSAGE_LENGTH;
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
