/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames';
import crypto from "../../../../helpers/crypto/crypto";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import submitForm from "../../../../helpers/forms/forms";

const mapStateToProps = state => ({
    account: state.account,
    messages: state.messages.chatMessages,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    tryToDecryptMessageAPL: (data, options) => dispatch(crypto.tryToDecryptMessageAPL(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});


class ChatItem extends React.Component {
    state = {
        message: null
    };

    componentWillReceiveProps(newProps) {
        if (newProps.account.passPhrase !== this.props.account.passPhrase) {
            this.tryToDecrypt(newProps);
        }
    }

    tryToDecrypt = (newState) => {
        if (newState.account.passPhrase) {
            this.decryptMessage(this.props, newState.account.passPhrase);
        }
    };

    decryptMessage = async (data, passPhrase) => {
        const message = await this.props.submitForm( {
            requestType: 'readMessage',
            secretPhrase: passPhrase,
            transaction: this.props.transaction,
            createNoneTransactionMethod: true
        }, 'readMessage');

        if (message) {
            this.setState({
                message: message.decryptedMessage,
            });
        }

    };

    render () {
        const {publicMessage, decryptedMessage, isDescrypted, setBodyModalParamsAction} = this.props;

        return (
            <div className={classNames({
                'message-box': true,
                'encrypted' : this.props.messageFormat === 'encrypted',
                'prunated' : this.props.attachment.encryptedMessageHash,
                'outgoing': this.props.account.account === this.props.sender,
                'incoming': this.props.account.account !== this.props.sender,
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
                                    < i className="zmdi zmdi-scissors" />
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
                                    < i className="zmdi zmdi-lock" />
                                </a>
                                <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                            </>
                        }
                    </p>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatItem);