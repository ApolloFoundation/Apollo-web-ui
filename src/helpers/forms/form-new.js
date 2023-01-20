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
const checkFeeAlert = (data, fee, decimals) => {
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
        type: 'SET_FEE_ALERT',
        payload: true
    });
    dispatch({
        type: 'IS_MODAL_PROCESSING',
        payload: false
    });
    return true;
  } else {
    dispatch({
        type: 'SET_FEE_ALERT',
        payload: false
    });
  }
}

export const submitForm = (defaultData, requestType) => async (dispatch, getState) => {
  const appState = getState();
  const { account, fee } = appState;
  const accFromSecretPhrase = await dispatch(crypto.getAccountIdAsyncApl(data.secretPhrase ?? data.passphrase));

  if (accFromSecretPhrase !== account.accountRS) {
    // не сходится пользователь
    return;
  }

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
  data = checkDelivery(data);
  data = checkDoNotBroadcast(data);

  // if checkFeeInfo exit from function because it's too much fee and user must reaccept sending
  const checkFeeInfo = checkFeeAlert(data, fee, account.decimals);
  if (checkFeeInfo) return;

  const data = Object
        .entries(data)
        .reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {})

  // can send request

  return sendRequest(requestType, data)
}

const config = (data, constants) => {
  const d = {
    "uploadTaggedData": {
      requestParam: 'file',
      errorDescription: "error_file_too_big",
      maxSize: constants.MAX_TAGGED_DATA_DATA_LENGTH
    },
    "dgsListing": {
      requestParam: 'messageFile',
      errorDescription: "error_image_too_big",
      maxSize: constants.maxPrunableMessageLength,
    },
    "sendMessage": {
      requestParam: data.encrypt_message ? "encryptedMessageFile" : "messageFile",
      errorDescription: "error_message_too_big",
      maxSize: constants.maxPrunableMessageLength
    },
    "importKeyViaFile": {
      requestParam: "keyStore",
      errorDescription: "error_secret_file_too_big",
      maxSize: constants.maxImportSecretFileLength || 1000
    }
  }
  return d;
}

function processAjaxRequest(requestType, data, callback, options) {
  return (dispatch) => {
      var extra = null;
      if (data["_extra"]) {
          extra = data["_extra"];
          delete data["_extra"];
      }

      const httpMethod = "secretPhrase" in data || "doNotSign" in data || "adminPassword" in data ? "POST" : "GET";

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
          url = configServer.api.server + '/rest/keyStore/upload';
      } else {
          if (options.remoteNode) {
              url = options.remoteNode.getUrl() + "/apl";
          } else {
              url = configServer.api.serverUrl;
          }

          url += configServer.api.serverUrl + "requestType=" + requestType;
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

      // return $.ajax({
      //     url: url,
      //     crossDomain: true,
      //     dataType: "json",
      //     type: 'POST',
      //     timeout: (options.timeout === undefined ? 30000 : options.timeout),
      //     async: (options.isAsync === undefined ? true : options.isAsync),
      //     currentPage: currentPage,
      //     currentSubPage: currentSubPage,
      //     shouldRetry: null,
      //     traditional: true,
      //     data: (formData != null && Object.keys(formData) ? formData : data),
      //     contentType: contentType,
      //     processData: processData
      // })

  }
};











