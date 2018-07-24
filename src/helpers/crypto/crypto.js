import CryptoJS from 'crypto-js';
import converters from '../converters';
import account from '../../modules/modals';
import curve25519 from './curve25519';
import jsbn from "jsbn";
import pako from 'pako'
const BigInteger = jsbn.BigInteger;

function simpleHash(b1, b2) {
    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(converters.byteArrayToWordArray(b1));
    if (b2) {
        sha256.update(converters.byteArrayToWordArray(b2));
    }
    var hash = sha256.finalize();
    return converters.wordArrayToByteArrayImpl(hash, false);
}

function curve25519_clamp(curve) {
    curve[0] &= 0xFFF8;
    curve[15] &= 0x7FFF;
    curve[15] |= 0x4000;
    return curve;
}

function getPrivateKey(secretPhrase) {
    var bytes = simpleHash(converters.stringToByteArray(secretPhrase));
    return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(bytes)));
}

function getAccountIdFromPublicKey(publicKey, isRsFormat) {

    var hex = converters.hexStringToByteArray(publicKey);
    var account = simpleHash(hex);
    account = converters.byteArrayToHexString(account);
    var slice = (converters.hexStringToByteArray(account)).slice(0, 8);
    var accountId = converters.byteArrayToBigInteger(slice).toString();
    console.log(converters.byteArrayToBigInteger(slice));
    if (isRsFormat) {
        return converters.convertNumericToRSAccountFormat(accountId);
    } else {
        return accountId;
    }
};


// example
function getAccountId(secretPhrase, isRsFormat) {
    // return getAccountIdFromPublicKey(store.account.publicKey, isRsFormat);
    return;
};

function validatePassphrase(passphrase, accountRs) {
    return accountRs === getAccountId(passphrase, true);
};

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

export default {
    getPrivateKey: getPrivateKey,
    getSharedSecretJava: getSharedSecretJava,
    decryptData : decryptData
}


// function areByteArraysEqual(bytes1, bytes2) {
//     if (bytes1.length !== bytes2.length) {
//         return false;
//     }
//     for (var i = 0; i < bytes1.length; ++i) {
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
//     var value = new BigInteger("0", 10);
//     var temp1, temp2;
//     for (var i = byteArray.length - 1; i >= 0; i--) {
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
//     var compressedPlaintext = pako.gzip(new Uint8Array(plaintext));
//     var data = aesEncrypt(compressedPlaintext, options);
//     return {
//         "nonce": options.nonce,
//         "data": data
//     };
// }