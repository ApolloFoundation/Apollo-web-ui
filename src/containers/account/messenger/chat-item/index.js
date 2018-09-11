import React from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";

const mapStateToProps = state => ({
    account: state.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    tryToDecryptMessage: (data, options) => dispatch(crypto.tryToDecryptMessage(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
});


class ChatItem extends React.Component {
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
        if (decrypted) {
            this.setState({
                message: decrypted.message
            })
        }
    };

    render () {
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
                            this.props.message.message && this.props.message.message
                        }
                        {
                            this.props.attachment.encryptedMessage && !this.props.attachment.encryptedMessageHash && !this.state.message && !this.props.message.message &&
                            [
                                <a
                                    onClick={() => this.props.setBodyModalParamsAction('DECRYPT_MESSAGES')}
                                    className='action'
                                >
                                    < i className="zmdi zmdi-lock" />
                                </a>,
                                <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                            ]
                        }
                        {
                            this.props.attachment.encryptedMessageHash && !this.props.message.message &&
                            [
                                <a className='action'>
                                    < i className="zmdi zmdi-scissors" />
                                </a>,
                                <span className="message-text">&nbsp;&nbsp;Message is prunated</span>
                            ]
                        }
                        {
                            this.state.message && !this.props.message.message &&
                            [
                                <a className='action'>
                                    < i className="zmdi zmdi-lock-open" />
                                </a>,
                                <span className="message-text">&nbsp;&nbsp;{this.state.message}</span>
                            ]
                        }
                    </p>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatItem);