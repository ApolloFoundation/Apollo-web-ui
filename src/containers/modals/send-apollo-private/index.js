/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
	setModalData,
	setBodyModalParamsAction,
	setAlert,
	openPrevModal,
	saveSendModalState
} from '../../../modules/modals';
import {sendPrivateTransaction} from '../../../actions/transactions';
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import crypto from  '../../../helpers/crypto/crypto';
import {calculateFeeAction} from "../../../actions/forms";
import classNames from 'classnames';

import {Form, Text} from 'react-form';
import InfoBox from '../../components/info-box';
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer';

import BackForm from '../modal-form/modal-form-container';

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
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
        


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

        if (!isPassphrase) {
            values.passphrase = values.secretPhrase;
            values.sender = this.props.account;
            delete values.secretPhrase;
        }

        this.setState({
            isPending: true
        });

        const privateTransaction = await this.props.sendPrivateTransaction(values);

        if (privateTransaction) {
            if (privateTransaction.errorCode) {
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


    render() {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState, getValue
                             }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                    }
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
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    field={'recipient'}
                                                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                                                    setValue={setValue}
                                                    value={getValue('recipient') || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                </BackForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
	modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    sendPrivateTransaction: (requestParams) => dispatch(sendPrivateTransaction(requestParams)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
	openPrevModal: () => dispatch(openPrevModal()),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApolloPrivate);
