import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import converters from '../../../../helpers/converters'
import crypto from '../../../../helpers/crypto/crypto'
import {formatTimestamp} from "../../../../helpers/util/time";

const mapStateToProps = state => ({
    account: state.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    tryToDecryptMessage: (data, options) => dispatch(crypto.tryToDecryptMessage(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
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
        console.log(newState.account.passPhrase);
        if (newState.account && newState.account.passPhrase && this.props.attachment && !this.props.attachment.encryptedMessageHash && !this.props.attachment.message) {
            this.decryptMessage(this.props, newState.account.passPhrase)
        }
    };

    decryptMessage = async (data, passPhrase) => {
        const privateKey = converters.hexStringToByteArray(crypto.getPrivateKey(passPhrase));
        let publicKey = await crypto.getPublicKey(this.props.sender, true);

        publicKey =  converters.hexStringToByteArray(publicKey);

        const sharedKey = crypto.getSharedSecret(privateKey, publicKey);
        let decrypted = this.props.tryToDecryptMessage(data, {sharedKey: sharedKey});
        this.setState({
            message: decrypted.message
        })
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