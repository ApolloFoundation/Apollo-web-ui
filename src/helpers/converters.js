/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
/* eslint-disable */

import CryptoJS from 'crypto-js';
import jsbn from 'jsbn';
import AplAddress from './util/apladres';
import curve25519 from './crypto/curve25519';
import crypto from './crypto/crypto';


const ACCOUNT_REGEX_STR = "^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}";
const BigInteger = jsbn.BigInteger;

var charToNibble = {};
var nibbleToChar = [];
var i;
for (i = 0; i <= 9; ++i) {
    var character = i.toString();
    charToNibble[character] = i;
    nibbleToChar.push(character);
}

for (i = 10; i <= 15; ++i) {
    var lowerChar = String.fromCharCode('a'.charCodeAt(0) + i - 10);
    var upperChar = String.fromCharCode('A'.charCodeAt(0) + i - 10);

    charToNibble[lowerChar] = i;
    charToNibble[upperChar] = i;
    nibbleToChar.push(lowerChar);
}


// function stringToByteArray (str) {
//     str = unescape(encodeURIComponent(str)); //temporary
//
//     var bytes = new Array(str.length);
//     for (var i = 0; i < str.length; ++i)
//         bytes[i] = str.charCodeAt(i);
//
//     return bytes;
// };
function wordArrayToByteArrayImplAPL (wordArrayStrim, isFirstByteHasSign) {
    var len = wordArrayStrim.words.length;
    if (len == 0) {
        return new Array(0);
    }
    if (wordArrayStrim.sigBytes < 0) {
        wordArrayStrim.sigBytes = wordArrayStrim.sigBytes*-1
    }

    var byteArrayStrim = new Array(wordArrayStrim.sigBytes);
    var offset = 0,
        word, i;
    for (i = 0; i < len - 1; i++) {
        word = wordArrayStrim.words[i];
        byteArrayStrim[offset++] = isFirstByteHasSign ? word >> 24 : (word >> 24) & 0xff;
        byteArrayStrim[offset++] = (word >> 16) & 0xff;
        byteArrayStrim[offset++] = (word >> 8) & 0xff;
        byteArrayStrim[offset++] = word & 0xff;
    }
    word = wordArrayStrim.words[len - 1];
    byteArrayStrim[offset++] = isFirstByteHasSign ? word >> 24 : (word >> 24) & 0xff;
    if (wordArrayStrim.sigBytes % 4 == 0) {
        byteArrayStrim[offset++] = (word >> 16) & 0xff;
        byteArrayStrim[offset++] = (word >> 8) & 0xff;
        byteArrayStrim[offset++] = word & 0xff;
    }
    if (wordArrayStrim.sigBytes % 4 > 1) {
        byteArrayStrim[offset++] = (word >> 16) & 0xff;
    }
    if (wordArrayStrim.sigBytes % 4 > 2) {
        byteArrayStrim[offset++] = (word >> 8) & 0xff;
    }
    return byteArrayStrim;
};
// function byteArrayToWordArrayAPL(btyArrAPL) {
//     var i = 0,
//         offset = 0,
//         wrdAPL = 0,
//         len = btyArrAPL.length;
//     var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));
//
//     while (i < (len - (len % 4))) {
//         words[offset++] = (btyArrAPL[i++] << 24) | (btyArrAPL[i++] << 16) | (btyArrAPL[i++] << 8) | (btyArrAPL[i++]);
//     }
//     if (len % 4 != 0) {
//         wrdAPL = btyArrAPL[i++] << 24;
//         if (len % 4 > 1) {
//             wrdAPL = wrdAPL | btyArrAPL[i++] << 16;
//         }
//         if (len % 4 > 2) {
//             wrdAPL = wrdAPL | btyArrAPL[i++] << 8;
//         }
//         words[offset] = wrdAPL;
//     }
//     var wordArray = new Object();
//     wordArray.sigBytes = len;
//     wordArray.words = words;
//
//     return wordArray;
// }
function byteArrayToHexStringAPL(bytesAPL) {
    let str = '';
    for (var i = 0; i < bytesAPL.length; ++i) {
        if (bytesAPL[i] < 0) {
            bytesAPL[i] += 256;
        }
        str += nibbleToChar[bytesAPL[i] >> 4] + nibbleToChar[bytesAPL[i] & 0x0F];
    }

    return str;
}
function byteArrayToHexString(bytesStrim) {
     var str = '';
     for (var i = 0; i < bytesStrim.length; ++i) {
         if (bytesStrim[i] < 0) {
             bytesStrim[i] += 256;
         }
         str += nibbleToChar[bytesStrim[i] >> 4] + nibbleToChar[bytesStrim[i] & 0x0F];
     }

     return str;
}
function stringToByteArray(strAPL) {
    strAPL = unescape(encodeURIComponent(strAPL)); //temporary

     var bytesAPL = new Array(strAPL.length);
     for (var i = 0; i < strAPL.length; ++i)
         bytesAPL[i] = strAPL.charCodeAt(i);

     return bytesAPL;
}
function hexStringToByteArray(strAPL) {
     var bytesAPL = [];
     var i = 0;
     if (0 !== strAPL.length % 2) {
         bytesAPL.push(charToNibble[strAPL.charAt(0)]);
         ++i;
     }

     for (; i < strAPL.length - 1; i += 2)
         bytesAPL.push((charToNibble[strAPL.charAt(i)] << 4) + charToNibble[strAPL.charAt(i + 1)]);

     return bytesAPL;
}
function hexStringToInt8ByteArray(strAPL) {
     var bytesAPL = [];
     var i = 0;
     if (0 !== strAPL.length % 2) {
         bytesAPL.push(charToNibble[strAPL.charAt(0)]);
         ++i;
     }

     for (; i < strAPL.length - 1; i += 2)
         bytesAPL.push((charToNibble[strAPL.charAt(i)] << 4) + charToNibble[strAPL.charAt(i + 1)]);

     var bytesAPL = new Int8Array(bytesAPL);

     return bytesAPL;
}
function stringToHexStringAPL(str) {
    return byteArrayToHexString(stringToByteArray(str));
}
function hexStringToStringAPL(hex) {
     return byteArrayToStringAPL(hexStringToByteArray(hex));
}
function hexStringToInt8ByteArrayAPL(strAPL) {
     var btssAPL = [];
     var i = 0;
     if (0 !== strAPL.length % 2) {
         btssAPL.push(charToNibble[strAPL.charAt(0)]);
         ++i;
     }

     for (; i < strAPL.length - 1; i += 2)
         btssAPL.push((charToNibble[strAPL.charAt(i)] << 4) + charToNibble[strAPL.charAt(i + 1)]);

     var btssAPL = new Int8Array(btssAPL);

     return btssAPL;
 }
function checkBytesToIntInputAPL(bytes, numBts, optStartIndex) {
     var startIndex = optStartIndex || 0;
     if (startIndex < 0) {
         throw new Error('Start index should not be negative');
     }

     if (bytes.length < startIndex + numBts) {
         throw new Error('Need at least ' + (numBts) + ' bytes to convert to an integer');
     }
     return startIndex;
}

function byteArrayToBigIntegerHashAPL(btsArrayAPL) {
    var value = new BigInteger("0", 10);
    for (var i = btsArrayAPL.length - 1; i >= 0; i--) {
        value = value.multiply(new BigInteger("256", 10)).add(new BigInteger(btsArrayAPL[i].toString(10), 10));
    }
    return value;
}

function byteArrayToSignedShortAPL(bts, optStartIndex) {
     var index = this.checkBytesToIntInputAPL(bts, 2, optStartIndex);
     var value = bts[index];
     value += bts[index + 1] << 8;
     return value;
}

function byteArrayToWordArrayAPL(btsArrayAPL) {
     var i = 0,
         offset = 0,
         word = 0,
         len = btsArrayAPL.length;
     var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));

     while (i < (len - (len % 4))) {
         words[offset++] = (btsArrayAPL[i++] << 24) | (btsArrayAPL[i++] << 16) | (btsArrayAPL[i++] << 8) | (btsArrayAPL[i++]);
     }
     if (len % 4 != 0) {
         word = btsArrayAPL[i++] << 24;
         if (len % 4 > 1) {
             word = word | btsArrayAPL[i++] << 16;
         }
         if (len % 4 > 2) {
             word = word | btsArrayAPL[i++] << 8;
         }
         words[offset] = word;
     }
     var wordArray = new Object();
     wordArray.sigBytes = len;
     wordArray.words = words;

     return wordArray;
 }
 // assumes wordArray is Big-Endian
