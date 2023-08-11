import { Crypto, Transaction } from 'apl-web-crypto';
import { ONE_APL } from 'constants/constants';

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

    const unsignedTransactionData = await Transaction.sendNotSign(data);
    const sendData = {secretPhrase: secretPhrase };
    const signedResponse = await Transaction.processOfflineSign(sendData, unsignedTransactionData);
    
    const dataTransaction = {
        requestType: 'broadcastTransaction',
        transactionBytes: signedResponse.transactionBytes,
    }
    return await Transaction.send(dataTransaction);
}

export const sendCurrencyTransferOffline = async ({secretPhrase, feeATM,...initialData}) => {
    const publicKey = Crypto.getPublicKey(secretPhrase);

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