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

class SendApollo extends React.Component {
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
        };

        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

        this.props.submitForm(null, null, values, 'sendMoney')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Transaction has been submitted!', null, 5000);
                }
            });
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

    calculateFee = () => {

        this.setState({
            ...this.state,
            feeATM: 1
        })
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                         submitForm, values, addValue, removeValue, setValue, getFormState
                    }) => (
                        <form className="modal-form modal-send-apollo" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Send Apollo</p>
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
                                <div className="form-group row form-group-white mb-15">
                                    <label htmlFor="amountATM" className="col-sm-3 col-form-label">
                                        Amount
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                              id="amountATM"
                                              className="form-control"
                                              field="amountATM"
                                              placeholder="Amount"
                                              type={"number"}
                                              aria-describedby="amountText" />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="amountText">Apollo</span>
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
                                            <label className="form-check-label custom-control-label" htmlFor="doNotBroadcast">
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

                                <div className="form-group row form-group-white mb-15">
                                    <label htmlFor="feeATM" className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={async () => {
                                                const formState = getFormState();
                                                const fee = await this.props.calculateFeeAction({
                                                    recipient: formState.values.recipient,
                                                    amountATM: formState.values.amountATM,
                                                    publicKey: this.props.publicKey,
                                                    feeATM: 0
                                                });

                                                if (fee) {
                                                    setValue("feeATM", fee.transactionJSON.feeATM / 100000000);
                                                }
                                            }
                                            }
                                            style={{paddingRight: 0}}
                                            className="calculate-fee"
                                        >
                                                Calculate</span>
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <Text defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                              id="feeATM"
                                              field="feeATM"
                                              className="form-control"
                                              value={this.state.feeATM}
                                              placeholder="Amount"
                                              type={"number"}
                                              aria-describedby="feeATMText" />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="feeATMText">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label htmlFor="secretPhrase" className="col-sm-3 col-form-label">
                                        Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text id="secretPhrase" className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                    </div>
                                </div>
                                {this.state.advancedState && <div className="form-group row form-group-white mb-15">
                                    <label htmlFor="secretPhrase" className="col-sm-3 col-form-label">
                                        Deadline (hours)
                                    </label>
                                    <div className="col-sm-9 mb-0 no-left-padding">
                                        <Text id="secretPhrase" className="form-control" field="deadline" placeholder="Deadline" type={'number'}/>
                                    </div>
                                </div>}
                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorrect passphrase.
                                    </InfoBox>
                                }
                                {
                                    this.state.recipientStatus &&
                                    <InfoBox danger mt>
                                        Incorrect recipient.
                                    </InfoBox>
                                }
                                {
                                    this.state.amountStatus &&
                                    <InfoBox danger mt>
                                        Missing amount.
                                    </InfoBox>
                                }
                                {
                                    this.state.feeStatus &&
                                    <InfoBox danger mt>
                                        Missing fee.
                                    </InfoBox>
                                }

                                <AdvancedSettings
                                    setValue={setValue}
                                    advancedState={this.state.advancedState}
                                />

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
                                        Submit
                                    </button>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
                                    >
                                        {this.state.advancedState ? "Basic" : "Advanced"}
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
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    sendTransaction: (requestParams) => dispatch(sendTransactionAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApollo);