function wordArrayToByteArrayAPL(wordArrAPL) {
    return wordArrayToByteArrayImplAPL(wordArrAPL, true);
}
// function byteArrayToStringAPL(btsAPL, optStartIndex, length) {
//      if (length == 0) {
//          return "";
//      }
//
//      if (optStartIndex && length) {
//          var index = this.checkBytesToIntInputAPL(btsAPL, parseInt(length, 10), parseInt(optStartIndex, 10));
//
//          btsAPL = btsAPL.slice(optStartIndex, optStartIndex + length);
//      }
//
//      return decodeURIComponent(escape(String.fromCharCode.apply(null, btsAPL)));
//  }
function byteArrayToShortArray(btsArrayAPL) {
     var srtArrayAPL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         srtArrayAPL[i] = btsArrayAPL[i * 2] | btsArrayAPL[i * 2 + 1] << 8;
     }
     return srtArrayAPL;
}
function shortArrayToByteArray(srtArrayAPL) {
     var btsArrayAPL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         btsArrayAPL[2 * i] = srtArrayAPL[i] & 0xff;
         btsArrayAPL[2 * i + 1] = srtArrayAPL[i] >> 8;
     }

     return btsArrayAPL;
}
function shortArrayToInt8ByteArrayAPL(srtArrayAPL) {
     var btsArrayAPL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         btsArrayAPL[2 * i] = srtArrayAPL[i] & 0xff;
         btsArrayAPL[2 * i + 1] = srtArrayAPL[i] >> 8;
     }

     btsArrayAPL = new Int8Array(btsArrayAPL);

     return btsArrayAPL;
}
function shortArrayToHexString(arrAPL) {
     var rssAPL = "";
     for (var i = 0; i < arrAPL.length; i++) {
         rssAPL += nibbleToChar[(arrAPL[i] >> 4) & 0x0f] + nibbleToChar[arrAPL[i] & 0x0f] + nibbleToChar[(arrAPL[i] >> 12) & 0x0f] + nibbleToChar[(arrAPL[i] >> 8) & 0x0f];
     }
     return rssAPL;
}

function shortArrayToByteArrayAPL(srtArrayAPL) {
    var btArrayAPL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var i;
    for (i = 0; i < 16; i++) {
        btArrayAPL[2 * i] = srtArrayAPL[i] & 0xff;
        btArrayAPL[2 * i + 1] = srtArrayAPL[i] >> 8;
    }

    return btArrayAPL;
}

 function intToBytesAPL(xAPl, numBtsAPL, unsignedMaxBytesAPL, optBigEndianAPL) {
     var signedMaxAPLBts = Math.floor(unsignedMaxBytesAPL / 2);
     var negativeMax = (signedMaxAPLBts + 1) * -1;
     if (xAPl != Math.floor(xAPl) || xAPl < negativeMax || xAPl > unsignedMaxBytesAPL) {
         throw new Error(
             xAPl + ' is not a ' + (numBtsAPL * 8) + ' bit integer');
     }
     var bytes = [];
     var current;
     var numberType = xAPl >= 0 && xAPl <= signedMaxAPLBts ? 0 :
         xAPl > signedMaxAPLBts && xAPl <= unsignedMaxBytesAPL ? 1 : 2;
     if (numberType == 2) {
         xAPl = (xAPl * -1) - 1;
     }
     for (var i = 0; i < numBtsAPL; i++) {
         if (numberType == 2) {
             current = 255 - (xAPl % 256);
         } else {
             current = xAPl % 256;
         }

         if (optBigEndianAPL) {
             bytes.unshift(current);
         } else {
             bytes.push(current);
         }

         if (numberType == 1) {
             xAPl = Math.floor(xAPl / 256);
         } else {
             xAPl = xAPl >> 8;
         }
     }
     return bytes;

}

function int32ToBtsAPL(APLInit, optBigEndianAPL) {
     return intToBytesAPL(APLInit, 4, 4294967295, optBigEndianAPL);
}

