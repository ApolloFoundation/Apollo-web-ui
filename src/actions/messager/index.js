/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config'
import converters from '../../helpers/converters';
import submitForm from '../../helpers/forms/forms'
import state from '../../store'
import {processElGamalEncryption} from "../crypto";
import cancelAxiosRequest from '../../helpers/cancelToken';

export function getMessages (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainTransactions',
                type: 1,
                subtype: 0,
                ...reqParams
            },
            cancelToken: cancelAxiosRequest.token,
        })
            .then((res) => {
                if(!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

export function getChats (reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainTransactions',
                type: 1,
                subtype: 0,
                ...reqParams
            }
        })
            .then((res) => {
                if(!res.data.errorMessage) {
                    return dispatch(getMessengerChats(res.data.transactions));
                }
            })
    }
}

export function readMessageAction (reqParams) {
    return async () => {
        let data = reqParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'readMessage',
                ...data
            }
        })
            .then((res) => {
                if(!res.data.errorMessage) {
                    return res.data;
                }
            })
    }
}

export function getPrunableMessageAction(reqParams) {
    return async () => {
        let data = reqParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPrunableMessage',
                ...data
            }
        })
    }
}

export function getPrunableMessagesAction(reqParams) {
    return async () => {
        let data = reqParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPrunableMessages',
                ...data
            }
        })
    }
}