function submitForm(data, requestType, ) {
  return async (dispatch, getState) => {
    const appState = getState();


      const { account,  fee } = getState();
      const { decimals } = account;



      // if (requestType !== 'generateAccount') {
      //     if (data.secretPhrase) {
      //         let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(data.secretPhrase));
      //         isPassphrase = isPassphrase.split('-');
      //         isPassphrase[0] = account.constants.accountPrefix;
      //         isPassphrase = isPassphrase.join('-');

      //         if (account.accountRS !== isPassphrase) {
      //             data.passphrase = await checkRequestType(requestType ,data.secretPhrase);
      //             delete data.secretPhrase;
      //         } else {
      //             data.secretPhrase = await checkRequestType(requestType ,data.secretPhrase);
      //             delete data.passphrase;
      //         }
      //     } else if (data.passphrase) {
      //         let isPassphrase = await dispatch(crypto.getAccountIdAsyncApl(data.passphrase));
      //         isPassphrase = isPassphrase.split('-');
      //         isPassphrase[0] = account.constants.accountPrefix;
      //         isPassphrase = isPassphrase.join('-');
      //         if (account.accountRS !== isPassphrase) {
      //             data.passphrase = await checkRequestType(requestType ,data.passphrase);
      //             delete data.secretPhrase;
      //         } else {
      //             data.secretPhrase = await checkRequestType(requestType ,data.passphrase);
      //             delete data.passphrase;
      //         }
      //     }
      // }

      // if (data.encrypt_message) {
      //     data.messageToEncrypt = data.message;
      //     delete data.message;
      //     delete data.encrypt_message;
      // }

      // data.sender = account.account;

      // var $form;
      // var requestTypeKey;

      // var successMessage = getSuccessMessage(requestTypeKey);
      // var errorMessage = getErrorMessage(requestTypeKey);

      // var formFunction = forms[requestType];
      // var formErrorFunction = forms[requestType + "Error"];

      // if (typeof formErrorFunction != "function") {
      //     formErrorFunction = false;
      // }

      // var originalRequestType = requestType;

      // var invalidElement = false;

      // if (invalidElement) {
      //     return;
      // }

      // if (data.createNoneTransactionMethod) {
      //     data.account = account.account;
      //     delete data.sender;
      // }

      // if (Object.values(data).length) {
      //     var output = data;

      //     if (!output) {
      //         return;
      //     } else if (output.error) {
      //         if (formErrorFunction) {
      //             formErrorFunction();
      //         }
      //         return;
      //     } else {
      //         if (output.requestType) {
      //             requestType = output.requestType;
      //         }
      //         if (output.data) {
      //             data = output.data;
      //         }
      //         if ("successMessage" in output) {
      //             successMessage = output.successMessage;
      //         }
      //         if ("errorMessage" in output) {
      //             errorMessage = output.errorMessage;
      //         }
      //         if (output.stop) {
      //             if (errorMessage) {
      //                 $form.find(".error_message").html(errorMessage).show();
      //             } else if (successMessage) {
      //                 $.growl(successMessage.escapeHTML(), {
      //                     type: "success"
      //                 });
      //             }
      //             return;
      //         }
      //         if (output.reload) {
      //             window.location.reload(output.forceGet);
      //             return;
      //         }
      //     }
      // }

      // if (!data.deadline) {
      //     data.deadline = 1440;
      // }

      // if (data.feeATM && $.isNumeric(data.feeATM)) {
      //     data.feeATM = data.feeATM * decimals
      // }

      // if (data.amountATM && $.isNumeric(data.amountATM)) {
      //     data.amountATM = data.amountATM * decimals
      // }

      // if (data.priceATM && $.isNumeric(data.priceATM)) {
      //     data.priceATM = data.priceATM * decimals
      // }

      // if (data.priceOrder) {
      //     data.priceATM = data.priceOrder;

      //     delete data.priceOrder;
      // }

      // if (data.quantityOrder) {
      //     data.quantityATU = data.quantityOrder;

      //     delete data.quantityOrder;
      // }

      // if (data.deliveryDeadlineTimestamp) {
      //     data.deliveryDeadlineTimestamp = String(toEpochTime() + 60 * 60 * data.deliveryDeadlineTimestamp);
      // }

      // if (data.doNotBroadcast || data.calculateFee) {
      //     data.broadcast = "false";

      //     if (data.doNotBroadcast) {
      //         delete data.doNotBroadcast;
      //     }
      // }

      // if ((data.feeAPL             > fee.minFeeAmount ||
      //      data.feeATM / decimals > fee.minFeeAmount
      // ) && !fee.isFeeAlert) {
      //     NotificationManager.warning(`You are trying to send the transaction with fee that exceeds ${fee.minFeeAmount} APL`, 'Attention', 10000);

      //     dispatch({
      //         type: 'SET_FEE_ALERT',
      //         payload: true
      //     });
      //     dispatch({
      //         type: 'IS_MODAL_PROCESSING',
      //         payload: false
      //     });
      //     return;
      // } else {
      //     dispatch({
      //         type: 'SET_FEE_ALERT',
      //         payload: false
      //     });
      // }


      // if (data.messageFile && data.encrypt_message) {
      //     if (!util.isFileEncryptionSupported()) {
      //         $form.find(".error_message").html(i18n.t("file_encryption_not_supported")).show();
      //         if (formErrorFunction) {
      //             formErrorFunction(false, data);
      //         }
      //         return;
      //     }
      //     try {
      //         crypto.encryptFileAPL(data.messageFile, data.encryptionKeys, function(encrypted) {
      //             data.messageFile = encrypted.file;
      //             data.encryptedMessageNonce = converters.byteArrayToHexString(encrypted.nonce);
      //             delete data.encryptionKeys;

      //             return sendRequest(requestType, data, function (response) {})
      //         });
      //     } catch (err) {
      //         $form.find(".error_message").html(String(err).escapeHTML()).show();
      //         if (formErrorFunction) {
      //             formErrorFunction(false, data);
      //         }
      //     }
      // } else {
          // if (requestType === 'sendMoneyPrivate') {
          //     data.deadline = '1440';
          //     return sendRequest(requestType, data, function (response) {});
          // } else {

          //     return dispatch(
          //         sendRequest(requestType, data, function (response) {})
          //     );
          // }
      // }
  }
};