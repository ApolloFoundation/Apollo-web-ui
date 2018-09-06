import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import {Checkbox, Form, Text, TextArea} from 'react-form'
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import submitForm from "../../../helpers/forms/forms";

class TransactionOperations extends React.Component {
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

    handleFormSubmit = async values => {
        switch (this.state.activeTab) {
            case 0:
                if (!values.signPassphrase) {
                    NotificationManager.error("Passphrase is required", "Error", 5000);
                    break;
                }
                if (!await this.props.validatePassphrase(values.signPassphrase)) {
                    NotificationManager.error("Passphrase not valid", "Error", 5000);
                    break;
                }
                const toSend = {
                    unsignedTransactionBytes: values.signBytes,
                    unsignedTransactionJSON: values.signJson,
                    validate: values.signValidate,
                    publicKey: this.props.publicKey,
                    feeATM: 0,
                    ecBlockId: 11255812614937856744,
                    ecBlockHeight: 0
                };
                this.props.submitForm(null, null, toSend, "signTransaction")
                    .done(res => {
                        if (res.errorCode) {
                            NotificationManager.error(res.errorDescription, "Error", 5000)
                        } else {
                            NotificationManager.success("Transaction signed!", null, 5000);
                        }
                    });
                break;
            case 1://broadcast
                const toSendBroadcast = {
                    transactionBytes: values.broadcastBytes,
                    transactionJSON: values.broadcastJson,
                    feeATM: 0,
                    publicKey: this.props.publicKey,
                    ecBlockId: 11255812614937856744,
                    ecBlockHeight: 0
                };
                this.props.submitForm(null, null, toSendBroadcast, "broadcastTransaction")
                    .done(res => {
                        if (res.errorCode) {
                            NotificationManager.error(res.errorDescription, "Error", 5000)
                        } else {
                            NotificationManager.success("Transaction broadcasted!", null, 5000);
                        }
                    });
                break;
            case 2:
                const toSendParse = {
                    transactionBytes: values.parseBytes,
                    transactionJSON: values.parseJson,
                    feeATM: 0,
                    random: Math.random()
                };
                this.props.submitForm(null, null, toSendParse, "parseTransaction")
                    .done(res => {
                        if (res.errorCode) {
                            NotificationManager.error(res.errorDescription, "Error", 5000)
                        } else {
                            NotificationManager.success("Transaction parsed!", null, 5000);
                        }
                    });
                break;
            case 3:
                const toSendCalculate = {
                    unsignedTransactionBytes: values.calculateBytes,
                    unsignedTransactionJSON: values.calculateJson,
                    signatureHash: values.calculateHash,
                    feeATM: 0,
                    random: Math.random()
                };
                this.props.submitForm(null, null, toSendCalculate, "calculateFullHash")
                    .done(res => {
                        if (res.errorCode) {
                            NotificationManager.error(res.errorDescription, "Error", 5000)
                        } else {
                            NotificationManager.success("Hash calculated", null, 5000);
                        }
                    });
                break;
        }
    };

    render() {
        return (
            <div className="modal-box wide">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    <p>Transaction Operations</p>
                                </div>

                                <div className="form-tabulator active">
                                    <div className="form-tab-nav-box justify-left">
                                        <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 0
                                        })}>
                                            <p>Sign transaction</p>
                                        </a>
                                        <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 1
                                        })}>
                                            <p>Broadcast transaction</p>
                                        </a>
                                        <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 2
                                        })}>
                                            <p>Parse transaction</p>
                                        </a>
                                        <a onClick={(e) => this.handleTab(e, 3)} className={classNames({
                                            "form-tab": true,
                                            "active": this.state.activeTab === 3
                                        })}>
                                            <p>Calculate full hash</p>
                                        </a>
                                    </div>

                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <div className="input-group-app block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Unsigned Transaction Bytes</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="textarea" field={'signBytes'}
                                                              placeholder="Unsigned Transaction Bytes"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Unsigned Transaction JSON</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} field={'signJson'}
                                                              placeholder="Unsigned Transaction JSON"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Validate</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                              field="signValidate"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Passphrase</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text type="password" field={'signPassphrase'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Generate
                                            </button>
                                            <a onClick={() => this.props.closeModal()}
                                               className="btn btn-right round round-top-left">
                                                Cancel
                                            </a>
                                        </div>
                                    </div>
                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <div className="input-group-app block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Transaction Bytes</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'broadcastBytes'}
                                                              placeholder="Signed Transaction Bytes"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Signed Transaction JSON</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text rows={5} type="text" field={'broadcastJson'}
                                                          placeholder="Signed Transaction JSON"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Generate
                                            </button>
                                            <a onClick={() => this.props.closeModal()}
                                               className="btn btn-right round round-top-left">
                                                Cancel
                                            </a>
                                        </div>
                                    </div>
                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 2
                                    })}>

                                        <div className="input-group-app block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Transaction Bytes</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'parseBytes'}
                                                              placeholder="Transaction Bytes"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Transaction JSON</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text rows={5} type="text" field={'parseJson'}
                                                          placeholder="Transaction JSON"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Generate
                                            </button>
                                            <a onClick={() => this.props.closeModal()}
                                               className="btn btn-right round round-top-left">
                                                Cancel
                                            </a>
                                        </div>
                                    </div>
                                    <div className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 3
                                    })}>
                                        <div className="input-group-app block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Unsigned Transaction Bytes</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'calculateBytes'}
                                                              placeholder="Unsigned Transaction Bytes"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Unsigned Transaction JSON</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'calculateJson'}
                                                              placeholder="Unsigned Transaction JSON"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group-app block offset-bottom">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Signature Hash</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={1} type="text" field={'calculateHash'}
                                                              placeholder="Signature Hash"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Generate
                                    </button>
                                    <a onClick={() => this.props.closeModal()}
                                       className="btn btn-right round round-top-left">
                                        Cancel
                                    </a>
                                </div>
                            </div>
                        </form>
                    )}
                >
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey

});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),

});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionOperations);
