// var BigInteger  = require('big-integer');

var BigInteger = require('jsbn').BigInteger;

const {ECPointFp} = require('./ec');
// const {SecureRandom, rng_seed_time, rng_get_byte} = require('./rng');

// const {SecureRandom, rng_seed_time, rng_get_byte} = require('./rng');
// var SecureRandom = require('jsbn').SecureRandom;
// var rng_seed_time = require('jsbn').rng_seed_time;
// var rng_get_byte = require('jsbn').rng_seed_time;

const {SecureRandom, rng_seed_time, rng_get_byte} = require('jsbn');


BigInteger.prototype.ONE = new BigInteger("1",16);

// ----------------
// ECFieldElementFp

// constructor

var rng = new SecureRandom();

function ECAsymCrypto( _ec, _rng ) {
    this.ec = _ec; // new ECCurveFp( ec );
    this.rng = rng;
    this.privateKey = new BigInteger();
    this.publicKey = this.ec.getG();
    this.M1 = this.ec.getG();
    this.M2 = new BigInteger();
    this.plainText  = new BigInteger();
    // this.cipherText = new BigInteger();
    this.restoredText = new BigInteger();
    this.signature_r = new BigInteger();
    this.signature_s = new BigInteger();
}

function ecGetEc()
{
    return this.ec;
}

function ecSetEc( _ec )
{
    this.ec = _ec;
}


function ecGetPrivate()
{
    return this.privateKey;
}

function ecSetPrivate( _privateKey )
{
    this.privateKey = _privateKey;
}

function ecGetPrivateHex()
{
    var priObj = new Object();
    priObj.type = "pri";
    priObj.val  =  new String(this.privateKey.toString(16));
    return JSON.stringify (priObj);
}


function ecPickRand()
{
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    return r.mod(n1).add(BigInteger.ONE);
}

function ecGeneratePrivate()
{
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    // var n1 = n.subtract(1);
    // var r = BigInteger.randBetween('2', '2e255'); // Randomizer
    var r = new BigInteger(n.bitLength(), rng);


    // this.privateKey = r.mod(n1).add(1);
    this.privateKey = r.mod(n);
    // console.log("pk: ", this.privateKey.toString(16));

}

function ecCalculatePublic () {
    var Base = this.ec.getG();
    // console.log(this.ec)
    // console.log('Base.multiply(this.privateKey) : ', Base.multiply(this.privateKey))

    // console.log(Base.constructor.name)
    this.publicKey = Base.multiply(this.privateKey);
}

function ecSetPublic ( _publicKey ) {
    this.publicKey = _publicKey;
}

function ecGetPublic () {
    return this.publicKey;
}

function ecGetPublicHex () {
    var pubObj = new Object();
    pubObj.type = "pub";
    pubObj.x = this.publicKey.getX().toBigInteger().toString(16);
    pubObj.y = this.publicKey.getY().toBigInteger().toString(16);
    return JSON.stringify( pubObj );
}


function ecGetPlainText()
{
    return this.plainText;
}

function ecSetPlainText( _plainText)
{
    this.plainText = _plainText;
}

function ecGenPlainText( )
{

    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    this.plainText = r.mod(n1).add(BigInteger.ONE);
}


function ecGetCipherTextM1()
{
    return this.M1;
}

function ecSetCipherTextM1( _M1)
{
    this.M1 = _M1;
}


function ecGetCipherTextM2()
{
    return this.M2;
}

function ecSetCipherTextM2( _M2)
{
    this.M2 = _M2;
}

function ecGetRestoredText()
{
    return this.restoredText;
}

function ecSetSignatureR( _R )
{
    this.signature_r = _R;
}

function ecGetSignatureR()
{
    return this.signature_r;
}

function ecSetSignatureS( _S )
{
    this.signature_s = _S;
}

function ecGetSignatureS()
{
    return this.signature_s;
}


