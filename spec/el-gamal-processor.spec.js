var SecureRandom = require('jsbn').SecureRandom;
const { getSECCurveByName } = require('./../src/vendors/fb-crypto/sec');
const { ECAsymCrypto } = require('./../src/vendors/fb-crypto/ec_crypto');
const {getElGamalPublicKey} = require('./../src/actions/crypto');

describe("Calculate public key test", () => {
    it("contains spec with an expectation", async () => {
        const rng = new SecureRandom(1);
        const c = getSECCurveByName( "secp521r1" );
        const elGamalPublicKey = await getElGamalPublicKey();

        console.log(elGamalPublicKey);
        const EcCryptoCtx = new ECAsymCrypto ( c, rng );

        EcCryptoCtx.GeneratePrivate(EcCryptoCtx.ec);

        // // Private key
        const pri = EcCryptoCtx.GetPrivate(EcCryptoCtx.ec);
        const Pri = pri.toString(16);
        console.log('Private Key : ', Pri)

        EcCryptoCtx.CalculatePublic();
        var pub = EcCryptoCtx.GetPublic();
        const Pub_x = pub.getX().toBigInteger();
        const Pub_y = pub.getY().toBigInteger();

        console.log('Pub_x : ', Pub_x.toString(16));
        console.log('Pub_y : ', Pub_y.toString(16));

        EcCryptoCtx.GenPlainText();
        var plain = EcCryptoCtx.GetPlainText();
        console.log('plainText: ', plain.toString(16));

        EcCryptoCtx.Encrypt();

        var m1 = EcCryptoCtx.GetCipherTextM1();
        var m2 = EcCryptoCtx.GetCipherTextM2();
        console.log('m1.x:', m1.getX().toBigInteger().toString(16));
        console.log('m1.y:', m1.getY().toBigInteger().toString(16));

        console.log('m2: ', m2.toString(16) );

        EcCryptoCtx.Decrypt();
        //var restored = EcCryptoCtx.GetRestoredText();
        console.log('restored: ', EcCryptoCtx.GetRestoredText().toString(16) );

    });
});
