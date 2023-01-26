/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";
import {formatTimestamp} from "helpers/util/time";
import submitForm from "helpers/forms/forms";
import { getPassPhraseSelector } from 'selectors';

const MessageItem = (props) => {
    const dispatch = useDispatch();
    const passPhrase = useSelector(getPassPhraseSelector);
    // don't use previous
    const [state, setState] = useState({
        message: null
    });

    const handleFormatTime = (time) => dispatch(formatTimestamp(time))

    const handleAccountInfoModal = (address) => () => 
        dispatch(setBodyModalParamsAction('INFO_ACCOUNT', address));

    const handleDecryptMessage = () => dispatch(setBodyModalParamsAction('DECRYPT_MESSAGES'));

    const decryptMessage = useCallback(async (passPhrase) => {
        if (passPhrase) {
            const { decryptedMessage } = await dispatch(submitForm.submitForm({
                requestType: 'readMessage',
                secretPhrase: passPhrase,
                transaction: props.transaction,
                createNoneTransactionMethod: true
            }, 'readMessage'));

            if (decryptedMessage) {
                setState({
                    message: decryptedMessage
                });
            }
        }
    }, [dispatch]);

    useEffect(() => {
        decryptMessage(passPhrase);
    }, [passPhrase]);

        const {
            publicMessage,
            decryptedMessage,
            recipient,
            sender,
            recipientRS,
            senderRS,
            timestamp,
            isDescrypted,
        } = props;
        
    return (
        <tr>
            <td className="blue-link-text">{handleFormatTime(timestamp)}</td>
            <td className="blue-link-text">
                <a onClick={handleAccountInfoModal(sender)}>{senderRS}</a>
            </td>
            <td className="blue-link-text">
                <a onClick={handleAccountInfoModal(recipient)}>{recipientRS}</a>
            </td>
            <td>
                {
                    publicMessage && 
                    publicMessage
                }
                {
                    isDescrypted && 
                    decryptedMessage && 
                    decryptedMessage !== 'false' && 
                    <div>
                        <i className="zmdi zmdi-lock-open"/>&nbsp;&nbsp;&nbsp;<span>{decryptedMessage}</span>
                    </div>
                }
                {
                    isDescrypted &&
                    !publicMessage &&
                    !decryptedMessage &&
                    <div>
                        <i className="zmdi zmdi-alert-triangle"/>&nbsp;&nbsp;&nbsp;
                        <span>Empty Message.</span>
                    </div>
                }
                {
                    isDescrypted &&
                    !publicMessage &&
                    !decryptedMessage &&
                    <div>
                        <i className="zmdi zmdi-scissors"/>
                            &nbsp;&nbsp;&nbsp;
                        <span>Message is pruned.</span>
                    </div>
                }
                {
                    !isDescrypted &&
                    !publicMessage &&
                    !decryptedMessage &&
                    <>
                        <a
                            onClick={handleDecryptMessage}
                        >
                            < i className="zmdi zmdi-lock" />
                        </a>
                        <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                    </>
                }
                
            </td>
            <td className="align-right">
                <div className='btn-box inline'>
                    {
                        !isDescrypted &&
                        !publicMessage &&
                        !decryptedMessage &&
                        <button
                            type='button'
                            onClick={handleDecryptMessage}
                            className="btn btn-default"
                        >
                            Decrypt
                        </button>
                    }
                </div>
            </td>
        </tr>
    );
}

export default MessageItem;
