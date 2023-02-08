/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';
import {processElGamalEncryption} from "../crypto";

export function getAccountLedgerAction(requestParams) {
    return async () => {

        let data = requestParams;
        const condition = data.passphrase || data.secretPhrase;
        const requestType = (condition) ? 'getPrivateAccountLedger' : 'getAccountLedger';

        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        return axios.get(config.api.serverUrl, {
            params: {
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
}

export function getLedgerEntryAction(requestParams) {
    return async () => {
        let data = { ...requestParams };
        if (data.secretPhrase) {
            data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        }
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: (data.secretPhrase) ? 'getPrivateAccountLedgerEntry' : 'getAccountLedgerEntry',
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