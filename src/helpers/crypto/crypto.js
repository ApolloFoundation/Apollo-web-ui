/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import CryptoJS from 'crypto-js';
import conv from 'helpers/converters';
import AplAddress from 'helpers/util/apladres';
import curve25519 from './curve25519';
import inflate from 'pako/lib/inflate'
import pako from 'pako'
import axios from 'axios';

import config from 'config';
import curve25519_ from './curve25519_'
import {words} from './random-words'

function simpleHashAPL(stage1, stage2) {
    let sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(conv.byteArrayToWordArrayAPL(stage1));
    if (stage2) {
        sha256.update(conv.byteArrayToWordArrayAPL(stage2));
    }
    let hash = sha256.finalize();
    return conv.wordArrayToByteArrayImplAPL(hash, false);
}

function curve25519_clampAPL(curveAPL) {
    curveAPL[0] &= 0xFFF8;
    curveAPL[15] &= 0x7FFF;
    curveAPL[15] |= 0x4000;
    return curveAPL;
}

function getPrivateKeyAPL(sp) {
    let bts = simpleHashAPL(conv.stringToByteArray(sp));
    return conv.shortArrayToHexString(curve25519_clampAPL(conv.byteArrayToShortArray(bts)));
}

function getAccountIdFromPublicKeyAPL(pk, isRsFt, prefix) {
    var hex = conv.hexStringToByteArray(pk);
    var account = simpleHashAPL(hex);
    account = conv.byteArrayToHexString(account);
    var slice = (conv.hexStringToByteArray(account)).slice(0, 8);
    var accountId = conv.byteArrayToBigIntegerAPL(slice).toString();
    if (isRsFt) {
        return conv.convertNumericToRSAccountFormatAPL(accountId, prefix);
    } else {
        return accountId;
    }
};

async function getPublicKeyAPL(id, isAccountId) {
    if (!id) return;
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
                    // throw i18n.t("error_no_public_key");
                } else {
                    publicKey = res.data.publicKey;
                    return publicKey;
                }
            })
            .catch(() => {

            })

    } else {
        let secretPhraseBytes = conv.hexStringToByteArray(id);
        let digest = simpleHashAPL(secretPhraseBytes);

        return conv.byteArrayToHexString(curve25519.keygen(digest).p);
    }
};

// example
function getAccountIdAPL(sp, isRsFt) {
    return async (dispatch, getStore) => {

        const {account} = getStore();
        const publicKey = await getPublicKeyAPL(conv.stringToHexStringAPL(sp));
        let accountRS = dispatch(getAccountIdFromPublicKeyAPL(publicKey, isRsFt));
        if (accountRS.slice(0,4) === 'APL-' && account.constants) {
            accountRS = accountRS.replace('APL-', '');
            accountRS = `${account.constants.accountPrefix}-${accountRS}`;
            return accountRS;
        }

        return await dispatch(getAccountIdFromPublicKeyAPL(publicKey, isRsFt));
    }
};


function getAccountIdAsyncApl(sp, prefix) {
    return async (dispatch, getStore) => {
        const pk = await getPublicKeyAPL(conv.stringToHexStringAPL(sp));

        return dispatch(getAccountIdFromPublicKeyAPL(pk, true, prefix));
    }
};

const validatePassphrase = (passphrase) => (dispatch, getStore) => new Promise(async function(resolve, reject) {

        const accountRS = getStore().account.accountRS;

        const isAccount = await dispatch(getAccountIdAPL(passphrase, true));

        resolve(accountRS === isAccount);
    });

