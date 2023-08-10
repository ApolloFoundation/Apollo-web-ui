import { Crypto, Transaction } from 'apl-web-crypto';
import { ONE_APL } from 'constants/constants';

export const sendMoneyOfflineTransaction = async ({
    secretPhrase,
    amountATM,
    feeATM,
    deadline = 1440,
    recipient,
}) => {
    const publicKey = Crypto.getPublicKey(secretPhrase);

    const data = {
        publicKey,
        requestType: 'sendMoney',
        amountATM: amountATM * ONE_APL,
        feeATM: feeATM * ONE_APL,
        deadline,
        recipient,
        secretPhrase
    };

    const signedResponse = await Transaction.sendWithOfflineSign(data)
    
    const dataTransaction = {
        requestType: 'broadcastTransaction',
        transactionBytes: signedResponse.transactionBytes,
    }
    return await Transaction.send(dataTransaction);
}

export const sendCurrencyTransferOffline = async ({secretPhrase, feeATM,...initialData}) => {
    const publicKey = Crypto.getPublicKey(secretPhrase);

    const data = {
        ...initialData,
        publicKey,
        requestType: 'transferCurrency',
        deadline: 1440,
        feeATM: feeATM * ONE_APL,
        secretPhrase,
    };

    const signedResponse = await Transaction.sendWithOfflineSign(data)
    
    const dataTransaction = {
        requestType: 'broadcastTransaction',
        transactionBytes: signedResponse.transactionBytes,
    }
    return await Transaction.send(dataTransaction);
}