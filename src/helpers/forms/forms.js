/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import i18n from 'i18next';
import axios from 'axios';
import {NotificationManager} from "react-notifications";
import util from '../../helpers/util/utils';
import crypto from '../crypto/crypto';
import config from '../../config';
import converters from '../converters'
import AplAddress from '../util/apladres'
import {processElGamalEncryption} from '../../actions/crypto';
import { handleFetch } from '../../helpers/fetch';
import { SET_FEE_ALERT } from '../../modules/fee';
import {
    IS_MODAL_PROCESSING,
    SET_AMOUNT_WARNING,
    SET_ASSET_WARNING,
    SET_CURRENCY_WARNING,
    SET_FEE_WARNING
} from '../../modules/modals';

// request which use FormData objects
const formDataRequestList = ['importKeyViaFile', 'dgsListing', 'uploadTaggedData'];
// fields for additional check of the object
const list = ["secretPhrase", "passPhrase", "doNotSign", "adminPassword", "passphrase"];
const BigInteger = require('jsbn').BigInteger;

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

function toEpochTime(currentTime) {
    if (currentTime == undefined) {
        currentTime = new Date();
    }
    return Math.floor((currentTime - 1385294400000) / 1000);
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

const checkEncryptMessage = (data) => {
    if (!data.encrypt_message) return data;
  
    const { message, encrypt_message, ...rest } = data;
  
    return {
      ...rest,
      messageToEncrypt: message,
    }
  }
  
  const chechCreateNoneTransactionMethod = (data, acc) => {
    if (!data.createNoneTransactionMethod) return data;
  
    const { sender, ...rest } = data;
  
    return {
      ...rest,
      account: acc
    }
  }
  
  const checkPriceOrder = (data) => {
    if (!data.priceOrder) return data;
    const { priceOrder, ...rest } = data;
    return {
      ...rest,
      priceATM: priceOrder,
    }
  }
  
  const checkQuantityOrder = (data) => {
    if (!data.quantityOrder) return data;
    const { quantityOrder , ...rest } = data;
    return {
      ...rest,
      quantityATU: quantityOrder,
    }
  }
  
  const checkDelivery = (data) => {
    if (!data.deliveryDeadlineTimestamp) return data;
    const { deliveryDeadlineTimestamp, ...rest } = data;
  
    return {
      ...rest,
      deliveryDeadlineTimestamp: String(toEpochTime() + 60 * 60 * deliveryDeadlineTimestamp)
    }
  }
  
  const checkDoNotBroadcast = (data) => {
    if (!data.doNotBroadcast && !data.calculateFee) return data;
    const { doNotBroadcast, ...rest } = data;
  
    return {
      ...rest,
      broadcast:"false" 
    }
  }
  
  // if true return from function
  const checkFeeAlert = (data, fee, decimals, dispatch) => {
    if (
      (data.feeAPL > fee.minFeeAmount || data.feeATM / decimals > fee.minFeeAmount)
      && !fee.isFeeAlert
    ) {
      NotificationManager.warning(
        `You are trying to send the transaction with fee that exceeds ${fee.minFeeAmount} APL`,
        'Attention',
        10000
      );
  
      dispatch({
          type: SET_FEE_ALERT,
          payload: true
      });
      dispatch({
          type: IS_MODAL_PROCESSING,
          payload: false
      });
      return true;
    } else {
      dispatch({
          type: SET_FEE_ALERT,
          payload: false
      });
    }
  }
  
const checkPhrase = (data, requestType) => async (dispatch, getState) => {
    const { account } = getState();
    if (requestType === 'generateAccount') return data;

    if (data.secretPhrase) {
        const { secretPhrase, ...rest } = data;
        let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(secretPhrase));
        
        const elGamalPhrase = await processElGamalEncryption(secretPhrase)
        if (isPassphrase !== account.accountRS) {
            return {
                ...rest,
                passphrase: elGamalPhrase, 
            }
        }
        return {
            ...rest,
            secretPhrase: elGamalPhrase,
        }
    }

    if (data.passphrase) {
        const { passphrase, ...rest } = data;
        let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(data.passphrase));
        const elGamalPhrase = await processElGamalEncryption(passphrase);
        if (account.accountRS !== isPassphrase) {
            return {
                ...rest,
               passphrase: elGamalPhrase,
            } 
        }
        return {
            ...rest,
            secretPhrase: elGamalPhrase,
        }
    }

    return data;
}

  export const submitForm = (defaultData, requestType) => async (dispatch, getState) => {
    const appState = getState();
    const { account, fee } = appState;
    let data = {
        ...defaultData,
        sender: account.account,
    };

    data = checkEncryptMessage(data);
    data = chechCreateNoneTransactionMethod(data, account.account);
  
    if (!data.deadline) {
      data.deadline = 1440;
    }
  
    if (data.feeATM && parseFloat(data.feeATM)) {
      data.feeATM = data.feeATM * account.decimals
    }
  
    if (data.amountATM && parseFloat(data.amountATM)) {
      data.amountATM = data.amountATM * account.decimals
    }
  
    if (data.priceATM && parseFloat(data.priceATM)) {
      data.priceATM = data.priceATM * account.decimals
    }
  
    data = checkPriceOrder(data);
    data = checkQuantityOrder(data)
    // correct parametr deliveryDeadlineTimestamp of exist
    data = checkDelivery(data);
    // check data for broadcast
    data = checkDoNotBroadcast(data);
    // check secretPharse or passphrase for user and add encrypting ElGamal
    data = await dispatch(checkPhrase(data, requestType));
  
    // if checkFeeInfo exit from function because it's too much fee and user must reaccept sending
    const checkFeeInfo = checkFeeAlert(data, fee, account.decimals, dispatch);
    if (checkFeeInfo) return;
  
    data = Object
          .entries(data)
          .reduce((acc, [key, value]) => {
            // remove value if it is null or undefined. It may be a problem for some requests
            if (value === undefined || value === null) return acc;
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
          }, {})
  
    // can send request
  
    return dispatch(sendRequest(requestType, data));
}