function generatePassPhraseAPL () {
    var bs = 128;
    var randomBts = new Uint32Array(bs / 32);
    crypto.getRandomValues(randomBts);
    var n = words.length;
    var	phraseWords = [];
    var	x, w1, w2, w3;

    for (var i=0; i < randomBts.length; i++) {
        x = randomBts[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;

        phraseWords.push(words[w1]);
        phraseWords.push(words[w2]);
        phraseWords.push(words[w3]);
    }

    return (phraseWords);
}

function getSharedSecretJava(k1, k2) {
    var sk;

    var r =  curve25519.generateSharedKey(sk, k1, k2);
    var r = new Uint8Array(r);

    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(conv.byteArrayToWordArrayAPL(r));

    var hash = sha256.finalize();
    hash = conv.wordArrayToByteArrayImplAPL(hash, false);

    hash = new Int8Array(hash);

    return hash;
};

function aesDecryptMesAPL(iv, o) {
    if (iv.length < 16 || iv.length % 16 != 0) {
        throw {
            name: "invalid ciphertext"
        };
    }

    var iv = conv.byteArrayToWordArrayAPL(iv.slice(0, 16));
    var ciphertext = conv.byteArrayToWordArrayAPL(iv.slice(16));

    // shared key is use for two different purposes here
    // (1) if nonce exists, shared key represents the shared secret between the private and public keys
    // (2) if nonce does not exists, shared key is the specific key needed for decryption already xored
    // with the nonce and hashed
    var sharedKey;
    if (!o.sharedKey) {
        sharedKey = getSharedSecret(o.privateKey, o.publicKey);
    } else {
        sharedKey = o.sharedKey.slice(0); //clone
    }

    var key;
    if (o.nonce) {
        for (var i = 0; i < 32; i++) {
            sharedKey[i] ^= o.nonce[i];
        }
        key = CryptoJS.SHA256(conv.byteArrayToWordArrayAPL(sharedKey));
    } else {
        key = conv.byteArrayToWordArrayAPL(sharedKey);
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
        decrypted: conv.wordArrayToByteArrayAPL(decrypted),
        sharedKey: conv.wordArrayToByteArrayAPL(key)
    };
}

function getSharedSecret(key1, key2) {
    return conv.shortArrayToByteArrayAPL(curve25519_(conv.byteArrayToShortArray(key1), conv.byteArrayToShortArray(key2), null));
}

function decryptMessage(data, options) {
    if (!options.sharedKey) {
        options.sharedKey = getSharedSecret(options.privateKey, options.publicKey);
    }

    data = conv.hexStringToByteArray(data)

    if (typeof options.nonce === 'string') {
        options.nonce = conv.hexStringToByteArray(options.nonce);
    }

    var result = aesDecryptMesAPL(data, options);

    var binData = new Uint8Array(result.decrypted);
    if (!(options.isCompressed === false)){
        binData = pako.inflate(binData);
    }

    var message;

    if (!(options.isText === false)) {
        message = conv.byteArrayToStringAPL(binData);
    } else {
        message = conv.byteArrayToHexString(binData);
    }

    return { message: message, sharedKey: conv.byteArrayToHexString(result.sharedKey) };
}

function decryptDataStreamAPL(d, o) {

    if (typeof(o.sharedKey) === 'string') {
        o.sharedKey = conv.hexStringToByteArray(o.sharedKey);
    }

    o.sharedKey = new Uint8Array(o.sharedKey);

    d = conv.hexStringToByteArray(d);

    var result = aesDecryptStreamAPL(d, o);

    var binData = new Uint8Array(result.decrypted);
    o.isCompressed = false;
    o.isText = false;

    if (!(o.isCompressed === false)) {
        binData = inflate(binData);
    }
    var message;
    if (!(o.isText === false)) {
        message = conv.byteArrayToStringAPL(binData);
    } else {
        message = conv.byteArrayToHexString(binData);
    }

    return { message: message, sharedKey: conv.byteArrayToHexString(result.sharedKey) };
}

function aesDecryptStreamAPL(ivCiphertext, options) {
    if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
        throw {
            name: "invalid ciphertext"
        };
    }

    var iv = conv.byteArrayToWordArrayAPL(ivCiphertext.slice(0, 16));
    var ciphertext = conv.byteArrayToWordArrayAPL(ivCiphertext.slice(16));

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
        key = CryptoJS.SHA256(conv.byteArrayToWordArrayAPL(sharedKey));
    } else {
        key = conv.byteArrayToWordArrayAPL(sharedKey);
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
        decrypted: conv.wordArrayToByteArrayAPL(decrypted),
        sharedKey: conv.wordArrayToByteArrayAPL(key)
    };
}

function tryToDecryptMessageAPL(m, o) {
    return (dispatch, getState) => {
        const account = getState().account;
        try {
            if (m.attachment.encryptedMessage) {
                if (!m.attachment.encryptedMessage.data) {
                    return console.log('empty message');
                } else {
                    var decoded = decryptMessage(m.attachment.encryptedMessage.data, {
                        "nonce": m.attachment.encryptedMessage.nonce,
                        "account": account.account,
                        "isText": m.attachment.encryptedMessage.isText,
                        "isCompressed": m.attachment.encryptedMessage.isCompressed,
                        "sharedKey": o.sharedKey
                    });
                }
                return decoded;
            }
        } catch (err) {
            throw err;
        }
    }

};

function decryptNoteAPL(m, o, sp) {

    try {
        if (!o.sharedKey) {
            if (!o.privateKey) {
                if (sp) {
                    o.privateKey = conv.hexStringToByteArray(getPrivateKeyAPL(sp));
                }
            }

            if (!o.publicKey) {
                o.publicKey = conv.hexStringToByteArray(getPublicKeyAPL(o.account, true));
            }
        }
        if (o.nonce) {
            o.nonce = conv.hexStringToByteArray(o.nonce);
        }

        return decryptDataStreamAPL(conv.hexStringToByteArray(m), o);
    } catch (err) {
        if (err.errorCode && err.errorCode < 3) {
            throw err;
        }
    }
};

