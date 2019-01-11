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
import crypto from  '../../../helpers/crypto/crypto';
import AccountRS from '../../components/account-rs';

import {Form, Text, TextArea, Checkbox} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import ModalFooter from '../../components/modal-footer'
import FeeCalc from '../../components/form-components/fee-calc'

class LeaseBalance extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        if (!values.recipient) {
            this.setState({
                ...this.props,
                recipientStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                recipientStatus: false
            })
        }
        if (!values.feeATM) {
            this.setState({
                ...this.props,
                feeStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                feeStatus: false
            })
        }

        this.setState({
            isPending: true
        })

        const lease = await this.props.submitForm( values,'leaseBalance');

        if (lease) {
            if (lease.errorCode) {
                this.setState({
                    isPending: false
                })
                NotificationManager.error(lease.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Lease has been submitted', null, 5000);
                this.props.setBodyModalParamsAction(null, {});
            }
        }
    }

    handleAdvancedState() {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    }

    handleChange = (event) => {
        if (event.target) {
            var value = event.target.value;
            var newState = {
                mask: 'APL-****-****-****-*****',
                value: value.toUpperCase()
            };

            if (/^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(value)) {
                newState.value = 'APL-****-****-****-*****';
            }
            this.setState(newState);
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
                                    <p>Lease your balance</p>
                                </div>
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-white">
                                        <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                            Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    value={''}
                                                    field={'recipient'}
                                                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-1">
                                    <label className="col-sm-3 col-form-label">
                                        Period
                                    </label>
                                    <div className="col-sm-9">
                                        <Text className="form-control" type={'tel'} field="period" placeholder="Period" />
                                    </div>
                                </div>
                                <div className="mobile-class row form-group-grey">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-sub-title no-margin">
                                            A lease of 65,535 blocks is about 46 days.
                                        </div>
                                    </div>
                                </div>
                                <div className="mobile-class form-group-grey row mb-15">
                                    <div className="col-sm-9 offset-sm-3">
                                        <a className="no-margin btn static blue"
                                           onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE')}>
                                            Private transaction
                                        </a>
                                    </div>
                                </div>
                                <div className="mobile-class row mb-15 form-group-white">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-2">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      field="isMessage"/>
                                            <label className="form-check-label custom-control-label">
                                                Add a message?
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    getFormState().values.isMessage &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Message
                                        </label>
                                        <div className="col-sm-9">
                                            <TextArea className="form-control" placeholder="Message" field="message" cols="30" rows="5" />
                                        </div>
                                    </div>
                                }
                                <FeeCalc
                                    setValue={setValue}
                                    values={getFormState().values}
                                    requestType={'leaseBalance'}
                                />
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                <AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                    advancedState={this.state.advancedState}
                                />

                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 47.7
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> :
                                            <button

                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Send
                                            </button>
                                    }

                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

                                </div>
                                {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                    {/*<a*/}
                                        {/*onClick={this.handleAdvancedState}*/}
                                        {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                        {/*style={{left : 0, right: 'auto'}}*/}
                                    {/*>*/}
                                        {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                    {/*</a>*/}
                                {/*</div>*/}

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
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    sendTransaction: (requestParams) => dispatch(sendTransactionAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    sendLeaseBalance: (requestParams) => dispatch(crypto.sendLeaseBalance(requestParams)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaseBalance);
