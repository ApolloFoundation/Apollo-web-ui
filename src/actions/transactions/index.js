import axios from 'axios/index';
import config from '../../config';

export function getTransactionsAction(requestParams) {
    return dispatch => {
        console.log(requestParams);
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getBlockchainTransactions',
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

// amountATM
//     :
//     "200000000"
// attachment
//     :
// {version.OrdinaryPayment: 0}
// block
//     :
//     "16817821422271285564"
// blockTimestamp
//     :
//     14960918
// confirmations
//     :
//     8590
// deadline
//     :
//     60
// ecBlockHeight
//     :
//     86454
// ecBlockId
//     :
//     "1359678790941391174"
// feeATM
//     :
//     "100000000"
// fullHash
//     :
//     "88173e27119f3a707099281160a4e9dee8d1f71df017b14e6bca3fb1a4fec0fa"
// height
//     :
//     87185
// phased
//     :
//     false
// recipient
//     :
//     "4143214544167197317"
// recipientRS
//     :
//     "APL-4QN7-PNGP-SZFV-59XZL"
// sender
//     :
//     "3958487933422064851"
// senderPublicKey
//     :
//     "4652486ebc271520d844e5bdda9ac243c05dcbe7bc9b93807073a32177a6f73d"
// senderRS
//     :
//     "APL-PP8M-TPRN-ARNZ-5ZUVF"
// signature
//     :
//     "5ab49baa4e7a7180077c6819e0f8d1965a371b436d1a9a62db3c5df15458a70ad8d3ce4ed7a42a617d70561c642680f7611b334754fe42732fe036ffe269dc43"
// signatureHash
//     :
//     "3b347f35c86454fe126438bdf1e6c554839751ce8480a761edcc75507e5ac8f4"
// subtype
//     :
//     0
// timestamp
//     :
//     14960412
// transaction
//     :
//     "8086950976918787976"
// transactionIndex
//     :
//     48
// type
//     :
//     0

export function getTransactionAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getTransaction',
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}