import { Crypto, Transaction } from 'apl-web-crypto';
import { ONE_APL } from 'constants/constants';
import LocalCrypto from '../crypto/crypto';
import converters from '../converters';

// check user secretPhase and compare account RS from publicKey and from request
// return publicKey
const checkAccountForOfflineSignAndPublicKey = (secretPhrase, accountRS, appPassPhraseFromStore) => {

    if (!secretPhrase) throw new Error('Secret phrase is empty');

    if (!accountRS) throw new Error('Set sender account');

    if(appPassPhraseFromStore && secretPhrase !== appPassPhraseFromStore) {
        throw new Error('Incorrect secret phrase')
    }

    const publicKey = Crypto.getPublicKey(secretPhrase);

    const userFromPublicKey = Crypto.getAccountIdFromPublicKey(publicKey, true);

    if (accountRS !== userFromPublicKey) {
        throw new Error('Incorrect secret phrase')
    }
    return publicKey;
}

export const sendMoneyOfflineTransaction = async (
    {
        secretPhrase,
        amountATM,
        feeATM,
        deadline = 1440,
        recipient,
        add_message,
        encrypt_message,
        permanent_message,
        message,
    },
    accountRS,
    appPassPhraseFromStore
) => {
    const publicKey = checkAccountForOfflineSignAndPublicKey(secretPhrase, accountRS, appPassPhraseFromStore);

    const data = {
        publicKey,
        requestType: 'sendMoney',
        amountATM: amountATM * ONE_APL,
        feeATM: feeATM * ONE_APL,
        deadline,
        recipient,
    };


    if (add_message && encrypt_message) {
        const privateKey = Crypto.getPrivateKey(secretPhrase);

        const encrypted = LocalCrypto.encryptDataAPL(converters.stringToByteArray(message), {
            privateKey,
            publicKey,
        })

        data.encryptedMessageData = converters.byteArrayToHexString(encrypted.data);
        data.encryptedMessageNonce = converters.byteArrayToHexString(encrypted.nonce);

        if (recipient === accountRS) {
            data.messageToEncryptToSelfIsText = "true"
        } else {
            data.messageToEncryptIsText = "true"
        }
    }

    if (add_message) {
        data.message = message;
    }

    if (add_message && permanent_message) {
        data.permanent_message = permanent_message;
    }

    const unsignedTransactionData = await Transaction.sendNotSign(data);
    const sendData = {secretPhrase: secretPhrase };
    const signedResponse = await Transaction.processOfflineSign(sendData, unsignedTransactionData);
    
    const dataTransaction = {
        requestType: 'broadcastTransaction',
        transactionBytes: signedResponse.transactionBytes,
    }
    return await Transaction.send(dataTransaction);
}

export const sendCurrencyTransferOffline = async (
    {secretPhrase, feeATM,...initialData},
    accountRS,
    appPassPhraseFromStore
) => {
    const publicKey = checkAccountForOfflineSignAndPublicKey(secretPhrase, accountRS, appPassPhraseFromStore);

    const unsignedTransactionData = await Transaction.sendNotSign({
        ...initialData,
        publicKey,
        requestType: 'transferCurrency',
        deadline: 1440,
        feeATM: feeATM * ONE_APL,
    });

    const sendData = {secretPhrase: secretPhrase };
    const signedResponse = await Transaction.processOfflineSign(sendData, unsignedTransactionData);
    
    const dataTransaction = {
        requestType: 'broadcastTransaction',
        transactionBytes: signedResponse.transactionBytes,
    }
    return await Transaction.send(dataTransaction);
}