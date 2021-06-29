/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
import config from '../../config';
import axios from 'axios';
import { getSECCurveByName } from '../../vendors/fb-crypto/sec';
import { ECAsymCrypto }      from '../../vendors/fb-crypto/ec_crypto';
import { ECPointFp }         from '../../vendors/fb-crypto/ec';
import converters from "../../helpers/converters";
import sha256 from 'js-sha256';
import queryString from "query-string";

var BigInteger = require('jsbn').BigInteger;

var SecureRandom = require('../../vendors/fb-crypto/rng').SecureRandom;


export const getElGamalPublicKey = () => {
    const data = {
        requestType: 'getElGamalPublicKey'
    };
    return axios.post(config.api.serverUrl + queryString.stringify(data))
        .then(({data}) => {
            return data;
        })
}

export const getForgingPublicKey = () => {
  const data = {
      requestType: 'getForgingPublicKey'
  };
  return axios.post(config.api.serverUrl + queryString.stringify(data))
      .then(({data}) => {
          return data;
      })
}

const getZeros = (value) => {
    return !!(131 - value.length) ? new Array(131 - value.length).fill('0').reduce((a, b) => {return a + b}) : '';
}

export const processElGamalEncryption = async (secretPhrase, reqType) => {
    const KEY = new Buffer(crypto.randomBytes(32), 'utf8');
    const aesCipher = aes256gcm(KEY);
    const [encrypted, iv, authTag] = aesCipher.encrypt(secretPhrase);

    const c = getSECCurveByName( "secp521r1" );
    const {ElGamalX, ElGamalY} = !reqType ? await getElGamalPublicKey() : await getForgingPublicKey();

    const EcCryptoCtx = new ECAsymCrypto ( c, new SecureRandom() );

    const bx = new BigInteger(ElGamalX, 16);
    const by = new BigInteger(ElGamalY, 16);;

    var cv = c.getCurve();
    var _publicKey = new ECPointFp(cv, cv.fromBigInteger( bx ), cv.fromBigInteger( by ) );
    EcCryptoCtx.SetPublic(_publicKey)

    var pub = EcCryptoCtx.GetPublic();
    const Pub_x = pub.getX().toBigInteger();
    const Pub_y = pub.getY().toBigInteger();

    EcCryptoCtx.SetPlainText(new BigInteger(converters.byteArrayToHexString(KEY), 16));
    var plain = EcCryptoCtx.GetPlainText();

    EcCryptoCtx.Encrypt();

    var m1 = EcCryptoCtx.GetCipherTextM1();
    var m2 = EcCryptoCtx.GetCipherTextM2();

    let m1X = m1.getX().toBigInteger().toString(16);
    let m1Y = m1.getY().toBigInteger().toString(16);

    m1X = getZeros(m1X) + m1X;
    m1Y = getZeros(m1Y) + m1Y;

    m2 = m2.toString(16)
    m2 = getZeros(m2) + m2

    const ElGamalCryptogram = m1X + m1Y + m2;
    const ivEncryptedAuthTag = converters.byteArrayToHexString(iv) + encrypted + converters.byteArrayToHexString(authTag);
    const shaKey = sha256(secretPhrase + KEY);

    return ivEncryptedAuthTag + ElGamalCryptogram + shaKey;
}

export function elGamalPassPhraseRequestWrapper ({passphrase, ...requestData}) {
    return processElGamalEncryption(passphrase).then(pass => ({
        ...requestData,
        passphrase: pass
    }));
} 

const buffer = require('buffer');
const crypto = require('crypto');

function aes256gcm (key) {
  const ALGO = 'aes-256-gcm';

  const encrypt = (str) => {
    const iv = new Buffer(crypto.randomBytes(16), 'utf8');
    const cipher = crypto.createCipheriv(ALGO, key, iv);

    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');

    return [enc, iv, cipher.getAuthTag()];
  };

  return {
    encrypt,
  };
};