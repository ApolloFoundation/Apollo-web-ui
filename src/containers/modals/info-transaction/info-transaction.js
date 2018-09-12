import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import classNames from 'classnames';
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import {formatTransactionType} from "../../../actions/transactions";

class InfoLedgerTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    componentWillReceiveProps(newState) {
        this.setState({
            transaction: newState.modalData
        }, () => {
            if (this.state.transaction.privateTransaction && this.state.transaction.privateTransaction.encryptedTransaction) {
                var options = {
                    publicKey  :  converters.hexStringToByteArray(this.state.transaction.privateTransaction.serverPublicKey),
                    privateKey :  converters.hexStringToByteArray(this.state.transaction.privateKey),
                };

                const sharedKey  = new Uint8Array(crypto.getSharedSecretJava(
                    options.privateKey,
                    options.publicKey
                ));

                options.sharedKey = sharedKey;

                var decrypted =  crypto.decryptData(this.state.transaction.privateTransaction.encryptedTransaction, options);
                decrypted = decrypted.message;

                decrypted = converters.hexStringToString(decrypted);
                decrypted = decrypted.slice(0, decrypted.lastIndexOf('}') + 1);
                decrypted = JSON.parse(decrypted);
                this.setState({
                    transaction: decrypted
                })
            }
        })
    }

    componentDidMount() {
        if (this.state.transaction) {
            if (this.state.transaction.encryptedTransaction) {
                var options = {
                    publicKey  :  converters.hexStringToByteArray(this.props.publicKey),
                    privateKey :  converters.hexStringToByteArray(this.props.privateKey),
                };

                options.sharedKey = this.props.sharedKey;

                var decrypted =  crypto.decryptData(this.props.transaction.encryptedTransaction, options);
                decrypted = decrypted.message;

                decrypted = converters.hexStringToString(decrypted);
                decrypted = decrypted.slice(0, decrypted.lastIndexOf('}') + 1);
                decrypted = JSON.parse(decrypted);
                this.setState({
                    transaction: decrypted
                })
            }
        }
    }

    render() {
        return (
            <div className="modal-box wide">
                {
                    this.state.transaction && !this.state.transaction.privateTransaction &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title">
                                <p>Transaction</p>
                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <span className="pre">Info</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <span className="pre">Actions</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Transactions Details</span>
                                    </a>

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            {
                                                this.state.transaction && this.props.constants.transactionTypes &&
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>Type:</td>
                                                        <td>{formatTransactionType(this.props.constants.transactionTypes[this.state.transaction.type].subtypes[this.state.transaction.subtype].name)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>From:</td>
                                                        <td>{this.state.transaction.senderRS}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>To:</td>
                                                        <td>{this.state.transaction.recipientRS}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    {
                                        this.state.transaction &&
                                        <div className="flexible-grid">
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', this.state.account.accountRS)}
                                                className="btn btn-primary blue static"
                                            >
                                                Send Apollo
                                            </a>
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', this.state.account.accountRS)}
                                                className="btn btn-primary blue static"
                                            >
                                                Send a message
                                            </a>
                                            <a
                                                onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', this.state.account.accountRS)}
                                                className="btn btn-primary blue static"
                                            >
                                                Add as contact
                                            </a>
                                            <a className="btn btn-primary blue static">Send currency to sender</a>
                                            <a className="btn btn-primary blue static">Send a message to sender</a>
                                            <a className="btn btn-primary blue static">Apptove transaction</a>
                                            <a className="btn btn-primary blue static">Extend data lifetime</a>
                                        </div>
                                    }

                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Sender public key:</td>
                                                    <td>{this.state.transaction.senderPublicKey}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature:</td>
                                                    <td>{this.state.transaction.senderRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Fee ATM:</td>
                                                    <td>{this.state.transaction.feeATM / 100000000}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction index:</td>
                                                    <td>?</td>
                                                </tr>
                                                <tr>
                                                    <td>Confirmations:</td>
                                                    <td>{this.state.transaction.confirmations}</td>
                                                </tr>
                                                <tr>
                                                    <td>Full Hash:</td>
                                                    <td>{this.state.transaction.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Type:</td>
                                                    <td>{this.state.transaction.type}</td>
                                                </tr>
                                                <tr>
                                                    <td>Subtype:</td>
                                                    <td>{this.state.transaction.subtype}</td>
                                                </tr>
                                                <tr>
                                                    <td>Version:</td>
                                                    <td>{this.state.transaction.version}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phased:</td>
                                                    <td>{this.state.transaction.phased}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block id:</td>
                                                    <td>{this.state.transaction.ecBlockId}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature hash:</td>
                                                    <td>{this.state.transaction.signatureHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sender RS:</td>
                                                    <td>{this.state.transaction.senderRS}</td>
                                                </tr>
                                                {
                                                    this.state.transaction.amountATM &&
                                                    <tr>
                                                        <td>Amount ATM:</td>
                                                        <td>{this.state.transaction.amountATM / 100000000}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td>Sender:</td>
                                                    <td>{this.state.transaction.senderRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block height:</td>
                                                    <td>{this.state.transaction.ecBlockHeight}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block:</td>
                                                    <td>{this.state.transaction.block}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block timestamp:</td>
                                                    <td>{this.state.transaction.blockTimestamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Deadline:</td>
                                                    <td>{this.state.transaction.deadline}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td>{this.state.transaction.timestamp}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </form>
                }

            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    constants: state.account.constants
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoLedgerTransaction);
