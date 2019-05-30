/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import QRCode from "qrcode.react";
import {setModalData} from '../../../modules/modals';
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import submitForm from "../../../helpers/forms/forms";
import {signBytesArrayAPL} from "../../../helpers/converters";
import TabulationBody from "../../components/tabulator/tabuator-body";
import TabContaier from "../../components/tabulator/tab-container";
import ModalBody from "../../components/modals/modal-body";
import TextualInputComponent from "../../components/form-components/textual-input";
import CustomTextArea from "../../components/form-components/text-area";
import {CheckboxFormInput} from "../../components/form-components/check-button-input";
import InputForm from "../../components/input-form";
import InfoBox from '../../components/info-box';

class TransactionOperations extends React.Component {
    state = {
        activeTab: 0,
        showSignature: false,
        signedBytesSignature: "",
        generatedQr: "",
    };

    handleTab = (e, index) => {
        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    handleFormSubmit = async values => {
        let res = null;
        switch (this.state.activeTab) {
            case 0:
                if (!values.secretPhrase) {
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
                        secretPhrase: values.secretPhrase,
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
                    const signature = signBytesArrayAPL(values.signBytes, values.secretPhrase);
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
            default:
                break;
        }
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Transaction Operations'}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
                isXWide
            >
                <TabulationBody
                    className={'p-0'}
                    onChange={this.handleTab}
                >
                    <TabContaier sectionName={'Sign transaction'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            isDisabe2FA
                            isPour
                            isDisableSecretPhrase
                            submitButtonName={'Sign Transaction'}
                        >
                            <CustomTextArea
                                label={'Unsigned Transaction Bytes'}
                                field={'signBytes'}
                                placeholder={'Unsigned Transaction Bytes'}
                            />
                            <CustomTextArea
                                label={'Unsigned Transaction JSON'}
                                field={'signJson'}
                                placeholder={'Unsigned Transaction JSON'}
                            />
                            <CheckboxFormInput
                                checkboxes={[
                                    {
                                        field: 'signValidate',
                                        label: 'Validate',
                                    }
                                ]}
                            />
                            <div className="form-group mb-15">
                                <label>
                                    Secret phrase
                                </label>
                                <div>
                                    <InputForm
                                        isPlain
                                        className={'form-control'}
                                        type="password"
                                        field="secretPhrase"
                                        placeholder="Secret Phrase"
                                    />
                                </div>
                            </div>
                            {this.state.showSignature && (
                                <React.Fragment>
                                    <InfoBox info>
                                        <div className="token word-brake">
                                            {this.state.signedBytesSignature}
                                        </div>
                                    </InfoBox>
                                    <div className='form-group mb-15'>
                                        <label>Transaction Signature QR code</label>
                                        <div>
                                            <QRCode
                                                value={this.state.signedBytesSignature}
                                                size={100}
                                            />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </ModalBody>
                    </TabContaier>
                    <TabContaier sectionName={'Broadcast transaction'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            isDisabe2FA
                            isPour
                            isDisableSecretPhrase
                            submitButtonName={'Broadcast'}
                        >
                            <CustomTextArea
                                label={'Transaction Bytes'}
                                field={'broadcastBytes'}
                                placeholder={'Signed Transaction Bytes'}
                            />
                            <CustomTextArea
                                label={'Signed Transaction JSON'}
                                field={'broadcastJson'}
                                placeholder={'Signed Transaction JSON'}
                            />
                        </ModalBody>
                    </TabContaier>
                    <TabContaier sectionName={'Parse transaction'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            isDisabe2FA
                            isPour
                            isDisableSecretPhrase
                            submitButtonName={'Parse Transaction'}
                        >
                            <CustomTextArea
                                label={'Transaction Bytes'}
                                field={'parseBytes'}
                                placeholder={'Signed Transaction Bytes'}
                            />
                            <CustomTextArea
                                label={'Transaction JSON'}
                                field={'parseJson'}
                                placeholder={'Transaction JSON'}
                            />
                        </ModalBody>
                    </TabContaier>
                    <TabContaier sectionName={'Calculate full hash'}>
                        <ModalBody
                            closeModal={this.props.closeModal}
                            handleFormSubmit={(values) => this.handleFormSubmit(values)}
                            isDisabe2FA
                            isPour
                            isDisableSecretPhrase
                            submitButtonName={'Calculate Full Hash'}
                        >
                            <CustomTextArea
                                label={'Unsigned Transaction Bytes'}
                                field={'calculateBytes'}
                                placeholder={'Unsigned Transaction Bytes'}
                            />
                            <CustomTextArea
                                label={'Unsigned Transaction JSON'}
                                field={'calculateJson'}
                                placeholder={'Unsigned Transaction JSON'}
                            />
                            <TextualInputComponent
                                label={'Signature Hash'}
                                field="calculateHash"
                                placeholder="Signature Hash"
                                type={"text"}
                            />
                        </ModalBody>
                    </TabContaier>
                </TabulationBody>
            </ModalBody>
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
