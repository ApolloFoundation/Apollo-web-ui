import CryptoJS from 'crypto-js';
import converters from '../converters';
import AplAddress from '../util/apladres';
import account from '../../modules/modals';
import curve25519 from './curve25519';
import jsbn from "jsbn";
import inflate from 'pako/lib/inflate'
import pako from 'pako'
import axios from 'axios';
import config from '../../config';
import curve25519_ from './curve25519_'

const BigInteger = jsbn.BigInteger;


function simpleHash(b1, b2) {
    let sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(converters.byteArrayToWordArray(b1));
    if (b2) {
        sha256.update(converters.byteArrayToWordArray(b2));
    }
    let hash = sha256.finalize();
    return converters.wordArrayToByteArrayImpl(hash, false);
}

function curve25519_clamp(curve) {
    curve[0] &= 0xFFF8;
    curve[15] &= 0x7FFF;
    curve[15] |= 0x4000;
    return curve;
}

function getPrivateKey(secretPhrase) {
    let bytes = simpleHash(converters.stringToByteArray(secretPhrase));
    return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(bytes)));
}

function getAccountIdFromPublicKey(publicKey, isRsFormat) {

    var hex = converters.hexStringToByteArray(publicKey);
    var account = simpleHash(hex);
    account = converters.byteArrayToHexString(account);
    var slice = (converters.hexStringToByteArray(account)).slice(0, 8);
    var accountId = converters.byteArrayToBigInteger(slice).toString();
    if (isRsFormat) {
        return converters.convertNumericToRSAccountFormat(accountId);
    } else {
        return accountId;
    }
};

async function getPublicKey(id, isAccountId) {
    if (isAccountId) {
        let publicKey = "";
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountPublicKey',
                account: id
            }
        })
            .then((res) => {
                if (!res.data.publicKey) {
                    // throw $.t("error_no_public_key");
                } else {
                    publicKey = res.data.publicKey;
                    return publicKey;
                }
            })
            .catch(() => {

            })

    } else {
        let secretPhraseBytes = converters.hexStringToByteArray(id);
        let digest = simpleHash(secretPhraseBytes);

        return converters.byteArrayToHexString(curve25519.keygen(digest).p);
    }
};

// example
function getAccountId(secretPhrase, isRsFormat) {
    return async (dispatch, getStore) => {
        // const store = getStore();
        const publicKey = await getPublicKey(converters.stringToHexString(secretPhrase));
        return await dispatch(getAccountIdFromPublicKey(publicKey, isRsFormat));
    }
};


function getAccountIdAsync(secretPhrase, isRsFormat) {
    return (dispatch, getStore) => {

        async () => {
            // const store = getStore();

            const publicKey = await getPublicKey(converters.stringToHexString(secretPhrase));
            return await dispatch(getAccountIdFromPublicKey(publicKey, isRsFormat));
        }
    }
};

const validatePassphrase = (passphrase) => (dispatch, getStore) => new Promise(async function(resolve, reject) {

        const accountRS = getStore().account.accountRS;

        const isAccount = await dispatch(getAccountId(passphrase, true));
        resolve(accountRS === isAccount);
    });


function getSharedSecretJava(key1, key2) {
    var sharedKey;

    var result =  curve25519.generateSharedKey(sharedKey, key1, key2);
    var result = new Uint8Array(result);

    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(converters.byteArrayToWordArray(result));

    var hash = sha256.finalize();
    hash = converters.wordArrayToByteArrayImpl(hash, false);

    hash = new Int8Array(hash);

    return hash;
};

function aesDecryptMessage(ivCiphertext, options) {
    if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
        throw {
            name: "invalid ciphertext"
        };
    }

    var iv = converters.byteArrayToWordArray(ivCiphertext.slice(0, 16));
    var ciphertext = converters.byteArrayToWordArray(ivCiphertext.slice(16));

    // shared key is use for two different purposes here
    // (1) if nonce exists, shared key represents the shared secret between the private and public keys
    // (2) if nonce does not exists, shared key is the specific key needed for decryption already xored
    // with the nonce and hashed
    var sharedKey;
    if (!options.sharedKey) {
        sharedKey = getSharedSecret(options.privateKey, options.publicKey);
    } else {
        sharedKey = options.sharedKey.slice(0); //clone
    }

    var key;
    if (options.nonce) {
        for (var i = 0; i < 32; i++) {
            sharedKey[i] ^= options.nonce[i];
        }
        key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
    } else {
        key = converters.byteArrayToWordArray(sharedKey);
    }

    var encrypted = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
        key: key
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv
    });

    return {
        decrypted: converters.wordArrayToByteArray(decrypted),
        sharedKey: converters.wordArrayToByteArray(key)
    };
}

function getSharedSecret(key1, key2) {
    return converters.shortArrayToByteArray(curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2), null));
}

