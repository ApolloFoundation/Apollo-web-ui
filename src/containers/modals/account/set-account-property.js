/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import AccountRS from '../../components/account-rs';
import {Form, Text, TextArea} from 'react-form';

import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import {calculateFeeAction} from "../../../actions/forms";
import ModalFooter from '../../components/modal-footer'

import BackForm from '../modal-form/modal-form-container';

class SetAccountProperty extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    async handleFormSubmit(values) {
        const res = await this.props.submitForm( values, 'setAccountProperty');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Account property has been saved!', null, 5000);
        }
    }

    calculateFee = async (values, setValue) => {
        const requestParams = {
            requestType: 'setAccountProperty',
            deadline: '1440',
            property: values.property,
            recipient: values.recipient,
            publicKey: this.props.publicKey,
            feeATM: 0
        };
        const fee = await this.props.calculateFeeAction(requestParams);

        if (!fee.errorCode) {
            setValue("feeAPL", fee.transactionJSON.feeATM / 100000000);
        } else {
            NotificationManager.error(fee.errorDescription, 'Error', 5000);
        }
    };

    render() {
        const contactRS = this.props.modalData.setterRS || this.props.modalData.recipientRS || '';
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState, getValue }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>{this.props.modalData.property ? 'Update' : 'Set'} Account Property</p>
                                </div>
                                {contactRS !== '' ?
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Recipient
                                        </label>
                                        <div className="col-sm-9">
                                            <span>
                                                {(this.props.modalData && this.props.modalData.setterRS) ? this.props.modalData.setterRS : ''}
                                            </span>
                                        </div>
                                    </div>
                                    :
                                    <div className="input-group-app form-group mb-15 display-block inline user">
                                        <div className="row form-group-white">
                                            <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                            </label>
                                            <div className="col-sm-9">
                                                <div className="iconned-input-field">
                                                    <AccountRS
                                                        field={'recipient'}
                                                        setValue={setValue}
                                                        value={getValue('recipient') || ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Property
                                    </label>
                                    <div className="col-sm-9">
                                        {
                                            (this.props.modalData && this.props.modalData.property) ?
                                            <span>
                                                {(this.props.modalData && this.props.modalData.property) ? this.props.modalData.property : ''}
                                            </span> :
                                            <InputForm
                                                field="property"
                                                placeholder="Property"
                                                setValue={setValue}
                                            />
                                        }
                                        <span>
                                            {(this.props.modalData && this.props.modalData.property) ? this.props.modalData.property : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Value
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="value"
                                            defaultValue={(this.props.modalData && this.props.modalData.value) ? this.props.modalData.value : ''}
                                            placeholder="Value"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={() => this.calculateFee(getFormState().values, setValue)}
                                            style={{paddingRight: 0}}
                                            className="calculate-fee"
                                        >
                                            Calculate
                                        </span>
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <InputForm
                                            field="feeAPL"
                                            placeholder="Minimum fee"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                {/*<div className="form-group row form-group-white mb-15">*/}
                                    {/*<label className="col-sm-3 col-form-label">*/}
                                        {/*Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>*/}
                                    {/*</label>*/}
                                    {/*<div className="col-sm-9">*/}
                                        {/*<Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Set Property
                                    </button>
                                    <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                </div>
                            </div>

                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetAccountProperty);
