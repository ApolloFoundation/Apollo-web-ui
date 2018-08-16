import CryptoJS from 'crypto-js';
import jsbn from 'jsbn';
import AplAddress from './util/apladres';
import convertString from 'convert-string';
import {login} from "../modules/account";

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


function stringToByteArray (str) {
    str = unescape(encodeURIComponent(str)); //temporary

    var bytes = new Array(str.length);
    for (var i = 0; i < str.length; ++i)
        bytes[i] = str.charCodeAt(i);

    return bytes;
};
function wordArrayToByteArrayImpl (wordArray, isFirstByteHasSign) {
    var len = wordArray.words.length;
    if (len == 0) {
        return new Array(0);
    }
    if (wordArray.sigBytes < 0) {
        wordArray.sigBytes = wordArray.sigBytes*-1
    }

    var byteArray = new Array(wordArray.sigBytes);
    var offset = 0,
        word, i;
    for (i = 0; i < len - 1; i++) {
        word = wordArray.words[i];
        byteArray[offset++] = isFirstByteHasSign ? word >> 24 : (word >> 24) & 0xff;
        byteArray[offset++] = (word >> 16) & 0xff;
        byteArray[offset++] = (word >> 8) & 0xff;
        byteArray[offset++] = word & 0xff;
    }
    word = wordArray.words[len - 1];
    byteArray[offset++] = isFirstByteHasSign ? word >> 24 : (word >> 24) & 0xff;
    if (wordArray.sigBytes % 4 == 0) {
        byteArray[offset++] = (word >> 16) & 0xff;
        byteArray[offset++] = (word >> 8) & 0xff;
        byteArray[offset++] = word & 0xff;
    }
    if (wordArray.sigBytes % 4 > 1) {
        byteArray[offset++] = (word >> 16) & 0xff;
    }
    if (wordArray.sigBytes % 4 > 2) {
        byteArray[offset++] = (word >> 8) & 0xff;
    }
    return byteArray;
};
function byteArrayToWordArray(byteArray) {
    var i = 0,
        offset = 0,
        word = 0,
        len = byteArray.length;
    var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));

    while (i < (len - (len % 4))) {
        words[offset++] = (byteArray[i++] << 24) | (byteArray[i++] << 16) | (byteArray[i++] << 8) | (byteArray[i++]);
    }
    if (len % 4 != 0) {
        word = byteArray[i++] << 24;
        if (len % 4 > 1) {
            word = word | byteArray[i++] << 16;
        }
        if (len % 4 > 2) {
            word = word | byteArray[i++] << 8;
        }
        words[offset] = word;
    }
    var wordArray = new Object();
    wordArray.sigBytes = len;
    wordArray.words = words;

    return wordArray;
}
function byteArrayToHexString(bytes) {
    let str = '';
    for (var i = 0; i < bytes.length; ++i) {
        if (bytes[i] < 0) {
            bytes[i] += 256;
        }
        str += nibbleToChar[bytes[i] >> 4] + nibbleToChar[bytes[i] & 0x0F];
    }

    return str;
}
function byteArrayToHexString(bytes) {
     var str = '';
     for (var i = 0; i < bytes.length; ++i) {
         if (bytes[i] < 0) {
             bytes[i] += 256;
         }
         str += nibbleToChar[bytes[i] >> 4] + nibbleToChar[bytes[i] & 0x0F];
     }

     return str;
}
function stringToByteArray(str) {
     str = unescape(encodeURIComponent(str)); //temporary

     var bytes = new Array(str.length);
     for (var i = 0; i < str.length; ++i)
         bytes[i] = str.charCodeAt(i);

     return bytes;
}
function hexStringToByteArray(str) {
     var bytes = [];
     var i = 0;
     if (0 !== str.length % 2) {
         console.log(str);
         bytes.push(charToNibble[str.charAt(0)]);
         ++i;
     }

     for (; i < str.length - 1; i += 2)
         bytes.push((charToNibble[str.charAt(i)] << 4) + charToNibble[str.charAt(i + 1)]);

     return bytes;
}
function hexStringToInt8ByteArray(str) {
     var bytes = [];
     var i = 0;
     if (0 !== str.length % 2) {
         bytes.push(charToNibble[str.charAt(0)]);
         ++i;
     }

     for (; i < str.length - 1; i += 2)
         bytes.push((charToNibble[str.charAt(i)] << 4) + charToNibble[str.charAt(i + 1)]);

     var bytes = new Int8Array(bytes);

     return bytes;
}
function stringToHexString(str) {
     return this.byteArrayToHexString(this.stringToByteArray(str));
}
function hexStringToString(hex) {
     return byteArrayToString(hexStringToByteArray(hex));
}
function hexStringToInt8ByteArray(str) {
     var bytes = [];
     var i = 0;
     if (0 !== str.length % 2) {
         bytes.push(charToNibble[str.charAt(0)]);
         ++i;
     }

     for (; i < str.length - 1; i += 2)
         bytes.push((charToNibble[str.charAt(i)] << 4) + charToNibble[str.charAt(i + 1)]);

     var bytes = new Int8Array(bytes);

     return bytes;
 }
