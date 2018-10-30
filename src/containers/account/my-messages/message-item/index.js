/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import converters from '../../../../helpers/converters'
import crypto from '../../../../helpers/crypto/crypto'
import {formatTimestamp} from "../../../../helpers/util/time";
import {readMessageAction} from '../../../../actions/messager/'
import submitForm from "../../../../helpers/forms/forms";

const mapStateToProps = state => ({
    account: state.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    tryToDecryptMessageAPL: (data, options) => dispatch(crypto.tryToDecryptMessageAPL(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class MessageItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
    }

    componentWillReceiveProps(newState) {
        this.tryToDecrypt(newState);
    };

    componentDidMount() {
        this.tryToDecrypt(this.props);
    }

    tryToDecrypt = (newState) => {
        if (newState.account.passPhrase) {
            this.decryptMessage(this.props, newState.account.passPhrase)
        }

        // if (newState.account && newState.account.passPhrase && this.props.attachment && !this.props.attachment.encryptedMessageHash && !this.props.attachment.message) {
        // }
    };

    decryptMessage = async (data, passPhrase) => {
        if (passPhrase) {
            const message = await this.props.submitForm( {
                requestType: 'readMessage',
                secretPhrase: passPhrase,
                transaction: this.props.transaction,
                createNoneTransactionMethod: true
            }, 'readMessage')

            if (message) {
                this.setState({
                    message: message.decryptedMessage
                });
            }
        }
    };

    render (){
        return (
            <tr>
                <td className="blue-link-text">{this.props.formatTimestamp(this.props.timestamp)}</td>
                <td className="blue-link-text">
                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.sender)}>{this.props.senderRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.recipient)}>{this.props.recipientRS}</a>
                </td>
                <td>
                    {
                        this.props.attachment.message !== 'undefined' && this.props.attachment.message
                    }
                    {
                        this.state.message &&
                        this.props.attachment.message === 'undefined' &&
                        <div><i className="zmdi zmdi-lock-open"/>&nbsp;&nbsp;&nbsp;<span>{this.state.message}</span></div>

                    }
                    {
                        this.state.message &&
                        !this.state.message.length &&
                        this.props.attachment.message === 'undefined' &&
                        <div>Empty message</div>
                    }
                    {
                        this.props.attachment.encryptedMessage &&
                        !this.props.attachment.encryptedMessageHash &&
                        !this.state.message &&
                        this.props.attachment.message === 'undefined' &&
                        <div><i className="zmdi zmdi-alert-triangle"/>&nbsp;&nbsp;&nbsp;<span>Message is encrypted.</span></div>
                    }
                    {
                        (this.props.attachment.encryptedMessageHash || (this.props.attachment.encryptedMessage && this.props.attachment.encryptedMessageHash)) && !this.state.message  &&
                        <div><i className="zmdi zmdi-scissors"/>&nbsp;&nbsp;&nbsp;<span>Message is prunated.</span></div>

                    }
                    {
                        !this.props.attachment.encryptedMessage &&
                        !this.props.attachment.encryptedMessageHash &&
                        !this.state.message &&
                        this.props.attachment.message === 'undefined' &&
                        <div>{this.props.attachment.message}</div>
                    }
                </td>
                <td className="align-right btn-box inline">
                    {
                        this.props.attachment.encryptedMessage &&
                        !this.props.attachment.encryptedMessageHash &&
                        this.props.attachment.message === 'undefined' &&
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                            className="btn primary blue static"
                        >
                            Decrypt
                        </a>

                    }
                </td>
            </tr>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);