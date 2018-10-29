/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, setAlert} from '../../../modules/modals';
import {sendTransactionAction} from '../../../actions/transactions';
import {calculateFeeAction} from "../../../actions/forms";
import AdvancedSettings from '../../components/advanced-transaction-settings';
import classNames from 'classnames';
import crypto from  '../../../helpers/crypto/crypto';
import InputMask from 'react-input-mask';
import AccountRS from '../../components/account-rs';

import {Form, Text, TextArea, Checkbox} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

class AddMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    handleFormSubmit = async values => {
        console.warn("values", values);
        if (!values.phrase) {
            NotificationManager.error("Passphrase is a required field", "Error", 5000);
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
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Start Funding Monitor</p>
                                </div>

                                <InfoBox danger mt>
                                    Your passphrase will be sent to the server!
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
                                                <Text field="amount" placeholder="Amount" type="number"/>
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
                                                <Text field="threshold" placeholder="Threshold" type="number"/>
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
                                                <Text field="interval" placeholder="Interval" type="number"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group-app offset-top display-block inline">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <Text field="phrase" type="password"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>
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

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMonitor);