function wordArrayToByteArrayExAPL(wrdArrAPL) {
    var wrds = wrdArrAPL.words;
    var sigBytes = wrdArrAPL.sigBytes;
    var u8APLStr = new Uint8Array(sigBytes);
    for (var i = 0; i < sigBytes; i++) {
        var byte = (wrds[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8APLStr[i]=byte;
    }

    return u8APLStr;
}

function byteArrayToWordArrayExAPL(u8arrAPLstring) {
    var lenWord = u8arrAPLstring.length;
    var wrds = [];
    for (var i = 0; i < lenWord; i++) {
        wrds[i >>> 2] |= (u8arrAPLstring[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(wrds, lenWord);
}

function byteArrayToBigIntegerAPL(btsAPL, optStartIndexAPL = 0) {
    var ind = checkBytesToIntInputAPL(btsAPL, 8, optStartIndexAPL);

    var value = new BigInteger("0", 10);

    var temp1, temp2;

    for (var i = 7; i >= 0; i--) {
        temp1 = value.multiply(new BigInteger("256", 10));
        temp2 = temp1.add(new BigInteger(btsAPL[optStartIndexAPL + i].toString(10), 10));
        value = temp2;
    }

    return value;
}

function isRsAccountAPL(accontIdAPL) {
    return (dispatch, getStore) => {
        const { account } = getStore();
        if (account.constants) return isRsAccImpAPL(accontIdAPL, getRsAccountRegexAPL(account.constants.accountPrefix));
    };
}

function getRsAccountRegexAPL(accPrefix, withoutSep) {
    if (withoutSep) {
        return new RegExp("^" + accPrefix + "-[A-Z0-9]{17}", "i");
    }
    return new RegExp(ACCOUNT_REGEX_STR, "i");
};

function isRsAccImpAPL(accountId, regularExpression) {
    regularExpression = new RegExp(regularExpression);
    return regularExpression.test(accountId);
}

function convertNumericToRSAccountFormatAPL(accIdAPL, prefix) {
    return (dispatch) => {
        const checkRsAccount = dispatch(isRsAccountAPL(accIdAPL));
        if (checkRsAccount) {
            return accIdAPL;
        } else {
            var address = new AplAddress(prefix);

            if (address.set(accIdAPL)) {
                return address.toString();
            } else {
                return "";
            }
        }
    }
}

function convertFromHex16APL(hexString) {
    var j;
    var hexesStrings = hexString.match(/.{1,4}/g) || [];
    var backWords = "";
    for (j = 0; j < hexesStrings.length; j++) {
        backWords += String.fromCharCode(parseInt(hexesStrings[j], 16));
    }

    return backWords;
};


function byteArrayToStringAPL(bytesArrays, optStartIndex, l) {
    if (l == 0) {
        return "";
    }

    if (optStartIndex && l) {
        var index = this.checkBytesToIntInputAPL(bytesArrays, parseInt(l, 10), parseInt(optStartIndex, 10));

        bytesArrays = bytesArrays.slice(optStartIndex, optStartIndex + l);
    }

    let r = String.fromCharCode.apply(null, bytesArrays);
    r = escape(r);
    r = decodeURIComponent(r)

    return r;
}

function addEllipsisAPL(strLength, l) {
    if (!strLength || strLength == "" || strLength.length <= l) {
        return strLength;
    }
    return strLength.substring(0, l) + "...";
};

function convertFromHex8APL(hexArrayWords) {
    var hexString = hexArrayWords.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hexString.length; i += 2) {
        str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
    }
    return str;
};

function  getUtf8BytesAPL(processingString) {
    var utf8 = unescape(encodeURIComponent(processingString));
    var arr = [];
    for (var i = 0; i < utf8.length; i++) {
        arr[i] = utf8.charCodeAt(i);
    }
    return arr;
};

function toEpochTimeAPL(currentWalletTime) {
    if (currentWalletTime == undefined) {
        currentWalletTime = new Date();
    }

    return Math.floor((currentWalletTime - 1385294400000) / 1000);
};

function simpleHashProceingAPL(stage1, stage2) {
    var shaHash256 = CryptoJS.algo.SHA256.create();
    shaHash256.update(byteArrayToWordArrayAPL(stage1));
    if (stage2) {
        shaHash256.update(byteArrayToWordArrayAPL(stage2));
    }
    var hash = shaHash256.finalize();
    return wordArrayToByteArrayImplAPL(hash, false);
}

export function signBytesArrayAPL(messageToSign, sp) {
    var messageBytes = hexStringToByteArray(messageToSign);
    var secretPhraseBytes = hexStringToByteArray(sp);

    var digest = simpleHashProceingAPL(secretPhraseBytes);
    var s = curve25519.keygen(digest).s;
    var m = simpleHashProceingAPL(messageBytes);
    var x = simpleHashProceingAPL(m, s);
    var y = curve25519.keygen(x).p;
    var h = simpleHashProceingAPL(m, y);
    var v = curve25519.sign(h, x, s);
    return byteArrayToHexString(v.concat(h));
};

function generateTokenAPL(messageToGenerate, sp) {
    return async () => {
        var messageBytes = getUtf8BytesAPL(messageToGenerate);
        var pubKeyBytes = hexStringToByteArray(await crypto.getPublicKeyAPL(stringToHexStringAPL(sp)));
        var token = pubKeyBytes;

        var tsb = [];
        var ts = toEpochTimeAPL();
        tsb[0] = ts & 0xFF;
        tsb[1] = (ts >> 8) & 0xFF;
        tsb[2] = (ts >> 16) & 0xFF;
        tsb[3] = (ts >> 24) & 0xFF;

        messageBytes = messageBytes.concat(pubKeyBytes, tsb);
        token = token.concat(tsb, hexStringToByteArray(
            signBytesArrayAPL(byteArrayToHexString(messageBytes),
                sp !== undefined ? stringToHexStringAPL(sp) : undefined)));

        var buf = "";
        for (var ptr = 0; ptr < 100; ptr += 5) {
            var nbr = [];
            nbr[0] = token[ptr] & 0xFF;
            nbr[1] = token[ptr+1] & 0xFF;
            nbr[2] = token[ptr+2] & 0xFF;
            nbr[3] = token[ptr+3] & 0xFF;
            nbr[4] = token[ptr+4] & 0xFF;
            var number = byteArrayToBigIntegerHashAPL(nbr);
            if (number < 32) {
                buf += "0000000";
            } else if (number < 1024) {
                buf += "000000";
            } else if (number < 32768) {
                buf += "00000";
            } else if (number < 1048576) {
                buf += "0000";
            } else if (number < 33554432) {
                buf += "000";
            } else if (number < 1073741824) {
                buf += "00";
            } else if (number < 34359738368) {
                buf += "0";
            }
            buf +=number.toString(32);
        }
        return buf;
    }
};

export function convertToToken(value, decimal = 8, useGrouping = false) {
    const valueBN = new BigInteger(value.toString());
    const pointsBN = new BigInteger(Math.pow(10, decimal).toString());
    return (valueBN.divide(pointsBN)).toLocaleString('en', {
        useGrouping
    })
}

export function convertRate(value, useGrouping = false) {
  const points = Math.pow(10, 8);
  return (value / points).toLocaleString('en', {
    useGrouping,
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })
}

export function convertToATM(value, decimal = 8, useGrouping = false) {
    const points = Math.pow(10, decimal).toString();
    return  (value * points).toLocaleString('en', {
        useGrouping
    })
}

export function convertHexToUint(value, base = 16) {
    let convertedValue = value.toString()
    if(convertedValue.startsWith('0x')){
        convertedValue = convertedValue.substr(2)
    }
    const valueBN = new BigInteger(convertedValue, base);

    return  valueBN.toString()
};

export default {
    stringToByteArray,
    wordArrayToByteArrayImplAPL: wordArrayToByteArrayImplAPL,
    byteArrayToWordArrayAPL: byteArrayToWordArrayAPL,
    byteArrayToHexString,
    shortArrayToHexString,
    byteArrayToShortArray,
    hexStringToInt8ByteArray: hexStringToInt8ByteArrayAPL,
    hexStringToByteArray,
    byteArrayToBigIntegerAPL: byteArrayToBigIntegerAPL,
    stringToHexStringAPL: stringToHexStringAPL,
    convertNumericToRSAccountFormatAPL: convertNumericToRSAccountFormatAPL,
    wordArrayToByteArrayAPL: wordArrayToByteArrayAPL,
    hexStringToStringAPL: hexStringToStringAPL,
    convertFromHex16APL: convertFromHex16APL,
    addEllipsisAPL: addEllipsisAPL,
    convertFromHex8APL: convertFromHex8APL,
    byteArrayToStringAPL: byteArrayToStringAPL,
    shortArrayToByteArrayAPL: shortArrayToByteArrayAPL,
    generateTokenAPL: generateTokenAPL
}
