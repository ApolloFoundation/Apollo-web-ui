import CryptoJS from 'crypto-js';
import converters from '../converters';
console.log(converters);

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
};

export default {
    getPrivateKey: getPrivateKey
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