function ecEncrypt()
{
//     document.write("encrypt: <br>");
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    var K = r.mod(n1).add(BigInteger.ONE);

//     document.write("rand.K: " + K.toString(16) + "<br>" );

    // var _q = this.ec.getQ();
    var Base = this.ec.getG();

    // console.log(Base)

    var CB = Base.multiply(K);
    var CS = this.publicKey.multiply(K);
    var cx = CS.getX().toBigInteger();


    // console.log(Base)


    var qx = new BigInteger( n );
    // secure message...
    this.M1 = CB;
    // M2 = new BigInteger();//plainMessage);
    // this.M2 =  plainMessage.multiply( cx ).mod( _q );

    this.M2 =  this.plainText.multiply( cx ).mod( n );

}

function ecDecrypt()
{
    // decrypt
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);

    // var _q = this.ec.getCurve().getN();
    var CT = this.M1.multiply( this.privateKey );
    var c_ = CT.getX().toBigInteger();
    var c_inv_ = c_.modInverse( n );
    this.restoredText = this.M2.multiply(c_inv_).mod( n );
    // document.write( "Restored plain: " + this.restoredText.toString() + "<br>" );
}

function ecGenerateSignature()
{
    // generating K
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    var K = r.mod(n1).add(BigInteger.ONE);

    var Base = this.ec.getG();

    var CB = Base.multiply(K);
    var cx = CB.getX().toBigInteger();

    this.signature_r = cx.mod( n );

    var k_inv = K.modInverse( n );

    var tmp = this.privateKey.multiply(this.signature_r).mod(n);
    tmp = tmp.add( this.plainText ).mod(n);
    this.signature_s = tmp.multiply(k_inv).mod(n);
}

function PrivFromJsonHex( JsonHexValue )
{

    var priObj = JSON.parse( JsonHexValue );
    var type = priObj.type;
    if (type == "pri") {
        return new BigInteger( priObj.val, 16 );
    }
    return BigInteger( -1 );
}

function ecGenerateSignatureWithParams( shamsg, privkey )
{


    // generating K
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    var K = r.mod(n1).add(BigInteger.ONE);

    var Base = this.ec.getG();

    var CB = Base.multiply(K);
    var cx = CB.getX().toBigInteger();

    var sig_r = cx.mod( n );

    var k_inv = K.modInverse( n );
    var hashVec = new BigInteger(  shamsg , 16 );
//    document.write("F,Sha: " + hashVec.toString( 16 ) + "<br>");
//     document.write("F,pri: " + privkey + "<br>");

    var _priv = PrivFromJsonHex( privkey );

    //document.write("F,pr1: " + _priv.toString(16) + "<br>");

    var tmp = _priv.multiply(sig_r).mod(n);
    tmp = tmp.add( hashVec ).mod(n);
    var sig_s = tmp.multiply(k_inv).mod(n);

    // Generating JSON string...
    var sigObj = new Object();// [ "r:", sig_r.toString(16), "s:", sig_s.toString(16) ];
    sigObj.type = "sig";
    sigObj.r = sig_r.toString(16);
    sigObj.s = sig_s.toString(16);

    // document.write("signature: " + JSON.stringify( sigObj ) + "<br>");

    return JSON.stringify( sigObj );

}


function ecVerifySignature()
{
    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);

    var w = this.signature_s.modInverse( n );
    var u1 = this.plainText.multiply(w).mod(n);
    var u2 = this.signature_r.multiply(w).mod(n);

    var Base = this.ec.getG();
    // var CB = Base.multiply(K);

    var _X1 = Base.multiply( u1 );
    var _X2 = this.publicKey.multiply( u2 );
    var X = _X1.add(_X2);

    var x1 = X.getX().toBigInteger().mod(n);

    // document.write("x1: " + x1.toString(16) + "<br>" );

    return x1.equals( this.signature_r );
}



