/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';
import store from '../../store'
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


const handleAcount = (fn, params) => {    
    var handleAccounChange = () => {

        const {account : {account}} = store.getState()
        const {dispatch} = store;
    
        unsubscribe();
        dispatch(fn(params));

    }

    const unsubscribe = store.subscribe(handleAccounChange);    

    return handleAccounChange
}

export const initLedgerPage = () => {
    return async (dispatch, getState, ) => {
        const {account: { account }, ledger: { page }} = getState();
        
        if (!account) {
            setTimeout(() => {
                return handleAcount(initLedgerPage, {
                    firstIndex: 0,
                    lastIndex: 15
                })();
            }, 1000)   
        }
        
        dispatch({
            type: 'SET_PAGE',
            payload: 1
        });

        dispatch({
            type: 'SET_LEGDER',
            payload: null
        });

        const reqParams = {
            account,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        };
    
        const ledger = await dispatch(getAccountLedgerAction(reqParams));

        dispatch({
            type: 'SET_LEGDER',
            payload: ledger.entries
        })
    }
}

export const getAccountLedgerPerPage = (reqParams) => {
    return async (dispatch, getState) => {
        const {account: {passPhrase}} = getState();

        const ledger = await dispatch(getAccountLedgerAction(reqParams))

        dispatch({
            type: 'SET_LEGDER',
            payload: ledger.entries
        })
    }
}

export const paginateLedger = (page) => {
    return async (dispatch, getState) => {
        const {account: {account}} = getState();

        dispatch({
            type: 'SET_PAGE',
            payload: page
        });

        const reqParams = {
            account,
            firstIndex: page * 15 - 15,
            lastIndex: page * 15
        }

        dispatch(getAccountLedgerPerPage(reqParams))
    }
}

