/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import { setModalData } from '../../../modules/modals';
import classNames from 'classnames';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import { Checkbox, Form, Text, TextArea } from 'react-form'
import { NotificationManager } from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import submitForm from "../../../helpers/forms/forms";
import { signBytesArrayAPL } from "../../../helpers/converters";
import QRCode from "qrcode.react";
import AccountRS from "../../components/account-rs";

class TransactionOperations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            showSignature: false,
            signedBytesSignature: "",
            generatedQr: "",
            form: {}
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
        let res = null;
        switch (this.state.activeTab) {
            case 0:
                if (!values.signPassphrase) {
                    NotificationManager.error("Secret phrase is required", "Error", 5000);
                    break;
                }
                this.setState({
                    showSignature: false
                });
                if (values.signJson) {
                    const toSend = {
                        unsignedTransactionJSON: values.signJson,
                        validate: values.signValidate,
                        publicKey: this.props.publicKey,
                        secretPhrase: values.signPassphrase,
                        feeATM: 0,
                        ecBlockHeight: 0
                    };
                    res = await this.props.submitForm(toSend, "signTransaction");
                    if (res.errorCode) {
                        NotificationManager.error(res.errorDescription, "Error", 5000)
                    } else {
                        NotificationManager.success("Transaction signed!", null, 5000);
                    }
                } else if (values.signBytes) {
                    const signature = signBytesArrayAPL(values.signBytes, values.signPassphrase);
                    this.state.form.setValue('signedBytesSignature', signature);
                    this.setState({
                        showSignature: true,
                        signedBytesSignature: signature,
                    });
                }
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
                res = await this.props.submitForm(toSendBroadcast, "broadcastTransaction");
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    NotificationManager.success("Transaction broadcasted!", null, 5000);
                }
                break;
            case 2:
                const toSendParse = {
                    transactionBytes: values.parseBytes,
                    transactionJSON: values.parseJson,
                    feeATM: 0,
                    random: Math.random()
                };
                res = await this.props.submitForm(toSendParse, "parseTransaction");
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    NotificationManager.success("Transaction parsed!", null, 5000);
                }
                break;
            case 3:
                const toSendCalculate = {
                    unsignedTransactionBytes: values.calculateBytes,
                    unsignedTransactionJSON: values.calculateJson,
                    signatureHash: values.calculateHash,
                    feeATM: 0,
                    random: Math.random()
                };
                res = await this.props.submitForm(toSendCalculate, "calculateFullHash");
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, "Error", 5000)
                } else {
                    NotificationManager.success("Hash calculated", null, 5000);
                }
                break;
        }
    };

    getFormApi = formApi => {
        this.setState({ form: formApi })
    };

    render() {
        return (
            <div className="modal-box wide">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    getApi={this.getFormApi}
                    render={({
                        submitForm,
                        setValue
                    }) => (
                            <form className="modal-form" onSubmit={submitForm}>
                                <div className="form-group-app media-tab">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close" /></a>

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
                                            <div className="input-group-app align-top form-group mb-15 pl-0 display-block inline user">
                                                <div className="row form-group-white">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Unsigned Transaction Bytes <i className="zmdi zmdi-upload" />
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <TextArea rows={5} type="textarea" field={'signBytes'}
                                                            placeholder="Unsigned Transaction Bytes" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group-app align-top form-group mb-15 pl-0 display-block inline user">
                                                <div className="row form-group-white">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Unsigned Transaction JSON <i className="zmdi zmdi-portable-wifi-changes" />
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <TextArea rows={5} field={'signJson'}
                                                            placeholder="Unsigned Transaction JSON" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mobile-class row mb-15 form-group-white">
                                                <div className="col-md-9 offset-md-3 pl-0">
                                                    <div className="form-check custom-checkbox single">
                                                        <Checkbox style={{ display: 'inline-block' }} type="checkbox"
                                                            field="signValidate" />
                                                        <label className="form-check-label custom-control-label">
                                                            Validate
                                                    </label>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="input-group-app form-group mb-15 pl-0 display-block inline user">
                                                <div className="row form-group-white">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Secret phrase <i className="zmdi zmdi-portable-wifi-changes" />
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <Text type="password" field={'signPassphrase'} />
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.showSignature &&
                                                <React.Fragment>
                                                    <div className={'input-group-app block offset-bottom'}>
                                                        <div className={'row form-group-white'}>
                                                            <label className="col-sm-3 col-form-label">Sinature</label>
                                                            <div className='col-md-9'>
                                                                <TextArea
                                                                    rows="5"
                                                                    field={'signedBytesSignature'}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='block'>
                                                        <div className='row form-group-white'>
                                                            <label className="col-sm-3 col-form-label">Transaction Signature QR code</label>
                                                            <div className='col-md-9'>
                                                                <QRCode
                                                                    value={this.state.signedBytesSignature}
                                                                    size={128}
                                                                    bgColor={"#000000"}
                                                                    fgColor={"#fff"}
                                                                    level={"L"}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }

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
                                                            placeholder="Signed Transaction Bytes" />
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
                                                            placeholder="Signed Transaction JSON" />
                                                    </div>
                                                </div>
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
                                                            placeholder="Transaction Bytes" />
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
                                                            placeholder="Transaction JSON" />
                                                    </div>
                                                </div>
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
                                                            placeholder="Unsigned Transaction Bytes" />
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
                                                            placeholder="Unsigned Transaction JSON" />
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
                                                            placeholder="Signature Hash" />
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
                                            {
                                                this.state.activeTab === 0 &&
                                                'Sign Transaction'
                                            }
                                            {
                                                this.state.activeTab === 1 &&
                                                'Broadcast'
                                            }
                                            {
                                                this.state.activeTab === 2 &&
                                                'Parse Transaction'
                                            }
                                            {
                                                this.state.activeTab === 3 &&
                                                'Calculate Full Hash'
                                            }
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
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),

});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionOperations);