function ecVerifySignatureWithParams( shamsg, signature, pubkey)
{
//     document.write("fucking shit!" );

    var n = this.ec.getN();  // new BigInteger(document.ecdhtest.n.value);
    // decomposite the signature

    var pubObj = JSON.parse(pubkey);
    // check the type
    // ...
    var pub_x_str = pubObj.x;
    var pub_y_str = pubObj.y;
    // creating ecpoint

//    document.write("pub.x: " + pub_x_str + "<br>" );
//    document.write("pub.y: " + pub_y_str + "<br>" );

    var bx = new BigInteger(pub_x_str, 16);
    var by = new BigInteger(pub_y_str, 16);

    var cv = this.ec.getCurve();

    var _publicKey = new ECPointFp(cv, cv.fromBigInteger( bx ), cv.fromBigInteger( by ) );

    //document.write("pub.x: " + _publicKey.getX().toBigInteger().toString(16) + "<br>" );
    //document.write("pub.y: " + _publicKey.getY().toBigInteger().toString(16) + "<br>" );

    var sigObj = JSON.parse( signature );

    // check the type..

    var sig_r_str = sigObj.r;
    var sig_s_str = sigObj.s;

    //document.write("r: " + sig_r_str + "<br>" );
    //document.write("s: " + sig_s_str + "<br>" );

    var sr = new BigInteger(sig_r_str, 16);
    var ss = new BigInteger(sig_s_str, 16);
    var hash = new BigInteger( shamsg, 16 );


    var w = ss.modInverse( n );
    var u1 = hash.multiply(w).mod(n);
    var u2 = sr.multiply(w).mod(n);

    var Base = this.ec.getG();
    // var CB = Base.multiply(K);

    var _X1 = Base.multiply( u1 );
    var _X2 = _publicKey.multiply( u2 );
    var X = _X1.add(_X2);

    var x1 = X.getX().toBigInteger().mod(n);

    //document.write("x1: " + x1.toString(16) + "<br>" );

    return x1.equals( sr );
}



ECAsymCrypto.prototype.GetEc = ecGetEc;
ECAsymCrypto.prototype.SetEc = ecSetEc;

ECAsymCrypto.prototype.GetPrivate = ecGetPrivate;
ECAsymCrypto.prototype.GetPrivateHex = ecGetPrivateHex;
ECAsymCrypto.prototype.SetPrivate = ecSetPrivate;
ECAsymCrypto.prototype.PickRand = ecPickRand;
ECAsymCrypto.prototype.GeneratePrivate = ecGeneratePrivate;
ECAsymCrypto.prototype.CalculatePublic = ecCalculatePublic;

ECAsymCrypto.prototype.SetPublic = ecSetPublic;
ECAsymCrypto.prototype.GetPublic = ecGetPublic;
ECAsymCrypto.prototype.GetPublicHex = ecGetPublicHex;


ECAsymCrypto.prototype.SetPlainText = ecSetPlainText;
ECAsymCrypto.prototype.GetPlainText = ecGetPlainText;
ECAsymCrypto.prototype.GenPlainText = ecGenPlainText;

ECAsymCrypto.prototype.SetCipherTextM1 = ecSetCipherTextM1;
ECAsymCrypto.prototype.GetCipherTextM1 = ecGetCipherTextM1;
ECAsymCrypto.prototype.SetCipherTextM2 = ecSetCipherTextM2;
ECAsymCrypto.prototype.GetCipherTextM2 = ecGetCipherTextM2;


ECAsymCrypto.prototype.GetRestoredText = ecGetRestoredText;

ECAsymCrypto.prototype.SetSignatureR = ecSetSignatureR;
ECAsymCrypto.prototype.GetSignatureR = ecGetSignatureR;
ECAsymCrypto.prototype.SetSignatureS = ecSetSignatureS;
ECAsymCrypto.prototype.GetSignatureS = ecGetSignatureS;

ECAsymCrypto.prototype.Encrypt = ecEncrypt;
ECAsymCrypto.prototype.Decrypt = ecDecrypt;

ECAsymCrypto.prototype.GenerateSignature = ecGenerateSignature;
ECAsymCrypto.prototype.GenerateSignatureParametric = ecGenerateSignatureWithParams;

ECAsymCrypto.prototype.VerifySignature  =  ecVerifySignature;
ECAsymCrypto.prototype.VerifySignatureParametric  =  ecVerifySignatureWithParams;


export {ECAsymCrypto};