NRS.encryptNote = function(message, options, secretPhrase) {
  try {
    options = NRS.getEncryptionKeys(options, secretPhrase);
    var encrypted = encryptData(converters.stringToByteArray(message), options);
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


NRS.getEncryptionKeys = function (options, secretPhrase){
  if (!options.sharedKey) {
    if (!options.privateKey) {
      if (!secretPhrase) {
        if (NRS.rememberPassword) {
          secretPhrase = _password;
        } else {
          throw {
            "message": $.t("error_encryption_passphrase_required"),
            "errorCode": 1
          };
        }
      }

      options.privateKey = converters.hexStringToByteArray(NRS.getPrivateKey(secretPhrase));
    }

    if (!options.publicKey) {
      if (!options.account) {
        throw {
          "message": $.t("error_account_id_not_specified"),
          "errorCode": 2
        };
      }

      try {
        options.publicKey = converters.hexStringToByteArray(NRS.getPublicKey(options.account, true));
      } catch (err) {
        var nxtAddress = new NxtAddress();

        if (!nxtAddress.set(options.account)) {
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


function encryptData(plaintext, options) {
  options.nonce = getRandomBytes(32);
  if (!options.sharedKey) {
      options.sharedKey = getSharedSecret(options.privateKey, options.publicKey);
  }
  var compressedPlaintext = pako.gzip(new Uint8Array(plaintext));
  var data = aesEncrypt(compressedPlaintext, options);
  return {
  "nonce": options.nonce,
  "data": data
  };
}

function getSharedSecret(key1, key2) {
  return converters.shortArrayToByteArray(curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2), null));
}