export function getMessengerChats(transactions) {
    return (dispatch, getState) => {
        const account = getState().account;

        let allTransactions = transactions;
        let result = [];

        if (transactions) {
            allTransactions.map((el) => {

                if (el.recipient === account.account) {
                    result.push({
                        account: el.sender,
                        accountRS: el.senderRS,
                    })
                }
                if (el.sender === account.account) {
                    result.push({
                        account: el.recipient,
                        accountRS: el.recipientRS,
                    })
                }
            });
        }

        return removeDuplicates(result, 'account');
    }
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

const isTextMessage = function(transaction) {
    return transaction.goodsIsText || transaction.attachment.messageIsText ||
        (transaction.attachment.encryptedMessage && transaction.attachment.encryptedMessage.isText) ||
        (transaction.attachment.encryptToSelfMessage && transaction.attachment.encryptToSelfMessage.isText);
};

export function getMessage(message) {
    return dispatch  => {
        var decoded = {};
        decoded.format = "";
        if (!message.attachment) {

        } else if (message.attachment.encryptedMessage) {
            try {

                decoded.extra = "encrypted";
                if (!isTextMessage(message)) {
                    decoded.format = "<i class='fa fa-database'></i>&nbsp";
                }
            } catch (err) {
                if (err.errorCode && err.errorCode == 1) {
                    decoded.extra = "to_decrypt";
                } else {
                }
            }
        } else if (message.attachment.message) {
            if (!message.attachment["version.Message"] && !message.attachment["version.PrunablePlainMessage"]) {
                try {

                    decoded.message = converters.hexStringToStringAPL(message.attachment.message);
                } catch (err) {
                    //legacy
                    if (message.attachment.message.indexOf("feff") === 0) {
                        decoded.message = converters.convertFromHex16APL(message.attachment.message);
                    } else {
                        decoded.message = converters.convertFromHex8APL(message.attachment.message);
                    }
                }
            } else {
                if (message.attachment.message) {
                    decoded.message = message.attachment.message;
                    decoded.format  = 'plain_text';
                } else {
                    decoded.format = "<i class='fa fa-database'></i>&nbsp";
                }
            }
        } else if (message.attachment.messageHash || message.attachment.encryptedMessageHash) {
            // Try to read prunable message but do not retrieve it from other nodes

            decoded.format = "encrypted";
            // getPrunableMessageAction({ transaction: message.transaction, retrieve: "false"})


        } else {
            decoded.message = "message_empty";
        }
        if (!Object.keys(decoded).length) {
            if (!decoded.message) {
                decoded.message = "message_empty";
            }
            decoded.message = converters.addEllipsisAPL(String(decoded.message).escapeHTML().nl2br(), 100);
        }
        if (decoded.extra === "encrypted") {
            decoded.format = "encrypted";
        } else if (decoded.extra === "decrypted") {
            decoded.format = "decrypted";
        } else if (decoded.extra === "pruned") {
            decoded.format = "pruned";
        }


        decoded.hash = message.attachment.messageHash || message.attachment.encryptedMessageHash;
        return decoded;
    }
}

export const getChatsAction = (account) => (dispatch) => {
    return axios.get(config.api.serverUrl,{
        params: {
            requestType: 'getChats',
            ...account
        }
    })
        .then(res =>  {
            if (!res.data.errorCode) {
                return res.data
            }
        })
}


export const getChatHistoryAction = (requestParams) => (dispatch, getState) => {
    const {account} = getState();

    return axios.get(config.api.serverUrl, {
        params: {
            requestType: "getChatHistory",
            account1: account.accountRS,
            account2: requestParams.account2
        }
    })
        .then((res) => {
            if (!res.data.errorCode) {
                return res.data
            } else {
                return {chatHistory: []};
            }
        })
}

const decryptMessage = (data, passPhrase) => {
    return async(dispatch) => {
        return dispatch(submitForm.submitForm({
            requestType: 'readMessage',
            secretPhrase: passPhrase,
            transaction: data.transaction,
            createNoneTransactionMethod: true
        }, 'readMessage'))
    }
};


const formatMessages = transactionMessages => {
    return (dispatch, getState) => {
        const {account} = getState();
        
        const messages = transactionMessages.map(el => {
            return dispatch(decryptMessage(el, account.passPhrase))
        });

        return Promise.all(messages)
            .then(resolved => {return resolved.map((el, index) => {
                    const transactionData = transactionMessages[index];
                    const publicMessage = 
                        transactionData.attachment.message && transactionData.attachment.message !== 'undefined' ? transactionData.attachment.message : 
                        null;

                    const transaction = transactionData.transaction;
                    const messageIsPrunable = el?.messageIsPrunable;
                    const decryptedMessage = el?.decryptedMessage;
                    const {recipient, sender, recipientRS ,senderRS, timestamp, attachment} = transactionData;
                
                    return {
                        publicMessage,
                        decryptedMessage,
                        messageIsPrunable,
                        transaction,
                        recipient,
                        sender,
                        recipientRS,
                        senderRS,
                        timestamp,
                        attachment,
                        isDescrypted : !!account.passPhrase
                    }
                })
            })
    }
}


const handleAcount = (fn, params) => (dispatch, getState) =>{
    const handleAccounChange = () => {

        const {account : {account}} = getState()
    
        if (account) {
            dispatch(fn(params));
            unsubscribe();
        }
    }
    
    const unsubscribe = state.subscribe(handleAccounChange);

    return handleAccounChange
}

export const getMessagesPerpage = (reqPrams) => {
    return async (dispatch, getState, ) => {
        const {account: {account}} = getState();

        if (!account) {
            return dispatch(handleAcount(getMessagesPerpage, {firstIndex: 0, lastIndex: 15}));
        }
    
        const messages = await dispatch(getMessages({...reqPrams, account}));
        
        if (messages && !messages.errorCode) {
            dispatch({
                type: 'SET_MESSAGES',
                payload: await dispatch(formatMessages(messages.transactions))
            });
            return messages.transactions;
        }
    }
};

export const resetChatHistory = (reqParams) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_CHAT_MESSAGES',
            payload: null
        });
    }
};

export const getChatHistory = (reqParams) => {
    return (dispatch, getState) => {
        const {account: {account}} = getState();

        if (!reqParams) {
            dispatch({
                type: 'SET_CHAT_MESSAGES',
                payload: null
            });
            return;
        }

        if (!account) {
            return dispatch(handleAcount(getChatHistory, reqParams));
        }

        dispatch(getChatHistoryAction(reqParams))
            .then(messages => {
                if (messages && messages.chatHistory) {
                    dispatch(formatMessages(messages.chatHistory))
                    .then(data => {
                        if (messages && !messages.errorCode) {
                            dispatch({
                                type: 'SET_CHAT_MESSAGES',
                                payload: data
                            })
                        }
                    })
                }
            })
    }
};

export const getChatsPerPage = () => {
    return (dispatch, getState) => {
        const {account: {account}} = getState();

        if (!account) {
            return dispatch(handleAcount(getChatsPerPage, {account}));
        }

        dispatch(getChatsAction({account}))
            .then(chats => {
                chats = chats.chats.filter(el => {
                    return el.account !== '0'
                });

                dispatch({
                    type: 'SET_CHATS',
                    payload: chats
                })
            })
    }
}