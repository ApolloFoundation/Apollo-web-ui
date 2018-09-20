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
    tryToDecryptMessage: (data, options) => dispatch(crypto.tryToDecryptMessage(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
});

class MessageItem extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        message: null
    };

    componentWillReceiveProps(newState) {
        this.tryToDecrypt(newState);
    };

    componentDidMount() {
        this.tryToDecrypt(this.props);
    }

    tryToDecrypt = (newState) => {
        this.decryptMessage(this.props, newState.account.passPhrase)

        // if (newState.account && newState.account.passPhrase && this.props.attachment && !this.props.attachment.encryptedMessageHash && !this.props.attachment.message) {
        // }
    };

    decryptMessage = async (data, passPhrase) => {


        const message = await this.props.submitForm(null, null, {
            requestType: 'readMessage',
            secretPhrase: passPhrase,
            transaction: this.props.transaction
        }, 'readMessage')

        if (message) {
            this.setState({
                message: message.decryptedMessage
            });
        }

        // const privateKey = converters.hexStringToByteArray(crypto.getPrivateKey(passPhrase));
        // let publicKey = await crypto.getPublicKey(this.props.sender, true);
        //
        // publicKey =  converters.hexStringToByteArray(publicKey);
        //
        // const sharedKey = crypto.getSharedSecret(privateKey, publicKey);
        // let decrypted = this.props.tryToDecryptMessage(data, {sharedKey: sharedKey});
        // if (decrypted) {
        //     this.setState({
        //         message: decrypted.message
        //     })
        // }
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
                {
                    this.state.message &&
                    <td><i className="zmdi zmdi-lock-open"/>&nbsp;<span>{this.state.message}</span></td>

                }
                {
                    this.state.message &&
                    !this.state.message.length &&
                    <td>Empty message</td>

                }
                {
                    this.props.attachment.encryptedMessage && !this.props.attachment.encryptedMessageHash && !this.state.message &&
                    <td><i className="zmdi zmdi-alert-triangle"/>&nbsp;<span>Message is encrypted.</span></td>
                }
                {
                    (this.props.attachment.encryptedMessageHash || (this.props.attachment.encryptedMessage && this.props.attachment.encryptedMessageHash)) && !this.state.message  &&
                    <td><i className="zmdi zmdi-scissors"/>&nbsp;<span>Message is prunated.</span></td>

                }
                {
                    !this.props.attachment.encryptedMessage && !this.props.attachment.encryptedMessageHash && !this.state.message &&
                    <td>{this.props.attachment.message}</td>
                }
                <td className="align-right">
                    <div className="btn-box inline">
                        {
                            this.state.message &&
                            <td></td>

                        }
                        {
                            this.props.attachment.encryptedMessage && !this.props.attachment.encryptedMessageHash && !this.state.message &&
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                                className="btn primary blue static"
                            >
                                Decrypt
                            </a>

                        }
                        {
                            (this.props.attachment.encryptedMessageHash || (this.props.attachment.encryptedMessage && this.props.attachment.encryptedMessageHash)) && !this.state.message  &&
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                                className="btn primary blue static"
                            >
                                Retrive
                            </a>

                        }
                        {
                            !this.props.attachment.encryptedMessage && !this.props.attachment.encryptedMessageHash && !this.state.message &&
                            <a
                                onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                                className="btn primary blue static"
                            >
                                Share
                            </a>
                        }

                    </div>
                </td>
            </tr>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);