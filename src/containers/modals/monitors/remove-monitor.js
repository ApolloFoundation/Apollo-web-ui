/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, setAlert, saveSendModalState, openPrevModal} from '../../../modules/modals';
import {sendTransactionAction} from '../../../actions/transactions';
import {calculateFeeAction} from "../../../actions/forms";
import AdvancedSettings from '../../components/advanced-transaction-settings';
import classNames from 'classnames';
import crypto from  '../../../helpers/crypto/crypto';
import InputMask from 'react-input-mask';

import {Form, Text, TextArea, Checkbox} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

import BackForm from '../modal-form/modal-form-container';
import InputForm from "../../components/input-form";

class RemoveMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = async values => {
        console.warn("values", values);
        if (!values.phrase) {
            NotificationManager.error("Secret phrase is required", "Error", 5000);
        }

        const toSend = {
            ...values,
            property:  this.props.modalData.property,
            recipient: this.props.modalData.recipient,
        };
        const res = await this.props.submitForm( toSend, "deleteAccountProperty");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Monitor has been started!', null, 5000);
            this.props.closeModal();
            setTimeout(() => {
                this.props.modalData()
            }, 1000);
        }
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                    }
                                    <p>Remove Funding Monitor</p>
                                </div>

                                <InfoBox danger mt>
                                    Your secret phrase will be sent to the server!
                                </InfoBox>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Control Property</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper" style={{alignSelf: "center"}}>
                                                {this.props.modalData.property ? this.props.modalData.property : '?'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Amount</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                {this.props.modalData.recipient ? this.props.modalData.recipient : '?'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                            field="feeAPL"
                                            placeholder="Amount"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.props.ticker}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Secret phrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="secretPhrase" type="password"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type={'button'}
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                >
                </BackForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalsHistory: state.modals.modalsHistory,
    modalData: state.modals.modalData,
    ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoveMonitor);
