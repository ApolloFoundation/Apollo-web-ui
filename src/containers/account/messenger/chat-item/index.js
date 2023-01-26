/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames';
import {setBodyModalParamsAction} from "modules/modals";
import { getAccountSelector, getChatMessagesSelector } from 'selectors';

const mapStateToProps = state => ({
    account: getAccountSelector(state),
    messages: getChatMessagesSelector(state),
});

const mapDispatchToProps = {
    setBodyModalParamsAction,
};

const ChatItem = ({publicMessage, decryptedMessage, isDescrypted, setBodyModalParamsAction, messageFormat, attachment, account, sender}) => (
    <div className={classNames({
        'message-box': true,
        'encrypted': messageFormat === 'encrypted',
        'prunated': attachment.encryptedMessageHash,
        'outgoing': account === sender,
        'incoming': account !== sender,
    })}>
        <div className="message">
            <p>
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
                    <>
                        <a className='action'>
                            < i className="zmdi zmdi-scissors"/>
                        </a>
                        <span className="message-text">&nbsp;&nbsp;Message is prunated</span>
                    </>
                }
                {
                    !isDescrypted &&
                    !publicMessage &&
                    !decryptedMessage &&
                    <>
                        <a
                            onClick={() => setBodyModalParamsAction('DECRYPT_MESSAGES')}
                            className='action'
                        >
                            < i className="zmdi zmdi-lock"/>
                        </a>
                        <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                    </>
                }
            </p>
        </div>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ChatItem);