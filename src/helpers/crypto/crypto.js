import CryptoJS from 'crypto-js';
import converters from '../converters';
import account from '../../modules/modals';
import jsbn from "jsbn";
import curve25519 from './curve25519';
import axios from 'axios';
import config from '../../config';
const BigInteger = jsbn.BigInteger;

console.log(account);


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
    return (dispatch) => {
        let hex = converters.hexStringToByteArray(publicKey);
        let account = simpleHash(hex);
        account = converters.byteArrayToHexString(account);
        let slice = (converters.hexStringToByteArray(account)).slice(0, 8);
        const accountId = converters.byteArrayToBigInteger(slice).toString();
        console.log(converters.byteArrayToBigInteger(slice));
        if (isRsFormat) {
            return dispatch(converters.convertNumericToRSAccountFormat(accountId));
        } else {
            return accountId;
        }
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
        console.log(publicKey);
        return await dispatch(getAccountIdFromPublicKey(publicKey, isRsFormat));
    }
};

function validatePassphrase(passphrase, accountRs) {
    return async (dispatch, getStore) => {
        const isAccount = await dispatch(getAccountId(passphrase, true));
        console.log('-------------validatePassphrase-------------', passphrase, isAccount);
        return accountRs === isAccount;
    }
};

export default {
    getPrivateKey,
    validatePassphrase,
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