function checkBytesToIntInput(bytes, numBytes, opt_startIndex) {
     var startIndex = opt_startIndex || 0;
     if (startIndex < 0) {
         throw new Error('Start index should not be negative');
     }

     if (bytes.length < startIndex + numBytes) {
         throw new Error('Need at least ' + (numBytes) + ' bytes to convert to an integer');
     }
     return startIndex;
}
function byteArrayToSignedShort(bytes, opt_startIndex) {
     var index = this.checkBytesToIntInput(bytes, 2, opt_startIndex);
     var value = bytes[index];
     value += bytes[index + 1] << 8;
     return value;
}

 // create a wordArray that is Big-Endian
function byteArrayToWordArray(byteArray) {
     var i = 0,
         offset = 0,
         word = 0,
         len = byteArray.length;
     var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));

     while (i < (len - (len % 4))) {
         words[offset++] = (byteArray[i++] << 24) | (byteArray[i++] << 16) | (byteArray[i++] << 8) | (byteArray[i++]);
     }
     if (len % 4 != 0) {
         word = byteArray[i++] << 24;
         if (len % 4 > 1) {
             word = word | byteArray[i++] << 16;
         }
         if (len % 4 > 2) {
             word = word | byteArray[i++] << 8;
         }
         words[offset] = word;
     }
     var wordArray = new Object();
     wordArray.sigBytes = len;
     wordArray.words = words;

     return wordArray;
 }
 // assumes wordArray is Big-Endian
function wordArrayToByteArray(wordArray) {
    return wordArrayToByteArrayImpl(wordArray, true);
}
function byteArrayToString(bytes, opt_startIndex, length) {
     if (length == 0) {
         return "";
     }

     if (opt_startIndex && length) {
         var index = this.checkBytesToIntInput(bytes, parseInt(length, 10), parseInt(opt_startIndex, 10));

         bytes = bytes.slice(opt_startIndex, opt_startIndex + length);
     }

     return decodeURIComponent(escape(String.fromCharCode.apply(null, bytes)));
 }
function byteArrayToShortArray(byteArray) {
     var shortArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         shortArray[i] = byteArray[i * 2] | byteArray[i * 2 + 1] << 8;
     }
     return shortArray;
}
function shortArrayToByteArray(shortArray) {
     var byteArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         byteArray[2 * i] = shortArray[i] & 0xff;
         byteArray[2 * i + 1] = shortArray[i] >> 8;
     }

     return byteArray;
}
function shortArrayToInt8ByteArray(shortArray) {
     var byteArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     var i;
     for (i = 0; i < 16; i++) {
         byteArray[2 * i] = shortArray[i] & 0xff;
         byteArray[2 * i + 1] = shortArray[i] >> 8;
     }

     byteArray = new Int8Array(byteArray);

     return byteArray;
}
function shortArrayToHexString(ary) {
     var res = "";
     for (var i = 0; i < ary.length; i++) {
         res += nibbleToChar[(ary[i] >> 4) & 0x0f] + nibbleToChar[ary[i] & 0x0f] + nibbleToChar[(ary[i] >> 12) & 0x0f] + nibbleToChar[(ary[i] >> 8) & 0x0f];
     }
     return res;
}

function shortArrayToByteArray(shortArray) {
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var i;
    for (i = 0; i < 16; i++) {
        byteArray[2 * i] = shortArray[i] & 0xff;
        byteArray[2 * i + 1] = shortArray[i] >> 8;
    }

    return byteArray;
}
 /**
  * Produces an array of the specified number of bytes to represent the integer
  * value. Default output encodes ints in little endian format. Handles signed
  * as well as unsigned integers. Due to limitations in JavaScript's number
  * format, x cannot be a true 64 bit integer (8 bytes).
  */
 function intToBytes_(x, numBytes, unsignedMax, opt_bigEndian) {
     var signedMax = Math.floor(unsignedMax / 2);
     var negativeMax = (signedMax + 1) * -1;
     if (x != Math.floor(x) || x < negativeMax || x > unsignedMax) {
         throw new Error(
             x + ' is not a ' + (numBytes * 8) + ' bit integer');
     }
     var bytes = [];
     var current;
     // Number type 0 is in the positive int range, 1 is larger than signed int,
     // and 2 is negative int.
     var numberType = x >= 0 && x <= signedMax ? 0 :
         x > signedMax && x <= unsignedMax ? 1 : 2;
     if (numberType == 2) {
         x = (x * -1) - 1;
     }
     for (var i = 0; i < numBytes; i++) {
         if (numberType == 2) {
             current = 255 - (x % 256);
         } else {
             current = x % 256;
         }

         if (opt_bigEndian) {
             bytes.unshift(current);
         } else {
             bytes.push(current);
         }

         if (numberType == 1) {
             x = Math.floor(x / 256);
         } else {
             x = x >> 8;
         }
     }
     return bytes;

}
function int32ToBytes(x, opt_bigEndian) {
     return intToBytes_(x, 4, 4294967295, opt_bigEndian);
}
 /**
  * Based on https://groups.google.com/d/msg/crypto-js/TOb92tcJlU0/Eq7VZ5tpi-QJ
  * Converts a word array to a Uint8Array.
  * @param {WordArray} wordArray The word array.
  * @return {Uint8Array} The Uint8Array.
  */
