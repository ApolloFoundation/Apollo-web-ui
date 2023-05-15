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

class AddMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = async values => {
        if (!values.phrase) {
            NotificationManager.error("Secret phrase is required", "Error", 5000);
        }

        const toSend = {
            property: values.property,
            interval: values.interval,
            secretPhrase: values.phrase,
            feeATM: 0,
            amount: values.amount,
            threshold: values.threshold,
        };
        const res = await this.props.submitForm( toSend, "startFundingMonitor");
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
                                    <p>Start Funding Monitor</p>
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
                                            <div className="input-wrapper">
                                                <Text field="property" placeholder="Property" />
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
                                                <Text field="amount" placeholder="Amount" type="tel"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Threshold</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="threshold" placeholder="Threshold" type="tel"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Interval</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="interval" placeholder="Interval" type="tel"/>
                                            </div>
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
                                                <Text field="phrase" type="password"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box right-conner align-right form-footer">
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
                                        Start
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
});

const mapDispatchToProps = dispatch => ({
                    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMonitor);