function aesEncryptAPL(pt, o) {
    var ivBytes = getRandomBytesAPL(16);

    // CryptoJS likes WordArray parameters
    var text = conv.byteArrayToWordArrayAPL(pt);
    var sharedKey;
    if (!o.sharedKey) {
        sharedKey = getSharedSecret(o.privateKey, o.publicKey);
    } else {
        sharedKey = o.sharedKey.slice(0); //clone
    }
    for (var i = 0; i < 32; i++) {
        sharedKey[i] ^= o.nonce[i];
    }
    var key = CryptoJS.SHA256(conv.byteArrayToWordArrayAPL(sharedKey));
    var encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: conv.byteArrayToWordArrayAPL(ivBytes)
    });
    var ivOut = conv.wordArrayToByteArrayAPL(encrypted.iv);
    var ciphertextOut = conv.wordArrayToByteArrayAPL(encrypted.ciphertext);
    return ivOut.concat(ciphertextOut);
}

function encryptFileAPL(f, o, c) {
    var r;
    try {
        r = new FileReader();
    } catch(e) {
        // throw i18n.t("encrypted_file_upload_not_supported");
    }
    r.onload = function (e) {
        var bytes = e.target.result;
        o.isText = false;
        var encrypted = encryptDataAPL(bytes, o);
        var blobData = Uint8Array.from(encrypted.data);
        var blob = new Blob([ blobData ], { type: "application/octet-stream" });
        c({ file: blob, nonce: encrypted.nonce });
    };
    r.readAsArrayBuffer(f);
};

function encryptDataAPL(pt, o) {
    o.nonce = getRandomBytesAPL(32);
    if (!o.sharedKey) {
        o.sharedKey = getSharedSecret(o.privateKey, o.publicKey);
    }
    var compressedPlaintext = pako.gzip(new Uint8Array(pt));
    var data = aesEncryptAPL(compressedPlaintext, o);
    return {
        "nonce": o.nonce,
        "data": data
    };
};

function getRandomBytesAPL(l) {
    if (!window.crypto && !window.msCrypto && !crypto) {
        // throw {
        //     "errorCode": -1,
        //     "message": i18n.t("error_encryption_browser_support")
        // };
    }
    var bytes = new Uint8Array(l);
    if (window.crypto) {
        //noinspection JSUnresolvedFunction
        window.crypto.getRandomValues(bytes);
    } else if (window.msCrypto) {
        //noinspection JSUnresolvedFunction
        window.msCrypto.getRandomValues(bytes);
    } else {
        bytes = crypto.randomBytes(l);
    }
    return bytes;
}

function getEncryptionKeysAPl(o, sp){
    if (!o.sharedKey) {
        if (!o.privateKey) {
            if (!sp) {

            }

            o.privateKey = conv.hexStringToByteArray(getPrivateKeyAPL(sp));
        }

        if (!o.publicKey) {
            if (!o.account) {
                throw {
                    "message": 'error_account_id_not_specified',
                    "errorCode": 2
                };
            }

            try {
                o.publicKey = conv.hexStringToByteArray(getPublicKeyAPL(o.account, true));
            } catch (err) {
                var aplAddress = new AplAddress();

                if (!aplAddress.set(o.account)) {
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
        } else if (typeof o.publicKey == "string") {
            o.publicKey = conv.hexStringToByteArray(o.publicKey);
        }
    }
    return o;
};

function generatePublicKeyAPL (sp) {

    return getPublicKeyAPL(conv.stringToHexStringAPL(sp));
};

export default {
    getSharedSecretJava,
    getSharedSecret,
    decryptDataStreamAPL: decryptDataStreamAPL,
    decryptMessage,
    getPrivateKeyAPL: getPrivateKeyAPL,
    getPublicKeyAPL: getPublicKeyAPL,
    validatePassphrase,
    tryToDecryptMessageAPL: tryToDecryptMessageAPL,
    encryptFileAPL: encryptFileAPL,
    encryptDataAPL: encryptDataAPL,
    getEncryptionKeysAPl: getEncryptionKeysAPl,
    generatePublicKeyAPL: generatePublicKeyAPL,
    getAccountIdAPL: getAccountIdAPL,
    getAccountIdAsyncApl: getAccountIdAsyncApl,
    generatePassPhraseAPL: generatePassPhraseAPL,
}