function wordArrayToByteArrayEx(wordArray) {
    // Shortcuts
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    // Convert
    var u8 = new Uint8Array(sigBytes);
    for (var i = 0; i < sigBytes; i++) {
        var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8[i]=byte;
    }

    return u8;
}
 /**
  * Converts a Uint8Array to a word array.
  * @param {string} u8Str The Uint8Array.
  * @return {WordArray} The word array.
  */
function byteArrayToWordArrayEx(u8arr) {
    // Shortcut
    var len = u8arr.length;
    // Convert
    var words = [];
    for (var i = 0; i < len; i++) {
        words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
}
function byteArrayToBigInteger(bytes, opt_startIndex = 0) {
    var index = checkBytesToIntInput(bytes, 8, opt_startIndex);

    var value = new BigInteger("0", 10);

    var temp1, temp2;

    for (var i = 7; i >= 0; i--) {
        temp1 = value.multiply(new BigInteger("256", 10));
        temp2 = temp1.add(new BigInteger(bytes[opt_startIndex + i].toString(10), 10));
        value = temp2;
    }

    return value;
}

function isRsAccount(accountId) {
    return (dispatch, getStore) => {
        const { account } = getStore();
        return isRsAccountImpl(accountId, getRsAccountRegex(account.constants.accountPrefix));
    };
    // return isRsAccountImpl(account, NRS.constants.ACCOUNT_RS_MATCH ? NRS.constants.ACCOUNT_RS_MATCH : NRS.getRsAccountRegex("APL"));
}

function getRsAccountRegex(accountPrefix, withoutSeparator) {
    if (withoutSeparator) {
        return new RegExp("^" + accountPrefix + "-[A-Z0-9]{17}", "i");
    }
    return new RegExp(ACCOUNT_REGEX_STR, "i");
};

function isRsAccountImpl(accountId, regex) {
    regex = new RegExp(regex);
    return regex.test(accountId);
}

function convertNumericToRSAccountFormat(accountId) {
    return (dispatch) => {
        const checkRsAccount = dispatch(isRsAccount(accountId));
        if (checkRsAccount) {
            return accountId;
        } else {
            var address = new AplAddress();

            if (address.set(accountId)) {
                return address.toString();
            } else {
                return "";
            }
        }
    }
}

function convertFromHex16(hex) {
    var j;
    var hexes = hex.match(/.{1,4}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
};


function byteArrayToString(bytes, opt_startIndex, length) {
    if (length == 0) {
        return "";
    }

    if (opt_startIndex && length) {
        var index = this.checkBytesToIntInput(bytes, parseInt(length, 10), parseInt(opt_startIndex, 10));

        bytes = bytes.slice(opt_startIndex, opt_startIndex + length);
    }

    let result = String.fromCharCode.apply(null, bytes);
    result = escape(result);
    result = decodeURIComponent(result)

    return result;
}

function addEllipsis(str, length) {
    if (!str || str == "" || str.length <= length) {
        return str;
    }
    return str.substring(0, length) + "...";
};

function convertFromHex8(hex) {
    var hexStr = hex.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hexStr.length; i += 2) {
        str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    }
    return str;
};

export default {
    stringToByteArray,
    wordArrayToByteArrayImpl,
    byteArrayToWordArray,
    byteArrayToHexString,
    shortArrayToHexString,
    byteArrayToShortArray,
    hexStringToInt8ByteArray,
    hexStringToByteArray,
    byteArrayToBigInteger,
    stringToHexString,
    convertNumericToRSAccountFormat,
    wordArrayToByteArray,
    hexStringToString,
    convertFromHex16,
    addEllipsis,
    convertFromHex8,
    byteArrayToString,
    shortArrayToByteArray
}
