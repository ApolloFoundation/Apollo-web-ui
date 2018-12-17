/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, setAlert} from '../../../modules/modals';
import {sendPrivateTransaction, getMixerAccount} from '../../../actions/transactions';
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import crypto from  '../../../helpers/crypto/crypto';
import {calculateFeeAction} from "../../../actions/forms";
import classNames from 'classnames';
import submitForm from "../../../helpers/forms/forms";

import {Checkbox} from 'react-form';
import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer'

class SendApolloPrivate extends React.Component {
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
            feeStatus: false,
            isPrivateTransactionAlert: false,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    async handleFormSubmit(values) {
        if (!values.recipient) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Recipient not specified.', 'Error', 5000);
            return;
        }
        if (!values.amountATM) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Amount is required.', 'Error', 5000);
            return;
        }
        if (!values.feeATM) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Fee not specified.', 'Error', 5000);
            return;
        }

        if (this.state.useMixer) {
            values.messageToEncrypt = JSON.stringify({
                name: "REQUEST_MIXING",
                epicId: values.recipient,
                approximateMixingDuration: values.duration  // Minutes 
            });

            values.recipient = values.mixerAccount;
            values.recipientPublicKey = values.mixerPublicKey;
            
            delete values.mixerAccount;
        }

        this.setState({
            isPending: true
        });

        const privateTransaction = this.props.dispatch(await this.props.submitForm(values, 'sendMoneyPrivate'));

        if (privateTransaction) {
            if (privateTransaction.responseJSON && privateTransaction.responseJSON.errorCode) {
                NotificationManager.error(privateTransaction.errorDescription, 'Error', 5000);

            } else {
                NotificationManager.success('Private transaction has been submitted.', null, 5000);
                this.props.setBodyModalParamsAction(null, {});
            }
        }
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
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

    setConfirm = () => {
        this.setState({
            isPrivateTransactionAlert: true
        })
    };

    handleUseMixer = async (e) => {
        const mixerData = await getMixerAccount();
        
        const mixerAccount = mixerData.rsId;

        mixerData.rsId = mixerAccount.replace('APL-', `${this.props.accountPrefix}-`)
        this.setState({
            mixerData,
            useMixer: e
        })
    }

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
                                    <p>Send Apollo</p>
                                </div>
                                {
                                    !this.state.isPrivateTransactionAlert &&
                                    <InfoBox info>
                                        Private transactions currently protect down the the API level. Database level protection will start with Olympus 2.0 <br/>
                                        <a
                                            className={'btn static primary'}
                                            style={{background: '#fff', color: '#00C8FF'}}
                                            onClick={this.setConfirm}
                                        >
                                            I agree
                                        </a>
                                    </InfoBox>
                                }
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-white">
                                        <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                            Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <div className={`iconned-input-field ${this.state.useMixer ? 'flex-align-left' : ''}`}>
                                                <AccountRS
                                                    field={'recipient'}
                                                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                                                    setValue={setValue}
                                                /> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.useMixer &&
                                    <div className="input-group-app form-group mb-15 display-block inline user">
                                        <div className="row form-group-white">
                                            <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                Mixer account
                                            </label>
                                            <div className="col-sm-9">
                                                <div className='iconned-input-field flex-align-left'>
                                                    <Text
                                                        type="hidden"
                                                        field="mixerAccount"
                                                        defaultValue={this.state.mixerData && this.state.mixerData.rsId}
                                                    />
                                                    <Text
                                                        type="hidden"
                                                        field="mixerPublicKey"
                                                        defaultValue={this.state.mixerData && this.state.mixerData.publicKey}
                                                    />
                                                    <p>{this.state.mixerData && this.state.mixerData.rsId}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                
                                {
                                    this.state.useMixer &&
                                    <InfoBox info>
                                        Your money will be sent directly to mixer account and during estimated mixing time, money will be transmitted to recipient account.
                                    </InfoBox>
                                }
                               
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Amount
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                            field="amountATM"
                                            placeholder="Amount"
                                            type={"float"}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Apollo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mobile-class row mb-15 form-group-white">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox">
                                            <Checkbox 
                                                onChange={(e) => this.handleUseMixer(e)}
                                                className="form-check-input custom-control-input"
                                                type="checkbox"
                                                field="isMixer"
                                            />
                                            <label className="form-check-label custom-control-label">
                                                Use Mixer
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {
                                    this.state.useMixer &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Mixing time
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                            <InputForm
                                                defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                                field="duration"
                                                placeholder="Duration"
                                                type={"float"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">Seconds</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                        <span
                                            onClick={async () => {
                                                const requestParams = {
                                                    requestType: 'sendMoney',
                                                    deadline: '1440',
                                                    amountATM: parseInt(getFormState().values.amountATM) * 100000000,
                                                    recipient: getFormState().values.recipient,
                                                    publicKey: this.props.publicKey,
                                                    feeATM: 0
                                                };
                                                const fee = await this.props.calculateFeeAction(requestParams);
                                                if (!fee.errorCode) {
                                                    setValue("feeATM", fee.transactionJSON.feeATM / 100000000);
                                                } else {
                                                    NotificationManager.error(fee.errorDescription, 'Error', 5000);
                                                }
                                            }
                                            }
                                            style={{paddingRight: 0}}
                                            className="calculate-fee"
                                        >
                                            Calculate
                                        </span>
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                            field="feeATM"
                                            placeholder="Amount"
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
                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorrect secret phrase.
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
                                        className={classNames({
                                            "btn" : true,
                                            "btn-right" : true,
                                            "blue" : true,
                                            "round" : true,
                                            "round-bottom-right" : true,
                                            "blue-disabled": !this.state.isPrivateTransactionAlert
                                        })}
                                    >
                                        Send
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
    account: state.account.account,
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
    accountPrefix: state.account.constants ? state.account.constants.accountPrefix : ''
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    sendPrivateTransaction: (requestParams) => dispatch(sendPrivateTransaction(requestParams)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApolloPrivate);
