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
import ModalFooter from '../../components/modal-footer';

import BackForm from '../modal-form/modal-form-container';

class DeleteAccountProperty extends React.Component {
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
        const res = await this.props.submitForm( values, 'deleteAccountProperty');
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Account property has been deleted!', null, 5000);
        }
    }

    render() {
        return (
            <div className="modal-box">

                {console.log(this.props.modalData)}
                {console.log((this.props.modalData && this.props.modalData.setterRS) ? this.props.modalData.setterRS : '')}


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
                                    <p>Delete Account Property</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Setter
                                    </label>
                                    <div className="col-sm-9">
                                        <span>
                                            {(this.props.modalData && this.props.modalData.setterRS) ? this.props.modalData.setterRS : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Recipient
                                    </label>
                                    <div className="col-sm-9">
                                        <span>
                                            {(this.props.modalData && this.props.modalData.recipientRS) ? this.props.modalData.recipientRS : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Property
                                    </label>
                                    <div className="col-sm-9">
                                        <span>
                                            {(this.props.modalData && this.props.modalData.property) ? this.props.modalData.property : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={async () => {
                                                    setValue("feeAPL", 1);
                                            }}
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


                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Delete Property
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
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountProperty);