export function sendRequest(requestType, data) {
    return (dispatch) => {
        const httpMethod = util.isRequirePost(requestType) || list.some(item => data[item]) ? "POST" : "GET"
  
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
  
        let url;
        if (requestType === 'importKeyViaFile') {
            url = config.api.server + '/rest/keyStore/upload';
        } else {
            url = config.api.serverUrl + "requestType=" + requestType;
        }
  
        dispatch({
            type: SET_AMOUNT_WARNING,
            payload: 0
        });
        dispatch({
            type: SET_FEE_WARNING,
            payload: 0
        });
        dispatch({
            type: SET_ASSET_WARNING,
            payload: 0
        });
        dispatch({
            type: SET_CURRENCY_WARNING,
            payload: 0
        });

        if (formDataRequestList.includes(requestType)) {
            return filesRequestsHandling(data, requestType, url);
        }

        if (requestType === "cancelBidOrder" || requestType === "cancelAskOrder") {
            delete data.publicKey;
        }
  
        return handleFetch(
            url,
            httpMethod,
            data,
            {
                requestType,
                isJson: false,
                isPrahseAlreadyEncrypt: true,
            }
        );
    }
  };

function filesRequestsHandling (data, requestType, url) {
    const formData = new FormData();

    Object
        .entries(data)
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    formData.append(key, item);
                })
            }
            formData.append(key, value);
        })

    // it demands on backend because
    if (requestType === "importKeyViaFile") {
        // special fiels for importKeyViaFile request
        return processElGamalEncryption(data.passPhrase)
            .then(res => {
                formData.delete('passPhrase');
                formData.append('passphrase', res);
                return fetch(url, {
                    method: 'POST',
                    body: formData,
                })
            })
            .then(res => res.json())
            .catch(() => {})
    }
    
    return axios.post(
        url,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    ) 
    .then(res => res.data);
}
  

export default {
    submitForm,
};
