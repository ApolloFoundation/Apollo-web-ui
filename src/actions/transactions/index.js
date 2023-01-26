/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
// import fetch from 'fetch';
import config from '../../config';
import queryString from 'query-string';
import {NotificationManager} from "react-notifications";
import {processElGamalEncryption} from "../crypto";
import cancelAxiosRequest from '../../helpers/cancelToken';

export function getTransactionsAction(requestParams) {
    return async (dispatch) => {
        const requestType = (requestParams.passphrase || requestParams.secretPhrase) ? 'getPrivateBlockchainTransactions' : 'getBlockchainTransactions';

        let params = requestParams;
        if (params.passphrase) params.passphrase = await processElGamalEncryption(params.passphrase);
        else if (params.secretPhrase) params.secretPhrase = await processElGamalEncryption(params.secretPhrase);

        if (!params.requestType) {
            delete params.requestType;
        }

        return axios.get(config.api.serverUrl, {
            params : {
                requestType: requestType,
                ...params
            },
            cancelToken: cancelAxiosRequest.token,
        }).then((res) => {
            return res.data
        }).catch(() => {

        })
    }
}

export const getTransactionsID = (requestParams) => {
	return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
		return axios.get(config.api.serverUrl, {
			params: {
				requestType: 'getAccountId',
				...data
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

export const getPrivateTransactions = async (requestParams) => {
    let data = requestParams;
    const requestType = (data.passphrase || data.secretPhrase) ? 'getPrivateBlockchainTransactions' : 'getBlockchainTransactions';
    if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
    else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

    return axios.get(config.api.serverUrl, {
        params : {
            requestType: requestType,
            ...data
        }
    })
        .then((res) => {
            return res.data
        })
        .catch(() => {

        })
}

export function getTransactionAction(requestParams) {
    return async () => {
        let data = requestParams;
        const requestType = (data.passphrase || data.secretPhrase) ? 'getPrivateTransaction' : 'getTransaction';
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        return axios.get(config.api.serverUrl, {
            params : {
                requestType: requestType,
                ...data
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                } else {
                    if (res.data.errorCode === 5) {
                        NotificationManager.error('To view all the information, the entire blockchain database should be downloaded.', 'Error', 5000);
                    } else {
                        NotificationManager.error(res.data.errorDescription, 'Error', 5000);
                    }
                    return null;
                }
            })
            .catch(() => {

            })
    }
}

export const getMixerAccount = mixerUrl => {
    return axios.get(mixerUrl)
        .then((res) => {
            res = res.data;

            if (res && res.id && res.rsId && res.publicKey) {
                return res
            } else {
                throw "Mixer error. Bad credentials.";
            }
        })
        .catch((e) => {
            throw e;
        })
}

export function getPrivateTransactionAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getPrivateTransaction',
                ...data
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
export function sendTransactionAction(requestParams) {
    return async (getState) => {
        const { account } = getState();
        let data = {
            ...requestParams,
            requestType: 'sendMoney',
            deadline: '1440',
            amountATM: requestParams.amountATM * account.decimals,
            feeATM: requestParams.feeATM * account.decimals,
        };
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        fetch(config.api.serverUrl + "requestType=sendMoney",{
            method: 'POST',
            body: JSON.stringify(data)
        })

            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                return;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function sendPrivateTransaction(requestParams) {
    return async (getState) => {
        const { account } = getState();
        let data = {
            ...requestParams,
            requestType: 'sendMoneyPrivate',
            deadline: '1440',
            amountATM: requestParams.amountATM * account.decimals,
            feeATM: requestParams.feeATM * account.decimals,
        };
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        return axios.post(config.api.serverUrl + queryString.stringify(data))
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    console.log(err);
                })
    }
}

export function formatTransactionType(str){
    str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
    str = str.toLowerCase(); //add space between camelCase text
    return (str).toUpperCase();
}

export const getPhasingTransactionVoters = (requestParams) => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getPhasingPolls',
            countVotes: true,
            ...requestParams
        }
    })
        .then((res)  => {
            return res.data;
        })
}
