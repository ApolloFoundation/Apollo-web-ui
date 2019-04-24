import { ECAsymCrypto } from './fb-crypto/ec_crypto';
import { SecureRandom } from "./fb-crypto/rng";
import { getSECCurveByName } from './fb-crypto/sec';

const rng = new SecureRandom();
const c = getSECCurveByName( "secp521r1" );

const EcCryptoCtx = new ECAsymCrypto ( c, rng );

export const lGamaleProcessor = () => {

}

function gen_priv()
{
    EcCryptoCtx.GeneratePrivate();
    var pri = EcCryptoCtx.GetPrivate();
    document.ecdhtest.Pri.value = pri.toString(16);

}

function calc_pub()
{
    EcCryptoCtx.CalculatePublic();
    var pub = EcCryptoCtx.GetPublic();

    return pub;
}

function gen_plain()
{
    EcCryptoCtx.GenPlainText();
    var plain = EcCryptoCtx.GetPlainText();
    document.ecdhtest.Plain.value = plain.toString(16);
}

function encrypt()
{
    EcCryptoCtx.Encrypt();
    var m1 = EcCryptoCtx.GetCipherTextM1();
    var m2 = EcCryptoCtx.GetCipherTextM2();
    document.ecdhtest.M1_x.value = m1.getX().toBigInteger().toString(16) ;
    document.ecdhtest.M1_y.value = m1.getY().toBigInteger().toString(16) ;
    document.ecdhtest.M2.value = m2.toString(16) ;
}

function decrypt()
{
    EcCryptoCtx.Decrypt();
    //var restored = EcCryptoCtx.GetRestoredText();
    document.ecdhtest.Restored.value = EcCryptoCtx.GetRestoredText().toString(16); //"Fucking shit";//EcCryptoCtx.GetRestoredText().ToString(16); // restored.ToString(16);
//    var m1 = EcCryptoCtx.GetCipherTextM1();
//     var m2 = EcCryptoCtx.GetCipherTextM2();
//     document.ecdhtest.M1_x.value = m1.getX().toBigInteger().toString(16) ;
//     document.ecdhtest.M1_y.value = m1.getY().toBigInteger().toString(16) ;
//     document.ecdhtest.M2.value = m2.toString(16) ;

    // document.write("rest: " + EcCryptoCtx.GetRestoredText().toString(16) + "<br>" );

}

function generateSignature()
{
    EcCryptoCtx.GenerateSignature();
    document.ecdhtest.signature_r.value = EcCryptoCtx.GetSignatureR().toString(16);
    document.ecdhtest.signature_s.value = EcCryptoCtx.GetSignatureS().toString(16);
}



function generateSignatureJson()
{
    var jsonHexStrPrivate = EcCryptoCtx.GetPrivateHex();
    var hash =  new String(sha256_digest("any message"));
    var signature_ = EcCryptoCtx.GenerateSignatureParametric(  hash, jsonHexStrPrivate )
    document.ecdhtest.signature_json.value =   signature_;
}

function verifySignature()
{

    var rx = EcCryptoCtx.VerifySignature();
    if (rx) document.ecdhtest.sig_res.value = "true"; else document.ecdhtest.sig_res.value = "false";

}

function verifySignatureJson()
{
    var jsonHexStrPublic = EcCryptoCtx.GetPublicHex();
    var hash =  new String(sha256_digest("any message"));
    var signature_ =  ecdhtest.signature_json.value;
    var rx = EcCryptoCtx.VerifySignatureParametric( hash, signature_, jsonHexStrPublic );

    if (rx) document.ecdhtest.sig_res_json.value = "true"; else document.ecdhtest.sig_res_json.value = "false";
}


function hash()
{
    var vx = document.ecdhtest.msg.value;
    var hash =  new String(sha256_digest(vx));
    document.ecdhtest.hashvec.value = hash;
}

