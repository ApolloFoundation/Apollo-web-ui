import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import converters from '../../../../helpers/converters'
import crypto from '../../../../helpers/crypto/crypto'

const mapStateToProps = state => ({
    account: state.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    tryToDecryptMessage: (data, options) => dispatch(crypto.tryToDecryptMessage(data, options))
});

class MessageItem extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        message: null
    };

    componentWillReceiveProps(newState) {
        console.log(newState.account);

        if (newState.account && newState.account.passPhrase && this.props.attachment && !this.props.attachment.encryptedMessageHash && !this.props.attachment.message) {
            this.decryptMessage(this.props, newState.account.passPhrase)
        }
    }

    decryptMessage = async (data, passPhrase) => {
        const privateKey = converters.hexStringToByteArray(crypto.getPrivateKey(passPhrase));

        let publicKey = await crypto.getPublicKey("15004901071642240111", true);
        console.log(this.props.account);
        console.log(publicKey);

        publicKey =  converters.hexStringToByteArray(publicKey);

        console.log(publicKey);
        const sharedKey = crypto.getSharedSecret(privateKey, publicKey);
        //
        // console.log(sharedKey);
        // console.log(data);
        //
        let decrypted = this.props.tryToDecryptMessage(data, {sharedKey: sharedKey});
        console.log(decrypted);
        // decrypted = converters.hexStringToString(decrypted.message);
        // console.log(this.state.attachments);
        // console.log(decrypted);
    };

    render (){
        return (
            <tr>
                <td className="blue-link-text">{this.props.timestamp}</td>
                <td className="blue-link-text">
                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.sender)}>{this.props.senderRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.recipient)}>{this.props.recipientRS}</a>
                </td>
                {
                    this.props.attachment.encryptedMessage &&
                    <td><i className="zmdi zmdi-alert-triangle"/>&nbsp;<span>Message is encrypted.</span></td>

                }

                {
                    !this.props.attachment.encryptedMessage &&
                    <td>{this.props.attachment.message}</td>
                }
                <td className="align-right">
                    <div className="btn-box inline">
                        <a
                            onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                            className="btn primary blue static"
                        >
                            Decrypt
                        </a>
                    </div>
                </td>
            </tr>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);