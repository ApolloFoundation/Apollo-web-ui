import axios from 'axios';
import config from '../../config'
import crypto from '../../helpers/crypto/crypto';
import converters from '../../helpers/converters';

export function getMessages (reqParams) {
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
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'readMessage',
                ...reqParams
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
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPrunableMessage',
                ...reqParams
            }
        })
    }
}

export function getPrunableMessagesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPrunableMessages',
                ...reqParams
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
            allTransactions.map((el, index) => {

                if (el.recipient === account.account) {
                    result.push({
                        account: el.sender,
                        accountRS: el.senderRS,
                        messages : allTransactions.filter((transaction) => {

                            return transaction.sender === el.recipient || transaction.sender === el.sender
                        })
                    })
                }
                if (el.sender === account.account) {
                    result.push({
                        account: el.recipient,
                        accountRS: el.recipientRS,
                        messages : allTransactions.filter((transaction) => {
                            return transaction.sender === el.recipient || transaction.sender === el.sender
                        })
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

                    decoded.message = converters.hexStringToString(message.attachment.message);
                } catch (err) {
                    //legacy
                    if (message.attachment.message.indexOf("feff") === 0) {
                        decoded.message = converters.convertFromHex16(message.attachment.message);
                    } else {
                        decoded.message = converters.convertFromHex8(message.attachment.message);
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
            decoded.message = converters.addEllipsis(String(decoded.message).escapeHTML().nl2br(), 100);
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

const isTextMessage = function(transaction) {
    return transaction.goodsIsText || transaction.attachment.messageIsText ||
        (transaction.attachment.encryptedMessage && transaction.attachment.encryptedMessage.isText) ||
        (transaction.attachment.encryptToSelfMessage && transaction.attachment.encryptToSelfMessage.isText);
};