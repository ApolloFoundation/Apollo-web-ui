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

  return dispatch(sendRequest(requestType, data));
}

const getConfig = (data, constants, type) => {
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
  return d[type];
}

function sendRequest(requestType, data) {
  return (dispatch, getState) => {
    const { account } = getState();
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
          url += configServer.api.serverUrl + "requestType=" + requestType;
      }

      const config = getConfig(data, account.constants, requestType);

      if (!file && (requestType === "uploadTaggedData" || requestType === "importKeyViaFile")) {
        return {
            "errorCode": 3,
            "errorDescription": i18n.t("error_no_file_chosen")
        };
    }

      let formData = null;
      if (config) {
          formData = new FormData();
          let file = data.file;
          if (data.messageFile) {
              file = data.messageFile;
              delete data.messageFile;
              delete data.encrypt_message;
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

          formData.append(config.requestParam, file);

          if (requestType === "importKeyViaFile") {
              delete data.sender;
              delete data.format;
              delete data.deadline;
          }
          for (let key in data) {
              if (!data.hasOwnProperty(key)) {
                continue;
              }
              if (data[key] instanceof Array) {
                for (let i = 0; i < data[key].length; i++) {
                    formData.append(key, data[key][i]);
                }
              } else {
                formData.append(key, data[key]);
              }
          }
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

      if (formData) {
          return axios.post(url, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
      }

      return handleFetch(url, httpMethod, data, requestType, false)
  }
};