function decryptMessage(data, options) {
    if (!options.sharedKey) {
        options.sharedKey = getSharedSecret(options.privateKey, options.publicKey);
    }

    data = converters.hexStringToByteArray(data)

    if (typeof options.nonce === 'string') {
        options.nonce = converters.hexStringToByteArray(options.nonce);
    }

    var result = aesDecryptMessage(data, options);
    var binData = new Uint8Array(result.decrypted);

    if (!(options.isCompressed === false)){
        binData = pako.inflate(binData);
    }

    var message;

    if (!(options.isText === false)) {
        message = converters.byteArrayToString(binData);
    } else {
        message = converters.byteArrayToHexString(binData);
    }

    return { message: message, sharedKey: converters.byteArrayToHexString(result.sharedKey) };
}

function decryptData(data, options) {
    // if (!options.sharedKey) {
    //     options.sharedKey = NRS.getSharedSecretJava(options.privateKey, options.publicKey);
    //
    //     var sharedKey =  NRS.getSharedSecretJava(options.privateKey, options.publicKey);
    //
    //     var options = {};
    //     options.sharedKey = sharedKey;
    // }

    if (typeof(options.sharedKey) === 'string') {
        options.sharedKey = converters.hexStringToByteArray(options.sharedKey);
    }

    options.sharedKey = new Uint8Array(options.sharedKey);

    data = converters.hexStringToByteArray(data);

    var result = aesDecrypt(data, options);

    var binData = new Uint8Array(result.decrypted);
    options.isCompressed = false;
    options.isText = false;

    if (!(options.isCompressed === false)) {
        binData = inflate(binData);
    }
    var message;
    if (!(options.isText === false)) {
        message = converters.byteArrayToString(binData);
    } else {
        message = converters.byteArrayToHexString(binData);
    }

    return { message: message, sharedKey: converters.byteArrayToHexString(result.sharedKey) };
}

function aesDecrypt(ivCiphertext, options) {
    if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
        throw {
            name: "invalid ciphertext"
        };
    }

    var iv = converters.byteArrayToWordArray(ivCiphertext.slice(0, 16));
    var ciphertext = converters.byteArrayToWordArray(ivCiphertext.slice(16));

    // shared key is use for two different purposes here
    // (1) if nonce exists, shared key represents the shared secret between the private and public keys
    // (2) if nonce does not exists, shared key is the specific key needed for decryption already xored
    // with the nonce and hashed
    var sharedKey;
    if (!options.sharedKey) {
        // sharedKey = getSharedSecret(options.privateKey, options.publicKey);
        return;
    } else {
        sharedKey = options.sharedKey.slice(0); //clone
    }

    var key;
    if (options.nonce) {
        for (var i = 0; i < 32; i++) {
            sharedKey[i] ^= options.nonce[i];
        }
        key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
    } else {
        key = converters.byteArrayToWordArray(sharedKey);
    }

    var encrypted = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
        key: key
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv
    });

    return {
        decrypted: converters.wordArrayToByteArray(decrypted),
        sharedKey: converters.wordArrayToByteArray(key)
    };
}

function tryToDecryptMessage(message, options) {
    // if (_decryptedTransactions && _decryptedTransactions[message.transaction]) {
    //     if (_decryptedTransactions[message.transaction].encryptedMessage) {
    //         return _decryptedTransactions[message.transaction].encryptedMessage; // cache is saved differently by the info modal vs the messages table
    //     }
    // }
    return (dispatch, getState) => {
        const account = getState().account;
        try {
            if (!message.attachment.encryptedMessage.data) {
                return console.log('empty message');
            } else {
                var decoded = decryptMessage(message.attachment.encryptedMessage.data, {
                    "nonce": message.attachment.encryptedMessage.nonce,
                    "account": account.account,
                    "isText": message.attachment.encryptedMessage.isText,
                    "isCompressed": message.attachment.encryptedMessage.isCompressed,
                    "sharedKey": options.sharedKey
                });
            }
            return decoded;
        } catch (err) {
            throw err;
        }
    }

};

function decryptNote(message, options, secretPhrase) {

    try {
        if (!options.sharedKey) {
            if (!options.privateKey) {
                if (secretPhrase) {
                    options.privateKey = converters.hexStringToByteArray(getPrivateKey(secretPhrase));
                }
            }

            if (!options.publicKey) {
                options.publicKey = converters.hexStringToByteArray(getPublicKey(options.account, true));
            }
        }
        if (options.nonce) {
            options.nonce = converters.hexStringToByteArray(options.nonce);
        }

        return decryptData(converters.hexStringToByteArray(message), options);
    } catch (err) {
        if (err.errorCode && err.errorCode < 3) {
            throw err;
        } else {
            console.log(err.message);
        }
    }
};

function aesEncrypt(plaintext, options) {
    var ivBytes = getRandomBytes(16);

    // CryptoJS likes WordArray parameters
    var text = converters.byteArrayToWordArray(plaintext);
    var sharedKey;
    if (!options.sharedKey) {
        sharedKey = getSharedSecret(options.privateKey, options.publicKey);
    } else {
        sharedKey = options.sharedKey.slice(0); //clone
    }
    for (var i = 0; i < 32; i++) {
        sharedKey[i] ^= options.nonce[i];
    }
    var key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
    var encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: converters.byteArrayToWordArray(ivBytes)
    });
    var ivOut = converters.wordArrayToByteArray(encrypted.iv);
    var ciphertextOut = converters.wordArrayToByteArray(encrypted.ciphertext);
    return ivOut.concat(ciphertextOut);
}

function encryptFile(file, options, callback) {
    var r;
    try {
        r = new FileReader();
    } catch(e) {
        // throw $.t("encrypted_file_upload_not_supported");
    }
    r.onload = function (e) {
        var bytes = e.target.result;
        options.isText = false;
        var encrypted = encryptData(bytes, options);
        var blobData = Uint8Array.from(encrypted.data);
        var blob = new Blob([ blobData ], { type: "application/octet-stream" });
        callback({ file: blob, nonce: encrypted.nonce });
    };
    r.readAsArrayBuffer(file);
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
};

function getRandomBytes(length) {
    if (!window.crypto && !window.msCrypto && !crypto) {
        // throw {
        //     "errorCode": -1,
        //     "message": $.t("error_encryption_browser_support")
        // };
    }
    var bytes = new Uint8Array(length);
    if (window.crypto) {
        //noinspection JSUnresolvedFunction
        window.crypto.getRandomValues(bytes);
    } else if (window.msCrypto) {
        //noinspection JSUnresolvedFunction
        window.msCrypto.getRandomValues(bytes);
    } else {
        bytes = crypto.randomBytes(length);
    }
    return bytes;
}

function getEncryptionKeys(options, secretPhrase){
    if (!options.sharedKey) {
        if (!options.privateKey) {
            if (!secretPhrase) {
                // Todo: remembering of password
                // if (NRS.rememberPassword) {
                //     // secretPhrase = _password;
                // } else {
                //     throw {
                //         "message": $.t("error_encryption_passphrase_required"),
                //         "errorCode": 1
                //     };
                // }
            }

            options.privateKey = converters.hexStringToByteArray(getPrivateKey(secretPhrase));
        }

        if (!options.publicKey) {
            if (!options.account) {
                throw {
                    "message": 'error_account_id_not_specified',
                    "errorCode": 2
                };
            }

            try {
                options.publicKey = converters.hexStringToByteArray(getPublicKey(options.account, true));
            } catch (err) {
                var aplAddress = new AplAddress();

                if (!aplAddress.set(options.account)) {
                    throw {
                        "message": 'error_invalid_account_id',
                        "errorCode": 3
                    };
                } else {
                    throw {
                        "message": 'error_public_key_not_specified',
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

function generatePublicKey (secretPhrase) {
    // if (!secretPhrase) {
    //     if (NRS.rememberPassword) {
    //         secretPhrase = _password;
    //     } else {
    //         throw { message: $.t("error_generate_public_key_no_password") };
    //     }
    // }

    return getPublicKey(converters.stringToHexString(secretPhrase));
};

export default {
    getSharedSecretJava,
    getSharedSecret,
    decryptData,
    decryptMessage,
    getPrivateKey,
    getPublicKey,
    validatePassphrase,
    tryToDecryptMessage,
    encryptFile,
    encryptData,
    getEncryptionKeys,
    generatePublicKey,
    getAccountId,
    getAccountIdAsync
}


// function areByteArraysEqual(bytes1, bytes2) {
//     if (bytes1.length !== bytes2.length) {
//         return false;
//     }
//     for (let i = 0; i < bytes1.length; ++i) {
//         if (bytes1[i] !== bytes2[i]) {
//             return false;
//         }
//     }
//     return true;
// }
//
// function curve25519_clamp(curve) {
//     curve[0] &= 0xFFF8;
//     curve[15] &= 0x7FFF;
//     curve[15] |= 0x4000;
//     return curve;
// }
//
// function byteArrayToBigInteger(byteArray) {
//     let value = new BigInteger("0", 10);
//     let temp1, temp2;
//     for (let i = byteArray.length - 1; i >= 0; i--) {
//         temp1 = value.multiply(new BigInteger("256", 10));
//         temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
//         value = temp2;
//     }
//     return value;
// }
//
//
// function encryptData(plaintext, options) {
//     options.nonce = getRandomBytes(32);
//     if (!options.sharedKey) {
//         options.sharedKey = getSharedSecret(options.privateKey, options.publicKey);
//     }
//     let compressedPlaintext = pako.gzip(new Uint8Array(plaintext));
//     let data = aesEncrypt(compressedPlaintext, options);
//     return {
//         "nonce": options.nonce,
//         "data": data
//     };
// }